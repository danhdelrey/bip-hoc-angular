import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './rxjs.samples';

export const RXJS_SIGNAL_TABLE = [
  ['Bản chất', 'Một GIÁ TRỊ hiện tại, luôn đọc được', 'Một DÒNG sự kiện theo thời gian'],
  ['Đọc giá trị', 'count() bất cứ lúc nào', 'subscribe() rồi chờ giá trị tới'],
  ['Thời gian', 'Không quan tâm thời gian', 'debounce, delay, throttle… rất mạnh'],
  ['Huỷ / dọn dẹp', 'Tự động', 'Phải unsubscribe (hoặc toSignal / takeUntilDestroyed)'],
  ['Hợp với', 'State giao diện, giá trị dẫn xuất', 'Sự kiện, HTTP, WebSocket, gõ phím…'],
];

export const RXJS_INTEROP = `import { toObservable, toSignal } from '@angular/core/rxjs-interop';

// Observable → Signal: tự subscribe, tự huỷ khi component bị huỷ
results = toSignal(this.results$, { initialValue: [] });

// Signal → Observable: để dùng được các operator theo thời gian
query = signal('');
query$ = toObservable(this.query).pipe(debounceTime(300));`;

export const RXJS: LessonContent = {
  slug: 'rxjs',
  metaphor:
    'Observable là một băng chuyền: các viên bi (giá trị) trôi tới theo thời gian. Operator là những cỗ máy đặt trên băng: máy đổi màu bi (map), máy lọc bi (filter), máy chờ yên lặng (debounceTime), máy bỏ việc cũ làm việc mới (switchMap).',
  intro:
    'RxJS mô tả các sự kiện xảy ra theo thời gian. Bạn nối operator bằng pipe() để biến đổi dòng bi, rồi subscribe (hoặc toSignal) để nhận kết quả. Với Angular hiện đại: signal cho state, RxJS cho những gì phụ thuộc thời gian.',
  visualizer: {
    title: 'Băng chuyền marble',
    hint: 'Bấm "Thả bi" để thả giá trị vào stream nguồn khi đồng hồ đang chạy. Đổi operator để xem cùng dòng bi nguồn cho ra kết quả khác nhau. ▶ ⏸ ⏭ điều khiển thời gian.',
  },
  code: [
    { name: 'fruit-search.ts', lang: 'angular-ts', code: SAMPLES['fruit-search.ts'], anchors: { 4: 'operators', 8: 'switchMap', 9: 'switchMap', 10: 'switchMap', 15: 'source', 29: 'source', 31: 'source', 32: 'debounceTime', 33: 'map', 34: 'filter', 37: 'toSignal', 38: 'switchMap' } },
  ],
  liveNote: 'Ô tìm kiếm thật: debounceTime chờ bạn ngừng gõ 400ms, switchMap huỷ lần tìm cũ khi có từ khoá mới, toSignal đưa kết quả vào template.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { FruitSearch } from './app/fruit-search';

bootstrapApplication(FruitSearch).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>RxJS</title></head>\n<body><app-fruit-search></app-fruit-search></body>\n</html>\n`,
  },
  challenges: [
    { id: 'rx-filter', title: 'Chọn filter rồi thả một viên bi LẺ: xem nó bị chặn lại.', hint: 'Bi được đánh số tăng dần 1, 2, 3… Bi số lẻ sẽ không qua được filter(x => x % 2 === 0).', praise: 'Chuẩn! filter chỉ cho bi thoả điều kiện đi tiếp.' },
    { id: 'rx-debounce', title: 'Chọn debounceTime và thả 3 bi thật nhanh: chỉ bi cuối cùng ra khỏi máy.', hint: 'Bấm "Thả bi" 3 lần liền trong vòng 1 giây.', praise: 'Đúng! debounceTime chờ 1 giây yên lặng rồi mới cho bi mới nhất đi qua.' },
    { id: 'rx-switch', title: 'Chọn switchMap và làm một request bị huỷ giữa chừng.', hint: 'Mỗi bi tạo một request mất 1.5 giây. Thả bi thứ hai trước khi request đầu trả về.', praise: 'Tuyệt! switchMap huỷ request cũ khi có giá trị mới — hoàn hảo cho ô tìm kiếm.' },
  ],
  pitfalls: [
    {
      title: 'subscribe() mà không bao giờ huỷ',
      explain: 'Subscription sống tiếp sau khi component bị huỷ, gây rò rỉ bộ nhớ và chạy logic thừa. Dùng toSignal() hoặc takeUntilDestroyed().',
      wrong: { lang: 'typescript', code: `ngOnInit() {\n  interval(1000).subscribe((n) => (this.n = n));\n}` },
      right: { lang: 'typescript', code: `n = toSignal(interval(1000), { initialValue: 0 });` },
    },
    {
      title: 'subscribe lồng trong subscribe',
      explain: 'Lồng subscribe khó huỷ và dễ trả kết quả sai thứ tự. Dùng operator ghép như switchMap, concatMap, mergeMap.',
      wrong: { lang: 'typescript', code: `this.query$.subscribe((q) => {\n  this.api.search(q).subscribe((r) => (this.results = r));\n});` },
      right: { lang: 'typescript', code: `results = toSignal(\n  this.query$.pipe(switchMap((q) => this.api.search(q))),\n);` },
    },
    {
      title: 'Dùng RxJS cho state đơn giản',
      explain: 'BehaviorSubject chỉ để giữ một giá trị và đọc lại thì signal gọn hơn nhiều. Để RxJS cho những gì phụ thuộc thời gian.',
      wrong: { lang: 'typescript', code: `count$ = new BehaviorSubject(0);\ninc() { this.count$.next(this.count$.value + 1); }` },
      right: { lang: 'typescript', code: `count = signal(0);\ninc() { this.count.update((c) => c + 1); }` },
    },
  ],
  quiz: [
    { question: 'Ô tìm kiếm: người dùng gõ "a", "an", "ang" nhanh. Operator nào chỉ gọi API với "ang"?', options: ['map', 'filter', 'debounceTime', 'delay'], correct: 2, explain: 'debounceTime đợi người dùng ngừng gõ một khoảng rồi mới cho giá trị mới nhất đi tiếp.' },
    { question: 'Request cho "an" chưa xong thì có từ khoá "ang". switchMap sẽ…', options: ['Đợi "an" xong rồi mới gọi "ang"', 'Huỷ "an", chỉ lấy kết quả "ang"', 'Gọi cả hai, trả cả hai', 'Báo lỗi'], correct: 1, explain: 'switchMap "chuyển" sang inner observable mới và huỷ cái cũ.' },
    { question: 'Cách gọn nhất để hiển thị kết quả một Observable trong template Angular hiện đại?', options: ['subscribe trong constructor rồi gán biến', 'toSignal(obs$)', 'setInterval kiểm tra', 'Dùng Promise.all'], correct: 1, explain: 'toSignal tự subscribe, tự huỷ theo vòng đời component và trả về signal đọc được trong template.' },
  ],
  doneMessage: 'Băng chuyền marble đã chạy theo ý bạn!',
};
