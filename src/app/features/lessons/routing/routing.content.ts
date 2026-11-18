import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './routing.samples';

export const ROUTING: LessonContent = {
  slug: 'routing',
  metaphor:
    'Router là một nhà ga tàu hoả: URL là tấm vé, bảng route là bảng giờ tàu, <router-outlet> là sân ga nơi toa component chạy vào. Guard là nhân viên soát vé, còn lazy loading là toa hàng chỉ được kéo tới khi có người cần!',
  intro:
    'Router đọc URL, so với bảng route từ trên xuống dưới, chạy guard nếu có, tải code nếu route lazy, rồi đặt component vào <router-outlet>. Tham số như :id được truyền vào component qua input() nhờ withComponentInputBinding().',
  visualizer: {
    title: 'Nhà ga Router',
    hint: 'Chọn một tấm vé (URL) rồi bấm "Khởi hành". Xem router dò bảng giờ tàu, gặp nhân viên soát vé, kéo toa hàng lazy và cập bến sân ga.',
  },
  code: [
    { name: 'shop.routes.ts', lang: 'angular-ts', code: SAMPLES['shop.routes.ts'], anchors: { 6: 'r-home', 7: 'r-product', 8: 'r-admin', 9: 'r-lazy', 10: 'r-wild' } },
    { name: 'auth.guard.ts', lang: 'angular-ts', code: SAMPLES['auth.guard.ts'], anchors: { 5: 'guard', 6: 'guard', 7: 'guard', 8: 'guard', 9: 'guard', 10: 'guard', 11: 'guard' } },
    { name: 'shop-shell.ts', lang: 'angular-ts', code: SAMPLES['shop-shell.ts'], anchors: { 20: 'outlet' } },
    { name: 'stops.ts', lang: 'angular-ts', code: SAMPLES['stops.ts'], anchors: { 6: 'r-product', 7: 'r-product', 8: 'r-product' } },
    { name: 'report-stop.ts', lang: 'angular-ts', code: SAMPLES['report-stop.ts'], anchors: { 3: 'r-lazy', 4: 'r-lazy', 5: 'r-lazy' } },
    { name: 'auth.ts', lang: 'angular-ts', code: SAMPLES['auth.ts'] },
  ],
  liveNote: 'Đây là router THẬT của chính trang này: bấm link và để ý URL trên thanh địa chỉ. Vào Báo cáo lần đầu, trình duyệt mới tải file JS của nó.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ShopShell } from './app/shop-shell';
import { SHOP_ROUTES } from './app/shop.routes';

bootstrapApplication(ShopShell, {
  providers: [provideRouter(SHOP_ROUTES, withComponentInputBinding())],
}).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Routing</title><base href="/"></head>\n<body><app-shop-shell></app-shop-shell></body>\n</html>\n`,
  },
  challenges: [
    { id: 'rt-blocked', title: 'Mua vé đi /admin khi CHƯA đăng nhập: bị nhân viên soát vé chặn lại.', hint: 'Chọn vé /admin, kiểm tra công tắc Đăng nhập đang tắt, rồi Khởi hành.', praise: 'Đúng! canActivate trả false thì tàu không được vào sân ga.' },
    { id: 'rt-pass', title: 'Đăng nhập rồi đi lại /admin: lần này được qua cửa.', hint: 'Bật công tắc Đăng nhập trong visualizer rồi khởi hành vé /admin.', praise: 'Tuyệt! Guard đọc state đăng nhập mỗi lần điều hướng.' },
    { id: 'rt-lazy', title: 'Đi /bao-cao HAI lần: lần đầu kéo toa hàng, lần sau dùng lại.', hint: 'Khởi hành vé /bao-cao, rồi chọn vé khác, rồi quay lại /bao-cao.', praise: 'Chuẩn! Chunk lazy chỉ tải một lần, sau đó đã nằm sẵn trong bộ nhớ.' },
  ],
  pitfalls: [
    {
      title: 'Đặt route ** lên đầu bảng',
      explain: 'Router dò từ trên xuống và dừng ở route khớp đầu tiên. ** khớp mọi thứ nên phải nằm CUỐI CÙNG.',
      wrong: { lang: 'typescript', code: `[\n  { path: '**', component: LostStop },\n  { path: 'admin', component: AdminStop },\n]` },
      right: { lang: 'typescript', code: `[\n  { path: 'admin', component: AdminStop },\n  { path: '**', component: LostStop },\n]` },
    },
    {
      title: 'Dùng <a href> thay vì routerLink',
      explain: 'href làm trình duyệt tải lại cả trang, mất hết state. routerLink chỉ đổi component trong outlet.',
      wrong: { lang: 'angular-html', code: `<a href="/admin">Admin</a>` },
      right: { lang: 'angular-html', code: `<a routerLink="/admin">Admin</a>` },
    },
    {
      title: 'Import trực tiếp component của route lazy ở nơi khác',
      explain: 'Chỉ cần một import tĩnh ở đâu đó, bundler sẽ gộp component vào bundle chính và lazy loading mất tác dụng.',
      wrong: { lang: 'typescript', code: `import { ReportStop } from './report-stop'; // import tĩnh\n{ path: 'bao-cao', loadComponent: () => import('./report-stop').then((m) => m.ReportStop) }` },
      right: { lang: 'typescript', code: `// Chỉ tham chiếu qua import() động\n{ path: 'bao-cao', loadComponent: () => import('./report-stop').then((m) => m.ReportStop) }` },
    },
  ],
  quiz: [
    { question: 'URL /san-pham/42 khớp route nào và id bằng gì?', options: ["'' với id rỗng", "'san-pham/:id' với id = '42'", "'**' với id = 42", 'Không route nào'], correct: 1, explain: ':id là tham số động; với withComponentInputBinding, component nhận id qua input().' },
    { question: 'canActivate guard trả về false. Điều gì xảy ra?', options: ['Vẫn vào nhưng có cảnh báo', 'Điều hướng bị huỷ, giữ trang hiện tại', 'App bị reload', 'Router chọn route kế tiếp'], correct: 1, explain: 'Guard false huỷ điều hướng. Muốn chuyển hướng (ví dụ về /login) thì trả về một UrlTree.' },
    { question: 'Lợi ích chính của loadComponent (lazy loading)?', options: ['Code chạy nhanh hơn khi đã tải', 'Bundle ban đầu nhỏ hơn, trang đầu mở nhanh hơn', 'Không cần router-outlet', 'Bảo mật hơn'], correct: 1, explain: 'Code của route chỉ được tải khi người dùng thật sự vào route đó.' },
  ],
  doneMessage: 'Tàu đã cập bến an toàn! Bạn là trưởng ga Router rồi.',
};
