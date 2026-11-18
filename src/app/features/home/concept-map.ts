import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { LESSONS } from '../../content/lessons.registry';
import { Icon } from '../../shared/ui/icon/icon';
import { type RoughSpec, RoughShape } from '../../shared/ui/rough/rough';

const W = 1000;
const H = 620;

const ISLANDS: { name: string; cx: number; cy: number; w: number; h: number; color: string; seed: number }[] = [
  { name: 'Đảo Nền Móng', cx: 235, cy: 185, w: 400, h: 260, color: 'var(--pal-mint)', seed: 3 },
  { name: 'Quần đảo Template', cx: 255, cy: 480, w: 380, h: 200, color: 'var(--pal-lemon)', seed: 8 },
  { name: 'Đảo Dịch Vụ', cx: 725, cy: 170, w: 400, h: 240, color: 'var(--pal-lavender)', seed: 13 },
  { name: 'Đảo Phản Ứng', cx: 735, cy: 455, w: 440, h: 250, color: 'var(--pal-sky)', seed: 21 },
];

const PINS: Record<string, [number, number]> = {
  component: [140, 150],
  'data-binding': [290, 132],
  'input-output': [330, 230],
  lifecycle: [165, 255],
  'control-flow': [150, 470],
  pipes: [290, 440],
  defer: [365, 525],
  tailwind: [225, 545],
  'dependency-injection': [615, 165],
  http: [825, 128],
  routing: [790, 235],
  signals: [610, 432],
  rxjs: [795, 398],
  'change-detection': [690, 530],
  forms: [875, 480],
};

/** Đường biển nối các khái niệm liên quan */
const ROUTES: [string, string][] = [
  ['component', 'data-binding'],
  ['component', 'lifecycle'],
  ['data-binding', 'input-output'],
  ['lifecycle', 'control-flow'],
  ['control-flow', 'pipes'],
  ['pipes', 'defer'],
  ['component', 'dependency-injection'],
  ['dependency-injection', 'http'],
  ['dependency-injection', 'routing'],
  ['input-output', 'signals'],
  ['signals', 'rxjs'],
  ['signals', 'change-detection'],
  ['signals', 'forms'],
  ['rxjs', 'http'],
  ['routing', 'defer'],
  ['control-flow', 'tailwind'],
];

/** Bản đồ khái niệm kiểu bản đồ thế giới trong game: mỗi bài là một địa điểm trên đảo. */
@Component({
  selector: 'app-concept-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RoughShape, Icon],
  template: `
    <div class="map" role="group" aria-label="Bản đồ khái niệm Angular">
      <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" class="sea" aria-hidden="true">
        @for (w of waves; track $index) {
          <path class="wave" [attr.d]="'M' + w[0] + ' ' + w[1] + ' q8 -8 16 0 t16 0 t16 0'" />
        }
        @for (i of islands; track i.name) {
          <g appRough [spec]="ellipse(i)" [seed]="i.seed" [roughness]="2.4" [fill]="true" class="island" [style.--r-fill]="i.color" />
          <g appRough [spec]="shore(i)" [seed]="i.seed + 1" [roughness]="2" class="shore" />
          <text class="island-name" [attr.x]="i.cx" [attr.y]="i.cy - i.h / 2 + 30" text-anchor="middle">{{ i.name }}</text>
        }
        @for (r of routes; track $index) {
          <g appRough [spec]="r" [seed]="$index + 40" class="route" />
        }
        <!-- La bàn & thuyền -->
        <g class="compass" transform="translate(500 320)">
          <circle r="34" />
          <path d="M0 -28 L7 0 L0 28 L-7 0 Z" />
          <text y="-38" text-anchor="middle">B</text>
        </g>
        <g class="boat" transform="translate(470 560)">
          <path d="M-26 0 h52 l-10 14 h-32 z" />
          <path d="M0 0 v-34 l20 26 z" />
        </g>
      </svg>
      @for (l of pins(); track l.slug) {
        <a class="pin" [routerLink]="['/bai', l.slug]" [style.left.%]="l.x" [style.top.%]="l.y"
           [class.done]="l.done" [class.next]="l.next" [attr.aria-label]="'Bài ' + l.number + ': ' + l.title + (l.done ? ' (đã xong)' : '')">
          <span class="dot">
            @if (l.done) { <app-icon name="check" [size]="18" /> } @else { <app-icon [name]="l.icon" [size]="18" /> }
          </span>
          <span class="label"><b>{{ l.number }}</b> {{ l.title }}</span>
        </a>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .map { position: relative; width: 100%; aspect-ratio: 1000 / 620; border: var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; background: color-mix(in srgb, var(--c-brand) 22%, var(--surface)); }
    .sea { position: absolute; inset: 0; width: 100%; height: 100%; }
    .wave { fill: none; stroke: color-mix(in srgb, var(--line) 25%, transparent); stroke-width: 2.5; stroke-linecap: round; }
    .island { --r-stroke: var(--pal-ink); --r-sw: 3; }
    .shore { --r-stroke: color-mix(in srgb, var(--pal-cream) 80%, transparent); --r-sw: 6; }
    .island-name { font-family: var(--font-display); font-weight: 800; font-size: 22px; fill: var(--pal-ink); paint-order: stroke; stroke: var(--pal-cream); stroke-width: 5px; }
    .route { --r-stroke: var(--line); --r-sw: 2.5; }
    .route ::ng-deep .r-stroke { stroke-dasharray: 3 9; opacity: 0.6; }
    .compass circle { fill: var(--surface); stroke: var(--line); stroke-width: 3; }
    .compass path { fill: var(--c-error); stroke: var(--line); stroke-width: 2; }
    .compass text { font-family: var(--font-display); font-weight: 800; fill: var(--text); }
    .boat path { fill: var(--surface); stroke: var(--line); stroke-width: 3; stroke-linejoin: round; }
    @media (prefers-reduced-motion: no-preference) {
      .boat { animation: sail 6s var(--ease-in-out) infinite alternate; }
    }
    @keyframes sail { to { transform: translate(530px, 552px) rotate(3deg); } }
    .pin { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: var(--pal-ink); z-index: 2; }
    .dot { display: grid; place-items: center; width: 42px; height: 42px; background: var(--pal-cream); border: 3px solid var(--pal-ink); border-radius: 50% 50% 50% 8px; transform: rotate(-45deg); box-shadow: 3px 3px 0 var(--pal-ink); transition: transform var(--dur-fast) var(--ease-bounce); }
    .dot app-icon { transform: rotate(45deg); }
    .pin:hover .dot, .pin:focus-visible .dot { transform: rotate(-45deg) scale(1.2); }
    .pin.done .dot { background: var(--c-data); }
    .pin.next .dot { background: var(--c-signal); }
    @media (prefers-reduced-motion: no-preference) {
      .pin.next .dot { animation: hop 1.4s var(--ease-bounce) infinite; }
    }
    @keyframes hop { 0%, 100% { transform: rotate(-45deg) translate(0, 0); } 50% { transform: rotate(-45deg) translate(4px, -4px); } }
    .label { padding: 1px 8px; font-size: 12px; font-weight: 800; white-space: nowrap; background: var(--pal-cream); border: 2px solid var(--pal-ink); border-radius: 8px; }
    .label b { font-family: var(--font-display); }
    @media (max-width: 760px) { .label { font-size: 9.5px; padding: 0 4px; } .dot { width: 28px; height: 28px; } .island-name { font-size: 28px; } }
  `,
})
export class ConceptMap {
  private readonly progress = inject(ProgressStore);
  protected readonly W = W;
  protected readonly H = H;
  protected readonly islands = ISLANDS;
  protected readonly waves = Array.from({ length: 26 }, (_, i) => [(i * 137) % 960 + 10, (i * 83) % 590 + 15]);

  protected readonly routes: RoughSpec[] = ROUTES.map(([a, b]) => {
    const [x1, y1] = PINS[a];
    const [x2, y2] = PINS[b];
    const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
    const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
    return { kind: 'path', d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` };
  });

  protected readonly pins = computed(() => {
    const done = this.progress.completed();
    const next = LESSONS.find((l) => !done.has(l.slug))?.slug;
    return LESSONS.map((l) => ({
      ...l,
      x: (PINS[l.slug][0] / W) * 100,
      y: (PINS[l.slug][1] / H) * 100,
      done: done.has(l.slug),
      next: l.slug === next,
    }));
  });

  protected ellipse(i: (typeof ISLANDS)[number]): RoughSpec {
    return { kind: 'ellipse', cx: i.cx, cy: i.cy, w: i.w, h: i.h };
  }
  protected shore(i: (typeof ISLANDS)[number]): RoughSpec {
    return { kind: 'ellipse', cx: i.cx, cy: i.cy, w: i.w + 26, h: i.h + 22 };
  }
}
