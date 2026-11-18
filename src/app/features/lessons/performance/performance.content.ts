import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './performance.samples';

export const PERF_TOOLKIT = `// 1. track ổn định — giữ lại DOM cũ
@for (p of products(); track p.id) { … }

// 2. computed thay cho hàm gọi trong template
visible = computed(() => this.products().filter(…));

// 3. Danh sách dài: chỉ render phần đang nhìn thấy
<cdk-virtual-scroll-viewport itemSize="48"> … </cdk-virtual-scroll-viewport>

// 4. Tách phần nặng khỏi bundle đầu
@defer (on viewport) { <app-sales-chart /> }

// 5. Ảnh: lazy, đúng kích thước, ưu tiên ảnh LCP
<img ngSrc="hero.jpg" width="800" height="400" priority />`;

export const PERFORMANCE: LessonContent = {
  slug: 'performance',
  definition:
    'Hiệu năng render là thời gian từ khi state thay đổi tới khi khung hình mới được vẽ; muốn đạt 60fps, mỗi khung hình cần dưới khoảng 16ms.',
  analogy: {
    text: 'Ví dụ xem màn hình chậm như một bệnh nhân, còn các kỹ thuật tối ưu là thuốc.',
    map: [
      ['Đo nhịp tim', 'đo ms mỗi khung hình (Profiler)'],
      ['Chỗ tắc', 'điểm nghẽn hiệu năng'],
      ['Thuốc', 'computed, track, OnPush, virtual scroll, @defer, NgOptimizedImage'],
    ],
  },
  intro:
    'Một khung hình mượt cần dưới ~16ms (60fps). Thời gian thường mất vào: tính toán lặp trong template, change detection kiểm tra thừa, tạo lại DOM không cần thiết và tải JS/ảnh quá nặng. Angular có công cụ cho từng nguyên nhân: computed, track, OnPush + signals, virtual scroll, @defer và NgOptimizedImage.',
  visualizer: {
    title: 'Phòng khám hiệu năng',
    hint: 'Chọn một thao tác để "đo". Bật/tắt từng loại thuốc và xem biểu đồ khung hình, số node DOM tạo mới và dung lượng tải thay đổi. Step-player mổ xẻ từng giai đoạn của một khung hình.',
  },
  code: [
    { name: 'fast-list.ts', lang: 'angular-ts', code: SAMPLES['fast-list.ts'], anchors: { 15: 'track', 26: 'computed', 27: 'computed', 33: 'measure' } },
    { name: 'toolkit.ts', lang: 'angular-ts', code: PERF_TOOLKIT, anchors: { 2: 'track', 3: 'track', 5: 'computed', 6: 'computed', 8: 'virtual', 9: 'virtual', 11: 'defer', 12: 'defer', 14: 'image', 15: 'image' } },
  ],
  liveNote: 'Danh sách 5.000 sản phẩm thật: computed + track p.id. Con số "cập nhật mất … ms" được đo thật từ lúc gõ tới khi Angular vẽ xong (afterNextRender).',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { FastList } from './app/fast-list';\n\nbootstrapApplication(FastList).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Hiệu năng</title></head>\n<body><app-fast-list></app-fast-list></body>\n</html>\n`,
  },
  challenges: [
    { id: 'pf-60', title: 'Chữa cho thao tác "Gõ vào ô lọc" đạt dưới 16ms/khung hình (60fps).', hint: 'Bật dần các thuốc computed, OnPush + signals và virtual scroll rồi đo lại.', praise: 'Mượt như bơ! Mỗi loại thuốc cắt đúng một phần thời gian.' },
    { id: 'pf-dom', title: 'Làm cho "Tải lại danh sách từ API" gần như không tạo mới node DOM nào.', hint: 'Dữ liệu tải lại là object mới. Track theo thứ gì thì giữ được DOM cũ?', praise: 'Chuẩn! track p.id giữ lại DOM dù object đã đổi.' },
    { id: 'pf-initial', title: 'Giảm lần tải trang đầu xuống dưới 400 KB.', hint: 'Phần biểu đồ nặng có thể @defer, ảnh có thể dùng NgOptimizedImage.', praise: 'Trang mở nhanh hẳn! Đừng bắt người dùng tải thứ họ chưa cần.' },
  ],
  pitfalls: [
    {
      title: 'Gọi hàm tính toán trong template',
      explain: 'Hàm trong template chạy lại MỖI lần component được kiểm tra, kể cả khi dữ liệu không đổi. computed chỉ tính lại khi phụ thuộc đổi.',
      wrong: { lang: 'angular-html', code: `@for (p of filterProducts(); track p.id) { … }` },
      right: { lang: 'typescript', code: `visible = computed(() => this.filterProducts());\n// template: @for (p of visible(); track p.id)` },
    },
    {
      title: 'Render hàng nghìn dòng cùng lúc',
      explain: 'Trình duyệt phải dựng và layout mọi node, kể cả những dòng người dùng chưa cuộn tới. Dùng phân trang hoặc CDK virtual scroll.',
      wrong: { lang: 'angular-html', code: `@for (row of tenThousandRows(); track row.id) {\n  <app-row [row]="row" />\n}` },
      right: { lang: 'angular-html', code: `<cdk-virtual-scroll-viewport itemSize="48" class="h-96">\n  <app-row *cdkVirtualFor="let row of tenThousandRows()" [row]="row" />\n</cdk-virtual-scroll-viewport>` },
    },
    {
      title: 'Tối ưu khi chưa đo',
      explain: 'Đoán sai chỗ chậm thì sửa cũng vô ích. Đo bằng Angular DevTools (Profiler) hoặc tab Performance của Chrome trước khi sửa.',
      wrong: { lang: 'typescript', code: `// "Chắc do RxJS" → viết lại cả module trong 2 ngày` },
      right: { lang: 'typescript', code: `// Angular DevTools → Profiler → ghi lại thao tác chậm\n// → thấy ProductList bị kiểm tra 400 lần → sửa đúng chỗ đó` },
    },
  ],
  quiz: [
    { question: 'Muốn đạt 60fps, mỗi khung hình nên tốn khoảng bao nhiêu?', options: ['~16ms', '~100ms', '~1 giây', 'Không quan trọng'], correct: 0, explain: '1000ms / 60 khung ≈ 16,7ms cho cả JS, layout và paint.' },
    { question: 'Danh sách 10.000 dòng làm trang giật khi cuộn. Cách xử lý phù hợp nhất?', options: ['Thêm setTimeout', 'Virtual scroll hoặc phân trang', 'Tăng font-size', 'Dùng thêm effect'], correct: 1, explain: 'Chỉ render phần đang nhìn thấy giúp số node DOM luôn nhỏ.' },
    { question: 'Công cụ nào cho biết component nào bị change detection kiểm tra nhiều nhất?', options: ['Angular DevTools Profiler', 'console.log khắp nơi', 'npm audit', 'Lighthouse SEO'], correct: 0, explain: 'Profiler của Angular DevTools ghi lại từng chu kỳ change detection và thời gian mỗi component.' },
  ],
  doneMessage: 'Bệnh nhân đã khoẻ mạnh, chạy 60fps! Bạn là bác sĩ hiệu năng rồi.',
};
