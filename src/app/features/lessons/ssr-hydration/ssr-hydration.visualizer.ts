import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { BrowserFrame } from '../../../shared/ui/browser-frame/browser-frame';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type RenderMode = 'csr' | 'ssr' | 'incremental';
type ReadAt = 'constructor' | 'after';
type Click = 'none' | 'impossible' | 'queued' | 'lost' | 'handled';
interface Frame {
  t: number;
  page: 'blank' | 'static' | 'live' | 'flash';
  js: number; // 0..1
  click: Click;
  cart: number;
  reviews: 'static' | 'live';
  error: boolean;
  marks: { fcp?: number; tti?: number };
}
const MODES: { id: RenderMode; label: string }[] = [
  { id: 'csr', label: 'CSR (chỉ trình duyệt)' },
  { id: 'ssr', label: 'SSR + hydration' },
  { id: 'incremental', label: 'SSR + incremental hydration' },
];
const MAX = 2600;

@Component({
  selector: 'app-ssr-hydration-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, BrowserFrame],
  template: `
    @let f = tl.frame();
    <div class="wrap">
      <div class="controls">
        <p class="eyebrow">Cách render</p>
        @for (m of modes; track m.id) {
          <label class="opt" [appAnchor]="m.id === 'incremental' ? 'incremental' : m.id === 'ssr' ? 'ssr' : 'csr'">
            <input type="radio" name="rmode" [checked]="mode() === m.id" (change)="mode.set(m.id)" /> {{ m.label }}
          </label>
        }
        <label class="opt" appAnchor="replay"><input type="checkbox" [checked]="replay()" (change)="replay.set(!replay())" /> withEventReplay()</label>
        <p class="eyebrow">Đọc localStorage ở</p>
        <label class="opt" appAnchor="mismatch"><input type="radio" name="readat" [checked]="readAt() === 'constructor'" (change)="readAt.set('constructor')" /> constructor (lúc render)</label>
        <label class="opt" appAnchor="after"><input type="radio" name="readat" [checked]="readAt() === 'after'" (change)="readAt.set('after')" /> afterNextRender</label>
        <label class="opt"><input type="checkbox" [checked]="earlyClick()" (change)="earlyClick.set(!earlyClick())" /> Người dùng bấm "Mua" lúc 800ms</label>
        <button type="button" class="btn btn-sm btn-primary go" (click)="run()"><app-icon name="replay" [size]="14" /> Tải trang</button>
      </div>

      <div class="view">
        <app-browser-frame url="shop.bip.vn/ao-mua">
          <div class="page" [class.blank]="f.page === 'blank'" [class.flash]="f.page === 'flash'">
            @if (f.page === 'blank') {
              <p class="white">(trang trắng)</p>
            } @else {
              <div class="prod">
                <div class="pimg"><app-icon name="gift" [size]="28" /></div>
                <div>
                  <strong>Áo mưa Bíp</strong>
                  <p class="price">199.000đ</p>
                  <button type="button" class="buy" [class.dead]="f.page !== 'live'" tabindex="-1">
                    @if (f.page !== 'live') { <app-icon name="lock" [size]="12" /> } Mua · giỏ {{ f.cart }}
                  </button>
                  @if (f.click === 'queued') { <span class="tag q">click đang chờ…</span> }
                  @if (f.click === 'lost') { <span class="tag lost">click bị mất!</span> }
                  @if (f.click === 'impossible') { <span class="tag lost">bấm vào khoảng trắng</span> }
                </div>
              </div>
              <div class="reviews" [class.dead]="f.reviews === 'static'">
                Bình luận (12) {{ f.reviews === 'static' ? '· chưa hydrate' : '· đã hydrate' }}
              </div>
            }
            @if (f.error) { <div class="err">NG0500: Hydration mismatch — vẽ lại component!</div> }
          </div>
        </app-browser-frame>

        <div class="track" role="img" [attr.aria-label]="'Thời điểm ' + f.t + ' mili giây'">
          <div class="js" [style.width.%]="f.js * 100" [appAnchor]="'hydrate'"></div>
          <div class="cursor" [style.left.%]="(f.t / max) * 100"></div>
          @if (f.marks.fcp !== undefined) { <span class="mark fcp" [style.left.%]="(f.marks.fcp / max) * 100">FCP {{ f.marks.fcp }}ms</span> }
          @if (f.marks.tti !== undefined) { <span class="mark tti" [style.left.%]="(f.marks.tti / max) * 100">Tương tác {{ f.marks.tti }}ms</span> }
          <span class="sec" style="left: 38.46%">1s</span>
          <span class="sec" style="left: 76.92%">2s</span>
        </div>
        <p class="legend"><span class="sw js-sw"></span> JS đã tải · <b>FCP</b>: nội dung đầu tiên hiện ra · <b>Tương tác</b>: hydrate xong</p>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .wrap { display: grid; grid-template-columns: minmax(0, 290px) 1fr; gap: 20px; padding: 18px 22px 10px; }
    .controls { display: grid; gap: 4px; align-content: start; }
    .opt { display: flex; gap: 8px; align-items: center; padding: 4px 6px; border-radius: 8px; font-weight: 700; font-size: var(--fs-sm); cursor: pointer; }
    .opt.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .eyebrow { margin-top: 6px; }
    .go { justify-self: start; margin-top: 8px; }
    .view { display: grid; gap: 10px; min-width: 0; }
    .page { position: relative; min-height: 170px; padding: 12px; background: #fff; color: #111; transition: background var(--dur); }
    .page.blank { display: grid; place-items: center; }
    .page.flash { animation: flash 0.5s; }
    .white { color: #999; font-style: italic; }
    .prod { display: flex; gap: 12px; align-items: center; }
    .pimg { display: grid; place-items: center; width: 80px; height: 80px; background: #fde68a; border-radius: 10px; }
    .price { margin: 2px 0 6px; color: #b45309; font-weight: 700; }
    .buy { display: inline-flex; gap: 4px; align-items: center; padding: 4px 12px; border: 0; border-radius: 8px; background: #1a56db; color: #fff; font: inherit; font-weight: 700; }
    .buy.dead { background: #64748b; }
    .tag { display: inline-block; margin-left: 6px; padding: 1px 7px; border-radius: 6px; font-size: 12px; font-weight: 800; }
    .tag.q { background: #fef3c7; color: #92400e; }
    .tag.lost { background: #fee2e2; color: #991b1b; }
    .reviews { margin-top: 10px; padding: 6px 10px; border: 1px dashed #94a3b8; border-radius: 8px; font-size: 13px; }
    .reviews.dead { color: #64748b; }
    .err { position: absolute; left: 8px; right: 8px; bottom: 8px; padding: 6px 10px; background: #fee2e2; color: #991b1b; border: 2px solid #b91c1c; border-radius: 8px; font-weight: 800; font-size: 13px; }
    .track { position: relative; height: 38px; margin-top: 14px; border: var(--border); border-radius: 10px; background: var(--surface); }
    .js { position: absolute; left: 0; top: 0; bottom: 0; background: var(--c-di); opacity: 0.55; border-radius: 8px 0 0 8px; transition: width var(--dur-slow) var(--ease-out); }
    .js.is-hl { opacity: 0.9; }
    .cursor { position: absolute; top: -6px; bottom: -6px; width: 3px; background: var(--pal-ink); transition: left var(--dur-slow) var(--ease-out); }
    .mark { position: absolute; top: -22px; transform: translateX(-50%); padding: 0 6px; font-size: 11px; font-weight: 800; border: var(--border-thin); border-radius: 6px; white-space: nowrap; }
    .mark.fcp { background: var(--c-data); color: var(--on-accent); }
    .mark.tti { top: 40px; background: var(--c-event); color: var(--pal-ink); }
    .sec { position: absolute; bottom: 2px; font-size: 10px; color: var(--text-muted); transform: translateX(-50%); }
    .legend { margin: 18px 0 0; font-size: var(--fs-sm); }
    .sw { display: inline-block; width: 14px; height: 10px; border-radius: 3px; vertical-align: middle; }
    .js-sw { background: var(--c-di); opacity: 0.7; }
    @keyframes flash { 50% { background: #fecaca; } }
    @media (max-width: 760px) { .wrap { grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce) { .page.flash { animation: none; } }
  `,
})
export class SsrHydrationVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly modes = MODES;
  protected readonly max = MAX;
  protected readonly mode = signal<RenderMode>('csr');
  protected readonly replay = signal(false);
  protected readonly readAt = signal<ReadAt>('constructor');
  protected readonly earlyClick = signal(true);

  protected readonly tl = createTimeline<Frame>(
    { t: 0, page: 'blank', js: 0, click: 'none', cart: 0, reviews: 'static', error: false, marks: {} },
    {
      onEnter: (s) => {
        this.ctx.stepAnchor.set(s.anchor ?? null);
        for (const tag of (s.tag ?? '').split(' ').filter(Boolean)) this.ctx.completeChallenge(tag);
      },
    },
  );

  protected run(): void {
    const mode = this.mode();
    const ssr = mode !== 'csr';
    const replay = this.replay();
    const early = this.earlyClick();
    const mismatch = ssr && this.readAt() === 'constructor';
    const steps: Step<Frame>[] = [];
    let f: Frame = { t: 0, page: 'blank', js: 0, click: 'none', cart: 0, reviews: 'static', error: false, marks: {} };
    const add = (patch: Partial<Frame>, caption: string, anchor?: string, sound?: Step<Frame>['sound']) => {
      f = { ...f, ...patch, marks: { ...f.marks, ...(patch.marks ?? {}) } };
      steps.push({ frame: f, caption, anchor, sound, duration: 1300 });
    };

    add({}, 'Người dùng mở trang shop.bip.vn/ao-mua.', ssr ? 'ssr' : undefined);
    const jsTotal = mode === 'incremental' ? 0.62 : 1;
    if (!ssr) {
      add({ t: 200 }, 'Server trả về index.html gần như rỗng: chỉ có <app-root></app-root>. Trang vẫn trắng.');
      add({ t: 800, js: 0.45, click: early ? 'impossible' : 'none' }, early ? '800ms: người dùng định bấm "Mua"… nhưng chưa có gì trên màn hình!' : 'Trình duyệt đang tải bundle JS (~400 KB)…', undefined, early ? 'boop' : undefined);
      add({ t: 1400, js: 1 }, 'JS tải xong. Angular bắt đầu khởi động và render từ con số 0.');
      add({ t: 1700, page: 'live', reviews: 'live', marks: { fcp: 1700, tti: 1700 } }, 'Lúc này nội dung mới hiện ra và tương tác được cùng lúc — FCP muộn tới 1,7 giây.', undefined, 'pop');
    } else {
      add({ t: 400, page: 'static', marks: { fcp: 500 } }, 'Server chạy Angular, trả về HTML đầy đủ. Nội dung hiện NGAY (FCP ~500ms) nhưng các nút chưa hoạt động.', 'ssr', 'pop');
      if (early) {
        add({ t: 800, js: mode === 'incremental' ? 0.35 : 0.25, click: replay ? 'queued' : 'lost' }, replay ? '800ms: người dùng bấm "Mua". Event replay ghi lại cú click để phát lại sau.' : '800ms: người dùng bấm "Mua" — chưa hydrate nên cú click rơi vào hư không!', 'replay', replay ? 'pop' : 'boop');
      }
      const jsDone = mode === 'incremental' ? 1100 : 1700;
      add({ t: jsDone, js: jsTotal }, mode === 'incremental' ? 'JS cần thiết đã tải (phần bình luận để sau nhờ @defer hydrate on viewport).' : 'JS của cả trang tải xong.', mode === 'incremental' ? 'incremental' : 'hydrate');
      const hyd = jsDone + 150;
      if (mismatch) {
        add({ t: hyd, page: 'flash', error: true }, 'Hydrate… nhưng server render "lần ghé: ?" còn trình duyệt đọc localStorage ra "lần ghé: 3" → HTML lệch nhau, Angular vẽ lại component (nháy trang).', 'mismatch', 'boop');
      }
      const tti = hyd + (mismatch ? 300 : 0);
      const handled = early && replay;
      add({ t: tti, page: 'live', error: mismatch, cart: handled ? 1 : 0, click: handled ? 'handled' : f.click, marks: { tti } }, `Hydrate xong lúc ${tti}ms: DOM có sẵn được dùng lại, sự kiện đã gắn.${handled ? ' Cú click đang chờ được phát lại → giỏ = 1!' : ''}`, handled ? 'replay' : 'hydrate', 'pop');
      if (mode === 'incremental') {
        add({ t: 2300, reviews: 'live', js: 1 }, 'Người dùng cuộn tới phần bình luận → tải và hydrate riêng phần đó.', 'incremental');
      }
    }

    const tags: string[] = [];
    if ((f.marks.fcp ?? 9999) < 1000) tags.push('ssr-fcp');
    if (f.click === 'handled') tags.push('ssr-replay');
    if (ssr && !mismatch) tags.push('ssr-mismatch');
    const fcp = f.marks.fcp!;
    const tti = f.marks.tti!;
    steps.push({
      frame: { ...f, click: f.click === 'queued' ? 'handled' : f.click },
      caption: `Tổng kết: nội dung hiện lúc ${fcp}ms, tương tác được lúc ${tti}ms${mismatch ? ', có lỗi lệch hydration' : ''}${f.click === 'lost' || f.click === 'impossible' ? ', mất một cú click' : ''}.`,
      tag: tags.join(' ') || undefined,
      sound: tags.length ? 'ting' : 'boop',
      duration: 1000,
    });
    this.tl.load(steps);
  }
}
