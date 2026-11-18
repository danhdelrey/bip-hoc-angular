import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './lifecycle.samples';

export const LIFECYCLE: LessonContent = {
  slug: 'lifecycle',
  definition:
    'Lifecycle hooks là các phương thức Angular tự gọi tại những thời điểm cố định trong vòng đời của component, từ lúc tạo tới lúc huỷ.',
  analogy: {
    text: 'Ví dụ kể vòng đời component như hành trình một đời người; mỗi trạm dừng là một hook.',
    map: [
      ['Sinh ra', 'constructor'],
      ['Nhận quà từ cha', 'ngOnChanges (input đổi)'],
      ['Ra mắt mọi người', 'ngAfterViewInit / afterNextRender'],
      ['Tạm biệt', 'ngOnDestroy'],
      ['Trạm dừng', 'một lifecycle hook'],
    ],
  },
  intro:
    'Angular gọi các hook theo thứ tự cố định khi tạo, cập nhật và huỷ component. ngOnInit là nơi khởi tạo, ngOnDestroy là nơi dọn dẹp. Với signals, nhiều việc trước đây làm trong hook giờ dùng computed, effect hoặc afterNextRender.',
  visualizer: {
    title: 'Hành trình một đời component',
    hint: 'Bấm "Tạo", "Đổi input" và "Huỷ". Nhân vật đi tới trạm tương ứng, hook sáng lên đúng thứ tự, console bên dưới ghi lại.',
  },
  code: [
    { name: 'life-buddy.ts', lang: 'angular-ts', code: SAMPLES['life-buddy.ts'], anchors: { 9: 'ngOnChanges', 12: 'constructor', 13: 'constructor', 14: 'constructor', 15: 'ngOnChanges', 16: 'ngOnChanges', 17: 'ngOnChanges', 18: 'ngOnInit', 19: 'ngOnInit', 20: 'ngOnInit', 21: 'ngAfterViewInit', 22: 'ngAfterViewInit', 23: 'ngAfterViewInit', 24: 'ngOnDestroy', 25: 'ngOnDestroy', 26: 'ngOnDestroy' } },
    { name: 'life-host.ts', lang: 'angular-ts', code: SAMPLES['life-host.ts'], anchors: { 9: 'constructor', 10: 'ngOnChanges', 11: 'constructor', 12: 'ngOnChanges' } },
    { name: 'hook-log.ts', lang: 'angular-ts', code: SAMPLES['hook-log.ts'] },
  ],
  liveNote: 'Component thật với hook thật. Bấm Tạo → Đổi tên → Huỷ rồi đọc thứ tự trong danh sách log.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { LifeHost } from './app/life-host';

bootstrapApplication(LifeHost).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Lifecycle</title></head>\n<body><app-life-host></app-life-host></body>\n</html>\n`,
  },
  challenges: [
    { id: 'lc-full', title: 'Đưa nhân vật đi trọn một đời: Tạo → Đổi input → Huỷ.', hint: 'Ba nút điều khiển nằm dưới con đường. Bấm lần lượt từ trái sang phải.', praise: 'Trọn vẹn một đời component! Thứ tự hook luôn cố định như vậy.' },
    { id: 'lc-twice', title: 'Trong cùng một đời, làm cho ngOnChanges chạy thêm 2 lần sau khi tạo.', hint: 'Mỗi lần "Đổi input", Angular gọi ngOnChanges — nhưng KHÔNG gọi lại ngOnInit.', praise: 'Đúng! ngOnChanges chạy mỗi lần input đổi, ngOnInit chỉ chạy một lần.' },
    { id: 'lc-reborn', title: 'Huỷ component rồi tạo lại: để ý constructor chạy lại từ đầu.', hint: 'Sau khi Huỷ, bấm Tạo một lần nữa.', praise: 'Chuẩn! Tạo lại là một instance hoàn toàn mới, state cũ mất hết.' },
  ],
  pitfalls: [
    {
      title: 'Đọc input trong constructor',
      explain: 'Lúc constructor chạy, Angular chưa gán input. Đọc input trong ngOnInit, hoặc dùng computed() dựa trên input signal.',
      wrong: { lang: 'typescript', code: `constructor() {\n  console.log(this.name()); // lỗi: input chưa có giá trị\n}` },
      right: { lang: 'typescript', code: `greeting = computed(() => 'Xin chào ' + this.name());\n// hoặc đọc trong ngOnInit()` },
    },
    {
      title: 'Quên dọn dẹp khi component bị huỷ',
      explain: 'setInterval, subscription hay event listener không dọn sẽ tiếp tục chạy sau khi component biến mất (rò rỉ bộ nhớ). Dọn trong ngOnDestroy hoặc DestroyRef.',
      wrong: { lang: 'typescript', code: `ngOnInit() {\n  setInterval(() => this.tick(), 1000);\n}` },
      right: { lang: 'typescript', code: `constructor() {\n  const id = setInterval(() => this.tick(), 1000);\n  inject(DestroyRef).onDestroy(() => clearInterval(id));\n}` },
    },
    {
      title: 'Đụng vào DOM trước khi view được vẽ',
      explain: 'Trong ngOnInit, phần tử con (viewChild) chưa sẵn sàng. Dùng ngAfterViewInit hoặc afterNextRender khi cần đo kích thước hay focus.',
      wrong: { lang: 'typescript', code: `ngOnInit() {\n  this.input().nativeElement.focus(); // chưa có view\n}` },
      right: { lang: 'typescript', code: `constructor() {\n  afterNextRender(() => this.input().nativeElement.focus());\n}` },
    },
  ],
  quiz: [
    { question: 'Hook nào chạy TRƯỚC ngOnInit khi component có input được truyền vào?', options: ['ngOnDestroy', 'ngAfterViewInit', 'ngOnChanges', 'Không có hook nào'], correct: 2, explain: 'Thứ tự: constructor → ngOnChanges (lần đầu) → ngOnInit → … → ngAfterViewInit.' },
    { question: 'Input name đổi 3 lần trong đời component. ngOnInit chạy mấy lần?', options: ['1 lần', '3 lần', '4 lần', '0 lần'], correct: 0, explain: 'ngOnInit chỉ chạy một lần sau khi tạo. ngOnChanges mới chạy lại mỗi lần input đổi.' },
    { question: 'Nên huỷ setInterval ở đâu?', options: ['constructor', 'ngOnInit', 'ngOnDestroy hoặc DestroyRef.onDestroy', 'ngAfterViewInit'], correct: 2, explain: 'Khi component bị huỷ là lúc dọn dẹp tài nguyên đã mở.' },
  ],
  doneMessage: 'Bạn đã đi trọn hành trình một đời component!',
};
