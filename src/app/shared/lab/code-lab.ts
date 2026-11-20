import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Feedback } from '../../core/feedback/feedback';
import { safeStorage } from '../../core/storage/safe-storage';
import { BrowserFrame } from '../ui/browser-frame/browser-frame';
import { CodePanel } from '../ui/code-panel/code-panel';
import { Icon } from '../ui/icon/icon';
import { Mascot } from '../ui/mascot/mascot';
import { LabEditor } from './lab-editor';
import type { LabExercise, LabModule } from './lab-model';
import { type LabRun, checkApi, fmt, simCtx, startRun } from './lab-runtime';
import { LANE_COLORS, LabTimeline } from './lab-timeline';

type Tab = 'console' | 'timeline' | 'signals';
interface Verdict { kind: 'ok' | 'no' | 'wait'; msg: string; explain?: string }

const PREVIEW_EMPTY =
  '<p class="rxlab-empty">Chưa có giao diện. Dùng <code>mount(Component)</code> hoặc <code>ui.input()</code>, <code>ui.button()</code>, <code>ui.text()</code>… để tạo.</p>';

/** Tên export của RxJS và API Angular hay dùng (để tô màu trong editor). */
const RX_NAMES = new Set(
  'Observable Subject BehaviorSubject ReplaySubject AsyncSubject Subscription of from interval timer range defer EMPTY NEVER throwError fromEvent combineLatest forkJoin merge concat zip race partition iif lastValueFrom firstValueFrom map filter tap switchMap mergeMap concatMap exhaustMap debounceTime throttleTime distinctUntilChanged startWith scan reduce take takeUntil takeWhile skip first last delay retry catchError finalize share shareReplay withLatestFrom pairwise bufferTime toArray auditTime sampleTime timeout count max min every find isEmpty defaultIfEmpty endWith ignoreElements asyncScheduler Component Directive Pipe Injectable Service input output model inject viewChild viewChildren contentChild contentChildren mount InjectionToken'.split(' '),
);

/**
 * Code Lab: viết code thật, chạy ngay trong trang, chấm tự động.
 * Dùng chung cho mọi bài học — nội dung bài luyện được tải lười qua `load`.
 * Kết quả gồm giao diện (khung trình duyệt), Console, Timeline (marble) và bảng Signals.
 */
@Component({
  selector: 'app-code-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [LabEditor, LabTimeline, BrowserFrame, CodePanel, Icon, Mascot],
  templateUrl: './code-lab.html',
  styleUrl: './code-lab.css',
})
export class CodeLab {
  /** Tải nội dung bài luyện (dynamic import) */
  readonly load = input.required<() => Promise<LabModule>>();
  /** Khoá lưu tiến độ + code trong localStorage */
  readonly storageKey = input.required<string>();

  private readonly parent = inject(EnvironmentInjector);
  private readonly feedback = inject(Feedback);
  private readonly preview = viewChild<ElementRef<HTMLElement>>('preview');
  private readonly consoleBox = viewChild<ElementRef<HTMLElement>>('consoleBox');

  protected readonly mod = signal<LabModule | null>(null);
  protected readonly loadError = signal<string | null>(null);
  private extras: Record<string, unknown> = {};

  protected readonly exercises = computed(() => this.mod()?.exercises ?? []);
  protected readonly graded = computed(() => this.exercises().filter((e) => !e.noCheck));
  protected readonly groups = computed(() =>
    [...new Set(this.exercises().map((e) => e.group))].map((name) => ({ name, items: this.exercises().filter((e) => e.group === name) })),
  );
  protected readonly laneColors = LANE_COLORS;
  protected readonly rxNames = RX_NAMES;

  protected readonly current = signal<LabExercise | null>(null);
  protected readonly index = computed(() => (this.current() ? this.exercises().indexOf(this.current()!) : -1));
  protected readonly code = signal('');
  protected readonly run = signal<LabRun | null>(null);
  protected readonly verdict = signal<Verdict | null>(null);
  protected readonly checking = signal(false);
  protected readonly showHint = signal(false);
  protected readonly showSolution = signal(false);
  protected readonly confirmReset = signal(false);
  protected readonly tab = signal<Tab>('console');
  protected readonly done = signal(new Set<string>());
  protected readonly doneCount = computed(() => this.graded().filter((e) => this.done().has(e.id)).length);

  /** nhịp đồng hồ khi đang chạy (thanh trạng thái, timeline) */
  private readonly clock = signal(0);
  protected readonly rev = computed(() => (this.run()?.version() ?? 0) + this.clock() * 1e6);
  protected readonly lines = computed(() => {
    this.rev();
    return [...(this.run()?.lines ?? [])];
  });
  protected readonly inspect = computed(() => {
    this.rev();
    return (this.run()?.inspect ?? []).map((it) => {
      let v: string;
      try { v = fmt(untracked(() => it.read())); } catch (e) { v = '⚠ ' + (e as Error).message; }
      return { name: it.name, kind: it.kind, v };
    });
  });
  protected readonly errorLine = computed(() => {
    this.rev();
    return this.run()?.errorLine ?? null;
  });
  protected readonly hasError = computed(() => {
    this.rev();
    return !!this.run()?.errors.length;
  });
  protected readonly running = computed(() => {
    this.rev();
    return !!this.run()?.active;
  });
  protected readonly status = computed(() => {
    this.rev();
    const run = this.run();
    if (!run) return { text: 'Sẵn sàng', cls: '' };
    if (!run.active) return run.errors.length && !run.destroyed ? { text: 'Lỗi', cls: 'is-err' } : { text: 'Đã dừng', cls: '' };
    const p = run.pending();
    if (p) return { text: 'Đang chạy · ' + (run.now() / 1000).toFixed(1) + 's · ' + p + ' timer/request đang chờ', cls: 'is-run' };
    if (run.interactive()) return { text: 'Đang chờ thao tác trên giao diện…', cls: 'is-wait' };
    return { text: 'Chạy xong (không còn timer nào)', cls: 'is-done' };
  });

  private saveTimer: ReturnType<typeof setTimeout> | undefined;
  private runSeq = 0;

  constructor() {
    const tick = setInterval(() => {
      if (this.run()?.active) this.clock.update((c) => c + 1);
    }, 250);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(tick);
      clearTimeout(this.saveTimer);
      this.run()?.stop();
    });

    // tải nội dung bài luyện
    effect(() => {
      const load = this.load();
      const key = this.storageKey();
      untracked(() => void this.init(load, key));
    });

    // lưu code đang viết (debounce)
    effect(() => {
      const code = this.code();
      const ex = untracked(this.current);
      if (!ex) return;
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => safeStorage.write(this.storageKey() + '.code.' + ex.id, code), 400);
    });

    // console tự cuộn xuống cuối nếu đang ở cuối
    effect(() => {
      this.lines();
      const el = this.consoleBox()?.nativeElement;
      if (!el) return;
      const stick = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      if (stick) requestAnimationFrame(() => (el.scrollTop = el.scrollHeight));
    });
  }

  private async init(load: () => Promise<LabModule>, key: string): Promise<void> {
    try {
      const mod = await load();
      this.extras = mod.extras ? await mod.extras() : {};
      this.done.set(new Set(safeStorage.read<string[]>(key + '.done', [])));
      const last = safeStorage.read<string>(key + '.last', '');
      const first = mod.exercises.find((e) => e.id === last) ?? mod.exercises.find((e) => !e.noCheck) ?? mod.exercises[0];
      this.mod.set(mod);
      this.current.set(first);
      this.code.set(this.savedCode(first));
    } catch (e) {
      this.loadError.set((e as Error).message);
    }
  }

  private savedCode(ex: LabExercise): string {
    return safeStorage.read<string>(this.storageKey() + '.code.' + ex.id, '') || ex.starter;
  }

  protected optionLabel(ex: LabExercise): string {
    const n = this.graded().indexOf(ex);
    return (this.done().has(ex.id) ? '✓ ' : '') + (n < 0 ? '★ ' : n + 1 + '. ') + ex.title;
  }

  protected select(id: string): void {
    const ex = this.exercises().find((e) => e.id === id);
    if (!ex || ex === this.current()) return;
    this.stopAndClear();
    this.current.set(ex);
    safeStorage.write(this.storageKey() + '.last', ex.id);
    this.code.set(this.savedCode(ex));
    this.verdict.set(null);
    this.showHint.set(false);
    this.showSolution.set(false);
    this.confirmReset.set(false);
  }

  protected go(delta: number): void {
    const ex = this.exercises()[this.index() + delta];
    if (ex) this.select(ex.id);
  }

  private stopAndClear(): void {
    this.runSeq++;
    this.run()?.stop();
    this.run.set(null);
    const el = this.preview()?.nativeElement;
    if (!el) return;
    el.innerHTML = PREVIEW_EMPTY;
    el.classList.remove('is-stopped');
  }

  protected async runCode(): Promise<LabRun | null> {
    const preview = this.preview()?.nativeElement;
    if (!preview) return null;
    this.stopAndClear();
    const seq = this.runSeq;
    const run = await startRun(this.code(), { parent: this.parent, preview, extras: this.extras });
    if (seq !== this.runSeq) {
      run.stop();
      return null;
    }
    this.run.set(run);
    if (!run.active) preview.classList.add('is-stopped');
    return run;
  }

  protected stop(): void {
    const run = this.run();
    if (!run?.active) return;
    run.stop(true);
    this.preview()?.nativeElement.classList.add('is-stopped');
  }

  protected clearConsole(): void {
    const run = this.run();
    if (!run) return;
    run.lines.length = 0;
    run.touch();
  }

  protected async check(): Promise<void> {
    const ex = this.current();
    if (!ex || ex.noCheck || !ex.check || this.checking()) return;
    this.checking.set(true);
    this.verdict.set({ kind: 'wait', msg: 'Đang chạy và mô phỏng thao tác (' + ((ex.waitMs ?? 500) / 1000).toFixed(1) + 's)…' });
    try {
      const run = await this.runCode();
      if (!run) return;
      if (!run.active && run.errors.length) {
        this.verdict.set({ kind: 'no', msg: 'Code có lỗi cú pháp, xem Console.' });
        return;
      }
      ex.simulate?.(simCtx(run));
      await new Promise((r) => setTimeout(r, ex.waitMs ?? 500));
      if (this.run() !== run || this.current() !== ex) {
        this.verdict.set(null);
        return;
      }
      let res;
      try {
        res = ex.check(checkApi(run), this.code());
      } catch (e) {
        res = { ok: false, msg: 'Lỗi khi chấm: ' + (e as Error).message };
      }
      if (res.ok) {
        const first = !this.done().has(ex.id);
        this.done.update((s) => new Set(s).add(ex.id));
        safeStorage.write(this.storageKey() + '.done', [...this.done()]);
        this.verdict.set({ kind: 'ok', msg: res.msg, explain: ex.explain });
        if (first) {
          const all = this.doneCount() === this.graded().length;
          const title = this.mod()?.title ?? 'Lab';
          this.feedback.toast(all ? 'Bạn đã làm hết ' + this.graded().length + ' bài của ' + title + '!' : 'Lab: "' + ex.title + '" đúng rồi!', 'celebrate');
          this.feedback.celebrate(all ? 'big' : 'small');
        }
      } else {
        this.verdict.set({ kind: 'no', msg: res.msg });
      }
    } finally {
      this.checking.set(false);
    }
  }

  protected useSolution(): void {
    const sol = this.current()?.solution;
    if (sol) this.code.set(sol);
  }

  protected reset(): void {
    const ex = this.current();
    if (!ex) return;
    if (!this.confirmReset()) {
      this.confirmReset.set(true);
      setTimeout(() => this.confirmReset.set(false), 3000);
      return;
    }
    this.confirmReset.set(false);
    this.code.set(ex.starter);
  }
}
