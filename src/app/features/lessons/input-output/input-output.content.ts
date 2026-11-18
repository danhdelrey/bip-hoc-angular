import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './input-output.samples';

export const INPUT_OUTPUT: LessonContent = {
  slug: 'input-output',
  definition:
    'input(), output() và model() là API để component cha và component con trao đổi dữ liệu và sự kiện với nhau.',
  analogy: {
    text: 'Ví dụ vẽ component cha và con thành hai ngôi nhà nối với nhau bằng ống khói.',
    map: [
      ['Nhà Cha / Nhà Con', 'parent / child component'],
      ['Bi xanh rơi xuống', 'giá trị truyền vào input()'],
      ['Bong bóng cam bay lên', 'sự kiện phát ra từ output()'],
      ['Ống hai chiều', 'model() với [( )]'],
    ],
  },
  intro:
    'Component con nhận dữ liệu từ cha bằng input() và báo ngược lên bằng output(). Dữ liệu chỉ đi xuống, sự kiện chỉ đi lên: luồng một chiều giúp app dễ đoán. Khi cần đồng bộ hai chiều, dùng model() với cú pháp [( )].',
  visualizer: {
    title: 'Nhà Cha ↔ Nhà Con',
    hint: 'Đổi quantity ở nhà Cha, bấm "Mua" ở nhà Con, hoặc bấm sao đánh giá ở cả hai phía. Bi xanh = dữ liệu đi xuống, bong bóng cam = sự kiện bay lên.',
  },
  code: [
    { name: 'order-page.ts', lang: 'angular-ts', code: SAMPLES['order-page.ts'], anchors: { 8: 'input', 11: 'input', 12: 'output', 13: 'model', 18: 'input', 19: 'model', 20: 'output', 22: 'output', 23: 'output' } },
    { name: 'product-box.ts', lang: 'angular-ts', code: SAMPLES['product-box.ts'], anchors: { 6: 'input', 7: 'output', 10: 'model', 16: 'input', 17: 'output', 18: 'model' } },
  ],
  liveNote: 'Component cha và con thật. Bấm +1 ở cha, bấm Mua và bấm sao ở con để thấy dữ liệu đi hai hướng.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { OrderPage } from './app/order-page';

bootstrapApplication(OrderPage).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Input / Output</title></head>\n<body><app-order-page></app-order-page></body>\n</html>\n`,
  },
  challenges: [
    { id: 'io-input', title: 'Tăng quantity ở nhà Cha và nhìn bi dữ liệu lăn xuống input() của Con.', hint: 'Dùng nút +/− ở nhà Cha (phía trên).', praise: 'Đúng! input() nhận dữ liệu từ cha — và con không được tự sửa nó.' },
    { id: 'io-output', title: 'Bấm "Mua" ở nhà Con để thổi bong bóng output() lên Cha.', hint: 'Nút Mua ở nhà Con (phía dưới). Cha sẽ cộng vào "đã đặt".', praise: 'Chuẩn! output() là cách con báo tin cho cha.' },
    { id: 'io-model', title: 'Đổi rating theo CẢ HAI hướng: một lần từ Con, một lần từ Cha.', hint: 'Bấm sao ở nhà Con, sau đó bấm sao ở nhà Cha.', praise: 'Tuyệt! model() đồng bộ hai chiều giữa cha và con.' },
  ],
  pitfalls: [
    {
      title: 'Con tự ghi vào input()',
      explain: 'input() là signal chỉ đọc. Muốn con đổi được giá trị và báo cha biết, dùng model(); hoặc giữ state riêng bằng linkedSignal.',
      wrong: { lang: 'typescript', code: `qty = input(1);\nincrease() {\n  this.qty.set(this.qty() + 1); // lỗi: input không có set\n}` },
      right: { lang: 'typescript', code: `qty = model(1);\nincrease() {\n  this.qty.update((q) => q + 1); // báo cha qua qtyChange\n}` },
    },
    {
      title: 'Quên dấu () khi truyền signal xuống input',
      explain: 'Viết [qty]="quantity" là truyền cả hàm signal xuống, không phải con số. Hãy gọi quantity() để lấy giá trị.',
      wrong: { lang: 'angular-html', code: `<app-product-box [qty]="quantity" />` },
      right: { lang: 'angular-html', code: `<app-product-box [qty]="quantity()" />` },
    },
    {
      title: 'Dùng [(rating)] với giá trị không phải signal hay field',
      explain: 'Two-way binding cần một chỗ để ghi lại: signal ghi được hoặc thuộc tính class. Biểu thức như rating() không ghi vào được.',
      wrong: { lang: 'angular-html', code: `<app-product-box [(rating)]="rating()" />` },
      right: { lang: 'angular-html', code: `<app-product-box [(rating)]="rating" />` },
    },
  ],
  quiz: [
    { question: 'Con muốn báo cho cha biết người dùng vừa bấm "Mua". Dùng gì?', options: ['input()', 'output()', 'Gọi thẳng method của cha', 'Sửa biến toàn cục'], correct: 1, explain: 'output() phát sự kiện lên cha; cha lắng nghe bằng (buy)="...".' },
    { question: 'rating = model(0) trong con cho phép cha viết gì?', options: ['[rating]="x" chỉ một chiều', '(rating)="x"', '[(rating)]="x" hai chiều', 'Không dùng được với cha'], correct: 2, explain: 'model() tạo cặp input rating + output ratingChange, nên cha dùng được [(rating)].' },
    { question: 'Vì sao Angular khuyên dữ liệu đi xuống, sự kiện đi lên?', options: ['Cho code dài hơn', 'Luồng một chiều dễ đoán và dễ debug', 'Vì input chạy nhanh hơn', 'Bắt buộc của TypeScript'], correct: 1, explain: 'Khi chỉ cha giữ state và con báo sự kiện, bạn luôn biết dữ liệu đổi ở đâu.' },
  ],
  doneMessage: 'Cha và Con đã nói chuyện trôi chảy với nhau!',
};
