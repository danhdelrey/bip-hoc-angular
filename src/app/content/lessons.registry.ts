import type { LessonMeta } from './lesson.model';

/**
 * Lộ trình 15 bài — sidebar, trang chủ và router đều đọc từ đây.
 * Thêm bài mới: thêm một dòng ở đây + một route trong app.routes.ts.
 */
export const LESSONS: readonly LessonMeta[] = [
  { slug: 'component', number: 1, title: 'Component', tagline: 'Ngôi nhà 3 tầng', icon: 'house', available: true },
  { slug: 'data-binding', number: 2, title: 'Data binding', tagline: 'Ống nối Class ↔ DOM', icon: 'pipe', available: true },
  { slug: 'input-output', number: 3, title: 'Input / Output / model()', tagline: 'Nhà Cha và nhà Con', icon: 'family', available: true },
  { slug: 'lifecycle', number: 4, title: 'Lifecycle hooks', tagline: 'Hành trình một đời', icon: 'cycle', available: true },
  { slug: 'control-flow', number: 5, title: 'Control flow & Directive', tagline: 'Cây DOM mọc và rụng', icon: 'branch', available: true },
  { slug: 'pipes', number: 6, title: 'Pipe', tagline: 'Dây chuyền nhà máy', icon: 'factory', available: true },
  { slug: 'dependency-injection', number: 7, title: 'Dependency Injection', tagline: 'Toà nhà & quầy phát đồ', icon: 'building', available: true },
  { slug: 'signals', number: 8, title: 'Signals', tagline: 'Bóng đèn nối dây', icon: 'bulb', available: true },
  { slug: 'rxjs', number: 9, title: 'RxJS cơ bản', tagline: 'Băng chuyền marble', icon: 'marble', available: true },
  { slug: 'change-detection', number: 10, title: 'Change detection', tagline: 'Thanh tra kính lúp', icon: 'magnifier', available: true },
  { slug: 'routing', number: 11, title: 'Routing', tagline: 'Nhà ga tàu hoả', icon: 'train', available: true },
  { slug: 'forms', number: 12, title: 'Forms', tagline: 'Cây trạng thái biết cười', icon: 'form', available: true },
  { slug: 'http', number: 13, title: 'HTTP & Interceptors', tagline: 'Phong bì có chân', icon: 'envelope', available: true },
  { slug: 'defer', number: 14, title: '@defer', tagline: 'Hộp quà bất ngờ', icon: 'gift', available: true },
  { slug: 'tailwind', number: 15, title: 'Tailwind CSS', tagline: 'Hộp LEGO class', icon: 'palette', available: true },

  // ---------- Đảo phụ nâng cao (mỗi đảo chính có một đảo phụ nối bằng cầu) ----------
  { slug: 'content-projection', number: 16, title: 'Content projection', tagline: 'Khung tranh nhiều ô', icon: 'form', available: true, tier: 'advanced', island: 'Nền Móng+' },
  { slug: 'dynamic-components', number: 17, title: 'Component động', tagline: 'Nhà lắp ghép', icon: 'house', available: true, tier: 'advanced', island: 'Nền Móng+' },
  { slug: 'performance', number: 18, title: 'Hiệu năng render', tagline: 'Bác sĩ hiệu năng', icon: 'magnifier', available: true, tier: 'advanced', island: 'Template+' },
  { slug: 'accessibility', number: 19, title: 'Accessibility & Angular Aria', tagline: 'Ai cũng dùng được', icon: 'star', available: true, tier: 'advanced', island: 'Template+' },
  { slug: 'di-advanced', number: 20, title: 'DI nâng cao', tagline: 'Quầy đặc biệt', icon: 'di', available: true, tier: 'advanced', island: 'Dịch Vụ+' },
  { slug: 'ssr-hydration', number: 21, title: 'SSR & Hydration', tagline: 'Nhà lắp sẵn, cắm điện sau', icon: 'bolt', available: true, tier: 'advanced', island: 'Dịch Vụ+' },
  { slug: 'rxjs-flattening', number: 22, title: 'RxJS flattening', tagline: 'Bốn anh em *Map', icon: 'marble', available: true, tier: 'advanced', island: 'Phản Ứng+' },
  { slug: 'signal-store', number: 23, title: 'State lớn với SignalStore', tagline: 'Kho tổng', icon: 'building', available: true, tier: 'advanced', island: 'Phản Ứng+' },
];

/**
 * Đường rẽ nhánh sang đảo phụ: rẽ ra sau bài cuối cùng của đảo chính (`after`),
 * và "mở" khi đã học xong mọi bài của đảo chính (`requires`).
 */
export interface IslandBranch {
  island: string;
  after: string;
  requires: string[];
  lessons: string[];
}
export const ISLAND_BRANCHES: IslandBranch[] = [
  { island: 'Nền Móng+', after: 'lifecycle', requires: ['component', 'data-binding', 'input-output', 'lifecycle'], lessons: ['content-projection', 'dynamic-components'] },
  { island: 'Phản Ứng+', after: 'forms', requires: ['signals', 'rxjs', 'change-detection', 'forms'], lessons: ['rxjs-flattening', 'signal-store'] },
  { island: 'Dịch Vụ+', after: 'http', requires: ['dependency-injection', 'routing', 'http'], lessons: ['di-advanced', 'ssr-hydration'] },
  { island: 'Template+', after: 'tailwind', requires: ['control-flow', 'pipes', 'defer', 'tailwind'], lessons: ['performance', 'accessibility'] },
];

export const CORE_LESSONS = LESSONS.filter((l) => (l.tier ?? 'core') === 'core');
export const ADVANCED_LESSONS = LESSONS.filter((l) => l.tier === 'advanced');

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);

export const nextLesson = (slug: string) => {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  return LESSONS.slice(idx + 1).find((l) => l.available);
};
