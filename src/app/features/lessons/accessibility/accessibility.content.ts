import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './accessibility.samples';

export const A11Y_BASICS = `<!-- 1. Dùng đúng thẻ: có sẵn focus, Enter/Space, vai trò "nút" -->
<button type="button" (click)="save()">Lưu</button>

<!-- 2. Nút chỉ có icon thì phải có tên -->
<button type="button" aria-label="Xoá sản phẩm"><app-icon name="trash" /></button>

<!-- 3. Ảnh có nghĩa cần alt; ảnh trang trí để alt rỗng -->
<img ngSrc="ao-mua.jpg" alt="Áo mưa màu vàng" width="320" height="240" />

<!-- 4. Ô nhập phải gắn với nhãn -->
<label for="qty">Số lượng</label> <input id="qty" type="number" />`;

export const ACCESSIBILITY: LessonContent = {
  slug: 'accessibility',
  metaphor:
    'Hãy tưởng tượng một bạn ghé cửa hàng nhưng không nhìn thấy màn hình: bạn ấy "nghe" trang web qua trình đọc màn hình và đi lại bằng phím Tab. Nếu nút không có tên, ảnh không có mô tả, thì cửa hàng như bị khoá cửa. Accessibility là làm cho MỌI người vào được!',
  intro:
    'Accessibility (a11y) là làm cho ứng dụng dùng được với bàn phím, trình đọc màn hình, người nhìn kém màu. Phần lớn đến từ HTML đúng nghĩa (button, label, alt) và độ tương phản đủ. Với widget phức tạp như tabs, menu, listbox, Angular có @angular/aria: các directive không kèm giao diện, lo sẵn role, aria-* và phím mũi tên theo chuẩn WAI-ARIA.',
  visualizer: {
    title: 'Trình đọc màn hình mô phỏng',
    hint: 'Chọn "Nghe trang" để nghe trình đọc màn hình đọc từ trên xuống, hoặc "Chỉ dùng bàn phím" để đi bằng phím Tab. Bật từng cách sửa và nghe lại sự khác biệt.',
  },
  code: [
    { name: 'a11y-tabs.ts', lang: 'angular-ts', code: SAMPLES['a11y-tabs.ts'], anchors: { 2: 'tabs', 8: 'tabs', 9: 'tabs', 10: 'tabs', 14: 'tabs', 20: 'name', 22: 'live' } },
    { name: 'co-ban.html', lang: 'angular-html', code: A11Y_BASICS, anchors: { 2: 'semantic', 5: 'name', 8: 'alt', 11: 'label' } },
  ],
  liveNote: 'Tabs thật dùng @angular/aria: bấm vào một thẻ rồi thử phím ← → Home End. Nút ♥ có aria-label, và dòng thông báo là vùng aria-live.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { A11yTabs } from './app/a11y-tabs';\n\nbootstrapApplication(A11yTabs).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Accessibility</title></head>\n<body><app-a11y-tabs></app-a11y-tabs></body>\n</html>\n`,
  },
  challenges: [
    { id: 'a11y-sr', title: 'Làm cho trình đọc màn hình đọc đúng và đủ mọi phần của trang.', hint: 'Bật hết các cách sửa rồi bấm "Nghe trang". Không còn dòng đỏ nào.', praise: 'Tuyệt! Người dùng khiếm thị giờ hiểu trọn trang của bạn.' },
    { id: 'a11y-keys', title: 'Làm cho mọi thứ bấm được đều đi tới được chỉ bằng bàn phím.', hint: 'div có (click) không nhận focus. Thẻ tabs tự làm thì không có phím mũi tên.', praise: 'Chuẩn! Không cần chuột vẫn mua được hàng.' },
    { id: 'a11y-contrast', title: 'Chỉnh màu chữ để đạt độ tương phản tối thiểu 4.5 : 1 (WCAG AA).', hint: 'Kéo thanh trượt cho chữ tối hơn rồi bấm "Kiểm tra".', praise: 'Đọc rõ rồi! Người nhìn kém hay đứng ngoài nắng đều cảm ơn bạn.' },
  ],
  pitfalls: [
    {
      title: 'Dùng div làm nút',
      explain: 'div không nhận focus, không phản hồi Enter/Space và trình đọc màn hình không biết đó là nút. Dùng thẻ button là có tất cả miễn phí.',
      wrong: { lang: 'angular-html', code: `<div class="btn" (click)="checkout()">Thanh toán</div>` },
      right: { lang: 'angular-html', code: `<button type="button" class="btn" (click)="checkout()">Thanh toán</button>` },
    },
    {
      title: 'Thêm role mà không thêm hành vi',
      explain: 'role="tab" chỉ là lời hứa. Bạn còn phải tự làm aria-selected, tabindex luân phiên, phím mũi tên… @angular/aria lo hết phần đó.',
      wrong: { lang: 'angular-html', code: `<div role="tablist">\n  <div role="tab" (click)="tab = 1">Mô tả</div>\n</div>` },
      right: { lang: 'angular-html', code: `<ul ngTabList [(selectedTab)]="tab">\n  <li ngTab value="mo-ta">Mô tả</li>\n</ul>` },
    },
    {
      title: 'Xoá viền focus cho "đẹp"',
      explain: 'Người dùng bàn phím mất dấu mình đang ở đâu. Hãy đổi kiểu viền bằng :focus-visible thay vì xoá.',
      wrong: { lang: 'css', code: `*:focus { outline: none; }` },
      right: { lang: 'css', code: `:focus-visible {\n  outline: 3px solid #f59e0b;\n  outline-offset: 2px;\n}` },
    },
  ],
  quiz: [
    { question: 'Nút chỉ có icon thùng rác. Trình đọc màn hình sẽ đọc tên gì nếu thiếu aria-label?', options: ['"Nút" mà không có tên', '"Xoá"', 'Tự đoán từ icon', 'Đọc tên file SVG'], correct: 0, explain: 'Icon không có chữ nên nút không có accessible name. Thêm aria-label="Xoá".' },
    { question: '@angular/aria cung cấp gì?', options: ['Giao diện tabs có sẵn màu sắc', 'Directive không giao diện lo role, aria-* và tương tác bàn phím', 'Một trình đọc màn hình', 'Bộ test hiệu năng'], correct: 1, explain: 'Nó là "headless": bạn tự style, Angular lo hành vi chuẩn WAI-ARIA.' },
    { question: 'Tương phản tối thiểu cho chữ thường theo WCAG AA?', options: ['2 : 1', '3 : 1', '4.5 : 1', '10 : 1'], correct: 2, explain: '4.5 : 1 cho chữ thường, 3 : 1 cho chữ lớn và thành phần giao diện.' },
  ],
  doneMessage: 'Cửa hàng của bạn giờ mở cửa cho tất cả mọi người!',
};
