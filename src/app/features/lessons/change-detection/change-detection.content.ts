import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './change-detection.samples';

export const CD_MODES_CODE = `// ① Eager + zone.js (kiểu Angular cũ)
@Component({ changeDetection: ChangeDetectionStrategy.Eager, … })
bootstrapApplication(App, { providers: [provideZoneChangeDetection()] });

// ② OnPush + zone.js
@Component({ changeDetection: ChangeDetectionStrategy.OnPush, … })

// ③ Zoneless + signals — MẶC ĐỊNH của Angular 22
// (không zone.js, component mới mặc định OnPush)
bootstrapApplication(App);`;

export const CHANGE_DETECTION: LessonContent = {
  slug: 'change-detection',
  definition:
    'Change detection là quá trình Angular xác định component nào cần cập nhật và đồng bộ state của chúng lên DOM.',
  analogy: {
    text: 'Ví dụ vẽ cây component thành một khu phố, còn change detection là thanh tra cầm kính lúp đi kiểm tra.',
    map: [
      ['Khu phố', 'cây component'],
      ['Ngôi nhà', 'component'],
      ['Thanh tra ghé nhà', 'một lần kiểm tra component'],
      ['Cờ "có thay đổi"', 'component bị đánh dấu dirty'],
    ],
  },
  intro:
    'Sau mỗi sự kiện, Angular phải biết phần giao diện nào cần cập nhật. Kiểu cũ (Eager + zone.js) kiểm tra cả cây; OnPush chỉ kiểm tra nhánh được đánh dấu; Zoneless + signals (mặc định từ Angular 21–22) chỉ chạy khi thật sự có thay đổi và nhắm đúng component.',
  visualizer: {
    title: 'Thanh tra kính lúp',
    hint: 'Chọn chế độ, rồi chọn một thao tác. Thanh tra đi qua khu phố: nhà nhấp sáng là được kiểm tra, nhà mờ là được bỏ qua. Bảng điểm bên dưới so sánh 3 chế độ.',
  },
  code: [
    { name: 'zoneless-demo.ts', lang: 'angular-ts', code: SAMPLES['zoneless-demo.ts'], anchors: { 7: 'timer', 8: 'signal', 12: 'timer', 13: 'signal', 15: 'timer', 16: 'timer', 17: 'timer', 20: 'signal', 21: 'signal', 22: 'signal' } },
    { name: 'modes.ts', lang: 'angular-ts', code: CD_MODES_CODE, anchors: { 1: 'eager', 2: 'eager', 3: 'eager', 5: 'onpush', 6: 'onpush', 8: 'zoneless', 9: 'zoneless', 10: 'zoneless' } },
  ],
  liveNote: 'App này chạy zoneless thật. Bấm "Biến thường +1": sau 1 giây số KHÔNG đổi (Angular không biết). Bấm "Signal +1": số đổi đúng lúc. Bấm nút bất kỳ sau đó để thấy biến thường "bắt kịp".',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { ZonelessDemo } from './app/zoneless-demo';

bootstrapApplication(ZonelessDemo).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Change detection</title></head>\n<body><app-zoneless-demo></app-zoneless-demo></body>\n</html>\n`,
  },
  challenges: [
    { id: 'cd-compare', title: 'Chạy CÙNG một thao tác ở cả 3 chế độ và so bảng điểm.', hint: 'Chọn thao tác "Bấm ❤ trong Card B", chạy ở Eager, rồi đổi sang OnPush, rồi Zoneless.', praise: 'Thấy rõ chưa: cùng một cú click, Eager kiểm tra cả khu phố, OnPush/Zoneless chỉ một nhánh.' },
    { id: 'cd-zero', title: 'Tìm thao tác khiến thanh tra KHÔNG cần ra khỏi nhà (0 lần kiểm tra, không có tick).', hint: 'Ở chế độ Zoneless, một setTimeout không đổi state gì thì sao?', praise: 'Chính xác! Zoneless không có zone.js "báo động giả", nên không chạy change detection thừa.' },
    { id: 'cd-signal', title: 'Làm cho thanh tra chỉ kiểm tra ĐÚNG 1 ngôi nhà.', hint: 'Thao tác đổi signal mà chỉ CartBadge đọc trong template.', praise: 'Đúng! Signal biết chính xác component nào đang đọc nó.' },
  ],
  pitfalls: [
    {
      title: 'Đổi biến thường trong setTimeout/subscribe ở app zoneless',
      explain: 'Không có zone.js, Angular không tự biết khi nào callback bất đồng bộ chạy xong. Dùng signal để Angular được báo.',
      wrong: { lang: 'typescript', code: `setTimeout(() => (this.count = this.count + 1), 1000);` },
      right: { lang: 'typescript', code: `count = signal(0);\nsetTimeout(() => this.count.update((c) => c + 1), 1000);` },
    },
    {
      title: 'Sửa ruột object input của component OnPush',
      explain: 'OnPush so sánh input theo tham chiếu. Sửa thuộc tính bên trong object cũ thì con không được đánh dấu cần kiểm tra.',
      wrong: { lang: 'typescript', code: `this.user.name = 'Bíp'; // <app-avatar [user]="user"> không cập nhật` },
      right: { lang: 'typescript', code: `this.user = { ...this.user, name: 'Bíp' };\n// hoặc tốt hơn: user = signal(...)` },
    },
    {
      title: 'Gọi hàm nặng trong template',
      explain: 'Hàm trong template chạy lại mỗi lần component được kiểm tra. Đưa tính toán vào computed() để được memo.',
      wrong: { lang: 'angular-html', code: `<p>{{ calcTotal(items()) }}</p>` },
      right: { lang: 'typescript', code: `total = computed(() => calcTotal(this.items()));\n// template: {{ total() }}` },
    },
  ],
  quiz: [
    { question: 'App zoneless: một setTimeout chạy xong mà không đổi signal nào. Angular làm gì?', options: ['Kiểm tra toàn bộ cây', 'Không chạy change detection', 'Báo lỗi', 'Reload trang'], correct: 1, explain: 'Không có zone.js thì không có tick tự động; chỉ signal, sự kiện template hay markForCheck mới lên lịch.' },
    { question: 'Component OnPush được kiểm tra khi nào?', options: ['Mỗi lần có bất kỳ sự kiện nào trong app', 'Khi input đổi tham chiếu, có sự kiện trong nó, signal nó đọc đổi, hoặc markForCheck()', 'Không bao giờ', 'Mỗi 16ms'], correct: 1, explain: 'OnPush bỏ qua component trừ khi nó được đánh dấu "có thay đổi" theo một trong các cách đó.' },
    { question: 'Trong Angular 22, component mới tạo mặc định dùng strategy nào?', options: ['Eager', 'OnPush', 'Default', 'Detached'], correct: 1, explain: 'Từ Angular 22, OnPush là mặc định; Eager (tên mới của Default) phải khai báo rõ nếu muốn.' },
  ],
  doneMessage: 'Bạn đã huấn luyện được một thanh tra siêu thông minh!',
};
