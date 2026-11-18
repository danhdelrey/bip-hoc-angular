import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

interface Item {
  id: number;
  name: string;
  price: number;
  qty: number;
}
type Comp = 'products' | 'badge' | 'panel' | 'summary';
type Zone = 'methods' | 'patch' | 'computed' | 'read' | null;
interface Frame {
  shown: Item[]; // những gì màn hình đang hiện
  real: Item[]; // dữ liệu thật trong bộ nhớ
  discount: number;
  zone: Zone;
  changed: ('entities' | 'discount' | 'count' | 'total')[];
  flash: Comp[];
  renders: Record<Comp, number>;
}
const COMPS: { id: Comp; label: string; reads: string }[] = [
  { id: 'products', label: 'ProductList', reads: 'chỉ gọi methods' },
  { id: 'badge', label: 'CartBadge', reads: 'đọc count()' },
  { id: 'panel', label: 'CartPanel', reads: 'đọc entities()' },
  { id: 'summary', label: 'Summary', reads: 'đọc total()' },
];
const AO = { id: 1, name: 'Áo mưa', price: 199000 };
const O = { id: 2, name: 'Ô gấp', price: 89000 };

const count = (items: Item[]) => items.reduce((s, i) => s + i.qty, 0);
const total = (items: Item[], d: number) => Math.round(items.reduce((s, i) => s + i.qty * i.price, 0) * (1 - d));

@Component({
  selector: 'app-signal-store-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="actions">
      <button type="button" class="btn btn-sm btn-event" (click)="add(ao)">+ Áo mưa</button>
      <button type="button" class="btn btn-sm btn-event" (click)="add(o)">+ Ô gấp</button>
      <button type="button" class="btn btn-sm btn-event" (click)="coupon()">Áp mã BIP10</button>
      <button type="button" class="btn btn-sm btn-event" (click)="inc()">Tăng SL dòng đầu</button>
      <button type="button" class="btn btn-sm" (click)="reset()"><app-icon name="replay" [size]="14" /> Làm lại</button>
    </div>
    <div class="impl">
      <span class="eyebrow">add() dùng:</span>
      <label appAnchor="upsert"><input type="radio" name="addimpl" [checked]="upsert()" (change)="upsert.set(true)" /> kiểm tra entityMap → updateEntity</label>
      <label><input type="radio" name="addimpl" [checked]="!upsert()" (change)="upsert.set(false)" /> luôn addEntity</label>
      <span class="eyebrow">cập nhật bằng:</span>
      <label appAnchor="patch"><input type="radio" name="upd" [checked]="immutable()" (change)="immutable.set(true)" /> patchState</label>
      <label><input type="radio" name="upd" [checked]="!immutable()" (change)="immutable.set(false)" /> sửa trực tiếp object</label>
    </div>

    <div class="stage">
      <div class="store" aria-label="CartStore">
        <div class="shead"><app-icon name="building" [size]="18" /> CartStore</div>
        <div class="layer" [class.hot]="f.zone === 'patch'" appAnchor="entities">
          <code>withEntities</code>
          <div class="vals">
            @for (i of f.real; track i.id) {
              <span class="pill" [class.diff]="i.qty !== qtyShown(f, i.id)">{{ i.name }} ×{{ i.qty }}</span>
            } @empty { <span class="muted">trống</span> }
          </div>
        </div>
        <div class="layer" [class.hot]="f.zone === 'patch' && f.changed.includes('discount')" appAnchor="state">
          <code>withState</code>
          <div class="vals"><span class="pill">discount: {{ f.discount * 100 }}%</span></div>
        </div>
        <div class="layer" [class.hot]="f.zone === 'computed'" appAnchor="computed">
          <code>withComputed</code>
          <div class="vals">
            <span class="pill c" [class.changed]="f.zone !== 'methods' && f.changed.includes('count')">count = {{ count(f.shown) }}</span>
            <span class="pill c" [class.changed]="f.zone !== 'methods' && f.changed.includes('total')">total = {{ vnd(total(f.shown, f.discount)) }}</span>
          </div>
        </div>
        <div class="layer" [class.hot]="f.zone === 'methods'" appAnchor="methods">
          <code>withMethods</code>
          <div class="vals"><span class="pill m">add()</span><span class="pill m">applyCoupon()</span><span class="pill m">increase()</span></div>
        </div>
      </div>

      <div class="comps" appAnchor="read">
        @for (c of comps; track c.id) {
          <div class="comp" [class.flash]="f.flash.includes(c.id)">
            <div><strong>{{ c.label }}</strong><small>{{ c.reads }}</small></div>
            <div class="view">
              @switch (c.id) {
                @case ('badge') { 🛒 {{ count(f.shown) }} }
                @case ('panel') { @for (i of f.shown; track i.id) { <span>{{ i.name }} ×{{ i.qty }}</span> } @empty { trống } }
                @case ('summary') { {{ vnd(total(f.shown, f.discount)) }} }
                @default { [+ Áo mưa] [+ Ô gấp] }
              }
            </div>
            <span class="renders" [attr.aria-label]="'Đã render ' + f.renders[c.id] + ' lần'">render ×{{ f.renders[c.id] }}</span>
          </div>
        }
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 22px 6px; }
    .impl { display: flex; flex-wrap: wrap; gap: 4px 14px; align-items: center; padding: 4px 22px 8px; font-weight: 700; font-size: var(--fs-sm); }
    .impl label { display: flex; gap: 5px; align-items: center; cursor: pointer; padding: 2px 6px; border-radius: 8px; }
    .impl label.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; padding: 8px 22px 14px; }
    .store { border: var(--border); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow); overflow: hidden; }
    .shead { display: flex; gap: 6px; align-items: center; padding: 8px 12px; background: var(--c-signal); color: var(--pal-ink); font-family: var(--font-display); font-weight: 800; border-bottom: var(--border); }
    .layer { display: grid; grid-template-columns: 120px 1fr; gap: 8px; align-items: center; padding: 8px 12px; border-bottom: var(--border-thin); transition: background var(--dur); }
    .layer:last-child { border-bottom: 0; }
    .layer code { font-size: 12px; font-weight: 700; }
    .layer.hot, .layer.is-hl { background: color-mix(in srgb, var(--c-signal) 32%, var(--surface)); }
    .vals { display: flex; flex-wrap: wrap; gap: 5px; }
    .pill { padding: 2px 8px; border: var(--border-thin); border-radius: var(--radius-pill); font-size: 12px; font-weight: 700; background: var(--c-data); color: var(--on-accent); }
    .pill.diff { background: var(--c-error); }
    .pill.c { background: var(--c-signal); color: var(--pal-ink); }
    .pill.c.changed { animation: pulse 0.6s var(--ease-bounce); outline: 3px solid var(--c-signal-strong); }
    .pill.m { background: var(--c-event); color: var(--pal-ink); }
    .muted { color: var(--text-muted); font-size: 12px; }
    .comps { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-content: start; border-radius: var(--radius); }
    .comps.is-hl { outline: 3px solid var(--c-signal-strong); outline-offset: 4px; }
    .comp { position: relative; display: grid; gap: 6px; padding: 10px; border: var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-sm); }
    .comp small { display: block; font-size: 11px; color: var(--text-muted); }
    .comp.flash { animation: flash 0.8s var(--ease-out); }
    .view { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 8px; min-height: 30px; background: #fff; color: #111; border-radius: 8px; font-size: 13px; }
    .view span { padding: 0 6px; border: 1px solid #ccc; border-radius: 6px; }
    .renders { position: absolute; top: 8px; right: 8px; padding: 0 6px; border-radius: 6px; font-size: 11px; font-weight: 800; background: var(--surface-sunken); }
    .comp.flash .renders { background: var(--c-event); color: var(--pal-ink); }
    @keyframes flash { 0% { box-shadow: 0 0 0 6px var(--c-event); transform: scale(1.03); } }
    @keyframes pulse { 50% { transform: scale(1.12); } }
    @media (max-width: 820px) { .stage { grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce) { .comp.flash, .pill.c.changed { animation: none; } }
  `,
})
export class SignalStoreVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly comps = COMPS;
  protected readonly ao = AO;
  protected readonly o = O;
  protected readonly count = count;
  protected readonly total = total;
  protected readonly upsert = signal(false);
  protected readonly immutable = signal(true);

  private shown: Item[] = [{ ...AO, qty: 1 }];
  private real: Item[] = [{ ...AO, qty: 1 }];
  private discount = 0;
  private renders: Record<Comp, number> = { products: 1, badge: 1, panel: 1, summary: 1 };

  protected readonly tl = createTimeline<Frame>(this.snapshot(null, [], []), {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag) this.ctx.completeChallenge(s.tag);
    },
  });

  protected vnd(n: number): string {
    return n.toLocaleString('vi-VN') + 'đ';
  }
  protected qtyShown(f: Frame, id: number): number | undefined {
    return f.shown.find((i) => i.id === id)?.qty;
  }

  private snapshot(zone: Zone, changed: Frame['changed'], flash: Comp[]): Frame {
    return { shown: this.shown.map((i) => ({ ...i })), real: this.real.map((i) => ({ ...i })), discount: this.discount, zone, changed, flash, renders: { ...this.renders } };
  }

  /** Sau khi state thật đổi bằng patchState: computed + component nào chạy lại */
  private propagate(steps: Step<Frame>[], changed: Frame['changed'], tag?: string, prevDiscount = this.discount): void {
    const before = { c: count(this.shown), t: total(this.shown, prevDiscount) };
    const entitiesChanged = changed.includes('entities');
    this.shown = this.real.map((i) => ({ ...i }));
    const ch: Frame['changed'] = [...changed];
    if (count(this.shown) !== before.c) ch.push('count');
    if (total(this.shown, this.discount) !== before.t) ch.push('total');
    steps.push({ frame: this.snapshot('computed', ch, []), caption: `Computed tính lại: ${[ch.includes('count') && 'count', ch.includes('total') && 'total'].filter(Boolean).join(', ') || 'không có gì đổi'}${!ch.includes('count') ? ' — count giữ nguyên giá trị.' : '.'}`, anchor: 'computed', duration: 1300 });
    const flash: Comp[] = [];
    if (ch.includes('count')) flash.push('badge');
    if (entitiesChanged) flash.push('panel');
    if (ch.includes('total')) flash.push('summary');
    for (const c of flash) this.renders[c]++;
    const names = flash.map((c) => COMPS.find((x) => x.id === c)!.label);
    const skipped = COMPS.filter((c) => !flash.includes(c.id)).map((c) => c.label);
    steps.push({ frame: this.snapshot('read', ch, flash), caption: `Vẽ lại: ${names.join(', ') || 'không ai'}. Đứng yên: ${skipped.join(', ')}.`, anchor: 'read', sound: 'ting', tag, duration: 1400 });
  }

  protected add(p: typeof AO): void {
    const steps: Step<Frame>[] = [{ frame: this.snapshot('methods', [], []), caption: `ProductList gọi store.add(${p.name}).`, anchor: 'methods', duration: 1100 }];
    const existing = this.real.find((i) => i.id === p.id);
    if (existing && !this.upsert()) {
      steps.push({ frame: this.snapshot('patch', [], []), caption: `addEntity với id ${p.id} đã tồn tại → bị BỎ QUA. Giỏ vẫn ×${existing.qty}, người dùng tưởng nút hỏng!`, anchor: 'upsert', sound: 'boop', duration: 1600 });
    } else if (existing) {
      this.real = this.real.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      steps.push({ frame: { ...this.snapshot('patch', ['entities'], []), shown: this.shown.map((i) => ({ ...i })) }, caption: `entityMap()[${p.id}] đã có → patchState(updateEntity) tạo object mới với qty ${existing.qty + 1}.`, anchor: 'upsert', sound: 'pop', duration: 1400 });
      this.propagate(steps, ['entities'], p.id === AO.id ? 'ss-entity' : undefined);
    } else {
      this.real = [...this.real, { ...p, qty: 1 }];
      steps.push({ frame: this.snapshot('patch', ['entities'], []), caption: `Chưa có id ${p.id} → patchState(addEntity) thêm dòng mới.`, anchor: 'patch', sound: 'pop', duration: 1300 });
      this.propagate(steps, ['entities']);
    }
    this.tl.load(steps);
  }

  protected coupon(): void {
    const steps: Step<Frame>[] = [{ frame: this.snapshot('methods', [], []), caption: 'Summary gọi store.applyCoupon("BIP10").', anchor: 'methods', duration: 1100 }];
    if (this.discount === 0.1) {
      steps.push({ frame: this.snapshot('patch', [], []), caption: 'discount đã là 10% → giá trị giống hệt, signal không báo thay đổi, không ai vẽ lại.', anchor: 'state', duration: 1400 });
    } else {
      const prev = this.discount;
      this.discount = 0.1;
      steps.push({ frame: this.snapshot('patch', ['discount'], []), caption: 'patchState(store, { discount: 0.1 }) — chỉ signal discount đổi, entities giữ nguyên tham chiếu.', anchor: 'patch', sound: 'pop', duration: 1400 });
      this.propagate(steps, ['discount'], 'ss-fine', prev);
    }
    this.tl.load(steps);
  }

  protected inc(): void {
    if (!this.real.length) return;
    const first = this.real[0];
    const steps: Step<Frame>[] = [{ frame: this.snapshot('methods', [], []), caption: `CartPanel muốn tăng số lượng "${first.name}".`, anchor: 'methods', duration: 1100 }];
    if (!this.immutable()) {
      first.qty++; // sửa thẳng vào object cũ: không signal nào biết
      steps.push({ frame: this.snapshot('patch', [], []), caption: `item.qty++ sửa thẳng vào object cũ: dữ liệu thật là ×${first.qty} nhưng tham chiếu không đổi → signal không biết gì!`, anchor: 'patch', sound: 'boop', duration: 1600 });
      steps.push({ frame: this.snapshot(null, [], []), caption: 'Không computed nào chạy, không component nào vẽ lại: màn hình lệch với dữ liệu (ô đỏ trong store).', sound: 'boop', duration: 1400 });
    } else {
      this.real = this.real.map((i, idx) => (idx === 0 ? { ...i, qty: i.qty + 1 } : i));
      steps.push({ frame: this.snapshot('patch', ['entities'], []), caption: `patchState(updateEntity({ id: ${first.id}, changes: … })) tạo mảng + object MỚI.`, anchor: 'patch', sound: 'pop', duration: 1400 });
      this.propagate(steps, ['entities'], 'ss-immutable');
    }
    this.tl.load(steps);
  }

  protected reset(): void {
    this.shown = [{ ...AO, qty: 1 }];
    this.real = [{ ...AO, qty: 1 }];
    this.discount = 0;
    this.renders = { products: 1, badge: 1, panel: 1, summary: 1 };
    this.tl.load([{ frame: this.snapshot(null, [], []), caption: 'Store về trạng thái ban đầu (withHooks onInit thêm sẵn 1 Áo mưa).', anchor: 'hooks' }], false);
  }
}
