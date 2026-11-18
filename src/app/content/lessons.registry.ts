import type { LessonMeta } from './lesson.model';

/**
 * Lộ trình 14 bài — sidebar, trang chủ và router đều đọc từ đây.
 * Thêm bài mới: thêm một dòng ở đây + một route trong app.routes.ts.
 */
export const LESSONS: readonly LessonMeta[] = [
  { slug: 'component', number: 1, title: 'Component', tagline: 'Ngôi nhà 3 tầng', icon: 'house', available: false },
  { slug: 'data-binding', number: 2, title: 'Data binding', tagline: 'Ống nối Class ↔ DOM', icon: 'pipe', available: true },
  { slug: 'input-output', number: 3, title: 'Input / Output / model()', tagline: 'Nhà Cha và nhà Con', icon: 'family', available: false },
  { slug: 'lifecycle', number: 4, title: 'Lifecycle hooks', tagline: 'Hành trình một đời', icon: 'cycle', available: false },
  { slug: 'control-flow', number: 5, title: 'Control flow & Directive', tagline: 'Cây DOM mọc và rụng', icon: 'branch', available: false },
  { slug: 'pipes', number: 6, title: 'Pipe', tagline: 'Dây chuyền nhà máy', icon: 'factory', available: false },
  { slug: 'dependency-injection', number: 7, title: 'Dependency Injection', tagline: 'Toà nhà & quầy phát đồ', icon: 'building', available: true },
  { slug: 'signals', number: 8, title: 'Signals', tagline: 'Bóng đèn nối dây', icon: 'bulb', available: true },
  { slug: 'rxjs', number: 9, title: 'RxJS cơ bản', tagline: 'Băng chuyền marble', icon: 'marble', available: false },
  { slug: 'change-detection', number: 10, title: 'Change detection', tagline: 'Thanh tra kính lúp', icon: 'magnifier', available: false },
  { slug: 'routing', number: 11, title: 'Routing', tagline: 'Nhà ga tàu hoả', icon: 'train', available: false },
  { slug: 'forms', number: 12, title: 'Forms', tagline: 'Cây trạng thái biết cười', icon: 'form', available: false },
  { slug: 'http', number: 13, title: 'HTTP & Interceptors', tagline: 'Phong bì có chân', icon: 'envelope', available: false },
  { slug: 'defer', number: 14, title: '@defer', tagline: 'Hộp quà bất ngờ', icon: 'gift', available: false },
];

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);

export const nextLesson = (slug: string) => {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  return LESSONS.slice(idx + 1).find((l) => l.available);
};
