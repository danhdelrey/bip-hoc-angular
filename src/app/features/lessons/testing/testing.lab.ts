import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';
import type { CheckApi } from '../../../shared/lab/lab-runtime';

/**
 * Bài luyện của bài 25 — Testing với TestBed. Code gồm component/service và test viết bằng describe/it/expect
 * (bộ chạy nhỏ của lab, cú pháp như Jasmine/Vitest) trên TestBed thật. Console in "✓"/"✗" cho từng test.
 */
const result = (a: CheckApi) => {
  const pass = a.logs.filter((l) => l.startsWith('✓ ')).length;
  const fails = a.logs.filter((l) => l.startsWith('✗ '));
  const done = a.logs.some((l) => l.startsWith('Kết quả:'));
  return { pass, fails, done };
};
/** Đạt khi đã chạy xong, không test nào hỏng và có ít nhất `min` test đạt. */
const allPass = (a: CheckApi, min: number) => {
  if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
  const r = result(a);
  if (!r.done) return NO('Bộ test chưa chạy xong. Kiểm tra lại cú pháp describe/it.');
  if (r.fails.length) return NO('Còn test hỏng: ' + r.fails[0].slice(2));
  return r.pass >= min ? null : NO('Cần ít nhất ' + min + ' test đạt (đang có ' + r.pass + ').');
};

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Viết test như trong dự án: <code>describe</code>, <code>it</code>, <code>beforeEach</code>, <code>expect(…).toBe(…)</code>, chạy trên <b>TestBed thật</b>. Kết quả từng test hiện trong Console.</p>
<div class="tip">Có sẵn: <code>TestBed</code>, <code>describe</code>, <code>it</code>, <code>beforeEach</code>, <code>afterEach</code>, <code>expect</code> (toBe, toEqual, toContain, toBeTruthy, toHaveLength, toHaveBeenCalledWith…, kèm <code>.not</code>), <code>fn()</code> để tạo hàm giả, <code>provideHttpClient</code>, <code>provideHttpClientTesting</code>, <code>HttpTestingController</code>. TestBed chạy zoneless: sau khi đổi state, <code>await fixture.whenStable()</code> trước khi đọc DOM.</div>`,
    starter: `@Component({ selector: 'app-hello', template: '<p>Xin chào, {{ name() }}!</p>' })
class Hello {
  name = input('bạn');
}

describe('Hello', () => {
  it('hiện tên được truyền vào', async () => {
    const fixture = TestBed.createComponent(Hello);
    fixture.componentRef.setInput('name', 'Bíp');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Xin chào, Bíp!');
  });
});
`,
  },
  {
    id: 'provide-fake', group: 'Cấu hình TestBed', title: 'Hết NullInjectorError: provide bản giả', level: 'Dễ', lv: 1, waitMs: 1200,
    desc: `<p>TestBed là một ứng dụng nhỏ, chỉ có những gì bạn khai báo. <code>ProductCard</code> inject <code>CartService</code> (trong app thật được provide ở <code>app.config.ts</code>), nên test báo <b>NG0201: No provider</b>. Trong unit test của component, đừng kéo service thật (nó còn gọi HTTP): provide một <b>bản giả</b> bằng <code>{ provide: CartService, useValue: cartFake }</code>.</p>
<p><b>Yêu cầu:</b> cả 2 test đều đạt.</p>`,
    starter: `@Injectable()
class CartService {
  private http = inject(HttpClient);
  add(name) { this.http.post('/api/cart', { name }).subscribe(); }
}

@Component({
  selector: 'app-product-card',
  template: '<h3>{{ name() }}</h3><button (click)="add()">Thêm vào giỏ</button>',
})
class ProductCard {
  name = input('Áo mưa');
  private cart = inject(CartService);
  add() { this.cart.add(this.name()); }
}

describe('ProductCard', () => {
  let cartFake;

  beforeEach(() => {
    cartFake = { add: fn() };
    TestBed.configureTestingModule({
      imports: [ProductCard],
      // TODO: ProductCard cần CartService, dùng cartFake thay cho service thật
    });
  });

  it('tạo được component', () => {
    const fixture = TestBed.createComponent(ProductCard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('bấm "Thêm vào giỏ" gọi cart.add với tên sản phẩm', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    expect(cartFake.add).toHaveBeenCalledWith('Áo mưa');
  });
});
`,
    solution: `@Injectable()
class CartService {
  private http = inject(HttpClient);
  add(name) { this.http.post('/api/cart', { name }).subscribe(); }
}

@Component({
  selector: 'app-product-card',
  template: '<h3>{{ name() }}</h3><button (click)="add()">Thêm vào giỏ</button>',
})
class ProductCard {
  name = input('Áo mưa');
  private cart = inject(CartService);
  add() { this.cart.add(this.name()); }
}

describe('ProductCard', () => {
  let cartFake;

  beforeEach(() => {
    cartFake = { add: fn() };
    TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [{ provide: CartService, useValue: cartFake }],
    });
  });

  it('tạo được component', () => {
    const fixture = TestBed.createComponent(ProductCard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('bấm "Thêm vào giỏ" gọi cart.add với tên sản phẩm', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    expect(cartFake.add).toHaveBeenCalledWith('Áo mưa');
  });
});
`,
    hint: 'Thêm providers: [{ provide: CartService, useValue: cartFake }] vào configureTestingModule.',
    explain: 'Tạo bản giả trong beforeEach để mỗi test có bản mới, không dính số lần gọi của test trước. Khi component chỉ dùng một phần nhỏ của service, bản giả chỉ cần đúng những hàm đó.',
    check(a, code) {
      const bad = allPass(a, 2);
      if (bad) return bad;
      return /provide\s*:\s*CartService/.test(code) ? OK() : NO('Hãy provide bản giả cho CartService.');
    },
  },
  {
    id: 'when-stable', group: 'Đọc DOM', title: 'Đợi giao diện cập nhật: await fixture.whenStable()', level: 'Dễ', lv: 1, waitMs: 1200,
    desc: `<p>Ứng dụng zoneless (mặc định từ Angular 21) cập nhật DOM <b>bất đồng bộ</b>: bấm nút làm signal đổi ngay, nhưng DOM chỉ được vẽ lại ở lượt change detection sau. Đọc DOM ngay sau khi bấm thì vẫn thấy giao diện cũ. Hãy <code>await fixture.whenStable()</code> trước khi kiểm tra.</p>
<p><b>Yêu cầu:</b> test "hiện thông báo sau khi thêm" phải đạt.</p>`,
    starter: `@Component({
  selector: 'app-add-button',
  template: \`
    <button (click)="added.set(true)">Thêm</button>
    @if (added()) { <p class="toast">Đã thêm vào giỏ</p> }
  \`,
})
class AddButton {
  added = signal(false);
}

describe('AddButton', () => {
  it('hiện thông báo sau khi thêm', async () => {
    const fixture = TestBed.createComponent(AddButton);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    // ❗ đọc DOM ngay, giao diện chưa được vẽ lại
    expect(fixture.nativeElement.querySelector('.toast')?.textContent).toContain('Đã thêm vào giỏ');
  });
});
`,
    solution: `@Component({
  selector: 'app-add-button',
  template: \`
    <button (click)="added.set(true)">Thêm</button>
    @if (added()) { <p class="toast">Đã thêm vào giỏ</p> }
  \`,
})
class AddButton {
  added = signal(false);
}

describe('AddButton', () => {
  it('hiện thông báo sau khi thêm', async () => {
    const fixture = TestBed.createComponent(AddButton);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.toast')?.textContent).toContain('Đã thêm vào giỏ');
  });
});
`,
    hint: 'Thêm await fixture.whenStable(); ngay sau dòng click().',
    explain: 'fixture.detectChanges() cũng vẽ lại ngay (đồng bộ), nhưng whenStable() còn đợi cả các việc bất đồng bộ khác như HTTP giả, @defer, resource. Test nên đợi giống cách người dùng thấy giao diện.',
    check(a) {
      return allPass(a, 1) ?? OK();
    },
  },
  {
    id: 'set-input', group: 'Đọc DOM', title: 'Truyền input trong test: componentRef.setInput', level: 'Dễ', lv: 1, waitMs: 1200,
    desc: `<p>Gán <code>fixture.componentInstance.name = 'Bíp'</code> là thay mất signal input bằng một chuỗi, template gọi <code>name()</code> sẽ lỗi (và input bắt buộc vẫn bị coi là chưa có). Truyền input đúng như cha truyền: <code>fixture.componentRef.setInput('name', 'Bíp')</code>.</p>
<p><b>Yêu cầu:</b> cả 2 test đều đạt.</p>`,
    starter: `@Component({ selector: 'app-greeting', template: '<p class="msg">Xin chào, {{ name() }}!</p>' })
class Greeting {
  name = input.required();
}

describe('Greeting', () => {
  it('chào đúng tên', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentInstance.name = 'Bíp'; // ❗
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin chào, Bíp!');
  });

  it('cập nhật khi tên đổi', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentInstance.name = 'An'; // ❗
    await fixture.whenStable();
    fixture.componentInstance.name = 'Chi'; // ❗
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin chào, Chi!');
  });
});
`,
    solution: `@Component({ selector: 'app-greeting', template: '<p class="msg">Xin chào, {{ name() }}!</p>' })
class Greeting {
  name = input.required();
}

describe('Greeting', () => {
  it('chào đúng tên', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentRef.setInput('name', 'Bíp');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin chào, Bíp!');
  });

  it('cập nhật khi tên đổi', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentRef.setInput('name', 'An');
    await fixture.whenStable();
    fixture.componentRef.setInput('name', 'Chi');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin chào, Chi!');
  });
});
`,
    hint: "Thay mọi dòng gán fixture.componentInstance.name = … bằng fixture.componentRef.setInput('name', …).",
    explain: 'setInput đi qua đúng đường của binding [name]: chạy transform, báo component cần vẽ lại. Muốn test cả component cha lẫn con thì tạo một component host nhỏ trong file test.',
    check(a, code) {
      const bad = allPass(a, 2);
      if (bad) return bad;
      return /componentInstance\.name\s*=/.test(code) ? NO('Vẫn còn dòng gán componentInstance.name.') : OK();
    },
  },
  {
    id: 'http-testing', group: 'Service', title: 'Test service gọi HTTP mà không gọi mạng thật', level: 'Trung bình', lv: 2, waitMs: 1200,
    desc: `<p><code>provideHttpClientTesting()</code> (đặt <b>sau</b> <code>provideHttpClient()</code>) thay backend thật bằng backend giả: request không đi ra mạng mà nằm chờ. Trong test, lấy <code>HttpTestingController</code>, tìm request bằng <code>expectOne(url)</code> rồi trả dữ liệu bằng <code>flush(…)</code>. <code>verify()</code> trong <code>afterEach</code> bảo đảm không còn request nào bị bỏ quên.</p>
<p><b>Yêu cầu:</b> test "load() lưu kết quả" phải đạt: trả về 2 sản phẩm cho request <code>/api/products</code>.</p>`,
    starter: `@Injectable({ providedIn: 'root' })
class ProductService {
  private http = inject(HttpClient);
  products = signal([]);
  load() {
    this.http.get('/api/products').subscribe((list) => this.products.set(list));
  }
}

describe('ProductService', () => {
  let service;
  let http;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('load() lưu kết quả', () => {
    service.load();
    // TODO: tìm request GET /api/products và trả về 2 sản phẩm
    expect(service.products()).toHaveLength(2);
  });
});
`,
    solution: `@Injectable({ providedIn: 'root' })
class ProductService {
  private http = inject(HttpClient);
  products = signal([]);
  load() {
    this.http.get('/api/products').subscribe((list) => this.products.set(list));
  }
}

describe('ProductService', () => {
  let service;
  let http;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('load() lưu kết quả', () => {
    service.load();
    const req = http.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Áo mưa' }, { id: 2, name: 'Ô gấp' }]);
    expect(service.products()).toHaveLength(2);
  });
});
`,
    hint: "Trước expect: http.expectOne('/api/products').flush([{ id: 1, name: 'Áo mưa' }, { id: 2, name: 'Ô gấp' }]);",
    explain: 'Muốn test nhánh lỗi: req.flush("Lỗi", { status: 500, statusText: "Server Error" }). expectOne báo lỗi nếu không có, hoặc có nhiều hơn một request khớp URL.',
    check(a, code) {
      const bad = allPass(a, 1);
      if (bad) return bad;
      return /expectOne\s*\(/.test(code) ? OK() : NO('Hãy dùng HttpTestingController.expectOne để trả dữ liệu cho request.');
    },
  },
  {
    id: 'hanh-vi', group: 'Viết test tốt', title: 'Test hành vi, không test chi tiết cài đặt', level: 'Trung bình', lv: 2, waitMs: 1200,
    desc: `<p>Test đọc thẳng state bên trong component (<code>componentInstance.count()</code>) sẽ vỡ mỗi khi đổi cách cài đặt, dù người dùng thấy y như cũ. <code>Counter</code> vừa được refactor (đổi <code>count</code> thành <code>clicks</code>) và test đỏ, dù nút vẫn chạy đúng. Hãy test như người dùng: bấm nút thật rồi đọc chữ trên màn hình.</p>
<p><b>Yêu cầu:</b> viết lại test để bấm nút <b>+</b> hai lần và kiểm tra <code>.value</code> hiện <code>2</code>, không đọc <code>componentInstance</code>.</p>`,
    starter: `@Component({
  selector: 'app-counter',
  template: '<button (click)="inc()">+</button> <span class="value">{{ clicks() }}</span>',
})
class Counter {
  clicks = signal(0); // vừa đổi tên từ count
  inc() { this.clicks.update((n) => n + 1); }
}

describe('Counter', () => {
  it('bấm hai lần thì hiện 2', async () => {
    const fixture = TestBed.createComponent(Counter);
    fixture.componentInstance.inc();
    fixture.componentInstance.inc();
    expect(fixture.componentInstance.count()).toBe(2); // ❗ phụ thuộc tên biến bên trong
  });
});
`,
    solution: `@Component({
  selector: 'app-counter',
  template: '<button (click)="inc()">+</button> <span class="value">{{ clicks() }}</span>',
})
class Counter {
  clicks = signal(0);
  inc() { this.clicks.update((n) => n + 1); }
}

describe('Counter', () => {
  it('bấm hai lần thì hiện 2', async () => {
    const fixture = TestBed.createComponent(Counter);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    button.click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.value').textContent).toBe('2');
  });
});
`,
    hint: "Lấy nút bằng fixture.nativeElement.querySelector('button'), click() hai lần, await fixture.whenStable(), rồi expect(...querySelector('.value').textContent).toBe('2').",
    explain: 'Angular Testing Library và component harness của CDK đi theo cùng ý tưởng: tìm phần tử như người dùng (theo vai trò, theo chữ), tương tác, rồi kiểm tra kết quả nhìn thấy được.',
    check(a, code) {
      const bad = allPass(a, 1);
      if (bad) return bad;
      if (/componentInstance\./.test(code)) return NO('Test vẫn đọc componentInstance: hãy bấm nút thật và kiểm tra DOM.');
      return /\.click\(\)/.test(code) ? OK() : NO('Test cần bấm nút (click()) như người dùng.');
    },
  },
];

export const LAB: LabModule = {
  title: 'Testing với TestBed',
  subtitle: 'bài luyện viết test chạy trên TestBed thật: provide bản giả, đợi whenStable, setInput, HttpTestingController, test hành vi thay vì chi tiết cài đặt.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-testing').then((m) => m.testingExtras()),
  cheatsheet: [
    ['Cấu hình', '<code>TestBed.configureTestingModule({ imports: [Cmp], providers: [...] })</code>'],
    ['Bản giả', '<code>{ provide: CartService, useValue: { add: fn() } }</code>'],
    ['Tạo + đợi', '<code>const f = TestBed.createComponent(Cmp); await f.whenStable()</code>'],
    ['Input', '<code>f.componentRef.setInput(\'name\', v)</code>'],
    ['HTTP giả', '<code>provideHttpClient(), provideHttpClientTesting()</code> + <code>expectOne(url).flush(data)</code>'],
    ['Kiểm tra', 'bấm phần tử thật, đọc <code>nativeElement</code>, không đọc state bên trong'],
  ],
};
