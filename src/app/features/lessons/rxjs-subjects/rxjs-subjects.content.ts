import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './rxjs-subjects.samples';

export const SUBJECT_PATTERNS = `@Service()
export class NotificationService {
  // Subject để private: chỉ service được next()
  private readonly messages = new Subject<string>();
  readonly messages$ = this.messages.asObservable(); // bên ngoài chỉ subscribe được

  notify(text: string) {
    this.messages.next(text);
  }
}

@Service()
export class UserService {
  private readonly http = inject(HttpClient);
  // Cold → hot: mọi subscriber dùng chung 1 request, người đến sau nhận bản cache
  readonly me$ = this.http.get<User>('/api/me').pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}`;

export const RXJS_SUBJECTS: LessonContent = {
  slug: 'rxjs-subjects',
  definition:
    'Subject là một Observable đồng thời là Observer: có thể chủ động đẩy giá trị bằng next() và phát cùng một giá trị cho nhiều subscriber (multicast).',
  analogy: {
    text: 'Ví dụ vẽ mỗi Subject như một đài phát thanh, mỗi subscriber là một thính giả mở radio ở một thời điểm khác nhau.',
    map: [
      ['Đài phát', 'Subject'],
      ['Phát một bản tin', 'next(value)'],
      ['Thính giả mở radio', 'subscribe()'],
      ['Bản ghi phát lại cho người mới', 'giá trị được replay'],
      ['Đài ngừng phát sóng', 'complete()'],
    ],
  },
  intro:
    'Observable thường là cold: mỗi lần subscribe lại chạy lại từ đầu (gọi HTTP lần nữa). Subject là hot: chỉ có một nguồn, mọi subscriber nhận chung. Bốn loại khác nhau ở việc subscriber đến muộn nhận được gì: Subject không nhận gì của quá khứ, BehaviorSubject nhận ngay giá trị hiện tại (cần giá trị khởi tạo), ReplaySubject(n) nhận lại n giá trị gần nhất, AsyncSubject chỉ phát giá trị cuối cùng khi complete. Muốn biến một Observable cold thành hot mà không tự tạo Subject, dùng share() hoặc shareReplay().',
  visualizer: {
    title: 'Đài phát và thính giả đến muộn',
    hint: 'Chế độ "4 loại Subject": chọn loại rồi chạy kịch bản: phát 1, 2 → Sub A vào → phát 3 → Sub B vào → phát 4 → complete → Sub C vào. Bi viền đứt là giá trị được phát lại khi đăng ký. Chế độ "Cold / Hot": xem hai subscriber gọi cùng một HTTP Observable tạo ra bao nhiêu request.',
  },
  code: [
    { name: 'subject-lab.ts', lang: 'angular-ts', code: SAMPLES['subject-lab.ts'], anchors: { 8: 'subject', 9: 'behavior', 10: 'replay', 11: 'async', 44: 'next', 51: 'subscribe', 52: 'subscribe', 53: 'complete', 60: 'complete' } },
    { name: 'patterns.ts', lang: 'typescript', code: SUBJECT_PATTERNS, anchors: { 4: 'subject', 5: 'asObservable', 8: 'next', 16: 'shareReplay', 17: 'shareReplay' } },
  ],
  liveNote: 'Subject thật từ RxJS. Đổi loại Subject, bấm next vài lần rồi mới thêm subscriber để thấy subscriber đến muộn nhận được gì. Dấu | là thông báo complete.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { SubjectLab } from './app/subject-lab';\n\nbootstrapApplication(SubjectLab).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Subject</title></head>\n<body><app-subject-lab></app-subject-lab></body>\n</html>\n`,
  },
  challenges: [
    { id: 'sj-behavior', title: 'Cho Sub B (vào sau khi đã phát 3) nhận ngay giá trị 3 lúc vừa đăng ký.', hint: 'Loại Subject nào luôn giữ một giá trị hiện tại?', praise: 'Đúng! BehaviorSubject phát ngay giá trị hiện tại cho subscriber mới.' },
    { id: 'sj-replay', title: 'Cho Sub C (vào SAU khi đã complete) vẫn nhận được 2 giá trị cuối.', hint: 'Chỉ một loại vẫn phát lại dữ liệu cũ sau complete.', praise: 'Chuẩn! ReplaySubject giữ bộ đệm kể cả khi đã complete.' },
    { id: 'sj-share', title: 'Hai subscriber cùng dùng getUser() nhưng chỉ tạo đúng 1 request, kể cả khi B đăng ký sau khi request đã xong.', hint: 'share() chỉ chia sẻ khi request còn đang chạy. Cần thứ gì giữ lại kết quả.', praise: 'Hay! shareReplay(1) chia sẻ request và cache kết quả cho người đến sau.' },
  ],
  pitfalls: [
    {
      title: 'Để Subject public',
      explain: 'Ai cũng gọi được next() hoặc complete() từ bên ngoài, luồng dữ liệu khó kiểm soát. Giữ Subject private và chỉ lộ ra Observable.',
      wrong: { lang: 'typescript', code: `readonly cart$ = new BehaviorSubject<Item[]>([]);\n// component khác: service.cart$.next([]) 😱` },
      right: { lang: 'typescript', code: `private readonly cart = new BehaviorSubject<Item[]>([]);\nreadonly cart$ = this.cart.asObservable();` },
    },
    {
      title: 'Nhiều async pipe trên một HTTP Observable cold',
      explain: 'Mỗi lần subscribe là một request mới. Ba chỗ dùng | async là ba request. Chia sẻ bằng shareReplay hoặc chuyển sang signal một lần bằng toSignal().',
      wrong: { lang: 'angular-html', code: `<h1>{{ (user$ | async)?.name }}</h1>\n<img [src]="(user$ | async)?.avatar" />  <!-- 2 request -->` },
      right: { lang: 'typescript', code: `user = toSignal(this.http.get<User>('/api/me'));\n// template: {{ user()?.name }} … [src]="user()?.avatar"` },
    },
    {
      title: 'shareReplay không có refCount',
      explain: 'shareReplay(1) mặc định giữ subscription tới nguồn mãi mãi, kể cả khi không còn ai subscribe. Với nguồn không tự complete (interval, websocket) đó là rò rỉ bộ nhớ.',
      wrong: { lang: 'typescript', code: `ticks$ = interval(1000).pipe(shareReplay(1));` },
      right: { lang: 'typescript', code: `ticks$ = interval(1000).pipe(shareReplay({ bufferSize: 1, refCount: true }));` },
    },
  ],
  quiz: [
    { question: 'BehaviorSubject(0) đã next(1), next(2), next(3). Subscriber mới nhận ngay giá trị nào?', options: ['0', '1, 2, 3', '3', 'Không nhận gì'], correct: 2, explain: 'BehaviorSubject phát ngay giá trị hiện tại (giá trị gần nhất) cho subscriber mới.' },
    { question: 'ReplaySubject(2) đã next(1) tới next(4) rồi complete(). Subscriber mới nhận gì?', options: ['Không nhận gì', '3, 4 rồi complete', '4', '1, 2, 3, 4'], correct: 1, explain: 'ReplaySubject phát lại n giá trị gần nhất, kể cả sau khi đã complete.' },
    { question: 'Hai component cùng subscribe http.get(\'/api/me\') (không share). Có bao nhiêu request?', options: ['1', '2', '0 cho tới khi gọi next()', 'Tuỳ trình duyệt'], correct: 1, explain: 'HttpClient trả về Observable cold: mỗi subscribe chạy lại request.' },
  ],
  doneMessage: 'Bạn đã phân biệt được Subject, BehaviorSubject, ReplaySubject, AsyncSubject và cold/hot Observable!',
};
