import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { RoughShape } from '../../../shared/ui/rough/rough';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

export type Loc = 'root' | 'route' | 'shop' | 'badge' | 'panel';
export type Who = 'badge' | 'panel';

interface Frame {
  counters: Record<Loc, number | null>; // id instance của quầy ở mỗi tầng (null = không có quầy)
  got: Record<Who, Loc | 'error' | null>;
  walker: { who: Who; at: Loc | 'start' } | null;
  check: 'yes' | 'no' | null;
}

export const FLOORS: { loc: Loc; title: string; sub: string; anchor: string }[] = [
  { loc: 'root', title: 'Tầng thượng · Root', sub: '@Service() / app.config', anchor: 'service' },
  { loc: 'route', title: 'Tầng 2 · Route', sub: "path: 'cua-hang'", anchor: 'route-provider' },
  { loc: 'shop', title: 'Tầng 1 · ShopPage', sub: 'component cha', anchor: 'provider-shop' },
];

const LOC_NAME: Record<Loc, string> = {
  root: 'Tầng thượng (Root)',
  route: 'Tầng 2 (Route)',
  shop: 'Tầng 1 (ShopPage)',
  badge: 'phòng CartBadge',
  panel: 'phòng CartPanel',
};
const WHO_NAME: Record<Who, string> = { badge: 'CartBadge (B)', panel: 'CartPanel (C)' };
const CHAIN: Record<Who, Loc[]> = { badge: ['badge', 'shop', 'route', 'root'], panel: ['panel', 'shop', 'route', 'root'] };
const ANCHOR: Record<Loc, string> = { root: 'service', route: 'route-provider', shop: 'provider-shop', badge: 'provider-badge', panel: 'provider-panel' };

/** Màu riêng cho từng instance (luôn kèm số #id để không chỉ dựa vào màu) */
export const INSTANCE_COLOR: Record<Loc, string> = {
  root: 'var(--pal-lavender)',
  route: 'var(--pal-coral)',
  shop: 'var(--pal-sky)',
  badge: 'var(--pal-lemon)',
  panel: 'var(--pal-mint)',
};

/** Vị trí (theo % chiều ngang, px chiều dọc) của các quầy và điểm xuất phát — khớp với CSS */
const SPOT: Record<Loc | 'start-badge' | 'start-panel', { x: number; y: number }> = {
  root: { x: 60, y: 112 },
  route: { x: 60, y: 208 },
  shop: { x: 60, y: 304 },
  badge: { x: 38, y: 420 },
  panel: { x: 88, y: 420 },
  'start-badge': { x: 18, y: 420 },
  'start-panel': { x: 68, y: 420 },
};

@Component({
  selector: 'app-di-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, RoughShape, NgTemplateOutlet],
  templateUrl: './dependency-injection.visualizer.html',
  styleUrl: './dependency-injection.visualizer.css',
})
export class DiVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly floors = FLOORS;
  protected readonly color = INSTANCE_COLOR;
  protected readonly whoName = WHO_NAME;
  protected readonly whos: Who[] = ['badge', 'panel'];
  protected asLoc(v: unknown): Loc {
    return v as Loc;
  }

  private seq = 1;
  private sawError = false;
  private model: Frame = {
    counters: { root: this.seq++, route: null, shop: null, badge: null, panel: null },
    got: { badge: 'root', panel: 'root' },
    walker: null,
    check: null,
  };

  /** Số món trong mỗi instance (state "sống", không thuộc animation) */
  protected readonly counts = signal<Record<number, number>>({});

  protected readonly tl = createTimeline<Frame>(this.model, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag === 'resolved') this.checkChallenges(s.frame);
    },
  });

  protected readonly walkerPos = computed(() => {
    const w = this.tl.frame().walker;
    if (!w) return null;
    const key = w.at === 'start' ? (`start-${w.who}` as const) : w.at;
    return SPOT[key];
  });

  /** Đường đi trên cầu thang (vẽ tay) */
  protected readonly paths = [
    { kind: 'path' as const, d: 'M380 420 C 470 400, 560 360, 600 304' },
    { kind: 'path' as const, d: 'M880 420 C 790 400, 640 360, 600 304' },
    { kind: 'path' as const, d: 'M600 304 L 600 208 L 600 112' },
  ];

  // ---------- Thao tác ----------

  protected toggle(loc: Loc): void {
    const counters = { ...this.model.counters, [loc]: this.model.counters[loc] ? null : this.seq++ };
    this.lookup(['badge', 'panel'], counters, this.model.counters[loc] ? `Dỡ quầy ở ${LOC_NAME[loc]}.` : `Đặt quầy mới ở ${LOC_NAME[loc]} → tạo instance #${counters[loc]}.`, loc);
  }

  protected injectOne(who: Who): void {
    this.lookup([who], this.model.counters);
  }

  protected injectAll(): void {
    this.lookup(['badge', 'panel'], this.model.counters);
  }

  protected add(who: Who): void {
    const loc = this.tl.frame().got[who];
    if (!loc || loc === 'error') return;
    const id = this.tl.frame().counters[loc]!;
    this.counts.update((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }

  protected countOf(loc: Loc | 'error' | null): number {
    if (!loc || loc === 'error') return 0;
    const id = this.tl.frame().counters[loc];
    return id ? (this.counts()[id] ?? 0) : 0;
  }

  protected reset(): void {
    this.seq = 1;
    this.sawError = false;
    this.model = {
      counters: { root: this.seq++, route: null, shop: null, badge: null, panel: null },
      got: { badge: 'root', panel: 'root' },
      walker: null,
      check: null,
    };
    this.counts.set({});
    this.tl.reset(this.model);
    this.ctx.stepAnchor.set(null);
  }

  // ---------- Sinh các bước: nhân vật đi ngược cầu thang tìm quầy gần nhất ----------

  private lookup(whos: Who[], counters: Frame['counters'], intro?: string, changed?: Loc): void {
    const steps: Step<Frame>[] = [];
    const got = { ...this.model.got };
    for (const w of whos) got[w] = null;
    const push = (f: Omit<Frame, 'counters'>, caption: string, anchor?: string, duration = 750, sound?: 'pop' | 'ting' | 'boop') =>
      steps.push({ frame: { counters, ...f, got: { ...f.got } }, caption, anchor, duration, sound });

    if (intro) push({ got, walker: null, check: null }, intro, changed ? ANCHOR[changed] : undefined, 900, 'pop');

    for (const who of whos) {
      push({ got, walker: { who, at: 'start' }, check: null }, `${WHO_NAME[who]} gọi inject(CartService)…`, `inject-${who}`, 750);
      let found: Loc | null = null;
      for (const loc of CHAIN[who]) {
        const id = counters[loc];
        if (id) {
          found = loc;
          got[who] = loc;
          push({ got, walker: { who, at: loc }, check: 'yes' }, `${LOC_NAME[loc]} có quầy! ${WHO_NAME[who]} nhận Giỏ #${id}.`, ANCHOR[loc], 900, 'ting');
          break;
        }
        push({ got, walker: { who, at: loc }, check: 'no' }, `${LOC_NAME[loc]}: không có quầy → đi tiếp lên cầu thang.`, ANCHOR[loc], 700);
      }
      if (!found) {
        got[who] = 'error';
        push(
          { got, walker: { who, at: 'root' }, check: 'no' },
          `Hết cầu thang mà không thấy quầy nào → NullInjectorError: No provider for CartService!`,
          'service',
          1100,
          'boop',
        );
      }
    }

    const last = this.summary(got);
    steps.push({ frame: { counters, got: { ...got }, walker: null, check: null }, caption: last, duration: 800, tag: 'resolved' });
    this.model = steps[steps.length - 1].frame;
    this.tl.load(steps);
  }

  private summary(got: Frame['got']): string {
    if (got.badge === 'error' || got.panel === 'error') return 'Có component không tìm được service. Hãy đặt một quầy ở tầng đủ cao!';
    return got.badge === got.panel
      ? 'Kết quả: B và C dùng CHUNG một instance — thêm món bên này, bên kia cũng thấy.'
      : 'Kết quả: B và C dùng HAI instance khác nhau — giỏ hàng tách biệt.';
  }

  private checkChallenges(f: Frame): void {
    const { badge, panel } = f.got;
    const err = badge === 'error' || panel === 'error';
    if (err) {
      this.sawError = true;
      return;
    }
    if (badge && panel && badge !== panel) this.ctx.completeChallenge('di-diff');
    if (badge && badge === panel && !f.counters.root) this.ctx.completeChallenge('di-shared-no-root');
    if (this.sawError && badge && panel) this.ctx.completeChallenge('di-error-fix');
  }
}
