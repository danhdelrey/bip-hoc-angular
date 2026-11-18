import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './pipes.samples';

export const PIPES: LessonContent = {
  slug: 'pipes',
  definition:
    'Pipe là hàm biến đổi giá trị để hiển thị ngay trong template, không làm thay đổi dữ liệu gốc.',
  analogy: {
    text: 'Ví dụ vẽ chuỗi pipe thành một dây chuyền nhà máy.',
    map: [
      ['Món hàng', 'giá trị đầu vào'],
      ['Cỗ máy', 'một pipe'],
      ['Thứ tự các máy', 'thứ tự pipe từ trái sang phải'],
      ['Sản phẩm cuối', 'giá trị hiển thị'],
    ],
  },
  intro:
    'Pipe biến đổi giá trị ngay trong template mà không đổi dữ liệu gốc: {{ value | date | uppercase }}. Các pipe nối nhau từ trái sang phải. Pipe mặc định là pure: chỉ chạy lại khi giá trị đầu vào đổi (đổi tham chiếu).',
  visualizer: {
    title: 'Dây chuyền nhà máy Pipe',
    hint: 'Kéo-thả máy từ Kho lên Dây chuyền (hoặc bấm nút +), sắp xếp thứ tự rồi bấm "Chạy dây chuyền". Thử xếp sai thứ tự để thấy máy báo lỗi.',
  },
  code: [
    { name: 'pipe-demo.ts', lang: 'angular-ts', code: SAMPLES['pipe-demo.ts'], anchors: { 1: 'machine-builtin', 9: 'machine-date', 10: 'machine-uppercase', 11: 'machine-stars' } },
    { name: 'stars.pipe.ts', lang: 'angular-ts', code: SAMPLES['stars.pipe.ts'], anchors: { 3: 'pure', 4: 'machine-stars', 5: 'machine-stars', 6: 'machine-stars', 7: 'machine-stars' } },
  ],
  liveNote: 'Component thật nối DatePipe → UpperCasePipe → SlicePipe → pipe tự viết StarsPipe.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { PipeDemo } from './app/pipe-demo';

bootstrapApplication(PipeDemo).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Pipe</title></head>\n<body><app-pipe-demo></app-pipe-demo></body>\n</html>\n`,
  },
  challenges: [
    { id: 'pp-order', title: 'Lắp dây chuyền ra được ngày tháng viết HOA, ví dụ "WEDNESDAY, NOVEMBER 18, 2026".', hint: 'Cần máy date trước, máy uppercase sau. date biến Date thành chuỗi, uppercase chỉ nhận chuỗi.', praise: 'Chuẩn! Thứ tự pipe quyết định kết quả.' },
    { id: 'pp-error', title: 'Cố tình làm một cỗ máy báo lỗi.', hint: 'Đặt uppercase hoặc slice TRƯỚC máy date: hai máy đó không nhận được kiểu Date.', praise: 'Bạn thấy rồi đó: mỗi pipe chỉ nhận đúng kiểu dữ liệu của nó (InvalidPipeArgument).' },
    { id: 'pp-pure', title: 'Ở khu "Pure vs Impure", push() vào mảng cũ và thấy pipe pure KHÔNG cập nhật.', hint: 'Bấm "todos.push(...) — mảng cũ". So sánh hai cột kết quả.', praise: 'Đúng! Pure pipe so tham chiếu: mảng cũ bị sửa ruột thì nó không biết.' },
  ],
  pitfalls: [
    {
      title: 'Xếp pipe sai thứ tự kiểu dữ liệu',
      explain: 'uppercase chỉ nhận chuỗi. Đưa Date vào sẽ lỗi InvalidPipeArgument. Hãy để pipe chuyển kiểu (date) đứng trước.',
      wrong: { lang: 'angular-html', code: `{{ today() | uppercase | date: 'fullDate' }}` },
      right: { lang: 'angular-html', code: `{{ today() | date: 'fullDate' | uppercase }}` },
    },
    {
      title: 'Sửa ruột mảng rồi mong pipe pure cập nhật',
      explain: 'Pipe pure chỉ chạy lại khi tham chiếu input đổi. push() giữ nguyên tham chiếu nên kết quả cũ vẫn hiển thị. Tạo mảng mới thay vì sửa.',
      wrong: { lang: 'typescript', code: `this.todos().push(newTodo); // {{ todos() | doneOnly }} không đổi` },
      right: { lang: 'typescript', code: `this.todos.update((list) => [...list, newTodo]);` },
    },
    {
      title: 'Đặt pure: false để "chữa" lỗi trên',
      explain: 'Impure pipe chạy lại ở MỌI lần change detection — rất tốn với danh sách lớn. Thường nên sửa dữ liệu cho bất biến, hoặc dùng computed().',
      wrong: { lang: 'angular-ts', code: `@Pipe({ name: 'doneOnly', pure: false })` },
      right: { lang: 'angular-ts', code: `doneTodos = computed(() => this.todos().filter((t) => t.done));` },
    },
  ],
  quiz: [
    { question: '{{ name | uppercase | slice: 0 : 3 }} với name = "angular" cho ra gì?', options: ['ang', 'ANG', 'ANGULAR', 'Lỗi'], correct: 1, explain: 'Chạy trái sang phải: uppercase → "ANGULAR", rồi slice(0, 3) → "ANG".' },
    { question: 'Pipe pure chạy lại khi nào?', options: ['Mỗi lần change detection', 'Khi giá trị đầu vào (hoặc tham số) đổi tham chiếu', 'Mỗi giây một lần', 'Chỉ một lần duy nhất'], correct: 1, explain: 'Pure pipe được memo theo input; input không đổi thì dùng lại kết quả cũ.' },
    { question: 'Muốn tự viết pipe định dạng tiền Việt, dùng decorator nào?', options: ['@Component', '@Directive', '@Pipe', '@Service'], correct: 2, explain: '@Pipe({ name: "vnd" }) + method transform(value) là đủ.' },
  ],
  doneMessage: 'Dây chuyền chạy êm ru! Bạn đã thành quản đốc nhà máy Pipe.',
};
