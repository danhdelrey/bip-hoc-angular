import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './signal-store.samples';

export const STORE_EXTRAS = `// Store dùng chung cả app
export const UserStore = signalStore({ providedIn: 'root' }, withState(initialUser), …);

// Gọi API bằng rxMethod: nhận signal/observable/giá trị, tự huỷ khi store bị huỷ
loadProducts: rxMethod<string>(pipe(
  debounceTime(300),
  switchMap((q) => api.search(q).pipe(tapResponse({
    next: (items) => patchState(store, setAllEntities(items)),
    error: () => patchState(store, { error: 'Không tải được' }),
  }))),
)),

// Tách phần dùng lại thành "feature" riêng
export function withLoading() {
  return signalStoreFeature(withState({ loading: false }), withMethods((s) => ({
    setLoading: (loading: boolean) => patchState(s, { loading }),
  })));
}`;

export const SIGNAL_STORE: LessonContent = {
  slug: 'signal-store',
  definition:
    'NgRx SignalStore là thư viện quản lý state dựa trên signals, gom state, computed và methods của một tính năng vào một store.',
  analogy: {
    text: 'Ví dụ vẽ store như một nhà kho có sổ sách.',
    map: [
      ['Kệ hàng', 'state (withState, withEntities)'],
      ['Bảng tính tự động', 'withComputed'],
      ['Quầy thủ tục', 'withMethods + patchState'],
      ['Không tự thò tay vào kệ', 'state được bảo vệ, bất biến'],
    ],
  },
  intro:
    'NgRx SignalStore (@ngrx/signals) gom state, computed và methods của một tính năng vào một store dựng từ các mảnh: withState, withEntities, withComputed, withMethods, withHooks. Mọi thay đổi đi qua patchState với dữ liệu bất biến, mỗi phần state là một signal riêng nên component chỉ vẽ lại khi đúng phần nó đọc thay đổi.',
  visualizer: {
    title: 'Nhà kho SignalStore',
    hint: 'Bấm các nút hành động ở hàng trên. Step-player cho thấy đường đi: method → patchState → computed nào tính lại → component nào vẽ lại (số đếm render tăng). Thử đổi cách cài đặt add() và cách cập nhật để thấy lỗi.',
  },
  code: [
    { name: 'cart.store.ts', lang: 'typescript', code: SAMPLES['cart.store.ts'], anchors: { 13: 'entities', 14: 'state', 15: 'computed', 16: 'computed', 17: 'computed', 19: 'methods', 20: 'methods', 21: 'upsert', 22: 'patch', 24: 'upsert', 25: 'upsert', 26: 'upsert', 33: 'patch', 37: 'hooks', 38: 'hooks' } },
    { name: 'cart-view.ts', lang: 'angular-ts', code: SAMPLES['cart-view.ts'], anchors: { 11: 'provide', 14: 'methods', 17: 'read', 23: 'methods', 24: 'read', 28: 'provide' } },
    { name: 'nang-cao.ts', lang: 'typescript', code: STORE_EXTRAS, anchors: { 2: 'provide', 5: 'rx', 6: 'rx', 7: 'rx', 8: 'rx', 15: 'feature', 16: 'feature' } },
  ],
  liveNote: 'Store thật từ @ngrx/signals. Bấm thêm cùng một món hai lần để thấy số lượng tăng, nhập BIP10 rồi Enter để giảm 10%.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { CartView } from './app/cart-view';\n\nbootstrapApplication(CartView).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>SignalStore</title></head>\n<body><app-cart-view></app-cart-view></body>\n</html>\n`,
  },
  challenges: [
    { id: 'ss-entity', title: 'Thêm "Áo mưa" lần nữa và làm cho số lượng thành 2.', hint: 'addEntity bỏ qua nếu id đã tồn tại. Cần kiểm tra entityMap rồi updateEntity.', praise: 'Đúng! Kiểm tra entityMap rồi updateEntity, không tạo dòng trùng.' },
    { id: 'ss-fine', title: 'Áp mã BIP10 và quan sát: chỉ component đọc total được vẽ lại.', hint: 'Mã giảm giá chỉ đổi discount. count không phụ thuộc discount.', praise: 'Chính xác! Mỗi phần state là một signal nên cập nhật rất "chọn lọc".' },
    { id: 'ss-immutable', title: 'Tăng số lượng dòng đầu sao cho màn hình cập nhật theo.', hint: 'Sửa trực tiếp object không báo cho signal. Phải tạo state mới qua patchState.', praise: 'Chuẩn! Dữ liệu bất biến + patchState = signal biết mà cập nhật.' },
  ],
  pitfalls: [
    {
      title: 'Sửa trực tiếp state',
      explain: 'Signal so sánh theo tham chiếu. Sửa thuộc tính bên trong object cũ thì không ai được báo, màn hình đứng im. (Ở chế độ dev, SignalStore còn đóng băng state để bắt lỗi này.)',
      wrong: { lang: 'typescript', code: `store.entities()[0].qty++; // UI không đổi` },
      right: { lang: 'typescript', code: `patchState(store, updateEntity({ id, changes: (i) => ({ qty: i.qty + 1 }) }));` },
    },
    {
      title: 'Cho component tự patchState lung tung',
      explain: 'Logic thay đổi state nên nằm trong withMethods để dễ đọc, dễ test. Mặc định state của SignalStore là protected: bên ngoài không gọi được patchState.',
      wrong: { lang: 'typescript', code: `// trong component\npatchState(this.store, { discount: 0.5 }); // lỗi: state được bảo vệ` },
      right: { lang: 'typescript', code: `this.store.applyCoupon(code); // method của store` },
    },
    {
      title: 'Store nào cũng providedIn root',
      explain: 'State của một trang/form nên sống và chết cùng trang đó: provide store ở component để mỗi lần mở trang có state sạch.',
      wrong: { lang: 'typescript', code: `export const EditFormStore = signalStore({ providedIn: 'root' }, …);\n// mở form lần 2 vẫn còn dữ liệu cũ` },
      right: { lang: 'typescript', code: `@Component({ providers: [EditFormStore] })\nexport class EditFormPage {}` },
    },
  ],
  quiz: [
    { question: 'Cách đúng để thay đổi state trong SignalStore?', options: ['Gán store.state = …', 'patchState(store, …) bên trong withMethods', 'store.entities().push(…)', 'Gọi detectChanges()'], correct: 1, explain: 'patchState tạo state mới bất biến và báo cho các signal liên quan.' },
    { question: 'withEntities<CartItem>() cung cấp sẵn gì?', options: ['entities(), entityMap(), ids() và các updater như addEntity', 'Một HTTP client', 'Router cho từng entity', 'Form cho entity'], correct: 0, explain: 'Nó chuẩn hoá danh sách theo id và có updater addEntity, updateEntity, removeEntity…' },
    { question: 'Chỉ discount thay đổi. Component chỉ đọc store.count() có vẽ lại không?', options: ['Có, store đổi là vẽ lại hết', 'Không, count không phụ thuộc discount', 'Chỉ khi dùng OnPush', 'Tuỳ trình duyệt'], correct: 1, explain: 'Mỗi phần là signal riêng; count chỉ phụ thuộc entities.' },
  ],
  doneMessage: 'Nhà kho đã ngăn nắp! Bạn sẵn sàng quản lý state cho app lớn với SignalStore.',
};
