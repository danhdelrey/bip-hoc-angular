import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 7 — Dependency Injection: service dùng chung (inject thay vì new),
 * providers ở component (mỗi instance một service), lỗi thiếu provider, InjectionToken cho cấu hình,
 * inject() ngoài injection context, đổi implementation bằng useClass.
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Viết service bằng <code>&#64;Service()</code> (tự cung cấp ở root) hoặc <code>&#64;Injectable()</code> + <code>providers</code>, rồi lấy nó bằng <code>inject()</code> trong component. Thử thêm <code>providers</code> ở component để xem phạm vi thay đổi thế nào.</p>`,
    starter: `@Service()
class Greeter {
  greet(name) {
    return 'Xin chào, ' + name + '!';
  }
}

@Component({
  selector: 'app-root',
  template: '<p>{{ greeter.greet("Bíp") }}</p>',
})
class Root {
  greeter = inject(Greeter);
}

mount(Root);
`,
  },
  {
    id: 'service-dung-chung', group: 'Service', title: 'Dùng chung một service: inject() thay vì new', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Tự <code>new CartService()</code> trong mỗi component thì mỗi nơi có một giỏ hàng riêng. Đánh dấu class bằng <code>&#64;Service()</code> (được cung cấp ở root injector) rồi lấy bằng <code>inject(CartService)</code> thì mọi component nhận <b>cùng một instance</b>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Thêm Áo</b> và <b>Thêm Mũ</b>; huy hiệu giỏ hàng phải là <code>🛒 2</code>.</p>`,
    starter: `// TODO: biến class này thành service được cung cấp ở root
class CartService {
  items = signal([]);
  count = computed(() => this.items().length);

  add(name) {
    this.items.update(list => [...list, name]);
  }
}

@Component({
  selector: 'app-cart-badge',
  template: '<p class="badge">🛒 {{ cart.count() }}</p>',
})
class CartBadge {
  // ❗ tự new → mỗi component một giỏ riêng
  cart = new CartService();
}

@Component({
  selector: 'app-product-list',
  template: \`
    <button (click)="cart.add('Áo')">Thêm Áo</button>
    <button (click)="cart.add('Mũ')">Thêm Mũ</button>
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
`,
    solution: `@Service()
class CartService {
  items = signal([]);
  count = computed(() => this.items().length);

  add(name) {
    this.items.update(list => [...list, name]);
  }
}

@Component({
  selector: 'app-cart-badge',
  template: '<p class="badge">🛒 {{ cart.count() }}</p>',
})
class CartBadge {
  cart = inject(CartService);
}

@Component({
  selector: 'app-product-list',
  template: \`
    <button (click)="cart.add('Áo')">Thêm Áo</button>
    <button (click)="cart.add('Mũ')">Thêm Mũ</button>
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
`,
    hint: 'Thêm @Service() trên CartService, rồi đổi cả hai chỗ new CartService() thành inject(CartService).',
    explain: '@Service() là cách viết gọn của Angular 22 cho @Injectable({ providedIn: "root" }). Ngoài việc dùng chung, inject() còn cho phép thay service bằng bản giả khi test.',
    simulate(s) { s.at(100, () => s.click('Thêm Áo')); s.at(200, () => s.click('Thêm Mũ')); },
    check(a) {
      const t = a.text('.badge');
      if (t === '🛒 2') return OK();
      if (t === '🛒 0') return NO('Đã thêm 2 món nhưng huy hiệu vẫn 0: hai component đang dùng hai giỏ khác nhau.');
      return NO('Huy hiệu đang là "' + t + '", cần "🛒 2".');
    },
  },
  {
    id: 'providers-component', group: 'Phạm vi', title: 'Mỗi component một instance: providers', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Service ở root là một instance cho cả app. Muốn <b>mỗi</b> <code>&lt;app-counter&gt;</code> có service riêng (ví dụ state của từng widget), khai báo <code>providers: [CounterService]</code> trong component: mỗi instance component tạo một instance service mới.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm +1 hai lần ở bộ đếm thứ nhất, một lần ở bộ đếm thứ hai. Kết quả phải là <code>2</code> và <code>1</code>.</p>`,
    starter: `@Service()
class CounterService {
  n = signal(0);
  inc() {
    this.n.update(v => v + 1);
  }
}

@Component({
  selector: 'app-counter',
  // TODO: mỗi <app-counter> cần một CounterService riêng
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
`,
    solution: `@Service()
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
`,
    hint: 'Thêm providers: [CounterService] vào metadata của Counter.',
    explain: 'Injector tìm từ component lên trên: gặp provider gần nhất thì dùng. Ngược lại, lỡ thêm providers vào component trong khi muốn dùng chung là lỗi rất hay gặp: state "tự nhiên" không còn chia sẻ.',
    simulate(s) {
      s.at(100, () => s.clickSel('app-counter button', 0));
      s.at(200, () => s.clickSel('app-counter button', 0));
      s.at(300, () => s.clickSel('app-counter button', 1));
    },
    check(a) {
      const ns = a.query('app-counter .n').map((e) => norm(e.textContent));
      if (JSON.stringify(ns) === '["2","1"]') return OK();
      if (ns[0] === ns[1]) return NO('Hai bộ đếm luôn bằng nhau (' + ns[0] + '): đang dùng chung CounterService ở root.');
      return NO('Hai bộ đếm đang là ' + JSON.stringify(ns) + ', cần ["2", "1"].');
    },
  },
  {
    id: 'thieu-provider', group: 'Service', title: 'Lỗi thiếu provider', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Angular chỉ inject được thứ đã được <b>cung cấp</b> (provide) ở đâu đó: <code>&#64;Service()</code>/<code>&#64;Injectable({ providedIn: 'root' })</code>, hoặc <code>providers</code> của component/route/app. Thiếu thì gặp lỗi không tạo được dependency.</p>
<p><b>Yêu cầu:</b> sửa để <code>Root</code> lấy được <code>Clock</code> và hiển thị <code>Bây giờ là 09:00</code>.</p>`,
    starter: `// ❗ chưa được cung cấp ở đâu cả
class Clock {
  now() {
    return '09:00';
  }
}

@Component({
  selector: 'app-root',
  template: '<p class="time">Bây giờ là {{ clock.now() }}</p>',
})
class Root {
  clock = inject(Clock);
}

mount(Root);
`,
    solution: `@Service()
class Clock {
  now() {
    return '09:00';
  }
}

@Component({
  selector: 'app-root',
  template: '<p class="time">Bây giờ là {{ clock.now() }}</p>',
})
class Root {
  clock = inject(Clock);
}

mount(Root);
`,
    hint: 'Thêm @Service() trên class Clock (hoặc providers: [Clock] trong Root nếu Clock có @Injectable()).',
    explain: 'Lỗi dạng "No provider for X" / NullInjectorError: đọc kỹ chuỗi injector trong thông báo (bản dev) để biết Angular đã tìm ở đâu. Service dùng chung cả app thì để ở root là đơn giản nhất.',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      const t = a.text('.time');
      if (t === 'Bây giờ là 09:00') return OK();
      return NO('Đang hiển thị "' + t + '", cần "Bây giờ là 09:00".');
    },
  },
  {
    id: 'injection-token', group: 'Cấu hình', title: 'Giá trị cấu hình: InjectionToken', level: 'Trung bình', lv: 2, waitMs: 500,
    desc: `<p>Giá trị không phải class (URL API, cờ tính năng…) cần một <b>khoá</b> để inject. Dùng chuỗi trần làm khoá dễ trùng và mất kiểm tra kiểu. Hãy tạo <code>new InjectionToken('API_URL')</code>, cung cấp bằng <code>{ provide: API_URL, useValue: … }</code> và lấy bằng <code>inject(API_URL)</code>.</p>
<p><b>Yêu cầu:</b> thay khoá chuỗi bằng <code>InjectionToken</code>; trang vẫn hiển thị <code>API: https://api.bip.dev</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  providers: [{ provide: 'API_URL', useValue: 'https://api.bip.dev' }],
  template: '<p class="url">API: {{ apiUrl }}</p>',
})
class Root {
  // ❗ chuỗi trần làm khoá DI
  apiUrl = inject('API_URL');
}

mount(Root);
`,
    solution: `const API_URL = new InjectionToken('API_URL');

@Component({
  selector: 'app-root',
  providers: [{ provide: API_URL, useValue: 'https://api.bip.dev' }],
  template: '<p class="url">API: {{ apiUrl }}</p>',
})
class Root {
  apiUrl = inject(API_URL);
}

mount(Root);
`,
    hint: "const API_URL = new InjectionToken('API_URL'); rồi dùng API_URL ở cả provide lẫn inject().",
    explain: "Trong TypeScript: new InjectionToken<string>('API_URL') để inject(API_URL) có kiểu string. Token còn có thể tự cung cấp giá trị mặc định: new InjectionToken('API_URL', { factory: () => 'https://…' }).",
    check(a, code) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      if (a.text('.url') !== 'API: https://api.bip.dev') return NO('Trang cần hiển thị "API: https://api.bip.dev".');
      if (!/new\s+InjectionToken\s*\(/.test(code)) return NO('Kết quả đúng nhưng vẫn dùng chuỗi làm khoá. Hãy tạo một InjectionToken.');
      if (/inject\s*\(\s*['"]/.test(code) || /provide\s*:\s*['"]/.test(code)) return NO('Vẫn còn chỗ dùng chuỗi trần làm khoá DI.');
      return OK();
    },
  },
  {
    id: 'inject-context', group: 'Service', title: 'inject() chỉ dùng trong injection context', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p><code>inject()</code> chỉ chạy được khi Angular đang tạo đối tượng: field initializer, constructor, factory của provider. Gọi trong method (lúc người dùng bấm nút) sẽ gặp lỗi <code>NG0203</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Lưu</b>; log phải có <code>[info] Đã lưu</code> và không có lỗi.</p>`,
    starter: `@Service()
class Logger {
  info(msg) {
    log('[info] ' + msg);
  }
}

@Component({
  selector: 'app-root',
  template: '<button (click)="save()">Lưu</button>',
})
class Root {
  save() {
    // ❗ lúc người dùng bấm nút không còn injection context
    const logger = inject(Logger);
    logger.info('Đã lưu');
  }
}

mount(Root);
`,
    solution: `@Service()
class Logger {
  info(msg) {
    log('[info] ' + msg);
  }
}

@Component({
  selector: 'app-root',
  template: '<button (click)="save()">Lưu</button>',
})
class Root {
  logger = inject(Logger);

  save() {
    this.logger.info('Đã lưu');
  }
}

mount(Root);
`,
    hint: 'Chuyển inject(Logger) lên thành field: logger = inject(Logger); rồi trong save() gọi this.logger.info(...).',
    explain: 'Trong TypeScript thường viết private readonly logger = inject(Logger). Cần inject "muộn" (trong callback) thì lấy Injector trước bằng inject(Injector), rồi injector.get(X) hoặc runInInjectionContext(injector, …).',
    simulate(s) { s.at(150, () => s.click('Lưu')); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      if (a.logs.includes('[info] Đã lưu')) return OK();
      return NO('Bấm Lưu nhưng log chưa có "[info] Đã lưu".');
    },
  },
  {
    id: 'use-class', group: 'Cấu hình', title: 'Đổi implementation: useClass', level: 'Khó', lv: 3, waitMs: 500,
    desc: `<p>Component phụ thuộc vào một <b>hợp đồng</b> (<code>StorageService</code>) chứ không phụ thuộc vào cách cài đặt cụ thể. <code>{ provide: StorageService, useClass: MemoryStorage }</code> bảo Angular: ai xin <code>StorageService</code> thì đưa <code>MemoryStorage</code>. Đây là cách thay bản giả khi test, hoặc đổi nơi lưu mà không sửa component.</p>
<p><b>Yêu cầu:</b> không sửa class <code>Settings</code>; khi kiểm tra, trang bấm <b>Lưu cài đặt</b> và log phải có <code>MemoryStorage.save theme dark</code>.</p>`,
    starter: `// "Hợp đồng" mà component dùng
class StorageService {
  save(key, value) {
    throw new Error('StorageService chưa được cài đặt');
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
  // TODO: cho StorageService dùng MemoryStorage (không sửa phần class Settings)
  template: '<button (click)="save()">Lưu cài đặt</button>',
})
class Settings {
  storage = inject(StorageService);

  save() {
    this.storage.save('theme', 'dark');
  }
}

mount(Settings);
`,
    solution: `// "Hợp đồng" mà component dùng
class StorageService {
  save(key, value) {
    throw new Error('StorageService chưa được cài đặt');
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
  template: '<button (click)="save()">Lưu cài đặt</button>',
})
class Settings {
  storage = inject(StorageService);

  save() {
    this.storage.save('theme', 'dark');
  }
}

mount(Settings);
`,
    hint: 'providers: [{ provide: StorageService, useClass: MemoryStorage }]',
    explain: 'Trong TypeScript, StorageService thường là abstract class (vừa làm kiểu, vừa làm token DI). Ngoài useClass còn có useValue (giá trị có sẵn), useFactory (tự tạo) và useExisting (trỏ tới provider khác).',
    simulate(s) { s.at(150, () => s.click('Lưu cài đặt')); },
    check(a, code) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      if (!a.logs.includes('MemoryStorage.save theme dark')) return NO('Bấm Lưu nhưng log chưa có "MemoryStorage.save theme dark".');
      if (!/storage\s*=\s*inject\(\s*StorageService\s*\)/.test(code)) return NO('Đừng sửa class Settings: nó vẫn phải inject(StorageService).');
      return OK();
    },
  },
];

export const LAB: LabModule = {
  title: 'Dependency Injection',
  subtitle: 'bài luyện DI trên component thật: service dùng chung, providers ở component, lỗi thiếu provider, InjectionToken, injection context, useClass.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Service dùng chung cả app', '<code>&#64;Service()</code> (= <code>&#64;Injectable({ providedIn: \'root\' })</code>)'],
    ['Lấy dependency', '<code>x = inject(X)</code> ở field hoặc constructor; không <code>new X()</code>'],
    ['Mỗi component một instance', '<code>providers: [X]</code> trong <code>&#64;Component</code>'],
    ['Giá trị cấu hình', '<code>new InjectionToken(\'X\')</code> + <code>{ provide: X, useValue }</code>'],
    ['Đổi cách cài đặt / bản giả khi test', '<code>{ provide: A, useClass: B }</code>, <code>useFactory</code>, <code>useExisting</code>'],
    ['Lỗi NG0203', 'đưa <code>inject()</code> ra field/constructor, hoặc dùng <code>runInInjectionContext</code>'],
  ],
};
