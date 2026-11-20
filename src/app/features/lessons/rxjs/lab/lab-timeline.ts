import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, input, signal } from '@angular/core';
import { type LabRun, fmt } from './lab-runtime';

/** Màu lane: nền (chấm) + bản đậm (chữ, đạt AA) — lấy từ token ngữ nghĩa của site. */
export const LANE_COLORS = [
  { fill: 'var(--c-di)', text: 'var(--c-di-strong)' },
  { fill: 'var(--c-data)', text: 'var(--c-data-strong)' },
  { fill: 'var(--c-event)', text: 'var(--c-event-strong)' },
  { fill: 'var(--c-primary)', text: 'var(--c-primary-text)' },
  { fill: 'var(--c-signal)', text: 'var(--c-signal-strong)' },
];
const HTTP_FILL: Record<string, string> = { pending: 'var(--c-signal)', done: 'var(--c-data)', cancelled: 'var(--line-strong)', error: 'var(--c-error)' };

interface Pt { x: number; type: string; short: string; title: string; above: boolean }
interface Lane { label: string; short: string; y: number; fill: string; text: string; points: Pt[] }
interface Bar { x: number; y: number; w: number; fill: string; op: number; label: string; title: string }

function niceStep(max: number): number {
  const raw = max / 6;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / p;
  return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * p;
}

/** Sơ đồ marble của một lần chạy: mỗi label của spy()/watch() là một lane, request HTTP là các thanh. */
@Component({
  selector: 'app-lab-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let v = vm();
    @if (!v) {
      <p class="empty">Chưa có sự kiện. Dùng <code>spy('tên')</code>, <code>watch('tên', signal)</code> hoặc <code>fakeApi</code> để vẽ timeline.</p>
    } @else {
      <svg [attr.width]="v.W" [attr.height]="v.H" [attr.viewBox]="'0 0 ' + v.W + ' ' + v.H" role="img" aria-label="Timeline các giá trị theo thời gian">
        @for (t of v.ticks; track t.label) {
          <line class="grid" [attr.x1]="t.x" [attr.x2]="t.x" y1="14" [attr.y2]="v.H" />
          <text class="tick" [attr.x]="t.x" y="11" text-anchor="middle">{{ t.label }}</text>
        }
        @for (lane of v.lanes; track lane.label) {
          <text class="lane" x="6" [attr.y]="lane.y + 4" [style.fill]="lane.text">{{ lane.short }}</text>
          <line class="axis" [attr.x1]="v.L" [attr.x2]="v.W - 16" [attr.y1]="lane.y" [attr.y2]="lane.y" />
          @for (p of lane.points; track $index) {
            <g>
              <title>{{ p.title }}</title>
              @switch (p.type) {
                @case ('next') {
                  <circle [attr.cx]="p.x" [attr.cy]="lane.y" r="6.5" [style.fill]="lane.fill" class="dot" />
                  <text class="val" [attr.x]="p.x" [attr.y]="p.above ? lane.y - 12 : lane.y + 22" text-anchor="middle">{{ p.short }}</text>
                }
                @case ('error') {
                  <path class="x" [attr.d]="'M' + (p.x - 6) + ' ' + (lane.y - 6) + 'L' + (p.x + 6) + ' ' + (lane.y + 6) + 'M' + (p.x + 6) + ' ' + (lane.y - 6) + 'L' + (p.x - 6) + ' ' + (lane.y + 6)" />
                }
                @default {
                  <line class="done" [attr.x1]="p.x" [attr.x2]="p.x" [attr.y1]="lane.y - 11" [attr.y2]="lane.y + 11" />
                }
              }
            </g>
          }
        }
        @if (v.bars.length) {
          <text class="lane" x="6" [attr.y]="v.httpY + 12" style="fill: var(--c-event-strong)">http</text>
          @for (b of v.bars; track $index) {
            <g>
              <title>{{ b.title }}</title>
              <rect [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" height="16" rx="4" [style.fill]="b.fill" [attr.fill-opacity]="b.op" />
              @if (b.label) { <text class="bar" [attr.x]="b.x + 5" [attr.y]="b.y + 12">{{ b.label }}</text> }
            </g>
          }
        }
        @if (v.destroyX !== null) {
          <line class="destroy" [attr.x1]="v.destroyX" [attr.x2]="v.destroyX" y1="14" [attr.y2]="v.H" />
          <text class="destroy-t" [attr.x]="v.destroyX + 4" y="26">destroy</text>
        }
      </svg>
    }
  `,
  styles: `
    :host { display: block; padding: 10px 8px; }
    .empty { color: var(--text-muted); font-size: var(--fs-sm); padding: 8px; margin: 0; }
    svg { display: block; font-family: var(--font-mono); font-size: 11px; }
    .grid { stroke: var(--line); stroke-width: 1; }
    .tick { fill: var(--text-muted); }
    .lane { font-weight: 700; }
    .axis { stroke: var(--line-strong); stroke-width: 1; }
    .dot { stroke: var(--surface); stroke-width: 2; }
    .val { fill: var(--text); }
    .x { stroke: var(--c-error-strong); stroke-width: 3; }
    .done { stroke: var(--text); stroke-width: 3; }
    .bar { fill: var(--pal-ink); font-size: 10px; }
    .destroy { stroke: var(--c-error-strong); stroke-dasharray: 4 3; }
    .destroy-t { fill: var(--c-error-strong); font-size: 10px; }
  `,
})
export class LabTimeline {
  readonly run = input<LabRun | null>(null);
  /** Đổi giá trị để vẽ lại (version của run + nhịp đồng hồ khi đang chạy) */
  readonly rev = input(0);

  private readonly width = signal(600);

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(([e]) => this.width.set(Math.max(320, Math.floor(e.contentRect.width))));
      ro.observe(host);
      inject(DestroyRef).onDestroy(() => ro.disconnect());
    }
  }

  protected readonly vm = computed(() => {
    this.rev();
    const run = this.run();
    if (!run || (!run.events.length && !run.http.length)) return null;
    const tNow = run.now();
    let tMax = 1000;
    for (const e of run.events) tMax = Math.max(tMax, e.t);
    for (const h of run.http) tMax = Math.max(tMax, h.tEnd ?? (run.active ? tNow : h.t));
    if (run.destroyedAt !== null) tMax = Math.max(tMax, run.destroyedAt);
    tMax *= 1.06;

    const W = this.width() - 16, L = 92, R = 16, top = 26, laneH = 50;
    const x = (t: number) => L + (t / tMax) * (W - L - R);
    const labels = [...new Set(run.events.map((e) => e.label))];
    const lanes: Lane[] = labels.map((label, i) => {
      const c = LANE_COLORS[run.colorOf(label)];
      let k = 0;
      return {
        label,
        short: label.length > 11 ? label.slice(0, 10) + '…' : label,
        y: top + i * laneH + laneH / 2 + 4,
        fill: c.fill,
        text: c.text,
        points: run.events
          .filter((e) => e.label === label)
          .map((e) => {
            const full = e.type === 'complete' ? 'complete' : e.type === 'error' ? 'error: ' + fmt(e.value, 0, true) : fmt(e.value);
            return {
              x: x(e.t),
              type: e.type,
              short: full.length > 12 ? full.slice(0, 11) + '…' : full,
              title: e.t + 'ms · ' + full,
              above: e.type !== 'next' || k++ % 2 === 0,
            };
          }),
      };
    });

    // xếp các request vào hàng không chồng lên nhau
    const rows: number[] = [];
    const httpY = top + lanes.length * laneH + 10;
    const bars: Bar[] = run.http.map((h) => {
      const end = h.tEnd ?? tNow;
      let r = rows.findIndex((last) => last < h.t - 2);
      if (r === -1) { rows.push(end); r = rows.length - 1; } else rows[r] = end;
      const x1 = x(h.t), w = Math.max(4, x(end) - x1);
      const fit = Math.floor(w / 6.4) - 1;
      return {
        x: x1, y: httpY + r * 22, w,
        fill: HTTP_FILL[h.status], op: h.status === 'cancelled' ? 0.45 : 0.9,
        label: w > 40 ? (h.path.length > fit ? h.path.slice(0, Math.max(3, fit)) + '…' : h.path) : '',
        title: h.method + ' ' + h.path + ' · ' + h.status + ' · ' + h.t + '→' + (h.tEnd ?? '…') + 'ms',
      };
    });
    const H = httpY + (bars.length ? rows.length * 22 + 10 : 0);
    const step = niceStep(tMax);
    const ticks: { x: number; label: string }[] = [];
    for (let t = 0; t <= tMax; t += step) ticks.push({ x: x(t), label: Math.round(t) + 'ms' });
    return { W, H, L, lanes, bars, httpY, ticks, destroyX: run.destroyedAt !== null ? x(run.destroyedAt) : null };
  });
}
