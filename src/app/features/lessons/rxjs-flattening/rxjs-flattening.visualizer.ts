import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Op = 'mergeMap' | 'concatMap' | 'switchMap' | 'exhaustMap';
type ScenarioId = 'search' | 'order' | 'save';
interface Ev {
  t: number;
  label: string;
  lat: number;
}
interface Scenario {
  id: ScenarioId;
  label: string;
  source: string;
  output: string;
  events: Ev[];
}
const SCENARIOS: Scenario[] = [
  { id: 'search', label: 'Ô tìm kiếm', source: 'gõ phím', output: 'màn hình', events: [{ t: 0, label: 'a', lat: 1700 }, { t: 300, label: 'an', lat: 500 }, { t: 600, label: 'ang', lat: 900 }] },
  { id: 'order', label: 'Nút đặt hàng', source: 'bấm nút', output: 'đơn tạo ra', events: [{ t: 0, label: '#1', lat: 1000 }, { t: 250, label: '#2', lat: 1000 }, { t: 500, label: '#3', lat: 1000 }] },
  { id: 'save', label: 'Tự lưu nháp', source: 'bản nháp', output: 'server lưu', events: [{ t: 0, label: 'v1', lat: 1500 }, { t: 400, label: 'v2', lat: 300 }, { t: 800, label: 'v3', lat: 400 }] },
];
const OPS: { id: Op; desc: string }[] = [
  { id: 'mergeMap', desc: 'chạy song song' },
  { id: 'concatMap', desc: 'xếp hàng' },
  { id: 'switchMap', desc: 'huỷ cái cũ' },
  { id: 'exhaustMap', desc: 'bỏ qua cái mới' },
];

type ReqState = 'done' | 'cancelled' | 'ignored';
interface Req {
  label: string;
  arrive: number;
  start: number;
  end: number;
  state: ReqState;
}

/** Mô phỏng 4 chiến lược làm phẳng trên cùng một dãy sự kiện */
export function simulate(op: Op, events: Ev[]): Req[] {
  const out: Req[] = [];
  let busyUntil = 0;
  let prevEnd = 0;
  events.forEach((e, i) => {
    if (op === 'mergeMap') out.push({ label: e.label, arrive: e.t, start: e.t, end: e.t + e.lat, state: 'done' });
    if (op === 'switchMap') {
      const next = events[i + 1]?.t ?? Infinity;
      const end = e.t + e.lat;
      out.push(next < end ? { label: e.label, arrive: e.t, start: e.t, end: next, state: 'cancelled' } : { label: e.label, arrive: e.t, start: e.t, end, state: 'done' });
    }
    if (op === 'concatMap') {
      const start = Math.max(e.t, prevEnd);
      prevEnd = start + e.lat;
      out.push({ label: e.label, arrive: e.t, start, end: prevEnd, state: 'done' });
    }
    if (op === 'exhaustMap') {
      if (e.t < busyUntil) out.push({ label: e.label, arrive: e.t, start: e.t, end: e.t, state: 'ignored' });
      else {
        busyUntil = e.t + e.lat;
        out.push({ label: e.label, arrive: e.t, start: e.t, end: busyUntil, state: 'done' });
      }
    }
  });
  return out;
}

const T_MAX = 3400;
const X0 = 120;
const XW = 610;

@Component({
  selector: 'app-rxjs-flattening-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let now = tl.frame();
    @let sc = scenario();
    <div class="top">
      <div class="group" role="group" aria-label="Tình huống">
        @for (s of scenarios; track s.id) {
          <button type="button" class="chip" [class.chip-event]="sid() === s.id" [class.chip-plain]="sid() !== s.id" (click)="pick(s.id)">{{ s.label }}</button>
        }
      </div>
      <div class="group" role="group" aria-label="Operator">
        @for (o of ops; track o.id) {
          <button type="button" class="opbtn" [class.on]="op() === o.id" [appAnchor]="o.id" (click)="op.set(o.id); run()">
            <code>{{ o.id }}</code><small>{{ o.desc }}</small>
          </button>
        }
      </div>
    </div>

    <div class="scroll">
      <svg [attr.viewBox]="'0 0 760 ' + height()" class="tl" role="img" [attr.aria-label]="'Dòng thời gian ' + sc.label + ' với ' + op()">
        <!-- nguồn -->
        <text class="lab" x="8" y="44">{{ sc.source }}</text>
        <line class="belt" [attr.x1]="x0" x2="740" y1="40" y2="40" />
        @for (e of sc.events; track e.label) {
          @if (e.t <= now) {
            <g class="ev" [attr.transform]="'translate(' + x(e.t) + ',40)'"><circle r="14" /><text text-anchor="middle" dominant-baseline="central">{{ e.label }}</text></g>
          }
        }
        <!-- request -->
        @for (r of reqs(); track r.label; let i = $index) {
          @let y = 92 + i * 38;
          <text class="lab" x="8" [attr.y]="y + 4">request {{ r.label }}</text>
          @if (r.arrive <= now) {
            @if (r.state === 'ignored') {
              <g [attr.transform]="'translate(' + x(r.arrive) + ',' + y + ')'" appAnchor="exhaustMap">
                <text class="ign" x="6" dominant-baseline="central">— bị bỏ qua</text>
              </g>
            } @else {
              @if (r.start > r.arrive) {
                <line class="wait" [attr.x1]="x(r.arrive)" [attr.x2]="x(Math.min(r.start, now))" [attr.y1]="y" [attr.y2]="y" />
              }
              @if (r.start <= now) {
                <rect class="bar" [class.cancel]="r.state === 'cancelled' && r.end <= now" [attr.x]="x(r.start)" [attr.y]="y - 10" [attr.width]="Math.max(2, x(Math.min(r.end, now)) - x(r.start))" height="20" rx="6" />
              }
              @if (r.end <= now) {
                @if (r.state === 'cancelled') {
                  <text class="xmark" [attr.x]="x(r.end) + 4" [attr.y]="y" dominant-baseline="central">✗ huỷ</text>
                } @else {
                  <circle class="dot" [attr.cx]="x(r.end)" [attr.cy]="y" r="7" />
                }
              }
            }
          }
        }
        <!-- đầu ra -->
        @let yo = 92 + reqs().length * 38 + 14;
        <text class="lab" x="8" [attr.y]="yo + 4">{{ sc.output }}</text>
        <line class="belt" [attr.x1]="x0" x2="740" [attr.y1]="yo" [attr.y2]="yo" />
        @for (r of outputs(); track r.label) {
          @if (r.end <= now) {
            <g class="out" [attr.transform]="'translate(' + x(r.end) + ',' + yo + ')'"><circle r="14" /><text text-anchor="middle" dominant-baseline="central">{{ r.label }}</text></g>
          }
        }
        <line class="now" [attr.x1]="x(now)" [attr.x2]="x(now)" y1="16" [attr.y2]="height() - 12" />
        <text class="nowlab" [attr.x]="x(now)" [attr.y]="height() - 2" text-anchor="middle">{{ (now / 1000).toFixed(1) }}s</text>
      </svg>
    </div>
    @if (tl.atEnd() && tl.total() > 1) {
    <p class="verdict" [class.ok]="verdict().ok" [class.bad]="!verdict().ok">
      <app-icon [name]="verdict().ok ? 'check' : 'error'" [size]="16" /> {{ verdict().text }}
    </p>
    }
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .top { display: grid; gap: 10px; padding: 16px 22px 6px; }
    .group { display: flex; flex-wrap: wrap; gap: 8px; }
    .group .chip { cursor: pointer; }
    .opbtn { display: grid; padding: 6px 12px; border: var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); text-align: left; cursor: pointer; box-shadow: var(--shadow-sm); transition: transform var(--dur) var(--ease-bounce); }
    .opbtn small { font-size: 11px; color: var(--text-muted); }
    .opbtn.on { background: var(--c-event); color: var(--pal-ink); transform: translateY(-2px); }
    .opbtn.on small { color: var(--pal-ink); }
    .opbtn.is-hl { outline: 3px solid var(--c-signal-strong); }
    .scroll { overflow-x: auto; padding: 0 12px; }
    .tl { display: block; width: 100%; min-width: 600px; height: auto; }
    .lab { font-family: var(--font-mono); font-size: 12px; font-weight: 700; fill: var(--text-muted); }
    .belt { stroke: var(--line); stroke-width: 5; stroke-linecap: round; opacity: 0.8; }
    .ev circle { fill: var(--c-event); stroke: var(--pal-ink); stroke-width: 2.25; }
    .out circle { fill: var(--c-data); stroke: var(--pal-ink); stroke-width: 2.25; }
    .ev text, .out text { font-family: var(--font-display); font-weight: 800; font-size: 11px; fill: var(--pal-ink); }
    .ev, .out { animation: pop 300ms var(--ease-bounce); transform-box: fill-box; }
    .bar { fill: var(--c-di); stroke: var(--pal-ink); stroke-width: 2; }
    .bar.cancel { fill: var(--surface-sunken); stroke-dasharray: 5 3; }
    .wait { stroke: var(--text-muted); stroke-width: 2; stroke-dasharray: 3 4; }
    .dot { fill: var(--c-data); stroke: var(--pal-ink); stroke-width: 2; }
    .xmark { font-weight: 800; font-size: 13px; fill: var(--c-error-strong); }
    .ign { font-weight: 800; font-size: 13px; fill: var(--text-muted); }
    .now { stroke: var(--c-signal-strong); stroke-width: 2.25; stroke-dasharray: 6 4; }
    .nowlab { font-family: var(--font-mono); font-weight: 700; font-size: 11px; fill: var(--c-signal-strong); }
    .verdict { display: flex; align-items: center; gap: 8px; margin: 4px 22px 12px; padding: 8px 12px; border: var(--border); border-radius: var(--radius); font-weight: 800; }
    .verdict.ok { background: var(--c-data); color: var(--on-accent); }
    .verdict.bad { background: var(--c-error); color: var(--on-accent); }
    @keyframes pop { from { transform: scale(0.4); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .ev, .out { animation: none; } }
  `,
})
export class RxjsFlatteningVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly Math = Math;
  protected readonly x0 = X0;
  protected readonly scenarios = SCENARIOS;
  protected readonly ops = OPS;
  protected readonly sid = signal<ScenarioId>('search');
  protected readonly op = signal<Op>('mergeMap');
  protected readonly scenario = computed(() => SCENARIOS.find((s) => s.id === this.sid())!);
  protected readonly reqs = computed(() => simulate(this.op(), this.scenario().events));
  protected readonly outputs = computed(() => this.reqs().filter((r) => r.state === 'done').sort((a, b) => a.end - b.end));
  protected readonly height = computed(() => 92 + this.reqs().length * 38 + 52);

  protected readonly verdict = computed(() => {
    const outs = this.outputs().map((r) => r.label);
    const reqs = this.reqs();
    const ev = this.scenario().events.map((e) => e.label);
    const last = outs[outs.length - 1];
    switch (this.sid()) {
      case 'search':
        if (last !== ev[ev.length - 1]) return { ok: false, text: `Race condition! Màn hình cuối cùng hiện kết quả của "${last}" dù người dùng đã gõ "${ev[ev.length - 1]}".` };
        if (outs.length > 1) return { ok: false, text: `Đúng kết quả cuối nhưng màn hình nhấp nháy qua ${outs.length} kết quả và chờ tới ${(this.reqs().at(-1)!.end / 1000).toFixed(1)}s.` };
        return { ok: true, text: 'Chỉ một kết quả, đúng từ khoá cuối, các request cũ đã bị huỷ.' };
      case 'order': {
        const cancelled = reqs.filter((r) => r.state === 'cancelled').length;
        if (cancelled) return { ok: false, text: `Client thấy 1 đơn, nhưng ${cancelled} request bị huỷ giữa chừng có thể ĐÃ tới server → nguy cơ đơn trùng.` };
        if (outs.length > 1) return { ok: false, text: `Tạo ra ${outs.length} đơn hàng giống nhau! Khách bị trừ tiền ${outs.length} lần.` };
        return { ok: true, text: 'Đúng 1 đơn hàng. Các cú bấm thừa bị bỏ qua từ đầu.' };
      }
      case 'save':
        if (outs.join() === ev.join()) return { ok: true, text: 'Server nhận đủ v1 → v2 → v3, bản cuối là bản mới nhất.' };
        if (last !== ev[ev.length - 1]) return { ok: false, text: `Server lưu theo thứ tự ${outs.join(' → ')}: bản cũ "${last}" ghi đè bản mới!` };
        return { ok: false, text: `Server chỉ nhận ${outs.join(' → ')} — mất bản nháp.` };
    }
  });

  protected readonly tl = createTimeline<number>(0, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag) this.ctx.completeChallenge(s.tag);
    },
  });

  constructor() {
    this.run(false);
  }

  protected x(t: number): number {
    return X0 + (Math.min(t, T_MAX) / T_MAX) * XW;
  }

  protected pick(id: ScenarioId): void {
    this.sid.set(id);
    this.run();
  }

  protected run(autoplay = true): void {
    const op = this.op();
    const reqs = this.reqs();
    const sc = this.scenario();
    type Ev2 = { t: number; text: string; anchor?: string; sound?: Step<number>['sound'] };
    const evs: Ev2[] = [];
    for (const r of reqs) {
      if (r.state === 'ignored') evs.push({ t: r.arrive, text: `"${r.label}" tới nhưng ${op} đang bận → bỏ qua.`, anchor: 'exhaustMap', sound: 'boop' });
      else if (r.start > r.arrive) {
        evs.push({ t: r.arrive, text: `"${r.label}" tới, phải xếp hàng chờ request trước xong.`, anchor: 'concatMap' });
        evs.push({ t: r.start, text: `Đến lượt: bắt đầu request "${r.label}".`, anchor: 'start' });
      } else evs.push({ t: r.arrive, text: `"${r.label}" tới → bắt đầu request ngay.`, anchor: 'start' });
      if (r.state === 'cancelled') evs.push({ t: r.end, text: `Có giá trị mới → ${op} huỷ request "${r.label}".`, anchor: 'cancel', sound: 'boop' });
      if (r.state === 'done') evs.push({ t: r.end, text: `Request "${r.label}" trả về → đưa ra ${sc.output}.`, anchor: 'done', sound: 'pop' });
    }
    evs.sort((a, b) => a.t - b.t);
    const steps: Step<number>[] = [{ frame: 0, caption: `${sc.label} với ${op}: ${OPS.find((o) => o.id === op)!.desc}.`, anchor: op, duration: 900 }];
    for (const e of evs) steps.push({ frame: e.t, caption: `${(e.t / 1000).toFixed(2)}s — ${e.text}`, anchor: e.anchor, sound: e.sound, duration: 1000 });
    const v = this.verdict();
    const tag = v.ok ? ({ search: 'rf-search', order: 'rf-order', save: 'rf-save' } as const)[sc.id] : undefined;
    steps.push({ frame: Math.max(...reqs.map((r) => r.end)) + 150, caption: v.text, sound: v.ok ? 'ting' : 'boop', tag, duration: 1000 });
    this.tl.load(steps, autoplay);
  }
}
