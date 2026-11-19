import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './testing.samples';

export const TEST_CLI = `# Angular 21+ dùng Vitest làm test runner mặc định
ng test                 # chạy toàn bộ *.spec.ts, theo dõi thay đổi
ng test --watch=false   # chạy một lần (dùng trong CI)
ng test --coverage      # kèm báo cáo độ phủ

# Tạo component kèm file spec
ng generate component product-card   # → product-card.ts + product-card.spec.ts`;

export const TESTING: LessonContent = {
  slug: 'testing',
  definition:
    'Unit test là đoạn code tự động kiểm tra một đơn vị (component, service, pipe) hoạt động đúng, tách biệt khỏi phần còn lại; trong Angular, TestBed dựng một môi trường DI và render thu nhỏ để chạy từng test.',
  analogy: {
    text: 'Ví dụ xem mỗi test như một lần thử trên bàn thí nghiệm: đặt component lên bàn, thay các bộ phận bên ngoài bằng đồ giả, thao tác rồi đo kết quả.',
    map: [
      ['Bàn thí nghiệm', 'TestBed.configureTestingModule'],
      ['Đặt mẫu lên bàn', 'TestBed.createComponent → ComponentFixture'],
      ['Đồ giả thay bộ phận thật', 'mock / stub provider (useValue)'],
      ['Chờ mẫu ổn định', 'await fixture.whenStable()'],
      ['Máy đo', 'expect(...)'],
      ['Đường ống giả', 'HttpTestingController'],
    ],
  },
  intro:
    'Mỗi test theo mẫu Arrange → Act → Assert: cấu hình TestBed (component cần test và provider, thường là mock), tạo component qua ComponentFixture, thao tác như người dùng (click, nhập liệu) rồi kiểm tra DOM hoặc lời gọi tới mock. Ứng dụng zoneless nên sau mỗi thay đổi cần await fixture.whenStable() để Angular cập nhật DOM. Service gọi HTTP được test bằng provideHttpClientTesting: request không ra mạng mà nằm chờ trong HttpTestingController để bạn kiểm tra và trả dữ liệu giả bằng flush().',
  visualizer: {
    title: 'Bàn thí nghiệm TestBed',
    hint: 'Chọn một test, bật/tắt từng thành phần rồi bấm "Chạy test". Step-player đi qua từng dòng: dòng đang chạy được tô, khung bên phải cho thấy component được render, provider đang dùng và request HTTP.',
  },
  code: [
    { name: 'product-card.spec.ts', lang: 'typescript', code: SAMPLES['product-card.lesson-spec.ts'], anchors: { 9: 'mock', 14: 'configure', 15: 'configure', 16: 'mock', 18: 'create', 19: 'create', 20: 'stable', 34: 'act', 35: 'stable', 36: 'assert' } },
    { name: 'cart.service.spec.ts', lang: 'typescript', code: SAMPLES['cart.service.lesson-spec.ts'], anchors: { 13: 'httptest', 16: 'httptest', 19: 'httptest', 22: 'act', 23: 'httptest', 25: 'httptest', 26: 'assert' } },
    { name: 'product-card.ts', lang: 'angular-ts', code: SAMPLES['product-card.ts'], anchors: { 11: 'act', 12: 'assert', 13: 'assert' } },
    { name: 'cart.service.ts', lang: 'typescript', code: SAMPLES['cart.service.ts'] },
    { name: 'terminal', lang: 'typescript', code: TEST_CLI },
  ],
  liveNote: 'Bấm "Chạy test": 5 test trong hai file spec ở trên được chạy THẬT bằng TestBed ngay trong trình duyệt (với một bộ chạy mini có API giống Vitest). Trong dự án, bạn chạy chúng bằng ng test.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { provideHttpClient } from '@angular/common/http';\nimport { ProductCard } from './app/product-card';\n\n// Ứng dụng mẫu; test chạy bằng "ng test" trong terminal\nbootstrapApplication(ProductCard, { providers: [provideHttpClient()] }).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Testing</title></head>\n<body><app-product-card></app-product-card></body>\n</html>\n`,
  },
  challenges: [
    { id: 'tst-mock', title: 'Cho test của ProductCard vượt qua bước tạo component (hết NullInjectorError).', hint: 'CartService thật cần HttpClient. Trong unit test của component, thay nó bằng đồ giả.', praise: 'Đúng! Mock giúp test component độc lập với service và HTTP.' },
    { id: 'tst-stable', title: 'Làm cho test "hiện thông báo sau khi thêm" pass.', hint: 'Sau khi click, signal đã đổi nhưng DOM chưa kịp cập nhật.', praise: 'Chuẩn! await fixture.whenStable() đợi Angular render xong rồi mới kiểm tra.' },
    { id: 'tst-http', title: 'Làm cho test "load() lưu kết quả" pass mà không gọi mạng thật.', hint: 'Cần một HTTP giả để bắt request và trả dữ liệu ngay.', praise: 'Hay! provideHttpClientTesting + flush() cho test HTTP nhanh và ổn định.' },
  ],
  pitfalls: [
    {
      title: 'Kiểm tra DOM ngay sau khi đổi state',
      explain: 'Ứng dụng zoneless không cập nhật DOM đồng bộ. Phải chờ Angular render rồi mới đọc DOM.',
      wrong: { lang: 'typescript', code: `button.click();\nexpect(el.textContent).toContain('Đã thêm!'); // DOM còn cũ → fail` },
      right: { lang: 'typescript', code: `button.click();\nawait fixture.whenStable();\nexpect(el.textContent).toContain('Đã thêm!');` },
    },
    {
      title: 'Test cả dependency thật trong unit test component',
      explain: 'Kéo theo service thật, HTTP thật làm test chậm, dễ hỏng vì lý do không liên quan. Unit test component nên mock service; service có test riêng.',
      wrong: { lang: 'typescript', code: `TestBed.configureTestingModule({\n  imports: [ProductCard],\n  providers: [provideHttpClient()], // gọi API thật!\n});` },
      right: { lang: 'typescript', code: `TestBed.configureTestingModule({\n  imports: [ProductCard],\n  providers: [{ provide: CartService, useValue: { add: vi.fn() } }],\n});` },
    },
    {
      title: 'Test chi tiết cài đặt thay vì hành vi',
      explain: 'Gọi thẳng method private hay kiểm tra tên biến nội bộ khiến test vỡ mỗi lần refactor. Hãy thao tác qua DOM như người dùng và kiểm tra kết quả nhìn thấy được.',
      wrong: { lang: 'typescript', code: `component.add();\nexpect(component.added()).toBe(true);` },
      right: { lang: 'typescript', code: `fixture.nativeElement.querySelector('button').click();\nawait fixture.whenStable();\nexpect(fixture.nativeElement.textContent).toContain('Đã thêm!');` },
    },
  ],
  quiz: [
    { question: 'TestBed.configureTestingModule dùng để làm gì?', options: ['Khai báo component cần test và các provider (thật hoặc mock) cho môi trường test', 'Chạy ứng dụng ở chế độ production', 'Tạo file spec tự động', 'Đo độ phủ code'], correct: 0, explain: 'TestBed dựng một injector và môi trường render riêng cho từng test.' },
    { question: 'Sau khi click làm signal đổi, vì sao cần await fixture.whenStable()?', options: ['Để chờ request HTTP thật', 'Vì Angular (zoneless) cập nhật DOM bất đồng bộ; phải chờ render xong mới kiểm tra', 'Để reset TestBed', 'Không cần, DOM luôn cập nhật ngay'], correct: 1, explain: 'whenStable đợi tới khi không còn việc render/tác vụ đang chờ.' },
    { question: 'Trong test service dùng HttpClient, ai trả dữ liệu cho request?', options: ['Server thật', 'Bạn, thông qua HttpTestingController.expectOne(...).flush(data)', 'Angular tự sinh dữ liệu ngẫu nhiên', 'localStorage'], correct: 1, explain: 'provideHttpClientTesting giữ request lại để bạn kiểm tra và flush dữ liệu giả.' },
  ],
  doneMessage: 'Bạn đã viết được test cho component và service. Code có test là code dám refactor!',
};
