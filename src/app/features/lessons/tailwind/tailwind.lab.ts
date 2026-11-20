import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 15 — Tailwind. Mỗi lần chạy, lab biên dịch Tailwind v4 ngay trong trình duyệt cho các class
 * xuất hiện trong code (như bộ quét của Tailwind: chỉ nhận tên class viết đủ). CSS chỉ áp trong khung preview.
 * check() đọc getComputedStyle để chấm theo kết quả thật, nên viết class khác mà cùng hiệu ứng vẫn đạt.
 */
const css = (el: Element | undefined, prop: string) => (el ? getComputedStyle(el).getPropertyValue(prop).trim() : '');

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Viết class Tailwind trong template, bấm Chạy để xem kết quả. Lab biên dịch Tailwind v4 ngay trong trình duyệt cho đúng những class có trong code của bạn, và CSS chỉ áp trong khung preview.</p>
<div class="tip">Không có preflight (CSS reset) để không đụng giao diện trang học. Biến thể <code>dark:</code> đi theo chế độ sáng/tối của trang.</div>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <div class="max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Bíp Học Angular</h3>
      <p class="mt-2 text-sm text-slate-500">Thử đổi class rồi bấm Chạy.</p>
      <button class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">Bắt đầu</button>
    </div>
  \`,
})
class App {}

mount(App);
`,
  },
  {
    id: 'the-card', group: 'Utility cơ bản', title: 'Dựng thẻ bằng utility class', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Tailwind thay CSS viết tay bằng các class nhỏ, mỗi class một việc: <code>p-4</code> (padding 1rem), <code>rounded-lg</code> (bo góc 0,5rem), <code>shadow-md</code> (đổ bóng), <code>bg-white</code> (nền trắng).</p>
<p><b>Yêu cầu:</b> thẻ <code>.card</code> có padding <b>16px</b> mọi phía, bo góc <b>8px</b>, có đổ bóng và nền trắng.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <!-- TODO: thêm class Tailwind cho thẻ -->
    <div class="card">
      <h3>Khoá học Angular</h3>
      <p>27 bài · có bài luyện tập</p>
    </div>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <div class="card p-4 rounded-lg shadow-md bg-white">
      <h3>Khoá học Angular</h3>
      <p>27 bài · có bài luyện tập</p>
    </div>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Thêm vào class của thẻ: p-4 rounded-lg shadow-md bg-white.',
    explain: 'Thang khoảng cách của Tailwind: mỗi đơn vị là 0,25rem (4px), nên p-4 = 16px, p-6 = 24px. Giữ class "card" chỉ để dễ đọc và để bài kiểm tra tìm thẻ.',
    check(a) {
      const el = a.query('.card')[0];
      if (!el) return NO('Không thấy phần tử .card.');
      const pad = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'].map((p) => css(el, p));
      if (pad.some((p) => p !== '16px')) return NO('Padding đang là ' + pad.join(' ') + ', cần 16px mọi phía (p-4).');
      if (css(el, 'border-top-left-radius') !== '8px') return NO('Bo góc đang là ' + css(el, 'border-top-left-radius') + ', cần 8px (rounded-lg).');
      if (css(el, 'box-shadow') === 'none') return NO('Thẻ chưa có đổ bóng (shadow-md).');
      if (css(el, 'background-color') !== 'rgb(255, 255, 255)') return NO('Nền đang là ' + css(el, 'background-color') + ', cần trắng (bg-white).');
      return OK();
    },
  },
  {
    id: 'flex-gap', group: 'Bố cục', title: 'Xếp hàng ngang: flex + gap', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Bố cục hàng ngang là việc làm hằng ngày: <code>flex</code> xếp các con theo hàng, <code>items-center</code> căn giữa theo chiều dọc, <code>gap-2</code> tạo khoảng cách 8px giữa các con (không cần margin cho từng phần tử), <code>justify-between</code> đẩy hai đầu ra xa.</p>
<p><b>Yêu cầu:</b> thanh <code>.toolbar</code> là flex, căn giữa theo chiều dọc, khoảng cách giữa các nút là <b>8px</b>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <!-- TODO: các nút đang xếp chồng lên nhau theo chiều dọc -->
    <div class="toolbar">
      <button class="block">Lưu</button>
      <button class="block">Huỷ</button>
      <button class="block">Xoá</button>
    </div>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <div class="toolbar flex items-center gap-2">
      <button>Lưu</button>
      <button>Huỷ</button>
      <button>Xoá</button>
    </div>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Gắn flex items-center gap-2 cho .toolbar (và bỏ class block ở các nút, không bắt buộc).',
    explain: 'Muốn tự xuống dòng khi hẹp thì thêm flex-wrap; xếp theo cột thì flex-col; nhiều cột đều nhau thì grid grid-cols-3 gap-4.',
    check(a) {
      const el = a.query('.toolbar')[0];
      if (!el) return NO('Không thấy .toolbar.');
      if (css(el, 'display') !== 'flex') return NO('.toolbar đang có display: ' + css(el, 'display') + ', cần flex.');
      if (css(el, 'align-items') !== 'center') return NO('Chưa căn giữa theo chiều dọc (items-center).');
      if (css(el, 'column-gap') !== '8px') return NO('Khoảng cách giữa các nút đang là ' + css(el, 'column-gap') + ', cần 8px (gap-2).');
      return OK();
    },
  },
  {
    id: 'disabled-variant', group: 'Biến thể', title: 'Trạng thái nút: disabled:', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Tiền tố biến thể áp class theo trạng thái: <code>hover:</code>, <code>focus-visible:</code>, <code>disabled:</code>, <code>dark:</code>, <code>md:</code>… Ví dụ <code>disabled:opacity-50</code> chỉ có tác dụng khi nút có thuộc tính <code>disabled</code>, nên không cần tự đổi class bằng code.</p>
<p><b>Yêu cầu:</b> khi ô tên trống, nút <b>Gửi</b> bị <code>disabled</code> và mờ đi (opacity <b>0.5</b>), con trỏ là <code>not-allowed</code>; khi đã nhập tên, nút rõ lại (opacity 1).</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Tên" [value]="name()" (input)="name.set($any($event.target).value)" />
    <!-- TODO: nút trông vẫn như bình thường khi bị disabled -->
    <button class="send rounded bg-indigo-600 px-4 py-2 text-white" [disabled]="!name()">Gửi</button>
  \`,
})
class App {
  name = signal('');
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Tên" [value]="name()" (input)="name.set($any($event.target).value)" />
    <button
      class="send rounded bg-indigo-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      [disabled]="!name()">
      Gửi
    </button>
  \`,
})
class App {
  name = signal('');
}

mount(App);
`,
    hint: 'Thêm disabled:opacity-50 disabled:cursor-not-allowed vào class của nút.',
    explain: 'Làm bằng biến thể thì giao diện luôn khớp với thuộc tính disabled thật. Nếu tự đổi class bằng [class.opacity-50]="!name()" thì rất dễ quên đồng bộ với [disabled].',
    simulate(s) {
      s.at(200, () => s.dom((r) => {
        const b = r.querySelector('.send');
        r.setAttribute('data-op', css(b ?? undefined, 'opacity'));
        r.setAttribute('data-cur', css(b ?? undefined, 'cursor'));
      }));
      s.at(250, () => s.type(0, 'Bíp'));
    },
    check(a) {
      const r = a.root();
      if (r?.getAttribute('data-op') !== '0.5') return NO('Khi ô tên trống, opacity của nút đang là ' + r?.getAttribute('data-op') + ', cần 0.5.');
      if (r?.getAttribute('data-cur') !== 'not-allowed') return NO('Khi bị disabled, con trỏ cần là not-allowed (disabled:cursor-not-allowed).');
      const op = css(a.query('.send')[0], 'opacity');
      return op === '1' ? OK() : NO('Đã nhập tên mà opacity vẫn là ' + op + ': chỉ được mờ khi bị disabled.');
    },
  },
  {
    id: 'class-dong', group: 'Class động', title: 'Không ghép tên class bằng chuỗi', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Tailwind chỉ sinh CSS cho những tên class <b>xuất hiện đầy đủ</b> trong code (nó quét file như quét văn bản, không chạy code). Ghép chuỗi kiểu <code>'text-' + color + '-600'</code> thì trong code không có chữ <code>text-green-600</code> nào, nên class được gắn vào DOM mà không có CSS.</p>
<p><b>Yêu cầu:</b> trạng thái <code>.status</code> có màu xanh lá (<code>text-green-600</code>) khi online, màu đỏ (<code>text-red-600</code>) khi offline. Khi kiểm tra, trang bấm <b>Đổi trạng thái</b>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <p class="status" [class]="'status text-' + color() + '-600'">{{ online() ? 'Online' : 'Offline' }}</p>
    <button (click)="online.set(!online())">Đổi trạng thái</button>
  \`,
})
class App {
  online = signal(true);
  // ❗ Tailwind không thấy tên class đầy đủ nào trong code
  color = computed(() => (this.online() ? 'green' : 'red'));
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <p class="status" [class]="statusClass()">{{ online() ? 'Online' : 'Offline' }}</p>
    <button (click)="online.set(!online())">Đổi trạng thái</button>
  \`,
})
class App {
  online = signal(true);
  statusClass = computed(() => (this.online() ? 'text-green-600' : 'text-red-600'));
}

mount(App);
`,
    hint: "Viết đủ tên class: statusClass = computed(() => this.online() ? 'text-green-600' : 'text-red-600'), hoặc [class.text-green-600]=\"online()\" [class.text-red-600]=\"!online()\".",
    explain: 'Quy tắc chung: ánh xạ giá trị sang tên class đầy đủ (object, switch, computed), không bao giờ ghép mảnh. Trong dự án thật, class nằm trong file .ts cũng được quét, miễn là viết đủ tên.',
    simulate(s) {
      s.at(200, () => s.dom((r) => r.setAttribute('data-c1', css(r.querySelector('.status') ?? undefined, 'color'))));
      s.at(250, () => s.click('Đổi trạng thái'));
    },
    check(a) {
      const p = a.query('.status')[0];
      if (!p) return NO('Không thấy .status (giữ class status trên thẻ p).');
      const base = css(p.parentElement ?? undefined, 'color');
      const c1 = a.root()?.getAttribute('data-c1') ?? '';
      const c2 = css(p, 'color');
      if (c1 === base) return NO('Khi online, chữ vẫn mang màu mặc định: class màu được gắn nhưng Tailwind không sinh CSS cho nó.');
      if (c2 === base || c2 === c1) return NO('Sau khi đổi sang offline, màu chữ chưa đổi sang đỏ.');
      return OK();
    },
  },
  {
    id: 'class-xung-dot', group: 'Class động', title: 'Hai class cùng thuộc tính: thứ tự không quyết định', level: 'Khó', lv: 3, waitMs: 700,
    desc: `<p>Khi hai class cùng đặt một thuộc tính, class nào thắng phụ thuộc vào <b>thứ tự trong file CSS</b> Tailwind sinh ra, không phải thứ tự trong thuộc tính <code>class</code>. Tailwind xếp <code>px-6</code>/<code>py-4</code> (một trục) sau <code>p-2</code> (cả bốn phía), nên thêm <code>p-2</code> lên một phần tử đang có <code>px-6 py-4</code> sẽ không có tác dụng.</p>
<p><b>Yêu cầu:</b> thẻ <code>.item</code> thường có padding <b>16px 24px</b>; khi bật <b>Thu gọn</b>, padding phải là <b>8px</b> mọi phía. Mỗi trạng thái chỉ gắn một bộ class padding.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <button (click)="compact.set(!compact())">Thu gọn</button>
    <div class="item rounded border px-6 py-4" [class.p-2]="compact()">Mục danh sách</div>
  \`,
})
class App {
  compact = signal(false);
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <button (click)="compact.set(!compact())">Thu gọn</button>
    <div class="item rounded border" [class]="compact() ? 'p-2' : 'px-6 py-4'">Mục danh sách</div>
  \`,
})
class App {
  compact = signal(false);
}

mount(App);
`,
    hint: "Không chồng p-2 lên px-6 py-4. Chọn một trong hai bộ: [class]=\"compact() ? 'p-2' : 'px-6 py-4'\" (class tĩnh item rounded border vẫn được giữ).",
    explain: 'Trong component dùng chung (nút, thẻ), hãy để mỗi biến thể có trọn bộ class riêng thay vì "class gốc + class ghi đè". Thư viện như tailwind-merge giải quyết việc này tự động nếu bắt buộc phải ghép.',
    simulate(s) {
      s.at(200, () => s.dom((r) => {
        const el = r.querySelector('.item') ?? undefined;
        r.setAttribute('data-p1', css(el, 'padding-top') + ' ' + css(el, 'padding-left'));
      }));
      s.at(250, () => s.click('Thu gọn'));
    },
    check(a) {
      const el = a.query('.item')[0];
      if (!el) return NO('Không thấy .item.');
      const p1 = a.root()?.getAttribute('data-p1');
      if (p1 !== '16px 24px') return NO('Trạng thái thường cần padding 16px 24px (đang là ' + p1 + ').');
      const p2 = css(el, 'padding-top') + ' ' + css(el, 'padding-left');
      return p2 === '8px 8px' ? OK() : NO('Khi thu gọn, padding đang là ' + p2 + ', cần 8px 8px: px-6/py-4 vẫn thắng p-2.');
    },
  },
];

export const LAB: LabModule = {
  title: 'Tailwind CSS',
  subtitle: 'bài luyện utility class trên CSS thật (biên dịch Tailwind v4 ngay trong trình duyệt): dựng thẻ, flex + gap, biến thể disabled:, không ghép tên class, class xung đột.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-tailwind').then((m) => m.tailwindExtras()),
  cheatsheet: [
    ['Khoảng cách', '<code>p-4</code> = 16px, <code>px-6</code>, <code>mt-2</code> (1 đơn vị = 4px)'],
    ['Thẻ', '<code>rounded-lg shadow-md bg-white</code>'],
    ['Hàng ngang', '<code>flex items-center gap-2</code>'],
    ['Theo trạng thái', '<code>hover:</code> <code>disabled:</code> <code>focus-visible:</code> <code>dark:</code> <code>md:</code>'],
    ['Class động', 'viết <b>đủ tên</b>: <code>ok() ? \'text-green-600\' : \'text-red-600\'</code>'],
    ['Biến thể', 'mỗi trạng thái một bộ class, không chồng class cùng thuộc tính'],
  ],
};
