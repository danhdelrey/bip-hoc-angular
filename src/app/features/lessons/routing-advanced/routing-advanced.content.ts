import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './routing-advanced.samples';

export const ROUTER_EXTRAS = `// app.config.ts — bật để params, query params và dữ liệu resolve đổ thẳng vào input()
provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules));

// Đọc params bằng ActivatedRoute (khi không dùng input binding)
const id = toSignal(inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('id'))));

// Điều hướng bằng code
router.navigate(['/sp', 3], { queryParams: { tab: 'danh-gia' } }); // tuyệt đối
router.navigate(['..'], { relativeTo: route });                    // tương đối với route hiện tại
router.navigateByUrl('/dang-nhap?quay-lai=/gio-hang');

// Theo dõi vòng đời điều hướng
router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => track());`;

export const ROUTING_ADVANCED: LessonContent = {
  slug: 'routing-advanced',
  definition:
    'Routing nâng cao gồm các kỹ thuật điều khiển một lần điều hướng: đọc tham số từ URL, điều hướng bằng code, route lồng nhau, tải dữ liệu trước khi hiện trang (resolver) và chặn rời trang (canDeactivate).',
  analogy: {
    text: 'Ví dụ vẽ mỗi lần điều hướng như một chuyến tàu đi qua dãy trạm kiểm soát trước khi vào ga.',
    map: [
      ['Đọc vé, tìm đường ray', 'Recognize: so URL với Routes, tách :id và ?query'],
      ['Trạm soát vé', 'Guard: canDeactivate (trang cũ), canActivate (trang mới)'],
      ['Trạm bốc hàng', 'Resolver: tải dữ liệu xong mới cho tàu chạy tiếp'],
      ['Vào ga', 'Activate: render component vào <router-outlet>'],
      ['Ga trong ga', 'route con + outlet lồng nhau'],
      ['Tàu quay đầu', 'NavigationCancel'],
    ],
  },
  intro:
    'Mỗi lần điều hướng, Router chạy theo thứ tự: NavigationStart → khớp URL với cấu hình và tách params → chạy guard (canDeactivate của trang đang rời, canActivate của trang tới) → chạy resolver → kích hoạt component vào các outlet → NavigationEnd. Guard trả false (hoặc Promise false) thì điều hướng bị huỷ. Với withComponentInputBinding, :id, ?query và dữ liệu resolve được gán thẳng vào input() của component. Route có children cần một <router-outlet> riêng trong component cha để hiện route con.',
  visualizer: {
    title: 'Dãy trạm của một lần điều hướng',
    hint: 'Chọn một tình huống và bật/tắt resolver, canDeactivate. Step-player đi qua từng giai đoạn: URL được tách thành params, guard quyết định cho qua hay huỷ, resolver tải dữ liệu, rồi component hiện ra trong các outlet lồng nhau.',
  },
  code: [
    { name: 'catalog.routes.ts', lang: 'typescript', code: SAMPLES['catalog.routes.ts'], anchors: { 10: 'recognize', 12: 'resolve', 13: 'guard', 16: 'recognize', 18: 'resolve', 19: 'nested', 20: 'nested', 21: 'nested', 22: 'nested' } },
    { name: 'route-fns.ts', lang: 'typescript', code: SAMPLES['route-fns.ts'], anchors: { 6: 'resolve', 7: 'resolve', 11: 'guard', 13: 'guard' } },
    { name: 'product-detail.ts', lang: 'angular-ts', code: SAMPLES['product-detail.ts'], anchors: { 11: 'nested', 12: 'nested', 15: 'activate', 19: 'params', 20: 'resolve', 26: 'nested', 34: 'nested' } },
    { name: 'product-edit.ts', lang: 'angular-ts', code: SAMPLES['product-edit.ts'], anchors: { 34: 'navigate', 37: 'guard', 38: 'guard', 39: 'guard', 40: 'guard', 45: 'guard' } },
    { name: 'catalog-list.ts', lang: 'angular-ts', code: SAMPLES['catalog-list.ts'], anchors: { 11: 'params', 12: 'params', 16: 'params', 22: 'params' } },
    { name: 'router-api.ts', lang: 'typescript', code: ROUTER_EXTRAS, anchors: { 2: 'params', 5: 'params', 8: 'navigate', 9: 'navigate', 10: 'navigate', 13: 'activate' } },
  ],
  liveNote: 'Router thật với route con: URL trên thanh địa chỉ đổi theo. Mở một sản phẩm (resolver chờ 0,5 giây), chuyển tab Mô tả / Đánh giá (outlet lồng nhau), vào Sửa, gõ vài chữ rồi bấm "Huỷ" để gặp canDeactivate.',
  challenges: [
    { id: 'ra-param', title: 'Điều hướng tới sản phẩm 3 kèm ?tab=danh-gia và xem tham số được tách ra.', hint: 'Chọn tình huống mở sản phẩm từ danh sách.', praise: 'Đúng! :id và ?tab đều được đổ thẳng vào input() của component.' },
    { id: 'ra-guard', title: 'Chặn được việc rời trang Sửa khi còn thay đổi chưa lưu.', hint: 'Bật canDeactivate rồi chọn tình huống rời trang Sửa.', praise: 'Chuẩn! Guard trả false nên điều hướng bị huỷ (NavigationCancel), dữ liệu không mất.' },
    { id: 'ra-resolve', title: 'Mở trang chi tiết mà không có khoảnh khắc "trang trống chờ dữ liệu".', hint: 'Cho dữ liệu được tải trước khi component được tạo.', praise: 'Hay! Resolver chạy trước Activate nên component nhận dữ liệu ngay từ đầu.' },
  ],
  pitfalls: [
    {
      title: 'Đọc params một lần trong constructor',
      explain: 'Đi từ /sp/1 sang /sp/2 Router tái sử dụng cùng component, constructor không chạy lại. Dùng input() (withComponentInputBinding) hoặc paramMap dạng Observable.',
      wrong: { lang: 'typescript', code: `id = inject(ActivatedRoute).snapshot.paramMap.get('id'); // kẹt ở id cũ` },
      right: { lang: 'typescript', code: `id = input.required<string>(); // tự cập nhật khi URL đổi` },
    },
    {
      title: 'Quên <router-outlet> cho route con',
      explain: 'Route có children chỉ hiện route con khi component cha có một <router-outlet> của riêng nó.',
      wrong: { lang: 'angular-html', code: `<h3>{{ product().name }}</h3>\n<a routerLink="danh-gia">Đánh giá</a>\n<!-- không có outlet → bấm link không thấy gì -->` },
      right: { lang: 'angular-html', code: `<h3>{{ product().name }}</h3>\n<a routerLink="danh-gia">Đánh giá</a>\n<router-outlet />` },
    },
    {
      title: 'Resolver chậm mà không có phản hồi',
      explain: 'Trong lúc resolver chạy, trang cũ vẫn hiện và người dùng tưởng bấm không ăn. Hiện chỉ báo tải khi có NavigationStart, hoặc với dữ liệu không bắt buộc thì tải trong component kèm skeleton.',
      wrong: { lang: 'typescript', code: `resolve: { report: slowReportResolver } // 3 giây im lặng` },
      right: { lang: 'typescript', code: `loading = toSignal(router.events.pipe(\n  filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd),\n  map((e) => e instanceof NavigationStart),\n));` },
    },
  ],
  quiz: [
    { question: 'Thứ tự đúng của một lần điều hướng?', options: ['Resolve → Guard → Recognize → Activate', 'Recognize → Guard → Resolve → Activate', 'Activate → Resolve → Guard', 'Guard → Activate → Resolve'], correct: 1, explain: 'Khớp URL trước, rồi guard, resolver, cuối cùng mới tạo component.' },
    { question: 'canDeactivate trả về false thì sao?', options: ['Trang mới vẫn hiện nhưng có cảnh báo', 'Điều hướng bị huỷ, người dùng ở lại trang hiện tại', 'Router tải lại trang', 'Lỗi NullInjectorError'], correct: 1, explain: 'Router phát NavigationCancel và giữ nguyên URL, component hiện tại.' },
    { question: 'Từ component trang Sửa (route sp/:id/sua) muốn quay về chi tiết sản phẩm bằng code?', options: ['location.href = …', "router.navigate(['..'], { relativeTo: route })", 'window.history.back() là cách duy nhất', 'Không làm được'], correct: 1, explain: 'navigate nhận mảng lệnh, có thể tương đối với ActivatedRoute hiện tại.' },
  ],
  doneMessage: 'Bạn đã điều khiển được từng trạm của Router: params, guard, resolver, route lồng nhau!',
};
