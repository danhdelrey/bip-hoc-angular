import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './ssr-hydration.samples';

export const SSR_CONFIG = `// Tạo project có SSR:  ng new shop --ssr   (hoặc ng add @angular/ssr)
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(
      withEventReplay(),          // ghi lại click trước khi hydrate, phát lại sau
      withIncrementalHydration(), // cho phép @defer (hydrate on ...)
    ),
  ],
};

// product-page.html — phần bình luận chỉ hydrate khi cuộn tới
@defer (hydrate on viewport) {
  <app-reviews [productId]="id()" />
}`;

export const SSR_HYDRATION: LessonContent = {
  slug: 'ssr-hydration',
  metaphor:
    'CSR giống gửi cho khách một thùng đồ nội thất chưa lắp: khách phải chờ tự lắp (tải và chạy JS) mới thấy cái ghế. SSR giao luôn cái ghế đã lắp sẵn (HTML) để khách nhìn ngay, còn hydration là lúc Bíp vặn nốt mấy con ốc để ghế ngả được (gắn sự kiện). Event replay thì nhớ hộ những lần khách bấm thử trong lúc Bíp đang vặn ốc!',
  intro:
    'Với SSR, server chạy Angular để trả về HTML đầy đủ nên người dùng thấy nội dung sớm và máy tìm kiếm đọc được. Trình duyệt sau đó tải JS và hydrate: dùng lại DOM có sẵn, gắn sự kiện thay vì vẽ lại. Event replay giữ các click xảy ra trước khi hydrate. Incremental hydration (@defer hydrate on …) cho phép phần ít quan trọng hydrate sau. Code phải giống nhau ở server và trình duyệt, nên mọi thứ chỉ có ở trình duyệt (window, localStorage) đặt trong afterNextRender.',
  visualizer: {
    title: 'Đường đua tải trang',
    hint: 'Chọn cách render, bật/tắt event replay, chọn nơi đọc localStorage rồi "Tải trang". Đánh dấu "bấm Mua lúc 800ms" để xem cú click sớm đi đâu. Step-player dừng ở từng mốc: HTML về, nội dung hiện, JS tải xong, hydrate.',
  },
  code: [
    { name: 'safe-widget.ts', lang: 'angular-ts', code: SAMPLES['safe-widget.ts'], anchors: { 14: 'platform', 20: 'mismatch', 21: 'mismatch', 22: 'after', 23: 'after', 24: 'after', 25: 'after' } },
    { name: 'app.config.ts', lang: 'angular-ts', code: SSR_CONFIG, anchors: { 1: 'ssr', 9: 'hydrate', 10: 'replay', 11: 'incremental', 17: 'incremental', 18: 'incremental' } },
  ],
  liveNote: 'Trang học này chạy ở trình duyệt (GitHub Pages không có server), nên widget báo "trình duyệt". Trên server, phần trong afterNextRender đơn giản là không chạy.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { SafeWidget } from './app/safe-widget';\n\nbootstrapApplication(SafeWidget).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>SSR</title></head>\n<body><app-safe-widget></app-safe-widget></body>\n</html>\n`,
  },
  challenges: [
    { id: 'ssr-fcp', title: 'Cho người dùng thấy nội dung trang trước mốc 1 giây.', hint: 'Với CSR, trang trắng cho tới khi JS chạy xong.', praise: 'Nội dung hiện ngay! HTML từ server không cần chờ JS.' },
    { id: 'ssr-replay', title: 'Bấm "Mua" lúc 800ms (trước khi hydrate) mà cú click không bị mất.', hint: 'Cần SSR để nút đã hiện, và một tính năng ghi lại sự kiện.', praise: 'Không mất đơn nào! withEventReplay phát lại click sau khi hydrate.' },
    { id: 'ssr-mismatch', title: 'Dùng SSR mà không bị lỗi lệch hydration (NG0500) khi đọc localStorage.', hint: 'Đọc localStorage ở đâu thì server không chạy và trình duyệt chạy sau khi hydrate?', praise: 'Sạch lỗi! afterNextRender là nơi an toàn cho code chỉ-trình-duyệt.' },
  ],
  pitfalls: [
    {
      title: 'Dùng window / localStorage khi render',
      explain: 'Trên server không có window, app sẽ lỗi. Kể cả có kiểm tra, giá trị khác nhau giữa hai bên làm HTML lệch và Angular phải vẽ lại.',
      wrong: { lang: 'typescript', code: `theme = localStorage.getItem('theme') ?? 'light';` },
      right: { lang: 'typescript', code: `theme = signal('light');\nconstructor() {\n  afterNextRender(() => this.theme.set(localStorage.getItem('theme') ?? 'light'));\n}` },
    },
    {
      title: 'Sửa DOM trực tiếp',
      explain: 'Hydration giả định DOM khớp với những gì Angular render. Chèn/xoá node bằng tay (innerHTML, appendChild) phá vỡ điều đó.',
      wrong: { lang: 'typescript', code: `this.el.nativeElement.innerHTML = '<b>Giảm giá!</b>';` },
      right: { lang: 'angular-html', code: `@if (onSale()) { <b>Giảm giá!</b> }` },
    },
    {
      title: 'Gọi API hai lần (server rồi trình duyệt)',
      explain: 'HttpClient có transfer cache: kết quả gọi ở server được gửi kèm HTML và dùng lại ở trình duyệt. Tự fetch thủ công thì mất lợi ích này.',
      wrong: { lang: 'typescript', code: `ngOnInit() { fetch('/api/products').then(…) } // chạy cả 2 nơi` },
      right: { lang: 'typescript', code: `products = httpResource<Product[]>(() => '/api/products');\n// provideClientHydration() tự dùng lại dữ liệu từ server` },
    },
  ],
  quiz: [
    { question: 'Hydration làm gì?', options: ['Vẽ lại toàn bộ trang từ đầu', 'Dùng lại DOM từ server và gắn sự kiện, state', 'Nén HTML', 'Tải ảnh lười'], correct: 1, explain: 'Hydration không tạo lại DOM; nó "kích hoạt" DOM có sẵn.' },
    { question: 'Người dùng bấm nút trước khi hydrate. Tính năng nào giữ lại cú click?', options: ['withEventReplay()', 'withFetch()', 'OnPush', 'TransferState'], correct: 0, explain: 'Event replay ghi lại sự kiện rồi phát lại khi component đã hydrate.' },
    { question: 'Code nào nên đặt trong afterNextRender?', options: ['Khai báo signal', 'Đọc localStorage, đo kích thước DOM', 'Gọi inject()', 'Khai báo input()'], correct: 1, explain: 'Nó chỉ chạy ở trình duyệt, sau khi render/hydrate.' },
  ],
  doneMessage: 'Trang của bạn hiện nhanh như chớp và không bỏ sót cú click nào!',
};
