import{a as s,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var a={title:`DI nâng cao`,subtitle:`bài luyện cấu hình dependency: multi provider, useExisting, token có factory, skipSelf, useFactory, provider ở cấp component.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Th\u1EED c\xE1c ki\u1EC3u provider: <code>useValue</code>, <code>useClass</code>, <code>useExisting</code>, <code>useFactory</code>, <code>multi: true</code>, v\xE0 c\xE1c tu\u1EF3 ch\u1ECDn c\u1EE7a <code>inject()</code>: <code>optional</code>, <code>self</code>, <code>skipSelf</code>, <code>host</code>.</p>
<div class="tip">Provider \u0111\u1EB7t \u1EDF <code>providers</code> c\u1EE7a component (c\xE2y injector c\u1EE7a component) ho\u1EB7c \u1EDF <code>bootstrapApplication(App, { providers })</code> (root).</div>`,starter:`const GREETING = new InjectionToken('GREETING', { factory: () => 'Xin ch\xE0o' });

@Component({
  selector: 'app-hello',
  template: '<p>{{ greeting }}, B\xEDp!</p>',
})
class Hello {
  greeting = inject(GREETING);
}

@Component({
  selector: 'app-root',
  imports: [Hello],
  providers: [{ provide: GREETING, useValue: 'Ch\xE0o bu\u1ED5i s\xE1ng' }],
  template: '<app-hello />',
})
class App {}

mount(App);
`},{id:`multi`,group:`Kiểu provider`,title:`Nhiều provider cho một token: multi: true`,level:`Dễ`,lv:1,waitMs:400,desc:`<p>B\xECnh th\u01B0\u1EDDng, provider \u0111\u0103ng k\xFD sau <b>ghi \u0111\xE8</b> provider tr\u01B0\u1EDBc c\u1EE7a c\xF9ng token. V\u1EDBi <code>multi: true</code>, Angular gom t\u1EA5t c\u1EA3 v\xE0o m\u1ED9t m\u1EA3ng, n\xEAn m\u1ED7i t\xEDnh n\u0103ng t\u1EF1 "\u0111\u0103ng k\xFD th\xEAm" \u0111\u01B0\u1EE3c m\xE0 kh\xF4ng c\u1EA7n bi\u1EBFt c\xE1c t\xEDnh n\u0103ng kh\xE1c (\u0111\xE2y l\xE0 c\xE1ch <code>HTTP_INTERCEPTORS</code>, validator c\u1EE7a form ho\u1EA1t \u0111\u1ED9ng).</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang thanh to\xE1n hi\u1EC7n \u0111\u1EE7 3 ph\u01B0\u01A1ng th\u1EE9c <code>Th\u1EBB</code>, <code>Chuy\u1EC3n kho\u1EA3n</code>, <code>V\xED</code> theo \u0111\xFAng th\u1EE9 t\u1EF1.</p>`,starter:`const PAYMENT_METHODS = new InjectionToken('PAYMENT_METHODS');

@Component({
  selector: 'app-root',
  providers: [
    { provide: PAYMENT_METHODS, useValue: 'Th\u1EBB' },
    { provide: PAYMENT_METHODS, useValue: 'Chuy\u1EC3n kho\u1EA3n' },
    { provide: PAYMENT_METHODS, useValue: 'V\xED' },
  ],
  template: \`
    <h3>Ch\u1ECDn c\xE1ch thanh to\xE1n</h3>
    @for (m of methods; track m) { <label class="method"><input type="radio" name="pay" /> {{ m }}</label> }
  \`,
})
class App {
  methods = [].concat(inject(PAYMENT_METHODS));
}

mount(App);
`,solution:`const PAYMENT_METHODS = new InjectionToken('PAYMENT_METHODS');

@Component({
  selector: 'app-root',
  providers: [
    { provide: PAYMENT_METHODS, useValue: 'Th\u1EBB', multi: true },
    { provide: PAYMENT_METHODS, useValue: 'Chuy\u1EC3n kho\u1EA3n', multi: true },
    { provide: PAYMENT_METHODS, useValue: 'V\xED', multi: true },
  ],
  template: \`
    <h3>Ch\u1ECDn c\xE1ch thanh to\xE1n</h3>
    @for (m of methods; track m) { <label class="method"><input type="radio" name="pay" /> {{ m }}</label> }
  \`,
})
class App {
  methods = inject(PAYMENT_METHODS); // multi \u2192 lu\xF4n l\xE0 m\u1EA3ng
}

mount(App);
`,hint:`Thêm multi: true vào cả ba provider. Khi đó inject(PAYMENT_METHODS) trả về mảng.`,explain:`Mọi provider của một token multi đều phải có multi: true; trộn provider thường và multi cho cùng token sẽ báo lỗi. Trong dự án, mỗi tính năng có thể tự thêm phương thức của mình bằng một hàm provideXxx().`,check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg());let t=e.query(`.method`).map(n=>g(n.textContent));return t.join(`|`)===`Thẻ|Chuyển khoản|Ví`?i():s(`Đang hiện `+JSON.stringify(t)+`: provider sau ghi đè provider trước.`)}},{id:`use-existing`,group:`Kiểu provider`,title:`Bí danh dùng chung instance: useExisting`,level:`Trung bình`,lv:2,waitMs:500,desc:`<p>Code c\u0169 inject <code>AppLogger</code>, code m\u1EDBi inject <code>Logger</code>. <code>{ provide: AppLogger, useClass: Logger }</code> t\u1EA1o <b>instance th\u1EE9 hai</b> c\u1EE7a Logger, n\xEAn hai n\u01A1i \u0111\u1EBFm ri\xEAng. Mu\u1ED1n token n\xE0y l\xE0 b\xED danh c\u1EE7a token kia (c\xF9ng m\u1ED9t instance), d\xF9ng <code>useExisting</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> sau khi c\u1EA3 hai component ghi log, c\u1EA3 hai d\xF2ng \u0111\u1EC1u hi\u1EC7n <code>T\u1ED5ng log: 2</code>.</p>`,starter:`@Injectable()
class Logger {
  count = signal(0);
  log(msg) { this.count.update((n) => n + 1); }
}

/** token c\u0169, code tr\u01B0\u1EDBc \u0111\xE2y inject c\xE1i n\xE0y */
@Injectable()
class AppLogger {}

@Component({ selector: 'app-new-feature', template: '<p class="total">T\xEDnh n\u0103ng m\u1EDBi, t\u1ED5ng log: {{ logger.count() }}</p>' })
class NewFeature {
  logger = inject(Logger);
  constructor() { this.logger.log('m\u1EDBi'); }
}

@Component({ selector: 'app-old-feature', template: '<p class="total">T\xEDnh n\u0103ng c\u0169, t\u1ED5ng log: {{ logger.count() }}</p>' })
class OldFeature {
  logger = inject(AppLogger);
  constructor() { this.logger.log('c\u0169'); }
}

@Component({
  selector: 'app-root',
  imports: [NewFeature, OldFeature],
  providers: [Logger, { provide: AppLogger, useClass: Logger }],
  template: '<app-new-feature /><app-old-feature />',
})
class App {}

mount(App);
`,solution:`@Injectable()
class Logger {
  count = signal(0);
  log(msg) { this.count.update((n) => n + 1); }
}

/** token c\u0169, code tr\u01B0\u1EDBc \u0111\xE2y inject c\xE1i n\xE0y */
@Injectable()
class AppLogger {}

@Component({ selector: 'app-new-feature', template: '<p class="total">T\xEDnh n\u0103ng m\u1EDBi, t\u1ED5ng log: {{ logger.count() }}</p>' })
class NewFeature {
  logger = inject(Logger);
  constructor() { this.logger.log('m\u1EDBi'); }
}

@Component({ selector: 'app-old-feature', template: '<p class="total">T\xEDnh n\u0103ng c\u0169, t\u1ED5ng log: {{ logger.count() }}</p>' })
class OldFeature {
  logger = inject(AppLogger);
  constructor() { this.logger.log('c\u0169'); }
}

@Component({
  selector: 'app-root',
  imports: [NewFeature, OldFeature],
  providers: [Logger, { provide: AppLogger, useExisting: Logger }],
  template: '<app-new-feature /><app-old-feature />',
})
class App {}

mount(App);
`,hint:`Đổi useClass: Logger thành useExisting: Logger.`,explain:`useExisting cũng hay dùng để một component tự cung cấp mình dưới một token chung: providers: [{ provide: FORM_FIELD, useExisting: forwardRef(() => MyInput) }].`,check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg());let t=e.query(`.total`).map(n=>g(n.textContent).split(`: `)[1]);return t.join(`|`)===`2|2`?i():s(`Hai dòng đang hiện tổng log `+t.join(` và `)+`: đang có hai instance Logger riêng.`)}},{id:`token-factory`,group:`InjectionToken`,title:`Token có giá trị mặc định: factory`,level:`Dễ`,lv:1,waitMs:400,desc:`<p><code>new InjectionToken('THEME', { factory: () =&gt; 's\xE1ng' })</code> t\u1EA1o token c\xF3 s\u1EB5n gi\xE1 tr\u1ECB m\u1EB7c \u0111\u1ECBnh \u1EDF root: kh\xF4ng ai provide th\xEC <code>inject(THEME)</code> v\u1EABn ra <code>'s\xE1ng'</code>, ai c\u1EA7n kh\xE1c th\xEC provide \u0111\xE8. \u0110\u1EEBng d\xF9ng <code>inject(THEME, { optional: true })</code> r\u1ED3i t\u1EF1 x\u1EED l\xFD <code>null</code> \u1EDF kh\u1EAFp n\u01A1i: c\xE1ch \u0111\xF3 che m\u1EA5t l\u1ED7i c\u1EA5u h\xECnh th\u1EADt.</p>
<p><b>Y\xEAu c\u1EA7u:</b> kh\xF4ng th\xEAm provider n\xE0o, trang hi\u1EC7n <code>Giao di\u1EC7n: s\xE1ng</code> v\xE0 kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:`const THEME = new InjectionToken('THEME');

@Component({
  selector: 'app-root',
  template: '<p class="theme">Giao di\u1EC7n: {{ theme }}</p>',
})
class App {
  theme = inject(THEME); // \u2757 kh\xF4ng ai provide THEME
}

mount(App);
`,solution:`const THEME = new InjectionToken('THEME', { factory: () => 's\xE1ng' });

@Component({
  selector: 'app-root',
  template: '<p class="theme">Giao di\u1EC7n: {{ theme }}</p>',
})
class App {
  theme = inject(THEME);
}

mount(App);
`,hint:`new InjectionToken('THEME', { factory: () => 'sáng' }).`,explain:`Hàm factory chạy trong injection context nên gọi inject() được, ví dụ factory: () => inject(DOCUMENT).defaultView. Mặc định token có factory nằm ở root (providedIn: "root").`,check(e,t){return e.errors.length?s(`Có lỗi: `+e.errMsg()):/provide\s*:\s*THEME/.test(t)?s(`Yêu cầu là không thêm provider: hãy cho chính token một giá trị mặc định.`):/optional\s*:\s*true/.test(t)?s(`optional: true chỉ che lỗi; hãy cho token một factory mặc định.`):g(e.text(`.theme`))===`Giao diện: sáng`?i():s(`Trang đang hiện "`+g(e.text(`.theme`))+`".`)}},{id:`skip-self`,group:`Tuỳ chọn tìm kiếm`,title:`Bỏ qua provider của chính mình: skipSelf`,level:`Trung bình`,lv:2,waitMs:400,desc:`<p>Injector t\xECm provider t\u1EEB ph\u1EA7n t\u1EED hi\u1EC7n t\u1EA1i \u0111i l\xEAn. <code>PayButton</code> provide <code>THEME = 't\u1ED1i'</code> cho c\xE1c con c\u1EE7a n\xF3, nh\u01B0ng ch\xEDnh n\xF3 ph\u1EA3i d\xF9ng theme c\u1EE7a <code>Checkout</code> b\xEAn ngo\xE0i. <code>inject(THEME, { skipSelf: true })</code> b\u1EAFt \u0111\u1EA7u t\xECm t\u1EEB injector cha.</p>
<p><b>Y\xEAu c\u1EA7u:</b> n\xFAt hi\u1EC7n <code>N\xFAt: xanh</code> (theme c\u1EE7a Checkout), c\xF2n icon b\xEAn trong n\xFAt hi\u1EC7n <code>Icon: t\u1ED1i</code>.</p>`,starter:`const THEME = new InjectionToken('THEME', { factory: () => 's\xE1ng' });

@Component({ selector: 'app-icon', template: '<span class="icon">Icon: {{ theme }}</span>' })
class Icon {
  theme = inject(THEME);
}

@Component({
  selector: 'app-pay-button',
  imports: [Icon],
  providers: [{ provide: THEME, useValue: 't\u1ED1i' }], // cho c\xE1c con b\xEAn trong n\xFAt
  template: '<button class="pay">N\xFAt: {{ theme }} \xB7 <app-icon /></button>',
})
class PayButton {
  theme = inject(THEME); // \u2757 \u0111ang l\u1EA5y provider c\u1EE7a ch\xEDnh m\xECnh
}

@Component({
  selector: 'app-checkout',
  imports: [PayButton],
  providers: [{ provide: THEME, useValue: 'xanh' }],
  template: '<app-pay-button />',
})
class Checkout {}

mount(Checkout);
`,solution:`const THEME = new InjectionToken('THEME', { factory: () => 's\xE1ng' });

@Component({ selector: 'app-icon', template: '<span class="icon">Icon: {{ theme }}</span>' })
class Icon {
  theme = inject(THEME);
}

@Component({
  selector: 'app-pay-button',
  imports: [Icon],
  providers: [{ provide: THEME, useValue: 't\u1ED1i' }],
  template: '<button class="pay">N\xFAt: {{ theme }} \xB7 <app-icon /></button>',
})
class PayButton {
  theme = inject(THEME, { skipSelf: true });
}

@Component({
  selector: 'app-checkout',
  imports: [PayButton],
  providers: [{ provide: THEME, useValue: 'xanh' }],
  template: '<app-pay-button />',
})
class Checkout {}

mount(Checkout);
`,hint:`Trong PayButton: theme = inject(THEME, { skipSelf: true }).`,explain:`Ngược lại, { self: true } chỉ tìm ở chính phần tử, còn { host: true } dừng ở component chủ (host) gần nhất. Hay gặp nhất là skipSelf trong component lồng nhau như menu con tìm menu cha.`,check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg());let t=g(e.text(`.pay`)).split(` · `)[0],n=g(e.text(`.icon`));return t!==`Nút: xanh`?s(`Nút đang hiện "`+t+`", cần "Nút: xanh": PayButton đang lấy provider của chính nó.`):n===`Icon: tối`?i():s(`Icon đang hiện "`+n+`", cần "Icon: tối" (giữ provider của PayButton cho các con).`)}},{id:`use-factory`,group:`Kiểu provider`,title:`Giá trị phụ thuộc cấu hình: useFactory`,level:`Trung bình`,lv:2,waitMs:400,desc:`<p>Khi gi\xE1 tr\u1ECB c\u1EA7n t\xEDnh t\u1EEB dependency kh\xE1c (\u0111\u1ECBa ch\u1EC9 API theo m\xF4i tr\u01B0\u1EDDng, ch\u1ECDn class theo c\u1EDD t\xEDnh n\u0103ng), d\xF9ng <code>useFactory</code>. H\xE0m factory ch\u1EA1y trong injection context n\xEAn g\u1ECDi \u0111\u01B0\u1EE3c <code>inject(ENV)</code>, v\xE0 l\u1EA5y \u0111\xFAng <code>ENV</code> c\u1EE7a injector n\u01A1i provider \u0111\u01B0\u1EE3c \u0111\u1EB7t.</p>
<p><b>Y\xEAu c\u1EA7u:</b> gi\u1EEF nguy\xEAn <b>m\u1ED9t</b> <code>apiUrlProvider</code> d\xF9ng chung cho c\u1EA3 hai khu v\u1EF1c. Khu v\u1EF1c production hi\u1EC7n <code>https://api.bip.vn</code>, khu v\u1EF1c dev hi\u1EC7n <code>http://localhost:3000</code>.</p>`,starter:`const ENV = new InjectionToken('ENV');
const API_URL = new InjectionToken('API_URL');

// \u2757 lu\xF4n l\xE0 localhost, kh\xF4ng quan t\xE2m ENV
const apiUrlProvider = { provide: API_URL, useValue: 'http://localhost:3000' };

@Component({ selector: 'app-api-info', template: '<code class="api">{{ url }}</code>' })
class ApiInfo {
  url = inject(API_URL);
}

@Component({
  selector: 'app-prod-zone',
  imports: [ApiInfo],
  providers: [{ provide: ENV, useValue: { prod: true } }, apiUrlProvider],
  template: '<p>Production: <app-api-info /></p>',
})
class ProdZone {}

@Component({
  selector: 'app-dev-zone',
  imports: [ApiInfo],
  providers: [{ provide: ENV, useValue: { prod: false } }, apiUrlProvider],
  template: '<p>Dev: <app-api-info /></p>',
})
class DevZone {}

@Component({ selector: 'app-root', imports: [ProdZone, DevZone], template: '<app-prod-zone /><app-dev-zone />' })
class App {}

mount(App);
`,solution:`const ENV = new InjectionToken('ENV');
const API_URL = new InjectionToken('API_URL');

const apiUrlProvider = {
  provide: API_URL,
  useFactory: () => (inject(ENV).prod ? 'https://api.bip.vn' : 'http://localhost:3000'),
};

@Component({ selector: 'app-api-info', template: '<code class="api">{{ url }}</code>' })
class ApiInfo {
  url = inject(API_URL);
}

@Component({
  selector: 'app-prod-zone',
  imports: [ApiInfo],
  providers: [{ provide: ENV, useValue: { prod: true } }, apiUrlProvider],
  template: '<p>Production: <app-api-info /></p>',
})
class ProdZone {}

@Component({
  selector: 'app-dev-zone',
  imports: [ApiInfo],
  providers: [{ provide: ENV, useValue: { prod: false } }, apiUrlProvider],
  template: '<p>Dev: <app-api-info /></p>',
})
class DevZone {}

@Component({ selector: 'app-root', imports: [ProdZone, DevZone], template: '<app-prod-zone /><app-dev-zone />' })
class App {}

mount(App);
`,hint:`useFactory: () => (inject(ENV).prod ? 'https://api.bip.vn' : 'http://localhost:3000').`,explain:`Factory chỉ chạy một lần cho mỗi injector rồi được cache. Trong ứng dụng thật, ENV thường đến từ file environment hoặc một provider trong app.config.ts.`,check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg());let t=e.query(`.api`).map(n=>g(n.textContent));return t.join(`|`)===`https://api.bip.vn|http://localhost:3000`?i():s(`Hai khu vực đang hiện `+JSON.stringify(t)+`.`)}},{id:`cap-component`,group:`Cây injector`,title:`Mỗi widget một instance: providers của component`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Service <code>providedIn: 'root'</code> ch\u1EC9 c\xF3 <b>m\u1ED9t</b> instance cho c\u1EA3 \u1EE9ng d\u1EE5ng. Mu\u1ED1n m\u1ED7i component c\xF3 state ri\xEAng (m\u1ED7i b\u1EA3ng c\xF3 b\u1ED9 l\u1ECDc ri\xEAng, m\u1ED7i widget \u0111\u1EBFm ri\xEAng), th\xEAm service v\xE0o <code>providers</code> c\u1EE7a component: m\u1ED7i instance component t\u1EA1o m\u1ED9t instance service m\u1EDBi, v\xE0 n\xF3 b\u1ECB hu\u1EF7 c\xF9ng component.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>+</b> c\u1EE7a widget A hai l\u1EA7n: widget A hi\u1EC7n <code>2</code>, widget B v\u1EABn <code>0</code>.</p>`,starter:`@Injectable({ providedIn: 'root' })
class CounterStore {
  count = signal(0);
  inc() { this.count.update((n) => n + 1); }
}

@Component({
  selector: 'app-widget',
  template: '<div class="widget">{{ name() }}: <b class="n">{{ store.count() }}</b> <button (click)="store.inc()">+ {{ name() }}</button></div>',
})
class Widget {
  name = input('');
  store = inject(CounterStore);
}

@Component({ selector: 'app-root', imports: [Widget], template: '<app-widget name="A" /><app-widget name="B" />' })
class App {}

mount(App);
`,solution:`@Injectable({ providedIn: 'root' })
class CounterStore {
  count = signal(0);
  inc() { this.count.update((n) => n + 1); }
}

@Component({
  selector: 'app-widget',
  providers: [CounterStore],
  template: '<div class="widget">{{ name() }}: <b class="n">{{ store.count() }}</b> <button (click)="store.inc()">+ {{ name() }}</button></div>',
})
class Widget {
  name = input('');
  store = inject(CounterStore);
}

@Component({ selector: 'app-root', imports: [Widget], template: '<app-widget name="A" /><app-widget name="B" />' })
class App {}

mount(App);
`,hint:`Thêm providers: [CounterStore] vào @Component của Widget.`,explain:`Với store chỉ dùng trong một màn hình, nên bỏ providedIn: "root" và chỉ provide ở component của màn hình đó, để state được dọn khi rời màn hình.`,simulate(e){e.at(200,()=>e.click(`+ A`)),e.at(300,()=>e.click(`+ A`))},check(e){let t=e.query(`.n`).map(n=>g(n.textContent));return t.join(`|`)===`2|0`?i():s(`Widget A = `+t[0]+`, widget B = `+t[1]+`. Hai widget đang dùng chung một instance ở root.`)}}],cheatsheet:[[`Gom nhiều giá trị`,`<code>{ provide: T, useValue: v, multi: true }</code>`],[`Bí danh`,`<code>{ provide: Old, useExisting: New }</code> (cùng instance)`],[`Mặc định của token`,`<code>new InjectionToken('T', { factory: () =&gt; v })</code>`],[`Tính từ dependency`,`<code>useFactory: () =&gt; inject(ENV).prod ? a : b</code>`],[`Bỏ qua chính mình`,`<code>inject(T, { skipSelf: true })</code>`],[`State riêng mỗi component`,`<code>providers: [Store]</code> trong <code>@Component</code>`]]};export{a as LAB};