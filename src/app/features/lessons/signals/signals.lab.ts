import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 8 — Signals: chuỗi computed, cập nhật object lồng nhau bất biến,
 * effect cho side effect, không dùng effect để tính dữ liệu dẫn xuất, lọc danh sách bằng computed,
 * tải dữ liệu bằng resource().
 * (Các bài signal/effect thuần logic khác nằm trong module luyện tập RxJS + Signal.)
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử <code>signal</code>, <code>computed</code>, <code>effect</code>, <code>linkedSignal</code>, <code>resource</code> trong component. Đặt <code>{ debugName: 'tên' }</code> để theo dõi giá trị ở tab <b>Signals</b>.</p>`,
    starter: `@Component({
  selector: 'app-cart',
  template: \`
    <p>{{ qty() }} × {{ price() }} = {{ total() }}</p>
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
`,
  },
  {
    id: 'computed-chain', group: 'computed', title: 'Chuỗi computed', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p>Giá trị dẫn xuất có thể nối nhau: <code>subtotal</code> từ <code>price</code> và <code>qty</code>, <code>freeShip</code> từ <code>subtotal</code>, <code>shipLabel</code> từ <code>freeShip</code>. Mỗi computed chỉ tính lại khi phụ thuộc của nó thật sự đổi giá trị.</p>
<p><b>Yêu cầu:</b> <code>subtotal = price × qty</code>; miễn ship khi <code>subtotal ≥ 500000</code>; nhãn là <code>Miễn phí vận chuyển</code> hoặc <code>Phí ship: 30000</code>. Khi kiểm tra, trang bấm <b>Thêm 1 cái</b> ba lần.</p>`,
    starter: `@Component({
  selector: 'app-cart-summary',
  template: \`
    <p class="sub">Tạm tính: {{ subtotal() }}</p>
    <p class="ship">{{ shipLabel() }}</p>
    <button (click)="qty.update(q => q + 1)">Thêm 1 cái</button>
  \`,
})
class CartSummary {
  price = signal(150000);
  qty = signal(1);
  // TODO: dùng computed cho subtotal, freeShip và shipLabel
  subtotal = signal(0);
  shipLabel = signal('');
}

mount(CartSummary);
`,
    solution: `@Component({
  selector: 'app-cart-summary',
  template: \`
    <p class="sub">Tạm tính: {{ subtotal() }}</p>
    <p class="ship">{{ shipLabel() }}</p>
    <button (click)="qty.update(q => q + 1)">Thêm 1 cái</button>
  \`,
})
class CartSummary {
  price = signal(150000);
  qty = signal(1);
  subtotal = computed(() => this.price() * this.qty());
  freeShip = computed(() => this.subtotal() >= 500000);
  shipLabel = computed(() => (this.freeShip() ? 'Miễn phí vận chuyển' : 'Phí ship: 30000'));
}

mount(CartSummary);
`,
    hint: 'subtotal = computed(() => this.price() * this.qty()); freeShip = computed(() => this.subtotal() >= 500000); shipLabel = computed(() => this.freeShip() ? … : …);',
    explain: 'Từ qty 1 lên 2, subtotal đổi nhưng freeShip vẫn là false, nên shipLabel không phải tính lại. computed so sánh giá trị (Object.is) để cắt ngắn việc tính toán phía sau.',
    simulate(s) {
      s.at(50, () => s.dom((r) => r.setAttribute('data-init', (r.querySelector('.ship')?.textContent ?? '').trim())));
      [150, 250, 350].forEach((t) => s.at(t, () => s.click('Thêm 1 cái')));
    },
    check(a) {
      if (a.root()?.getAttribute('data-init') !== 'Phí ship: 30000') return NO('Lúc đầu (150000) nhãn cần là "Phí ship: 30000".');
      const sub = a.text('.sub'), ship = a.text('.ship');
      if (sub !== 'Tạm tính: 600000') return NO('Tạm tính đang là "' + sub + '", cần "Tạm tính: 600000".');
      if (ship !== 'Miễn phí vận chuyển') return NO('Nhãn đang là "' + ship + '", cần "Miễn phí vận chuyển".');
      return OK();
    },
  },
  {
    id: 'object-long-nhau', group: 'Cập nhật', title: 'Cập nhật object lồng nhau', level: 'Trung bình', lv: 2, waitMs: 500,
    desc: `<p>Sửa trực tiếp <code>this.profile().address.city = …</code> không đổi tham chiếu, nên signal không báo thay đổi và các <code>computed</code> phụ thuộc giữ giá trị cũ. Dùng <code>update</code> và tạo object mới ở <b>mọi tầng</b> bị đổi.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Chuyển vào TP.HCM</b>; nhãn phải thành <code>Bíp sống ở TP.HCM (Quận 1)</code>.</p>`,
    starter: `@Component({
  selector: 'app-profile',
  template: \`
    <p class="where">{{ label() }}</p>
    <button (click)="move()">Chuyển vào TP.HCM</button>
  \`,
})
class Profile {
  profile = signal({ name: 'Bíp', address: { city: 'Hà Nội', district: 'Cầu Giấy' } });
  label = computed(() => this.profile().name + ' sống ở ' + this.profile().address.city + ' (' + this.profile().address.district + ')');

  move() {
    // ❗ sửa trực tiếp object bên trong signal
    this.profile().address.city = 'TP.HCM';
    this.profile().address.district = 'Quận 1';
  }
}

mount(Profile);
`,
    solution: `@Component({
  selector: 'app-profile',
  template: \`
    <p class="where">{{ label() }}</p>
    <button (click)="move()">Chuyển vào TP.HCM</button>
  \`,
})
class Profile {
  profile = signal({ name: 'Bíp', address: { city: 'Hà Nội', district: 'Cầu Giấy' } });
  label = computed(() => this.profile().name + ' sống ở ' + this.profile().address.city + ' (' + this.profile().address.district + ')');

  move() {
    this.profile.update(p => ({
      ...p,
      address: { ...p.address, city: 'TP.HCM', district: 'Quận 1' },
    }));
  }
}

mount(Profile);
`,
    hint: "this.profile.update(p => ({ ...p, address: { ...p.address, city: 'TP.HCM', district: 'Quận 1' } }));",
    explain: 'State lồng sâu nhiều tầng là dấu hiệu nên tách nhỏ: address = signal({...}) riêng, hoặc dùng SignalStore với patchState (bài State lớn với SignalStore).',
    simulate(s) { s.at(150, () => s.click('Chuyển vào TP.HCM')); },
    check(a) {
      const t = a.text('.where');
      if (t === 'Bíp sống ở TP.HCM (Quận 1)') return OK();
      if (t.includes('Hà Nội')) return NO('Nhãn vẫn là Hà Nội: object bị sửa tại chỗ nên signal không báo thay đổi.');
      return NO('Nhãn đang là "' + t + '", cần "Bíp sống ở TP.HCM (Quận 1)".');
    },
  },
  {
    id: 'effect-side-effect', group: 'effect', title: 'Side effect dùng effect, không dùng computed', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p><code>computed</code> phải thuần (chỉ tính ra giá trị) và <b>chỉ chạy khi có người đọc</b>. Việc đẩy dữ liệu ra ngoài (lưu localStorage, gửi analytics, vẽ chart) là side effect, nên đặt trong <code>effect()</code>: effect tự chạy lại mỗi khi signal nó đọc thay đổi.</p>
<p><b>Yêu cầu:</b> mỗi lần theme đổi phải được lưu. Khi kiểm tra, trang bấm <b>Đổi theme</b> hai lần; log phải là <code>lưu theme = light</code>, <code>lưu theme = dark</code>, <code>lưu theme = light</code>.</p>`,
    starter: `const storage = {
  setItem: (key, value) => log('lưu ' + key + ' = ' + value),
};

@Component({
  selector: 'app-theme',
  template: '<p class="t">Theme: {{ theme() }}</p><button (click)="toggle()">Đổi theme</button>',
})
class ThemeToggle {
  theme = signal('light');
  // ❗ computed không ai đọc thì không bao giờ chạy, và không dành cho side effect
  persist = computed(() => storage.setItem('theme', this.theme()));

  toggle() {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }
}

mount(ThemeToggle);
`,
    solution: `const storage = {
  setItem: (key, value) => log('lưu ' + key + ' = ' + value),
};

@Component({
  selector: 'app-theme',
  template: '<p class="t">Theme: {{ theme() }}</p><button (click)="toggle()">Đổi theme</button>',
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
`,
    hint: "Bỏ persist; thêm constructor() { effect(() => storage.setItem('theme', this.theme())); }",
    explain: 'effect tạo trong component tự bị huỷ cùng component. Effect chạy bất đồng bộ và gộp các thay đổi: set theme nhiều lần trong cùng một tick thì chỉ lưu giá trị cuối.',
    simulate(s) { s.at(150, () => s.click('Đổi theme')); s.at(350, () => s.click('Đổi theme')); },
    check(a) {
      const saves = a.logs.filter((l) => l.startsWith('lưu'));
      const want = ['lưu theme = light', 'lưu theme = dark', 'lưu theme = light'];
      if (JSON.stringify(saves) === JSON.stringify(want)) return OK();
      if (!saves.length) return NO('Không có lần lưu nào: computed không ai đọc thì không chạy. Dùng effect().');
      return NO('Log đang là ' + JSON.stringify(saves) + ', mong đợi ' + JSON.stringify(want) + '.');
    },
  },
  {
    id: 'khong-dung-effect', group: 'effect', title: 'Đừng dùng effect để tính dữ liệu dẫn xuất', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Dùng <code>effect</code> để <code>set()</code> một signal khác từ signal này là anti-pattern: giá trị bị trễ một nhịp, dễ tạo vòng lặp, và khó theo dõi. Giá trị suy ra từ state khác luôn dùng <code>computed</code>.</p>
<p><b>Yêu cầu:</b> bỏ <code>effect</code>, viết <code>count</code> và <code>label</code> bằng <code>computed</code>. Khi kiểm tra, trang bấm <b>Thêm món</b> hai lần; nhãn phải là <code>Có 3 món</code>.</p>`,
    starter: `@Component({
  selector: 'app-basket',
  template: '<p class="label">{{ label() }}</p><button (click)="add()">Thêm món</button>',
})
class Basket {
  items = signal(['Táo']);
  count = signal(0);
  label = signal('');

  constructor() {
    // ❗ copy dữ liệu từ signal này sang signal khác bằng effect
    effect(() => this.count.set(this.items().length));
    effect(() => this.label.set('Có ' + this.count() + ' món'));
  }

  add() {
    this.items.update(list => [...list, 'Món ' + (list.length + 1)]);
  }
}

mount(Basket);
`,
    solution: `@Component({
  selector: 'app-basket',
  template: '<p class="label">{{ label() }}</p><button (click)="add()">Thêm món</button>',
})
class Basket {
  items = signal(['Táo']);
  count = computed(() => this.items().length);
  label = computed(() => 'Có ' + this.count() + ' món');

  add() {
    this.items.update(list => [...list, 'Món ' + (list.length + 1)]);
  }
}

mount(Basket);
`,
    hint: "count = computed(() => this.items().length); label = computed(() => 'Có ' + this.count() + ' món'); và xoá constructor có effect.",
    explain: 'Quy tắc: "tính ra giá trị" → computed; "làm việc gì đó với thế giới bên ngoài" → effect. Nếu cần một giá trị dẫn xuất mà người dùng vẫn sửa tay được, dùng linkedSignal.',
    simulate(s) { s.at(150, () => s.click('Thêm món')); s.at(300, () => s.click('Thêm món')); },
    check(a, code) {
      const t = a.text('.label');
      if (t !== 'Có 3 món') return NO('Nhãn đang là "' + t + '", cần "Có 3 món".');
      if (/effect\s*\(/.test(code)) return NO('Kết quả đúng nhưng vẫn dùng effect để tính dữ liệu dẫn xuất. Hãy dùng computed.');
      return OK();
    },
  },
  {
    id: 'loc-danh-sach', group: 'computed', title: 'Lọc danh sách theo nhiều điều kiện', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Tình huống rất hay gặp: ô tìm kiếm + bộ lọc danh mục. Giữ <code>query</code> và <code>category</code> là signal, còn danh sách hiển thị là một <code>computed</code> kết hợp cả hai. Không cần tự gọi hàm lọc lại sau mỗi sự kiện.</p>
<p><b>Yêu cầu:</b> <code>visible</code> chỉ gồm sản phẩm có tên chứa từ khoá (không phân biệt hoa thường) <b>và</b> đúng danh mục (<code>all</code> = mọi danh mục). Khi kiểm tra, trang gõ <code>sữa</code> rồi chọn <b>Đồ uống</b>.</p>`,
    starter: `@Component({
  selector: 'app-catalog',
  template: \`
    <input placeholder="Tìm…" (input)="query.set($any($event.target).value)" />
    <select (change)="category.set($any($event.target).value)">
      <option value="all">Tất cả</option>
      <option value="drink">Đồ uống</option>
      <option value="food">Đồ ăn</option>
    </select>
    <ul>
      @for (p of visible(); track p.name) { <li>{{ p.name }}</li> }
    </ul>
  \`,
})
class Catalog {
  products = [
    { name: 'Trà sữa', cat: 'drink' },
    { name: 'Cà phê sữa', cat: 'drink' },
    { name: 'Nước cam', cat: 'drink' },
    { name: 'Bánh mì', cat: 'food' },
    { name: 'Sữa chua', cat: 'food' },
  ];
  query = signal('');
  category = signal('all');
  // TODO: lọc theo query và category
  visible = computed(() => this.products);
}

mount(Catalog);
`,
    solution: `@Component({
  selector: 'app-catalog',
  template: \`
    <input placeholder="Tìm…" (input)="query.set($any($event.target).value)" />
    <select (change)="category.set($any($event.target).value)">
      <option value="all">Tất cả</option>
      <option value="drink">Đồ uống</option>
      <option value="food">Đồ ăn</option>
    </select>
    <ul>
      @for (p of visible(); track p.name) { <li>{{ p.name }}</li> }
    </ul>
  \`,
})
class Catalog {
  products = [
    { name: 'Trà sữa', cat: 'drink' },
    { name: 'Cà phê sữa', cat: 'drink' },
    { name: 'Nước cam', cat: 'drink' },
    { name: 'Bánh mì', cat: 'food' },
    { name: 'Sữa chua', cat: 'food' },
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
`,
    hint: "visible = computed(() => this.products.filter(p => p.name.toLowerCase().includes(this.query().toLowerCase()) && (this.category() === 'all' || p.cat === this.category())));",
    explain: 'Ô tìm kiếm gọi API thì cần debounce (RxJS hoặc rxResource), còn lọc dữ liệu đã có trong bộ nhớ thì computed là đủ và luôn đồng bộ.',
    simulate(s) { s.at(100, () => s.type(0, 'sữa')); s.at(250, () => s.choose('select', 'drink')); },
    check(a) {
      const names = a.query('li').map((li) => norm(li.textContent));
      const want = ['Trà sữa', 'Cà phê sữa'];
      if (JSON.stringify(names) === JSON.stringify(want)) return OK();
      if (names.length === 5) return NO('Danh sách chưa được lọc.');
      return NO('Danh sách đang là ' + JSON.stringify(names) + ', mong đợi ' + JSON.stringify(want) + '.');
    },
  },
  {
    id: 'resource', group: 'Bất đồng bộ', title: 'Tải dữ liệu theo signal: resource()', level: 'Khó', lv: 3, waitMs: 1200,
    desc: `<p><code>resource({ params, loader })</code> nối signal với dữ liệu bất đồng bộ (Promise): mỗi khi <code>params()</code> đổi, Angular gọi lại <code>loader</code> và bỏ kết quả của lần gọi cũ. Resource có sẵn <code>value()</code>, <code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code>, <code>reload()</code>.</p>
<p><b>Yêu cầu:</b> tải user theo <code>id</code>. Loader trả về Promise: <code>firstValueFrom(fakeApi.user(params.id))</code>. Khi kiểm tra, trang bấm <b>User tiếp</b> hai lần thật nhanh; cuối cùng phải hiện <code>User 3</code>.</p>`,
    starter: `@Component({
  selector: 'app-user',
  template: \`
    <button (click)="id.update(i => i + 1)">User tiếp</button>
    @if (user.isLoading()) { <p class="loading">Đang tải…</p> }
    @if (user.hasValue()) { <p class="name">{{ user.value().name }}</p> }
  \`,
})
class UserView {
  id = signal(1);
  // TODO: dùng resource() để tải user theo id
  user = { isLoading: () => false, hasValue: () => false, value: () => null };
}

mount(UserView);
`,
    solution: `@Component({
  selector: 'app-user',
  template: \`
    <button (click)="id.update(i => i + 1)">User tiếp</button>
    @if (user.isLoading()) { <p class="loading">Đang tải…</p> }
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
`,
    hint: 'user = resource({ params: () => ({ id: this.id() }), loader: ({ params }) => firstValueFrom(fakeApi.user(params.id)) });',
    explain: 'Gọi API bằng HttpClient thì httpResource(() => "/api/users/" + id()) còn gọn hơn; Observable thì dùng rxResource. Loader nhận thêm abortSignal để huỷ fetch() đang chạy.',
    simulate(s) { s.at(100, () => s.click('User tiếp')); s.at(200, () => s.click('User tiếp')); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      const t = a.text('.name');
      if (t === 'User 3') return OK();
      if (!a.http('/users').length) return NO('Chưa có request nào: user chưa được tải bằng resource().');
      return NO('Đang hiển thị "' + (t || a.text()) + '", cần "User 3".');
    },
  },
];

export const LAB: LabModule = {
  title: 'Signals',
  subtitle: 'bài luyện signal trong component thật: chuỗi computed, cập nhật object lồng nhau, effect cho side effect, không dùng effect để tính dữ liệu, lọc danh sách, resource().',
  exercises: EXERCISES,
  cheatsheet: [
    ['State', '<code>signal(v)</code>; đổi bằng <code>.set()</code> / <code>.update()</code>'],
    ['Giá trị suy ra (kể cả nhiều tầng)', '<code>computed(() => …)</code>'],
    ['Đổi object/mảng trong signal', '<code>update(p => ({ ...p, a: { ...p.a, x } }))</code>; không sửa tại chỗ'],
    ['Đẩy dữ liệu ra ngoài (lưu, log, chart)', '<code>effect(() => …)</code> trong constructor'],
    ['Lọc/sắp xếp dữ liệu đã có', '<code>computed</code> kết hợp các signal bộ lọc'],
    ['Tải dữ liệu theo signal', '<code>resource()</code> (Promise), <code>rxResource()</code> (Observable), <code>httpResource()</code>'],
  ],
};
