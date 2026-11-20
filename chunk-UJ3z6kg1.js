import{a as s$1,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var s={title:`Dependency Injection`,subtitle:`bài luyện DI trên component thật: service dùng chung, providers ở component, lỗi thiếu provider, InjectionToken, injection context, useClass.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Viết service bằng <code>&#64;Service()</code> (tự cung cấp ở root) hoặc <code>&#64;Injectable()</code> + <code>providers</code>, rồi lấy nó bằng <code>inject()</code> trong component. Thử thêm <code>providers</code> ở component để xem phạm vi thay đổi thế nào.</p>`,starter:`@Service()
class Greeter {
  greet(name) {
    return 'Xin ch\xE0o, ' + name + '!';
  }
}

@Component({
  selector: 'app-root',
  template: '<p>{{ greeter.greet("B\xEDp") }}</p>',
})
class Root {
  greeter = inject(Greeter);
}

mount(Root);
`},{id:`service-dung-chung`,group:`Service`,title:`Dùng chung một service: inject() thay vì new`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>T\u1EF1 <code>new CartService()</code> trong m\u1ED7i component th\xEC m\u1ED7i n\u01A1i c\xF3 m\u1ED9t gi\u1ECF h\xE0ng ri\xEAng. \u0110\xE1nh d\u1EA5u class b\u1EB1ng <code>&#64;Service()</code> (\u0111\u01B0\u1EE3c cung c\u1EA5p \u1EDF root injector) r\u1ED3i l\u1EA5y b\u1EB1ng <code>inject(CartService)</code> th\xEC m\u1ECDi component nh\u1EADn <b>c\xF9ng m\u1ED9t instance</b>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm \xC1o</b> v\xE0 <b>Th\xEAm M\u0169</b>; huy hi\u1EC7u gi\u1ECF h\xE0ng ph\u1EA3i l\xE0 <code>\u{1F6D2} 2</code>.</p>`,starter:`// TODO: bi\u1EBFn class n\xE0y th\xE0nh service \u0111\u01B0\u1EE3c cung c\u1EA5p \u1EDF root
class CartService {
  items = signal([]);
  count = computed(() => this.items().length);

  add(name) {
    this.items.update(list => [...list, name]);
  }
}

@Component({
  selector: 'app-cart-badge',
  template: '<p class="badge">\u{1F6D2} {{ cart.count() }}</p>',
})
class CartBadge {
  // \u2757 t\u1EF1 new \u2192 m\u1ED7i component m\u1ED9t gi\u1ECF ri\xEAng
  cart = new CartService();
}

@Component({
  selector: 'app-product-list',
  template: \`
    <button (click)="cart.add('\xC1o')">Th\xEAm \xC1o</button>
    <button (click)="cart.add('M\u0169')">Th\xEAm M\u0169</button>
  \`,
})
class ProductList {
  cart = new CartService();
}

@Component({
  selector: 'app-root',
  imports: [CartBadge, ProductList],
  template: '<app-cart-badge /><app-product-list />',
})
class Root {}

mount(Root);
`,solution:`@Service()
class CartService {
  items = signal([]);
  count = computed(() => this.items().length);

  add(name) {
    this.items.update(list => [...list, name]);
  }
}

@Component({
  selector: 'app-cart-badge',
  template: '<p class="badge">\u{1F6D2} {{ cart.count() }}</p>',
})
class CartBadge {
  cart = inject(CartService);
}

@Component({
  selector: 'app-product-list',
  template: \`
    <button (click)="cart.add('\xC1o')">Th\xEAm \xC1o</button>
    <button (click)="cart.add('M\u0169')">Th\xEAm M\u0169</button>
  \`,
})
class ProductList {
  cart = inject(CartService);
}

@Component({
  selector: 'app-root',
  imports: [CartBadge, ProductList],
  template: '<app-cart-badge /><app-product-list />',
})
class Root {}

mount(Root);
`,hint:`Thêm @Service() trên CartService, rồi đổi cả hai chỗ new CartService() thành inject(CartService).`,explain:`@Service() là cách viết gọn của Angular 22 cho @Injectable({ providedIn: "root" }). Ngoài việc dùng chung, inject() còn cho phép thay service bằng bản giả khi test.`,simulate(e){e.at(100,()=>e.click(`Thêm Áo`)),e.at(200,()=>e.click(`Thêm Mũ`))},check(e){let t=e.text(`.badge`);return t===`🛒 2`?i():t===`🛒 0`?s$1(`Đã thêm 2 món nhưng huy hiệu vẫn 0: hai component đang dùng hai giỏ khác nhau.`):s$1(`Huy hiệu đang là "`+t+`", cần "🛒 2".`)}},{id:`providers-component`,group:`Phạm vi`,title:`Mỗi component một instance: providers`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>Service \u1EDF root l\xE0 m\u1ED9t instance cho c\u1EA3 app. Mu\u1ED1n <b>m\u1ED7i</b> <code>&lt;app-counter&gt;</code> c\xF3 service ri\xEAng (v\xED d\u1EE5 state c\u1EE7a t\u1EEBng widget), khai b\xE1o <code>providers: [CounterService]</code> trong component: m\u1ED7i instance component t\u1EA1o m\u1ED9t instance service m\u1EDBi.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m +1 hai l\u1EA7n \u1EDF b\u1ED9 \u0111\u1EBFm th\u1EE9 nh\u1EA5t, m\u1ED9t l\u1EA7n \u1EDF b\u1ED9 \u0111\u1EBFm th\u1EE9 hai. K\u1EBFt qu\u1EA3 ph\u1EA3i l\xE0 <code>2</code> v\xE0 <code>1</code>.</p>`,starter:`@Service()
class CounterService {
  n = signal(0);
  inc() {
    this.n.update(v => v + 1);
  }
}

@Component({
  selector: 'app-counter',
  // TODO: m\u1ED7i <app-counter> c\u1EA7n m\u1ED9t CounterService ri\xEAng
  template: '<p class="n">{{ counter.n() }}</p><button (click)="counter.inc()">+1</button>',
})
class Counter {
  counter = inject(CounterService);
}

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: '<app-counter /><app-counter />',
})
class Root {}

mount(Root);
`,solution:`@Service()
class CounterService {
  n = signal(0);
  inc() {
    this.n.update(v => v + 1);
  }
}

@Component({
  selector: 'app-counter',
  providers: [CounterService],
  template: '<p class="n">{{ counter.n() }}</p><button (click)="counter.inc()">+1</button>',
})
class Counter {
  counter = inject(CounterService);
}

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: '<app-counter /><app-counter />',
})
class Root {}

mount(Root);
`,hint:`Thêm providers: [CounterService] vào metadata của Counter.`,explain:`Injector tìm từ component lên trên: gặp provider gần nhất thì dùng. Ngược lại, lỡ thêm providers vào component trong khi muốn dùng chung là lỗi rất hay gặp: state "tự nhiên" không còn chia sẻ.`,simulate(e){e.at(100,()=>e.clickSel(`app-counter button`,0)),e.at(200,()=>e.clickSel(`app-counter button`,0)),e.at(300,()=>e.clickSel(`app-counter button`,1))},check(e){let t=e.query(`app-counter .n`).map(r=>g(r.textContent));return JSON.stringify(t)===`["2","1"]`?i():t[0]===t[1]?s$1(`Hai bộ đếm luôn bằng nhau (`+t[0]+`): đang dùng chung CounterService ở root.`):s$1(`Hai bộ đếm đang là `+JSON.stringify(t)+`, cần ["2", "1"].`)}},{id:`thieu-provider`,group:`Service`,title:`Lỗi thiếu provider`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Angular ch\u1EC9 inject \u0111\u01B0\u1EE3c th\u1EE9 \u0111\xE3 \u0111\u01B0\u1EE3c <b>cung c\u1EA5p</b> (provide) \u1EDF \u0111\xE2u \u0111\xF3: <code>&#64;Service()</code>/<code>&#64;Injectable({ providedIn: 'root' })</code>, ho\u1EB7c <code>providers</code> c\u1EE7a component/route/app. Thi\u1EBFu th\xEC g\u1EB7p l\u1ED7i kh\xF4ng t\u1EA1o \u0111\u01B0\u1EE3c dependency.</p>
<p><b>Y\xEAu c\u1EA7u:</b> s\u1EEDa \u0111\u1EC3 <code>Root</code> l\u1EA5y \u0111\u01B0\u1EE3c <code>Clock</code> v\xE0 hi\u1EC3n th\u1ECB <code>B\xE2y gi\u1EDD l\xE0 09:00</code>.</p>`,starter:`// \u2757 ch\u01B0a \u0111\u01B0\u1EE3c cung c\u1EA5p \u1EDF \u0111\xE2u c\u1EA3
class Clock {
  now() {
    return '09:00';
  }
}

@Component({
  selector: 'app-root',
  template: '<p class="time">B\xE2y gi\u1EDD l\xE0 {{ clock.now() }}</p>',
})
class Root {
  clock = inject(Clock);
}

mount(Root);
`,solution:`@Service()
class Clock {
  now() {
    return '09:00';
  }
}

@Component({
  selector: 'app-root',
  template: '<p class="time">B\xE2y gi\u1EDD l\xE0 {{ clock.now() }}</p>',
})
class Root {
  clock = inject(Clock);
}

mount(Root);
`,hint:`Thêm @Service() trên class Clock (hoặc providers: [Clock] trong Root nếu Clock có @Injectable()).`,explain:`Lỗi dạng "No provider for X" / NullInjectorError: đọc kỹ chuỗi injector trong thông báo (bản dev) để biết Angular đã tìm ở đâu. Service dùng chung cả app thì để ở root là đơn giản nhất.`,check(e){if(e.errors.length)return s$1(`Có lỗi: `+e.errMsg()+`.`);let t=e.text(`.time`);return t===`Bây giờ là 09:00`?i():s$1(`Đang hiển thị "`+t+`", cần "Bây giờ là 09:00".`)}},{id:`injection-token`,group:`Cấu hình`,title:`Giá trị cấu hình: InjectionToken`,level:`Trung bình`,lv:2,waitMs:500,desc:`<p>Gi\xE1 tr\u1ECB kh\xF4ng ph\u1EA3i class (URL API, c\u1EDD t\xEDnh n\u0103ng\u2026) c\u1EA7n m\u1ED9t <b>kho\xE1</b> \u0111\u1EC3 inject. D\xF9ng chu\u1ED7i tr\u1EA7n l\xE0m kho\xE1 d\u1EC5 tr\xF9ng v\xE0 m\u1EA5t ki\u1EC3m tra ki\u1EC3u. H\xE3y t\u1EA1o <code>new InjectionToken('API_URL')</code>, cung c\u1EA5p b\u1EB1ng <code>{ provide: API_URL, useValue: \u2026 }</code> v\xE0 l\u1EA5y b\u1EB1ng <code>inject(API_URL)</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> thay kho\xE1 chu\u1ED7i b\u1EB1ng <code>InjectionToken</code>; trang v\u1EABn hi\u1EC3n th\u1ECB <code>API: https://api.bip.dev</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  providers: [{ provide: 'API_URL', useValue: 'https://api.bip.dev' }],
  template: '<p class="url">API: {{ apiUrl }}</p>',
})
class Root {
  // \u2757 chu\u1ED7i tr\u1EA7n l\xE0m kho\xE1 DI
  apiUrl = inject('API_URL');
}

mount(Root);
`,solution:`const API_URL = new InjectionToken('API_URL');

@Component({
  selector: 'app-root',
  providers: [{ provide: API_URL, useValue: 'https://api.bip.dev' }],
  template: '<p class="url">API: {{ apiUrl }}</p>',
})
class Root {
  apiUrl = inject(API_URL);
}

mount(Root);
`,hint:`const API_URL = new InjectionToken('API_URL'); rồi dùng API_URL ở cả provide lẫn inject().`,explain:`Trong TypeScript: new InjectionToken<string>('API_URL') để inject(API_URL) có kiểu string. Token còn có thể tự cung cấp giá trị mặc định: new InjectionToken('API_URL', { factory: () => 'https://…' }).`,check(e,t){return e.errors.length?s$1(`Có lỗi: `+e.errMsg()+`.`):e.text(`.url`)!==`API: https://api.bip.dev`?s$1(`Trang cần hiển thị "API: https://api.bip.dev".`):/new\s+InjectionToken\s*\(/.test(t)?/inject\s*\(\s*['"]/.test(t)||/provide\s*:\s*['"]/.test(t)?s$1(`Vẫn còn chỗ dùng chuỗi trần làm khoá DI.`):i():s$1(`Kết quả đúng nhưng vẫn dùng chuỗi làm khoá. Hãy tạo một InjectionToken.`)}},{id:`inject-context`,group:`Service`,title:`inject() chỉ dùng trong injection context`,level:`Dễ`,lv:1,waitMs:500,desc:`<p><code>inject()</code> ch\u1EC9 ch\u1EA1y \u0111\u01B0\u1EE3c khi Angular \u0111ang t\u1EA1o \u0111\u1ED1i t\u01B0\u1EE3ng: field initializer, constructor, factory c\u1EE7a provider. G\u1ECDi trong method (l\xFAc ng\u01B0\u1EDDi d\xF9ng b\u1EA5m n\xFAt) s\u1EBD g\u1EB7p l\u1ED7i <code>NG0203</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>L\u01B0u</b>; log ph\u1EA3i c\xF3 <code>[info] \u0110\xE3 l\u01B0u</code> v\xE0 kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:`@Service()
class Logger {
  info(msg) {
    log('[info] ' + msg);
  }
}

@Component({
  selector: 'app-root',
  template: '<button (click)="save()">L\u01B0u</button>',
})
class Root {
  save() {
    // \u2757 l\xFAc ng\u01B0\u1EDDi d\xF9ng b\u1EA5m n\xFAt kh\xF4ng c\xF2n injection context
    const logger = inject(Logger);
    logger.info('\u0110\xE3 l\u01B0u');
  }
}

mount(Root);
`,solution:`@Service()
class Logger {
  info(msg) {
    log('[info] ' + msg);
  }
}

@Component({
  selector: 'app-root',
  template: '<button (click)="save()">L\u01B0u</button>',
})
class Root {
  logger = inject(Logger);

  save() {
    this.logger.info('\u0110\xE3 l\u01B0u');
  }
}

mount(Root);
`,hint:`Chuyển inject(Logger) lên thành field: logger = inject(Logger); rồi trong save() gọi this.logger.info(...).`,explain:`Trong TypeScript thường viết private readonly logger = inject(Logger). Cần inject "muộn" (trong callback) thì lấy Injector trước bằng inject(Injector), rồi injector.get(X) hoặc runInInjectionContext(injector, …).`,simulate(e){e.at(150,()=>e.click(`Lưu`))},check(e){return e.errors.length?s$1(`Có lỗi: `+e.errMsg()+`.`):e.logs.includes(`[info] Đã lưu`)?i():s$1(`Bấm Lưu nhưng log chưa có "[info] Đã lưu".`)}},{id:`use-class`,group:`Cấu hình`,title:`Đổi implementation: useClass`,level:`Khó`,lv:3,waitMs:500,desc:`<p>Component ph\u1EE5 thu\u1ED9c v\xE0o m\u1ED9t <b>h\u1EE3p \u0111\u1ED3ng</b> (<code>StorageService</code>) ch\u1EE9 kh\xF4ng ph\u1EE5 thu\u1ED9c v\xE0o c\xE1ch c\xE0i \u0111\u1EB7t c\u1EE5 th\u1EC3. <code>{ provide: StorageService, useClass: MemoryStorage }</code> b\u1EA3o Angular: ai xin <code>StorageService</code> th\xEC \u0111\u01B0a <code>MemoryStorage</code>. \u0110\xE2y l\xE0 c\xE1ch thay b\u1EA3n gi\u1EA3 khi test, ho\u1EB7c \u0111\u1ED5i n\u01A1i l\u01B0u m\xE0 kh\xF4ng s\u1EEDa component.</p>
<p><b>Y\xEAu c\u1EA7u:</b> kh\xF4ng s\u1EEDa class <code>Settings</code>; khi ki\u1EC3m tra, trang b\u1EA5m <b>L\u01B0u c\xE0i \u0111\u1EB7t</b> v\xE0 log ph\u1EA3i c\xF3 <code>MemoryStorage.save theme dark</code>.</p>`,starter:`// "H\u1EE3p \u0111\u1ED3ng" m\xE0 component d\xF9ng
class StorageService {
  save(key, value) {
    throw new Error('StorageService ch\u01B0a \u0111\u01B0\u1EE3c c\xE0i \u0111\u1EB7t');
  }
}

@Service()
class MemoryStorage {
  data = new Map();
  save(key, value) {
    this.data.set(key, value);
    log('MemoryStorage.save', key, value);
  }
}

@Component({
  selector: 'app-settings',
  // TODO: cho StorageService d\xF9ng MemoryStorage (kh\xF4ng s\u1EEDa ph\u1EA7n class Settings)
  template: '<button (click)="save()">L\u01B0u c\xE0i \u0111\u1EB7t</button>',
})
class Settings {
  storage = inject(StorageService);

  save() {
    this.storage.save('theme', 'dark');
  }
}

mount(Settings);
`,solution:`// "H\u1EE3p \u0111\u1ED3ng" m\xE0 component d\xF9ng
class StorageService {
  save(key, value) {
    throw new Error('StorageService ch\u01B0a \u0111\u01B0\u1EE3c c\xE0i \u0111\u1EB7t');
  }
}

@Service()
class MemoryStorage {
  data = new Map();
  save(key, value) {
    this.data.set(key, value);
    log('MemoryStorage.save', key, value);
  }
}

@Component({
  selector: 'app-settings',
  providers: [{ provide: StorageService, useClass: MemoryStorage }],
  template: '<button (click)="save()">L\u01B0u c\xE0i \u0111\u1EB7t</button>',
})
class Settings {
  storage = inject(StorageService);

  save() {
    this.storage.save('theme', 'dark');
  }
}

mount(Settings);
`,hint:`providers: [{ provide: StorageService, useClass: MemoryStorage }]`,explain:`Trong TypeScript, StorageService thường là abstract class (vừa làm kiểu, vừa làm token DI). Ngoài useClass còn có useValue (giá trị có sẵn), useFactory (tự tạo) và useExisting (trỏ tới provider khác).`,simulate(e){e.at(150,()=>e.click(`Lưu cài đặt`))},check(e,t){return e.errors.length?s$1(`Có lỗi: `+e.errMsg()+`.`):e.logs.includes(`MemoryStorage.save theme dark`)?/storage\s*=\s*inject\(\s*StorageService\s*\)/.test(t)?i():s$1(`Đừng sửa class Settings: nó vẫn phải inject(StorageService).`):s$1(`Bấm Lưu nhưng log chưa có "MemoryStorage.save theme dark".`)}}],cheatsheet:[[`Service dùng chung cả app`,`<code>&#64;Service()</code> (= <code>&#64;Injectable({ providedIn: 'root' })</code>)`],[`Lấy dependency`,`<code>x = inject(X)</code> ở field hoặc constructor; không <code>new X()</code>`],[`Mỗi component một instance`,`<code>providers: [X]</code> trong <code>&#64;Component</code>`],[`Giá trị cấu hình`,`<code>new InjectionToken('X')</code> + <code>{ provide: X, useValue }</code>`],[`Đổi cách cài đặt / bản giả khi test`,`<code>{ provide: A, useClass: B }</code>, <code>useFactory</code>, <code>useExisting</code>`],[`Lỗi NG0203`,`đưa <code>inject()</code> ra field/constructor, hoặc dùng <code>runInInjectionContext</code>`]]};export{s as LAB};