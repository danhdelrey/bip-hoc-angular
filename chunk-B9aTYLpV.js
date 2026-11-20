import{a as s,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var n=`<div class="tip">Backend giả: <code>GET /api/users</code>, <code>GET /api/users/:id</code> (id 13 → 500), <code>GET /api/private</code> (cần header <code>Authorization: Bearer bip-token</code>), <code>GET /api/flaky</code> (lần đầu 500), <code>POST /api/todos</code>, <code>GET /api/todos</code>. Mọi request và response hiện trong log.</div>`;var p={title:`HttpClient`,subtitle:`bài luyện gọi API với backend giả (không gọi mạng thật): bắt lỗi với catchError, Observable lạnh, interceptor, httpResource khi lỗi, POST trùng, retry.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Vi\u1EBFt \u1EE9ng d\u1EE5ng g\u1ECDi API nh\u01B0 trong d\u1EF1 \xE1n th\u1EADt: <code>bootstrapApplication(App, { providers: [provideHttpClient()] })</code>, r\u1ED3i <code>inject(HttpClient)</code> trong component. T\u1EEB Angular 22, <code>HttpClient</code> \u0111\xE3 c\xF3 s\u1EB5n \u1EDF root (d\xF9ng fetch), n\xEAn <code>provideHttpClient()</code> ch\u1EE7 y\u1EBFu \u0111\u1EC3 th\xEAm c\u1EA5u h\xECnh nh\u01B0 <code>withInterceptors([...])</code>.</p>
${n}
<div class="tip">C\xF3 s\u1EB5n: <code>provideHttpClient</code>, <code>withInterceptors</code>, <code>HttpClient</code>, <code>HttpErrorResponse</code>, <code>HttpHeaders</code>, <code>HttpParams</code>, <code>httpResource</code>, <code>toSignal</code>, <code>rxResource</code> v\xE0 m\u1ECDi to\xE1n t\u1EED RxJS.</div>`,starter:`@Component({
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
`},{id:`catch-error`,group:`Xử lý lỗi`,title:`toSignal và lỗi HTTP: catchError`,level:`Dễ`,lv:1,waitMs:900,desc:`<p>Khi request l\u1ED7i, Observable c\u1EE7a HttpClient ph\xE1t <code>error</code>. <code>toSignal()</code> kh\xF4ng nu\u1ED1t l\u1ED7i \u0111\xF3: l\u1EA7n \u0111\u1ECDc signal ti\u1EBFp theo s\u1EBD <b>n\xE9m l\u1EA1i l\u1ED7i</b>, l\xE0m h\u1ECFng c\u1EA3 template. B\u1EAFt l\u1ED7i ngay trong pipe b\u1EB1ng <code>catchError</code>, ghi l\u1EA1i tr\u1EA1ng th\xE1i l\u1ED7i v\xE0 tr\u1EA3 v\u1EC1 m\u1ED9t gi\xE1 tr\u1ECB thay th\u1EBF b\u1EB1ng <code>of(...)</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> <code>GET /api/users/13</code> tr\u1EA3 500. Trang kh\xF4ng \u0111\u01B0\u1EE3c c\xF3 l\u1ED7i v\xE0 ph\u1EA3i hi\u1EC7n <code>&lt;p class="err"&gt;</code> c\xF3 ch\u1EEF <code>Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c</code>.</p>
${n}`,starter:`@Component({
  selector: 'app-root',
  template: \`
    @if (failed()) { <p class="err">Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c ng\u01B0\u1EDDi d\xF9ng</p> }
    <p class="name">{{ user()?.name }}</p>
  \`,
})
class App {
  private http = inject(HttpClient);
  failed = signal(false);
  // \u2757 request l\u1ED7i 500 \u2192 \u0111\u1ECDc user() s\u1EBD n\xE9m l\u1ED7i
  user = toSignal(this.http.get('/api/users/13'));
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    @if (failed()) { <p class="err">Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c ng\u01B0\u1EDDi d\xF9ng</p> }
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
`,hint:`Thêm .pipe(catchError(() => { this.failed.set(true); return of(null); })) sau this.http.get('/api/users/13').`,explain:`catchError nhận HttpErrorResponse, nên có thể xem err.status để báo khác nhau cho 401, 404, 500. Nếu cần cả isLoading/error có sẵn thì httpResource gọn hơn (bài sau).`,check(t){return t.errors.length?s(`Có lỗi: `+t.errMsg()+`. Lỗi HTTP chưa được bắt nên toSignal ném lại khi template đọc user().`):t.text(`.err`).includes(`Không tải được`)?i():s(`Trang cần hiện <p class="err"> có chữ "Không tải được".`)}},{id:`observable-lanh`,group:`Gọi API`,title:`http.get() chưa subscribe thì chưa gửi`,level:`Dễ`,lv:1,waitMs:800,desc:`<p>Observable c\u1EE7a <code>HttpClient</code> l\xE0 <b>cold</b>: g\u1ECDi <code>http.get()</code> ch\u1EC9 t\u1EA1o "c\xF4ng th\u1EE9c" request, ch\u01B0a c\xF3 g\xEC \u0111\u01B0\u1EE3c g\u1EEDi. Request ch\u1EC9 \u0111i khi c\xF3 ai <b>subscribe</b>, v\xE0 m\u1ED7i l\u1EA7n subscribe l\xE0 m\u1ED9t request m\u1EDBi. C\xE1ch g\u1ECDn nh\u1EA5t trong component l\xE0 <code>toSignal()</code>: n\xF3 subscribe m\u1ED9t l\u1EA7n v\xE0 t\u1EF1 hu\u1EF7 khi component b\u1ECB hu\u1EF7.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi m\u1EDF trang ph\u1EA3i g\u1EEDi \u0111\xFAng <b>m\u1ED9t</b> request <code>GET /api/users</code> v\xE0 hi\u1EC7n 3 ng\u01B0\u1EDDi d\xF9ng.</p>
${n}`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <p>{{ users().length }} ng\u01B0\u1EDDi d\xF9ng</p>
    <ul>
      @for (u of users(); track u.id) { <li class="user">{{ u.name }}</li> }
    </ul>
  \`,
})
class App {
  private http = inject(HttpClient);
  users = signal([]);

  constructor() {
    // \u2757 ch\u1EC9 t\u1EA1o Observable, kh\xF4ng ai subscribe n\xEAn request kh\xF4ng bao gi\u1EDD \u0111\u01B0\u1EE3c g\u1EEDi
    this.http.get('/api/users');
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <p>{{ users().length }} ng\u01B0\u1EDDi d\xF9ng</p>
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
`,hint:`Thay signal([]) + constructor bằng users = toSignal(this.http.get('/api/users'), { initialValue: [] }).`,explain:`Cũng có thể .subscribe(list => this.users.set(list)), nhưng khi đó phải tự lo huỷ (takeUntilDestroyed). Khi cần tải lại theo tham số, dùng httpResource hoặc rxResource (bài sau).`,check(t){let r=t.http(`/api/users`);if(!r.length)return s(`Không có request nào được gửi: http.get() mới chỉ tạo Observable, chưa có ai subscribe.`);if(r.length>1)return s(`Có `+r.length+` request GET /api/users: đang subscribe nhiều lần.`);let i$1=t.query(`.user`).length;return i$1===3?i():s(`Danh sách đang có `+i$1+` người, cần 3.`)}},{id:`interceptor`,group:`Interceptor`,title:`Interceptor gắn token cho mọi request`,level:`Trung bình`,lv:2,waitMs:900,desc:`<p>Thay v\xEC t\u1EF1 th\xEAm header <code>Authorization</code> \u1EDF t\u1EEBng ch\u1ED7 g\u1ECDi API, vi\u1EBFt m\u1ED9t <b>interceptor</b>: h\xE0m <code>(req, next) =&gt; next(req)</code> ch\u1EA1y v\u1EDBi m\u1ECDi request. <code>HttpRequest</code> l\xE0 b\u1EA5t bi\u1EBFn, n\xEAn mu\u1ED1n th\xEAm header ph\u1EA3i t\u1EA1o b\u1EA3n sao: <code>req.clone({ setHeaders: { \u2026 } })</code>. \u0110\u0103ng k\xFD b\u1EB1ng <code>provideHttpClient(withInterceptors([authInterceptor]))</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> <code>GET /api/private</code> \u0111ang b\u1ECB 401. Vi\u1EBFt interceptor g\u1EAFn <code>Authorization: Bearer bip-token</code> \u0111\u1EC3 trang hi\u1EC7n <code>D\u1EEF li\u1EC7u b\xED m\u1EADt</code>.</p>
${n}`,starter:`// TODO: interceptor g\u1EAFn header Authorization: Bearer bip-token
const authInterceptor = (req, next) => {
  return next(req);
};

@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="secret">{{ data.value().secret }}</p> }
    @if (data.error()) { <p class="err">L\u1ED7i {{ data.error().status }}</p> }
  \`,
})
class App {
  data = httpResource(() => '/api/private');
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,solution:`const authInterceptor = (req, next) => {
  return next(req.clone({ setHeaders: { Authorization: 'Bearer bip-token' } }));
};

@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="secret">{{ data.value().secret }}</p> }
    @if (data.error()) { <p class="err">L\u1ED7i {{ data.error().status }}</p> }
  \`,
})
class App {
  data = httpResource(() => '/api/private');
}

bootstrapApplication(App, { providers: [provideHttpClient(withInterceptors([authInterceptor]))] });
`,hint:`Trong interceptor: return next(req.clone({ setHeaders: { Authorization: 'Bearer bip-token' } })); rồi đổi provider thành provideHttpClient(withInterceptors([authInterceptor])).`,explain:`Token thật thường lấy từ một service: const token = inject(AuthService).token(); interceptor dạng hàm được chạy trong injection context nên gọi inject() được.`,check(t){return t.text(`.secret`)===`Dữ liệu bí mật`?i():t.http(`/api/private`).at(-1)?.status===`error`?s(`GET /api/private vẫn trả lỗi: request chưa có header Authorization đúng, hoặc interceptor chưa được đăng ký bằng withInterceptors([...]).`):s(`Trang chưa hiện "Dữ liệu bí mật".`+(t.errors.length?` Lỗi: `+t.errMsg():``))}},{id:`httpresource-loi`,group:`Gọi API`,title:`httpResource: xử lý trạng thái lỗi`,level:`Trung bình`,lv:2,waitMs:1700,desc:`<p><code>httpResource(() =&gt; url)</code> t\u1EF1 g\u1EEDi l\u1EA1i request m\u1ED7i khi signal trong h\xE0m \u0111\u1ED5i, v\xE0 cho s\u1EB5n <code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code>. Nh\u01B0ng khi resource \u0111ang \u1EDF tr\u1EA1ng th\xE1i l\u1ED7i, \u0111\u1ECDc <code>value()</code> s\u1EBD <b>n\xE9m l\u1ED7i</b>. V\xEC v\u1EADy template ph\u1EA3i ki\u1EC3m tra <code>error()</code>/<code>hasValue()</code> tr\u01B0\u1EDBc khi \u0111\u1ECDc <code>value()</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>User 13</b> (API tr\u1EA3 500). Trang ph\u1EA3i hi\u1EC7n <code>&lt;p class="err"&gt;</code> c\xF3 ch\u1EEF <code>Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c</code> v\xE0 kh\xF4ng c\xF3 l\u1ED7i; b\u1EA5m l\u1EA1i <b>User 2</b> th\xEC hi\u1EC7n t\xEAn <code>User 2</code>.</p>
${n}`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <button (click)="id.set(2)">User 2</button>
    <button (click)="id.set(13)">User 13</button>
    @if (user.isLoading()) { <p>\u0110ang t\u1EA3i\u2026</p> }
    <!-- \u2757 \u0111\u1ECDc value() khi resource \u0111ang l\u1ED7i s\u1EBD n\xE9m l\u1ED7i -->
    <p class="name">{{ user.value()?.name }}</p>
  \`,
})
class App {
  id = signal(1);
  user = httpResource(() => '/api/users/' + this.id());
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <button (click)="id.set(2)">User 2</button>
    <button (click)="id.set(13)">User 13</button>
    @if (user.isLoading()) { <p>\u0110ang t\u1EA3i\u2026</p> }
    @if (user.error()) {
      <p class="err">Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c ng\u01B0\u1EDDi d\xF9ng #{{ id() }}</p>
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
`,hint:`Bọc phần hiển thị: @if (user.error()) { <p class="err">Không tải được…</p> } @else if (user.hasValue()) { … user.value().name … }.`,explain:`Khi resource lỗi, hasValue() là false nên @else if (user.hasValue()) không bao giờ đọc value() lúc lỗi. Muốn giữ dữ liệu cũ trong lúc lỗi thì dùng defaultValue hoặc linkedSignal.`,simulate(t){t.at(500,()=>t.click(`User 13`)),t.at(950,()=>t.dom(r=>r.setAttribute(`data-err`,r.querySelector(`.err`)?.textContent?.trim()??``))),t.at(1e3,()=>t.click(`User 2`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. Template đang đọc value() khi resource ở trạng thái lỗi.`);if(!(t.root()?.getAttribute(`data-err`)??``).includes(`Không tải được`))return s(`Sau khi bấm User 13, trang cần hiện <p class="err"> có chữ "Không tải được".`);let i$2=t.text(`.name`);return i$2===`User 2`?i():s(`Bấm User 2 xong, tên đang là "`+i$2+`", cần "User 2".`)}},{id:`post-hai-lan`,group:`Gửi dữ liệu`,title:`POST bị gửi hai lần`,level:`Trung bình`,lv:2,waitMs:900,desc:`<p>V\xEC Observable c\u1EE7a HttpClient l\xE0 cold, m\u1ED7i <code>| async</code> tr\xEAn c\xF9ng m\u1ED9t Observable l\xE0 m\u1ED9t l\u1EA7n subscribe, t\u1EE9c l\xE0 <b>m\u1ED9t request ri\xEAng</b>. V\u1EDBi GET th\xEC ch\u1EC9 ph\xED; v\u1EDBi POST th\xEC t\u1EA1o tr\xF9ng d\u1EEF li\u1EC7u. V\u1EDBi l\u1EC7nh ghi (POST/PUT/DELETE), h\xE3y subscribe <b>\u0111\xFAng m\u1ED9t l\u1EA7n</b> trong handler r\u1ED3i l\u01B0u k\u1EBFt qu\u1EA3 v\xE0o signal.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>Th\xEAm</b> ph\u1EA3i g\u1EEDi \u0111\xFAng m\u1ED9t <code>POST /api/todos</code>, r\u1ED3i hi\u1EC7n <code>\u0110\xE3 l\u01B0u #101</code> v\xE0 ti\xEAu \u0111\u1EC1 <code>H\u1ECDc HTTP</code>.</p>
${n}`,starter:`@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  template: \`
    <button (click)="add()">Th\xEAm</button>
    @if (saved$ | async; as t) { <p class="saved">\u0110\xE3 l\u01B0u #{{ t.id }}</p> }
    <small class="title">{{ (saved$ | async)?.title }}</small>
  \`,
})
class App {
  private http = inject(HttpClient);
  saved$ = null;

  add() {
    this.saved$ = this.http.post('/api/todos', { title: 'H\u1ECDc HTTP' });
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm</button>
    @if (saved(); as t) {
      <p class="saved">\u0110\xE3 l\u01B0u #{{ t.id }}</p>
      <small class="title">{{ t.title }}</small>
    }
  \`,
})
class App {
  private http = inject(HttpClient);
  saved = signal(null);

  add() {
    this.http.post('/api/todos', { title: 'H\u1ECDc HTTP' }).subscribe((t) => this.saved.set(t));
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,hint:`Trong add(): this.http.post('/api/todos', { title: 'Học HTTP' }).subscribe(t => this.saved.set(t)); và template đọc saved() thay cho hai lần | async.`,explain:`HttpClient tự complete sau khi có response nên subscribe trong handler không bị rò rỉ. Nếu muốn chặn bấm liên tục, thêm signal saving và [disabled]="saving()", hoặc dùng exhaustMap.`,simulate(t){t.at(250,()=>t.click(`Thêm`))},check(t){let r=t.http(`/api/todos`).filter(s=>s.method===`POST`);if(!r.length)return s(`Bấm Thêm nhưng không có POST /api/todos nào được gửi.`);if(r.length>1)return s(`Bấm Thêm một lần mà có `+r.length+` request POST: mỗi | async là một lần subscribe, tức một request.`);let i$3=t.text(`.saved`);return i$3!==`Đã lưu #101`?s(`Trang đang hiện "`+i$3+`", cần "Đã lưu #101".`):t.text(`.title`)===`Học HTTP`?i():s(`Chưa hiện tiêu đề "Học HTTP".`)}},{id:`retry`,group:`Xử lý lỗi`,title:`Thử lại khi lỗi tạm thời: retry`,level:`Trung bình`,lv:2,waitMs:1300,desc:`<p>C\xF3 nh\u1EEFng l\u1ED7i ch\u1EC9 x\u1EA3y ra m\u1ED9t l\u1EA7n (m\u1EA1ng ch\u1EADp ch\u1EDDn, m\xE1y ch\u1EE7 qu\xE1 t\u1EA3i). To\xE1n t\u1EED <code>retry({ count, delay })</code> c\u1EE7a RxJS subscribe l\u1EA1i, t\u1EE9c l\xE0 g\u1EEDi l\u1EA1i request, khi g\u1EB7p l\u1ED7i. Ch\u1EC9 n\xEAn retry v\u1EDBi GET (an to\xE0n khi g\u1EEDi l\u1EA1i), v\xE0 lu\xF4n gi\u1EDBi h\u1EA1n s\u1ED1 l\u1EA7n.</p>
<p><b>Y\xEAu c\u1EA7u:</b> <code>GET /api/flaky</code> l\u1ED7i 500 \u1EDF l\u1EA7n \u0111\u1EA7u. Th\xEAm retry (t\u1ED1i \u0111a 2 l\u1EA7n, c\xE1ch nhau 300ms) \u0111\u1EC3 trang hi\u1EC7n <code>D\u1EEF li\u1EC7u \u0111\xE3 v\u1EC1</code>.</p>
${n}`,starter:`@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="msg">{{ data.value().message }}</p> }
    @if (data.error()) { <p class="err">L\u1ED7i {{ data.error().status }}</p> }
  \`,
})
class App {
  private http = inject(HttpClient);
  data = rxResource({
    stream: () => this.http.get('/api/flaky'),
  });
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    @if (data.hasValue()) { <p class="msg">{{ data.value().message }}</p> }
    @if (data.error()) { <p class="err">L\u1ED7i {{ data.error().status }}</p> }
  \`,
})
class App {
  private http = inject(HttpClient);
  data = rxResource({
    stream: () => this.http.get('/api/flaky').pipe(retry({ count: 2, delay: 300 })),
  });
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
`,hint:`this.http.get('/api/flaky').pipe(retry({ count: 2, delay: 300 })).`,explain:`Muốn áp cho mọi GET trong app thì đưa vào interceptor: next(req).pipe(retry(...)) khi req.method === "GET". Không retry POST: request có thể đã được xử lý xong, chỉ là response bị mất.`,check(t,r){let i$4=t.http(`/api/flaky`);return t.text(`.msg`)===`Dữ liệu đã về`&&i$4.length===2?i():i$4.length===1?s(`Chỉ có một request GET /api/flaky và nó lỗi 500: chưa có retry.`):i$4.length>3?s(`Có `+i$4.length+` request: retry cần giới hạn số lần.`):/retry\s*\(/.test(r)?s(`Trang chưa hiện "Dữ liệu đã về".`):s(`Hãy dùng toán tử retry().`)}}],extras:()=>import(`./chunk-q2xFomU3.js`).then(t=>t.httpExtras()),cheatsheet:[[`Cấu hình HttpClient`,`<code>provideHttpClient(withInterceptors([...]))</code> trong app.config.ts`],[`Bắt lỗi`,`<code>.pipe(catchError(() =&gt; of(null)))</code> trước <code>toSignal</code>`],[`Gọi và hiển thị`,`<code>toSignal(http.get(url), { initialValue: [] })</code>`],[`Tải lại theo tham số`,`<code>httpResource(() =&gt; '/api/users/' + id())</code>`],[`Trạng thái resource`,`<code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code> trước <code>value()</code>`],[`Gắn header cho mọi request`,`<code>withInterceptors([fn])</code>, <code>req.clone({ setHeaders })</code>`],[`Ghi dữ liệu`,`subscribe <b>một lần</b> trong handler, lưu vào signal`],[`Lỗi tạm thời`,`<code>retry({ count: 2, delay: 300 })</code>, chỉ với GET`]]};export{p as LAB};