import{a as s,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var r={title:`Signals`,subtitle:`bài luyện signal trong component thật: chuỗi computed, cập nhật object lồng nhau, effect cho side effect, không dùng effect để tính dữ liệu, lọc danh sách, resource().`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Thử <code>signal</code>, <code>computed</code>, <code>effect</code>, <code>linkedSignal</code>, <code>resource</code> trong component. Đặt <code>{ debugName: 'tên' }</code> để theo dõi giá trị ở tab <b>Signals</b>.</p>`,starter:`@Component({
  selector: 'app-cart',
  template: \`
    <p>{{ qty() }} \xD7 {{ price() }} = {{ total() }}</p>
    <button (click)="qty.update(q => q + 1)">+1</button>
    <button (click)="qty.update(q => Math.max(0, q - 1))">-1</button>
  \`,
})
class Cart {
  price = signal(25000, { debugName: 'price' });
  qty = signal(1, { debugName: 'qty' });
  total = computed(() => this.price() * this.qty(), { debugName: 'total' });

  constructor() {
    effect(() => log('total =', this.total()));
  }
}

mount(Cart);
`},{id:`computed-chain`,group:`computed`,title:`Chuỗi computed`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>Gi\xE1 tr\u1ECB d\u1EABn xu\u1EA5t c\xF3 th\u1EC3 n\u1ED1i nhau: <code>subtotal</code> t\u1EEB <code>price</code> v\xE0 <code>qty</code>, <code>freeShip</code> t\u1EEB <code>subtotal</code>, <code>shipLabel</code> t\u1EEB <code>freeShip</code>. M\u1ED7i computed ch\u1EC9 t\xEDnh l\u1EA1i khi ph\u1EE5 thu\u1ED9c c\u1EE7a n\xF3 th\u1EADt s\u1EF1 \u0111\u1ED5i gi\xE1 tr\u1ECB.</p>
<p><b>Y\xEAu c\u1EA7u:</b> <code>subtotal = price \xD7 qty</code>; mi\u1EC5n ship khi <code>subtotal \u2265 500000</code>; nh\xE3n l\xE0 <code>Mi\u1EC5n ph\xED v\u1EADn chuy\u1EC3n</code> ho\u1EB7c <code>Ph\xED ship: 30000</code>. Khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm 1 c\xE1i</b> ba l\u1EA7n.</p>`,starter:`@Component({
  selector: 'app-cart-summary',
  template: \`
    <p class="sub">T\u1EA1m t\xEDnh: {{ subtotal() }}</p>
    <p class="ship">{{ shipLabel() }}</p>
    <button (click)="qty.update(q => q + 1)">Th\xEAm 1 c\xE1i</button>
  \`,
})
class CartSummary {
  price = signal(150000);
  qty = signal(1);
  // TODO: d\xF9ng computed cho subtotal, freeShip v\xE0 shipLabel
  subtotal = signal(0);
  shipLabel = signal('');
}

mount(CartSummary);
`,solution:`@Component({
  selector: 'app-cart-summary',
  template: \`
    <p class="sub">T\u1EA1m t\xEDnh: {{ subtotal() }}</p>
    <p class="ship">{{ shipLabel() }}</p>
    <button (click)="qty.update(q => q + 1)">Th\xEAm 1 c\xE1i</button>
  \`,
})
class CartSummary {
  price = signal(150000);
  qty = signal(1);
  subtotal = computed(() => this.price() * this.qty());
  freeShip = computed(() => this.subtotal() >= 500000);
  shipLabel = computed(() => (this.freeShip() ? 'Mi\u1EC5n ph\xED v\u1EADn chuy\u1EC3n' : 'Ph\xED ship: 30000'));
}

mount(CartSummary);
`,hint:`subtotal = computed(() => this.price() * this.qty()); freeShip = computed(() => this.subtotal() >= 500000); shipLabel = computed(() => this.freeShip() ? … : …);`,explain:`Từ qty 1 lên 2, subtotal đổi nhưng freeShip vẫn là false, nên shipLabel không phải tính lại. computed so sánh giá trị (Object.is) để cắt ngắn việc tính toán phía sau.`,simulate(t){t.at(50,()=>t.dom(e=>e.setAttribute(`data-init`,(e.querySelector(`.ship`)?.textContent??``).trim()))),[150,250,350].forEach(e=>t.at(e,()=>t.click(`Thêm 1 cái`)))},check(t){if(t.root()?.getAttribute(`data-init`)!==`Phí ship: 30000`)return s(`Lúc đầu (150000) nhãn cần là "Phí ship: 30000".`);let e=t.text(`.sub`),c=t.text(`.ship`);return e!==`Tạm tính: 600000`?s(`Tạm tính đang là "`+e+`", cần "Tạm tính: 600000".`):c!==`Miễn phí vận chuyển`?s(`Nhãn đang là "`+c+`", cần "Miễn phí vận chuyển".`):i()}},{id:`object-long-nhau`,group:`Cập nhật`,title:`Cập nhật object lồng nhau`,level:`Trung bình`,lv:2,waitMs:500,desc:`<p>S\u1EEDa tr\u1EF1c ti\u1EBFp <code>this.profile().address.city = \u2026</code> kh\xF4ng \u0111\u1ED5i tham chi\u1EBFu, n\xEAn signal kh\xF4ng b\xE1o thay \u0111\u1ED5i v\xE0 c\xE1c <code>computed</code> ph\u1EE5 thu\u1ED9c gi\u1EEF gi\xE1 tr\u1ECB c\u0169. D\xF9ng <code>update</code> v\xE0 t\u1EA1o object m\u1EDBi \u1EDF <b>m\u1ECDi t\u1EA7ng</b> b\u1ECB \u0111\u1ED5i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Chuy\u1EC3n v\xE0o TP.HCM</b>; nh\xE3n ph\u1EA3i th\xE0nh <code>B\xEDp s\u1ED1ng \u1EDF TP.HCM (Qu\u1EADn 1)</code>.</p>`,starter:`@Component({
  selector: 'app-profile',
  template: \`
    <p class="where">{{ label() }}</p>
    <button (click)="move()">Chuy\u1EC3n v\xE0o TP.HCM</button>
  \`,
})
class Profile {
  profile = signal({ name: 'B\xEDp', address: { city: 'H\xE0 N\u1ED9i', district: 'C\u1EA7u Gi\u1EA5y' } });
  label = computed(() => this.profile().name + ' s\u1ED1ng \u1EDF ' + this.profile().address.city + ' (' + this.profile().address.district + ')');

  move() {
    // \u2757 s\u1EEDa tr\u1EF1c ti\u1EBFp object b\xEAn trong signal
    this.profile().address.city = 'TP.HCM';
    this.profile().address.district = 'Qu\u1EADn 1';
  }
}

mount(Profile);
`,solution:`@Component({
  selector: 'app-profile',
  template: \`
    <p class="where">{{ label() }}</p>
    <button (click)="move()">Chuy\u1EC3n v\xE0o TP.HCM</button>
  \`,
})
class Profile {
  profile = signal({ name: 'B\xEDp', address: { city: 'H\xE0 N\u1ED9i', district: 'C\u1EA7u Gi\u1EA5y' } });
  label = computed(() => this.profile().name + ' s\u1ED1ng \u1EDF ' + this.profile().address.city + ' (' + this.profile().address.district + ')');

  move() {
    this.profile.update(p => ({
      ...p,
      address: { ...p.address, city: 'TP.HCM', district: 'Qu\u1EADn 1' },
    }));
  }
}

mount(Profile);
`,hint:`this.profile.update(p => ({ ...p, address: { ...p.address, city: 'TP.HCM', district: 'Quận 1' } }));`,explain:`State lồng sâu nhiều tầng là dấu hiệu nên tách nhỏ: address = signal({...}) riêng, hoặc dùng SignalStore với patchState (bài State lớn với SignalStore).`,simulate(t){t.at(150,()=>t.click(`Chuyển vào TP.HCM`))},check(t){let e=t.text(`.where`);return e===`Bíp sống ở TP.HCM (Quận 1)`?i():e.includes(`Hà Nội`)?s(`Nhãn vẫn là Hà Nội: object bị sửa tại chỗ nên signal không báo thay đổi.`):s(`Nhãn đang là "`+e+`", cần "Bíp sống ở TP.HCM (Quận 1)".`)}},{id:`effect-side-effect`,group:`effect`,title:`Side effect dùng effect, không dùng computed`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p><code>computed</code> ph\u1EA3i thu\u1EA7n (ch\u1EC9 t\xEDnh ra gi\xE1 tr\u1ECB) v\xE0 <b>ch\u1EC9 ch\u1EA1y khi c\xF3 ng\u01B0\u1EDDi \u0111\u1ECDc</b>. Vi\u1EC7c \u0111\u1EA9y d\u1EEF li\u1EC7u ra ngo\xE0i (l\u01B0u localStorage, g\u1EEDi analytics, v\u1EBD chart) l\xE0 side effect, n\xEAn \u0111\u1EB7t trong <code>effect()</code>: effect t\u1EF1 ch\u1EA1y l\u1EA1i m\u1ED7i khi signal n\xF3 \u0111\u1ECDc thay \u0111\u1ED5i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> m\u1ED7i l\u1EA7n theme \u0111\u1ED5i ph\u1EA3i \u0111\u01B0\u1EE3c l\u01B0u. Khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\u1ED5i theme</b> hai l\u1EA7n; log ph\u1EA3i l\xE0 <code>l\u01B0u theme = light</code>, <code>l\u01B0u theme = dark</code>, <code>l\u01B0u theme = light</code>.</p>`,starter:`const storage = {
  setItem: (key, value) => log('l\u01B0u ' + key + ' = ' + value),
};

@Component({
  selector: 'app-theme',
  template: '<p class="t">Theme: {{ theme() }}</p><button (click)="toggle()">\u0110\u1ED5i theme</button>',
})
class ThemeToggle {
  theme = signal('light');
  // \u2757 computed kh\xF4ng ai \u0111\u1ECDc th\xEC kh\xF4ng bao gi\u1EDD ch\u1EA1y, v\xE0 kh\xF4ng d\xE0nh cho side effect
  persist = computed(() => storage.setItem('theme', this.theme()));

  toggle() {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }
}

mount(ThemeToggle);
`,solution:`const storage = {
  setItem: (key, value) => log('l\u01B0u ' + key + ' = ' + value),
};

@Component({
  selector: 'app-theme',
  template: '<p class="t">Theme: {{ theme() }}</p><button (click)="toggle()">\u0110\u1ED5i theme</button>',
})
class ThemeToggle {
  theme = signal('light');

  constructor() {
    effect(() => storage.setItem('theme', this.theme()));
  }

  toggle() {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }
}

mount(ThemeToggle);
`,hint:`Bỏ persist; thêm constructor() { effect(() => storage.setItem('theme', this.theme())); }`,explain:`effect tạo trong component tự bị huỷ cùng component. Effect chạy bất đồng bộ và gộp các thay đổi: set theme nhiều lần trong cùng một tick thì chỉ lưu giá trị cuối.`,simulate(t){t.at(150,()=>t.click(`Đổi theme`)),t.at(350,()=>t.click(`Đổi theme`))},check(t){let e=t.logs.filter(o=>o.startsWith(`lưu`)),c=[`lưu theme = light`,`lưu theme = dark`,`lưu theme = light`];return JSON.stringify(e)===JSON.stringify(c)?i():e.length?s(`Log đang là `+JSON.stringify(e)+`, mong đợi `+JSON.stringify(c)+`.`):s(`Không có lần lưu nào: computed không ai đọc thì không chạy. Dùng effect().`)}},{id:`khong-dung-effect`,group:`effect`,title:`Đừng dùng effect để tính dữ liệu dẫn xuất`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>D\xF9ng <code>effect</code> \u0111\u1EC3 <code>set()</code> m\u1ED9t signal kh\xE1c t\u1EEB signal n\xE0y l\xE0 anti-pattern: gi\xE1 tr\u1ECB b\u1ECB tr\u1EC5 m\u1ED9t nh\u1ECBp, d\u1EC5 t\u1EA1o v\xF2ng l\u1EB7p, v\xE0 kh\xF3 theo d\xF5i. Gi\xE1 tr\u1ECB suy ra t\u1EEB state kh\xE1c lu\xF4n d\xF9ng <code>computed</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1ECF <code>effect</code>, vi\u1EBFt <code>count</code> v\xE0 <code>label</code> b\u1EB1ng <code>computed</code>. Khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm m\xF3n</b> hai l\u1EA7n; nh\xE3n ph\u1EA3i l\xE0 <code>C\xF3 3 m\xF3n</code>.</p>`,starter:`@Component({
  selector: 'app-basket',
  template: '<p class="label">{{ label() }}</p><button (click)="add()">Th\xEAm m\xF3n</button>',
})
class Basket {
  items = signal(['T\xE1o']);
  count = signal(0);
  label = signal('');

  constructor() {
    // \u2757 copy d\u1EEF li\u1EC7u t\u1EEB signal n\xE0y sang signal kh\xE1c b\u1EB1ng effect
    effect(() => this.count.set(this.items().length));
    effect(() => this.label.set('C\xF3 ' + this.count() + ' m\xF3n'));
  }

  add() {
    this.items.update(list => [...list, 'M\xF3n ' + (list.length + 1)]);
  }
}

mount(Basket);
`,solution:`@Component({
  selector: 'app-basket',
  template: '<p class="label">{{ label() }}</p><button (click)="add()">Th\xEAm m\xF3n</button>',
})
class Basket {
  items = signal(['T\xE1o']);
  count = computed(() => this.items().length);
  label = computed(() => 'C\xF3 ' + this.count() + ' m\xF3n');

  add() {
    this.items.update(list => [...list, 'M\xF3n ' + (list.length + 1)]);
  }
}

mount(Basket);
`,hint:`count = computed(() => this.items().length); label = computed(() => 'Có ' + this.count() + ' món'); và xoá constructor có effect.`,explain:`Quy tắc: "tính ra giá trị" → computed; "làm việc gì đó với thế giới bên ngoài" → effect. Nếu cần một giá trị dẫn xuất mà người dùng vẫn sửa tay được, dùng linkedSignal.`,simulate(t){t.at(150,()=>t.click(`Thêm món`)),t.at(300,()=>t.click(`Thêm món`))},check(t,e){let c=t.text(`.label`);return c!==`Có 3 món`?s(`Nhãn đang là "`+c+`", cần "Có 3 món".`):/effect\s*\(/.test(e)?s(`Kết quả đúng nhưng vẫn dùng effect để tính dữ liệu dẫn xuất. Hãy dùng computed.`):i()}},{id:`loc-danh-sach`,group:`computed`,title:`Lọc danh sách theo nhiều điều kiện`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>T\xECnh hu\u1ED1ng r\u1EA5t hay g\u1EB7p: \xF4 t\xECm ki\u1EBFm + b\u1ED9 l\u1ECDc danh m\u1EE5c. Gi\u1EEF <code>query</code> v\xE0 <code>category</code> l\xE0 signal, c\xF2n danh s\xE1ch hi\u1EC3n th\u1ECB l\xE0 m\u1ED9t <code>computed</code> k\u1EBFt h\u1EE3p c\u1EA3 hai. Kh\xF4ng c\u1EA7n t\u1EF1 g\u1ECDi h\xE0m l\u1ECDc l\u1EA1i sau m\u1ED7i s\u1EF1 ki\u1EC7n.</p>
<p><b>Y\xEAu c\u1EA7u:</b> <code>visible</code> ch\u1EC9 g\u1ED3m s\u1EA3n ph\u1EA9m c\xF3 t\xEAn ch\u1EE9a t\u1EEB kho\xE1 (kh\xF4ng ph\xE2n bi\u1EC7t hoa th\u01B0\u1EDDng) <b>v\xE0</b> \u0111\xFAng danh m\u1EE5c (<code>all</code> = m\u1ECDi danh m\u1EE5c). Khi ki\u1EC3m tra, trang g\xF5 <code>s\u1EEFa</code> r\u1ED3i ch\u1ECDn <b>\u0110\u1ED3 u\u1ED1ng</b>.</p>`,starter:`@Component({
  selector: 'app-catalog',
  template: \`
    <input placeholder="T\xECm\u2026" (input)="query.set($any($event.target).value)" />
    <select (change)="category.set($any($event.target).value)">
      <option value="all">T\u1EA5t c\u1EA3</option>
      <option value="drink">\u0110\u1ED3 u\u1ED1ng</option>
      <option value="food">\u0110\u1ED3 \u0103n</option>
    </select>
    <ul>
      @for (p of visible(); track p.name) { <li>{{ p.name }}</li> }
    </ul>
  \`,
})
class Catalog {
  products = [
    { name: 'Tr\xE0 s\u1EEFa', cat: 'drink' },
    { name: 'C\xE0 ph\xEA s\u1EEFa', cat: 'drink' },
    { name: 'N\u01B0\u1EDBc cam', cat: 'drink' },
    { name: 'B\xE1nh m\xEC', cat: 'food' },
    { name: 'S\u1EEFa chua', cat: 'food' },
  ];
  query = signal('');
  category = signal('all');
  // TODO: l\u1ECDc theo query v\xE0 category
  visible = computed(() => this.products);
}

mount(Catalog);
`,solution:`@Component({
  selector: 'app-catalog',
  template: \`
    <input placeholder="T\xECm\u2026" (input)="query.set($any($event.target).value)" />
    <select (change)="category.set($any($event.target).value)">
      <option value="all">T\u1EA5t c\u1EA3</option>
      <option value="drink">\u0110\u1ED3 u\u1ED1ng</option>
      <option value="food">\u0110\u1ED3 \u0103n</option>
    </select>
    <ul>
      @for (p of visible(); track p.name) { <li>{{ p.name }}</li> }
    </ul>
  \`,
})
class Catalog {
  products = [
    { name: 'Tr\xE0 s\u1EEFa', cat: 'drink' },
    { name: 'C\xE0 ph\xEA s\u1EEFa', cat: 'drink' },
    { name: 'N\u01B0\u1EDBc cam', cat: 'drink' },
    { name: 'B\xE1nh m\xEC', cat: 'food' },
    { name: 'S\u1EEFa chua', cat: 'food' },
  ];
  query = signal('');
  category = signal('all');
  visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) && (cat === 'all' || p.cat === cat)
    );
  });
}

mount(Catalog);
`,hint:`visible = computed(() => this.products.filter(p => p.name.toLowerCase().includes(this.query().toLowerCase()) && (this.category() === 'all' || p.cat === this.category())));`,explain:`Ô tìm kiếm gọi API thì cần debounce (RxJS hoặc rxResource), còn lọc dữ liệu đã có trong bộ nhớ thì computed là đủ và luôn đồng bộ.`,simulate(t){t.at(100,()=>t.type(0,`sữa`)),t.at(250,()=>t.choose(`select`,`drink`))},check(t){let e=t.query(`li`).map(o=>g(o.textContent)),c=[`Trà sữa`,`Cà phê sữa`];return JSON.stringify(e)===JSON.stringify(c)?i():e.length===5?s(`Danh sách chưa được lọc.`):s(`Danh sách đang là `+JSON.stringify(e)+`, mong đợi `+JSON.stringify(c)+`.`)}},{id:`resource`,group:`Bất đồng bộ`,title:`Tải dữ liệu theo signal: resource()`,level:`Khó`,lv:3,waitMs:1200,desc:`<p><code>resource({ params, loader })</code> n\u1ED1i signal v\u1EDBi d\u1EEF li\u1EC7u b\u1EA5t \u0111\u1ED3ng b\u1ED9 (Promise): m\u1ED7i khi <code>params()</code> \u0111\u1ED5i, Angular g\u1ECDi l\u1EA1i <code>loader</code> v\xE0 b\u1ECF k\u1EBFt qu\u1EA3 c\u1EE7a l\u1EA7n g\u1ECDi c\u0169. Resource c\xF3 s\u1EB5n <code>value()</code>, <code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code>, <code>reload()</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> t\u1EA3i user theo <code>id</code>. Loader tr\u1EA3 v\u1EC1 Promise: <code>firstValueFrom(fakeApi.user(params.id))</code>. Khi ki\u1EC3m tra, trang b\u1EA5m <b>User ti\u1EBFp</b> hai l\u1EA7n th\u1EADt nhanh; cu\u1ED1i c\xF9ng ph\u1EA3i hi\u1EC7n <code>User 3</code>.</p>`,starter:`@Component({
  selector: 'app-user',
  template: \`
    <button (click)="id.update(i => i + 1)">User ti\u1EBFp</button>
    @if (user.isLoading()) { <p class="loading">\u0110ang t\u1EA3i\u2026</p> }
    @if (user.hasValue()) { <p class="name">{{ user.value().name }}</p> }
  \`,
})
class UserView {
  id = signal(1);
  // TODO: d\xF9ng resource() \u0111\u1EC3 t\u1EA3i user theo id
  user = { isLoading: () => false, hasValue: () => false, value: () => null };
}

mount(UserView);
`,solution:`@Component({
  selector: 'app-user',
  template: \`
    <button (click)="id.update(i => i + 1)">User ti\u1EBFp</button>
    @if (user.isLoading()) { <p class="loading">\u0110ang t\u1EA3i\u2026</p> }
    @if (user.hasValue()) { <p class="name">{{ user.value().name }}</p> }
  \`,
})
class UserView {
  id = signal(1);
  user = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) => firstValueFrom(fakeApi.user(params.id)),
  });
}

mount(UserView);
`,hint:`user = resource({ params: () => ({ id: this.id() }), loader: ({ params }) => firstValueFrom(fakeApi.user(params.id)) });`,explain:`Gọi API bằng HttpClient thì httpResource(() => "/api/users/" + id()) còn gọn hơn; Observable thì dùng rxResource. Loader nhận thêm abortSignal để huỷ fetch() đang chạy.`,simulate(t){t.at(100,()=>t.click(`User tiếp`)),t.at(200,()=>t.click(`User tiếp`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`.`);let e=t.text(`.name`);return e===`User 3`?i():t.http(`/users`).length?s(`Đang hiển thị "`+(e||t.text())+`", cần "User 3".`):s(`Chưa có request nào: user chưa được tải bằng resource().`)}}],cheatsheet:[[`State`,`<code>signal(v)</code>; đổi bằng <code>.set()</code> / <code>.update()</code>`],[`Giá trị suy ra (kể cả nhiều tầng)`,`<code>computed(() => …)</code>`],[`Đổi object/mảng trong signal`,`<code>update(p => ({ ...p, a: { ...p.a, x } }))</code>; không sửa tại chỗ`],[`Đẩy dữ liệu ra ngoài (lưu, log, chart)`,`<code>effect(() => …)</code> trong constructor`],[`Lọc/sắp xếp dữ liệu đã có`,`<code>computed</code> kết hợp các signal bộ lọc`],[`Tải dữ liệu theo signal`,`<code>resource()</code> (Promise), <code>rxResource()</code> (Observable), <code>httpResource()</code>`]]};export{r as LAB};