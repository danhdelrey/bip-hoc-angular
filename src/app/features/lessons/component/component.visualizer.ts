import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';
import { TreeDiagram, type TreeNode } from '../../../shared/ui/tree-diagram/tree-diagram';

type Floor = 'class' | 'template' | 'styles';
interface House extends TreeNode {
  label: string;
  cls: string;
  selector: string;
  color: string;
  floors: Record<Floor, string>;
}

const PC_FLOORS: Record<Floor, string> = {
  class: 'name, price, inCart + method toggleCart()',
  template: '<h3>, giá tiền, nút "Thêm vào giỏ"',
  styles: '.card viền bo góc, .price màu đỏ',
};
const HOUSES: House[] = [
  { id: 'app', label: 'App', cls: 'App', selector: 'app-root', color: 'var(--pal-lavender)', floors: { class: 'title', template: '<app-header /> <app-product-list /> <app-footer />', styles: 'bố cục trang' } },
  { id: 'header', parent: 'app', label: 'Header', cls: 'Header', selector: 'app-header', color: 'var(--pal-sky)', floors: { class: 'menu items', template: 'logo + menu', styles: 'thanh ngang dính trên' } },
  { id: 'list', parent: 'app', label: 'ProductList', cls: 'ProductList', selector: 'app-product-list', color: 'var(--pal-mint)', floors: { class: 'danh sách sản phẩm', template: '@for … <app-product-card />', styles: 'lưới 2 cột' } },
  { id: 'card1', parent: 'list', label: 'ProductCard', cls: 'ProductCard', selector: 'app-product-card', color: 'var(--pal-lemon)', floors: PC_FLOORS },
  { id: 'card2', parent: 'list', label: 'ProductCard', cls: 'ProductCard', selector: 'app-product-card', color: 'var(--pal-lemon)', floors: PC_FLOORS },
  { id: 'footer', parent: 'app', label: 'Footer', cls: 'Footer', selector: 'app-footer', color: 'var(--pal-coral)', floors: { class: 'năm bản quyền', template: '© Bíp Shop', styles: 'chữ nhỏ, căn giữa' } },
];

const FLOOR_INFO: Record<Floor, { title: string; role: string; icon: string }> = {
  class: { title: 'Tầng Class (TypeScript)', role: 'Đồ đạc và bộ não: dữ liệu (signal) và method xử lý sự kiện.', icon: 'code' },
  template: { title: 'Tầng Template (HTML)', role: 'Mặt tiền ai cũng thấy: HTML + cú pháp Angular như {{ }}, (click), @if.', icon: 'house' },
  styles: { title: 'Tầng Styles (CSS)', role: 'Màu sơn riêng: CSS chỉ áp dụng cho chính ngôi nhà này.', icon: 'palette' },
};

interface Frame {
  built: { roof: boolean; class: boolean; template: boolean; styles: boolean };
  placed: boolean;
  blueprint: boolean;
}
const NONE: Frame = { built: { roof: true, class: true, template: true, styles: true }, placed: true, blueprint: false };

@Component({
  selector: 'app-component-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, TreeDiagram],
  template: `
    @let f = tl.frame();
    @let h = house();
    <div class="stage">
      <div class="big">
        <div class="house" [style.--hc]="h.color" [class.blue]="f.blueprint">
          @if (f.built.roof) {
            <div class="roof" appAnchor="selector"><span class="sign">&lt;{{ h.selector }}&gt;</span></div>
          } @else { <div class="roof ghost"></div> }
          @for (fl of floors; track fl) {
            @if (f.built[fl]) {
              <button type="button" class="floor" [class]="'floor fl-' + fl" [class.on]="floor() === fl" [appAnchor]="fl" (click)="pick(fl)">
                <app-icon [name]="info[fl].icon" [size]="18" />
                <strong>{{ fl === 'class' ? 'Class' : fl === 'template' ? 'Template' : 'Styles' }}</strong>
                <span class="what">{{ h.floors[fl] }}</span>
              </button>
            } @else {
              <div class="floor ghost">…</div>
            }
          }
          <div class="door" aria-hidden="true"></div>
        </div>
        <p class="caption-cls"><code>class {{ h.cls }}</code></p>
      </div>

      <div class="side">
        @if (floor(); as fl) {
          <div class="info toon">
            <strong><app-icon [name]="info[fl].icon" [size]="18" /> {{ info[fl].title }}</strong>
            <p>{{ info[fl].role }}</p>
          </div>
        } @else {
          <div class="info toon muted">Bấm một tầng để xem vai trò của nó.</div>
        }
        <p class="eyebrow">Khu phố component (bấm vào nhà)</p>
        <app-tree-diagram [nodes]="houses" [opts]="{ nodeW: 92, nodeH: 64, gapX: 10, gapY: 34 }">
          <ng-template let-n>
            <button type="button" class="mini" [style.--hc]="$any(n).color" [class.on]="selected() === n.id"
                    [class.pop]="n.id === 'card2' && !f.placed" (click)="select(n.id)" [attr.aria-label]="'Nhà ' + $any(n).label">
              <span class="mini-roof" aria-hidden="true"></span>
              <span class="mini-body">{{ $any(n).label }}</span>
            </button>
          </ng-template>
        </app-tree-diagram>
        @if (selected() === 'card2') {
          <p class="note"><app-icon name="star" [size]="16" /> Nhà này cùng bản thiết kế với ProductCard bên cạnh — 2 instance, state riêng!</p>
        }
      </div>
    </div>

    <div class="controls">
      <button type="button" class="btn btn-sm btn-primary" (click)="build()"><app-icon name="house" [size]="16" /> Xây nhà ProductCard</button>
      <span class="muted small">Mẹo: rê chuột lên một tầng để thấy dòng code tương ứng.</span>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .stage { display: grid; grid-template-columns: 300px 1fr; gap: 26px; padding: 22px; align-items: start; }
    .big { display: flex; flex-direction: column; align-items: center; }
    .house { --hc: var(--pal-lemon); position: relative; width: 270px; display: grid; gap: 0; transition: filter var(--dur) ease; }
    .house.blue { filter: hue-rotate(180deg) saturate(0.6); }
    .roof { height: 74px; display: grid; place-items: end center; padding-bottom: 8px; background: var(--hc); border: var(--border); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .roof.ghost, .floor.ghost { background: transparent; border: 3px dashed color-mix(in srgb, var(--line) 40%, transparent); color: var(--text-muted); }
    .roof .sign { font-family: var(--font-mono); font-size: 12px; font-weight: 700; padding: 1px 8px; background: var(--surface); border: 2px solid var(--line); border-radius: 8px; color: var(--text); }
    .roof.is-hl { filter: drop-shadow(0 0 6px var(--c-signal)); }
    .floor { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 2px 8px; min-height: 76px; padding: 8px 14px; text-align: left; background: color-mix(in srgb, var(--hc) 35%, var(--surface)); border: var(--border); border-top: none; cursor: pointer; transition: transform var(--dur-fast) var(--ease-bounce), background-color var(--dur) ease; }
    .floor:first-of-type { border-top: var(--border); }
    .floor strong { font-family: var(--font-display); }
    .floor .what { grid-column: 1 / -1; font-size: 12.5px; font-family: var(--font-mono); color: var(--text-muted); }
    .floor:hover { transform: translateX(4px); }
    .floor.on, .floor.is-hl { background: var(--c-signal); color: var(--on-accent); }
    .floor.on .what, .floor.is-hl .what { color: var(--pal-ink); }
    .fl-styles { background-image: repeating-linear-gradient(45deg, transparent 0 10px, color-mix(in srgb, var(--hc) 30%, transparent) 10px 20px); }
    .door { position: absolute; bottom: 0; right: 22px; width: 30px; height: 44px; background: var(--surface-2); border: var(--border); border-bottom: none; border-radius: 14px 14px 0 0; }
    .caption-cls { margin: 10px 0 0; }
    @media (prefers-reduced-motion: no-preference) { .floor:not(.ghost) { animation: deco-pop-in 420ms var(--ease-bounce); } }

    .side { min-width: 0; display: grid; gap: 12px; }
    .info { padding: 12px 14px; box-shadow: var(--shadow-sm); }
    .info p { margin: 4px 0 0; }
    .mini { --hc: var(--pal-lemon); display: flex; flex-direction: column; align-items: stretch; padding: 0; background: none; border: none; cursor: pointer; transition: transform var(--dur-fast) var(--ease-bounce); }
    .mini:hover, .mini.on { transform: translateY(-4px) scale(1.05); }
    .mini-roof { height: 20px; background: var(--hc); border: var(--border-thin); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .mini-body { flex: 1; display: grid; place-items: center; font-size: 11.5px; font-weight: 800; background: color-mix(in srgb, var(--hc) 35%, var(--surface)); border: var(--border-thin); border-top: none; border-radius: 0 0 8px 8px; }
    .mini.on .mini-body { background: var(--c-signal); color: var(--on-accent); }
    .mini.pop { opacity: 0.25; }
    .note { display: flex; gap: 6px; align-items: center; margin: 0; font-weight: 700; color: var(--c-data-strong); }
    .controls { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; padding: 0 22px 16px; }
    .small { font-size: var(--fs-sm); font-weight: 600; }
    @media (max-width: 800px) { .stage { grid-template-columns: 1fr; } }
  `,
})
export class ComponentVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly houses = HOUSES;
  protected readonly floors: Floor[] = ['class', 'template', 'styles'];
  protected readonly info = FLOOR_INFO;
  protected readonly selected = signal('card1');
  protected readonly floor = signal<Floor | null>(null);
  private readonly clicked = new Set<Floor>();

  protected house = () => HOUSES.find((x) => x.id === this.selected())!;

  protected readonly tl = createTimeline<Frame>(NONE, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag === 'built') this.ctx.completeChallenge('cmp-build');
    },
  });

  protected pick(f: Floor): void {
    this.floor.set(f);
    this.clicked.add(f);
    if (this.clicked.size === 3) this.ctx.completeChallenge('cmp-floors');
  }

  protected select(id: string): void {
    this.selected.set(id);
    if (id === 'card2') this.ctx.completeChallenge('cmp-instance');
  }

  protected build(): void {
    this.selected.set('card1');
    const b = (roof: boolean, cls: boolean, tpl: boolean, sty: boolean) => ({ roof, class: cls, template: tpl, styles: sty });
    const steps: Step<Frame>[] = [
      { frame: { built: b(false, false, false, false), placed: false, blueprint: true }, caption: '@Component({...}) là bản thiết kế: Angular đọc nó trước khi xây.', anchor: 'decorator', duration: 1100 },
      { frame: { built: b(true, false, false, false), placed: false, blueprint: true }, caption: "Mái nhà = selector 'app-product-card': biển tên để gọi ngôi nhà này.", anchor: 'selector', duration: 1100, sound: 'pop' },
      { frame: { built: b(true, true, false, false), placed: false, blueprint: true }, caption: 'Tầng Class: new ProductCard() — tạo dữ liệu name, price, inCart.', anchor: 'class', duration: 1100, sound: 'pop' },
      { frame: { built: b(true, true, true, false), placed: false, blueprint: true }, caption: 'Tầng Template: dựng HTML, nối {{ name() }} và (click) với class.', anchor: 'template', duration: 1100, sound: 'pop' },
      { frame: { built: b(true, true, true, true), placed: false, blueprint: false }, caption: 'Tầng Styles: sơn màu riêng — CSS chỉ áp dụng cho ngôi nhà này.', anchor: 'styles', duration: 1100, sound: 'pop' },
      { frame: { built: b(true, true, true, true), placed: true, blueprint: false }, caption: 'ProductList có <app-product-card /> trong template → nhà mới mọc trong khu phố!', duration: 1200, sound: 'ting', tag: 'built' },
    ];
    this.tl.load(steps);
  }
}
