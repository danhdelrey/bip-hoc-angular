import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Fix = 'semantic' | 'name' | 'alt' | 'label' | 'tabs' | 'live';
type El = 'img' | 'heart' | 'qty' | 'tabs' | 'cart' | 'toast';
type Mode = 'sr' | 'kb';
const FIXES: { id: Fix; label: string }[] = [
  { id: 'alt', label: 'alt cho ảnh' },
  { id: 'semantic', label: '<button> thay <div (click)>' },
  { id: 'name', label: 'aria-label cho nút icon' },
  { id: 'label', label: '<label> cho ô nhập' },
  { id: 'tabs', label: 'Tabs bằng @angular/aria' },
  { id: 'live', label: 'aria-live cho thông báo' },
];

interface Line {
  el: El;
  text: string;
  ok: boolean;
}
interface Frame {
  focus: El | null;
  lines: Line[];
  toast: boolean;
}

/** Trình đọc màn hình sẽ nói gì về từng phần tử */
function speak(el: El, on: Set<Fix>): Line {
  switch (el) {
    case 'img':
      return on.has('alt') ? { el, text: 'Ảnh, Áo mưa màu vàng', ok: true } : { el, text: 'Ảnh, "IMG_2931.jpg"', ok: false };
    case 'heart':
      if (!on.has('semantic')) return { el, text: '"♥" — chỉ là chữ, không biết bấm được', ok: false };
      return on.has('name') ? { el, text: 'Nút, Thêm vào yêu thích', ok: true } : { el, text: 'Nút (không có tên)', ok: false };
    case 'qty':
      return on.has('label') ? { el, text: 'Ô nhập số, Số lượng, 1', ok: true } : { el, text: 'Ô nhập số, 1 (không có tên)', ok: false };
    case 'tabs':
      return on.has('tabs') ? { el, text: 'Danh sách thẻ, Mô tả, thẻ đã chọn, 1 trên 3', ok: true } : { el, text: '"Mô tả  Thông số  Đánh giá" — chỉ là chữ', ok: false };
    case 'cart':
      return { el, text: 'Nút, Thêm vào giỏ', ok: true };
    case 'toast':
      return on.has('live') ? { el, text: '(tự đọc) Đã thêm vào giỏ hàng', ok: true } : { el, text: '(im lặng) người dùng không biết đã thêm chưa', ok: false };
  }
}

function contrast(l1: number, l2: number): number {
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}
function lum(gray: number): number {
  const c = gray / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

@Component({
  selector: 'app-accessibility-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="stage">
      <div class="shop" aria-hidden="true">
        <div class="pimg" [class.focus]="f.focus === 'img'" [class.bad]="!on().has('alt')" appAnchor="alt">
          <app-icon name="gift" [size]="34" />
          @if (!on().has('alt')) { <span class="warn">⚠ thiếu alt</span> }
        </div>
        <div class="row">
          <strong class="pname">Áo mưa Bíp</strong>
          <span class="heart" [class.focus]="f.focus === 'heart'" [class.bad]="!on().has('semantic') || !on().has('name')" [appAnchor]="on().has('semantic') ? 'name' : 'semantic'">♥</span>
        </div>
        <div class="tabs" [class.focus]="f.focus === 'tabs'" [class.bad]="!on().has('tabs')" appAnchor="tabs">
          <span class="t sel">Mô tả</span><span class="t">Thông số</span><span class="t">Đánh giá</span>
        </div>
        <div class="row">
          <span class="qty" [class.focus]="f.focus === 'qty'" [class.bad]="!on().has('label')" appAnchor="label">
            @if (on().has('label')) { <small>Số lượng</small> }<span class="box">1</span>
          </span>
          <span class="cart" [class.focus]="f.focus === 'cart'">Thêm vào giỏ</span>
        </div>
        @if (f.toast) {
          <div class="toast" [class.bad]="!on().has('live')" appAnchor="live">✓ Đã thêm vào giỏ hàng</div>
        }
      </div>

      <div class="reader">
        <p class="rhead"><app-icon name="sound-on" [size]="16" /> {{ mode() === 'sr' ? 'Trình đọc màn hình đang nói' : 'Phím Tab — focus đang ở' }}</p>
        <ol class="lines" aria-live="off">
          @for (l of f.lines; track $index) {
            <li [class.ok]="l.ok" [class.bad]="!l.ok"><span class="mark">{{ l.ok ? '✓' : '✗' }}</span> {{ l.text }}</li>
          } @empty {
            <li class="muted">Bấm một chế độ bên dưới để bắt đầu nghe.</li>
          }
        </ol>
      </div>
    </div>

    <div class="controls">
      <div class="modes">
        <button type="button" class="btn btn-sm" [class.btn-primary]="mode() === 'sr'" (click)="run('sr')"><app-icon name="sound-on" [size]="14" /> Nghe trang</button>
        <button type="button" class="btn btn-sm" [class.btn-primary]="mode() === 'kb'" (click)="run('kb')"><app-icon name="keyboard" [size]="14" /> Chỉ dùng bàn phím</button>
      </div>
      <div class="fixes">
        @for (x of fixes; track x.id) {
          <label class="fix" [appAnchor]="x.id"><input type="checkbox" [checked]="on().has(x.id)" (change)="toggle(x.id)" /> {{ x.label }}</label>
        }
      </div>
      <div class="contrast">
        <span class="sample" [style.color]="'rgb(' + gray() + ',' + gray() + ',' + gray() + ')'">Giá: 199.000đ</span>
        <label class="slider">Độ đậm chữ
          <input type="range" min="0" max="220" [value]="220 - gray()" (input)="gray.set(220 - +$any($event.target).value)" aria-label="Độ đậm của chữ" />
        </label>
        <span class="ratio" [class.ok]="ratio() >= 4.5" [class.bad]="ratio() < 4.5">{{ ratio().toFixed(2) }} : 1 {{ ratio() >= 4.5 ? '✓ AA' : '✗ chưa đạt' }}</span>
        <button type="button" class="btn btn-sm" (click)="checkContrast()">Kiểm tra</button>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .stage { display: grid; grid-template-columns: minmax(0, 300px) 1fr; gap: 20px; padding: 18px 22px 8px; }
    .shop { position: relative; display: grid; gap: 10px; padding: 14px; background: #fff; color: #111; border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); }
    .shop .focus { outline: 4px solid var(--c-signal-strong); outline-offset: 3px; border-radius: 8px; }
    .shop .bad { box-shadow: 0 0 0 2px var(--c-error) inset; }
    .pimg { position: relative; display: grid; place-items: center; height: 90px; background: #fde68a; border-radius: 10px; }
    .warn { position: absolute; top: 4px; left: 6px; font-size: 11px; font-weight: 600; color: #b91c1c; background: #fff; padding: 0 5px; border-radius: 5px; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .heart { font-size: 22px; color: #e11d48; padding: 0 6px; border-radius: 8px; }
    .tabs { display: flex; gap: 6px; padding: 4px; border-radius: 8px; }
    .t { padding: 2px 8px; border-radius: 6px; border: 1px solid #999; font-size: 13px; }
    .t.sel { background: #1a56db; color: #fff; }
    .qty { display: flex; align-items: center; gap: 6px; font-size: 13px; padding: 2px 4px; border-radius: 8px; }
    .box { display: inline-block; width: 40px; padding: 2px 6px; border: 1px solid #888; border-radius: 6px; }
    .cart { padding: 4px 10px; background: #1a56db; color: #fff; border-radius: 8px; font-weight: 700; font-size: 13px; }
    .toast { padding: 4px 8px; background: #dcfce7; border-radius: 8px; font-size: 13px; font-weight: 700; }
    .reader { background: var(--pal-ink); color: #f8fafc; border: var(--border); border-radius: var(--radius); padding: 12px 14px; min-width: 0; }
    .rhead { display: flex; align-items: center; gap: 6px; margin: 0 0 8px; font-weight: 600; color: var(--c-signal); }
    .lines { margin: 0; padding-left: 20px; display: grid; gap: 6px; font-family: var(--font-mono); font-size: 13px; }
    .lines li.ok .mark { color: #4ade80; }
    .lines li.bad { color: #fecaca; }
    .lines li.bad .mark { color: #f87171; }
    .lines .muted { color: #cbd5e1; list-style: none; margin-left: -20px; }
    .controls { display: grid; gap: 10px; padding: 6px 22px 14px; }
    .modes { display: flex; gap: 8px; flex-wrap: wrap; }
    .fixes { display: flex; flex-wrap: wrap; gap: 4px 14px; }
    .fix { display: flex; gap: 6px; align-items: center; font-weight: 700; font-size: var(--fs-sm); padding: 3px 6px; border-radius: 8px; cursor: pointer; }
    .fix.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .contrast { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 8px 12px; border: var(--border-thin); border-radius: var(--radius); }
    .sample { padding: 4px 10px; background: #fff; border-radius: 8px; font-weight: 600; border: 1px solid #ddd; }
    .slider { display: flex; gap: 8px; align-items: center; font-weight: 700; font-size: var(--fs-sm); }
    .ratio { font-weight: 600; padding: 2px 8px; border-radius: 8px; color: var(--on-accent); }
    .ratio.ok { background: var(--c-data-strong); }
    .ratio.bad { background: var(--c-error-strong); }
    @media (max-width: 760px) { .stage { grid-template-columns: 1fr; } }
  `,
})
export class AccessibilityVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly fixes = FIXES;
  protected readonly on = signal(new Set<Fix>());
  protected readonly mode = signal<Mode>('sr');
  protected readonly gray = signal(170);
  protected readonly ratio = computed(() => contrast(lum(255), lum(this.gray())));

  protected readonly tl = createTimeline<Frame>({ focus: null, lines: [], toast: false }, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag === 'sr-ok') this.ctx.completeChallenge('a11y-sr');
      if (s.tag === 'kb-ok') this.ctx.completeChallenge('a11y-keys');
    },
  });

  protected toggle(x: Fix): void {
    this.on.update((s) => {
      const n = new Set(s);
      n.has(x) ? n.delete(x) : n.add(x);
      return n;
    });
  }

  protected checkContrast(): void {
    if (this.ratio() >= 4.5) this.ctx.completeChallenge('a11y-contrast');
  }

  protected run(mode: Mode): void {
    this.mode.set(mode);
    const on = this.on();
    const steps: Step<Frame>[] = [];
    const lines: Line[] = [];
    const push = (focus: El | null, line: Line | null, caption: string, anchor?: string, toast = false) => {
      if (line) lines.push(line);
      steps.push({ frame: { focus, lines: [...lines], toast }, caption, anchor, duration: 1300, sound: line ? (line.ok ? 'pop' : 'boop') : undefined });
    };

    if (mode === 'sr') {
      const anchorOf: Record<El, string> = { img: 'alt', heart: on.has('semantic') ? 'name' : 'semantic', qty: 'label', tabs: 'tabs', cart: 'semantic', toast: 'live' };
      for (const el of ['img', 'heart', 'tabs', 'qty', 'cart'] as El[]) {
        const l = speak(el, on);
        push(el, l, l.ok ? `Trình đọc nói: "${l.text}" — rõ ràng.` : `Trình đọc nói: ${l.text} — người dùng bối rối.`, anchorOf[el]);
      }
      const t = speak('toast', on);
      push('cart', t, on.has('live') ? 'Bấm "Thêm vào giỏ": thông báo nằm trong vùng aria-live nên được đọc ngay.' : 'Bấm "Thêm vào giỏ": thông báo hiện ra nhưng trình đọc không hề biết.', 'live', true);
      const ok = lines.every((l) => l.ok);
      steps.push({ frame: { focus: null, lines: [...lines], toast: true }, caption: ok ? 'Mọi phần đều được đọc đúng!' : `Còn ${lines.filter((l) => !l.ok).length} chỗ đọc sai. Bật thêm cách sửa rồi nghe lại.`, tag: ok ? 'sr-ok' : undefined, sound: ok ? 'ting' : 'boop', duration: 1200 });
    } else {
      const stops: El[] = [];
      if (on.has('semantic')) stops.push('heart');
      if (on.has('tabs')) stops.push('tabs');
      stops.push('qty', 'cart');
      let n = 0;
      for (const el of stops) {
        n++;
        const l = speak(el, on);
        push(el, { el, text: `Tab ${n} → ${l.text}`, ok: true }, el === 'tabs' ? 'Focus vào nhóm thẻ. Phím ← → để đổi thẻ (roving tabindex do @angular/aria lo).' : `Phím Tab lần ${n}: focus tới "${l.text}".`, el === 'tabs' ? 'tabs' : el === 'heart' ? 'semantic' : el === 'qty' ? 'label' : 'semantic');
        if (el === 'tabs') push('tabs', { el, text: '→ Thông số, thẻ đã chọn, 2 trên 3', ok: true }, 'Bấm → : chuyển sang thẻ "Thông số" mà không cần chuột.', 'tabs');
      }
      const missing: string[] = [];
      if (!on.has('semantic')) missing.push('nút ♥ (div không nhận focus)');
      if (!on.has('tabs')) missing.push('các thẻ Mô tả/Thông số');
      for (const m of missing) lines.push({ el: 'heart', text: `Không tới được: ${m}`, ok: false });
      const ok = missing.length === 0;
      steps.push({ frame: { focus: null, lines: [...lines], toast: false }, caption: ok ? 'Mọi thứ bấm được đều tới được bằng bàn phím!' : `Phím Tab bỏ qua ${missing.length} phần tử bấm được.`, tag: ok ? 'kb-ok' : undefined, sound: ok ? 'ting' : 'boop', anchor: ok ? undefined : 'semantic', duration: 1200 });
    }
    this.tl.load(steps);
  }
}
