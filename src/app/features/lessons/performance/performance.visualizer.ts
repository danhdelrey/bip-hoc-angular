import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { Mascot } from '../../../shared/ui/mascot/mascot';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Act = 'type' | 'reload' | 'initial';
type Cure = 'computed' | 'track' | 'onpush' | 'virtual' | 'defer' | 'image';
const CURES: { id: Cure; label: string; icon: string }[] = [
  { id: 'computed', label: 'computed thay hàm trong template', icon: 'signal' },
  { id: 'track', label: 'track p.id (không track object)', icon: 'branch' },
  { id: 'onpush', label: 'OnPush + signals', icon: 'magnifier' },
  { id: 'virtual', label: 'Virtual scroll (chỉ ~20 dòng)', icon: 'form' },
  { id: 'defer', label: '@defer phần biểu đồ nặng', icon: 'gift' },
  { id: 'image', label: 'NgOptimizedImage (lazy, đúng size)', icon: 'house' },
];
const ACTS: { id: Act; label: string }[] = [
  { id: 'type', label: 'Gõ vào ô lọc' },
  { id: 'reload', label: 'Tải lại danh sách từ API' },
  { id: 'initial', label: 'Mở trang lần đầu' },
];

interface Report {
  filterMs: number;
  cdMs: number;
  checked: number;
  domNodes: number;
  domMs: number;
  layoutMs: number;
  jsKb: number;
  imgKb: number;
}
interface Frame {
  phase: number; // số giai đoạn đã hiện
  r: Report;
}

/** Mô hình chi phí đơn giản hoá (con số minh hoạ, không phải đo thật) */
function measure(act: Act, on: Set<Cure>): Report {
  const rows = on.has('virtual') ? 20 : 1000;
  const filterRuns = on.has('computed') ? 1 : 4; // hàm trong template chạy lại ở mỗi lần kiểm tra
  const filterMs = act === 'initial' ? 2 : 1.6 * filterRuns;
  const checked = on.has('onpush') ? (act === 'type' ? 3 : rows + 2) : rows + 6;
  const cdMs = +(checked * 0.009).toFixed(1);
  let domNodes: number;
  if (act === 'initial') domNodes = rows * 4;
  else if (act === 'reload') domNodes = on.has('track') ? 0 : rows * 4;
  else domNodes = on.has('track') ? Math.round(rows * 0.3) : rows * 4;
  const domMs = +(domNodes * 0.006).toFixed(1);
  const layoutMs = +(Math.max(1, (on.has('virtual') ? 20 : 1000) * 0.008 + domNodes * 0.002)).toFixed(1);
  const jsKb = act === 'initial' ? (on.has('defer') ? 230 : 410) : 0;
  const imgKb = act === 'initial' ? (on.has('image') ? 120 : 2400) : 0;
  return { filterMs: +filterMs.toFixed(1), cdMs, checked, domNodes, domMs, layoutMs, jsKb, imgKb };
}

@Component({
  selector: 'app-performance-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, Mascot],
  template: `
    @let f = tl.frame();
    @let total = frameMs(f.r);
    <div class="clinic">
      <div class="left">
        <p class="eyebrow">Thao tác cần khám</p>
        <div class="acts">
          @for (a of acts; track a.id) {
            <button type="button" class="chip" [class.chip-signal]="act() === a.id" [class.chip-plain]="act() !== a.id" (click)="act.set(a.id); run()">{{ a.label }}</button>
          }
        </div>
        <p class="eyebrow">Đơn thuốc</p>
        @for (c of cures; track c.id) {
          <label class="cure" [appAnchor]="c.id">
            <input type="checkbox" [checked]="on().has(c.id)" (change)="toggle(c.id)" />
            <app-icon [name]="c.icon" [size]="16" /> {{ c.label }}
          </label>
        }
        <button type="button" class="btn btn-sm btn-primary run" (click)="run()" appAnchor="measure"><app-icon name="magnifier" [size]="14" /> Đo lại</button>
      </div>

      <div class="right">
        <div class="patient">
          <app-mascot [mood]="act() === 'initial' ? (kb(f.r) < 400 ? 'celebrate' : 'sad') : total < 16 ? 'celebrate' : total < 50 ? 'thinking' : 'sad'" [size]="70" />
          <div class="gauge" [class.good]="isGood(f.r)" [class.bad]="!isGood(f.r)">
            @if (act() === 'initial') {
              <strong>{{ kb(f.r) }} KB</strong><span>tải lần đầu</span>
            } @else {
              <strong>{{ total }} ms</strong><span>≈ {{ fps(total) }} fps</span>
            }
          </div>
        </div>
        @if (act() !== 'initial') {
          <div class="bar" role="img" [attr.aria-label]="'Khung hình ' + total + ' mili giây'">
            <span class="seg s-filter" [style.flex]="f.phase >= 1 ? f.r.filterMs : 0" appAnchor="computed">lọc</span>
            <span class="seg s-cd" [style.flex]="f.phase >= 2 ? f.r.cdMs : 0" appAnchor="onpush">CD</span>
            <span class="seg s-dom" [style.flex]="f.phase >= 3 ? f.r.domMs : 0" appAnchor="track">DOM</span>
            <span class="seg s-layout" [style.flex]="f.phase >= 4 ? f.r.layoutMs : 0" appAnchor="virtual">layout</span>
            <span class="seg s-free" [style.flex]="Math.max(0, 60 - (f.phase >= 4 ? total : 0))"></span>
            <span class="budget" title="16ms"></span>
          </div>
          <ul class="stats">
            <li>Chạy filter: <b>{{ f.r.filterMs }} ms</b></li>
            <li>Kiểm tra component: <b>{{ f.r.checked }}</b> ({{ f.r.cdMs }} ms)</li>
            <li>Node DOM tạo mới: <b>{{ f.r.domNodes }}</b> ({{ f.r.domMs }} ms)</li>
            <li>Layout & paint: <b>{{ f.r.layoutMs }} ms</b></li>
          </ul>
        } @else {
          <div class="net">
            <div class="nrow" appAnchor="defer"><span>JavaScript</span><span class="nbar" [style.width.%]="f.phase >= 1 ? f.r.jsKb / 30 : 0"></span><b>{{ f.r.jsKb }} KB</b></div>
            <div class="nrow" appAnchor="image"><span>Ảnh</span><span class="nbar img" [style.width.%]="f.phase >= 2 ? f.r.imgKb / 30 : 0"></span><b>{{ f.r.imgKb }} KB</b></div>
          </div>
        }
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .clinic { display: grid; grid-template-columns: 330px 1fr; gap: 20px; padding: 18px 22px 12px; }
    .left { display: grid; gap: 6px; align-content: start; }
    .acts { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
    .acts .chip { cursor: pointer; }
    .cure { display: flex; gap: 8px; align-items: center; padding: 5px 8px; font-weight: 700; font-size: var(--fs-sm); border-radius: 10px; cursor: pointer; }
    .cure:hover, .cure.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .run { justify-self: start; margin-top: 6px; }
    .right { display: grid; gap: 12px; align-content: start; min-width: 0; }
    .patient { display: flex; align-items: center; gap: 16px; }
    .gauge { display: grid; padding: 8px 16px; border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); }
    .gauge strong { font-family: var(--font-display); font-size: var(--fs-2xl); line-height: 1; }
    .gauge.good { background: var(--c-data); color: var(--on-accent); }
    .gauge.bad { background: var(--c-error); color: var(--on-accent); }
    .bar { position: relative; display: flex; height: 44px; border: var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .seg { display: grid; place-items: center; min-width: 0; overflow: hidden; font-size: 11px; font-weight: 600; color: var(--pal-ink); white-space: nowrap; transition: flex var(--dur-slow) var(--ease-out); }
    .seg.is-hl { outline: 3px solid var(--c-signal-strong); outline-offset: -3px; }
    .s-filter { background: var(--c-signal); }
    .s-cd { background: var(--c-di); }
    .s-dom { background: var(--c-event); }
    .s-layout { background: var(--c-brand); }
    .s-free { background: transparent; }
    .budget { position: absolute; left: calc(16 / 60 * 100%); top: -2px; bottom: -2px; border-left: 3px dashed var(--c-error-strong); }
    .budget::after { content: '16ms'; position: absolute; left: 4px; top: 2px; font-size: 10px; font-weight: 600; color: var(--c-error-strong); }
    .stats { margin: 0; padding-left: 18px; font-size: var(--fs-sm); }
    .net { display: grid; gap: 10px; }
    .nrow { display: grid; grid-template-columns: 90px 1fr 70px; gap: 8px; align-items: center; font-weight: 700; font-size: var(--fs-sm); padding: 4px; border-radius: 8px; }
    .nrow.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .nbar { height: 18px; background: var(--c-di); border: var(--border-thin); border-radius: 6px; transition: width var(--dur-slow) var(--ease-out); max-width: 100%; }
    .nbar.img { background: var(--c-event); }
    @media (max-width: 820px) { .clinic { grid-template-columns: 1fr; } }
  `,
})
export class PerformanceVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly Math = Math;
  protected readonly cures = CURES;
  protected readonly acts = ACTS;
  protected readonly act = signal<Act>('type');
  protected readonly on = signal(new Set<Cure>());

  protected readonly tl = createTimeline<Frame>({ phase: 4, r: measure('type', new Set()) }, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag !== 'done') return;
      const r = s.frame.r;
      if (this.act() === 'type' && this.frameMs(r) < 16) this.ctx.completeChallenge('pf-60');
      if (this.act() === 'reload' && r.domNodes <= 10) this.ctx.completeChallenge('pf-dom');
      if (this.act() === 'initial' && this.kb(r) < 400) this.ctx.completeChallenge('pf-initial');
    },
  });

  protected frameMs(r: Report): number {
    return +(r.filterMs + r.cdMs + r.domMs + r.layoutMs).toFixed(1);
  }
  protected kb(r: Report): number {
    return r.jsKb + r.imgKb;
  }
  protected fps(ms: number): number {
    return Math.min(60, Math.round(1000 / Math.max(ms, 1)));
  }
  protected isGood(r: Report): boolean {
    return this.act() === 'initial' ? this.kb(r) < 400 : this.frameMs(r) < 16;
  }

  protected toggle(c: Cure): void {
    this.on.update((s) => {
      const n = new Set(s);
      n.has(c) ? n.delete(c) : n.add(c);
      return n;
    });
    this.run();
  }

  protected run(): void {
    const r = measure(this.act(), this.on());
    const on = this.on();
    const steps: Step<Frame>[] = [];
    if (this.act() === 'initial') {
      steps.push({ frame: { phase: 0, r }, caption: 'Người dùng mở trang: trình duyệt bắt đầu tải tài nguyên.', duration: 800 });
      steps.push({ frame: { phase: 1, r }, caption: on.has('defer') ? `JS ban đầu ${r.jsKb} KB — biểu đồ nặng đã tách ra chunk @defer, chỉ tải khi cuộn tới.` : `JS ban đầu ${r.jsKb} KB — gồm cả thư viện biểu đồ người dùng chưa cần.`, anchor: 'defer', duration: 1200 });
      steps.push({ frame: { phase: 2, r }, caption: on.has('image') ? `Ảnh ${r.imgKb} KB — NgOptimizedImage lazy-load ảnh dưới màn hình, tải đúng kích thước.` : `Ảnh ${r.imgKb} KB — tải ảnh gốc to tướng, kể cả ảnh chưa nhìn thấy.`, anchor: 'image', duration: 1200 });
    } else {
      steps.push({ frame: { phase: 0, r }, caption: this.act() === 'type' ? 'Sự kiện input: người dùng gõ thêm một ký tự.' : 'API trả về 1.000 sản phẩm — toàn bộ là object MỚI.', duration: 800 });
      steps.push({ frame: { phase: 1, r }, caption: on.has('computed') ? `Lọc danh sách: computed chạy đúng 1 lần (${r.filterMs} ms).` : `Lọc danh sách: hàm trong template chạy lại ở mỗi lần kiểm tra (${r.filterMs} ms).`, anchor: 'computed', duration: 1100 });
      steps.push({ frame: { phase: 2, r }, caption: `Change detection kiểm tra ${r.checked} component${on.has('onpush') ? ' — chỉ nhánh có thay đổi.' : ' — gần như cả cây.'}`, anchor: 'onpush', duration: 1100 });
      steps.push({ frame: { phase: 3, r }, caption: `Cập nhật DOM: tạo mới ${r.domNodes} node${on.has('track') ? ' — track p.id giữ lại node cũ.' : '.'}`, anchor: 'track', duration: 1100 });
      steps.push({ frame: { phase: 4, r }, caption: `Layout & paint: ${r.layoutMs} ms${on.has('virtual') ? ' — chỉ ~20 dòng trên màn hình.' : ' — trình duyệt xếp chỗ cho 1.000 dòng.'}`, anchor: 'virtual', duration: 1100 });
    }
    const good = this.act() === 'initial' ? this.kb(r) < 400 : this.frameMs(r) < 16;
    steps.push({ frame: { phase: 4, r }, caption: this.act() === 'initial' ? `Tổng tải lần đầu: ${this.kb(r)} KB ${good ? '— nhẹ nhàng!' : '— nặng quá, người dùng mạng yếu phải chờ lâu.'}` : `Tổng khung hình: ${this.frameMs(r)} ms ≈ ${this.fps(this.frameMs(r))} fps ${good ? '— mượt!' : '— giật lag.'}`, duration: 1000, sound: good ? 'ting' : 'boop', tag: 'done' });
    this.tl.load(steps);
  }
}
