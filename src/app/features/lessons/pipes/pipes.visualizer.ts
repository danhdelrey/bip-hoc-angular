import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Val = Date | string;
interface Machine {
  id: string;
  label: string;
  color: string;
  run: (v: Val) => Val;
  error: string;
}

const FULL_DATE = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const MACHINES: Machine[] = [
  {
    id: 'date', label: "date: 'fullDate'", color: 'var(--pal-sky)', error: 'DatePipe không hiểu chuỗi này là ngày nào!',
    run: (v) => {
      const d = v instanceof Date ? v : new Date(v);
      if (Number.isNaN(d.getTime())) throw new Error();
      return FULL_DATE.format(d);
    },
  },
  {
    id: 'uppercase', label: 'uppercase', color: 'var(--pal-lavender)', error: 'UpperCasePipe chỉ nhận chuỗi — không nhận Date!',
    run: (v) => {
      if (typeof v !== 'string') throw new Error();
      return v.toUpperCase();
    },
  },
  {
    id: 'slice', label: 'slice: 0 : 9', color: 'var(--pal-mint)', error: 'SlicePipe chỉ nhận chuỗi hoặc mảng!',
    run: (v) => {
      if (typeof v !== 'string') throw new Error();
      return v.slice(0, 9);
    },
  },
  {
    id: 'stars', label: 'stars (tự viết)', color: 'var(--pal-coral)', error: '',
    run: (v) => `★ ${v instanceof Date ? v.toString() : v} ★`,
  },
];
const START = new Date(2026, 10, 18);
const show = (v: Val) => (v instanceof Date ? 'Date(18/11/2026)' : `'${v}'`);

interface Frame {
  at: number; // -1 = cửa vào; i = đang ở máy i; n = đã ra khỏi dây chuyền
  value: string;
  broken: number | null;
}
interface Todo { title: string; done: boolean }

@Component({
  selector: 'app-pipes-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, CdkDropList, CdkDrag, CdkDropListGroup],
  template: `
    @let f = tl.frame();
    <div class="factory" cdkDropListGroup [style.--dur.ms]="tl.durationMs()">
      <div class="shelf">
        <p class="eyebrow">Kho máy (kéo lên dây chuyền)</p>
        <div class="list stock" cdkDropList cdkDropListOrientation="horizontal" [cdkDropListData]="stock()" (cdkDropListDropped)="drop($event)">
          @for (m of stock(); track m.id) {
            <div class="machine" cdkDrag [style.--mc]="m.color">
              <span class="m-label">{{ m.label }}</span>
              <button type="button" class="mini" (click)="addM(m)" [attr.aria-label]="'Thêm máy ' + m.label"><app-icon name="plus" [size]="14" /></button>
            </div>
          } @empty { <span class="muted empty">Kho trống</span> }
        </div>
      </div>

      <div class="line-wrap">
        <div class="inbox" [class.active]="f.at === -1"><span class="crate">📦</span><code>today()</code></div>
        <div class="list line" cdkDropList cdkDropListOrientation="horizontal" [cdkDropListData]="line()" (cdkDropListDropped)="drop($event)" aria-label="Dây chuyền">
          @for (m of line(); track m.id; let i = $index) {
            <div class="machine on-line" cdkDrag [style.--mc]="m.color" [class.working]="f.at === i && f.broken === null" [class.broken]="f.broken === i"
                 [appAnchor]="'machine-' + m.id">
              <span class="pipe-sym">|</span>
              <span class="m-label">{{ m.label }}</span>
              <span class="tools">
                <button type="button" class="mini" (click)="move(i, -1)" [disabled]="i === 0" aria-label="Lên trước"><app-icon name="arrowLeft" [size]="12" /></button>
                <button type="button" class="mini" (click)="removeM(i)" aria-label="Bỏ máy"><app-icon name="close" [size]="12" /></button>
              </span>
              @if (f.at === i) { <span class="box" [class.crash]="f.broken === i">📦</span> }
            </div>
          } @empty { <span class="muted empty">Kéo máy vào đây…</span> }
        </div>
        <div class="outbox" [class.active]="f.at >= line().length && f.broken === null"><span class="crate">🎁</span></div>
      </div>

      <div class="result" [class.err]="f.broken !== null" aria-live="polite">
        <span class="eyebrow">{{ f.broken !== null ? 'Máy hỏng!' : 'Món hàng hiện tại' }}</span>
        <code>{{ f.value }}</code>
      </div>
      <div class="controls">
        <button type="button" class="btn btn-sm btn-primary" (click)="run()"><app-icon name="play" [size]="14" /> Chạy dây chuyền</button>
        <button type="button" class="btn btn-sm" (click)="reset()"><app-icon name="replay" [size]="14" /> Lắp lại từ đầu</button>
        <span class="muted small">Template tương ứng: <code>{{ templateText() }}</code></span>
      </div>
    </div>

    <div class="pure">
      <h3 appAnchor="pure">Pure vs Impure</h3>
      <p class="muted small">Cùng pipe lọc việc đã xong <code>doneOnly</code>. Pure chỉ chạy lại khi mảng đổi tham chiếu; impure chạy ở mọi lần change detection.</p>
      <div class="pure-grid">
        <div class="col"><strong>pure (mặc định)</strong><span class="runs">đã chạy {{ pureRuns() }} lần</span>
          <ul>@for (t of pureOut(); track $index) { <li>{{ t.title }}</li> } @empty { <li class="muted">(trống)</li> }</ul></div>
        <div class="col"><strong>pure: false</strong><span class="runs">đã chạy {{ impureRuns() }} lần</span>
          <ul>@for (t of impureOut(); track $index) { <li>{{ t.title }}</li> } @empty { <li class="muted">(trống)</li> }</ul></div>
      </div>
      <div class="controls tight">
        <button type="button" class="btn btn-sm btn-danger" (click)="mutate()">todos.push(...) — mảng cũ</button>
        <button type="button" class="btn btn-sm btn-data" (click)="immutable()">todos.update(l => [...l, ...]) — mảng mới</button>
        <button type="button" class="btn btn-sm" (click)="cd()">Một lần change detection khác</button>
      </div>
      <p class="pure-msg">{{ pureMsg() }}</p>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .factory { padding: 18px 22px 6px; }
    .list { display: flex; gap: 10px; flex-wrap: wrap; min-height: 64px; padding: 8px; border: 2px dashed color-mix(in srgb, var(--line) 35%, transparent); border-radius: var(--radius-sm); }
    .empty { align-self: center; font-weight: 700; padding: 0 8px; }
    .machine { --mc: var(--pal-sky); position: relative; display: flex; align-items: center; gap: 6px; padding: 8px 10px; font-family: var(--font-mono); font-weight: 700; font-size: 13px; background: color-mix(in srgb, var(--mc) 55%, var(--surface)); border: var(--border); border-radius: 12px 12px 6px 6px; box-shadow: var(--shadow-sm); cursor: grab; }
    .machine::before { content: ''; position: absolute; left: 10px; right: 10px; top: -9px; height: 9px; background: repeating-linear-gradient(90deg, var(--line) 0 4px, transparent 4px 9px); opacity: 0.5; }
    .m-label { white-space: nowrap; }
    .mini { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; background: var(--surface); border: 2px solid var(--line); border-radius: 50%; cursor: pointer; }
    .mini:disabled { opacity: 0.4; cursor: default; }
    .tools { display: inline-flex; gap: 3px; }
    .pipe-sym { font-size: 18px; color: var(--text-muted); }
    .line-wrap { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; margin: 18px 0 10px; }
    .line { background: repeating-linear-gradient(90deg, var(--surface-2) 0 18px, color-mix(in srgb, var(--surface-2) 70%, var(--line)) 18px 20px); border-style: solid; border-color: var(--line); min-height: 78px; align-items: center; }
    .inbox, .outbox { display: grid; justify-items: center; padding: 6px 10px; border: var(--border); border-radius: 12px; background: var(--surface); transition: box-shadow var(--dur) ease; }
    .inbox.active, .outbox.active { box-shadow: 0 0 0 4px var(--c-signal); }
    .crate { font-size: 26px; }
    .inbox code { background: none; border: none; font-size: 11px; }
    .machine.working { box-shadow: 0 0 0 4px var(--c-signal); animation: shake 300ms linear 3; }
    .machine.broken { background: var(--c-error); animation: blink-err 500ms ease 3; }
    .machine.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .box { position: absolute; top: -34px; left: 50%; transform: translateX(-50%); font-size: 24px; animation: drop 420ms var(--ease-bounce); }
    .box.crash { animation: crash 600ms ease forwards; }
    @keyframes drop { from { transform: translate(-50%, -20px); opacity: 0; } }
    @keyframes crash { to { transform: translate(-50%, 10px) rotate(70deg); opacity: 0.4; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(2px); } }
    .result { display: grid; gap: 4px; padding: 10px 14px; border: var(--border); border-left-width: 10px; border-left-color: var(--c-data); border-radius: var(--radius-sm); background: var(--surface); }
    .result.err { border-left-color: var(--c-error); background: color-mix(in srgb, var(--c-error) 18%, var(--surface)); }
    .result code { font-size: 15px; background: none; border: none; padding: 0; word-break: break-word; }
    .controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; padding: 12px 0; }
    .controls.tight { padding: 8px 0 0; }
    .small { font-size: var(--fs-sm); font-weight: 600; }
    .cdk-drag-preview { box-shadow: var(--shadow-lg); }
    .cdk-drag-placeholder { opacity: 0.35; }
    .cdk-drag-animating, .list.cdk-drop-list-dragging .machine:not(.cdk-drag-placeholder) { transition: transform 250ms var(--ease-out); }
    .pure { margin: 6px 22px 16px; padding: 14px 16px; border: var(--border-thin); border-radius: var(--radius); background: var(--surface-2); }
    .pure h3 { margin-bottom: 4px; }
    .pure-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .col { padding: 10px 12px; background: var(--surface); border: var(--border-thin); border-radius: var(--radius-sm); }
    .col ul { margin: 6px 0 0; padding-left: 18px; }
    .runs { float: right; font-size: 12px; font-weight: 800; padding: 0 8px; border: 2px solid var(--line); border-radius: var(--radius-pill); }
    .pure-msg { margin: 10px 0 0; font-weight: 700; }
  `,
})
export class PipesVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly stock = signal<Machine[]>([MACHINES[2], MACHINES[3]]);
  // Mặc định cố tình xếp SAI thứ tự để người học tự sửa
  protected readonly line = signal<Machine[]>([MACHINES[1], MACHINES[0]]);

  protected readonly tl = createTimeline<Frame>(
    { at: -1, value: show(START), broken: null },
    {
      onEnter: (s) => {
        this.ctx.stepAnchor.set(s.anchor ?? null);
        if (s.tag === 'error') this.ctx.completeChallenge('pp-error');
        if (s.tag === 'done' && /^[^a-z]*(WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|MONDAY|TUESDAY), [A-Z]+ \d+, \d{4}[^a-z]*$/.test(s.frame.value.replace(/^'|'$/g, ''))) this.ctx.completeChallenge('pp-order');
      },
    },
  );

  protected templateText(): string {
    return `{{ today() ${this.line().map((m) => '| ' + m.label.replace(' (tự viết)', '')).join(' ')} }}`;
  }

  protected drop(e: CdkDragDrop<Machine[]>): void {
    const from = [...e.previousContainer.data];
    const to = e.previousContainer === e.container ? from : [...e.container.data];
    if (e.previousContainer === e.container) moveItemInArray(from, e.previousIndex, e.currentIndex);
    else transferArrayItem(from, to, e.previousIndex, e.currentIndex);
    const isLine = (d: Machine[]) => d === this.line();
    if (isLine(e.previousContainer.data)) {
      this.line.set(from);
      if (e.previousContainer !== e.container) this.stock.set(to);
    } else {
      this.stock.set(from);
      if (e.previousContainer !== e.container) this.line.set(to);
    }
  }

  protected addM(m: Machine): void {
    this.stock.update((s) => s.filter((x) => x !== m));
    this.line.update((l) => [...l, m]);
  }
  protected removeM(i: number): void {
    const m = this.line()[i];
    this.line.update((l) => l.filter((_, k) => k !== i));
    this.stock.update((s) => [...s, m]);
  }
  protected move(i: number, d: number): void {
    const l = [...this.line()];
    moveItemInArray(l, i, i + d);
    this.line.set(l);
  }
  protected reset(): void {
    this.line.set([MACHINES[1], MACHINES[0]]);
    this.stock.set([MACHINES[2], MACHINES[3]]);
    this.tl.reset({ at: -1, value: show(START), broken: null });
  }

  protected run(): void {
    const steps: Step<Frame>[] = [{ frame: { at: -1, value: show(START), broken: null }, caption: `Món hàng vào cửa: today() = ${show(START)} (kiểu Date).`, duration: 900 }];
    let v: Val = START;
    const line = this.line();
    for (let i = 0; i < line.length; i++) {
      const m = line[i];
      try {
        v = m.run(v);
        steps.push({ frame: { at: i, value: show(v), broken: null }, caption: `Máy ${m.label} biến đổi → ${show(v)}`, anchor: `machine-${m.id}`, duration: 1100, sound: 'pop' });
      } catch {
        steps.push({ frame: { at: i, value: `InvalidPipeArgument: ${m.error}`, broken: i }, caption: `💥 Máy ${m.label} hỏng: ${m.error}`, anchor: `machine-${m.id}`, duration: 1400, sound: 'boop', tag: 'error' });
        this.tl.load(steps);
        return;
      }
    }
    steps.push({ frame: { at: line.length, value: show(v), broken: null }, caption: `Thành phẩm ra khỏi dây chuyền: ${show(v)}. Dữ liệu gốc today() vẫn nguyên vẹn!`, duration: 1000, sound: 'ting', tag: 'done' });
    this.tl.load(steps);
  }

  // ---------- Pure vs Impure ----------
  private todos: Todo[] = [{ title: 'Học pipe', done: true }, { title: 'Pha cà phê', done: false }];
  private pureRef = this.todos;
  protected readonly pureOut = signal(this.todos.filter((t) => t.done));
  protected readonly impureOut = signal(this.todos.filter((t) => t.done));
  protected readonly pureRuns = signal(1);
  protected readonly impureRuns = signal(1);
  protected readonly pureMsg = signal('Hai cột đang giống nhau.');
  private n = 1;

  private changeDetection(reason: string): void {
    // impure: luôn chạy lại
    this.impureRuns.update((r) => r + 1);
    this.impureOut.set(this.todos.filter((t) => t.done));
    // pure: chỉ chạy lại khi tham chiếu đổi
    if (this.todos !== this.pureRef) {
      this.pureRef = this.todos;
      this.pureRuns.update((r) => r + 1);
      this.pureOut.set(this.todos.filter((t) => t.done));
      this.pureMsg.set(`${reason} → tham chiếu MỚI, cả hai pipe đều chạy lại.`);
    } else {
      this.pureMsg.set(`${reason} → tham chiếu giữ nguyên, pipe pure KHÔNG chạy lại (dùng kết quả cũ).`);
    }
  }
  protected mutate(): void {
    this.todos.push({ title: `Việc xong #${++this.n}`, done: true });
    this.changeDetection('push() vào mảng cũ');
    if (this.pureOut().length !== this.impureOut().length) this.ctx.completeChallenge('pp-pure');
  }
  protected immutable(): void {
    this.todos = [...this.todos, { title: `Việc xong #${++this.n}`, done: true }];
    this.changeDetection('Tạo mảng mới');
  }
  protected cd(): void {
    this.changeDetection('Change detection chạy (vd. do một sự kiện khác)');
  }
}
