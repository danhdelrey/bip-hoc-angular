import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/** Bài luyện của bài 19 — DI nâng cao: multi provider, useExisting, token có factory, skipSelf, useFactory, provider cấp component. */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử các kiểu provider: <code>useValue</code>, <code>useClass</code>, <code>useExisting</code>, <code>useFactory</code>, <code>multi: true</code>, và các tuỳ chọn của <code>inject()</code>: <code>optional</code>, <code>self</code>, <code>skipSelf</code>, <code>host</code>.</p>
<div class="tip">Provider đặt ở <code>providers</code> của component (cây injector của component) hoặc ở <code>bootstrapApplication(App, { providers })</code> (root).</div>`,
    starter: `const GREETING = new InjectionToken('GREETING', { factory: () => 'Xin chào' });

@Component({
  selector: 'app-hello',
  template: '<p>{{ greeting }}, Bíp!</p>',
})
class Hello {
  greeting = inject(GREETING);
}

@Component({
  selector: 'app-root',
  imports: [Hello],
  providers: [{ provide: GREETING, useValue: 'Chào buổi sáng' }],
  template: '<app-hello />',
})
class App {}

mount(App);
`,
  },
  {
    id: 'multi', group: 'Kiểu provider', title: 'Nhiều provider cho một token: multi: true', level: 'Dễ', lv: 1, waitMs: 400,
    desc: `<p>Bình thường, provider đăng ký sau <b>ghi đè</b> provider trước của cùng token. Với <code>multi: true</code>, Angular gom tất cả vào một mảng, nên mỗi tính năng tự "đăng ký thêm" được mà không cần biết các tính năng khác (đây là cách <code>HTTP_INTERCEPTORS</code>, validator của form hoạt động).</p>
<p><b>Yêu cầu:</b> trang thanh toán hiện đủ 3 phương thức <code>Thẻ</code>, <code>Chuyển khoản</code>, <code>Ví</code> theo đúng thứ tự.</p>`,
    starter: `const PAYMENT_METHODS = new InjectionToken('PAYMENT_METHODS');

@Component({
  selector: 'app-root',
  providers: [
    { provide: PAYMENT_METHODS, useValue: 'Thẻ' },
    { provide: PAYMENT_METHODS, useValue: 'Chuyển khoản' },
    { provide: PAYMENT_METHODS, useValue: 'Ví' },
  ],
  template: \`
    <h3>Chọn cách thanh toán</h3>
    @for (m of methods; track m) { <label class="method"><input type="radio" name="pay" /> {{ m }}</label> }
  \`,
})
class App {
  methods = [].concat(inject(PAYMENT_METHODS));
}

mount(App);
`,
    solution: `const PAYMENT_METHODS = new InjectionToken('PAYMENT_METHODS');

@Component({
  selector: 'app-root',
  providers: [
    { provide: PAYMENT_METHODS, useValue: 'Thẻ', multi: true },
    { provide: PAYMENT_METHODS, useValue: 'Chuyển khoản', multi: true },
    { provide: PAYMENT_METHODS, useValue: 'Ví', multi: true },
  ],
  template: \`
    <h3>Chọn cách thanh toán</h3>
    @for (m of methods; track m) { <label class="method"><input type="radio" name="pay" /> {{ m }}</label> }
  \`,
})
class App {
  methods = inject(PAYMENT_METHODS); // multi → luôn là mảng
}

mount(App);
`,
    hint: 'Thêm multi: true vào cả ba provider. Khi đó inject(PAYMENT_METHODS) trả về mảng.',
    explain: 'Mọi provider của một token multi đều phải có multi: true; trộn provider thường và multi cho cùng token sẽ báo lỗi. Trong dự án, mỗi tính năng có thể tự thêm phương thức của mình bằng một hàm provideXxx().',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const m = a.query('.method').map((e) => norm(e.textContent));
      return m.join('|') === 'Thẻ|Chuyển khoản|Ví' ? OK() : NO('Đang hiện ' + JSON.stringify(m) + ': provider sau ghi đè provider trước.');
    },
  },
  {
    id: 'use-existing', group: 'Kiểu provider', title: 'Bí danh dùng chung instance: useExisting', level: 'Trung bình', lv: 2, waitMs: 500,
    desc: `<p>Code cũ inject <code>AppLogger</code>, code mới inject <code>Logger</code>. <code>{ provide: AppLogger, useClass: Logger }</code> tạo <b>instance thứ hai</b> của Logger, nên hai nơi đếm riêng. Muốn token này là bí danh của token kia (cùng một instance), dùng <code>useExisting</code>.</p>
<p><b>Yêu cầu:</b> sau khi cả hai component ghi log, cả hai dòng đều hiện <code>Tổng log: 2</code>.</p>`,
    starter: `@Injectable()
class Logger {
  count = signal(0);
  log(msg) { this.count.update((n) => n + 1); }
}

/** token cũ, code trước đây inject cái này */
@Injectable()
class AppLogger {}

@Component({ selector: 'app-new-feature', template: '<p class="total">Tính năng mới, tổng log: {{ logger.count() }}</p>' })
class NewFeature {
  logger = inject(Logger);
  constructor() { this.logger.log('mới'); }
}

@Component({ selector: 'app-old-feature', template: '<p class="total">Tính năng cũ, tổng log: {{ logger.count() }}</p>' })
class OldFeature {
  logger = inject(AppLogger);
  constructor() { this.logger.log('cũ'); }
}

@Component({
  selector: 'app-root',
  imports: [NewFeature, OldFeature],
  providers: [Logger, { provide: AppLogger, useClass: Logger }],
  template: '<app-new-feature /><app-old-feature />',
})
class App {}

mount(App);
`,
    solution: `@Injectable()
class Logger {
  count = signal(0);
  log(msg) { this.count.update((n) => n + 1); }
}

/** token cũ, code trước đây inject cái này */
@Injectable()
class AppLogger {}

@Component({ selector: 'app-new-feature', template: '<p class="total">Tính năng mới, tổng log: {{ logger.count() }}</p>' })
class NewFeature {
  logger = inject(Logger);
  constructor() { this.logger.log('mới'); }
}

@Component({ selector: 'app-old-feature', template: '<p class="total">Tính năng cũ, tổng log: {{ logger.count() }}</p>' })
class OldFeature {
  logger = inject(AppLogger);
  constructor() { this.logger.log('cũ'); }
}

@Component({
  selector: 'app-root',
  imports: [NewFeature, OldFeature],
  providers: [Logger, { provide: AppLogger, useExisting: Logger }],
  template: '<app-new-feature /><app-old-feature />',
})
class App {}

mount(App);
`,
    hint: 'Đổi useClass: Logger thành useExisting: Logger.',
    explain: 'useExisting cũng hay dùng để một component tự cung cấp mình dưới một token chung: providers: [{ provide: FORM_FIELD, useExisting: forwardRef(() => MyInput) }].',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const t = a.query('.total').map((e) => norm(e.textContent).split(': ')[1]);
      return t.join('|') === '2|2' ? OK() : NO('Hai dòng đang hiện tổng log ' + t.join(' và ') + ': đang có hai instance Logger riêng.');
    },
  },
  {
    id: 'token-factory', group: 'InjectionToken', title: 'Token có giá trị mặc định: factory', level: 'Dễ', lv: 1, waitMs: 400,
    desc: `<p><code>new InjectionToken('THEME', { factory: () =&gt; 'sáng' })</code> tạo token có sẵn giá trị mặc định ở root: không ai provide thì <code>inject(THEME)</code> vẫn ra <code>'sáng'</code>, ai cần khác thì provide đè. Đừng dùng <code>inject(THEME, { optional: true })</code> rồi tự xử lý <code>null</code> ở khắp nơi: cách đó che mất lỗi cấu hình thật.</p>
<p><b>Yêu cầu:</b> không thêm provider nào, trang hiện <code>Giao diện: sáng</code> và không có lỗi.</p>`,
    starter: `const THEME = new InjectionToken('THEME');

@Component({
  selector: 'app-root',
  template: '<p class="theme">Giao diện: {{ theme }}</p>',
})
class App {
  theme = inject(THEME); // ❗ không ai provide THEME
}

mount(App);
`,
    solution: `const THEME = new InjectionToken('THEME', { factory: () => 'sáng' });

@Component({
  selector: 'app-root',
  template: '<p class="theme">Giao diện: {{ theme }}</p>',
})
class App {
  theme = inject(THEME);
}

mount(App);
`,
    hint: "new InjectionToken('THEME', { factory: () => 'sáng' }).",
    explain: 'Hàm factory chạy trong injection context nên gọi inject() được, ví dụ factory: () => inject(DOCUMENT).defaultView. Mặc định token có factory nằm ở root (providedIn: "root").',
    check(a, code) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (/provide\s*:\s*THEME/.test(code)) return NO('Yêu cầu là không thêm provider: hãy cho chính token một giá trị mặc định.');
      if (/optional\s*:\s*true/.test(code)) return NO('optional: true chỉ che lỗi; hãy cho token một factory mặc định.');
      return norm(a.text('.theme')) === 'Giao diện: sáng' ? OK() : NO('Trang đang hiện "' + norm(a.text('.theme')) + '".');
    },
  },
  {
    id: 'skip-self', group: 'Tuỳ chọn tìm kiếm', title: 'Bỏ qua provider của chính mình: skipSelf', level: 'Trung bình', lv: 2, waitMs: 400,
    desc: `<p>Injector tìm provider từ phần tử hiện tại đi lên. <code>PayButton</code> provide <code>THEME = 'tối'</code> cho các con của nó, nhưng chính nó phải dùng theme của <code>Checkout</code> bên ngoài. <code>inject(THEME, { skipSelf: true })</code> bắt đầu tìm từ injector cha.</p>
<p><b>Yêu cầu:</b> nút hiện <code>Nút: xanh</code> (theme của Checkout), còn icon bên trong nút hiện <code>Icon: tối</code>.</p>`,
    starter: `const THEME = new InjectionToken('THEME', { factory: () => 'sáng' });

@Component({ selector: 'app-icon', template: '<span class="icon">Icon: {{ theme }}</span>' })
class Icon {
  theme = inject(THEME);
}

@Component({
  selector: 'app-pay-button',
  imports: [Icon],
  providers: [{ provide: THEME, useValue: 'tối' }], // cho các con bên trong nút
  template: '<button class="pay">Nút: {{ theme }} · <app-icon /></button>',
})
class PayButton {
  theme = inject(THEME); // ❗ đang lấy provider của chính mình
}

@Component({
  selector: 'app-checkout',
  imports: [PayButton],
  providers: [{ provide: THEME, useValue: 'xanh' }],
  template: '<app-pay-button />',
})
class Checkout {}

mount(Checkout);
`,
    solution: `const THEME = new InjectionToken('THEME', { factory: () => 'sáng' });

@Component({ selector: 'app-icon', template: '<span class="icon">Icon: {{ theme }}</span>' })
class Icon {
  theme = inject(THEME);
}

@Component({
  selector: 'app-pay-button',
  imports: [Icon],
  providers: [{ provide: THEME, useValue: 'tối' }],
  template: '<button class="pay">Nút: {{ theme }} · <app-icon /></button>',
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
`,
    hint: 'Trong PayButton: theme = inject(THEME, { skipSelf: true }).',
    explain: 'Ngược lại, { self: true } chỉ tìm ở chính phần tử, còn { host: true } dừng ở component chủ (host) gần nhất. Hay gặp nhất là skipSelf trong component lồng nhau như menu con tìm menu cha.',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const btn = norm(a.text('.pay')).split(' · ')[0];
      const icon = norm(a.text('.icon'));
      if (btn !== 'Nút: xanh') return NO('Nút đang hiện "' + btn + '", cần "Nút: xanh": PayButton đang lấy provider của chính nó.');
      return icon === 'Icon: tối' ? OK() : NO('Icon đang hiện "' + icon + '", cần "Icon: tối" (giữ provider của PayButton cho các con).');
    },
  },
  {
    id: 'use-factory', group: 'Kiểu provider', title: 'Giá trị phụ thuộc cấu hình: useFactory', level: 'Trung bình', lv: 2, waitMs: 400,
    desc: `<p>Khi giá trị cần tính từ dependency khác (địa chỉ API theo môi trường, chọn class theo cờ tính năng), dùng <code>useFactory</code>. Hàm factory chạy trong injection context nên gọi được <code>inject(ENV)</code>, và lấy đúng <code>ENV</code> của injector nơi provider được đặt.</p>
<p><b>Yêu cầu:</b> giữ nguyên <b>một</b> <code>apiUrlProvider</code> dùng chung cho cả hai khu vực. Khu vực production hiện <code>https://api.bip.vn</code>, khu vực dev hiện <code>http://localhost:3000</code>.</p>`,
    starter: `const ENV = new InjectionToken('ENV');
const API_URL = new InjectionToken('API_URL');

// ❗ luôn là localhost, không quan tâm ENV
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
`,
    solution: `const ENV = new InjectionToken('ENV');
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
`,
    hint: "useFactory: () => (inject(ENV).prod ? 'https://api.bip.vn' : 'http://localhost:3000').",
    explain: 'Factory chỉ chạy một lần cho mỗi injector rồi được cache. Trong ứng dụng thật, ENV thường đến từ file environment hoặc một provider trong app.config.ts.',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const u = a.query('.api').map((e) => norm(e.textContent));
      return u.join('|') === 'https://api.bip.vn|http://localhost:3000' ? OK() : NO('Hai khu vực đang hiện ' + JSON.stringify(u) + '.');
    },
  },
  {
    id: 'cap-component', group: 'Cây injector', title: 'Mỗi widget một instance: providers của component', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Service <code>providedIn: 'root'</code> chỉ có <b>một</b> instance cho cả ứng dụng. Muốn mỗi component có state riêng (mỗi bảng có bộ lọc riêng, mỗi widget đếm riêng), thêm service vào <code>providers</code> của component: mỗi instance component tạo một instance service mới, và nó bị huỷ cùng component.</p>
<p><b>Yêu cầu:</b> bấm <b>+</b> của widget A hai lần: widget A hiện <code>2</code>, widget B vẫn <code>0</code>.</p>`,
    starter: `@Injectable({ providedIn: 'root' })
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
`,
    solution: `@Injectable({ providedIn: 'root' })
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
`,
    hint: 'Thêm providers: [CounterStore] vào @Component của Widget.',
    explain: 'Với store chỉ dùng trong một màn hình, nên bỏ providedIn: "root" và chỉ provide ở component của màn hình đó, để state được dọn khi rời màn hình.',
    simulate(s) {
      s.at(200, () => s.click('+ A'));
      s.at(300, () => s.click('+ A'));
    },
    check(a) {
      const n = a.query('.n').map((e) => norm(e.textContent));
      return n.join('|') === '2|0' ? OK() : NO('Widget A = ' + n[0] + ', widget B = ' + n[1] + '. Hai widget đang dùng chung một instance ở root.');
    },
  },
];

export const LAB: LabModule = {
  title: 'DI nâng cao',
  subtitle: 'bài luyện cấu hình dependency: multi provider, useExisting, token có factory, skipSelf, useFactory, provider ở cấp component.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Gom nhiều giá trị', '<code>{ provide: T, useValue: v, multi: true }</code>'],
    ['Bí danh', '<code>{ provide: Old, useExisting: New }</code> (cùng instance)'],
    ['Mặc định của token', '<code>new InjectionToken(\'T\', { factory: () =&gt; v })</code>'],
    ['Tính từ dependency', '<code>useFactory: () =&gt; inject(ENV).prod ? a : b</code>'],
    ['Bỏ qua chính mình', '<code>inject(T, { skipSelf: true })</code>'],
    ['State riêng mỗi component', '<code>providers: [Store]</code> trong <code>@Component</code>'],
  ],
};
