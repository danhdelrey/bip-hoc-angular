import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 13 — HttpClient. Mỗi bài tạo một ứng dụng riêng bằng bootstrapApplication(App, { providers })
 * như main.ts; HttpClient của lab nói chuyện với backend giả (không gọi mạng thật), mọi request hiện trong log.
 */
const API_TIP = `<div class="tip">Backend giả: <code>GET /api/users</code>, <code>GET /api/users/:id</code> (id 13 → 500), <code>GET /api/private</code> (cần header <code>Authorization: Bearer bip-token</code>), <code>GET /api/flaky</code> (lần đầu 500), <code>POST /api/todos</code>, <code>GET /api/todos</code>. Mọi request và response hiện trong log.</div>`;

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Viết ứng dụng gọi API như trong dự án thật: <code>bootstrapApplication(App, { providers: [provideHttpClient()] })</code>, rồi <code>inject(HttpClient)</code> trong component. Từ Angular 22, <code>HttpClient</code> đã có sẵn ở root (dùng fetch), nên <code>provideHttpClient()</code> chủ yếu để thêm cấu hình như <code>withInterceptors([...])</code>.</p>
${API_TIP}
<div class="tip">Có sẵn: <code>provideHttpClient</code>, <code>withInterceptors</code>, <code>HttpClient</code>, <code>HttpErrorResponse</code>, <code>HttpHeaders</code>, <code>HttpParams</code>, <code>httpResource</code>, <code>toSignal</code>, <code>rxResource</code> và mọi toán tử RxJS.</div>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <ul>
      @for (u of users(); track u.id) { <li>{{ u.name }}</li> }
    </ul>
  \`,
})
class App {
  private http = inject(HttpClient);
  users = toSignal(this.http.get('/api/users'), { initialValue: [] });
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
  },
  {
    id: 'catch-error', group: 'Xử lý lỗi', title: 'toSignal và lỗi HTTP: catchError', level: 'Dễ', lv: 1, waitMs: 900,
    desc: `<p>Khi request lỗi, Observable của HttpClient phát <code>error</code>. <code>toSignal()</code> không nuốt lỗi đó: lần đọc signal tiếp theo sẽ <b>ném lại lỗi</b>, làm hỏng cả template. Bắt lỗi ngay trong pipe bằng <code>catchError</code>, ghi lại trạng thái lỗi và trả về một giá trị thay thế bằng <code>of(...)</code>.</p>
<p><b>Yêu cầu:</b> <code>GET /api/users/13</code> trả 500. Trang không được có lỗi và phải hiện <code>&lt;p class="err"&gt;</code> có chữ <code>Không tải được</code>.</p>
${API_TIP}`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    @if (failed()) { <p class="err">Không tải được người dùng</p> }
    <p class="name">{{ user()?.name }}</p>
  \`,
})
class App {
  private http = inject(HttpClient);
  failed = signal(false);
  // ❗ request lỗi 500 → đọc user() sẽ ném lỗi
  user = toSignal(this.http.get('/api/users/13'));
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    @if (failed()) { <p class="err">Không tải được người dùng</p> }
    <p class="name">{{ user()?.name }}</p>
  \`,
})
class App {
  private http = inject(HttpClient);
  failed = signal(false);
  user = toSignal(
    this.http.get('/api/users/13').pipe(
      catchError(() => {
        this.failed.set(true);
        return of(null);
      }),
    ),
  );
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    hint: "Thêm .pipe(catchError(() => { this.failed.set(true); return of(null); })) sau this.http.get('/api/users/13').",
    explain: 'catchError nhận HttpErrorResponse, nên có thể xem err.status để báo khác nhau cho 401, 404, 500. Nếu cần cả isLoading/error có sẵn thì httpResource gọn hơn (bài sau).',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Lỗi HTTP chưa được bắt nên toSignal ném lại khi template đọc user().');
      const t = a.text('.err');
      return t.includes('Không tải được') ? OK() : NO('Trang cần hiện <p class="err"> có chữ "Không tải được".');
    },
  },
  {
    id: 'observable-lanh', group: 'Gọi API', title: 'http.get() chưa subscribe thì chưa gửi', level: 'Dễ', lv: 1, waitMs: 800,
    desc: `<p>Observable của <code>HttpClient</code> là <b>cold</b>: gọi <code>http.get()</code> chỉ tạo "công thức" request, chưa có gì được gửi. Request chỉ đi khi có ai <b>subscribe</b>, và mỗi lần subscribe là một request mới. Cách gọn nhất trong component là <code>toSignal()</code>: nó subscribe một lần và tự huỷ khi component bị huỷ.</p>
<p><b>Yêu cầu:</b> khi mở trang phải gửi đúng <b>một</b> request <code>GET /api/users</code> và hiện 3 người dùng.</p>
${API_TIP}`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <p>{{ users().length }} người dùng</p>
    <ul>
      @for (u of users(); track u.id) { <li class="user">{{ u.name }}</li> }
    </ul>
  \`,
})
class App {
  private http = inject(HttpClient);
  users = signal([]);

  constructor() {
    // ❗ chỉ tạo Observable, không ai subscribe nên request không bao giờ được gửi
    this.http.get('/api/users');
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <p>{{ users().length }} người dùng</p>
    <ul>
      @for (u of users(); track u.id) { <li class="user">{{ u.name }}</li> }
    </ul>
  \`,
})
class App {
  private http = inject(HttpClient);
  users = toSignal(this.http.get('/api/users'), { initialValue: [] });
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    hint: "Thay signal([]) + constructor bằng users = toSignal(this.http.get('/api/users'), { initialValue: [] }).",
    explain: 'Cũng có thể .subscribe(list => this.users.set(list)), nhưng khi đó phải tự lo huỷ (takeUntilDestroyed). Khi cần tải lại theo tham số, dùng httpResource hoặc rxResource (bài sau).',
    check(a) {
      const reqs = a.http('/api/users');
      if (!reqs.length) return NO('Không có request nào được gửi: http.get() mới chỉ tạo Observable, chưa có ai subscribe.');
      if (reqs.length > 1) return NO('Có ' + reqs.length + ' request GET /api/users: đang subscribe nhiều lần.');
      const n = a.query('.user').length;
      return n === 3 ? OK() : NO('Danh sách đang có ' + n + ' người, cần 3.');
    },
  },
  {
    id: 'interceptor', group: 'Interceptor', title: 'Interceptor gắn token cho mọi request', level: 'Trung bình', lv: 2, waitMs: 900,
    desc: `<p>Thay vì tự thêm header <code>Authorization</code> ở từng chỗ gọi API, viết một <b>interceptor</b>: hàm <code>(req, next) =&gt; next(req)</code> chạy với mọi request. <code>HttpRequest</code> là bất biến, nên muốn thêm header phải tạo bản sao: <code>req.clone({ setHeaders: { … } })</code>. Đăng ký bằng <code>provideHttpClient(withInterceptors([authInterceptor]))</code>.</p>
<p><b>Yêu cầu:</b> <code>GET /api/private</code> đang bị 401. Viết interceptor gắn <code>Authorization: Bearer bip-token</code> để trang hiện <code>Dữ liệu bí mật</code>.</p>
${API_TIP}`,
    starter: `// TODO: interceptor gắn header Authorization: Bearer bip-token
const authInterceptor = (req, next) => {
  return next(req);
};

@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="secret">{{ data.value().secret }}</p> }
    @if (data.error()) { <p class="err">Lỗi {{ data.error().status }}</p> }
  \`,
})
class App {
  data = httpResource(() => '/api/private');
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    solution: `const authInterceptor = (req, next) => {
  return next(req.clone({ setHeaders: { Authorization: 'Bearer bip-token' } }));
};

@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="secret">{{ data.value().secret }}</p> }
    @if (data.error()) { <p class="err">Lỗi {{ data.error().status }}</p> }
  \`,
})
class App {
  data = httpResource(() => '/api/private');
}

bootstrapApplication(App, { providers: [provideHttpClient(withInterceptors([authInterceptor]))] });
`,
    hint: "Trong interceptor: return next(req.clone({ setHeaders: { Authorization: 'Bearer bip-token' } })); rồi đổi provider thành provideHttpClient(withInterceptors([authInterceptor])).",
    explain: 'Token thật thường lấy từ một service: const token = inject(AuthService).token(); interceptor dạng hàm được chạy trong injection context nên gọi inject() được.',
    check(a) {
      const t = a.text('.secret');
      if (t === 'Dữ liệu bí mật') return OK();
      const last = a.http('/api/private').at(-1);
      if (last?.status === 'error') return NO('GET /api/private vẫn trả lỗi: request chưa có header Authorization đúng, hoặc interceptor chưa được đăng ký bằng withInterceptors([...]).');
      return NO('Trang chưa hiện "Dữ liệu bí mật".' + (a.errors.length ? ' Lỗi: ' + a.errMsg() : ''));
    },
  },
  {
    id: 'httpresource-loi', group: 'Gọi API', title: 'httpResource: xử lý trạng thái lỗi', level: 'Trung bình', lv: 2, waitMs: 1700,
    desc: `<p><code>httpResource(() =&gt; url)</code> tự gửi lại request mỗi khi signal trong hàm đổi, và cho sẵn <code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code>. Nhưng khi resource đang ở trạng thái lỗi, đọc <code>value()</code> sẽ <b>ném lỗi</b>. Vì vậy template phải kiểm tra <code>error()</code>/<code>hasValue()</code> trước khi đọc <code>value()</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>User 13</b> (API trả 500). Trang phải hiện <code>&lt;p class="err"&gt;</code> có chữ <code>Không tải được</code> và không có lỗi; bấm lại <b>User 2</b> thì hiện tên <code>User 2</code>.</p>
${API_TIP}`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <button (click)="id.set(2)">User 2</button>
    <button (click)="id.set(13)">User 13</button>
    @if (user.isLoading()) { <p>Đang tải…</p> }
    <!-- ❗ đọc value() khi resource đang lỗi sẽ ném lỗi -->
    <p class="name">{{ user.value()?.name }}</p>
  \`,
})
class App {
  id = signal(1);
  user = httpResource(() => '/api/users/' + this.id());
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <button (click)="id.set(2)">User 2</button>
    <button (click)="id.set(13)">User 13</button>
    @if (user.isLoading()) { <p>Đang tải…</p> }
    @if (user.error()) {
      <p class="err">Không tải được người dùng #{{ id() }}</p>
    } @else if (user.hasValue()) {
      <p class="name">{{ user.value().name }}</p>
    }
  \`,
})
class App {
  id = signal(1);
  user = httpResource(() => '/api/users/' + this.id());
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    hint: 'Bọc phần hiển thị: @if (user.error()) { <p class="err">Không tải được…</p> } @else if (user.hasValue()) { … user.value().name … }.',
    explain: 'Khi resource lỗi, hasValue() là false nên @else if (user.hasValue()) không bao giờ đọc value() lúc lỗi. Muốn giữ dữ liệu cũ trong lúc lỗi thì dùng defaultValue hoặc linkedSignal.',
    simulate(s) {
      s.at(500, () => s.click('User 13'));
      s.at(950, () => s.dom((r) => r.setAttribute('data-err', r.querySelector('.err')?.textContent?.trim() ?? '')));
      s.at(1000, () => s.click('User 2'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Template đang đọc value() khi resource ở trạng thái lỗi.');
      const err = a.root()?.getAttribute('data-err') ?? '';
      if (!err.includes('Không tải được')) return NO('Sau khi bấm User 13, trang cần hiện <p class="err"> có chữ "Không tải được".');
      const name = a.text('.name');
      return name === 'User 2' ? OK() : NO('Bấm User 2 xong, tên đang là "' + name + '", cần "User 2".');
    },
  },
  {
    id: 'post-hai-lan', group: 'Gửi dữ liệu', title: 'POST bị gửi hai lần', level: 'Trung bình', lv: 2, waitMs: 900,
    desc: `<p>Vì Observable của HttpClient là cold, mỗi <code>| async</code> trên cùng một Observable là một lần subscribe, tức là <b>một request riêng</b>. Với GET thì chỉ phí; với POST thì tạo trùng dữ liệu. Với lệnh ghi (POST/PUT/DELETE), hãy subscribe <b>đúng một lần</b> trong handler rồi lưu kết quả vào signal.</p>
<p><b>Yêu cầu:</b> bấm <b>Thêm</b> phải gửi đúng một <code>POST /api/todos</code>, rồi hiện <code>Đã lưu #101</code> và tiêu đề <code>Học HTTP</code>.</p>
${API_TIP}`,
    starter: `@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  template: \`
    <button (click)="add()">Thêm</button>
    @if (saved$ | async; as t) { <p class="saved">Đã lưu #{{ t.id }}</p> }
    <small class="title">{{ (saved$ | async)?.title }}</small>
  \`,
})
class App {
  private http = inject(HttpClient);
  saved$ = null;

  add() {
    this.saved$ = this.http.post('/api/todos', { title: 'Học HTTP' });
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm</button>
    @if (saved(); as t) {
      <p class="saved">Đã lưu #{{ t.id }}</p>
      <small class="title">{{ t.title }}</small>
    }
  \`,
})
class App {
  private http = inject(HttpClient);
  saved = signal(null);

  add() {
    this.http.post('/api/todos', { title: 'Học HTTP' }).subscribe((t) => this.saved.set(t));
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    hint: "Trong add(): this.http.post('/api/todos', { title: 'Học HTTP' }).subscribe(t => this.saved.set(t)); và template đọc saved() thay cho hai lần | async.",
    explain: 'HttpClient tự complete sau khi có response nên subscribe trong handler không bị rò rỉ. Nếu muốn chặn bấm liên tục, thêm signal saving và [disabled]="saving()", hoặc dùng exhaustMap.',
    simulate(s) { s.at(250, () => s.click('Thêm')); },
    check(a) {
      const posts = a.http('/api/todos').filter((h) => h.method === 'POST');
      if (!posts.length) return NO('Bấm Thêm nhưng không có POST /api/todos nào được gửi.');
      if (posts.length > 1) return NO('Bấm Thêm một lần mà có ' + posts.length + ' request POST: mỗi | async là một lần subscribe, tức một request.');
      const s = a.text('.saved');
      if (s !== 'Đã lưu #101') return NO('Trang đang hiện "' + s + '", cần "Đã lưu #101".');
      return a.text('.title') === 'Học HTTP' ? OK() : NO('Chưa hiện tiêu đề "Học HTTP".');
    },
  },
  {
    id: 'retry', group: 'Xử lý lỗi', title: 'Thử lại khi lỗi tạm thời: retry', level: 'Trung bình', lv: 2, waitMs: 1300,
    desc: `<p>Có những lỗi chỉ xảy ra một lần (mạng chập chờn, máy chủ quá tải). Toán tử <code>retry({ count, delay })</code> của RxJS subscribe lại, tức là gửi lại request, khi gặp lỗi. Chỉ nên retry với GET (an toàn khi gửi lại), và luôn giới hạn số lần.</p>
<p><b>Yêu cầu:</b> <code>GET /api/flaky</code> lỗi 500 ở lần đầu. Thêm retry (tối đa 2 lần, cách nhau 300ms) để trang hiện <code>Dữ liệu đã về</code>.</p>
${API_TIP}`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="msg">{{ data.value().message }}</p> }
    @if (data.error()) { <p class="err">Lỗi {{ data.error().status }}</p> }
  \`,
})
class App {
  private http = inject(HttpClient);
  data = rxResource({
    stream: () => this.http.get('/api/flaky'),
  });
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="msg">{{ data.value().message }}</p> }
    @if (data.error()) { <p class="err">Lỗi {{ data.error().status }}</p> }
  \`,
})
class App {
  private http = inject(HttpClient);
  data = rxResource({
    stream: () => this.http.get('/api/flaky').pipe(retry({ count: 2, delay: 300 })),
  });
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,
    hint: "this.http.get('/api/flaky').pipe(retry({ count: 2, delay: 300 })).",
    explain: 'Muốn áp cho mọi GET trong app thì đưa vào interceptor: next(req).pipe(retry(...)) khi req.method === "GET". Không retry POST: request có thể đã được xử lý xong, chỉ là response bị mất.',
    check(a, code) {
      const reqs = a.http('/api/flaky');
      if (a.text('.msg') === 'Dữ liệu đã về' && reqs.length === 2) return OK();
      if (reqs.length === 1) return NO('Chỉ có một request GET /api/flaky và nó lỗi 500: chưa có retry.');
      if (reqs.length > 3) return NO('Có ' + reqs.length + ' request: retry cần giới hạn số lần.');
      if (!/retry\s*\(/.test(code)) return NO('Hãy dùng toán tử retry().');
      return NO('Trang chưa hiện "Dữ liệu đã về".');
    },
  },
];

export const LAB: LabModule = {
  title: 'HttpClient',
  subtitle: 'bài luyện gọi API với backend giả (không gọi mạng thật): bắt lỗi với catchError, Observable lạnh, interceptor, httpResource khi lỗi, POST trùng, retry.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-http').then((m) => m.httpExtras()),
  cheatsheet: [
    ['Cấu hình HttpClient', '<code>provideHttpClient(withInterceptors([...]))</code> trong app.config.ts'],
    ['Bắt lỗi', '<code>.pipe(catchError(() =&gt; of(null)))</code> trước <code>toSignal</code>'],
    ['Gọi và hiển thị', '<code>toSignal(http.get(url), { initialValue: [] })</code>'],
    ['Tải lại theo tham số', '<code>httpResource(() =&gt; \'/api/users/\' + id())</code>'],
    ['Trạng thái resource', '<code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code> trước <code>value()</code>'],
    ['Gắn header cho mọi request', '<code>withInterceptors([fn])</code>, <code>req.clone({ setHeaders })</code>'],
    ['Ghi dữ liệu', 'subscribe <b>một lần</b> trong handler, lưu vào signal'],
    ['Lỗi tạm thời', '<code>retry({ count: 2, delay: 300 })</code>, chỉ với GET'],
  ],
};
