import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './content-projection.samples';

export const CONTENT_PROJECTION: LessonContent = {
  slug: 'content-projection',
  metaphor:
    'Component có <ng-content> giống một khung tranh nhiều ô trống: người dùng component (nhà cha) tự đặt tranh vào. select="[card-title]" là nhãn trên ô, chỉ nhận tranh dán đúng nhãn. Còn ng-template là bản vẽ CHƯA in — ai cầm nó cũng có thể in ra bao nhiêu lần tuỳ thích!',
  intro:
    'Content projection cho phép component nhận HTML từ bên ngoài thay vì chỉ nhận dữ liệu. Nhiều <ng-content select> tạo nhiều ô, ô không có select là ô mặc định, và nội dung bên trong <ng-content> là phương án dự phòng. Khi cần render lặp lại kèm dữ liệu, truyền một TemplateRef và in bằng ngTemplateOutlet.',
  visualizer: {
    title: 'Khung tranh nhiều ô',
    hint: 'Bật/tắt từng mảnh HTML trong template của nhà cha và xem Angular xếp chúng vào ô nào. Ở phần dưới, đổi bản vẽ ng-template để danh sách in lại theo kiểu khác.',
  },
  code: [
    { name: 'info-card.ts', lang: 'angular-ts', code: SAMPLES['info-card.ts'], anchors: { 7: 'slot-title', 8: 'slot-default', 9: 'slot-action' } },
    { name: 'projection-demo.ts', lang: 'angular-ts', code: SAMPLES['projection-demo.ts'], anchors: { 10: 'slot-title', 11: 'slot-default', 12: 'slot-action', 15: 'outlet', 18: 'tpl-plain', 19: 'tpl-fancy' } },
    { name: 'item-list.ts', lang: 'angular-ts', code: SAMPLES['item-list.ts'], anchors: { 11: 'outlet', 19: 'outlet' } },
  ],
  liveNote: 'Component thật: InfoCard có 3 ô (tiêu đề, mặc định, nút) và ItemList in mỗi item bằng template do nhà cha truyền vào.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { ProjectionDemo } from './app/projection-demo';\n\nbootstrapApplication(ProjectionDemo).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Content projection</title></head>\n<body><app-projection-demo></app-projection-demo></body>\n</html>\n`,
  },
  challenges: [
    { id: 'cp-slots', title: 'Lấp đầy cả 3 ô của khung tranh: tiêu đề, ô mặc định và ô nút.', hint: 'Bật một mảnh có card-title, một mảnh không có selector và một mảnh có card-action.', praise: 'Chuẩn! Mỗi mảnh được xếp vào ô đầu tiên có select khớp với nó.' },
    { id: 'cp-fallback', title: 'Làm cho ô nút hiện nội dung dự phòng.', hint: 'Tắt hết các mảnh có card-action. Nội dung bên trong <ng-content> sẽ hiện ra thay thế.', praise: 'Đúng! Nội dung bên trong <ng-content> là phương án dự phòng (có từ Angular 18).' },
    { id: 'cp-template', title: 'Đổi bản vẽ ng-template để danh sách in theo kiểu khác.', hint: 'Bấm nút đổi template ở phần ngTemplateOutlet phía dưới.', praise: 'Tuyệt! Cùng một danh sách, nhà cha quyết định mỗi item trông thế nào.' },
  ],
  pitfalls: [
    {
      title: 'Bọc <ng-content> trong @if để ẩn/hiện',
      explain: 'Nội dung được chiếu vào LUÔN được tạo ra (và vòng đời của nó do nhà cha quản lý), kể cả khi @if đang tắt. Muốn tạo nội dung lười, hãy nhận một ng-template và chỉ in khi cần.',
      wrong: { lang: 'angular-html', code: `@if (open()) {\n  <ng-content /> <!-- component con vẫn được tạo khi đóng -->\n}` },
      right: { lang: 'angular-html', code: `@if (open()) {\n  <ng-container [ngTemplateOutlet]="contentTpl()" />\n}` },
    },
    {
      title: 'Đặt hai <ng-content> mặc định',
      explain: 'Chỉ ô KHÔNG có select đầu tiên nhận phần nội dung còn lại; ô mặc định thứ hai luôn trống. Dùng select để phân biệt.',
      wrong: { lang: 'angular-html', code: `<header><ng-content /></header>\n<footer><ng-content /></footer>` },
      right: { lang: 'angular-html', code: `<header><ng-content select="[card-title]" /></header>\n<footer><ng-content /></footer>` },
    },
    {
      title: 'Quên context khi in template',
      explain: 'let-fruit đọc $implicit, let-i="index" đọc khoá index. Không truyền ngTemplateOutletContext thì các biến này đều undefined.',
      wrong: { lang: 'angular-html', code: `<ng-container [ngTemplateOutlet]="itemTemplate()" />` },
      right: { lang: 'angular-html', code: `<ng-container [ngTemplateOutlet]="itemTemplate()"\n              [ngTemplateOutletContext]="{ $implicit: item, index: i }" />` },
    },
  ],
  quiz: [
    { question: 'Component có <ng-content select="[card-title]" /> và <ng-content />. Thẻ <p> (không có thuộc tính gì) đi vào đâu?', options: ['Ô card-title', 'Ô mặc định', 'Bị bỏ qua', 'Cả hai ô'], correct: 1, explain: '<p> không khớp selector nào nên rơi vào ô mặc định.' },
    { question: '<ng-content select="[card-action]">Không có nút</ng-content> hiển thị chữ "Không có nút" khi nào?', options: ['Luôn luôn', 'Khi nhà cha không chiếu phần tử nào có card-action', 'Khi component bị lỗi', 'Không bao giờ'], correct: 1, explain: 'Đó là nội dung dự phòng của ô, chỉ hiện khi ô trống.' },
    { question: 'Muốn nhà cha quyết định cách render MỖI item trong danh sách của component con, dùng gì?', options: ['Nhiều <ng-content>', 'Truyền TemplateRef qua input rồi in bằng ngTemplateOutlet kèm context', 'innerHTML', 'Một service'], correct: 1, explain: 'ng-content chỉ chiếu một lần; template thì in được nhiều lần với dữ liệu khác nhau.' },
  ],
  doneMessage: 'Bạn đã làm chủ khung tranh nhiều ô và bản vẽ ng-template!',
};
