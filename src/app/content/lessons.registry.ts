import type { LessonMeta } from './lesson.model';

/**
 * Lộ trình 15 bài — sidebar, trang chủ và router đều đọc từ đây.
 * Thêm bài mới: thêm một dòng ở đây + một route trong app.routes.ts.
 */
export const LESSONS: readonly LessonMeta[] = [
  { slug: 'component', number: 1, title: 'Component', tagline: 'Khối xây dựng giao diện', icon: 'house', available: true },
  { slug: 'data-binding', number: 2, title: 'Data binding', tagline: 'Đồng bộ Class ↔ DOM', icon: 'pipe', available: true },
  { slug: 'input-output', number: 3, title: 'Input / Output / model()', tagline: 'Giao tiếp cha – con', icon: 'family', available: true },
  { slug: 'lifecycle', number: 4, title: 'Lifecycle hooks', tagline: 'Thứ tự các hook', icon: 'cycle', available: true },
  { slug: 'control-flow', number: 5, title: 'Control flow & Directive', tagline: 'Điều kiện, vòng lặp và directive', icon: 'branch', available: true },
  { slug: 'pipes', number: 6, title: 'Pipe', tagline: 'Biến đổi giá trị trong template', icon: 'factory', available: true },
  { slug: 'dependency-injection', number: 7, title: 'Dependency Injection', tagline: 'Cung cấp và tìm dependency', icon: 'building', available: true },
  { slug: 'signals', number: 8, title: 'Signals', tagline: 'State phản ứng', icon: 'bulb', available: true },
  { slug: 'rxjs', number: 9, title: 'RxJS cơ bản', tagline: 'Luồng sự kiện theo thời gian', icon: 'marble', available: true },
  { slug: 'change-detection', number: 10, title: 'Change detection', tagline: 'Đồng bộ state lên giao diện', icon: 'magnifier', available: true },
  { slug: 'routing', number: 11, title: 'Routing', tagline: 'Điều hướng theo URL', icon: 'train', available: true },
  { slug: 'forms', number: 12, title: 'Forms', tagline: 'Trạng thái và kiểm tra dữ liệu nhập', icon: 'form', available: true },
  { slug: 'http', number: 13, title: 'HTTP & Interceptors', tagline: 'Gọi API và interceptor', icon: 'envelope', available: true },
  { slug: 'defer', number: 14, title: '@defer', tagline: 'Tải trễ một phần template', icon: 'gift', available: true },
  { slug: 'tailwind', number: 15, title: 'Tailwind CSS', tagline: 'CSS utility-first', icon: 'palette', available: true },

  // ---------- Đảo phụ nâng cao (mỗi đảo chính có một đảo phụ nối bằng cầu) ----------
  { slug: 'content-projection', number: 16, title: 'Content projection', tagline: 'Nhận nội dung từ component cha', icon: 'form', available: true, tier: 'advanced', island: 'Nền Móng+' },
  { slug: 'dynamic-components', number: 17, title: 'Component động', tagline: 'Tạo component lúc chạy', icon: 'house', available: true, tier: 'advanced', island: 'Nền Móng+' },
  { slug: 'accessibility', number: 18, title: 'Accessibility & Angular Aria', tagline: 'Dùng được với mọi người', icon: 'star', available: true, tier: 'advanced', island: 'Template+' },
  { slug: 'di-advanced', number: 19, title: 'DI nâng cao', tagline: 'Token, multi provider, tuỳ chọn tìm kiếm', icon: 'di', available: true, tier: 'advanced', island: 'Dịch Vụ+' },
  { slug: 'rxjs-subjects', number: 20, title: 'Subject & multicast', tagline: 'Subject, BehaviorSubject, ReplaySubject, share', icon: 'bell', available: true, tier: 'advanced', island: 'Phản Ứng+' },
  { slug: 'rxjs-flattening', number: 21, title: 'RxJS flattening', tagline: 'mergeMap, concatMap, switchMap, exhaustMap', icon: 'marble', available: true, tier: 'advanced', island: 'Phản Ứng+' },
  { slug: 'signal-store', number: 22, title: 'State lớn với SignalStore', tagline: 'Quản lý state theo tính năng', icon: 'building', available: true, tier: 'advanced', island: 'Phản Ứng+' },
  { slug: 'routing-advanced', number: 23, title: 'Routing nâng cao', tagline: 'Params, resolver, canDeactivate, route lồng nhau', icon: 'link', available: true, tier: 'advanced', island: 'Điều Hướng+' },
  { slug: 'reactive-forms', number: 24, title: 'Reactive Forms', tagline: 'FormGroup, FormArray, validator chéo và bất đồng bộ', icon: 'form', available: true, tier: 'advanced', island: 'Biểu Mẫu+' },
  { slug: 'testing', number: 25, title: 'Testing với TestBed', tagline: 'Test component, service và HTTP', icon: 'flask', available: true, tier: 'advanced', island: 'Kiểm Thử+' },
  { slug: 'performance', number: 26, title: 'Hiệu năng render', tagline: 'Đo và tối ưu render', icon: 'magnifier', available: true, tier: 'advanced', island: 'Hiệu Năng+' },
  { slug: 'ssr-hydration', number: 27, title: 'SSR & Hydration', tagline: 'Render ở server, kích hoạt ở trình duyệt', icon: 'bolt', available: true, tier: 'advanced', island: 'Hiệu Năng+' },
];

/**
 * Đường rẽ nhánh sang đảo phụ: rẽ ra ngay sau bài nền tảng mà các bài nâng cao xây trên đó (`after`),
 * và "mở" khi đã học xong các bài tiên quyết (`requires`).
 * Thứ tự trong mảng = thứ tự xuất hiện trên lộ trình.
 */
export interface IslandBranch {
  island: string;
  after: string;
  requires: string[];
  lessons: string[];
}
export const ISLAND_BRANCHES: IslandBranch[] = [
  { island: 'Nền Móng+', after: 'lifecycle', requires: ['component', 'input-output', 'lifecycle'], lessons: ['content-projection', 'dynamic-components'] },
  { island: 'Template+', after: 'control-flow', requires: ['data-binding', 'control-flow'], lessons: ['accessibility'] },
  { island: 'Dịch Vụ+', after: 'dependency-injection', requires: ['dependency-injection'], lessons: ['di-advanced'] },
  { island: 'Phản Ứng+', after: 'rxjs', requires: ['dependency-injection', 'signals', 'rxjs'], lessons: ['rxjs-subjects', 'rxjs-flattening', 'signal-store'] },
  { island: 'Điều Hướng+', after: 'routing', requires: ['routing'], lessons: ['routing-advanced'] },
  { island: 'Biểu Mẫu+', after: 'forms', requires: ['forms'], lessons: ['reactive-forms'] },
  { island: 'Kiểm Thử+', after: 'http', requires: ['component', 'dependency-injection', 'http'], lessons: ['testing'] },
  { island: 'Hiệu Năng+', after: 'defer', requires: ['control-flow', 'change-detection', 'http', 'defer'], lessons: ['performance', 'ssr-hydration'] },
];

export const CORE_LESSONS = LESSONS.filter((l) => (l.tier ?? 'core') === 'core');
export const ADVANCED_LESSONS = LESSONS.filter((l) => l.tier === 'advanced');

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);

export const nextLesson = (slug: string) => {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  return LESSONS.slice(idx + 1).find((l) => l.available);
};
