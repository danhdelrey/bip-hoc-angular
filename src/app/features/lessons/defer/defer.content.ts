import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './defer.samples';

export const DEFER: LessonContent = {
  slug: 'defer',
  definition:
    '@defer là khối template tải trễ: code của nội dung bên trong được tách thành chunk riêng và chỉ tải khi một trigger xảy ra.',
  analogy: {
    text: 'Ví dụ vẽ mỗi khối @defer thành một hộp quà.',
    map: [
      ['Hộp đóng', '@placeholder'],
      ['Hộp rung lắc', '@loading'],
      ['Món quà', 'nội dung đã tải'],
      ['Điều kiện mở hộp', 'trigger (on viewport, on interaction…)'],
    ],
  },
  intro:
    '@defer tách phần template (và code của các component trong đó) ra một chunk JS riêng, chỉ tải khi trigger xảy ra. Trang đầu nhẹ hơn, mở nhanh hơn. Các khối @placeholder, @loading, @error cho bạn kiểm soát từng giai đoạn.',
  visualizer: {
    title: 'Hộp quà @defer',
    hint: 'Mỗi hộp có một trigger khác nhau. Cuộn khung "on viewport", bấm hộp "on interaction", bấm "Trình duyệt rảnh" hay "Đếm 2 giây" để mở các hộp còn lại.',
  },
  code: [
    { name: 'defer-demo.ts', lang: 'angular-ts', code: SAMPLES['defer-demo.ts'], anchors: { 8: 'interaction', 9: 'content', 10: 'placeholder', 11: 'placeholder', 12: 'loading', 13: 'loading', 16: 'viewport', 17: 'content', 18: 'placeholder', 19: 'placeholder' } },
    { name: 'heavy-chart.ts', lang: 'angular-ts', code: SAMPLES['heavy-chart.ts'], anchors: { 3: 'content', 4: 'content' } },
  ],
  liveNote: '@defer thật: bấm hộp thứ nhất để tải chunk; hộp thứ hai tự mở khi bạn cuộn khung này vào màn hình (và được tải trước lúc trình duyệt rảnh).',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { DeferDemo } from './app/defer-demo';

bootstrapApplication(DeferDemo).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>@defer</title></head>\n<body><app-defer-demo></app-defer-demo></body>\n</html>\n`,
  },
  challenges: [
    { id: 'df-interaction', title: 'Mở hộp "on interaction" bằng cách chạm vào nó.', hint: 'Bấm thẳng vào hộp có nhãn on interaction.', praise: 'Chuẩn! Placeholder chính là chỗ người dùng chạm vào.' },
    { id: 'df-viewport', title: 'Mở hộp "on viewport" bằng cách cuộn tới nó.', hint: 'Cuộn khung nhỏ có hộp on viewport xuống dưới.', praise: 'Hộp tự mở khi lọt vào màn hình — nhờ IntersectionObserver.' },
    { id: 'df-all', title: 'Mở đủ cả 4 hộp quà.', hint: 'Còn hộp on idle (bấm "Trình duyệt rảnh") và on timer (bấm "Đếm 2 giây").', praise: 'Bạn đã sưu tầm đủ bộ trigger của @defer!' },
  ],
  pitfalls: [
    {
      title: 'Import tĩnh component ở nơi khác nên không được tách chunk',
      explain: 'Component trong @defer chỉ được tách thành chunk riêng khi nó KHÔNG được tham chiếu ngoài khối @defer (kể cả ở file khác import tĩnh).',
      wrong: { lang: 'angular-ts', code: `// Ngoài @defer cũng dùng <app-heavy-chart /> → bị gộp vào bundle chính\ntemplate: \`<app-heavy-chart /> @defer { <app-heavy-chart /> }\`` },
      right: { lang: 'angular-ts', code: `template: \`@defer (on viewport) { <app-heavy-chart /> } @placeholder { <p>…</p> }\`` },
    },
    {
      title: 'on viewport / on interaction mà không có @placeholder',
      explain: 'Hai trigger này theo dõi phần tử placeholder. Không có placeholder thì không có gì để chạm hay để lọt vào màn hình.',
      wrong: { lang: 'angular-html', code: `@defer (on interaction) {\n  <app-heavy-chart />\n}` },
      right: { lang: 'angular-html', code: `@defer (on interaction) {\n  <app-heavy-chart />\n} @placeholder {\n  <button>Mở biểu đồ</button>\n}` },
    },
    {
      title: 'Loading nhấp nháy vì tải quá nhanh',
      explain: 'Chunk tải trong vài chục ms làm @loading loé lên rồi tắt, rất khó chịu. Dùng minimum (và after) để ổn định.',
      wrong: { lang: 'angular-html', code: `} @loading {\n  <app-spinner />\n}` },
      right: { lang: 'angular-html', code: `} @loading (after 100ms; minimum 500ms) {\n  <app-spinner />\n}` },
    },
  ],
  quiz: [
    { question: '@defer giúp ích chủ yếu cho điều gì?', options: ['Chạy code nhanh hơn sau khi tải', 'Bundle ban đầu nhỏ hơn, trang mở nhanh hơn', 'Thay thế router', 'Bảo mật dữ liệu'], correct: 1, explain: 'Code trong khối defer chỉ tải khi cần, nên trang đầu nhẹ hơn.' },
    { question: 'Trigger mặc định khi viết @defer { … } không kèm điều kiện là gì?', options: ['on viewport', 'on interaction', 'on idle', 'on timer(1s)'], correct: 2, explain: 'Mặc định là on idle: tải khi trình duyệt rảnh (requestIdleCallback).' },
    { question: 'Khối nào hiển thị TRONG LÚC đang tải chunk?', options: ['@placeholder', '@loading', '@error', '@empty'], correct: 1, explain: '@placeholder hiển thị trước khi trigger, @loading trong lúc tải, @error nếu tải thất bại.' },
  ],
  doneMessage: 'Bạn đã mở hết mọi hộp quà! Lộ trình gần như trọn vẹn rồi.',
};
