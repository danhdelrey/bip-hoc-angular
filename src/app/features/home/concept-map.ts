import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { LESSONS } from '../../content/lessons.registry';
import { Icon } from '../../shared/ui/icon/icon';
import { type RoughSpec, RoughShape } from '../../shared/ui/rough/rough';

const W = 1400;
const H = 760;

interface Island {
  name: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  color: string;
  seed: number;
  sub?: boolean;
}

const MAIN_ISLANDS: Island[] = [
  { name: 'Đảo Nền Móng', cx: 490, cy: 220, w: 380, h: 270, color: 'var(--pal-mint)', seed: 3 },
  { name: 'Quần đảo Template', cx: 490, cy: 545, w: 380, h: 250, color: 'var(--pal-lemon)', seed: 8 },
  { name: 'Đảo Dịch Vụ', cx: 910, cy: 215, w: 380, h: 260, color: 'var(--pal-lavender)', seed: 13 },
  { name: 'Đảo Phản Ứng', cx: 910, cy: 540, w: 420, h: 270, color: 'var(--pal-sky)', seed: 21 },
];
const SUB_ISLANDS: Island[] = [
  { name: 'Nền Móng+', cx: 125, cy: 190, w: 230, h: 200, color: 'color-mix(in srgb, var(--pal-mint) 55%, var(--pal-coral))', seed: 31, sub: true },
  { name: 'Template+', cx: 125, cy: 625, w: 230, h: 200, color: 'color-mix(in srgb, var(--pal-lemon) 55%, var(--pal-coral))', seed: 37, sub: true },
  { name: 'Dịch Vụ+', cx: 1275, cy: 150, w: 230, h: 200, color: 'color-mix(in srgb, var(--pal-lavender) 55%, var(--pal-coral))', seed: 41, sub: true },
  { name: 'Phản Ứng+', cx: 1275, cy: 620, w: 230, h: 200, color: 'color-mix(in srgb, var(--pal-sky) 55%, var(--pal-coral))', seed: 43, sub: true },
];

/** Đường mòn trên mỗi đảo chính: đi qua các bài theo thứ tự học */
const TRAILS: string[][] = [
  ['component', 'data-binding', 'input-output', 'lifecycle'],
  ['control-flow', 'pipes', 'defer', 'tailwind'],
  ['dependency-injection', 'routing', 'http'],
  ['signals', 'rxjs', 'change-detection', 'forms'],
];

/**
 * Đường rẽ nhánh: từ bài cuối của đảo chính → ngã rẽ có biển "Nâng cao"
 * → cầu gỗ qua biển → hai bài trên đảo phụ.
 * Nhánh "mở" (sáng màu, có dấu chân chạy) khi đã học xong mọi bài của đảo chính.
 */
interface Branch {
  island: string; // tên đảo phụ (khớp LessonMeta.island)
  trail: number; // chỉ số trong TRAILS
  fork: [number, number]; // chỗ đặt biển chỉ đường
  bridge: [number, number, number, number];
  to: [string, string];
  bend: [number, number][]; // điểm điều khiển: bài cuối→ngã rẽ, đầu cầu→bài 1, bài 1→bài 2
}
const BRANCHES: Branch[] = [
  { island: 'Nền Móng+', trail: 0, fork: [342, 280], bridge: [314, 276, 198, 268], to: ['content-projection', 'dynamic-components'], bend: [[392, 300], [172, 262], [100, 215]] },
  { island: 'Template+', trail: 1, fork: [352, 640], bridge: [318, 640, 238, 636], to: ['performance', 'accessibility'], bend: [[410, 650], [190, 640], [175, 660]] },
  { island: 'Dịch Vụ+', trail: 2, fork: [1062, 192], bridge: [1092, 186, 1166, 174], to: ['di-advanced', 'ssr-hydration'], bend: [[1030, 185], [1205, 175], [1290, 175]] },
  { island: 'Phản Ứng+', trail: 3, fork: [1086, 576], bridge: [1106, 584, 1164, 602], to: ['rxjs-flattening', 'signal-store'], bend: [[1070, 595], [1200, 610], [1300, 640]] },
];

const PINS: Record<string, [number, number]> = {
  component: [405, 175],
  'data-binding': [560, 160],
  'input-output': [595, 255],
  lifecycle: [445, 292],
  'control-flow': [400, 520],
  pipes: [550, 498],
  defer: [600, 588],
  tailwind: [470, 622],
  'dependency-injection': [800, 205],
  http: [995, 165],
  routing: [940, 282],
  signals: [795, 515],
  rxjs: [985, 478],
  'change-detection': [870, 622],
  forms: [1035, 590],
  'content-projection': [140, 240],
  'dynamic-components': [92, 152],
  performance: [160, 610],
  accessibility: [125, 696],
  'di-advanced': [1240, 205],
  'ssr-hydration': [1300, 112],
  'rxjs-flattening': [1240, 605],
  'signal-store': [1285, 694],
};

/** Đường biển nối các đảo chính (khái niệm liên quan giữa hai đảo) */
const ROUTES: [string, string][] = [
  ['lifecycle', 'control-flow'],
  ['component', 'dependency-injection'],
  ['input-output', 'signals'],
  ['rxjs', 'http'],
  ['routing', 'defer'],
];

const pt = (p: [number, number]) => `${p[0]} ${p[1]}`;

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
          <g appRough [spec]="ellipse(i)" [seed]="i.seed" [roughness]="2.4" [fill]="true" class="island" [class.sub]="i.sub" [style.--r-fill]="i.color" />
          <g appRough [spec]="shore(i)" [seed]="i.seed + 1" [roughness]="2" class="shore" />
          <text class="island-name" [class.sub]="i.sub" [attr.x]="i.cx" [attr.y]="i.cy - i.h / 2 + (i.sub ? 8 : 12)" text-anchor="middle">{{ i.name }}</text>
        }
        @for (r of routes; track $index) {
          <g appRough [spec]="r" [seed]="$index + 40" class="route" />
        }
        <!-- Đường mòn trên đảo chính -->
        @for (d of trails; track $index) {
          <path class="road-edge main" [attr.d]="d" />
          <path class="road main" [attr.d]="d" />
        }
        <!-- Đường rẽ nhánh sang đảo phụ -->
        @for (br of branches(); track br.island) {
          <g class="branch" [class.open]="br.open">
            <path class="road-edge" [attr.d]="br.road1" />
            <path class="road-edge" [attr.d]="br.road2" />
            <path class="road" [attr.d]="br.road1" />
            <path class="road" [attr.d]="br.road2" />
            <path class="steps" [attr.d]="br.road1" />
            <path class="steps" [attr.d]="br.road2" />
            <g class="bridge">
              <line class="rail" [attr.x1]="br.bridge[0]" [attr.y1]="br.bridge[1] - 9" [attr.x2]="br.bridge[2]" [attr.y2]="br.bridge[3] - 9" />
              <line class="rail" [attr.x1]="br.bridge[0]" [attr.y1]="br.bridge[1] + 9" [attr.x2]="br.bridge[2]" [attr.y2]="br.bridge[3] + 9" />
              @for (k of planks; track k) {
                <line class="plank" [attr.x1]="br.bridge[0] + (br.bridge[2] - br.bridge[0]) * k" [attr.y1]="br.bridge[1] + (br.bridge[3] - br.bridge[1]) * k - 10"
                      [attr.x2]="br.bridge[0] + (br.bridge[2] - br.bridge[0]) * k" [attr.y2]="br.bridge[1] + (br.bridge[3] - br.bridge[1]) * k + 10" />
              }
            </g>
            <g class="sign" [attr.transform]="'translate(' + br.fork[0] + ' ' + br.fork[1] + ')'">
              <line class="post" x1="0" y1="0" x2="0" y2="-40" />
              <path class="board" [attr.d]="br.left ? 'M6 -64 v26 h-104 l-13 -13 l13 -13 z' : 'M-6 -64 h104 l13 13 l-13 13 h-104 z'" />
              <text class="sign-text" [attr.x]="(br.left ? -48 : 48) + (br.open ? 0 : 9)" y="-46" text-anchor="middle">Nâng cao</text>
              @if (!br.open) {
                <g class="lock" [attr.transform]="br.left ? 'translate(-80 -53)' : 'translate(16 -53)'">
                  <rect x="-6" y="-1" width="12" height="10" rx="2" />
                  <path d="M-3.5 -1 v-3 a3.5 3.5 0 0 1 7 0 v3" />
                </g>
              }
              <ellipse class="post-base" cx="0" cy="0" rx="9" ry="3.5" />
            </g>
          </g>
        }
        <!-- La bàn & thuyền -->
        <g class="compass" transform="translate(700 385)">
          <circle r="34" />
          <path d="M0 -28 L7 0 L0 28 L-7 0 Z" />
          <text y="-38" text-anchor="middle">B</text>
        </g>
        <g class="boat" transform="translate(640 718)">
          <path d="M-26 0 h52 l-10 14 h-32 z" />
          <path d="M0 0 v-34 l20 26 z" />
        </g>
      </svg>
      @for (l of pins(); track l.slug) {
        <a class="pin" [routerLink]="['/bai', l.slug]" [style.left.%]="l.x" [style.top.%]="l.y"
           [class.done]="l.done" [class.next]="l.next" [class.adv]="l.tier === 'advanced'" [attr.aria-label]="'Bài ' + l.number + ': ' + l.title + (l.done ? ' (đã xong)' : '')">
          <span class="dot">
            @if (l.done) { <app-icon name="check" [size]="18" /> } @else { <app-icon [name]="l.icon" [size]="18" /> }
          </span>
          <span class="label"><b>{{ l.number }}</b> {{ l.title }}</span>
        </a>
      }
    </div>
  `,
  styles: `
    :host { display: block; overflow-x: auto; padding: 0 8px 10px 0; }
    .map { position: relative; width: 100%; min-width: 860px; aspect-ratio: 1400 / 760; border: var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; background: color-mix(in srgb, var(--c-brand) 22%, var(--surface)); }
    .sea { position: absolute; inset: 0; width: 100%; height: 100%; }
    .wave { fill: none; stroke: color-mix(in srgb, var(--line) 25%, transparent); stroke-width: 2; stroke-linecap: round; }
    .island { --r-stroke: var(--line); --r-sw: 2; }
    .shore { --r-stroke: color-mix(in srgb, var(--pal-cream) 80%, transparent); --r-sw: 6; }
    .island-name { font-family: var(--font-display); font-weight: 800; font-size: 22px; fill: var(--pal-ink); paint-order: stroke; stroke: var(--pal-cream); stroke-width: 5px; }
    .island-name.sub { font-size: 18px; }
    .road-edge { fill: none; stroke: var(--pal-ink); stroke-width: 15; stroke-linecap: round; stroke-linejoin: round; opacity: 0.55; }
    .road { fill: none; stroke: color-mix(in srgb, var(--pal-cream) 70%, #c8b89a); stroke-width: 11; stroke-linecap: round; stroke-linejoin: round; }
    .steps { fill: none; stroke: var(--pal-ink); stroke-width: 2.25; stroke-linecap: round; stroke-dasharray: 2 10; opacity: 0.45; }
    .branch.open .road-edge { opacity: 1; }
    .branch.open .road { stroke: var(--pal-cream); }
    .branch.open .steps { stroke: var(--c-accent); stroke-width: 4; stroke-dasharray: 1 12; opacity: 1; }
    @media (prefers-reduced-motion: no-preference) {
      .branch.open .steps { animation: march 1.6s linear infinite; }
    }
    @keyframes march { to { stroke-dashoffset: -26; } }
    .bridge .rail { stroke: var(--pal-ink); stroke-width: 2.25; stroke-linecap: round; }
    .bridge .plank { stroke-width: 5; stroke: #a16207; stroke-linecap: round; }
    .branch:not(.open) .bridge { opacity: 0.7; }
    .post { stroke: #7c4a12; stroke-width: 5; stroke-linecap: round; }
    .post-base { fill: var(--pal-ink); opacity: 0.25; }
    .board { fill: #f4c27a; stroke: var(--pal-ink); stroke-width: 2; stroke-linejoin: round; }
    .branch.open .board { fill: var(--c-accent); }
    .sign-text { font-family: var(--font-display); font-weight: 800; font-size: 15px; fill: var(--pal-ink); }
    .lock rect { fill: var(--pal-cream); stroke: var(--pal-ink); stroke-width: 2; }
    .lock path { fill: none; stroke: var(--pal-ink); stroke-width: 2; }
    .road.main { stroke: color-mix(in srgb, var(--pal-cream) 85%, #c8b89a); stroke-width: 9; }
    .road-edge.main { stroke-width: 13; opacity: 0.35; }
    .route { --r-stroke: var(--line); --r-sw: 2; }
    .route ::ng-deep .r-stroke { stroke-dasharray: 3 9; opacity: 0.6; }
    .compass circle { fill: var(--surface); stroke: var(--line); stroke-width: 2.25; }
    .compass path { fill: var(--c-error); stroke: var(--line); stroke-width: 2; }
    .compass text { font-family: var(--font-display); font-weight: 800; fill: var(--text); }
    .boat path { fill: var(--surface); stroke: var(--line); stroke-width: 2.25; stroke-linejoin: round; }
    @media (prefers-reduced-motion: no-preference) {
      .boat { animation: sail 6s var(--ease-in-out) infinite alternate; }
    }
    @keyframes sail { to { transform: translate(760px, 712px) rotate(3deg); } }
    .pin { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: var(--pal-ink); z-index: 2; }
    .dot { display: grid; place-items: center; width: 42px; height: 42px; background: var(--pal-cream); border: var(--border-w) solid var(--line); border-radius: 50% 50% 50% 8px; transform: rotate(-45deg); box-shadow: var(--shadow-sm); transition: transform var(--dur-fast) var(--ease-bounce); }
    .dot app-icon { transform: rotate(45deg); }
    .pin:hover .dot, .pin:focus-visible .dot { transform: rotate(-45deg) scale(1.2); }
    .pin.done .dot { background: var(--c-data); }
    .pin.adv .dot { border-style: dashed; }
    .pin.next .dot { background: var(--c-signal); }
    @media (prefers-reduced-motion: no-preference) {
      .pin.next .dot { animation: hop 1.4s var(--ease-bounce) infinite; }
    }
    @keyframes hop { 0%, 100% { transform: rotate(-45deg) translate(0, 0); } 50% { transform: rotate(-45deg) translate(4px, -4px); } }
    .label { padding: 1px 8px; font-size: 12px; font-weight: 800; white-space: nowrap; background: var(--pal-cream); border: var(--border-w-thin) solid var(--line); border-radius: 8px; }
    .label b { font-family: var(--font-display); }
    @media (max-width: 760px) { .label { font-size: 9.5px; padding: 0 4px; } .dot { width: 28px; height: 28px; } .island-name { font-size: 28px; } }
  `,
})
export class ConceptMap {
  private readonly progress = inject(ProgressStore);
  protected readonly W = W;
  protected readonly H = H;
  protected readonly islands = [...MAIN_ISLANDS, ...SUB_ISLANDS];
  protected readonly planks = [0.12, 0.3, 0.5, 0.7, 0.88];
  protected readonly waves = Array.from({ length: 40 }, (_, i) => [(i * 137) % 1360 + 10, (i * 83) % 730 + 15]);

  protected readonly branches = computed(() => {
    const done = this.progress.completed();
    return BRANCHES.map((b) => {
      const [bx1, by1, bx2, by2] = b.bridge;
      const sub = SUB_ISLANDS.find((i) => i.name === b.island)!;
      const trail = TRAILS[b.trail];
      const last = trail[trail.length - 1];
      return {
        island: b.island,
        fork: b.fork,
        bridge: b.bridge,
        left: sub.cx < b.fork[0],
        open: trail.every((s) => done.has(s)),
        road1: `M${pt(PINS[last])} Q${pt(b.bend[0])} ${pt(b.fork)} L${bx1} ${by1}`,
        road2: `M${bx2} ${by2} Q${pt(b.bend[1])} ${pt(PINS[b.to[0]])} Q${pt(b.bend[2])} ${pt(PINS[b.to[1]])}`,
      };
    });
  });

  /** đường mòn trên đảo chính: cong nhẹ qua từng bài */
  protected readonly trails = TRAILS.map((t) =>
    t.reduce((d, slug, i) => {
      const [x, y] = PINS[slug];
      if (i === 0) return `M${x} ${y}`;
      const [px, py] = PINS[t[i - 1]];
      const cx = (px + x) / 2 + (y - py) * 0.18;
      const cy = (py + y) / 2 - (x - px) * 0.18;
      return `${d} Q${cx} ${cy} ${x} ${y}`;
    }, ''),
  );

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

  protected ellipse(i: Island): RoughSpec {
    return { kind: 'ellipse', cx: i.cx, cy: i.cy, w: i.w, h: i.h };
  }
  protected shore(i: Island): RoughSpec {
    return { kind: 'ellipse', cx: i.cx, cy: i.cy, w: i.w + 26, h: i.h + 22 };
  }
}
