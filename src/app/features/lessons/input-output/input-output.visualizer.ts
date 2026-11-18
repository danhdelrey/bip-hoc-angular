import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Lane = 'input' | 'output' | 'model';
interface Model {
  p: { qty: number; rating: number; orders: number };
  c: { qty: number; rating: number };
}
interface Frame extends Model {
  mover: { lane: Lane; pos: 0 | 1; kind: 'marble' | 'bubble'; label: string; land?: boolean } | null;
  flashP: string | null;
  flashC: string | null;
}

const LANES: { id: Lane; label: string; sub: string; dir: string }[] = [
  { id: 'input', label: '[qty]', sub: 'input()', dir: '↓' },
  { id: 'output', label: '(buy)', sub: 'output()', dir: '↑' },
  { id: 'model', label: '[(rating)]', sub: 'model()', dir: '⇅' },
];

@Component({
  selector: 'app-io-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="stage" [style.--dur.ms]="tl.durationMs()">
      <!-- Nhà Cha -->
      <div class="house parent">
        <div class="roof"><span>Nhà Cha · OrderPage</span></div>
        <div class="rooms">
          <div class="room" appAnchor="input" [class.flash]="f.flashP === 'qty'">
            <code>quantity</code> <b class="chip chip-data"><app-icon name="data" [size]="14" />{{ f.p.qty }}</b>
            <button type="button" class="btn btn-sm btn-icon" (click)="parentQty(-1)" aria-label="Giảm quantity"><app-icon name="minus" [size]="14" /></button>
            <button type="button" class="btn btn-sm btn-icon" (click)="parentQty(1)" aria-label="Tăng quantity"><app-icon name="plus" [size]="14" /></button>
          </div>
          <div class="room" appAnchor="output" [class.flash]="f.flashP === 'orders'">
            <code>orders</code> <b class="chip chip-data"><app-icon name="data" [size]="14" />{{ f.p.orders }}</b>
            <span class="muted small">onBuy(n)</span>
          </div>
          <div class="room" appAnchor="model" [class.flash]="f.flashP === 'rating'">
            <code>rating</code>
            <span class="stars">
              @for (s of stars; track s) {
                <button type="button" class="star" [class.on]="s <= f.p.rating" (click)="parentRate(s)" [attr.aria-label]="'Cha đặt ' + s + ' sao'">★</button>
              }
            </span>
          </div>
        </div>
      </div>

      <!-- Ống khói -->
      <div class="lanes">
        @for (l of lanes; track l.id) {
          <div class="lane" [class]="'lane lane-' + l.id" [appAnchor]="l.id" [class.active]="f.mover?.lane === l.id">
            <span class="tag">{{ l.label }}<small>{{ l.sub }}</small></span>
            <span class="dir" aria-hidden="true">{{ l.dir }}</span>
            @if (f.mover; as m) {
              @if (m.lane === l.id) {
                <span class="mover" [class]="'mover ' + m.kind" [class.land]="m.land" [style.--p]="m.pos" aria-hidden="true">
                  <span class="dot">@if (m.kind === 'marble') { ☺ } @else { ! }</span>
                  <span class="mlabel">{{ m.label }}</span>
                </span>
              }
            }
          </div>
        }
      </div>

      <!-- Nhà Con -->
      <div class="house child">
        <div class="roof"><span>Nhà Con · ProductBox</span></div>
        <div class="rooms">
          <div class="room" appAnchor="input" [class.flash]="f.flashC === 'qty'">
            <code>qty = input()</code> <b class="chip chip-data"><app-icon name="data" [size]="14" />{{ f.c.qty }}</b>
          </div>
          <div class="room" appAnchor="output">
            <button type="button" class="btn btn-sm btn-event" (click)="childBuy()"><app-icon name="event" [size]="14" /> Mua {{ f.c.qty }} cái</button>
          </div>
          <div class="room" appAnchor="model" [class.flash]="f.flashC === 'rating'">
            <code>rating = model()</code>
            <span class="stars">
              @for (s of stars; track s) {
                <button type="button" class="star" [class.on]="s <= f.c.rating" (click)="childRate(s)" [attr.aria-label]="'Con chọn ' + s + ' sao'">★</button>
              }
            </span>
          </div>
        </div>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .stage { padding: 22px; display: grid; gap: 0; }
    .house { border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; background: var(--surface); }
    .parent { background: color-mix(in srgb, var(--c-di) 14%, var(--surface)); }
    .child { background: color-mix(in srgb, var(--c-brand) 14%, var(--surface)); }
    .roof { padding: 8px 14px; font-family: var(--font-display); font-weight: 800; border-bottom: var(--border-thin); background: color-mix(in srgb, var(--surface-2) 70%, transparent); }
    .rooms { display: grid; grid-template-columns: repeat(3, 1fr); }
    .room { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 12px 14px; min-height: 64px; border-right: var(--border-thin); transition: background-color var(--dur-fast) ease; }
    .room:last-child { border-right: none; }
    .room code { background: none; border: none; padding: 0; font-weight: 700; }
    .room.is-hl { background: color-mix(in srgb, var(--c-signal) 40%, transparent); }
    .room.flash { animation: fl 900ms var(--ease-out); }
    @keyframes fl { 0% { background: var(--c-signal); } 100% { background: transparent; } }
    .small { font-size: 12.5px; }
    .stars { display: inline-flex; gap: 2px; }
    .star { width: 30px; height: 30px; font-size: 20px; line-height: 1; color: var(--surface-sunken); -webkit-text-stroke: 1.5px var(--line); background: none; border: none; cursor: pointer; transition: transform var(--dur-fast) var(--ease-bounce); }
    .star.on { color: var(--c-signal); }
    .star:hover { transform: scale(1.25) rotate(-8deg); }

    .lanes { display: grid; grid-template-columns: repeat(3, 1fr); height: 170px; }
    .lane { position: relative; justify-self: center; width: 46px; height: 100%; background: color-mix(in srgb, var(--c-data) 25%, var(--surface)); border-left: var(--border); border-right: var(--border); }
    .lane-output { background: color-mix(in srgb, var(--c-event) 25%, var(--surface)); }
    .lane-model { background: linear-gradient(180deg, color-mix(in srgb, var(--c-data) 30%, var(--surface)), color-mix(in srgb, var(--c-event) 30%, var(--surface))); }
    .lane.is-hl, .lane.active { box-shadow: 0 0 0 4px var(--c-signal); }
    .tag { position: absolute; left: calc(100% + 10px); top: 50%; transform: translateY(-50%); display: grid; padding: 2px 10px; font-family: var(--font-mono); font-weight: 700; font-size: 13px; background: var(--surface); border: var(--border-thin); border-radius: 10px; box-shadow: var(--shadow-sm); white-space: nowrap; }
    .tag small { font-size: 11px; color: var(--text-muted); }
    .dir { position: absolute; right: calc(100% + 8px); top: 50%; transform: translateY(-50%); font-size: 22px; font-weight: 800; }
    .mover { position: absolute; left: 50%; top: calc(8px + var(--p) * (100% - 52px)); transform: translateX(-50%); z-index: 2; transition: top var(--dur) var(--ease-in-out); }
    .dot { display: grid; place-items: center; width: 34px; height: 34px; font-weight: 800; color: var(--pal-ink); border: var(--border); border-radius: 50%; background: var(--c-data); }
    .bubble .dot { background: color-mix(in srgb, var(--c-event) 85%, white); border-radius: 50% 50% 50% 50% / 55% 55% 45% 45%; box-shadow: inset -5px -5px 0 rgba(255,255,255,.35); }
    .mlabel { position: absolute; left: calc(100% + 6px); top: 6px; padding: 0 6px; font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; background: var(--surface); border: 2px solid var(--line); border-radius: 8px; white-space: nowrap; }
    .mover.land .dot { animation: squash-land 520ms var(--ease-out); }
    @media (max-width: 720px) { .rooms { grid-template-columns: 1fr; } .room { border-right: none; border-bottom: var(--border-thin); } .tag small { display: none; } }
  `,
})
export class IoVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly lanes = LANES;
  protected readonly stars = [1, 2, 3, 4, 5];
  private model: Model = { p: { qty: 1, rating: 3, orders: 0 }, c: { qty: 1, rating: 3 } };
  private up = false;
  private down = false;

  protected readonly tl = createTimeline<Frame>(
    { ...this.model, mover: null, flashP: null, flashC: null },
    {
      onEnter: (s) => {
        this.ctx.stepAnchor.set(s.anchor ?? null);
        if (s.tag === 'input-done') this.ctx.completeChallenge('io-input');
        if (s.tag === 'output-done') this.ctx.completeChallenge('io-output');
        if (s.tag === 'model-up') this.up = true;
        if (s.tag === 'model-down') this.down = true;
        if (this.up && this.down) this.ctx.completeChallenge('io-model');
      },
    },
  );

  private fr(m: Model, mover: Frame['mover'], flashP: string | null, flashC: string | null, caption: string, anchor: Lane, duration = 1000, tag?: string, sound?: 'pop' | 'ting'): Step<Frame> {
    return { frame: { p: { ...m.p }, c: { ...m.c }, mover, flashP, flashC }, caption, anchor, duration, tag, sound };
  }

  protected parentQty(d: number): void {
    const s = this.model;
    const qty = Math.max(1, Math.min(9, s.p.qty + d));
    const a: Model = { p: { ...s.p, qty }, c: { ...s.c } };
    const b: Model = { p: { ...a.p }, c: { ...a.c, qty } };
    this.load([
      this.fr(a, { lane: 'input', pos: 0, kind: 'marble', label: String(qty) }, 'qty', null, `Cha: quantity.set(${qty}). Template cha có [qty]="quantity()".`, 'input', 900),
      this.fr(a, { lane: 'input', pos: 1, kind: 'marble', label: String(qty) }, null, null, 'Bi dữ liệu lăn xuống ống input() — chỉ một chiều, cha → con.', 'input', 1200),
      this.fr(b, { lane: 'input', pos: 1, kind: 'marble', label: String(qty), land: true }, null, 'qty', `Con: qty() giờ là ${qty}. Con chỉ đọc, không được tự sửa input.`, 'input', 900, 'input-done', 'pop'),
    ]);
  }

  protected childBuy(): void {
    const s = this.model;
    const n = s.c.qty;
    const b: Model = { p: { ...s.p, orders: s.p.orders + n }, c: { ...s.c } };
    this.load([
      this.fr(s, { lane: 'output', pos: 1, kind: 'bubble', label: `emit(${n})` }, null, null, `Con: buy.emit(${n}) — thổi bong bóng sự kiện.`, 'output', 900, undefined, 'pop'),
      this.fr(s, { lane: 'output', pos: 0, kind: 'bubble', label: `emit(${n})` }, null, null, 'Bong bóng bay ngược lên ống output() — con → cha.', 'output', 1200),
      this.fr(b, { lane: 'output', pos: 0, kind: 'bubble', label: `$event = ${n}`, land: true }, 'orders', null, `Cha chạy (buy)="onBuy($event)": orders = ${b.p.orders}.`, 'output', 1000, 'output-done', 'ting'),
    ]);
  }

  protected childRate(r: number): void {
    const s = this.model;
    const a: Model = { p: { ...s.p }, c: { ...s.c, rating: r } };
    const b: Model = { p: { ...s.p, rating: r }, c: { ...a.c } };
    this.load([
      this.fr(a, { lane: 'model', pos: 1, kind: 'bubble', label: `ratingChange(${r})` }, null, 'rating', `Con: rating.set(${r}) — model() đổi giá trị VÀ phát ratingChange.`, 'model', 1000, undefined, 'pop'),
      this.fr(a, { lane: 'model', pos: 0, kind: 'bubble', label: `ratingChange(${r})` }, null, null, 'Bong bóng bay lên qua nửa "( )" của [(rating)].', 'model', 1200),
      this.fr(b, { lane: 'model', pos: 0, kind: 'bubble', label: `${r}`, land: true }, 'rating', null, `Signal rating của cha được ghi = ${r}. Hai bên đã khớp!`, 'model', 1000, 'model-up', 'ting'),
    ]);
  }

  protected parentRate(r: number): void {
    const s = this.model;
    const a: Model = { p: { ...s.p, rating: r }, c: { ...s.c } };
    const b: Model = { p: { ...a.p }, c: { ...s.c, rating: r } };
    this.load([
      this.fr(a, { lane: 'model', pos: 0, kind: 'marble', label: String(r) }, 'rating', null, `Cha: rating.set(${r}).`, 'model', 900),
      this.fr(a, { lane: 'model', pos: 1, kind: 'marble', label: String(r) }, null, null, 'Bi dữ liệu lăn xuống qua nửa "[ ]" của [(rating)].', 'model', 1200),
      this.fr(b, { lane: 'model', pos: 1, kind: 'marble', label: String(r), land: true }, null, 'rating', `Con: rating() = ${r}. model() cũng nhận dữ liệu từ cha như input().`, 'model', 900, 'model-down', 'pop'),
    ]);
  }

  private load(steps: Step<Frame>[]): void {
    const last = steps[steps.length - 1].frame;
    this.model = { p: { ...last.p }, c: { ...last.c } };
    this.tl.load(steps);
  }
}
