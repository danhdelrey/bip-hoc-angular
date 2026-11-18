import type { LessonContent } from '../../../content/lesson.model';

export const CART_SUMMARY_TS = `import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.html',
})
export class CartSummary {
  price = signal(80);
  qty = signal(2);
  vip = signal(false);

  subtotal = computed(() => this.price() * this.qty());
  freeShip = computed(() => this.subtotal() >= 200);
  shipLabel = computed(() => (this.freeShip() ? 'Miễn phí ship' : 'Ship 15k'));
  total = computed(
    () => this.subtotal() * (this.vip() ? 0.9 : 1) + (this.freeShip() ? 0 : 15),
  );

  log = signal<string[]>([]);

  constructor() {
    effect(() => {
      const t = this.total();
      this.log.update((l) => [\`🔔 Tổng: \${t}k\`, ...l].slice(0, 3));
    });
  }
}`;

export const CART_SUMMARY_HTML = `<p>{{ price() }}k × {{ qty() }} = {{ subtotal() }}k</p>
<button (click)="qty.update((q) => q + 1)">Thêm 1 món</button>
<label>
  <input type="checkbox" [checked]="vip()" (change)="vip.set(!vip())" /> VIP -10%
</label>
<p>{{ shipLabel() }} · Tổng: <b>{{ total() }}k</b></p>
<ul>
  @for (line of log(); track $index) {
    <li>{{ line }}</li>
  }
</ul>`;

export const LINKED_TS = `const SIZES = { ao: ['S', 'M', 'L'], giay: ['39', '40', '41'] };

product = signal<'ao' | 'giay'>('ao');
sizes = computed(() => SIZES[this.product()]);

// Ghi được như signal, nhưng tự "reset" khi sizes đổi
size = linkedSignal(() => this.sizes()[0]);`;

export const RESOURCE_TS = `productId = signal(1);

product = resource({
  params: () => ({ id: this.productId() }),
  loader: ({ params, abortSignal }) => fakeFetch(params.id, abortSignal),
});
// product.status(): 'loading' | 'resolved' | 'error' …
// product.value(): dữ liệu khi đã tải xong`;

export const SIGNALS: LessonContent = {
  slug: 'signals',
  metaphor:
    'Signal giống những bóng đèn nối dây với nhau. Bật một công tắc, dòng điện chạy sang các đèn phụ thuộc. Còn effect là cái chuông, reo mỗi khi đèn nó theo dõi đổi màu!',
  metaphorMood: 'wave',
  intro:
    'signal giữ giá trị, computed tính ra từ signal khác, effect chạy việc phụ khi giá trị đổi. Điểm hay nhất: computed lười biếng (chỉ tính khi có ai đọc) và biết nhớ (giá trị không đổi thì không làm phiền ai).',
  visualizer: {
    title: 'Bảng điện Signals',
    hint: 'Kéo giá, đổi số lượng hoặc bật VIP. Xem dòng điện "báo cũ" chạy đi, rồi đèn nào thật sự được tính lại. Thử tắt màn hình và chuông để thấy computed "ngủ".',
  },
  code: [
    {
      name: 'cart-summary.ts',
      lang: 'angular-ts',
      code: CART_SUMMARY_TS,
      anchors: { 8: 'price', 9: 'qty', 10: 'vip', 12: 'subtotal', 13: 'freeShip', 14: 'shipLabel', 15: 'total', 16: 'total', 17: 'total', 22: 'bell', 23: 'bell', 24: 'bell', 25: 'bell' },
    },
    {
      name: 'cart-summary.html',
      lang: 'angular-html',
      code: CART_SUMMARY_HTML,
      anchors: { 1: 'subtotal', 2: 'qty', 4: 'vip', 6: 'screen', 7: 'bell', 8: 'bell', 9: 'bell', 10: 'bell', 11: 'bell' },
    },
  ],
  liveNote: 'Component thật với signal, computed và effect. Mỗi lần tổng đổi, effect ghi thêm một dòng 🔔.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { CartSummary } from './app/cart-summary';

bootstrapApplication(CartSummary).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>Signals</title></head>
<body><app-cart-summary></app-cart-summary></body>
</html>
`,
  },
  challenges: [
    {
      id: 'sig-memo',
      title: 'Đổi số lượng sao cho freeShip được tính lại nhưng giá trị KHÔNG đổi, để shipLabel khỏi phải tính lại.',
      hint: 'Khi subtotal đã ≥ 200 (freeShip = true), tăng số lượng thêm 1. freeShip vẫn là true nên shipLabel được "miễn tính".',
      praise: 'Chính xác! computed so sánh giá trị mới với cũ; bằng nhau thì không báo tiếp. Đó là memo.',
    },
    {
      id: 'sig-lazy',
      title: 'Tắt cả màn hình lẫn chuông effect, rồi đổi giá. Quan sát các computed "ngủ" không tính lại.',
      hint: 'Hai công tắc "Màn hình đang đọc" và "Chuông effect" nằm dưới bảng điện. Tắt cả hai rồi kéo thanh giá.',
      praise: 'Đúng vậy: không ai đọc thì computed không tính. Lười biếng mà hiệu quả!',
    },
    {
      id: 'sig-vip-bell',
      title: 'Bật VIP và nghe chuông effect reo.',
      hint: 'Chuông phải đang bật. Bấm công tắc VIP: total đổi nên effect chạy lại.',
      praise: 'Chuông reo vì effect đọc total(), mà total phụ thuộc vip.',
    },
  ],
  pitfalls: [
    {
      title: 'Sửa trực tiếp mảng/object bên trong signal',
      explain: 'Signal so sánh bằng tham chiếu. push() vào mảng cũ thì tham chiếu không đổi, nên không ai được báo. Hãy tạo mảng mới bằng update().',
      wrong: { lang: 'typescript', code: `items().push(newItem); // không ai biết có thay đổi` },
      right: { lang: 'typescript', code: `items.update((list) => [...list, newItem]);` },
    },
    {
      title: 'Dùng effect để tính dữ liệu dẫn xuất',
      explain: 'Effect để làm việc phụ (log, lưu localStorage, gọi API ngoài). Giá trị tính từ signal khác thì dùng computed: lười, có memo, không bị lệch trạng thái.',
      wrong: { lang: 'typescript', code: `total = signal(0);\nconstructor() {\n  effect(() => this.total.set(this.price() * this.qty()));\n}` },
      right: { lang: 'typescript', code: `total = computed(() => this.price() * this.qty());` },
    },
    {
      title: 'Đọc signal sau await trong computed/effect',
      explain: 'Signal chỉ được theo dõi khi đọc đồng bộ. Đọc sau await thì Angular không biết đó là phụ thuộc. Muốn tải dữ liệu bất đồng bộ, hãy dùng resource().',
      wrong: { lang: 'typescript', code: `effect(async () => {\n  await delay(100);\n  console.log(this.total()); // không được theo dõi\n});` },
      right: { lang: 'typescript', code: `effect(() => {\n  const t = this.total(); // đọc đồng bộ trước\n  delay(100).then(() => console.log(t));\n});` },
    },
    {
      title: 'Ghi vào signal bên trong computed',
      explain: 'computed phải là hàm thuần: chỉ đọc và trả về giá trị. Ghi vào signal khác bên trong computed sẽ bị Angular báo lỗi.',
      wrong: { lang: 'typescript', code: `total = computed(() => {\n  this.lastTotal.set(this.subtotal()); // lỗi!\n  return this.subtotal();\n});` },
      right: { lang: 'typescript', code: `total = computed(() => this.subtotal());\n// muốn lưu lại? dùng linkedSignal hoặc effect` },
    },
  ],
  quiz: [
    {
      question: 'Không có template hay effect nào đọc total. Bạn đổi price. Điều gì xảy ra với total?',
      options: [
        'total tính lại ngay lập tức',
        'total chỉ bị đánh dấu "có thể cũ", chưa tính gì cho tới khi có ai đọc',
        'total bị xoá',
        'Angular báo lỗi',
      ],
      correct: 1,
      explain: 'computed là lazy: thay đổi chỉ lan truyền dấu "dirty". Việc tính lại chỉ xảy ra khi có người đọc.',
    },
    {
      question: 'subtotal đổi từ 240 thành 320, nên freeShip được tính lại nhưng vẫn là true. shipLabel sẽ…',
      options: ['Tính lại vì subtotal đã đổi', 'Không tính lại vì freeShip không đổi giá trị', 'Bị lỗi', 'Đổi thành "Ship 15k"'],
      correct: 1,
      explain: 'shipLabel chỉ phụ thuộc freeShip. freeShip ra giá trị giống cũ nên shipLabel được giữ nguyên (memo).',
    },
    {
      question: 'Trường hợp nào nên dùng effect?',
      options: [
        'Tính tổng tiền từ giá và số lượng',
        'Lọc danh sách theo từ khoá',
        'Lưu giỏ hàng vào localStorage mỗi khi nó đổi',
        'Đổi chữ hoa tên người dùng',
      ],
      correct: 2,
      explain: 'Lưu localStorage là việc phụ ra bên ngoài, đúng việc của effect. Ba lựa chọn còn lại là dữ liệu dẫn xuất, nên dùng computed.',
    },
  ],
  doneMessage: 'Đèn đã sáng trong đầu bạn! Signal, computed, effect đã thông.',
};
