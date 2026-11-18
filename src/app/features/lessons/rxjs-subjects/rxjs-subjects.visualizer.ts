import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

export type Kind = 'Subject' | 'BehaviorSubject' | 'ReplaySubject' | 'AsyncSubject';
type Mode = 'kinds' | 'share';
type ShareOp = 'none' | 'share' | 'shareReplay';

interface ScriptEv {
  t: number;
  type: 'next' | 'sub' | 'complete';
  v?: number;
  sub?: string;
}
export interface Delivery {
  sub: string;
  t: number;
  v: number | '|';
  replay: boolean;
}

export const SCRIPT: ScriptEv[] = [
  { t: 1, type: 'next', v: 1 },
  { t: 2, type: 'next', v: 2 },
  { t: 3, type: 'sub', sub: 'A' },
  { t: 4, type: 'next', v: 3 },
  { t: 5, type: 'sub', sub: 'B' },
  { t: 6, type: 'next', v: 4 },
  { t: 7, type: 'complete' },
  { t: 8, type: 'sub', sub: 'C' },
];

/** Mô phỏng đúng hành vi của 4 loại Subject trong RxJS với kịch bản cố định */
export function simulateSubject(kind: Kind): Delivery[] {
  const out: Delivery[] = [];
  const subs: string[] = [];
  const values: number[] = [];
  let current = 0; // giá trị khởi tạo của BehaviorSubject(0)
  let completed = false;
  for (const e of SCRIPT) {
    if (e.type === 'next') {
      values.push(e.v!);
      current = e.v!;
      if (kind !== 'AsyncSubject') for (const s of subs) out.push({ sub: s, t: e.t, v: e.v!, replay: false });
    } else if (e.type === 'complete') {
      completed = true;
      for (const s of subs) {
        if (kind === 'AsyncSubject' && values.length) out.push({ sub: s, t: e.t, v: values[values.length - 1], replay: false });
        out.push({ sub: s, t: e.t, v: '|', replay: false });
      }
    } else {
      const s = e.sub!;
      if (kind === 'BehaviorSubject' && !completed) out.push({ sub: s, t: e.t, v: current, replay: true });
      if (kind === 'ReplaySubject') for (const v of values.slice(-2)) out.push({ sub: s, t: e.t, v, replay: true });
      if (kind === 'AsyncSubject' && completed && values.length) out.push({ sub: s, t: e.t, v: values[values.length - 1], replay: true });
      if (completed) out.push({ sub: s, t: e.t, v: '|', replay: false });
      else subs.push(s);
    }
  }
  return out;
}

interface Req {
  start: number;
  end: number;
}
interface ShareResult {
  reqs: Req[];
  a: number; // lúc A nhận
  b: number; // lúc B nhận
  bCached: boolean;
}
export function simulateShare(op: ShareOp, bJoin: number): ShareResult {
  const first: Req = { start: 0, end: 1000 };
  if (op === 'none') return { reqs: [first, { start: bJoin, end: bJoin + 1000 }], a: 1000, b: bJoin + 1000, bCached: false };
  if (bJoin < 1000) return { reqs: [first], a: 1000, b: 1000, bCached: false };
  if (op === 'share') return { reqs: [first, { start: bJoin, end: bJoin + 1000 }], a: 1000, b: bJoin + 1000, bCached: false };
  return { reqs: [first], a: 1000, b: bJoin, bCached: true };
}

const KINDS: { id: Kind; anchor: string; desc: string }[] = [
  { id: 'Subject', anchor: 'subject', desc: 'không phát lại' },
  { id: 'BehaviorSubject', anchor: 'behavior', desc: 'giá trị hiện tại' },
  { id: 'ReplaySubject', anchor: 'replay', desc: 'n giá trị cuối (n = 2)' },
  { id: 'AsyncSubject', anchor: 'async', desc: 'giá trị cuối khi complete' },
];
const SUB_Y: Record<string, number> = { A: 122, B: 182, C: 242 };

@Component({
  selector: 'app-rxjs-subjects-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, AnchorDirective],
  template: `
    @let now = tl.frame();
    <div class="top">
      <div class="group" role="group" aria-label="Chế độ">
        <button type="button" class="chip" [class.chip-event]="mode() === 'kinds'" [class.chip-plain]="mode() !== 'kinds'" (click)="setMode('kinds')">4 loại Subject</button>
        <button type="button" class="chip" [class.chip-event]="mode() === 'share'" [class.chip-plain]="mode() !== 'share'" (click)="setMode('share')">Cold / Hot</button>
      </div>
      @if (mode() === 'kinds') {
        <div class="group" role="group" aria-label="Loại Subject">
          @for (k of kinds; track k.id) {
            <button type="button" class="opbtn" [class.on]="kind() === k.id" [appAnchor]="k.anchor" (click)="kind.set(k.id); runKinds()">
              <span class="name">{{ k.id }}</span><small>{{ k.desc }}</small>
            </button>
          }
        </div>
      } @else {
        <div class="group opts">
          <span class="eyebrow">Toán tử</span>
          @for (o of shareOps; track o.id) {
            <label [appAnchor]="o.id === 'shareReplay' ? 'shareReplay' : 'subscribe'"><input type="radio" name="shareop" [checked]="shareOp() === o.id" (change)="shareOp.set(o.id); runShare()" /> {{ o.label }}</label>
          }
          <span class="eyebrow">Sub B đăng ký lúc</span>
          <label><input type="radio" name="bjoin" [checked]="bJoin() === 500" (change)="bJoin.set(500); runShare()" /> 500ms (request đang chạy)</label>
          <label><input type="radio" name="bjoin" [checked]="bJoin() === 1500" (change)="bJoin.set(1500); runShare()" /> 1500ms (request đã xong)</label>
        </div>
      }
    </div>

    <div class="scroll">
      @if (mode() === 'kinds') {
        <svg viewBox="0 0 780 280" class="tl" role="img" [attr.aria-label]="'Dòng thời gian ' + kind()">
          <text class="lab" x="8" y="54">nguồn</text>
          <line class="belt" x1="90" x2="760" y1="50" y2="50" />
          @for (e of script; track e.t) {
            @if (e.t <= now) {
              @if (e.type === 'next') {
                <g class="m src" [attr.transform]="'translate(' + x(e.t) + ',50)'" appAnchor="next"><circle r="15" /><text text-anchor="middle" dominant-baseline="central">{{ e.v }}</text></g>
              } @else if (e.type === 'complete') {
                <line class="done-bar" [attr.x1]="x(e.t)" [attr.x2]="x(e.t)" y1="32" y2="68" />
              } @else {
                <line class="join" [attr.x1]="x(e.t)" [attr.x2]="x(e.t)" y1="64" [attr.y2]="subY[e.sub!] - 18" />
              }
            }
          }
          @for (s of ['A', 'B', 'C']; track s) {
            @let y = subY[s];
            @let join = joinT(s);
            <text class="lab" x="8" [attr.y]="y + 4">Sub {{ s }}</text>
            <line class="belt off" x1="90" [attr.x2]="x(join)" [attr.y1]="y" [attr.y2]="y" />
            @if (join <= now) {
              <line class="belt" [attr.x1]="x(join)" x2="760" [attr.y1]="y" [attr.y2]="y" />
            }
          }
          @for (d of deliveries(); track $index) {
            @if (d.t <= now) {
              @if (d.v === '|') {
                <line class="done-bar" [attr.x1]="x(d.t) + offset(d)" [attr.x2]="x(d.t) + offset(d)" [attr.y1]="subY[d.sub] - 16" [attr.y2]="subY[d.sub] + 16" />
              } @else {
                <g class="m" [class.replay]="d.replay" [attr.transform]="'translate(' + (x(d.t) + offset(d)) + ',' + subY[d.sub] + ')'">
                  <circle r="14" /><text text-anchor="middle" dominant-baseline="central">{{ d.v }}</text>
                </g>
              }
            }
          }
          <line class="now" [attr.x1]="x(now)" [attr.x2]="x(now)" y1="20" y2="266" />
        </svg>
      } @else {
        @let r = shareResult();
        <svg viewBox="0 0 780 230" class="tl" role="img" aria-label="Dòng thời gian request HTTP">
          <text class="lab" x="8" y="54">HTTP</text>
          <line class="belt off" x1="90" x2="760" y1="50" y2="50" />
          @for (q of r.reqs; track $index) {
            @if (q.start <= now) {
              <rect class="bar" [attr.x]="xs(q.start)" y="38" [attr.width]="Math.max(2, xs(Math.min(q.end, now)) - xs(q.start))" height="24" rx="6" />
              <text class="barlab" [attr.x]="xs(q.start) + 8" y="54">request #{{ $index + 1 }}</text>
            }
          }
          @for (s of ['A', 'B']; track s) {
            @let y = s === 'A' ? 122 : 182;
            @let join = s === 'A' ? 0 : bJoin();
            @let got = s === 'A' ? r.a : r.b;
            <text class="lab" x="8" [attr.y]="y + 4">Sub {{ s }}</text>
            <line class="belt off" x1="90" [attr.x2]="xs(join)" [attr.y1]="y" [attr.y2]="y" />
            @if (join <= now) {
              <line class="belt" [attr.x1]="xs(join)" x2="760" [attr.y1]="y" [attr.y2]="y" />
              <line class="join" [attr.x1]="xs(join)" [attr.x2]="xs(join)" [attr.y1]="y - 22" [attr.y2]="y + 22" />
            }
            @if (got <= now) {
              <g class="m" [class.replay]="s === 'B' && r.bCached" [attr.transform]="'translate(' + (xs(got) + (s === 'B' && r.bCached ? 18 : 0)) + ',' + y + ')'"><circle r="14" /><text text-anchor="middle" dominant-baseline="central">U</text></g>
            }
          }
          <line class="now" [attr.x1]="xs(now)" [attr.x2]="xs(now)" y1="20" y2="216" />
        </svg>
      }
    </div>
    <p class="legend"><span class="sw src-sw"></span> giá trị được phát · <span class="sw got-sw"></span> subscriber nhận · <span class="sw rep-sw"></span> nhận ngay lúc đăng ký (phát lại / cache) · <b>|</b> complete</p>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .top { display: grid; gap: 10px; padding: 16px 22px 6px; }
    .group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .group .chip { cursor: pointer; }
    .opts { gap: 6px 14px; font-weight: 700; font-size: var(--fs-sm); }
    .opts label { display: flex; gap: 5px; align-items: center; cursor: pointer; padding: 2px 6px; border-radius: 8px; }
    .opts label.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .opbtn { display: grid; padding: 6px 12px; border: var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); text-align: left; cursor: pointer; box-shadow: var(--shadow-sm); transition: transform var(--dur) var(--ease-bounce); }
    .opbtn .name { font-family: var(--font-mono); font-weight: 600; font-size: 13px; }
    .opbtn small { font-size: 11px; color: var(--text-muted); }
    .opbtn.on { background: var(--c-event); color: var(--pal-ink); transform: translateY(-2px); }
    .opbtn.on small { color: var(--pal-ink); }
    .opbtn.is-hl { outline: 3px solid var(--c-signal-strong); }
    .scroll { overflow-x: auto; padding: 0 12px; }
    .tl { display: block; width: 100%; min-width: 600px; height: auto; }
    .lab { font-family: var(--font-mono); font-size: 12px; font-weight: 700; fill: var(--text-muted); }
    .belt { stroke: var(--line); stroke-width: 4; stroke-linecap: round; opacity: 0.8; }
    .belt.off { stroke-dasharray: 3 7; opacity: 0.35; }
    .join { stroke: var(--c-di-strong); stroke-width: 2; stroke-dasharray: 4 4; }
    .done-bar { stroke: var(--text); stroke-width: 3.5; stroke-linecap: round; }
    .m circle { fill: var(--c-data); stroke: var(--pal-ink); stroke-width: 2.25; }
    .m.src circle { fill: var(--c-event); }
    .m.replay circle { fill: var(--c-signal); stroke-dasharray: 4 3; }
    .m.src.is-hl circle { stroke: var(--c-signal-strong); stroke-width: 4; }
    .m text { font-family: var(--font-display); font-weight: 600; font-size: 12px; fill: var(--pal-ink); }
    .m { animation: pop 300ms var(--ease-bounce); transform-box: fill-box; }
    .bar { fill: var(--c-di); stroke: var(--pal-ink); stroke-width: 2; }
    .barlab { font-size: 11px; font-weight: 600; fill: var(--pal-ink); }
    .now { stroke: var(--c-signal-strong); stroke-width: 2.5; stroke-dasharray: 6 4; }
    .legend { margin: 2px 22px 10px; font-size: var(--fs-sm); color: var(--text-muted); }
    .sw { display: inline-block; width: 12px; height: 12px; border-radius: 50%; vertical-align: -1px; border: 1.5px solid var(--pal-ink); }
    .src-sw { background: var(--c-event); }
    .got-sw { background: var(--c-data); }
    .rep-sw { background: var(--c-signal); border-style: dashed; }
    @keyframes pop { from { transform: scale(0.4); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .m { animation: none; } }
  `,
})
export class RxjsSubjectsVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly Math = Math;
  protected readonly kinds = KINDS;
  protected readonly script = SCRIPT;
  protected readonly subY = SUB_Y;
  protected readonly shareOps: { id: ShareOp; label: string }[] = [
    { id: 'none', label: 'không có (cold)' },
    { id: 'share', label: 'share()' },
    { id: 'shareReplay', label: 'shareReplay(1)' },
  ];
  protected readonly mode = signal<Mode>('kinds');
  protected readonly kind = signal<Kind>('Subject');
  protected readonly shareOp = signal<ShareOp>('none');
  protected readonly bJoin = signal(1500);
  protected readonly deliveries = computed(() => simulateSubject(this.kind()));
  protected readonly shareResult = computed(() => simulateShare(this.shareOp(), this.bJoin()));

  protected readonly tl = createTimeline<number>(0, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag) this.ctx.completeChallenge(s.tag);
    },
  });

  constructor() {
    this.runKinds(false);
  }

  protected x(t: number): number {
    return 90 + t * 72;
  }
  protected xs(ms: number): number {
    return 90 + (Math.min(ms, 2800) / 2800) * 650;
  }
  protected joinT(s: string): number {
    return SCRIPT.find((e) => e.sub === s)!.t;
  }
  /** Nhiều giá trị cùng lúc (phát lại) thì xếp lệch sang phải cho dễ nhìn */
  protected offset(d: Delivery): number {
    const same = this.deliveries().filter((x) => x.sub === d.sub && x.t === d.t);
    return same.indexOf(d) * 30 + (d.replay || same.length > 1 ? 16 : 0);
  }

  protected setMode(m: Mode): void {
    this.mode.set(m);
    if (m === 'kinds') this.runKinds(false);
    else this.runShare(false);
  }

  private got(sub: string, t: number): string {
    const vals = this.deliveries().filter((d) => d.sub === sub && d.t === t);
    if (!vals.length) return 'không nhận gì';
    return vals.map((d) => (d.v === '|' ? 'complete' : (d.replay ? `${d.v} (phát lại)` : String(d.v)))).join(', ');
  }

  protected runKinds(autoplay = true): void {
    const k = this.kind();
    const steps: Step<number>[] = [{ frame: 0, caption: `Tạo ${k === 'BehaviorSubject' ? 'new BehaviorSubject(0)' : k === 'ReplaySubject' ? 'new ReplaySubject(2)' : `new ${k}()`}.`, anchor: KINDS.find((x) => x.id === k)!.anchor, duration: 900 }];
    for (const e of SCRIPT) {
      if (e.type === 'next') {
        const active = SCRIPT.filter((s) => s.type === 'sub' && s.t < e.t).map((s) => 'Sub ' + s.sub);
        const who = k === 'AsyncSubject' ? 'AsyncSubject giữ lại, chưa phát cho ai.' : active.length ? `${active.join(', ')} nhận ${e.v}.` : 'chưa có subscriber nào.';
        steps.push({ frame: e.t, caption: `next(${e.v}): ${who}`, anchor: 'next', sound: 'pop', duration: 1100 });
      } else if (e.type === 'complete') {
        steps.push({ frame: e.t, caption: `complete(): ${k === 'AsyncSubject' ? 'lúc này mới phát giá trị cuối (4) cho mọi subscriber, rồi kết thúc.' : 'mọi subscriber nhận thông báo kết thúc.'}`, anchor: 'complete', duration: 1100 });
      } else {
        const g = this.got(e.sub!, e.t);
        let tag: string | undefined;
        if (k === 'BehaviorSubject' && e.sub === 'B') tag = 'sj-behavior';
        if (k === 'ReplaySubject' && e.sub === 'C') tag = 'sj-replay';
        steps.push({ frame: e.t, caption: `Sub ${e.sub} subscribe ${e.t > 7 ? 'SAU khi đã complete' : 'muộn'}: ngay lúc đăng ký ${g === 'không nhận gì' ? 'không nhận gì từ quá khứ' : `nhận ${g}`}.`, anchor: 'subscribe', tag, sound: g === 'không nhận gì' ? 'boop' : 'ting', duration: 1300 });
      }
    }
    this.tl.load(steps, autoplay);
  }

  protected runShare(autoplay = true): void {
    const op = this.shareOp();
    const bj = this.bJoin();
    const r = simulateShare(op, bj);
    const label = op === 'none' ? 'getUser()' : `getUser().pipe(${op === 'share' ? 'share()' : 'shareReplay(1)'})`;
    const steps: Step<number>[] = [
      { frame: 0, caption: `Sub A subscribe ${label} → bắt đầu request #1.`, anchor: op === 'shareReplay' ? 'shareReplay' : 'subscribe', duration: 1100 },
    ];
    const evs: { t: number; c: string; sound?: Step<number>['sound'] }[] = [{ t: 1000, c: 'Request #1 trả về: Sub A nhận user rồi complete.', sound: 'pop' }];
    if (bj < 1000) {
      evs.push({ t: bj, c: op === 'none' ? 'Sub B subscribe: Observable cold chạy lại từ đầu → request #2.' : `Sub B subscribe khi request #1 còn đang chạy → ${op} cho B dùng chung request đó.` });
      if (op !== 'none') evs[0].c = 'Request #1 trả về: cả Sub A và Sub B cùng nhận user.';
    } else {
      evs.push({
        t: bj,
        c:
          op === 'none' ? 'Sub B subscribe: Observable cold chạy lại từ đầu → request #2.'
          : op === 'share' ? 'Sub B subscribe sau khi nguồn đã complete: share() không giữ kết quả nên subscribe lại nguồn → request #2.'
          : 'Sub B subscribe sau khi request đã xong: shareReplay(1) phát lại ngay user đã cache, không gọi lại server.',
        sound: r.bCached ? 'ting' : 'boop',
      });
    }
    if (r.reqs.length > 1) evs.push({ t: r.b, c: 'Request #2 trả về: Sub B nhận user.', sound: 'pop' });
    evs.sort((a, b) => a.t - b.t);
    for (const e of evs) steps.push({ frame: e.t, caption: `${(e.t / 1000).toFixed(1)}s — ${e.c}`, anchor: op === 'shareReplay' ? 'shareReplay' : 'subscribe', sound: e.sound, duration: 1200 });
    const ok = r.reqs.length === 1;
    steps.push({
      frame: Math.max(r.b, ...r.reqs.map((q) => q.end)) + 200,
      caption: `Tổng: ${r.reqs.length} request cho 2 subscriber.${ok ? ' Đã chia sẻ thành công.' : ''}`,
      tag: ok && op === 'shareReplay' && bj === 1500 ? 'sj-share' : undefined,
      sound: ok ? 'ting' : 'boop',
      duration: 1000,
    });
    this.tl.load(steps, autoplay);
  }
}
