import{a as s$1,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var s=t=>{return{pass:t.logs.filter(o=>o.startsWith(`✓ `)).length,fails:t.logs.filter(o=>o.startsWith(`✗ `)),done:t.logs.some(o=>o.startsWith(`Kết quả:`))}};var r=(t,n)=>{if(t.errors.length)return s$1(`Có lỗi: `+t.errMsg());let e=s(t);return e.done?e.fails.length?s$1(`Còn test hỏng: `+e.fails[0].slice(2)):e.pass>=n?null:s$1(`Cần ít nhất `+n+` test đạt (đang có `+e.pass+`).`):s$1(`Bộ test chưa chạy xong. Kiểm tra lại cú pháp describe/it.`)};var u={title:`Testing với TestBed`,subtitle:`bài luyện viết test chạy trên TestBed thật: provide bản giả, đợi whenStable, setInput, HttpTestingController, test hành vi thay vì chi tiết cài đặt.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Vi\u1EBFt test nh\u01B0 trong d\u1EF1 \xE1n: <code>describe</code>, <code>it</code>, <code>beforeEach</code>, <code>expect(\u2026).toBe(\u2026)</code>, ch\u1EA1y tr\xEAn <b>TestBed th\u1EADt</b>. K\u1EBFt qu\u1EA3 t\u1EEBng test hi\u1EC7n trong Console.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>TestBed</code>, <code>describe</code>, <code>it</code>, <code>beforeEach</code>, <code>afterEach</code>, <code>expect</code> (toBe, toEqual, toContain, toBeTruthy, toHaveLength, toHaveBeenCalledWith\u2026, k\xE8m <code>.not</code>), <code>fn()</code> \u0111\u1EC3 t\u1EA1o h\xE0m gi\u1EA3, <code>provideHttpClient</code>, <code>provideHttpClientTesting</code>, <code>HttpTestingController</code>. TestBed ch\u1EA1y zoneless: sau khi \u0111\u1ED5i state, <code>await fixture.whenStable()</code> tr\u01B0\u1EDBc khi \u0111\u1ECDc DOM.</div>`,starter:`@Component({ selector: 'app-hello', template: '<p>Xin ch\xE0o, {{ name() }}!</p>' })
class Hello {
  name = input('b\u1EA1n');
}

describe('Hello', () => {
  it('hi\u1EC7n t\xEAn \u0111\u01B0\u1EE3c truy\u1EC1n v\xE0o', async () => {
    const fixture = TestBed.createComponent(Hello);
    fixture.componentRef.setInput('name', 'B\xEDp');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Xin ch\xE0o, B\xEDp!');
  });
});
`},{id:`provide-fake`,group:`Cấu hình TestBed`,title:`Hết NullInjectorError: provide bản giả`,level:`Dễ`,lv:1,waitMs:1200,desc:`<p>TestBed l\xE0 m\u1ED9t \u1EE9ng d\u1EE5ng nh\u1ECF, ch\u1EC9 c\xF3 nh\u1EEFng g\xEC b\u1EA1n khai b\xE1o. <code>ProductCard</code> inject <code>CartService</code> (trong app th\u1EADt \u0111\u01B0\u1EE3c provide \u1EDF <code>app.config.ts</code>), n\xEAn test b\xE1o <b>NG0201: No provider</b>. Trong unit test c\u1EE7a component, \u0111\u1EEBng k\xE9o service th\u1EADt (n\xF3 c\xF2n g\u1ECDi HTTP): provide m\u1ED9t <b>b\u1EA3n gi\u1EA3</b> b\u1EB1ng <code>{ provide: CartService, useValue: cartFake }</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> c\u1EA3 2 test \u0111\u1EC1u \u0111\u1EA1t.</p>`,starter:`@Injectable()
class CartService {
  private http = inject(HttpClient);
  add(name) { this.http.post('/api/cart', { name }).subscribe(); }
}

@Component({
  selector: 'app-product-card',
  template: '<h3>{{ name() }}</h3><button (click)="add()">Th\xEAm v\xE0o gi\u1ECF</button>',
})
class ProductCard {
  name = input('\xC1o m\u01B0a');
  private cart = inject(CartService);
  add() { this.cart.add(this.name()); }
}

describe('ProductCard', () => {
  let cartFake;

  beforeEach(() => {
    cartFake = { add: fn() };
    TestBed.configureTestingModule({
      imports: [ProductCard],
      // TODO: ProductCard c\u1EA7n CartService, d\xF9ng cartFake thay cho service th\u1EADt
    });
  });

  it('t\u1EA1o \u0111\u01B0\u1EE3c component', () => {
    const fixture = TestBed.createComponent(ProductCard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('b\u1EA5m "Th\xEAm v\xE0o gi\u1ECF" g\u1ECDi cart.add v\u1EDBi t\xEAn s\u1EA3n ph\u1EA9m', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    expect(cartFake.add).toHaveBeenCalledWith('\xC1o m\u01B0a');
  });
});
`,solution:`@Injectable()
class CartService {
  private http = inject(HttpClient);
  add(name) { this.http.post('/api/cart', { name }).subscribe(); }
}

@Component({
  selector: 'app-product-card',
  template: '<h3>{{ name() }}</h3><button (click)="add()">Th\xEAm v\xE0o gi\u1ECF</button>',
})
class ProductCard {
  name = input('\xC1o m\u01B0a');
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

  it('t\u1EA1o \u0111\u01B0\u1EE3c component', () => {
    const fixture = TestBed.createComponent(ProductCard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('b\u1EA5m "Th\xEAm v\xE0o gi\u1ECF" g\u1ECDi cart.add v\u1EDBi t\xEAn s\u1EA3n ph\u1EA9m', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    expect(cartFake.add).toHaveBeenCalledWith('\xC1o m\u01B0a');
  });
});
`,hint:`Thêm providers: [{ provide: CartService, useValue: cartFake }] vào configureTestingModule.`,explain:`Tạo bản giả trong beforeEach để mỗi test có bản mới, không dính số lần gọi của test trước. Khi component chỉ dùng một phần nhỏ của service, bản giả chỉ cần đúng những hàm đó.`,check(t,n){return r(t,2)||(/provide\s*:\s*CartService/.test(n)?i():s$1(`Hãy provide bản giả cho CartService.`))}},{id:`when-stable`,group:`Đọc DOM`,title:`Đợi giao diện cập nhật: await fixture.whenStable()`,level:`Dễ`,lv:1,waitMs:1200,desc:`<p>\u1EE8ng d\u1EE5ng zoneless (m\u1EB7c \u0111\u1ECBnh t\u1EEB Angular 21) c\u1EADp nh\u1EADt DOM <b>b\u1EA5t \u0111\u1ED3ng b\u1ED9</b>: b\u1EA5m n\xFAt l\xE0m signal \u0111\u1ED5i ngay, nh\u01B0ng DOM ch\u1EC9 \u0111\u01B0\u1EE3c v\u1EBD l\u1EA1i \u1EDF l\u01B0\u1EE3t change detection sau. \u0110\u1ECDc DOM ngay sau khi b\u1EA5m th\xEC v\u1EABn th\u1EA5y giao di\u1EC7n c\u0169. H\xE3y <code>await fixture.whenStable()</code> tr\u01B0\u1EDBc khi ki\u1EC3m tra.</p>
<p><b>Y\xEAu c\u1EA7u:</b> test "hi\u1EC7n th\xF4ng b\xE1o sau khi th\xEAm" ph\u1EA3i \u0111\u1EA1t.</p>`,starter:`@Component({
  selector: 'app-add-button',
  template: \`
    <button (click)="added.set(true)">Th\xEAm</button>
    @if (added()) { <p class="toast">\u0110\xE3 th\xEAm v\xE0o gi\u1ECF</p> }
  \`,
})
class AddButton {
  added = signal(false);
}

describe('AddButton', () => {
  it('hi\u1EC7n th\xF4ng b\xE1o sau khi th\xEAm', async () => {
    const fixture = TestBed.createComponent(AddButton);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    // \u2757 \u0111\u1ECDc DOM ngay, giao di\u1EC7n ch\u01B0a \u0111\u01B0\u1EE3c v\u1EBD l\u1EA1i
    expect(fixture.nativeElement.querySelector('.toast')?.textContent).toContain('\u0110\xE3 th\xEAm v\xE0o gi\u1ECF');
  });
});
`,solution:`@Component({
  selector: 'app-add-button',
  template: \`
    <button (click)="added.set(true)">Th\xEAm</button>
    @if (added()) { <p class="toast">\u0110\xE3 th\xEAm v\xE0o gi\u1ECF</p> }
  \`,
})
class AddButton {
  added = signal(false);
}

describe('AddButton', () => {
  it('hi\u1EC7n th\xF4ng b\xE1o sau khi th\xEAm', async () => {
    const fixture = TestBed.createComponent(AddButton);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.toast')?.textContent).toContain('\u0110\xE3 th\xEAm v\xE0o gi\u1ECF');
  });
});
`,hint:`Thêm await fixture.whenStable(); ngay sau dòng click().`,explain:`fixture.detectChanges() cũng vẽ lại ngay (đồng bộ), nhưng whenStable() còn đợi cả các việc bất đồng bộ khác như HTTP giả, @defer, resource. Test nên đợi giống cách người dùng thấy giao diện.`,check(t){return r(t,1)??i()}},{id:`set-input`,group:`Đọc DOM`,title:`Truyền input trong test: componentRef.setInput`,level:`Dễ`,lv:1,waitMs:1200,desc:`<p>G\xE1n <code>fixture.componentInstance.name = 'B\xEDp'</code> l\xE0 thay m\u1EA5t signal input b\u1EB1ng m\u1ED9t chu\u1ED7i, template g\u1ECDi <code>name()</code> s\u1EBD l\u1ED7i (v\xE0 input b\u1EAFt bu\u1ED9c v\u1EABn b\u1ECB coi l\xE0 ch\u01B0a c\xF3). Truy\u1EC1n input \u0111\xFAng nh\u01B0 cha truy\u1EC1n: <code>fixture.componentRef.setInput('name', 'B\xEDp')</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> c\u1EA3 2 test \u0111\u1EC1u \u0111\u1EA1t.</p>`,starter:`@Component({ selector: 'app-greeting', template: '<p class="msg">Xin ch\xE0o, {{ name() }}!</p>' })
class Greeting {
  name = input.required();
}

describe('Greeting', () => {
  it('ch\xE0o \u0111\xFAng t\xEAn', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentInstance.name = 'B\xEDp'; // \u2757
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin ch\xE0o, B\xEDp!');
  });

  it('c\u1EADp nh\u1EADt khi t\xEAn \u0111\u1ED5i', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentInstance.name = 'An'; // \u2757
    await fixture.whenStable();
    fixture.componentInstance.name = 'Chi'; // \u2757
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin ch\xE0o, Chi!');
  });
});
`,solution:`@Component({ selector: 'app-greeting', template: '<p class="msg">Xin ch\xE0o, {{ name() }}!</p>' })
class Greeting {
  name = input.required();
}

describe('Greeting', () => {
  it('ch\xE0o \u0111\xFAng t\xEAn', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentRef.setInput('name', 'B\xEDp');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin ch\xE0o, B\xEDp!');
  });

  it('c\u1EADp nh\u1EADt khi t\xEAn \u0111\u1ED5i', async () => {
    const fixture = TestBed.createComponent(Greeting);
    fixture.componentRef.setInput('name', 'An');
    await fixture.whenStable();
    fixture.componentRef.setInput('name', 'Chi');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent).toBe('Xin ch\xE0o, Chi!');
  });
});
`,hint:`Thay mọi dòng gán fixture.componentInstance.name = … bằng fixture.componentRef.setInput('name', …).`,explain:`setInput đi qua đúng đường của binding [name]: chạy transform, báo component cần vẽ lại. Muốn test cả component cha lẫn con thì tạo một component host nhỏ trong file test.`,check(t,n){return r(t,2)||(/componentInstance\.name\s*=/.test(n)?s$1(`Vẫn còn dòng gán componentInstance.name.`):i())}},{id:`http-testing`,group:`Service`,title:`Test service gọi HTTP mà không gọi mạng thật`,level:`Trung bình`,lv:2,waitMs:1200,desc:`<p><code>provideHttpClientTesting()</code> (\u0111\u1EB7t <b>sau</b> <code>provideHttpClient()</code>) thay backend th\u1EADt b\u1EB1ng backend gi\u1EA3: request kh\xF4ng \u0111i ra m\u1EA1ng m\xE0 n\u1EB1m ch\u1EDD. Trong test, l\u1EA5y <code>HttpTestingController</code>, t\xECm request b\u1EB1ng <code>expectOne(url)</code> r\u1ED3i tr\u1EA3 d\u1EEF li\u1EC7u b\u1EB1ng <code>flush(\u2026)</code>. <code>verify()</code> trong <code>afterEach</code> b\u1EA3o \u0111\u1EA3m kh\xF4ng c\xF2n request n\xE0o b\u1ECB b\u1ECF qu\xEAn.</p>
<p><b>Y\xEAu c\u1EA7u:</b> test "load() l\u01B0u k\u1EBFt qu\u1EA3" ph\u1EA3i \u0111\u1EA1t: tr\u1EA3 v\u1EC1 2 s\u1EA3n ph\u1EA9m cho request <code>/api/products</code>.</p>`,starter:`@Injectable({ providedIn: 'root' })
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

  it('load() l\u01B0u k\u1EBFt qu\u1EA3', () => {
    service.load();
    // TODO: t\xECm request GET /api/products v\xE0 tr\u1EA3 v\u1EC1 2 s\u1EA3n ph\u1EA9m
    expect(service.products()).toHaveLength(2);
  });
});
`,solution:`@Injectable({ providedIn: 'root' })
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

  it('load() l\u01B0u k\u1EBFt qu\u1EA3', () => {
    service.load();
    const req = http.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: '\xC1o m\u01B0a' }, { id: 2, name: '\xD4 g\u1EA5p' }]);
    expect(service.products()).toHaveLength(2);
  });
});
`,hint:`Trước expect: http.expectOne('/api/products').flush([{ id: 1, name: 'Áo mưa' }, { id: 2, name: 'Ô gấp' }]);`,explain:`Muốn test nhánh lỗi: req.flush("Lỗi", { status: 500, statusText: "Server Error" }). expectOne báo lỗi nếu không có, hoặc có nhiều hơn một request khớp URL.`,check(t,n){return r(t,1)||(/expectOne\s*\(/.test(n)?i():s$1(`Hãy dùng HttpTestingController.expectOne để trả dữ liệu cho request.`))}},{id:`hanh-vi`,group:`Viết test tốt`,title:`Test hành vi, không test chi tiết cài đặt`,level:`Trung bình`,lv:2,waitMs:1200,desc:`<p>Test \u0111\u1ECDc th\u1EB3ng state b\xEAn trong component (<code>componentInstance.count()</code>) s\u1EBD v\u1EE1 m\u1ED7i khi \u0111\u1ED5i c\xE1ch c\xE0i \u0111\u1EB7t, d\xF9 ng\u01B0\u1EDDi d\xF9ng th\u1EA5y y nh\u01B0 c\u0169. <code>Counter</code> v\u1EEBa \u0111\u01B0\u1EE3c refactor (\u0111\u1ED5i <code>count</code> th\xE0nh <code>clicks</code>) v\xE0 test \u0111\u1ECF, d\xF9 n\xFAt v\u1EABn ch\u1EA1y \u0111\xFAng. H\xE3y test nh\u01B0 ng\u01B0\u1EDDi d\xF9ng: b\u1EA5m n\xFAt th\u1EADt r\u1ED3i \u0111\u1ECDc ch\u1EEF tr\xEAn m\xE0n h\xECnh.</p>
<p><b>Y\xEAu c\u1EA7u:</b> vi\u1EBFt l\u1EA1i test \u0111\u1EC3 b\u1EA5m n\xFAt <b>+</b> hai l\u1EA7n v\xE0 ki\u1EC3m tra <code>.value</code> hi\u1EC7n <code>2</code>, kh\xF4ng \u0111\u1ECDc <code>componentInstance</code>.</p>`,starter:`@Component({
  selector: 'app-counter',
  template: '<button (click)="inc()">+</button> <span class="value">{{ clicks() }}</span>',
})
class Counter {
  clicks = signal(0); // v\u1EEBa \u0111\u1ED5i t\xEAn t\u1EEB count
  inc() { this.clicks.update((n) => n + 1); }
}

describe('Counter', () => {
  it('b\u1EA5m hai l\u1EA7n th\xEC hi\u1EC7n 2', async () => {
    const fixture = TestBed.createComponent(Counter);
    fixture.componentInstance.inc();
    fixture.componentInstance.inc();
    expect(fixture.componentInstance.count()).toBe(2); // \u2757 ph\u1EE5 thu\u1ED9c t\xEAn bi\u1EBFn b\xEAn trong
  });
});
`,solution:`@Component({
  selector: 'app-counter',
  template: '<button (click)="inc()">+</button> <span class="value">{{ clicks() }}</span>',
})
class Counter {
  clicks = signal(0);
  inc() { this.clicks.update((n) => n + 1); }
}

describe('Counter', () => {
  it('b\u1EA5m hai l\u1EA7n th\xEC hi\u1EC7n 2', async () => {
    const fixture = TestBed.createComponent(Counter);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    button.click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.value').textContent).toBe('2');
  });
});
`,hint:`Lấy nút bằng fixture.nativeElement.querySelector('button'), click() hai lần, await fixture.whenStable(), rồi expect(...querySelector('.value').textContent).toBe('2').`,explain:`Angular Testing Library và component harness của CDK đi theo cùng ý tưởng: tìm phần tử như người dùng (theo vai trò, theo chữ), tương tác, rồi kiểm tra kết quả nhìn thấy được.`,check(t,n){return r(t,1)||(/componentInstance\./.test(n)?s$1(`Test vẫn đọc componentInstance: hãy bấm nút thật và kiểm tra DOM.`):/\.click\(\)/.test(n)?i():s$1(`Test cần bấm nút (click()) như người dùng.`))}}],extras:()=>import(`./chunk-DXC1NnxK.js`).then(t=>t.testingExtras()),cheatsheet:[[`Cấu hình`,`<code>TestBed.configureTestingModule({ imports: [Cmp], providers: [...] })</code>`],[`Bản giả`,`<code>{ provide: CartService, useValue: { add: fn() } }</code>`],[`Tạo + đợi`,`<code>const f = TestBed.createComponent(Cmp); await f.whenStable()</code>`],[`Input`,`<code>f.componentRef.setInput('name', v)</code>`],[`HTTP giả`,`<code>provideHttpClient(), provideHttpClientTesting()</code> + <code>expectOne(url).flush(data)</code>`],[`Kiểm tra`,`bấm phần tử thật, đọc <code>nativeElement</code>, không đọc state bên trong`]]};export{u as LAB};