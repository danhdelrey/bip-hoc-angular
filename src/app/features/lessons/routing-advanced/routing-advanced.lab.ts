import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 23 — Routing nâng cao. Mỗi bài tạo một ứng dụng bằng bootstrapApplication với Router dùng location
 * giả (route hiện ở thanh địa chỉ khung preview) và HttpClient nói chuyện với backend giả của lab.
 */
const PRODUCT_NAV = `<nav><a routerLink="/products/1">SP 1</a> · <a routerLink="/products/2">SP 2</a></nav>`;

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử route lồng nhau, tham số, query params, resolver và guard trên một ứng dụng thật. Route hiện tại hiện ở thanh địa chỉ của khung trình duyệt.</p>
<div class="tip">Có sẵn: <code>provideRouter</code>, <code>withComponentInputBinding</code>, <code>RouterOutlet</code>, <code>RouterLink</code>, <code>RouterLinkActive</code>, <code>Router</code>, <code>ActivatedRoute</code>, <code>NavigationStart</code>, <code>NavigationEnd</code>, <code>HttpClient</code> (backend giả: <code>/api/users/:id</code>…).</div>`,
    starter: `@Component({ selector: 'app-product', template: '<h2 class="page">Sản phẩm {{ id() }}</h2>' })
class Product {
  id = input();
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    ${PRODUCT_NAV}
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, {
  providers: [provideRouter([{ path: '', redirectTo: 'products/1', pathMatch: 'full' }, { path: 'products/:id', component: Product }], withComponentInputBinding())],
});
`,
  },
  {
    id: 'params-doi', group: 'Tham số', title: 'Đọc params một lần trong constructor', level: 'Dễ', lv: 1, waitMs: 800,
    desc: `<p>Đi từ <code>/products/1</code> sang <code>/products/2</code> thì Router <b>dùng lại</b> component đang có (cùng route, chỉ khác tham số). Đọc <code>route.snapshot.paramMap.get('id')</code> trong constructor chỉ lấy được giá trị lúc tạo, nên trang đứng yên ở sản phẩm 1. Hãy đọc tham số theo cách phản ứng: <code>withComponentInputBinding()</code> + <code>id = input()</code>, hoặc <code>toSignal(route.paramMap)</code>.</p>
<p><b>Yêu cầu:</b> ứng dụng mở ở sản phẩm 1; khi kiểm tra, trang bấm <b>SP 2</b>. Trang phải hiện <code>Sản phẩm 2</code>.</p>`,
    starter: `@Component({ selector: 'app-product', template: '<h2 class="page">Sản phẩm {{ id }}</h2>' })
class Product {
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id'); // ❗ chỉ đọc một lần
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    ${PRODUCT_NAV}
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', redirectTo: 'products/1', pathMatch: 'full' },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: `@Component({ selector: 'app-product', template: '<h2 class="page">Sản phẩm {{ id() }}</h2>' })
class Product {
  id = input();
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    ${PRODUCT_NAV}
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', redirectTo: 'products/1', pathMatch: 'full' },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    hint: 'Thêm withComponentInputBinding() vào provideRouter, trong Product thay dòng đọc snapshot bằng id = input(), và template dùng {{ id() }}.',
    explain: 'Cách khác: id = toSignal(inject(ActivatedRoute).paramMap.pipe(map(p => p.get("id")))). Snapshot chỉ an toàn khi chắc chắn component không bao giờ được dùng lại với tham số khác.',
    simulate(s) { s.at(400, () => s.click('SP 2')); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const t = norm(a.text('.page'));
      return t === 'Sản phẩm 2' ? OK() : NO('URL đã sang /products/2 nhưng trang vẫn hiện "' + t + '": component được dùng lại, giá trị đọc trong constructor không đổi.');
    },
  },
  {
    id: 'query-params', group: 'Tham số', title: 'Truyền query params đúng cách', level: 'Dễ', lv: 1, waitMs: 800,
    desc: `<p>Viết <code>routerLink="/products/3?tab=danh-gia"</code> thì Router coi cả chuỗi là đường dẫn: dấu <code>?</code> bị mã hoá thành <code>%3F</code> và không có query param nào. Truyền query params riêng: <code>routerLink="/products/3" [queryParams]="{ tab: 'danh-gia' }"</code> (hoặc <code>router.navigate([...], { queryParams })</code>).</p>
<p><b>Yêu cầu:</b> bấm link <b>Xem đánh giá</b> thì trang hiện <code>Sản phẩm 3 · tab danh-gia</code>.</p>`,
    starter: `@Component({ selector: 'app-product', template: '<h2 class="page">Sản phẩm {{ id() }} · tab {{ tab() ?? "mo-ta" }}</h2>' })
class Product {
  id = input();
  tab = input(); // query param ?tab=… cũng được gán vào input cùng tên
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/products/3?tab=danh-gia">Xem đánh giá</a>
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', component: Home },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    solution: `@Component({ selector: 'app-product', template: '<h2 class="page">Sản phẩm {{ id() }} · tab {{ tab() ?? "mo-ta" }}</h2>' })
class Product {
  id = input();
  tab = input();
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/products/3" [queryParams]="{ tab: 'danh-gia' }">Xem đánh giá</a>
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', component: Home },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    hint: 'Đổi thành <a routerLink="/products/3" [queryParams]="{ tab: \'danh-gia\' }">.',
    explain: 'Tham số route (:id) dùng cho thứ xác định trang (sản phẩm nào); query params dùng cho trạng thái phụ của trang (tab, bộ lọc, trang số mấy). Thêm queryParamsHandling="merge" để giữ các query params đang có.',
    simulate(s) { s.at(300, () => s.click('Xem đánh giá')); },
    check(a) {
      const t = norm(a.text('.page'));
      if (t === 'Sản phẩm 3 · tab danh-gia') return OK();
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      return NO('Trang đang hiện "' + t + '": dấu ? nằm trong routerLink bị coi là một phần của đường dẫn.');
    },
  },
  {
    id: 'route-con', group: 'Route lồng nhau', title: 'Route con cần <router-outlet> của cha', level: 'Dễ', lv: 1, waitMs: 800,
    desc: `<p>Route có <code>children</code> vẽ component cha vào outlet của ứng dụng, còn component của route con được vẽ vào <b><code>&lt;router-outlet&gt;</code> nằm trong template của cha</b>. Cha không có outlet thì URL vẫn đổi nhưng nội dung con không bao giờ hiện, và không có lỗi nào.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Bảo mật</b>; trang Cài đặt phải hiện <code>.child</code> với chữ <code>Bảo mật</code>.</p>`,
    starter: `@Component({ selector: 'app-profile', template: '<p class="child">Hồ sơ</p>' })
class Profile {}

@Component({ selector: 'app-security', template: '<p class="child">Bảo mật</p>' })
class Security {}

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  template: \`
    <h2>Cài đặt</h2>
    <a routerLink="profile">Hồ sơ</a> · <a routerLink="security">Bảo mật</a>
  \`,
})
class Settings {}

@Component({ selector: 'app-root', imports: [RouterOutlet], template: '<router-outlet />' })
class App {}

const routes = [
  { path: '', redirectTo: 'settings/profile', pathMatch: 'full' },
  {
    path: 'settings',
    component: Settings,
    children: [
      { path: 'profile', component: Profile },
      { path: 'security', component: Security },
    ],
  },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: `@Component({ selector: 'app-profile', template: '<p class="child">Hồ sơ</p>' })
class Profile {}

@Component({ selector: 'app-security', template: '<p class="child">Bảo mật</p>' })
class Security {}

@Component({
  selector: 'app-settings',
  imports: [RouterLink, RouterOutlet],
  template: \`
    <h2>Cài đặt</h2>
    <a routerLink="profile">Hồ sơ</a> · <a routerLink="security">Bảo mật</a>
    <router-outlet />
  \`,
})
class Settings {}

@Component({ selector: 'app-root', imports: [RouterOutlet], template: '<router-outlet />' })
class App {}

const routes = [
  { path: '', redirectTo: 'settings/profile', pathMatch: 'full' },
  {
    path: 'settings',
    component: Settings,
    children: [
      { path: 'profile', component: Profile },
      { path: 'security', component: Security },
    ],
  },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    hint: 'Trong Settings: thêm RouterOutlet vào imports và đặt <router-outlet /> dưới hàng link.',
    explain: 'routerLink="security" (không có / đầu) là đường dẫn tương đối với route hiện tại, nên từ /settings/profile nó dẫn tới /settings/security.',
    simulate(s) { s.at(400, () => s.click('Bảo mật')); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const t = a.query('.child').map((e) => norm(e.textContent));
      if (!t.length) return NO('Không thấy nội dung của route con: Settings chưa có <router-outlet />.');
      return t.join('|') === 'Bảo mật' ? OK() : NO('Nội dung con đang là ' + JSON.stringify(t) + '.');
    },
  },
  {
    id: 'can-deactivate', group: 'Guard', title: 'Chặn rời trang khi chưa lưu: canDeactivate', level: 'Trung bình', lv: 2, waitMs: 1000,
    desc: `<p><code>canDeactivate</code> chạy khi rời một route, nhận <b>component</b> đang hiển thị làm tham số đầu. Trả về <code>false</code> thì Router huỷ điều hướng và ở lại trang. (Ứng dụng thật thường hỏi xác nhận bằng một hộp thoại.)</p>
<p><b>Yêu cầu:</b> trên trang Sửa, gõ vào ô (form thành "dirty") rồi bấm <b>Trang chủ</b>: phải ở lại trang Sửa. Bấm <b>Lưu</b> rồi bấm <b>Trang chủ</b>: được rời đi.</p>`,
    starter: `@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({
  selector: 'app-edit',
  template: \`
    <h2 class="page">Sửa bài viết</h2>
    <input (input)="dirty.set(true)" aria-label="Tiêu đề" />
    <button (click)="dirty.set(false)">Lưu</button>
  \`,
})
class Edit {
  dirty = signal(false);
}

// TODO: guard không cho rời trang khi component.dirty() là true
const unsavedGuard = (component) => true;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: '<a routerLink="/home">Trang chủ</a> <router-outlet />',
})
class App {}

const routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'edit', component: Edit },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    solution: `@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({
  selector: 'app-edit',
  template: \`
    <h2 class="page">Sửa bài viết</h2>
    <input (input)="dirty.set(true)" aria-label="Tiêu đề" />
    <button (click)="dirty.set(false)">Lưu</button>
  \`,
})
class Edit {
  dirty = signal(false);
}

const unsavedGuard = (component) => {
  if (!component.dirty()) return true;
  log('Chặn rời trang: còn thay đổi chưa lưu');
  return false;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: '<a routerLink="/home">Trang chủ</a> <router-outlet />',
})
class App {}

const routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'edit', component: Edit, canDeactivate: [unsavedGuard] },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,
    hint: 'Guard: (component) => !component.dirty(). Gắn vào route: { path: \'edit\', component: Edit, canDeactivate: [unsavedGuard] }.',
    explain: 'Guard còn có thể trả về Promise/Observable<boolean>, ví dụ mở hộp thoại xác nhận rồi trả kết quả người dùng chọn. Lưu ý canDeactivate không chặn được việc đóng tab; với việc đó cần sự kiện beforeunload.',
    simulate(s) {
      s.at(300, () => s.type(0, 'Tiêu đề mới'));
      s.at(400, () => s.click('Trang chủ'));
      s.at(600, () => s.dom((r) => r.setAttribute('data-p1', norm(r.querySelector('.page')?.textContent))));
      s.at(650, () => s.click('Lưu'));
      s.at(750, () => s.click('Trang chủ'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const p1 = a.root()?.getAttribute('data-p1');
      if (p1 !== 'Sửa bài viết') return NO('Còn thay đổi chưa lưu mà vẫn rời được trang Sửa (đang ở "' + p1 + '").');
      const t = norm(a.text('.page'));
      return t === 'Trang chủ' ? OK() : NO('Đã bấm Lưu mà vẫn không rời được trang (đang ở "' + t + '"): guard chỉ được chặn khi còn thay đổi.');
    },
  },
  {
    id: 'resolver', group: 'Dữ liệu', title: 'Có dữ liệu trước khi vẽ trang: resolver', level: 'Trung bình', lv: 2, waitMs: 1300,
    desc: `<p>Component tự tải dữ liệu trong constructor thì luôn có một khoảnh khắc trang trống "Đang tải…". Với <code>resolve: { user: userResolver }</code>, Router chờ resolver xong mới kích hoạt route, rồi (với <code>withComponentInputBinding()</code>) gán dữ liệu vào <code>user = input()</code>. Resolver là hàm, chạy trong injection context nên gọi được <code>inject(HttpClient)</code>, đọc tham số qua <code>route.paramMap</code>.</p>
<p><b>Yêu cầu:</b> bấm <b>User 2</b>; ngay ở lần vẽ đầu tiên, trang chi tiết đã có tên <code>User 2</code> (log <code>Lần vẽ đầu: …</code> không được là "Đang tải…"). Giữ nguyên phần log trong constructor.</p>`,
    starter: `@Component({ selector: 'app-home', template: '<h2>Danh sách</h2>' })
class Home {}

@Component({
  selector: 'app-user-detail',
  template: \`
    @if (user(); as u) { <h2 class="page">{{ u.name }}</h2> } @else { <p class="page">Đang tải…</p> }
  \`,
})
class UserDetail {
  id = input();
  private http = inject(HttpClient);
  user = toSignal(toObservable(this.id).pipe(switchMap((id) => this.http.get('/api/users/' + id))));

  constructor() {
    const el = inject(ElementRef).nativeElement;
    afterNextRender(() => log('Lần vẽ đầu: ' + el.textContent.trim()));
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: '<a routerLink="/users/2">User 2</a> <router-outlet />',
})
class App {}

const routes = [
  { path: '', component: Home },
  { path: 'users/:id', component: UserDetail },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    solution: `@Component({ selector: 'app-home', template: '<h2>Danh sách</h2>' })
class Home {}

const userResolver = (route) => inject(HttpClient).get('/api/users/' + route.paramMap.get('id'));

@Component({
  selector: 'app-user-detail',
  template: \`
    @if (user(); as u) { <h2 class="page">{{ u.name }}</h2> } @else { <p class="page">Đang tải…</p> }
  \`,
})
class UserDetail {
  user = input(); // nhận từ resolve: { user: userResolver }

  constructor() {
    const el = inject(ElementRef).nativeElement;
    afterNextRender(() => log('Lần vẽ đầu: ' + el.textContent.trim()));
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: '<a routerLink="/users/2">User 2</a> <router-outlet />',
})
class App {}

const routes = [
  { path: '', component: Home },
  { path: 'users/:id', component: UserDetail, resolve: { user: userResolver } },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    hint: "const userResolver = (route) => inject(HttpClient).get('/api/users/' + route.paramMap.get('id')); thêm resolve: { user: userResolver } vào route, và trong UserDetail chỉ cần user = input().",
    explain: 'Resolver làm điều hướng chờ dữ liệu, nên người dùng cần thấy là "đang chuyển trang" (bài tiếp theo). Nếu resolver lỗi, điều hướng bị huỷ; hãy bắt lỗi trong resolver và trả về giá trị dự phòng hoặc RedirectCommand.',
    simulate(s) { s.at(300, () => s.click('User 2')); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const first = a.logs.find((l) => l.startsWith('Lần vẽ đầu:'));
      if (!first) return NO('Không thấy log "Lần vẽ đầu: …": giữ nguyên afterNextRender trong constructor của UserDetail.');
      if (!first.includes('User 2')) return NO('Lần vẽ đầu của trang chi tiết là "' + first.replace('Lần vẽ đầu: ', '') + '": dữ liệu chưa có khi trang được vẽ.');
      return norm(a.text('.page')) === 'User 2' ? OK() : NO('Trang chi tiết chưa hiện tên User 2.');
    },
  },
  {
    id: 'loading', group: 'Dữ liệu', title: 'Báo đang chuyển trang: sự kiện của Router', level: 'Khó', lv: 3, waitMs: 1400,
    desc: `<p>Resolver chậm làm điều hướng "đứng hình": bấm link xong không có gì xảy ra cho tới khi dữ liệu về. Hãy hiện thanh báo đang tải dựa trên <code>router.events</code>: bật khi có <code>NavigationStart</code>, tắt khi có <code>NavigationEnd</code>, <code>NavigationCancel</code> hoặc <code>NavigationError</code>.</p>
<p><b>Yêu cầu:</b> bấm <b>Báo cáo</b> (resolver mất khoảng 600ms): trong lúc chờ phải có <code>.loading</code>; khi trang Báo cáo hiện ra thì <code>.loading</code> biến mất.</p>`,
    starter: `@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({ selector: 'app-report', template: '<h2 class="page">Báo cáo: {{ data() }}</h2>' })
class Report {
  data = input();
}

const slowResolver = () => timer(600).pipe(map(() => 'doanh thu tháng 11'));

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/report">Báo cáo</a>
    <!-- TODO: hiện <div class="loading">Đang chuyển trang…</div> trong lúc điều hướng -->
    <router-outlet />
  \`,
})
class App {
  private router = inject(Router);
}

const routes = [
  { path: '', component: Home },
  { path: 'report', component: Report, resolve: { data: slowResolver } },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    solution: `@Component({ selector: 'app-home', template: '<h2 class="page">Trang chủ</h2>' })
class Home {}

@Component({ selector: 'app-report', template: '<h2 class="page">Báo cáo: {{ data() }}</h2>' })
class Report {
  data = input();
}

const slowResolver = () => timer(600).pipe(map(() => 'doanh thu tháng 11'));

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/report">Báo cáo</a>
    @if (loading()) { <div class="loading">Đang chuyển trang…</div> }
    <router-outlet />
  \`,
})
class App {
  private router = inject(Router);
  loading = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError),
      map((e) => e instanceof NavigationStart),
    ),
    { initialValue: false },
  );
}

const routes = [
  { path: '', component: Home },
  { path: 'report', component: Report, resolve: { data: slowResolver } },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,
    hint: 'loading = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError), map(e => e instanceof NavigationStart)), { initialValue: false }); rồi @if (loading()) { <div class="loading">…</div> }.',
    explain: 'Nhớ tắt cả khi điều hướng bị huỷ (guard trả false) hoặc lỗi, nếu không thanh tải sẽ quay mãi. Có thể chỉ hiện thanh sau khoảng 150ms để điều hướng nhanh không bị nháy.',
    simulate(s) {
      s.at(300, () => s.click('Báo cáo'));
      s.at(600, () => s.dom((r) => r.setAttribute('data-l1', r.querySelector('.loading') ? '1' : '0')));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (a.root()?.getAttribute('data-l1') !== '1') return NO('Trong lúc resolver đang chạy chưa thấy .loading.');
      if (norm(a.text('.page')) !== 'Báo cáo: doanh thu tháng 11') return NO('Trang Báo cáo chưa hiện ra.');
      return a.query('.loading').length ? NO('Trang đã hiện mà .loading vẫn còn: cần tắt khi có NavigationEnd.') : OK();
    },
  },
];

export const LAB: LabModule = {
  title: 'Routing nâng cao',
  subtitle: 'bài luyện Router trên ứng dụng thật: tham số đổi khi component được dùng lại, query params, route con, canDeactivate, resolver, báo đang chuyển trang.',
  exercises: EXERCISES,
  extras: () =>
    Promise.all([
      import('../../../shared/lab/lab-router').then((m) => m.routerExtras()),
      import('../../../shared/lab/lab-http').then((m) => m.httpExtras()),
    ]).then(([router, http]) => ({ ...http, ...router })),
  cheatsheet: [
    ['Tham số luôn mới', '<code>withComponentInputBinding()</code> + <code>id = input()</code>'],
    ['Query params', '<code>routerLink="/p/3" [queryParams]="{ tab: \'x\' }"</code>'],
    ['Route con', '<code>children: [...]</code> + <code>&lt;router-outlet /&gt;</code> trong cha'],
    ['Chặn rời trang', '<code>canDeactivate: [(c) =&gt; !c.dirty()]</code>'],
    ['Dữ liệu trước khi vẽ', '<code>resolve: { user: (route) =&gt; inject(HttpClient).get(…) }</code>'],
    ['Đang chuyển trang', '<code>router.events</code>: NavigationStart → End/Cancel/Error'],
  ],
};
