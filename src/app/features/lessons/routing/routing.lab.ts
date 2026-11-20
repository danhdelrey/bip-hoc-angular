import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 11 — Routing. Mỗi bài tạo một ứng dụng riêng bằng bootstrapApplication(App, { providers })
 * như main.ts; Router của lab dùng location giả nên không đổi URL thật (thanh địa chỉ khung preview hiện route).
 */
const PAGES = `@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({ selector: 'app-about', template: '<h2 class="page">Giới thiệu</h2>' })
class About {}
`;

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Viết ứng dụng có Router như trong <code>main.ts</code>: <code>bootstrapApplication(App, { providers: [provideRouter(routes)] })</code>. Router của lab dùng location giả, nên <b>không đổi URL thật</b> của trang học; route hiện tại hiện ở thanh địa chỉ của khung trình duyệt.</p>
<div class="tip">Có sẵn: <code>provideRouter</code>, <code>withComponentInputBinding</code>, <code>RouterOutlet</code>, <code>RouterLink</code>, <code>RouterLinkActive</code>, <code>Router</code>, <code>ActivatedRoute</code>.</div>`,
    starter: PAGES + `
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang chủ</a> · <a routerLink="/about">Giới thiệu</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
  },
  {
    id: 'routes-co-ban', group: 'Cấu hình route', title: 'Khai báo route và routerLink', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p>Mảng <code>routes</code> ánh xạ đường dẫn tới component; <code>&lt;router-outlet /&gt;</code> là chỗ component của route hiện tại được vẽ; <code>routerLink</code> điều hướng mà không tải lại trang. Đường dẫn không có trong <code>routes</code> sẽ gây lỗi "Cannot match any routes".</p>
<p><b>Yêu cầu:</b> thêm route <code>about</code>. Khi kiểm tra, trang bấm link <b>Giới thiệu</b>; trang phải hiện <code>Giới thiệu</code>.</p>`,
    starter: PAGES + `
const routes = [
  { path: '', component: Home },
  // TODO: route 'about' hiển thị About
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang chủ</a> · <a routerLink="/about">Giới thiệu</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: PAGES + `
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav><a routerLink="/">Trang chủ</a> · <a routerLink="/about">Giới thiệu</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    hint: "Thêm { path: 'about', component: About } vào mảng routes (path không có dấu / ở đầu).",
    explain: 'Trong dự án thật, routes nằm ở app.routes.ts và provideRouter(routes) ở app.config.ts. Dùng routerLink thay cho href để điều hướng phía client, không tải lại cả ứng dụng.',
    simulate(s) { s.at(250, () => s.click('Giới thiệu')); },
    check(a) {
      const t = a.text('.page');
      if (t === 'Giới thiệu') return OK();
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Router không tìm thấy route cho /about.');
      return NO('Trang đang là "' + t + '", cần "Giới thiệu".');
    },
  },
  {
    id: 'wildcard-cuoi', group: 'Cấu hình route', title: 'Route ** phải đứng cuối', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p>Router so khớp route <b>theo thứ tự</b> trong mảng và dừng ở route khớp đầu tiên. <code>**</code> khớp mọi đường dẫn, nên đặt nó ở đầu thì mọi trang đều thành "Không tìm thấy".</p>
<p><b>Yêu cầu:</b> trang chủ hiện <code>Trang chủ</code>, bấm <b>Giới thiệu</b> hiện <code>Giới thiệu</code>, đường dẫn lạ vẫn hiện trang 404.</p>`,
    starter: PAGES + `
@Component({ selector: 'app-not-found', template: '<h2 class="page">404 – Không tìm thấy</h2>' })
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
    <nav><a routerLink="/">Trang chủ</a> · <a routerLink="/about">Giới thiệu</a> · <a routerLink="/khong-co">Link hỏng</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: PAGES + `
@Component({ selector: 'app-not-found', template: '<h2 class="page">404 – Không tìm thấy</h2>' })
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
    <nav><a routerLink="/">Trang chủ</a> · <a routerLink="/about">Giới thiệu</a> · <a routerLink="/khong-co">Link hỏng</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    hint: "Chuyển { path: '**', component: NotFound } xuống cuối mảng.",
    explain: "Tương tự, route cụ thể (products/new) phải đứng trước route có tham số (products/:id). Route rỗng '' với redirectTo cần pathMatch: 'full'.",
    simulate(s) {
      s.at(250, () => s.dom((r) => r.setAttribute('data-home', (r.querySelector('.page')?.textContent ?? '').trim())));
      s.at(300, () => s.click('Giới thiệu'));
      s.at(450, () => s.dom((r) => r.setAttribute('data-about', (r.querySelector('.page')?.textContent ?? '').trim())));
      s.at(500, () => s.click('Link hỏng'));
    },
    check(a) {
      const home = a.root()?.getAttribute('data-home'), about = a.root()?.getAttribute('data-about');
      if (home !== 'Trang chủ') return NO('Trang chủ đang hiện "' + home + '": route ** đứng đầu nên khớp trước mọi route khác.');
      if (about !== 'Giới thiệu') return NO('Bấm Giới thiệu nhưng trang là "' + about + '".');
      if (a.text('.page') !== '404 – Không tìm thấy') return NO('Đường dẫn lạ cần hiện trang 404.');
      return OK();
    },
  },
  {
    id: 'route-param', group: 'Tham số', title: 'Tham số route vào input()', level: 'Trung bình', lv: 2, waitMs: 800,
    desc: `<p>Route <code>products/:id</code> có tham số <code>id</code>. Với <code>withComponentInputBinding()</code>, Router tự gán tham số route vào <code>input()</code> cùng tên của component, không cần inject <code>ActivatedRoute</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Sản phẩm 2</b> rồi <b>Sản phẩm 1</b>; trang phải hiện <code>Sản phẩm #1</code>.</p>`,
    starter: `@Component({ selector: 'app-home', template: '<h2 class="page">Danh sách sản phẩm</h2>' })
class Home {}

@Component({ selector: 'app-product', template: '<h2 class="page">Sản phẩm #{{ id() }}</h2>' })
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
    <nav><a routerLink="/products/2">Sản phẩm 2</a> · <a routerLink="/products/1">Sản phẩm 1</a></nav>
    <router-outlet />
  \`,
})
class App {}

// ❗ Router chưa được bật tính năng gán tham số route vào input
bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: `@Component({ selector: 'app-home', template: '<h2 class="page">Danh sách sản phẩm</h2>' })
class Home {}

@Component({ selector: 'app-product', template: '<h2 class="page">Sản phẩm #{{ id() }}</h2>' })
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
    <nav><a routerLink="/products/2">Sản phẩm 2</a> · <a routerLink="/products/1">Sản phẩm 1</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    hint: 'provideRouter(routes, withComponentInputBinding())',
    explain: 'Router dùng lại instance ProductPage khi chỉ đổi tham số (/products/2 → /products/1), nên đọc id qua input() (signal) là cách đúng: giá trị tự cập nhật. Query param (?q=) và data của route cũng được gán vào input theo cách này.',
    simulate(s) { s.at(250, () => s.click('Sản phẩm 2')); s.at(450, () => s.click('Sản phẩm 1')); },
    check(a) {
      const t = a.text('.page');
      if (t === 'Sản phẩm #1') return OK();
      if (t === 'Sản phẩm #') return NO('id đang trống: tham số route chưa được gán vào input(). Thêm withComponentInputBinding().');
      return NO('Trang đang là "' + t + '", cần "Sản phẩm #1".');
    },
  },
  {
    id: 'guard', group: 'Bảo vệ route', title: 'Guard chặn trang quản trị', level: 'Trung bình', lv: 2, waitMs: 900,
    desc: `<p>Guard dạng hàm (<code>CanActivateFn</code>) chạy trước khi vào route: trả <code>true</code> để cho qua, hoặc trả một <code>UrlTree</code> (<code>inject(Router).createUrlTree(['/login'])</code>) để chuyển hướng. Bên trong guard dùng được <code>inject()</code>.</p>
<p><b>Yêu cầu:</b> chưa đăng nhập mà vào <b>Admin</b> thì bị chuyển sang trang đăng nhập; bấm <b>Vào hệ thống</b> rồi vào Admin thì được qua.</p>`,
    starter: `@Service()
class Auth {
  loggedIn = signal(false);
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({ selector: 'app-admin', template: '<h2 class="page">Trang quản trị</h2>' })
class Admin {}

@Component({
  selector: 'app-login',
  template: '<h2 class="page">Trang đăng nhập</h2><button (click)="auth.loggedIn.set(true)">Vào hệ thống</button>',
})
class Login {
  auth = inject(Auth);
}

const adminGuard = () => {
  // TODO: chưa đăng nhập thì chuyển về /login
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
    <nav><a routerLink="/">Trang chủ</a> · <a routerLink="/admin">Admin</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: `@Service()
class Auth {
  loggedIn = signal(false);
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({ selector: 'app-admin', template: '<h2 class="page">Trang quản trị</h2>' })
class Admin {}

@Component({
  selector: 'app-login',
  template: '<h2 class="page">Trang đăng nhập</h2><button (click)="auth.loggedIn.set(true)">Vào hệ thống</button>',
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
    <nav><a routerLink="/">Trang chủ</a> · <a routerLink="/admin">Admin</a></nav>
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    hint: "const adminGuard = () => inject(Auth).loggedIn() ? true : inject(Router).createUrlTree(['/login']);",
    explain: 'Trả về UrlTree tốt hơn gọi router.navigate() trong guard: Router huỷ điều hướng hiện tại và chuyển hướng gọn trong một lần. Guard chỉ là lớp UX; quyền thật vẫn phải được kiểm tra ở server.',
    simulate(s) {
      s.at(250, () => s.click('Admin'));
      s.at(400, () => s.dom((r) => r.setAttribute('data-first', (r.querySelector('.page')?.textContent ?? '').trim())));
      s.at(450, () => s.click('Vào hệ thống'));
      s.at(550, () => s.click('Admin'));
    },
    check(a) {
      const first = a.root()?.getAttribute('data-first');
      if (first === 'Trang quản trị') return NO('Chưa đăng nhập mà vẫn vào được trang quản trị: guard chưa chặn.');
      if (first !== 'Trang đăng nhập') return NO('Chưa đăng nhập vào Admin cần chuyển sang "Trang đăng nhập" (đang là "' + first + '").');
      if (a.text('.page') !== 'Trang quản trị') return NO('Đã đăng nhập nhưng vẫn không vào được trang quản trị.');
      return OK();
    },
  },
  {
    id: 'router-link-active', group: 'Cấu hình route', title: 'Đánh dấu link đang chọn: routerLinkActive', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p><code>routerLinkActive="active"</code> gắn class khi link khớp URL hiện tại. Link <code>/</code> là tiền tố của mọi URL, nên luôn "khớp"; cần <code>[routerLinkActiveOptions]="{ exact: true }"</code> để chỉ khớp đúng trang chủ.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Giới thiệu</b>; chỉ link Giới thiệu có class <code>active</code>.</p>`,
    starter: PAGES + `
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <nav>
      <a routerLink="/" routerLinkActive="active">Trang chủ</a> ·
      <a routerLink="/about" routerLinkActive="active">Giới thiệu</a>
    </nav>
    <router-outlet />
  \`,
  styles: 'a.active { font-weight: 700; text-decoration: underline; }',
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: PAGES + `
const routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Trang chủ</a> ·
      <a routerLink="/about" routerLinkActive="active">Giới thiệu</a>
    </nav>
    <router-outlet />
  \`,
  styles: 'a.active { font-weight: 700; text-decoration: underline; }',
})
class App {}

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    hint: 'Thêm [routerLinkActiveOptions]="{ exact: true }" vào link Trang chủ.',
    explain: 'routerLinkActive còn đặt aria-current="page" cho link đang chọn nếu bạn thêm ariaCurrentWhenActive="page", tốt cho người dùng trình đọc màn hình.',
    simulate(s) { s.at(250, () => s.click('Giới thiệu')); },
    check(a) {
      const links = a.query('nav a');
      const act = links.map((l) => l.classList.contains('active'));
      if (JSON.stringify(act) === '[false,true]') return OK();
      if (JSON.stringify(act) === '[true,true]') return NO('Link Trang chủ vẫn active khi đang ở /about: "/" là tiền tố của mọi URL. Dùng exact: true.');
      return NO('Class active đang là ' + JSON.stringify(act) + ', cần chỉ link Giới thiệu.');
    },
  },
  {
    id: 'navigate', group: 'Tham số', title: 'Điều hướng bằng code: router.navigate', level: 'Trung bình', lv: 2, waitMs: 800,
    desc: `<p>Sau một hành động (lưu form, tạo đơn…), điều hướng bằng code: <code>inject(Router)</code> rồi <code>router.navigate(['/orders', id])</code>. Mảng lệnh tự ghép đường dẫn và mã hoá tham số.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Tạo đơn</b>; ứng dụng phải chuyển sang <code>Đơn hàng #42</code>.</p>`,
    starter: `@Component({
  selector: 'app-new-order',
  template: '<h2 class="page">Tạo đơn mới</h2><button (click)="create()">Tạo đơn</button>',
})
class NewOrder {
  // TODO: inject Router và chuyển tới /orders/<id> sau khi tạo
  create() {
    const id = 42;
    log('Đã tạo đơn', id);
  }
}

@Component({ selector: 'app-order', template: '<h2 class="page">Đơn hàng #{{ id() }}</h2>' })
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
`,
    solution: `@Component({
  selector: 'app-new-order',
  template: '<h2 class="page">Tạo đơn mới</h2><button (click)="create()">Tạo đơn</button>',
})
class NewOrder {
  router = inject(Router);

  create() {
    const id = 42;
    log('Đã tạo đơn', id);
    this.router.navigate(['/orders', id]);
  }
}

@Component({ selector: 'app-order', template: '<h2 class="page">Đơn hàng #{{ id() }}</h2>' })
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
`,
    hint: "router = inject(Router); rồi trong create(): this.router.navigate(['/orders', id]);",
    explain: "navigate() trả về Promise<boolean> (false nếu bị guard chặn). Điều hướng tương đối: this.router.navigate(['..'], { relativeTo: inject(ActivatedRoute) }). Thêm query: navigate(['/search'], { queryParams: { q } }).",
    simulate(s) { s.at(250, () => s.click('Tạo đơn')); },
    check(a) {
      const t = a.text('.page');
      if (t === 'Đơn hàng #42') return OK();
      if (t === 'Tạo đơn mới') return NO('Bấm Tạo đơn nhưng ứng dụng vẫn ở trang tạo đơn: chưa điều hướng.');
      return NO('Trang đang là "' + t + '", cần "Đơn hàng #42".');
    },
  },
];

export const LAB: LabModule = {
  title: 'Routing',
  subtitle: 'bài luyện Router trên ứng dụng thật (location giả, không đổi URL của trang học): khai báo route, route ** cuối, tham số vào input(), guard, routerLinkActive, router.navigate.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-router').then((m) => m.routerExtras()),
  cheatsheet: [
    ['Khai báo trang', '<code>routes = [{ path: \'about\', component: About }]</code> + <code>provideRouter(routes)</code>'],
    ['Chỗ hiển thị trang', '<code>&lt;router-outlet /&gt;</code>'],
    ['Link trong ứng dụng', '<code>routerLink="/about"</code> (không dùng <code>href</code>)'],
    ['Trang 404', '<code>{ path: \'**\', component: NotFound }</code> ở <b>cuối</b> mảng'],
    ['Đọc tham số route', '<code>withComponentInputBinding()</code> + <code>id = input()</code>'],
    ['Chặn/chuyển hướng', 'guard hàm trả <code>true</code> hoặc <code>router.createUrlTree([...])</code>'],
    ['Đánh dấu link đang chọn', '<code>routerLinkActive="active"</code>, trang chủ thêm <code>{ exact: true }</code>'],
    ['Điều hướng bằng code', '<code>inject(Router).navigate([\'/orders\', id])</code>'],
  ],
};
