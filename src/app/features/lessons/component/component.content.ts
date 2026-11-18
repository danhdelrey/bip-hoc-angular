import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './component.samples';

const PRODUCT_CARD_TS = SAMPLES['product-card.ts'];
const PRODUCT_CARD_HTML = SAMPLES['product-card.html'];
const PRODUCT_CARD_CSS = SAMPLES['product-card.css'];

export const COMPONENT: LessonContent = {
  slug: 'component',
  definition:
    'Component là một class TypeScript gắn decorator @Component, đóng gói logic (class), giao diện (template) và CSS (styles) thành một khối UI dùng lại được.',
  analogy: {
    text: 'Ví dụ bên dưới vẽ mỗi component thành một ngôi nhà 3 tầng; nhiều instance đặt cạnh nhau tạo thành một khu phố.',
    map: [
      ['Ngôi nhà', 'component instance'],
      ['Tầng Class', 'logic và state'],
      ['Tầng Template', 'HTML hiển thị'],
      ['Tầng Styles', 'CSS được đóng gói'],
      ['Bản thiết kế', 'class + @Component'],
      ['Khu phố', 'cây component'],
    ],
  },
  intro:
    'Decorator @Component khai báo metadata cho class: selector (tên thẻ để dùng component trong template khác), template và styles. Mỗi lần thẻ selector xuất hiện, Angular tạo một instance mới từ cùng một class; styles được đóng gói nên chỉ áp dụng trong chính component đó.',
  visualizer: {
    title: 'Ngôi nhà 3 tầng & khu phố',
    hint: 'Bấm từng tầng của ngôi nhà lớn để xem vai trò. Bấm một ngôi nhà trong khu phố để xem bản thiết kế của nó. Bấm "Xây nhà" để xem Angular dựng component từng bước.',
  },
  code: [
    { name: 'product-card.ts', lang: 'angular-ts', code: PRODUCT_CARD_TS, anchors: { 3: 'decorator', 4: 'selector', 5: 'template', 6: 'styles', 7: 'decorator', 8: 'class', 9: 'class', 10: 'class', 11: 'class', 13: 'class', 14: 'class', 15: 'class', 16: 'class' } },
    { name: 'product-card.html', lang: 'angular-html', code: PRODUCT_CARD_HTML, anchors: { 1: 'template', 2: 'template', 3: 'template', 4: 'template', 5: 'template', 6: 'template', 7: 'template' } },
    { name: 'product-card.css', lang: 'css', code: PRODUCT_CARD_CSS, anchors: { 1: 'styles', 2: 'styles', 3: 'styles', 4: 'styles', 5: 'styles', 6: 'styles', 7: 'styles', 8: 'styles', 9: 'styles' } },
  ],
  liveNote: 'Hai ngôi nhà thật cùng một bản thiết kế ProductCard. Mỗi nhà có state riêng: bấm nút ở nhà này, nhà kia không đổi.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { ProductCard } from './app/product-card';

bootstrapApplication(ProductCard).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Component</title></head>\n<body><app-product-card></app-product-card></body>\n</html>\n`,
  },
  challenges: [
    { id: 'cmp-floors', title: 'Bấm lần lượt cả 3 tầng của ngôi nhà: Class, Template và Styles.', hint: 'Ngôi nhà lớn ở bên trái visualizer. Mỗi tầng là một nút bấm được.', praise: 'Đúng rồi: logic ở Class, giao diện ở Template, màu sơn ở Styles.' },
    { id: 'cmp-instance', title: 'Tìm hai ngôi nhà được xây từ CÙNG một bản thiết kế trong khu phố.', hint: 'Khu phố có hai ngôi nhà ProductCard. Bấm vào ngôi nhà thứ hai.', praise: 'Chuẩn! Một class component có thể dựng ra nhiều instance, mỗi cái có state riêng.' },
    { id: 'cmp-build', title: 'Xem trọn quá trình "Xây nhà" tới bước cuối cùng.', hint: 'Bấm nút "Xây nhà" rồi để step-player chạy hết, hoặc bấm ⏭ tới cuối.', praise: 'Giờ bạn biết Angular dựng component từ bản thiết kế như thế nào rồi!' },
  ],
  pitfalls: [
    {
      title: 'Dùng component mà quên thêm vào imports',
      explain: 'Component standalone phải được import vào component cha thì template cha mới hiểu thẻ <app-product-card>. Thiếu là lỗi "is not a known element".',
      wrong: { lang: 'angular-ts', code: `@Component({\n  selector: 'app-product-list',\n  template: \`<app-product-card />\`,\n})` },
      right: { lang: 'angular-ts', code: `@Component({\n  selector: 'app-product-list',\n  imports: [ProductCard],\n  template: \`<app-product-card />\`,\n})` },
    },
    {
      title: 'Nghĩ rằng CSS của component ảnh hưởng toàn trang',
      explain: 'Mặc định styles được "đóng gói" (emulated encapsulation): .card chỉ áp dụng cho template của chính component đó. Muốn style chung thì đặt ở styles.css toàn cục.',
      wrong: { lang: 'css', code: `/* product-card.css */\nh1 { color: red; } /* mong đổi tiêu đề trang chủ */` },
      right: { lang: 'css', code: `/* src/styles.css (toàn cục) */\nh1 { color: red; }` },
    },
    {
      title: 'Selector không có tiền tố',
      explain: 'Selector trùng tên thẻ HTML có sẵn hoặc thư viện khác sẽ gây xung đột. Quy ước là thêm tiền tố như app-.',
      wrong: { lang: 'angular-ts', code: `selector: 'card'` },
      right: { lang: 'angular-ts', code: `selector: 'app-product-card'` },
    },
  ],
  quiz: [
    { question: 'Phần nào của component quyết định thẻ HTML dùng để đặt nó vào trang?', options: ['templateUrl', 'selector', 'styleUrl', 'Tên class'], correct: 1, explain: 'selector là tên thẻ của component: viết <app-product-card /> ở đâu thì Angular tạo một instance ProductCard ở đó.' },
    { question: 'Hai thẻ <app-product-card /> trên cùng một trang thì…', options: ['Dùng chung một object', 'Là hai instance riêng, state độc lập', 'Angular báo lỗi trùng', 'Chỉ cái đầu hiển thị'], correct: 1, explain: 'Mỗi lần dùng selector, Angular tạo một instance mới của class.' },
    { question: 'Viết .card { color: red } trong product-card.css thì ảnh hưởng tới đâu?', options: ['Mọi .card trên trang', 'Chỉ .card bên trong ProductCard', 'Không có tác dụng', 'Chỉ trong index.html'], correct: 1, explain: 'Angular thêm thuộc tính riêng vào selector CSS để styles chỉ áp dụng trong component đó.' },
  ],
  doneMessage: 'Bạn đã xây được ngôi nhà component đầu tiên!',
};
