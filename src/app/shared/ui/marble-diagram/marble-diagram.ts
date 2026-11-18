import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Marble {
  id: string | number;
  t: number; // thời điểm (ms)
  label: string;
  kind?: 'data' | 'event' | 'signal' | 'error' | 'cancel' | 'muted';
}

export interface Lane {
  id: string;
  label: string;
  marbles: Marble[];
  /** máy operator vẽ phía trên lane này */
  operator?: string;
}

/**
 * Băng chuyền marble: mỗi lane là một stream, bi nằm theo thời gian.
 * `now` là đầu đọc thời gian (vạch dọc) — bi ở tương lai được ẩn.
 */
@Component({
  selector: 'app-marble-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + W + ' ' + height()" class="mb" role="img" [attr.aria-label]="ariaLabel()">
      @for (lane of lanes(); track lane.id; let i = $index) {
        @let y = laneY(i);
        @if (lane.operator) {
          <g class="op" [attr.transform]="'translate(' + W / 2 + ',' + (y - 40) + ')'">
            <rect x="-120" y="-16" width="240" height="32" rx="12" />
            <text text-anchor="middle" dominant-baseline="central">{{ lane.operator }}</text>
          </g>
        }
        <text class="lane-label" x="8" [attr.y]="y - 18">{{ lane.label }}</text>
        <line class="belt" [attr.x1]="PAD" [attr.x2]="W - 20" [attr.y1]="y" [attr.y2]="y" />
        <path class="belt-arrow" [attr.d]="'M' + (W - 30) + ' ' + (y - 8) + ' L' + (W - 18) + ' ' + y + ' L' + (W - 30) + ' ' + (y + 8)" />
        @for (m of lane.marbles; track m.id) {
          @if (m.t <= now()) {
            <g class="m" [class]="'m k-' + (m.kind ?? 'data')" [attr.transform]="'translate(' + x(m.t) + ',' + y + ')'">
              <circle r="15" />
              @if (m.kind === 'cancel') {
                <path class="x" d="M-8 -8 L8 8 M8 -8 L-8 8" />
              } @else {
                <text text-anchor="middle" dominant-baseline="central">{{ m.label }}</text>
              }
            </g>
          }
        }
      }
      <line class="now" [attr.x1]="x(now())" [attr.x2]="x(now())" y1="8" [attr.y2]="height() - 8" />
      <text class="now-label" [attr.x]="x(now())" [attr.y]="height() - 2" text-anchor="middle">{{ (now() / 1000).toFixed(1) }}s</text>
    </svg>
  `,
  styles: `
    :host { display: block; }
    .mb { width: 100%; height: auto; min-width: 560px; display: block; }
    .lane-label { font-family: var(--font-mono); font-weight: 700; font-size: 13px; fill: var(--text-muted); }
    .belt { stroke: var(--line); stroke-width: 6; stroke-linecap: round; opacity: 0.85; }
    .belt-arrow { fill: none; stroke: var(--line); stroke-width: 2.25; }
    .op rect { fill: var(--surface-2); stroke: var(--line); stroke-width: 2.25; }
    .op text { font-family: var(--font-mono); font-weight: 700; font-size: 14px; fill: var(--text); }
    .m circle { stroke: var(--pal-ink); stroke-width: 2.25; fill: var(--c-data); }
    .m text { font-family: var(--font-display); font-weight: 800; font-size: 13px; fill: var(--pal-ink); }
    .k-event circle { fill: var(--c-event); }
    .k-signal circle { fill: var(--c-signal); }
    .k-error circle { fill: var(--c-error); }
    .k-cancel circle { fill: var(--surface-sunken); stroke-dasharray: 4 3; }
    .k-muted circle { fill: var(--surface-sunken); }
    .k-muted text { fill: var(--text-muted); }
    .x { stroke: var(--c-error-strong); stroke-width: 2.5; stroke-linecap: round; }
    .m { transform-box: fill-box; }
    .m circle, .m text { animation: drop 360ms var(--ease-bounce); transform-origin: center; transform-box: fill-box; }
    @keyframes drop { from { transform: translateY(-14px) scale(0.6); opacity: 0; } }
    .now { stroke: var(--c-signal-strong); stroke-width: 2.25; stroke-dasharray: 6 4; }
    .now-label { font-family: var(--font-mono); font-weight: 700; font-size: 12px; fill: var(--c-signal-strong); }
  `,
})
export class MarbleDiagram {
  readonly lanes = input.required<Lane[]>();
  readonly duration = input(10000);
  readonly now = input(0);
  readonly ariaLabel = input('Sơ đồ marble');

  protected readonly W = 900;
  protected readonly PAD = 120;
  protected readonly height = computed(() => this.laneY(this.lanes().length - 1) + 44);

  protected laneY(i: number): number {
    return 52 + i * 104;
  }
  protected x(t: number): number {
    return this.PAD + (Math.min(t, this.duration()) / this.duration()) * (this.W - this.PAD - 50);
  }
}
