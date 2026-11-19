import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type TestId = 'card' | 'http';
interface Line {
  text: string;
  off?: boolean; // dòng bị thiếu (hiện mờ)
  anchor?: string;
}
interface Frame {
  line: number; // dòng đang chạy, -1 = chưa chạy
  rendered: boolean;
  clicked: boolean;
  msg: boolean;
  req: 'none' | 'pending' | 'flushed' | 'network';
  items: number;
  result: { ok: boolean; text: string } | null;
}
const EMPTY: Frame = { line: -1, rendered: false, clicked: false, msg: false, req: 'none', items: 0, result: null };

@Component({
  selector: 'app-testing-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="top">
      <div class="group" role="group" aria-label="Chọn test">
        <button type="button" class="chip" [class.chip-event]="test() === 'card'" [class.chip-plain]="test() !== 'card'" (click)="pick('card')">ProductCard › hiện thông báo sau khi thêm</button>
        <button type="button" class="chip" [class.chip-event]="test() === 'http'" [class.chip-plain]="test() !== 'http'" (click)="pick('http')">CartService › load() lưu kết quả</button>
      </div>
      <div class="group opts">
        @if (test() === 'card') {
          <label appAnchor="mock"><input type="checkbox" [checked]="mock()" (change)="mock.set(!mock())" /> Thay CartService bằng mock</label>
          <label appAnchor="stable"><input type="checkbox" [checked]="stable()" (change)="stable.set(!stable())" /> await whenStable() sau khi click</label>
        } @else {
          <label appAnchor="httptest"><input type="checkbox" [checked]="httpTesting()" (change)="httpTesting.set(!httpTesting())" /> provideHttpClientTesting + flush()</label>
        }
        <button type="button" class="btn btn-sm btn-primary" (click)="run()"><app-icon name="play" [size]="14" /> Chạy test</button>
      </div>
    </div>

    <div class="bench">
      <ol class="code" aria-label="Mã test">
        @for (l of lines(); track $index) {
          <li [class.cur]="f.line === $index" [class.off]="l.off" [class.done]="f.line > $index"><code>{{ l.text }}</code></li>
        }
      </ol>

      <div class="side">
        @if (test() === 'card') {
          <div class="panel">
            <p class="eyebrow">Injector của TestBed</p>
            <div class="prov" [class.mockp]="mock()">CartService → {{ mock() ? '{ add: vi.fn() } (mock)' : 'CartService thật (cần HttpClient)' }}</div>
          </div>
          <div class="panel">
            <p class="eyebrow">fixture.nativeElement</p>
            <div class="preview" [class.empty]="!f.rendered">
              @if (f.rendered) {
                <strong>Áo mưa Bíp</strong>
                <span>199,000đ</span>
                <span class="btnp" [class.pressed]="f.clicked">Thêm vào giỏ</span>
                @if (f.msg) { <span class="msg">Đã thêm!</span> }
              } @else {
                <span class="muted">(chưa render)</span>
              }
            </div>
          </div>
        } @else {
          <div class="panel">
            <p class="eyebrow">{{ httpTesting() ? 'HttpTestingController' : 'Mạng thật' }}</p>
            <div class="req" [class.pending]="f.req === 'pending'" [class.flushed]="f.req === 'flushed'" [class.net]="f.req === 'network'">
              @switch (f.req) {
                @case ('none') { không có request }
                @case ('pending') { GET /api/cart · đang chờ flush() }
                @case ('flushed') { GET /api/cart · đã trả 1 sản phẩm giả }
                @case ('network') { GET /api/cart · đi ra mạng thật, chưa có phản hồi… }
              }
            </div>
          </div>
          <div class="panel">
            <p class="eyebrow">service.items()</p>
            <div class="preview">{{ f.items }} sản phẩm</div>
          </div>
        }
        @if (f.result; as r) {
          <div class="result" [class.ok]="r.ok" [class.fail]="!r.ok" role="status">
            <app-icon [name]="r.ok ? 'check' : 'error'" [size]="16" /> {{ r.text }}
          </div>
        }
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .top { display: grid; gap: 10px; padding: 16px 22px 6px; }
    .group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .group .chip { cursor: pointer; }
    .opts { gap: 8px 16px; font-size: var(--fs-sm); font-weight: 500; }
    .opts label { display: flex; gap: 6px; align-items: center; cursor: pointer; padding: 2px 6px; border-radius: 6px; }
    .opts label.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .bench { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 16px; padding: 10px 22px 12px; }
    .code { margin: 0; padding: 10px 0; list-style: none; counter-reset: ln; background: var(--code-bg); border: var(--border); border-radius: var(--radius); overflow-x: auto; }
    .code li { counter-increment: ln; display: flex; gap: 10px; padding: 1px 12px; font-size: 12.5px; white-space: pre; transition: background-color var(--dur-fast); }
    .code li::before { content: counter(ln); width: 18px; flex: none; text-align: right; color: var(--code-gutter); font-family: var(--font-mono); }
    .code code { padding: 0; border: 0; background: none; font-size: inherit; }
    .code li.cur { background: color-mix(in srgb, var(--c-signal) 35%, transparent); }
    .code li.done { opacity: 0.85; }
    .code li.off code { color: var(--text-muted); font-style: italic; }
    .side { display: grid; gap: 10px; align-content: start; min-width: 0; }
    .panel { padding: 10px 12px; border: var(--border); border-radius: var(--radius); background: var(--surface); }
    .panel .eyebrow { margin: 0 0 6px; }
    .prov { font-family: var(--font-mono); font-size: 12.5px; padding: 6px 8px; border-radius: 6px; background: color-mix(in srgb, var(--c-error) 15%, var(--surface)); }
    .prov.mockp { background: color-mix(in srgb, var(--c-di) 18%, var(--surface)); }
    .preview { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; min-height: 34px; padding: 8px 10px; background: #fff; color: #111; border: 1px dashed #cbd5e1; border-radius: 8px; font-size: 13px; }
    .preview.empty { justify-content: center; }
    .btnp { padding: 2px 10px; border: 1px solid #94a3b8; border-radius: 6px; background: #f1f5f9; }
    .btnp.pressed { background: #e0e7ff; border-color: #6366f1; }
    .msg { color: #15803d; font-weight: 600; }
    .muted { color: #64748b; }
    .req { font-family: var(--font-mono); font-size: 12.5px; padding: 6px 8px; border-radius: 6px; background: var(--surface-sunken); }
    .req.pending { background: color-mix(in srgb, var(--c-signal) 30%, var(--surface)); }
    .req.flushed { background: color-mix(in srgb, var(--c-data) 25%, var(--surface)); }
    .req.net { background: color-mix(in srgb, var(--c-error) 18%, var(--surface)); }
    .result { display: flex; gap: 8px; align-items: center; padding: 8px 12px; border-radius: var(--radius); font-weight: 600; font-size: var(--fs-sm); }
    .result.ok { background: color-mix(in srgb, var(--c-data) 25%, var(--surface)); color: var(--c-data-strong); border: 1px solid var(--c-data); }
    .result.fail { background: color-mix(in srgb, var(--c-error) 15%, var(--surface)); color: var(--c-error-strong); border: 1px solid var(--c-error); }
    @media (max-width: 860px) { .bench { grid-template-columns: minmax(0, 1fr); } }
  `,
})
export class TestingVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly test = signal<TestId>('card');
  protected readonly mock = signal(false);
  protected readonly stable = signal(false);
  protected readonly httpTesting = signal(false);

  protected readonly lines = computed<Line[]>(() => {
    if (this.test() === 'card') {
      return [
        { text: 'beforeEach(async () => {' },
        { text: '  TestBed.configureTestingModule({', anchor: 'configure' },
        { text: '    imports: [ProductCard],', anchor: 'configure' },
        this.mock() ? { text: '    providers: [{ provide: CartService, useValue: cart }],', anchor: 'mock' } : { text: '    // không khai báo → dùng CartService thật', off: true, anchor: 'mock' },
        { text: '  });' },
        { text: '  fixture = TestBed.createComponent(ProductCard);', anchor: 'create' },
        { text: "  fixture.componentRef.setInput('product', product);", anchor: 'create' },
        { text: '  await fixture.whenStable();', anchor: 'stable' },
        { text: '});' },
        { text: "it('hiện thông báo sau khi thêm', async () => {" },
        { text: "  fixture.nativeElement.querySelector('button').click();", anchor: 'act' },
        this.stable() ? { text: '  await fixture.whenStable();', anchor: 'stable' } : { text: '  // (không chờ Angular cập nhật DOM)', off: true, anchor: 'stable' },
        { text: "  expect(fixture.nativeElement.textContent).toContain('Đã thêm!');", anchor: 'assert' },
        { text: '});' },
      ];
    }
    const t = this.httpTesting();
    return [
      { text: 'TestBed.configureTestingModule({', anchor: 'configure' },
      t ? { text: '  providers: [provideHttpClient(), provideHttpClientTesting()],', anchor: 'httptest' } : { text: '  providers: [provideHttpClient()], // HTTP thật', anchor: 'httptest' },
      { text: '});' },
      { text: 'const service = TestBed.inject(CartService);', anchor: 'create' },
      t ? { text: 'const http = TestBed.inject(HttpTestingController);', anchor: 'httptest' } : { text: '// (không có HttpTestingController)', off: true, anchor: 'httptest' },
      { text: 'service.load().subscribe();', anchor: 'act' },
      t ? { text: "http.expectOne('/api/cart').flush([aoMua]);", anchor: 'httptest' } : { text: '// (không ai trả dữ liệu cho request)', off: true, anchor: 'httptest' },
      { text: 'expect(service.items().length).toBe(1);', anchor: 'assert' },
    ];
  });

  protected readonly tl = createTimeline<Frame>(EMPTY, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      for (const tag of (s.tag ?? '').split(' ').filter(Boolean)) this.ctx.completeChallenge(tag);
    },
  });

  protected pick(t: TestId): void {
    this.test.set(t);
    this.tl.load([{ frame: EMPTY, caption: 'Bật/tắt các thành phần rồi bấm "Chạy test".' }], false);
  }

  protected run(): void {
    const lines = this.lines();
    const steps: Step<Frame>[] = [];
    let f: Frame = { ...EMPTY };
    const at = (line: number, patch: Partial<Frame>, caption: string, extra: Partial<Step<Frame>> = {}) => {
      f = { ...f, ...patch, line };
      steps.push({ frame: f, caption, anchor: lines[line]?.anchor, duration: 1100, ...extra });
    };

    if (this.test() === 'card') {
      at(1, {}, 'Arrange: dựng môi trường test với ProductCard.');
      at(3, {}, this.mock() ? 'Provider CartService được thay bằng object giả có add = vi.fn().' : 'Không có provider nào được khai báo → Angular sẽ dùng CartService thật.');
      if (!this.mock()) {
        at(5, { result: { ok: false, text: 'NullInjectorError: No provider for HttpClient!' } }, 'createComponent: CartService thật cần HttpClient, nhưng môi trường test không có → lỗi ngay.', { sound: 'boop' });
        this.tl.load(steps);
        return;
      }
      at(5, {}, 'createComponent tạo ProductCard cùng ComponentFixture.', { tag: 'tst-mock' });
      at(6, {}, 'Truyền input product như component cha sẽ làm.');
      at(7, { rendered: true }, 'Chờ Angular render lần đầu: tên, giá và nút xuất hiện.', { sound: 'pop' });
      at(10, { clicked: true }, 'Act: click nút như người dùng. Signal added đổi thành true…');
      if (this.stable()) {
        at(11, { msg: true }, '…await whenStable(): Angular cập nhật DOM, dòng "Đã thêm!" xuất hiện.', { sound: 'pop' });
        at(12, { result: { ok: true, text: '✓ PASS — tìm thấy "Đã thêm!" trong DOM' } }, 'Assert: textContent chứa "Đã thêm!" → test pass.', { sound: 'ting', tag: 'tst-stable' });
      } else {
        at(12, { result: { ok: false, text: 'FAIL — mong đợi textContent chứa "Đã thêm!"' } }, 'Assert chạy ngay khi DOM CHƯA kịp cập nhật → không thấy "Đã thêm!" → fail.', { sound: 'boop' });
      }
    } else {
      const t = this.httpTesting();
      at(1, {}, t ? 'Arrange: HttpClient được nối vào backend giả của HttpTestingController.' : 'Arrange: HttpClient thật, request sẽ đi ra mạng.');
      at(3, {}, 'Lấy CartService từ injector của TestBed.');
      if (t) at(4, {}, 'Lấy HttpTestingController để điều khiển các request.');
      at(5, { req: t ? 'pending' : 'network' }, t ? 'Act: load() gửi GET /api/cart — request bị giữ lại, chờ bạn quyết định trả gì.' : 'Act: load() gửi GET /api/cart ra mạng thật. Trong môi trường test không có server…', { sound: t ? 'pop' : 'boop' });
      if (t) at(6, { req: 'flushed', items: 1 }, 'expectOne xác nhận đúng 1 request tới /api/cart, flush() trả dữ liệu giả ngay lập tức.', { sound: 'pop' });
      at(7, { result: t ? { ok: true, text: '✓ PASS — items có 1 sản phẩm' } : { ok: false, text: 'FAIL — mong đợi 1, nhận 0 (request thật vẫn đang treo)' } }, t ? 'Assert: items() có 1 phần tử → pass, không tốn một mili giây mạng nào.' : 'Assert chạy khi chưa có phản hồi → items rỗng → fail (và test sẽ chậm, phụ thuộc server).', { sound: t ? 'ting' : 'boop', tag: t ? 'tst-http' : undefined });
    }
    this.tl.load(steps);
  }
}
