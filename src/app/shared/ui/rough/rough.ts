import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import rough from 'roughjs';
import type { Options } from 'roughjs/bin/core';

/** Mô tả một hình (vẽ bằng rough.js với nét sạch) */
export type RoughSpec =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'ellipse'; cx: number; cy: number; w: number; h: number }
  | { kind: 'path'; d: string }
  | { kind: 'curve'; points: [number, number][] };

export interface RoughPath {
  d: string;
  cls: 'r-stroke' | 'r-fill';
}

const gen = rough.generator();
const cache = new Map<string, RoughPath[]>();

/**
 * Sinh path SVG từ rough.js (nét sạch). Seed cố định => hình không rung khi render lại.
 * Kết quả được cache để không tính lại mỗi lần change detection.
 */
export function roughPaths(spec: RoughSpec, opts: Options = {}): RoughPath[] {
  const key = JSON.stringify([spec, opts]);
  const hit = cache.get(key);
  if (hit) return hit;
  // Phong cách tối giản: nét thẳng, sạch (roughness 0, một nét, tô đặc) — vẫn dùng chung API cũ
  const o: Options = {
    seed: 7, stroke: '#000', strokeWidth: 2, ...opts,
    roughness: 0, bowing: 0, disableMultiStroke: true, disableMultiStrokeFill: true, preserveVertices: true,
    fillStyle: 'solid',
  };
  let drawable;
  switch (spec.kind) {
    case 'line':
      drawable = gen.line(spec.x1, spec.y1, spec.x2, spec.y2, o);
      break;
    case 'rect':
      drawable = gen.rectangle(spec.x, spec.y, spec.w, spec.h, o);
      break;
    case 'ellipse':
      drawable = gen.ellipse(spec.cx, spec.cy, spec.w, spec.h, o);
      break;
    case 'curve':
      drawable = gen.curve(spec.points, o);
      break;
    default:
      drawable = gen.path(spec.d, o);
  }
  const paths = gen.toPaths(drawable).map<RoughPath>((p) => ({
    d: p.d,
    cls: p.fill && p.fill !== 'none' ? 'r-fill' : 'r-stroke',
  }));
  if (cache.size > 600) cache.clear();
  cache.set(key, paths);
  return paths;
}

/** <svg:g appRough [spec]> — vẽ một hình bằng nét bút tay. Màu qua CSS: --r-stroke, --r-fill, --r-sw */
@Component({
  selector: 'g[appRough]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (p of paths(); track $index) {
      <svg:path [attr.d]="p.d" [attr.class]="p.cls" [attr.pathLength]="draw() ? 1 : null" />
    }
  `,
  host: { '[class.is-draw]': 'draw()' },
  styles: `
    .r-stroke { fill: none; stroke: var(--r-stroke, var(--line)); stroke-width: var(--r-sw, 2); stroke-linecap: round; stroke-linejoin: round; vector-effect: var(--r-ve, none); }
    .r-fill { stroke: none; fill: var(--r-fill, transparent); }
    @media (prefers-reduced-motion: no-preference) {
      :host(.is-draw) .r-stroke { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw var(--r-dur, 700ms) var(--ease-out) forwards; }
    }
    @keyframes draw { to { stroke-dashoffset: 0; } }
  `,
})
export class RoughShape {
  readonly spec = input.required<RoughSpec>();
  readonly seed = input(7);
  readonly roughness = input(1.3);
  readonly fill = input(false);
  readonly fillStyle = input<'solid' | 'hachure' | 'zigzag' | 'cross-hatch'>('solid');
  readonly draw = input(false);

  protected readonly paths = computed(() =>
    roughPaths(this.spec(), {
      seed: this.seed(),
      roughness: this.roughness(),
      fill: this.fill() ? '#000' : undefined,
      fillStyle: this.fillStyle(),
      hachureGap: 6,
    }),
  );
}

/** Mũi tên, có thể cong; `flow` = dòng chảy chạy dọc mũi tên. */
@Component({
  selector: 'g[appArrow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RoughShape],
  template: `
    <svg:g appRough [spec]="body()" [seed]="seed()" [draw]="draw()" />
    <svg:g appRough [spec]="headA()" [seed]="seed() + 1" [draw]="draw()" />
    <svg:g appRough [spec]="headB()" [seed]="seed() + 2" [draw]="draw()" />
    @if (flow()) {
      <svg:path class="flow" [attr.d]="smooth()" />
    }
  `,
  styles: `
    .flow { fill: none; stroke: var(--arrow-flow, var(--c-signal)); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 3 14; opacity: 0.95; }
    @media (prefers-reduced-motion: no-preference) {
      .flow { animation: flow 700ms linear infinite; }
    }
    @keyframes flow { to { stroke-dashoffset: -17; } }
  `,
})
export class AnimatedArrow {
  readonly from = input.required<[number, number]>();
  readonly to = input.required<[number, number]>();
  /** độ cong: 0 = thẳng; dương/âm = cong sang hai phía */
  readonly bend = input(0);
  readonly seed = input(11);
  readonly draw = input(false);
  readonly flow = input(false);

  private readonly ctrl = computed<[number, number]>(() => {
    const [x1, y1] = this.from();
    const [x2, y2] = this.to();
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    return [mx - (dy / len) * this.bend(), my + (dx / len) * this.bend()];
  });

  protected readonly smooth = computed(() => {
    const [x1, y1] = this.from();
    const [x2, y2] = this.to();
    const [cx, cy] = this.ctrl();
    return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
  });

  protected readonly body = computed<RoughSpec>(() => ({ kind: 'path', d: this.smooth() }));

  private head(sign: 1 | -1): RoughSpec {
    const [x2, y2] = this.to();
    const [cx, cy] = this.ctrl();
    const ang = Math.atan2(y2 - cy, x2 - cx) + Math.PI + sign * 0.5;
    return { kind: 'line', x1: x2, y1: y2, x2: x2 + Math.cos(ang) * 13, y2: y2 + Math.sin(ang) * 13 };
  }
  protected readonly headA = computed(() => this.head(1));
  protected readonly headB = computed(() => this.head(-1));
}
