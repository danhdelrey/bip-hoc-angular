import{a as s,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var r=`@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({ selector: 'app-about', template: '<h2 class="page">Gi\u1EDBi thi\u1EC7u</h2>' })
class About {}
`;var p={title:`Routing`,subtitle:`bài luyện Router trên ứng dụng thật (location giả, không đổi URL của trang học): khai báo route, route ** cuối, tham số vào input(), guard, routerLinkActive, router.navigate.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Vi\u1EBFt \u1EE9ng d\u1EE5ng c\xF3 Router nh\u01B0 trong <code>main.ts</code>: <code>bootstrapApplication(App, { providers: [provideRouter(routes)] })</code>. Router c\u1EE7a lab d\xF9ng location gi\u1EA3, n\xEAn <b>kh\xF4ng \u0111\u1ED5i URL th\u1EADt</b> c\u1EE7a trang h\u1ECDc; route hi\u1EC7n t\u1EA1i hi\u1EC7n \u1EDF thanh \u0111\u1ECBa ch\u1EC9 c\u1EE7a khung tr\xECnh duy\u1EC7t.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>provideRouter</code>, <code>withComponentInputBinding</code>, <code>RouterOutlet</code>, <code>RouterLink</code>, <code>RouterLinkActive</code>, <code>Router</code>, <code>ActivatedRoute</code>.</div>`,starter:r+`
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang ch\u1EE7</a> \xB7 <a routerLink="/about">Gi\u1EDBi thi\u1EC7u</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`},{id:`routes-co-ban`,group:`Cấu hình route`,title:`Khai báo route và routerLink`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>M\u1EA3ng <code>routes</code> \xE1nh x\u1EA1 \u0111\u01B0\u1EDDng d\u1EABn t\u1EDBi component; <code>&lt;router-outlet /&gt;</code> l\xE0 ch\u1ED7 component c\u1EE7a route hi\u1EC7n t\u1EA1i \u0111\u01B0\u1EE3c v\u1EBD; <code>routerLink</code> \u0111i\u1EC1u h\u01B0\u1EDBng m\xE0 kh\xF4ng t\u1EA3i l\u1EA1i trang. \u0110\u01B0\u1EDDng d\u1EABn kh\xF4ng c\xF3 trong <code>routes</code> s\u1EBD g\xE2y l\u1ED7i "Cannot match any routes".</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\xEAm route <code>about</code>. Khi ki\u1EC3m tra, trang b\u1EA5m link <b>Gi\u1EDBi thi\u1EC7u</b>; trang ph\u1EA3i hi\u1EC7n <code>Gi\u1EDBi thi\u1EC7u</code>.</p>`,starter:r+`
const routes = [
  { path: '', component: Home },
  // TODO: route 'about' hi\u1EC3n th\u1ECB About
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang ch\u1EE7</a> \xB7 <a routerLink="/about">Gi\u1EDBi thi\u1EC7u</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,solution:r+`
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang ch\u1EE7</a> \xB7 <a routerLink="/about">Gi\u1EDBi thi\u1EC7u</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,hint:`Thêm { path: 'about', component: About } vào mảng routes (path không có dấu / ở đầu).`,explain:`Trong dự án thật, routes nằm ở app.routes.ts và provideRouter(routes) ở app.config.ts. Dùng routerLink thay cho href để điều hướng phía client, không tải lại cả ứng dụng.`,simulate(t){t.at(250,()=>t.click(`Giới thiệu`))},check(t){let e=t.text(`.page`);return e===`Giới thiệu`?i():t.errors.length?s(`Có lỗi: `+t.errMsg()+`. Router không tìm thấy route cho /about.`):s(`Trang đang là "`+e+`", cần "Giới thiệu".`)}},{id:`wildcard-cuoi`,group:`Cấu hình route`,title:`Route ** phải đứng cuối`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>Router so kh\u1EDBp route <b>theo th\u1EE9 t\u1EF1</b> trong m\u1EA3ng v\xE0 d\u1EEBng \u1EDF route kh\u1EDBp \u0111\u1EA7u ti\xEAn. <code>**</code> kh\u1EDBp m\u1ECDi \u0111\u01B0\u1EDDng d\u1EABn, n\xEAn \u0111\u1EB7t n\xF3 \u1EDF \u0111\u1EA7u th\xEC m\u1ECDi trang \u0111\u1EC1u th\xE0nh "Kh\xF4ng t\xECm th\u1EA5y".</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang ch\u1EE7 hi\u1EC7n <code>Trang ch\u1EE7</code>, b\u1EA5m <b>Gi\u1EDBi thi\u1EC7u</b> hi\u1EC7n <code>Gi\u1EDBi thi\u1EC7u</code>, \u0111\u01B0\u1EDDng d\u1EABn l\u1EA1 v\u1EABn hi\u1EC7n trang 404.</p>`,starter:r+`
@Component({ selector: 'app-not-found', template: '<h2 class="page">404 \u2013 Kh\xF4ng t\xECm th\u1EA5y</h2>' })
class NotFound {}

const routes = [
  { path: '**', component: NotFound },
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang ch\u1EE7</a> \xB7 <a routerLink="/about">Gi\u1EDBi thi\u1EC7u</a> \xB7 <a routerLink="/khong-co">Link h\u1ECFng</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,solution:r+`
@Component({ selector: 'app-not-found', template: '<h2 class="page">404 \u2013 Kh\xF4ng t\xECm th\u1EA5y</h2>' })
class NotFound {}

const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: '**', component: NotFound },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang ch\u1EE7</a> \xB7 <a routerLink="/about">Gi\u1EDBi thi\u1EC7u</a> \xB7 <a routerLink="/khong-co">Link h\u1ECFng</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,hint:`Chuyển { path: '**', component: NotFound } xuống cuối mảng.`,explain:`Tương tự, route cụ thể (products/new) phải đứng trước route có tham số (products/:id). Route rỗng '' với redirectTo cần pathMatch: 'full'.`,simulate(t){t.at(250,()=>t.dom(e=>e.setAttribute(`data-home`,(e.querySelector(`.page`)?.textContent??``).trim()))),t.at(300,()=>t.click(`Giới thiệu`)),t.at(450,()=>t.dom(e=>e.setAttribute(`data-about`,(e.querySelector(`.page`)?.textContent??``).trim()))),t.at(500,()=>t.click(`Link hỏng`))},check(t){let e=t.root()?.getAttribute(`data-home`),a=t.root()?.getAttribute(`data-about`);return e!==`Trang chủ`?s(`Trang chủ đang hiện "`+e+`": route ** đứng đầu nên khớp trước mọi route khác.`):a!==`Giới thiệu`?s(`Bấm Giới thiệu nhưng trang là "`+a+`".`):t.text(`.page`)!==`404 – Không tìm thấy`?s(`Đường dẫn lạ cần hiện trang 404.`):i()}},{id:`route-param`,group:`Tham số`,title:`Tham số route vào input()`,level:`Trung bình`,lv:2,waitMs:800,desc:`<p>Route <code>products/:id</code> c\xF3 tham s\u1ED1 <code>id</code>. V\u1EDBi <code>withComponentInputBinding()</code>, Router t\u1EF1 g\xE1n tham s\u1ED1 route v\xE0o <code>input()</code> c\xF9ng t\xEAn c\u1EE7a component, kh\xF4ng c\u1EA7n inject <code>ActivatedRoute</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>S\u1EA3n ph\u1EA9m 2</b> r\u1ED3i <b>S\u1EA3n ph\u1EA9m 1</b>; trang ph\u1EA3i hi\u1EC7n <code>S\u1EA3n ph\u1EA9m #1</code>.</p>`,starter:`@Component({ selector: 'app-home', template: '<h2 class="page">Danh s\xE1ch s\u1EA3n ph\u1EA9m</h2>' })
class Home {}

@Component({ selector: 'app-product', template: '<h2 class="page">S\u1EA3n ph\u1EA9m #{{ id() }}</h2>' })
class ProductPage {
  id = input();
}

const routes = [
  { path: '', component: Home },
  { path: 'products/:id', component: ProductPage },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/products/2">S\u1EA3n ph\u1EA9m 2</a> \xB7 <a routerLink="/products/1">S\u1EA3n ph\u1EA9m 1</a></nav>
    <router-outlet />
  \`,
})
class App {}

// \u2757 Router ch\u01B0a \u0111\u01B0\u1EE3c b\u1EADt t\xEDnh n\u0103ng g\xE1n tham s\u1ED1 route v\xE0o input
bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,solution:`@Component({ selector: 'app-home', template: '<h2 class="page">Danh s\xE1ch s\u1EA3n ph\u1EA9m</h2>' })
class Home {}

@Component({ selector: 'app-product', template: '<h2 class="page">S\u1EA3n ph\u1EA9m #{{ id() }}</h2>' })
class ProductPage {
  id = input();
}

const routes = [
  { path: '', component: Home },
  { path: 'products/:id', component: ProductPage },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/products/2">S\u1EA3n ph\u1EA9m 2</a> \xB7 <a routerLink="/products/1">S\u1EA3n ph\u1EA9m 1</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,hint:`provideRouter(routes, withComponentInputBinding())`,explain:`Router dùng lại instance ProductPage khi chỉ đổi tham số (/products/2 → /products/1), nên đọc id qua input() (signal) là cách đúng: giá trị tự cập nhật. Query param (?q=) và data của route cũng được gán vào input theo cách này.`,simulate(t){t.at(250,()=>t.click(`Sản phẩm 2`)),t.at(450,()=>t.click(`Sản phẩm 1`))},check(t){let e=t.text(`.page`);return e===`Sản phẩm #1`?i():e===`Sản phẩm #`?s(`id đang trống: tham số route chưa được gán vào input(). Thêm withComponentInputBinding().`):s(`Trang đang là "`+e+`", cần "Sản phẩm #1".`)}},{id:`guard`,group:`Bảo vệ route`,title:`Guard chặn trang quản trị`,level:`Trung bình`,lv:2,waitMs:900,desc:`<p>Guard d\u1EA1ng h\xE0m (<code>CanActivateFn</code>) ch\u1EA1y tr\u01B0\u1EDBc khi v\xE0o route: tr\u1EA3 <code>true</code> \u0111\u1EC3 cho qua, ho\u1EB7c tr\u1EA3 m\u1ED9t <code>UrlTree</code> (<code>inject(Router).createUrlTree(['/login'])</code>) \u0111\u1EC3 chuy\u1EC3n h\u01B0\u1EDBng. B\xEAn trong guard d\xF9ng \u0111\u01B0\u1EE3c <code>inject()</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> ch\u01B0a \u0111\u0103ng nh\u1EADp m\xE0 v\xE0o <b>Admin</b> th\xEC b\u1ECB chuy\u1EC3n sang trang \u0111\u0103ng nh\u1EADp; b\u1EA5m <b>V\xE0o h\u1EC7 th\u1ED1ng</b> r\u1ED3i v\xE0o Admin th\xEC \u0111\u01B0\u1EE3c qua.</p>`,starter:`@Service()
class Auth {
  loggedIn = signal(false);
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({ selector: 'app-admin', template: '<h2 class="page">Trang qu\u1EA3n tr\u1ECB</h2>' })
class Admin {}

@Component({
  selector: 'app-login',
  template: '<h2 class="page">Trang \u0111\u0103ng nh\u1EADp</h2><button (click)="auth.loggedIn.set(true)">V\xE0o h\u1EC7 th\u1ED1ng</button>',
})
class Login {
  auth = inject(Auth);
}

const adminGuard = () => {
  // TODO: ch\u01B0a \u0111\u0103ng nh\u1EADp th\xEC chuy\u1EC3n v\u1EC1 /login
  return true;
};

const routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang ch\u1EE7</a> \xB7 <a routerLink="/admin">Admin</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,solution:`@Service()
class Auth {
  loggedIn = signal(false);
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({ selector: 'app-admin', template: '<h2 class="page">Trang qu\u1EA3n tr\u1ECB</h2>' })
class Admin {}

@Component({
  selector: 'app-login',
  template: '<h2 class="page">Trang \u0111\u0103ng nh\u1EADp</h2><button (click)="auth.loggedIn.set(true)">V\xE0o h\u1EC7 th\u1ED1ng</button>',
})
class Login {
  auth = inject(Auth);
}

const adminGuard = () => {
  const auth = inject(Auth);
  return auth.loggedIn() ? true : inject(Router).createUrlTree(['/login']);
};

const routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang ch\u1EE7</a> \xB7 <a routerLink="/admin">Admin</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,hint:`const adminGuard = () => inject(Auth).loggedIn() ? true : inject(Router).createUrlTree(['/login']);`,explain:`Trả về UrlTree tốt hơn gọi router.navigate() trong guard: Router huỷ điều hướng hiện tại và chuyển hướng gọn trong một lần. Guard chỉ là lớp UX; quyền thật vẫn phải được kiểm tra ở server.`,simulate(t){t.at(250,()=>t.click(`Admin`)),t.at(400,()=>t.dom(e=>e.setAttribute(`data-first`,(e.querySelector(`.page`)?.textContent??``).trim()))),t.at(450,()=>t.click(`Vào hệ thống`)),t.at(550,()=>t.click(`Admin`))},check(t){let e=t.root()?.getAttribute(`data-first`);return e===`Trang quản trị`?s(`Chưa đăng nhập mà vẫn vào được trang quản trị: guard chưa chặn.`):e!==`Trang đăng nhập`?s(`Chưa đăng nhập vào Admin cần chuyển sang "Trang đăng nhập" (đang là "`+e+`").`):t.text(`.page`)!==`Trang quản trị`?s(`Đã đăng nhập nhưng vẫn không vào được trang quản trị.`):i()}},{id:`router-link-active`,group:`Cấu hình route`,title:`Đánh dấu link đang chọn: routerLinkActive`,level:`Dễ`,lv:1,waitMs:700,desc:`<p><code>routerLinkActive="active"</code> g\u1EAFn class khi link kh\u1EDBp URL hi\u1EC7n t\u1EA1i. Link <code>/</code> l\xE0 ti\u1EC1n t\u1ED1 c\u1EE7a m\u1ECDi URL, n\xEAn lu\xF4n "kh\u1EDBp"; c\u1EA7n <code>[routerLinkActiveOptions]="{ exact: true }"</code> \u0111\u1EC3 ch\u1EC9 kh\u1EDBp \u0111\xFAng trang ch\u1EE7.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Gi\u1EDBi thi\u1EC7u</b>; ch\u1EC9 link Gi\u1EDBi thi\u1EC7u c\xF3 class <code>active</code>.</p>`,starter:r+`
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <nav>
      <a routerLink="/" routerLinkActive="active">Trang ch\u1EE7</a> \xB7
      <a routerLink="/about" routerLinkActive="active">Gi\u1EDBi thi\u1EC7u</a>
    </nav>
    <router-outlet />
  \`,
  styles: 'a.active { font-weight: 700; text-decoration: underline; }',
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,solution:r+`
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Trang ch\u1EE7</a> \xB7
      <a routerLink="/about" routerLinkActive="active">Gi\u1EDBi thi\u1EC7u</a>
    </nav>
    <router-outlet />
  \`,
  styles: 'a.active { font-weight: 700; text-decoration: underline; }',
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,hint:`Thêm [routerLinkActiveOptions]="{ exact: true }" vào link Trang chủ.`,explain:`routerLinkActive còn đặt aria-current="page" cho link đang chọn nếu bạn thêm ariaCurrentWhenActive="page", tốt cho người dùng trình đọc màn hình.`,simulate(t){t.at(250,()=>t.click(`Giới thiệu`))},check(t){let a=t.query(`nav a`).map(i=>i.classList.contains(`active`));return JSON.stringify(a)===`[false,true]`?i():JSON.stringify(a)===`[true,true]`?s(`Link Trang chủ vẫn active khi đang ở /about: "/" là tiền tố của mọi URL. Dùng exact: true.`):s(`Class active đang là `+JSON.stringify(a)+`, cần chỉ link Giới thiệu.`)}},{id:`navigate`,group:`Tham số`,title:`Điều hướng bằng code: router.navigate`,level:`Trung bình`,lv:2,waitMs:800,desc:`<p>Sau m\u1ED9t h\xE0nh \u0111\u1ED9ng (l\u01B0u form, t\u1EA1o \u0111\u01A1n\u2026), \u0111i\u1EC1u h\u01B0\u1EDBng b\u1EB1ng code: <code>inject(Router)</code> r\u1ED3i <code>router.navigate(['/orders', id])</code>. M\u1EA3ng l\u1EC7nh t\u1EF1 gh\xE9p \u0111\u01B0\u1EDDng d\u1EABn v\xE0 m\xE3 ho\xE1 tham s\u1ED1.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>T\u1EA1o \u0111\u01A1n</b>; \u1EE9ng d\u1EE5ng ph\u1EA3i chuy\u1EC3n sang <code>\u0110\u01A1n h\xE0ng #42</code>.</p>`,starter:`@Component({
  selector: 'app-new-order',
  template: '<h2 class="page">T\u1EA1o \u0111\u01A1n m\u1EDBi</h2><button (click)="create()">T\u1EA1o \u0111\u01A1n</button>',
})
class NewOrder {
  // TODO: inject Router v\xE0 chuy\u1EC3n t\u1EDBi /orders/<id> sau khi t\u1EA1o
  create() {
    const id = 42;
    log('\u0110\xE3 t\u1EA1o \u0111\u01A1n', id);
  }
}

@Component({ selector: 'app-order', template: '<h2 class="page">\u0110\u01A1n h\xE0ng #{{ id() }}</h2>' })
class OrderDetail {
  id = input();
}

const routes = [
  { path: '', component: NewOrder },
  { path: 'orders/:id', component: OrderDetail },
];

@Component({ selector: 'app-root', imports: [RouterOutlet], template: '<router-outlet />' })
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,solution:`@Component({
  selector: 'app-new-order',
  template: '<h2 class="page">T\u1EA1o \u0111\u01A1n m\u1EDBi</h2><button (click)="create()">T\u1EA1o \u0111\u01A1n</button>',
})
class NewOrder {
  router = inject(Router);

  create() {
    const id = 42;
    log('\u0110\xE3 t\u1EA1o \u0111\u01A1n', id);
    this.router.navigate(['/orders', id]);
  }
}

@Component({ selector: 'app-order', template: '<h2 class="page">\u0110\u01A1n h\xE0ng #{{ id() }}</h2>' })
class OrderDetail {
  id = input();
}

const routes = [
  { path: '', component: NewOrder },
  { path: 'orders/:id', component: OrderDetail },
];

@Component({ selector: 'app-root', imports: [RouterOutlet], template: '<router-outlet />' })
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,hint:`router = inject(Router); rồi trong create(): this.router.navigate(['/orders', id]);`,explain:`navigate() trả về Promise<boolean> (false nếu bị guard chặn). Điều hướng tương đối: this.router.navigate(['..'], { relativeTo: inject(ActivatedRoute) }). Thêm query: navigate(['/search'], { queryParams: { q } }).`,simulate(t){t.at(250,()=>t.click(`Tạo đơn`))},check(t){let e=t.text(`.page`);return e===`Đơn hàng #42`?i():e===`Tạo đơn mới`?s(`Bấm Tạo đơn nhưng ứng dụng vẫn ở trang tạo đơn: chưa điều hướng.`):s(`Trang đang là "`+e+`", cần "Đơn hàng #42".`)}}],extras:()=>import(`./chunk-41J4kvEN.js`).then(t=>t.routerExtras()),cheatsheet:[[`Khai báo trang`,`<code>routes = [{ path: 'about', component: About }]</code> + <code>provideRouter(routes)</code>`],[`Chỗ hiển thị trang`,`<code>&lt;router-outlet /&gt;</code>`],[`Link trong ứng dụng`,`<code>routerLink="/about"</code> (không dùng <code>href</code>)`],[`Trang 404`,`<code>{ path: '**', component: NotFound }</code> ở <b>cuối</b> mảng`],[`Đọc tham số route`,`<code>withComponentInputBinding()</code> + <code>id = input()</code>`],[`Chặn/chuyển hướng`,`guard hàm trả <code>true</code> hoặc <code>router.createUrlTree([...])</code>`],[`Đánh dấu link đang chọn`,`<code>routerLinkActive="active"</code>, trang chủ thêm <code>{ exact: true }</code>`],[`Điều hướng bằng code`,`<code>inject(Router).navigate(['/orders', id])</code>`]]};export{p as LAB};