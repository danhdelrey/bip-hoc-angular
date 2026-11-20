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
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Feedback } from '../../../../core/feedback/feedback';
import { safeStorage } from '../../../../core/storage/safe-storage';
import { BrowserFrame } from '../../../../shared/ui/browser-frame/browser-frame';
import { CodePanel } from '../../../../shared/ui/code-panel/code-panel';
import { Icon } from '../../../../shared/ui/icon/icon';
import { Mascot } from '../../../../shared/ui/mascot/mascot';
import { LAB_EXERCISES, type LabExercise } from './lab-exercises';
import { LabEditor } from './lab-editor';
import { type LabRun, checkApi, fmt, simCtx, startRun } from './lab-runtime';
import { LANE_COLORS, LabTimeline } from './lab-timeline';

type Tab = 'console' | 'timeline' | 'signals';
interface Verdict { kind: 'ok' | 'no' | 'wait'; msg: string; explain?: string }

const KEY = 'bip-rxjs-lab';
const PREVIEW_EMPTY =
  '<p class="rxlab-empty">Chưa có giao diện. Dùng <code>ui.input()</code>, <code>ui.button()</code>, <code>ui.text()</code>, <code>ui.list()</code>… để tạo.</p>';

/** Tên export của RxJS (để tô màu operator trong editor) — cùng bản rxjs 7 với sandbox. */
const RX_NAMES = new Set(
  'Observable Subject BehaviorSubject ReplaySubject AsyncSubject Subscription of from interval timer range defer EMPTY NEVER throwError fromEvent combineLatest forkJoin merge concat zip race partition iif lastValueFrom firstValueFrom map filter tap switchMap mergeMap concatMap exhaustMap debounceTime throttleTime distinctUntilChanged startWith scan reduce take takeUntil takeWhile skip first last delay retry catchError finalize share shareReplay withLatestFrom pairwise bufferTime toArray auditTime sampleTime timeout pluck mapTo count max min every find isEmpty defaultIfEmpty endWith ignoreElements materialize observeOn subscribeOn asyncScheduler animationFrameScheduler'.split(' '),
);

/**
 * RxJS + Signal Lab: viết code thật, chạy ngay trong trang, chấm tự động.
 * Kết quả gồm giao diện (khung trình duyệt), Console, Timeline (marble) và bảng Signals.
 */
@Component({
  selector: 'app-rxjs-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [LabEditor, LabTimeline, BrowserFrame, CodePanel, Icon, Mascot],
  templateUrl: './rxjs-lab.html',
  styleUrl: './rxjs-lab.css',
})
export class RxjsLab {
  private readonly parent = inject(EnvironmentInjector);
  private readonly feedback = inject(Feedback);
  private readonly preview = viewChild.required<ElementRef<HTMLElement>>('preview');
  private readonly consoleBox = viewChild<ElementRef<HTMLElement>>('consoleBox');

  protected readonly exercises = LAB_EXERCISES;
  protected readonly graded = LAB_EXERCISES.filter((e) => !e.noCheck);
  protected readonly groups = [...new Set(LAB_EXERCISES.map((e) => e.group))].map((name) => ({
    name,
    items: LAB_EXERCISES.filter((e) => e.group === name),
  }));
  protected readonly laneColors = LANE_COLORS;
  protected readonly rxNames = RX_NAMES;

  protected readonly current = signal<LabExercise>(this.initial());
  protected readonly index = computed(() => this.exercises.indexOf(this.current()));
  protected readonly code = signal('');
  protected readonly run = signal<LabRun | null>(null);
  protected readonly verdict = signal<Verdict | null>(null);
  protected readonly checking = signal(false);
  protected readonly showHint = signal(false);
  protected readonly showSolution = signal(false);
  protected readonly confirmReset = signal(false);
  protected readonly tab = signal<Tab>('console');
  protected readonly done = signal(new Set<string>(safeStorage.read<string[]>(KEY + '.done', [])));
  protected readonly doneCount = computed(() => this.graded.filter((e) => this.done().has(e.id)).length);

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
    if (run.ui.inputs.length || run.ui.buttons.length) return { text: 'Đang chờ thao tác trên giao diện…', cls: 'is-wait' };
    return { text: 'Chạy xong (không còn timer nào)', cls: 'is-done' };
  });

  private saveTimer: ReturnType<typeof setTimeout> | undefined;
  private runSeq = 0;

  constructor() {
    this.code.set(this.savedCode(this.current()));
    const tick = setInterval(() => {
      if (this.run()?.active) this.clock.update((c) => c + 1);
    }, 250);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(tick);
      clearTimeout(this.saveTimer);
      this.run()?.stop();
    });

    // lưu code đang viết (debounce)
    effect(() => {
      const code = this.code();
      const id = untracked(this.current).id;
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => safeStorage.write(KEY + '.code.' + id, code), 400);
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

  private initial(): LabExercise {
    const last = safeStorage.read<string>(KEY + '.last', '');
    return this.exercises.find((e) => e.id === last) ?? this.exercises[1];
  }

  private savedCode(ex: LabExercise): string {
    return safeStorage.read<string>(KEY + '.code.' + ex.id, '') || ex.starter;
  }

  protected optionLabel(ex: LabExercise): string {
    const n = this.graded.indexOf(ex);
    return (this.done().has(ex.id) ? '✓ ' : '') + (n < 0 ? '★ ' : n + 1 + '. ') + ex.title;
  }

  protected select(id: string): void {
    const ex = this.exercises.find((e) => e.id === id);
    if (!ex || ex === this.current()) return;
    this.stopAndClear();
    this.current.set(ex);
    safeStorage.write(KEY + '.last', ex.id);
    this.code.set(this.savedCode(ex));
    this.verdict.set(null);
    this.showHint.set(false);
    this.showSolution.set(false);
    this.confirmReset.set(false);
  }

  protected go(delta: number): void {
    const ex = this.exercises[this.index() + delta];
    if (ex) this.select(ex.id);
  }

  private stopAndClear(): void {
    this.runSeq++;
    this.run()?.stop();
    this.run.set(null);
    const el = this.preview().nativeElement;
    el.innerHTML = PREVIEW_EMPTY;
    el.classList.remove('is-stopped');
  }

  protected async runCode(): Promise<LabRun | null> {
    this.stopAndClear();
    const seq = this.runSeq;
    const run = await startRun(this.code(), { parent: this.parent, preview: this.preview().nativeElement });
    if (seq !== this.runSeq) {
      run.stop();
      return null;
    }
    this.run.set(run);
    if (!run.active) this.preview().nativeElement.classList.add('is-stopped');
    return run;
  }

  protected stop(): void {
    const run = this.run();
    if (!run?.active) return;
    run.stop(true);
    this.preview().nativeElement.classList.add('is-stopped');
  }

  protected clearConsole(): void {
    const run = this.run();
    if (!run) return;
    run.lines.length = 0;
    run.touch();
  }

  protected async check(): Promise<void> {
    const ex = this.current();
    if (ex.noCheck || !ex.check || this.checking()) return;
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
        safeStorage.write(KEY + '.done', [...this.done()]);
        this.verdict.set({ kind: 'ok', msg: res.msg, explain: ex.explain });
        if (first) {
          const all = this.doneCount() === this.graded.length;
          this.feedback.toast(all ? 'Bạn đã làm hết ' + this.graded.length + ' bài của RxJS + Signal Lab!' : 'Lab: "' + ex.title + '" đúng rồi!', 'celebrate');
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
    const sol = this.current().solution;
    if (sol) this.code.set(sol);
  }

  protected reset(): void {
    if (!this.confirmReset()) {
      this.confirmReset.set(true);
      setTimeout(() => this.confirmReset.set(false), 3000);
      return;
    }
    this.confirmReset.set(false);
    this.code.set(this.current().starter);
  }
}
