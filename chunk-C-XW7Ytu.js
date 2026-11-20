import{a as s,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";import{t as r}from"./chunk-DxqKAYlM.js";var c=`<nav><a routerLink="/products/1">SP 1</a> · <a routerLink="/products/2">SP 2</a></nav>`;var u={title:`Routing nâng cao`,subtitle:`bài luyện Router trên ứng dụng thật: tham số đổi khi component được dùng lại, query params, route con, canDeactivate, resolver, báo đang chuyển trang.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Th\u1EED route l\u1ED3ng nhau, tham s\u1ED1, query params, resolver v\xE0 guard tr\xEAn m\u1ED9t \u1EE9ng d\u1EE5ng th\u1EADt. Route hi\u1EC7n t\u1EA1i hi\u1EC7n \u1EDF thanh \u0111\u1ECBa ch\u1EC9 c\u1EE7a khung tr\xECnh duy\u1EC7t.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>provideRouter</code>, <code>withComponentInputBinding</code>, <code>RouterOutlet</code>, <code>RouterLink</code>, <code>RouterLinkActive</code>, <code>Router</code>, <code>ActivatedRoute</code>, <code>NavigationStart</code>, <code>NavigationEnd</code>, <code>HttpClient</code> (backend gi\u1EA3: <code>/api/users/:id</code>\u2026).</div>`,starter:`@Component({ selector: 'app-product', template: '<h2 class="page">S\u1EA3n ph\u1EA9m {{ id() }}</h2>' })
class Product {
  id = input();
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    ${c}
    <router-outlet />
  \`,
})
class App {}

bootstrapApplication(App, {
  providers: [provideRouter([{ path: '', redirectTo: 'products/1', pathMatch: 'full' }, { path: 'products/:id', component: Product }], withComponentInputBinding())],
});
`},{id:`params-doi`,group:`Tham số`,title:`Đọc params một lần trong constructor`,level:`Dễ`,lv:1,waitMs:800,desc:`<p>\u0110i t\u1EEB <code>/products/1</code> sang <code>/products/2</code> th\xEC Router <b>d\xF9ng l\u1EA1i</b> component \u0111ang c\xF3 (c\xF9ng route, ch\u1EC9 kh\xE1c tham s\u1ED1). \u0110\u1ECDc <code>route.snapshot.paramMap.get('id')</code> trong constructor ch\u1EC9 l\u1EA5y \u0111\u01B0\u1EE3c gi\xE1 tr\u1ECB l\xFAc t\u1EA1o, n\xEAn trang \u0111\u1EE9ng y\xEAn \u1EDF s\u1EA3n ph\u1EA9m 1. H\xE3y \u0111\u1ECDc tham s\u1ED1 theo c\xE1ch ph\u1EA3n \u1EE9ng: <code>withComponentInputBinding()</code> + <code>id = input()</code>, ho\u1EB7c <code>toSignal(route.paramMap)</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> \u1EE9ng d\u1EE5ng m\u1EDF \u1EDF s\u1EA3n ph\u1EA9m 1; khi ki\u1EC3m tra, trang b\u1EA5m <b>SP 2</b>. Trang ph\u1EA3i hi\u1EC7n <code>S\u1EA3n ph\u1EA9m 2</code>.</p>`,starter:`@Component({ selector: 'app-product', template: '<h2 class="page">S\u1EA3n ph\u1EA9m {{ id }}</h2>' })
class Product {
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id'); // \u2757 ch\u1EC9 \u0111\u1ECDc m\u1ED9t l\u1EA7n
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    ${c}
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', redirectTo: 'products/1', pathMatch: 'full' },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,solution:`@Component({ selector: 'app-product', template: '<h2 class="page">S\u1EA3n ph\u1EA9m {{ id() }}</h2>' })
class Product {
  id = input();
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    ${c}
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', redirectTo: 'products/1', pathMatch: 'full' },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,hint:`Thêm withComponentInputBinding() vào provideRouter, trong Product thay dòng đọc snapshot bằng id = input(), và template dùng {{ id() }}.`,explain:`Cách khác: id = toSignal(inject(ActivatedRoute).paramMap.pipe(map(p => p.get("id")))). Snapshot chỉ an toàn khi chắc chắn component không bao giờ được dùng lại với tham số khác.`,simulate(t){t.at(400,()=>t.click(`SP 2`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());let e=g(t.text(`.page`));return e===`Sản phẩm 2`?i():s(`URL đã sang /products/2 nhưng trang vẫn hiện "`+e+`": component được dùng lại, giá trị đọc trong constructor không đổi.`)}},{id:`query-params`,group:`Tham số`,title:`Truyền query params đúng cách`,level:`Dễ`,lv:1,waitMs:800,desc:`<p>Vi\u1EBFt <code>routerLink="/products/3?tab=danh-gia"</code> th\xEC Router coi c\u1EA3 chu\u1ED7i l\xE0 \u0111\u01B0\u1EDDng d\u1EABn: d\u1EA5u <code>?</code> b\u1ECB m\xE3 ho\xE1 th\xE0nh <code>%3F</code> v\xE0 kh\xF4ng c\xF3 query param n\xE0o. Truy\u1EC1n query params ri\xEAng: <code>routerLink="/products/3" [queryParams]="{ tab: 'danh-gia' }"</code> (ho\u1EB7c <code>router.navigate([...], { queryParams })</code>).</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m link <b>Xem \u0111\xE1nh gi\xE1</b> th\xEC trang hi\u1EC7n <code>S\u1EA3n ph\u1EA9m 3 \xB7 tab danh-gia</code>.</p>`,starter:`@Component({ selector: 'app-product', template: '<h2 class="page">S\u1EA3n ph\u1EA9m {{ id() }} \xB7 tab {{ tab() ?? "mo-ta" }}</h2>' })
class Product {
  id = input();
  tab = input(); // query param ?tab=\u2026 c\u0169ng \u0111\u01B0\u1EE3c g\xE1n v\xE0o input c\xF9ng t\xEAn
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/products/3?tab=danh-gia">Xem \u0111\xE1nh gi\xE1</a>
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', component: Home },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,solution:`@Component({ selector: 'app-product', template: '<h2 class="page">S\u1EA3n ph\u1EA9m {{ id() }} \xB7 tab {{ tab() ?? "mo-ta" }}</h2>' })
class Product {
  id = input();
  tab = input();
}

@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/products/3" [queryParams]="{ tab: 'danh-gia' }">Xem \u0111\xE1nh gi\xE1</a>
    <router-outlet />
  \`,
})
class App {}

const routes = [
  { path: '', component: Home },
  { path: 'products/:id', component: Product },
];

bootstrapApplication(App, { providers: [provideRouter(routes, withComponentInputBinding())] });
`,hint:`\u0110\u1ED5i th\xE0nh <a routerLink="/products/3" [queryParams]="{ tab: 'danh-gia' }">.`,explain:`Tham số route (:id) dùng cho thứ xác định trang (sản phẩm nào); query params dùng cho trạng thái phụ của trang (tab, bộ lọc, trang số mấy). Thêm queryParamsHandling="merge" để giữ các query params đang có.`,simulate(t){t.at(300,()=>t.click(`Xem đánh giá`))},check(t){let e=g(t.text(`.page`));return e===`Sản phẩm 3 · tab danh-gia`?i():t.errors.length?s(`Có lỗi: `+t.errMsg()):s(`Trang đang hiện "`+e+`": dấu ? nằm trong routerLink bị coi là một phần của đường dẫn.`)}},{id:`route-con`,group:`Route lồng nhau`,title:`Route con cần <router-outlet> của cha`,level:`Dễ`,lv:1,waitMs:800,desc:`<p>Route c\xF3 <code>children</code> v\u1EBD component cha v\xE0o outlet c\u1EE7a \u1EE9ng d\u1EE5ng, c\xF2n component c\u1EE7a route con \u0111\u01B0\u1EE3c v\u1EBD v\xE0o <b><code>&lt;router-outlet&gt;</code> n\u1EB1m trong template c\u1EE7a cha</b>. Cha kh\xF4ng c\xF3 outlet th\xEC URL v\u1EABn \u0111\u1ED5i nh\u01B0ng n\u1ED9i dung con kh\xF4ng bao gi\u1EDD hi\u1EC7n, v\xE0 kh\xF4ng c\xF3 l\u1ED7i n\xE0o.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>B\u1EA3o m\u1EADt</b>; trang C\xE0i \u0111\u1EB7t ph\u1EA3i hi\u1EC7n <code>.child</code> v\u1EDBi ch\u1EEF <code>B\u1EA3o m\u1EADt</code>.</p>`,starter:`@Component({ selector: 'app-profile', template: '<p class="child">H\u1ED3 s\u01A1</p>' })
class Profile {}

@Component({ selector: 'app-security', template: '<p class="child">B\u1EA3o m\u1EADt</p>' })
class Security {}

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  template: \`
    <h2>C\xE0i \u0111\u1EB7t</h2>
    <a routerLink="profile">H\u1ED3 s\u01A1</a> \xB7 <a routerLink="security">B\u1EA3o m\u1EADt</a>
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
`,solution:`@Component({ selector: 'app-profile', template: '<p class="child">H\u1ED3 s\u01A1</p>' })
class Profile {}

@Component({ selector: 'app-security', template: '<p class="child">B\u1EA3o m\u1EADt</p>' })
class Security {}

@Component({
  selector: 'app-settings',
  imports: [RouterLink, RouterOutlet],
  template: \`
    <h2>C\xE0i \u0111\u1EB7t</h2>
    <a routerLink="profile">H\u1ED3 s\u01A1</a> \xB7 <a routerLink="security">B\u1EA3o m\u1EADt</a>
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
`,hint:`Trong Settings: thêm RouterOutlet vào imports và đặt <router-outlet /> dưới hàng link.`,explain:`routerLink="security" (không có / đầu) là đường dẫn tương đối với route hiện tại, nên từ /settings/profile nó dẫn tới /settings/security.`,simulate(t){t.at(400,()=>t.click(`Bảo mật`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());let e=t.query(`.child`).map(a=>g(a.textContent));return e.length?e.join(`|`)===`Bảo mật`?i():s(`Nội dung con đang là `+JSON.stringify(e)+`.`):s(`Không thấy nội dung của route con: Settings chưa có <router-outlet />.`)}},{id:`can-deactivate`,group:`Guard`,title:`Chặn rời trang khi chưa lưu: canDeactivate`,level:`Trung bình`,lv:2,waitMs:1e3,desc:`<p><code>canDeactivate</code> ch\u1EA1y khi r\u1EDDi m\u1ED9t route, nh\u1EADn <b>component</b> \u0111ang hi\u1EC3n th\u1ECB l\xE0m tham s\u1ED1 \u0111\u1EA7u. Tr\u1EA3 v\u1EC1 <code>false</code> th\xEC Router hu\u1EF7 \u0111i\u1EC1u h\u01B0\u1EDBng v\xE0 \u1EDF l\u1EA1i trang. (\u1EE8ng d\u1EE5ng th\u1EADt th\u01B0\u1EDDng h\u1ECFi x\xE1c nh\u1EADn b\u1EB1ng m\u1ED9t h\u1ED9p tho\u1EA1i.)</p>
<p><b>Y\xEAu c\u1EA7u:</b> tr\xEAn trang S\u1EEDa, g\xF5 v\xE0o \xF4 (form th\xE0nh "dirty") r\u1ED3i b\u1EA5m <b>Trang ch\u1EE7</b>: ph\u1EA3i \u1EDF l\u1EA1i trang S\u1EEDa. B\u1EA5m <b>L\u01B0u</b> r\u1ED3i b\u1EA5m <b>Trang ch\u1EE7</b>: \u0111\u01B0\u1EE3c r\u1EDDi \u0111i.</p>`,starter:`@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({
  selector: 'app-edit',
  template: \`
    <h2 class="page">S\u1EEDa b\xE0i vi\u1EBFt</h2>
    <input (input)="dirty.set(true)" aria-label="Ti\xEAu \u0111\u1EC1" />
    <button (click)="dirty.set(false)">L\u01B0u</button>
  \`,
})
class Edit {
  dirty = signal(false);
}

// TODO: guard kh\xF4ng cho r\u1EDDi trang khi component.dirty() l\xE0 true
const unsavedGuard = (component) => true;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: '<a routerLink="/home">Trang ch\u1EE7</a> <router-outlet />',
})
class App {}

const routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'edit', component: Edit },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,solution:`@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({
  selector: 'app-edit',
  template: \`
    <h2 class="page">S\u1EEDa b\xE0i vi\u1EBFt</h2>
    <input (input)="dirty.set(true)" aria-label="Ti\xEAu \u0111\u1EC1" />
    <button (click)="dirty.set(false)">L\u01B0u</button>
  \`,
})
class Edit {
  dirty = signal(false);
}

const unsavedGuard = (component) => {
  if (!component.dirty()) return true;
  log('Ch\u1EB7n r\u1EDDi trang: c\xF2n thay \u0111\u1ED5i ch\u01B0a l\u01B0u');
  return false;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: '<a routerLink="/home">Trang ch\u1EE7</a> <router-outlet />',
})
class App {}

const routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'edit', component: Edit, canDeactivate: [unsavedGuard] },
];

bootstrapApplication(App, { providers: [provideRouter(routes)] });
`,hint:`Guard: (component) => !component.dirty(). Gắn vào route: { path: 'edit', component: Edit, canDeactivate: [unsavedGuard] }.`,explain:`Guard còn có thể trả về Promise/Observable<boolean>, ví dụ mở hộp thoại xác nhận rồi trả kết quả người dùng chọn. Lưu ý canDeactivate không chặn được việc đóng tab; với việc đó cần sự kiện beforeunload.`,simulate(t){t.at(300,()=>t.type(0,`Tiêu đề mới`)),t.at(400,()=>t.click(`Trang chủ`)),t.at(600,()=>t.dom(e=>e.setAttribute(`data-p1`,g(e.querySelector(`.page`)?.textContent)))),t.at(650,()=>t.click(`Lưu`)),t.at(750,()=>t.click(`Trang chủ`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());let e=t.root()?.getAttribute(`data-p1`);if(e!==`Sửa bài viết`)return s(`Còn thay đổi chưa lưu mà vẫn rời được trang Sửa (đang ở "`+e+`").`);let a=g(t.text(`.page`));return a===`Trang chủ`?i():s(`Đã bấm Lưu mà vẫn không rời được trang (đang ở "`+a+`"): guard chỉ được chặn khi còn thay đổi.`)}},{id:`resolver`,group:`Dữ liệu`,title:`Có dữ liệu trước khi vẽ trang: resolver`,level:`Trung bình`,lv:2,waitMs:1300,desc:`<p>Component t\u1EF1 t\u1EA3i d\u1EEF li\u1EC7u trong constructor th\xEC lu\xF4n c\xF3 m\u1ED9t kho\u1EA3nh kh\u1EAFc trang tr\u1ED1ng "\u0110ang t\u1EA3i\u2026". V\u1EDBi <code>resolve: { user: userResolver }</code>, Router ch\u1EDD resolver xong m\u1EDBi k\xEDch ho\u1EA1t route, r\u1ED3i (v\u1EDBi <code>withComponentInputBinding()</code>) g\xE1n d\u1EEF li\u1EC7u v\xE0o <code>user = input()</code>. Resolver l\xE0 h\xE0m, ch\u1EA1y trong injection context n\xEAn g\u1ECDi \u0111\u01B0\u1EE3c <code>inject(HttpClient)</code>, \u0111\u1ECDc tham s\u1ED1 qua <code>route.paramMap</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>User 2</b>; ngay \u1EDF l\u1EA7n v\u1EBD \u0111\u1EA7u ti\xEAn, trang chi ti\u1EBFt \u0111\xE3 c\xF3 t\xEAn <code>User 2</code> (log <code>L\u1EA7n v\u1EBD \u0111\u1EA7u: \u2026</code> kh\xF4ng \u0111\u01B0\u1EE3c l\xE0 "\u0110ang t\u1EA3i\u2026"). Gi\u1EEF nguy\xEAn ph\u1EA7n log trong constructor.</p>`,starter:`@Component({ selector: 'app-home', template: '<h2>Danh s\xE1ch</h2>' })
class Home {}

@Component({
  selector: 'app-user-detail',
  template: \`
    @if (user(); as u) { <h2 class="page">{{ u.name }}</h2> } @else { <p class="page">\u0110ang t\u1EA3i\u2026</p> }
  \`,
})
class UserDetail {
  id = input();
  private http = inject(HttpClient);
  user = toSignal(toObservable(this.id).pipe(switchMap((id) => this.http.get('/api/users/' + id))));

  constructor() {
    const el = inject(ElementRef).nativeElement;
    afterNextRender(() => log('L\u1EA7n v\u1EBD \u0111\u1EA7u: ' + el.textContent.trim()));
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
`,solution:`@Component({ selector: 'app-home', template: '<h2>Danh s\xE1ch</h2>' })
class Home {}

const userResolver = (route) => inject(HttpClient).get('/api/users/' + route.paramMap.get('id'));

@Component({
  selector: 'app-user-detail',
  template: \`
    @if (user(); as u) { <h2 class="page">{{ u.name }}</h2> } @else { <p class="page">\u0110ang t\u1EA3i\u2026</p> }
  \`,
})
class UserDetail {
  user = input(); // nh\u1EADn t\u1EEB resolve: { user: userResolver }

  constructor() {
    const el = inject(ElementRef).nativeElement;
    afterNextRender(() => log('L\u1EA7n v\u1EBD \u0111\u1EA7u: ' + el.textContent.trim()));
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
`,hint:`const userResolver = (route) => inject(HttpClient).get('/api/users/' + route.paramMap.get('id')); thêm resolve: { user: userResolver } vào route, và trong UserDetail chỉ cần user = input().`,explain:`Resolver làm điều hướng chờ dữ liệu, nên người dùng cần thấy là "đang chuyển trang" (bài tiếp theo). Nếu resolver lỗi, điều hướng bị huỷ; hãy bắt lỗi trong resolver và trả về giá trị dự phòng hoặc RedirectCommand.`,simulate(t){t.at(300,()=>t.click(`User 2`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());let e=t.logs.find(a=>a.startsWith(`Lần vẽ đầu:`));return e?e.includes(`User 2`)?g(t.text(`.page`))===`User 2`?i():s(`Trang chi tiết chưa hiện tên User 2.`):s(`Lần vẽ đầu của trang chi tiết là "`+e.replace(`Lần vẽ đầu: `,``)+`": dữ liệu chưa có khi trang được vẽ.`):s(`Không thấy log "Lần vẽ đầu: …": giữ nguyên afterNextRender trong constructor của UserDetail.`)}},{id:`loading`,group:`Dữ liệu`,title:`Báo đang chuyển trang: sự kiện của Router`,level:`Khó`,lv:3,waitMs:1400,desc:`<p>Resolver ch\u1EADm l\xE0m \u0111i\u1EC1u h\u01B0\u1EDBng "\u0111\u1EE9ng h\xECnh": b\u1EA5m link xong kh\xF4ng c\xF3 g\xEC x\u1EA3y ra cho t\u1EDBi khi d\u1EEF li\u1EC7u v\u1EC1. H\xE3y hi\u1EC7n thanh b\xE1o \u0111ang t\u1EA3i d\u1EF1a tr\xEAn <code>router.events</code>: b\u1EADt khi c\xF3 <code>NavigationStart</code>, t\u1EAFt khi c\xF3 <code>NavigationEnd</code>, <code>NavigationCancel</code> ho\u1EB7c <code>NavigationError</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>B\xE1o c\xE1o</b> (resolver m\u1EA5t kho\u1EA3ng 600ms): trong l\xFAc ch\u1EDD ph\u1EA3i c\xF3 <code>.loading</code>; khi trang B\xE1o c\xE1o hi\u1EC7n ra th\xEC <code>.loading</code> bi\u1EBFn m\u1EA5t.</p>`,starter:`@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({ selector: 'app-report', template: '<h2 class="page">B\xE1o c\xE1o: {{ data() }}</h2>' })
class Report {
  data = input();
}

const slowResolver = () => timer(600).pipe(map(() => 'doanh thu th\xE1ng 11'));

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/report">B\xE1o c\xE1o</a>
    <!-- TODO: hi\u1EC7n <div class="loading">\u0110ang chuy\u1EC3n trang\u2026</div> trong l\xFAc \u0111i\u1EC1u h\u01B0\u1EDBng -->
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
`,solution:`@Component({ selector: 'app-home', template: '<h2 class="page">Trang ch\u1EE7</h2>' })
class Home {}

@Component({ selector: 'app-report', template: '<h2 class="page">B\xE1o c\xE1o: {{ data() }}</h2>' })
class Report {
  data = input();
}

const slowResolver = () => timer(600).pipe(map(() => 'doanh thu th\xE1ng 11'));

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a routerLink="/report">B\xE1o c\xE1o</a>
    @if (loading()) { <div class="loading">\u0110ang chuy\u1EC3n trang\u2026</div> }
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
`,hint:`loading = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError), map(e => e instanceof NavigationStart)), { initialValue: false }); rồi @if (loading()) { <div class="loading">…</div> }.`,explain:`Nhớ tắt cả khi điều hướng bị huỷ (guard trả false) hoặc lỗi, nếu không thanh tải sẽ quay mãi. Có thể chỉ hiện thanh sau khoảng 150ms để điều hướng nhanh không bị nháy.`,simulate(t){t.at(300,()=>t.click(`Báo cáo`)),t.at(600,()=>t.dom(e=>e.setAttribute(`data-l1`,e.querySelector(`.loading`)?`1`:`0`)))},check(t){return t.errors.length?s(`Có lỗi: `+t.errMsg()):t.root()?.getAttribute(`data-l1`)!==`1`?s(`Trong lúc resolver đang chạy chưa thấy .loading.`):g(t.text(`.page`))!==`Báo cáo: doanh thu tháng 11`?s(`Trang Báo cáo chưa hiện ra.`):t.query(`.loading`).length?s(`Trang đã hiện mà .loading vẫn còn: cần tắt khi có NavigationEnd.`):i()}}],extras:()=>Promise.all([import(`./chunk-41J4kvEN.js`).then(t=>t.routerExtras()),import(`./chunk-q2xFomU3.js`).then(t=>t.httpExtras())]).then(([t,e])=>r(r({},e),t)),cheatsheet:[[`Tham số luôn mới`,`<code>withComponentInputBinding()</code> + <code>id = input()</code>`],[`Query params`,`<code>routerLink="/p/3" [queryParams]="{ tab: 'x' }"</code>`],[`Route con`,`<code>children: [...]</code> + <code>&lt;router-outlet /&gt;</code> trong cha`],[`Chặn rời trang`,`<code>canDeactivate: [(c) =&gt; !c.dirty()]</code>`],[`Dữ liệu trước khi vẽ`,`<code>resolve: { user: (route) =&gt; inject(HttpClient).get(…) }</code>`],[`Đang chuyển trang`,`<code>router.events</code>: NavigationStart → End/Cancel/Error`]]};export{u as LAB};