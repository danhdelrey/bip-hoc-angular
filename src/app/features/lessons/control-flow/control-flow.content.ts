import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './control-flow.samples';

export { SAMPLES as CF_SAMPLES };

export const CONTROL_FLOW: LessonContent = {
  slug: 'control-flow',
  metaphor:
    'Template giống một khu vườn: @if quyết định cây có được trồng hay không, @for trồng cả một luống theo danh sách. track là tấm thẻ tên cắm cạnh mỗi cây, để khi sắp xếp lại vườn, Angular bứng nguyên cây đi chứ không chặt đi trồng lại!',
  intro:
    'Control flow (@if, @for, @switch) thêm và gỡ phần tử DOM theo dữ liệu. Với @for, biểu thức track cho Angular biết item nào là item nào, để tái sử dụng DOM thay vì tạo lại. Directive là cách bạn tự viết hành vi gắn lên phần tử.',
  visualizer: {
    title: 'UI ↔ Cây DOM thật',
    hint: 'Bật/tắt @if, thêm/xoá/xáo trộn item, và đổi kiểu track. Node mới "mọc" ra nhấp đỏ, node bị gỡ "bay" đi, node được giữ lại giữ nguyên số hiệu #.',
  },
  code: [
    { name: 'fruit-list.ts', lang: 'angular-ts', code: SAMPLES['fruit-list.ts'], anchors: { 11: 'if', 13: 'if', 14: 'if', 15: 'if', 16: 'if', 17: 'if', 12: 'for', 19: 'track', 20: 'for', 21: 'for', 22: 'for', 23: 'for', 28: 'if', 29: 'for', 35: 'for', 36: 'for' } },
  ],
  liveNote: 'Component thật dùng @if, @else, @for với track và @empty.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { FruitList } from './app/fruit-list';

bootstrapApplication(FruitList).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Control flow</title></head>\n<body><app-fruit-list></app-fruit-list></body>\n</html>\n`,
  },
  challenges: [
    { id: 'cf-if', title: 'Tắt @if để thấy node <p> "bay" khỏi cây DOM.', hint: 'Bấm công tắc @if phía trên danh sách.', praise: '@if không chỉ ẩn bằng CSS: nó gỡ hẳn node khỏi DOM.' },
    { id: 'cf-keep', title: 'Ở chế độ track item.id, xáo trộn danh sách mà KHÔNG tạo mới node nào.', hint: 'Chọn "track item.id" rồi bấm Xáo trộn. Để ý bộ đếm "tạo mới".', praise: 'Đúng! Có key ổn định, Angular chỉ dời chỗ các node có sẵn.' },
    { id: 'cf-recreate', title: 'Chuyển sang track item rồi "Tải lại từ server": xem mọi node bị tạo lại.', hint: 'Dữ liệu tải lại là object MỚI dù nội dung giống hệt. Track theo object thì Angular coi là item khác.', praise: 'Thấy chưa: key không ổn định = DOM bị vứt đi tạo lại, tốn công!' },
  ],
  pitfalls: [
    {
      title: 'Track theo $index cho danh sách có thể xáo trộn hoặc xoá',
      explain: 'track $index gắn DOM theo vị trí. Khi item đổi chỗ, node giữ nguyên chỗ nhưng nội dung bị gán lại: state bên trong (ô input, animation) dính nhầm item.',
      wrong: { lang: 'angular-html', code: `@for (todo of todos(); track $index) {\n  <app-todo-row [todo]="todo" />\n}` },
      right: { lang: 'angular-html', code: `@for (todo of todos(); track todo.id) {\n  <app-todo-row [todo]="todo" />\n}` },
    },
    {
      title: 'Dùng @if để ẩn cái cần giữ state',
      explain: '@if gỡ component khỏi DOM, state bên trong mất hết. Nếu chỉ muốn ẩn tạm (ví dụ tab), cân nhắc [hidden] hoặc giữ state ở service.',
      wrong: { lang: 'angular-html', code: `@if (tab() === 'form') {\n  <app-long-form /> <!-- gõ dở sẽ mất -->\n}` },
      right: { lang: 'angular-html', code: `<app-long-form [hidden]="tab() !== 'form'" />` },
    },
    {
      title: 'Vẫn dùng *ngIf / *ngFor kiểu cũ trong code mới',
      explain: 'Cú pháp @if/@for là built-in, không cần import, type-check tốt hơn và nhanh hơn. *ngIf/*ngFor chỉ nên còn trong code cũ.',
      wrong: { lang: 'angular-html', code: `<li *ngFor="let f of fruits()">{{ f.name }}</li>` },
      right: { lang: 'angular-html', code: `@for (f of fruits(); track f.id) {\n  <li>{{ f.name }}</li>\n}` },
    },
  ],
  quiz: [
    { question: '@if (show()) { <p>Hi</p> } với show() = false thì thẻ <p>…', options: ['Có trong DOM nhưng display:none', 'Không tồn tại trong DOM', 'Vẫn hiển thị', 'Bị lỗi'], correct: 1, explain: '@if thêm hoặc gỡ hẳn node khỏi DOM.' },
    { question: 'Danh sách tải lại từ API (object mới, cùng id). Track nào giữ được DOM cũ?', options: ['track item', 'track item.id', 'track $index luôn tốt nhất', 'Không track'], correct: 1, explain: 'id ổn định giữa các lần tải, còn tham chiếu object thì thay đổi mỗi lần.' },
    { question: 'Muốn tạo hành vi "đổi màu nền khi rê chuột" dùng lại ở nhiều nơi, nên viết gì?', options: ['Một attribute directive', 'Một pipe', 'Một service', 'Một route'], correct: 0, explain: 'Attribute directive gắn hành vi/thuộc tính lên phần tử có sẵn, như [appHighlight].' },
  ],
  doneMessage: 'Bạn đã điều khiển được cây DOM như một người làm vườn chuyên nghiệp!',
};
