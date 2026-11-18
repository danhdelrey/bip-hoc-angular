import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './di-advanced.samples';

export const PROVIDER_RECIPES = `// 4 "công thức" cho cùng một token
{ provide: Logger, useClass: ConsoleLogger }          // tạo instance từ class
{ provide: API_URL, useValue: 'https://api.bip.vn' }  // giá trị có sẵn
{ provide: Storage, useFactory: () =>                 // tự viết hàm tạo
    inject(PLATFORM_ID) === 'browser' ? new LocalStore() : new MemoryStore() }
{ provide: OldLogger, useExisting: Logger }           // bí danh: dùng chung instance

// Cấu hình cả app theo kiểu "provideX()" như Angular
export function provideAnalytics(id: string): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ANALYTICS_ID, useValue: id }, AnalyticsService]);
}`;

export const DI_ADVANCED: LessonContent = {
  slug: 'di-advanced',
  metaphor:
    'Bài DI cơ bản là "quầy dịch vụ trong toà nhà". Giờ Bíp làm trưởng tổng đài: một số điện thoại (token) có thể nối tới nhiều máy cùng lúc (multi), có số tự trả lời khi không ai nhấc máy (factory), và người gọi có thể dặn "đừng gọi máy của tôi, gọi tầng trên" (skipSelf) hoặc "không ai nghe cũng được" (optional).',
  intro:
    'Ngoài providers cơ bản, DI của Angular còn: InjectionToken có factory mặc định, bốn công thức useClass / useValue / useFactory / useExisting, multi provider để nhiều nơi cùng "góp" vào một mảng (cách Angular làm HTTP interceptor, validator…), và các tuỳ chọn tìm kiếm optional, self, skipSelf, host của inject().',
  visualizer: {
    title: 'Tổng đài DI',
    hint: 'Chế độ "Multi provider": bật/tắt từng plugin thanh toán và công tắc multi. Chế độ "Đường tìm provider": chọn ai provide THEME và tuỳ chọn của inject(), rồi xem quả cầu token leo lên cây injector.',
  },
  code: [
    { name: 'payment.ts', lang: 'typescript', code: SAMPLES['payment.ts'], anchors: { 8: 'factory', 9: 'factory', 13: 'multi', 14: 'multi', 15: 'multi', 16: 'multi', 17: 'multi', 18: 'multi' } },
    { name: 'checkout.ts', lang: 'angular-ts', code: SAMPLES['checkout.ts'], anchors: { 6: 'provide', 11: 'lookup', 12: 'skipSelf', 18: 'provide', 28: 'multi', 29: 'factory', 30: 'optional' } },
    { name: 'recipes.ts', lang: 'typescript', code: PROVIDER_RECIPES, anchors: { 2: 'provide', 3: 'provide', 4: 'factory', 5: 'factory', 6: 'provide', 9: 'provide', 10: 'provide' } },
  ],
  liveNote: 'Checkout thật: 3 phương thức đến từ 3 multi provider, tiền tệ đến từ factory của token, mã giảm giá là optional, và nút Thanh toán đọc THEME của chính nó lẫn của cha (skipSelf).',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { Checkout } from './app/checkout';\n\nbootstrapApplication(Checkout).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>DI nâng cao</title></head>\n<body><app-checkout></app-checkout></body>\n</html>\n`,
  },
  challenges: [
    { id: 'di-multi', title: 'Cho trang thanh toán hiện đủ 3 phương thức từ 3 provider khác nhau.', hint: 'Không có multi: true thì provider sau ghi đè provider trước.', praise: 'Đúng rồi! multi biến một token thành "hộp góp" nhiều giá trị.' },
    { id: 'di-skipself', title: 'Cho PayButton dùng THEME của Checkout dù chính PayButton cũng provide THEME.', hint: 'Tuỳ chọn nào bảo Angular bắt đầu tìm từ cha?', praise: 'Chuẩn! skipSelf bỏ qua chính mình, tìm từ tầng trên.' },
    { id: 'di-optional', title: 'Không ai provide THEME, nhưng inject vẫn không gây NullInjectorError.', hint: 'Tắt hết provider của THEME, rồi bật một tuỳ chọn cho phép kết quả là null.', praise: 'Hay! optional: true trả về null thay vì làm sập component.' },
  ],
  pitfalls: [
    {
      title: 'Quên multi: true',
      explain: 'Không có multi thì provider sau GHI ĐÈ provider trước, bạn chỉ nhận được giá trị cuối cùng và không có lỗi nào báo.',
      wrong: { lang: 'typescript', code: `{ provide: PAYMENT_METHODS, useValue: card },\n{ provide: PAYMENT_METHODS, useValue: wallet } // card biến mất!` },
      right: { lang: 'typescript', code: `{ provide: PAYMENT_METHODS, multi: true, useValue: card },\n{ provide: PAYMENT_METHODS, multi: true, useValue: wallet }` },
    },
    {
      title: 'useClass khi muốn dùng chung instance',
      explain: 'useClass tạo instance MỚI cho token đó. Muốn hai token cùng trỏ vào một instance thì dùng useExisting.',
      wrong: { lang: 'typescript', code: `{ provide: OldLogger, useClass: Logger } // 2 instance khác nhau` },
      right: { lang: 'typescript', code: `{ provide: OldLogger, useExisting: Logger } // cùng 1 instance` },
    },
    {
      title: 'Dùng optional để che lỗi cấu hình',
      explain: 'optional hợp với tính năng thật sự tuỳ chọn. Với dependency bắt buộc, để NullInjectorError báo sớm còn hơn nhận null rồi lỗi khó hiểu về sau.',
      wrong: { lang: 'typescript', code: `private api = inject(ApiClient, { optional: true })!; // null lúc runtime` },
      right: { lang: 'typescript', code: `private api = inject(ApiClient); // thiếu provider → lỗi rõ ràng ngay` },
    },
  ],
  quiz: [
    { question: 'Ba provider cùng token với multi: true. inject(token) trả về gì?', options: ['Giá trị cuối cùng', 'Mảng 3 giá trị theo thứ tự đăng ký', 'Lỗi trùng provider', 'Giá trị đầu tiên'], correct: 1, explain: 'multi gom mọi giá trị vào một mảng, đúng thứ tự đăng ký.' },
    { question: 'PayButton provide THEME và gọi inject(THEME, { skipSelf: true }). Angular bắt đầu tìm ở đâu?', options: ['Chính PayButton', 'Injector cha của PayButton', 'Luôn ở Root', 'NullInjector'], correct: 1, explain: 'skipSelf bỏ qua injector của chính nó.' },
    { question: 'Hai token cần trỏ tới CÙNG một instance service. Công thức nào?', options: ['useClass', 'useValue: new X()', 'useExisting', 'multi: true'], correct: 2, explain: 'useExisting tạo bí danh tới provider đã có.' },
  ],
  doneMessage: 'Bạn đã làm chủ tổng đài DI: multi, factory, skipSelf, optional đều trong tay!',
};
