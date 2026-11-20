import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 3 — Input / Output / model(): input(), input.required + transform,
 * output() có payload, component dạng hàng trong danh sách (input object + output id),
 * model() hai chiều, computed từ input, cha gọi con qua viewChild.
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử giao tiếp cha ↔ con: <code>input()</code> nhận dữ liệu từ cha, <code>output()</code> báo sự kiện lên cha, <code>model()</code> đồng bộ hai chiều. Nhớ khai báo component con trong <code>imports</code> của cha.</p>`,
    starter: `@Component({
  selector: 'app-child',
  template: \`
    <p>Con nhận: {{ label() }}</p>
    <button (click)="ping.emit('xin chào từ con')">Gửi lên cha</button>
  \`,
})
class Child {
  label = input('chưa có');
  ping = output();
}

@Component({
  selector: 'app-root',
  imports: [Child],
  template: \`
    <app-child [label]="message()" (ping)="message.set($event)" />
  \`,
})
class Root {
  message = signal('xin chào từ cha');
}

mount(Root);
`,
  },
  {
    id: 'input-co-ban', group: 'Cha → Con', title: 'Nhận dữ liệu bằng input()', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p><code>name = input('bạn')</code> khai báo một input có giá trị mặc định. Cha truyền xuống bằng property binding <code>[name]="…"</code>; con đọc bằng <code>name()</code>. Một field thường không phải input, nên binding từ cha không tới được.</p>
<p><b>Yêu cầu:</b> hai lời chào phải là <code>Xin chào, Bíp!</code> và <code>Xin chào, bạn!</code>.</p>`,
    starter: `@Component({
  selector: 'app-greeting',
  template: '<p>Xin chào, {{ name }}!</p>',
})
class Greeting {
  // TODO: nhận name từ cha bằng input(), mặc định là 'bạn'
  name = 'bạn';
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: \`
    <app-greeting [name]="'Bíp'" />
    <app-greeting />
  \`,
})
class Root {}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-greeting',
  template: '<p>Xin chào, {{ name() }}!</p>',
})
class Greeting {
  name = input('bạn');
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: \`
    <app-greeting [name]="'Bíp'" />
    <app-greeting />
  \`,
})
class Root {}

mount(Root);
`,
    hint: "name = input('bạn'); và trong template đọc {{ name() }}.",
    explain: "Truyền chuỗi cố định có thể viết gọn name=\"Bíp\" (không ngoặc vuông). [name]=\"'Bíp'\" là biểu thức, dùng khi giá trị đến từ state của cha: [name]=\"user().name\".",
    check(a) {
      const ps = a.query('app-greeting p').map((p) => norm(p.textContent));
      if (JSON.stringify(ps) === JSON.stringify(['Xin chào, Bíp!', 'Xin chào, bạn!'])) return OK();
      if (ps[0] === 'Xin chào, bạn!') return NO('Thẻ đầu tiên vẫn chào "bạn": name chưa phải input nên [name] của cha không có tác dụng.');
      return NO('Các lời chào: ' + JSON.stringify(ps) + '.');
    },
  },
  {
    id: 'input-transform', group: 'Cha → Con', title: 'input.required và transform', level: 'Trung bình', lv: 2, waitMs: 500,
    desc: `<p><code>input.required()</code> bắt buộc cha phải truyền giá trị. Thuộc tính viết không giá trị như <code>&lt;app-price-tag sale /&gt;</code> sẽ truyền vào <b>chuỗi rỗng</b> <code>''</code> (falsy). <code>transform: booleanAttribute</code> chuyển nó thành <code>true</code>.</p>
<p><b>Yêu cầu:</b> thẻ giá đầu tiên (có <code>sale</code>) hiện nhãn <b>Giảm giá</b>, thẻ thứ hai thì không.</p>`,
    starter: `@Component({
  selector: 'app-price-tag',
  template: \`
    <span class="price">{{ price() }} đ</span>
    @if (sale()) { <span class="sale">Giảm giá</span> }
  \`,
})
class PriceTag {
  price = input.required();
  sale = input(false);
}

@Component({
  selector: 'app-root',
  imports: [PriceTag],
  template: \`
    <p><app-price-tag [price]="150000" sale /></p>
    <p><app-price-tag [price]="90000" /></p>
  \`,
})
class Root {}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-price-tag',
  template: \`
    <span class="price">{{ price() }} đ</span>
    @if (sale()) { <span class="sale">Giảm giá</span> }
  \`,
})
class PriceTag {
  price = input.required();
  sale = input(false, { transform: booleanAttribute });
}

@Component({
  selector: 'app-root',
  imports: [PriceTag],
  template: \`
    <p><app-price-tag [price]="150000" sale /></p>
    <p><app-price-tag [price]="90000" /></p>
  \`,
})
class Root {}

mount(Root);
`,
    hint: 'sale = input(false, { transform: booleanAttribute });',
    explain: 'Tương tự có numberAttribute cho <app-x size="3" />. Trong TypeScript nên khai báo kiểu: input.required<number>(), input(false, { transform: booleanAttribute }).',
    check(a) {
      const tags = a.query('app-price-tag');
      if (tags.length !== 2) return NO('Cần 2 thẻ <app-price-tag>.');
      if (norm(tags[0].querySelector('.price')?.textContent) !== '150000 đ') return NO('Thẻ đầu tiên chưa hiện giá 150000 đ.');
      const sale = tags.map((t) => !!t.querySelector('.sale'));
      if (JSON.stringify(sale) === '[true,false]') return OK();
      if (!sale[0]) return NO('Thẻ có thuộc tính sale chưa hiện nhãn: sale đang nhận chuỗi rỗng. Thêm transform: booleanAttribute.');
      return NO('Nhãn Giảm giá đang hiện ở: ' + JSON.stringify(sale) + '.');
    },
  },
  {
    id: 'output-co-ban', group: 'Con → Cha', title: 'Báo sự kiện lên cha: output()', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p><code>buy = output()</code> khai báo sự kiện của component con; con gọi <code>this.buy.emit(giá trị)</code>. Cha lắng nghe bằng <code>(buy)="add($event)"</code>, trong đó <code>$event</code> là giá trị con gửi lên.</p>
<p><b>Yêu cầu:</b> bấm <b>Mua</b> thì sản phẩm vào giỏ của cha. Khi kiểm tra, trang bấm Mua 3 lần (Áo thun, Mũ, Áo thun).</p>`,
    starter: `@Component({
  selector: 'app-product',
  template: \`
    <strong>{{ name() }}</strong>
    <button (click)="onBuy()">Mua</button>
  \`,
})
class Product {
  name = input.required();
  // TODO: khai báo output buy và emit tên sản phẩm khi bấm Mua
  onBuy() {}
}

@Component({
  selector: 'app-root',
  imports: [Product],
  template: \`
    <p class="cart">Giỏ hàng: {{ cart().length }} món</p>
    <div><app-product name="Áo thun" (buy)="add($event)" /></div>
    <div><app-product name="Mũ" (buy)="add($event)" /></div>
  \`,
})
class Root {
  cart = signal([]);

  add(name) {
    this.cart.update(c => [...c, name]);
    log('Đã thêm', name);
  }
}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-product',
  template: \`
    <strong>{{ name() }}</strong>
    <button (click)="onBuy()">Mua</button>
  \`,
})
class Product {
  name = input.required();
  buy = output();

  onBuy() {
    this.buy.emit(this.name());
  }
}

@Component({
  selector: 'app-root',
  imports: [Product],
  template: \`
    <p class="cart">Giỏ hàng: {{ cart().length }} món</p>
    <div><app-product name="Áo thun" (buy)="add($event)" /></div>
    <div><app-product name="Mũ" (buy)="add($event)" /></div>
  \`,
})
class Root {
  cart = signal([]);

  add(name) {
    this.cart.update(c => [...c, name]);
    log('Đã thêm', name);
  }
}

mount(Root);
`,
    hint: 'buy = output(); và onBuy() { this.buy.emit(this.name()); }',
    explain: 'Con không biết ai đang nghe và cha làm gì với sự kiện; nhờ vậy component con dùng lại được ở nhiều nơi. Trong TypeScript: buy = output<string>().',
    simulate(s) { s.at(100, () => s.clickSel('app-product button', 0)); s.at(200, () => s.clickSel('app-product button', 1)); s.at(300, () => s.clickSel('app-product button', 0)); },
    check(a) {
      const t = a.text('.cart');
      if (t === 'Giỏ hàng: 3 món' && a.logs.includes('Đã thêm Mũ')) return OK();
      if (t === 'Giỏ hàng: 0 món') return NO('Bấm Mua nhưng giỏ hàng vẫn trống: con chưa emit, hoặc chưa khai báo output buy.');
      if (!a.logs.includes('Đã thêm Mũ')) return NO('Giỏ có hàng nhưng không nhận đúng tên sản phẩm. emit(this.name()) chưa?');
      return NO('Giỏ hàng đang là "' + t + '", cần "Giỏ hàng: 3 món".');
    },
  },
  {
    id: 'list-item', group: 'Con → Cha', title: 'Hàng trong danh sách: input object + output id', level: 'Trung bình', lv: 2, waitMs: 500,
    desc: `<p>Pattern rất hay gặp: cha giữ danh sách, mỗi hàng là một component con nhận <code>user</code> qua input và báo <code>remove</code> (kèm id) qua output. <b>Cha</b> mới là nơi sửa danh sách.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Xoá</b> ở hàng thứ hai (Chi). Danh sách còn lại phải là <code>An, Bình</code>.</p>`,
    starter: `@Component({
  selector: 'app-user-row',
  template: \`
    <li><span class="name">{{ user().name }}</span> <button (click)="remove.emit(user().id)">Xoá</button></li>
  \`,
})
class UserRow {
  user = input.required();
  remove = output();
}

@Component({
  selector: 'app-user-list',
  imports: [UserRow],
  template: \`
    <ul>
      @for (u of users(); track u.id) {
        <!-- ❗ cha chưa lắng nghe sự kiện remove của hàng -->
        <app-user-row [user]="u" />
      }
    </ul>
  \`,
})
class UserList {
  users = signal([
    { id: 1, name: 'An' },
    { id: 2, name: 'Chi' },
    { id: 3, name: 'Bình' },
  ]);

  removeUser(id) {
    this.users.update(list => list.filter(u => u.id !== id));
  }
}

mount(UserList);
`,
    solution: `@Component({
  selector: 'app-user-row',
  template: \`
    <li><span class="name">{{ user().name }}</span> <button (click)="remove.emit(user().id)">Xoá</button></li>
  \`,
})
class UserRow {
  user = input.required();
  remove = output();
}

@Component({
  selector: 'app-user-list',
  imports: [UserRow],
  template: \`
    <ul>
      @for (u of users(); track u.id) {
        <app-user-row [user]="u" (remove)="removeUser($event)" />
      }
    </ul>
  \`,
})
class UserList {
  users = signal([
    { id: 1, name: 'An' },
    { id: 2, name: 'Chi' },
    { id: 3, name: 'Bình' },
  ]);

  removeUser(id) {
    this.users.update(list => list.filter(u => u.id !== id));
  }
}

mount(UserList);
`,
    hint: 'Thêm (remove)="removeUser($event)" vào thẻ <app-user-row>.',
    explain: 'Hàng con không tự xoá mình khỏi mảng của cha: dữ liệu chỉ chảy xuống (input), sự kiện chảy lên (output). Nhờ track u.id, Angular chỉ gỡ đúng một hàng thay vì vẽ lại cả danh sách.',
    simulate(s) { s.at(100, () => s.clickSel('app-user-row button', 1)); },
    check(a) {
      const names = a.query('app-user-row .name').map((e) => norm(e.textContent));
      if (JSON.stringify(names) === JSON.stringify(['An', 'Bình'])) return OK();
      if (names.length === 3) return NO('Bấm Xoá nhưng danh sách không đổi: cha chưa lắng nghe (remove).');
      return NO('Danh sách còn lại: ' + JSON.stringify(names) + ', mong đợi ["An", "Bình"].');
    },
  },
  {
    id: 'model-hai-chieu', group: 'Hai chiều', title: 'Hai chiều cha ↔ con: model()', level: 'Trung bình', lv: 2, waitMs: 500,
    desc: `<p><code>input()</code> là chỉ-đọc với component con. Khi con cũng cần <b>ghi</b> giá trị và báo ngược cho cha (toggle, slider, rating…), dùng <code>checked = model(false)</code>: con gọi <code>checked.set()</code>, cha bind <code>[(checked)]="wifi"</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Tắt từ cha</b>, rồi bấm công tắc của con. Cuối cùng cả cha và con đều phải là <b>bật</b>.</p>`,
    starter: `@Component({
  selector: 'app-switch',
  template: '<button class="sw" (click)="toggle()">{{ checked() ? "BẬT" : "TẮT" }}</button>',
})
class Switch {
  // ❗ input() là chỉ-đọc với con: không có .set()
  checked = input(false);

  toggle() {
    this.checked.set(!this.checked());
  }
}

@Component({
  selector: 'app-root',
  imports: [Switch],
  template: \`
    <app-switch [(checked)]="wifi" />
    <p class="state">Wi-Fi: {{ wifi() ? 'bật' : 'tắt' }}</p>
    <button class="off" (click)="wifi.set(false)">Tắt từ cha</button>
  \`,
})
class Root {
  wifi = signal(true);
}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-switch',
  template: '<button class="sw" (click)="toggle()">{{ checked() ? "BẬT" : "TẮT" }}</button>',
})
class Switch {
  checked = model(false);

  toggle() {
    this.checked.set(!this.checked());
  }
}

@Component({
  selector: 'app-root',
  imports: [Switch],
  template: \`
    <app-switch [(checked)]="wifi" />
    <p class="state">Wi-Fi: {{ wifi() ? 'bật' : 'tắt' }}</p>
    <button class="off" (click)="wifi.set(false)">Tắt từ cha</button>
  \`,
})
class Root {
  wifi = signal(true);
}

mount(Root);
`,
    hint: 'Đổi checked = input(false) thành checked = model(false).',
    explain: 'model() = một input + một output tên checkedChange. [(checked)]="wifi" là cách viết gọn của [checked]="wifi()" (checkedChange)="wifi.set($event)".',
    simulate(s) { s.at(100, () => s.clickSel('button.off')); s.at(250, () => s.clickSel('button.sw')); },
    check(a) {
      const p = a.text('.state'), sw = a.text('.sw');
      if (p === 'Wi-Fi: bật' && sw === 'BẬT') return OK();
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. input() không có .set(); dùng model().');
      if (sw === 'TẮT') return NO('Bấm công tắc của con nhưng con vẫn TẮT.');
      return NO('Cha: "' + p + '", con: "' + sw + '". Cả hai cần là bật.');
    },
  },
  {
    id: 'computed-tu-input', group: 'Hai chiều', title: 'Giá trị dẫn xuất từ input: computed', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Input chỉ có giá trị <b>sau</b> khi component được tạo, và có thể đổi bất cứ lúc nào cha muốn. Tính sẵn ở field (<code>total = this.price() * this.qty()</code>) chỉ chạy một lần, lúc input còn là giá trị mặc định.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Thêm 1</b> hai lần ở cha. Dòng của con phải là <code>3 × 50000 = 150000 đ</code>.</p>`,
    starter: `@Component({
  selector: 'app-line-total',
  template: '<p class="line">{{ qty() }} × {{ price() }} = {{ total }} đ</p>',
})
class LineTotal {
  price = input(0);
  qty = input(1);
  // ❗ chỉ tính một lần lúc tạo component
  total = this.price() * this.qty();
}

@Component({
  selector: 'app-root',
  imports: [LineTotal],
  template: \`
    <app-line-total [price]="50000" [qty]="qty()" />
    <button (click)="qty.update(q => q + 1)">Thêm 1</button>
  \`,
})
class Root {
  qty = signal(1);
}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-line-total',
  template: '<p class="line">{{ qty() }} × {{ price() }} = {{ total() }} đ</p>',
})
class LineTotal {
  price = input(0);
  qty = input(1);
  total = computed(() => this.price() * this.qty());
}

@Component({
  selector: 'app-root',
  imports: [LineTotal],
  template: \`
    <app-line-total [price]="50000" [qty]="qty()" />
    <button (click)="qty.update(q => q + 1)">Thêm 1</button>
  \`,
})
class Root {
  qty = signal(1);
}

mount(Root);
`,
    hint: 'total = computed(() => this.price() * this.qty()); và template đọc {{ total() }}.',
    explain: 'Input là signal, nên computed tự cập nhật khi cha đổi giá trị. Không cần ngOnChanges như cách viết cũ với @Input().',
    simulate(s) { s.at(100, () => s.click('Thêm 1')); s.at(200, () => s.click('Thêm 1')); },
    check(a) {
      const t = a.text('.line');
      if (t === '3 × 50000 = 150000 đ') return OK();
      if (/= 0 đ$/.test(t)) return NO('Tổng đang là 0: field total được tính lúc input còn là giá trị mặc định, và không bao giờ tính lại. Dùng computed().');
      return NO('Dòng đang là "' + t + '", cần "3 × 50000 = 150000 đ".');
    },
  },
  {
    id: 'view-child', group: 'Hai chiều', title: 'Cha gọi method của con: viewChild', level: 'Khó', lv: 3, waitMs: 700,
    desc: `<p>Đôi khi cha cần ra lệnh cho con (reset, focus, cuộn…). <code>counter = viewChild.required(Counter)</code> trả về signal chứa <b>instance</b> của component con trong template; cha gọi <code>this.counter().reset()</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>+1</b> ba lần ở con, bấm <b>Cha bấm Reset</b>, rồi bấm +1 thêm một lần. Con phải hiện <code>Con đếm: 1</code>.</p>`,
    starter: `@Component({
  selector: 'app-counter',
  template: \`
    <p class="count">Con đếm: {{ count() }}</p>
    <button (click)="count.update(c => c + 1)">+1</button>
  \`,
})
class Counter {
  count = signal(0);

  reset() {
    this.count.set(0);
  }
}

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: \`
    <app-counter />
    <button class="reset" (click)="resetChild()">Cha bấm Reset</button>
  \`,
})
class Root {
  // TODO: lấy instance của Counter bằng viewChild rồi gọi reset()
  resetChild() {}
}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-counter',
  template: \`
    <p class="count">Con đếm: {{ count() }}</p>
    <button (click)="count.update(c => c + 1)">+1</button>
  \`,
})
class Counter {
  count = signal(0);

  reset() {
    this.count.set(0);
  }
}

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: \`
    <app-counter />
    <button class="reset" (click)="resetChild()">Cha bấm Reset</button>
  \`,
})
class Root {
  counter = viewChild.required(Counter);

  resetChild() {
    this.counter().reset();
  }
}

mount(Root);
`,
    hint: 'counter = viewChild.required(Counter); resetChild() { this.counter().reset(); }',
    explain: 'viewChild chỉ có giá trị sau khi view của cha được tạo, nên chỉ đọc nó trong event handler, effect hoặc afterNextRender (không đọc trong constructor). Ưu tiên input/output; chỉ dùng viewChild khi thật sự cần gọi lệnh.',
    simulate(s) { [100, 150, 200].forEach((t) => s.at(t, () => s.click('+1'))); s.at(300, () => s.click('Cha bấm Reset')); s.at(400, () => s.click('+1')); },
    check(a) {
      const t = a.text('.count');
      if (t === 'Con đếm: 1') return OK();
      if (t === 'Con đếm: 4') return NO('Bấm Reset ở cha nhưng con không reset: cha chưa gọi được method reset() của con.');
      return NO('Con đang hiện "' + t + '", cần "Con đếm: 1".');
    },
  },
];

export const LAB: LabModule = {
  title: 'Input / Output / model()',
  subtitle: 'bài luyện giao tiếp cha ↔ con trên component thật: input(), input.required + transform, output(), hàng trong danh sách, model() hai chiều, computed từ input, viewChild.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Cha truyền dữ liệu xuống', '<code>name = input(\'mặc định\')</code> ở con, <code>[name]="value()"</code> ở cha'],
    ['Bắt buộc cha phải truyền', '<code>input.required()</code>'],
    ['Thuộc tính boolean viết gọn (<code>&lt;x sale /&gt;</code>)', '<code>input(false, { transform: booleanAttribute })</code>'],
    ['Con báo sự kiện lên cha', '<code>buy = output()</code>, <code>this.buy.emit(x)</code>; cha: <code>(buy)="add($event)"</code>'],
    ['Con đọc và ghi giá trị của cha', '<code>model()</code> + <code>[(checked)]="sig"</code>'],
    ['Giá trị suy ra từ input', '<code>computed(() => this.price() * this.qty())</code>'],
    ['Cha ra lệnh cho con', '<code>viewChild.required(Child)</code> rồi <code>this.child().method()</code>'],
  ],
};
