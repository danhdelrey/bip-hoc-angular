import{a as s$1,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var s={title:`Input / Output / model()`,subtitle:`bài luyện giao tiếp cha ↔ con trên component thật: input(), input.required + transform, output(), hàng trong danh sách, model() hai chiều, computed từ input, viewChild.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Thử giao tiếp cha ↔ con: <code>input()</code> nhận dữ liệu từ cha, <code>output()</code> báo sự kiện lên cha, <code>model()</code> đồng bộ hai chiều. Nhớ khai báo component con trong <code>imports</code> của cha.</p>`,starter:`@Component({
  selector: 'app-child',
  template: \`
    <p>Con nh\u1EADn: {{ label() }}</p>
    <button (click)="ping.emit('xin ch\xE0o t\u1EEB con')">G\u1EEDi l\xEAn cha</button>
  \`,
})
class Child {
  label = input('ch\u01B0a c\xF3');
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
  message = signal('xin ch\xE0o t\u1EEB cha');
}

mount(Root);
`},{id:`input-co-ban`,group:`Cha → Con`,title:`Nhận dữ liệu bằng input()`,level:`Dễ`,lv:1,waitMs:500,desc:`<p><code>name = input('b\u1EA1n')</code> khai b\xE1o m\u1ED9t input c\xF3 gi\xE1 tr\u1ECB m\u1EB7c \u0111\u1ECBnh. Cha truy\u1EC1n xu\u1ED1ng b\u1EB1ng property binding <code>[name]="\u2026"</code>; con \u0111\u1ECDc b\u1EB1ng <code>name()</code>. M\u1ED9t field th\u01B0\u1EDDng kh\xF4ng ph\u1EA3i input, n\xEAn binding t\u1EEB cha kh\xF4ng t\u1EDBi \u0111\u01B0\u1EE3c.</p>
<p><b>Y\xEAu c\u1EA7u:</b> hai l\u1EDDi ch\xE0o ph\u1EA3i l\xE0 <code>Xin ch\xE0o, B\xEDp!</code> v\xE0 <code>Xin ch\xE0o, b\u1EA1n!</code>.</p>`,starter:`@Component({
  selector: 'app-greeting',
  template: '<p>Xin ch\xE0o, {{ name }}!</p>',
})
class Greeting {
  // TODO: nh\u1EADn name t\u1EEB cha b\u1EB1ng input(), m\u1EB7c \u0111\u1ECBnh l\xE0 'b\u1EA1n'
  name = 'b\u1EA1n';
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: \`
    <app-greeting [name]="'B\xEDp'" />
    <app-greeting />
  \`,
})
class Root {}

mount(Root);
`,solution:`@Component({
  selector: 'app-greeting',
  template: '<p>Xin ch\xE0o, {{ name() }}!</p>',
})
class Greeting {
  name = input('b\u1EA1n');
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: \`
    <app-greeting [name]="'B\xEDp'" />
    <app-greeting />
  \`,
})
class Root {}

mount(Root);
`,hint:`name = input('bạn'); và trong template đọc {{ name() }}.`,explain:`Truy\u1EC1n chu\u1ED7i c\u1ED1 \u0111\u1ECBnh c\xF3 th\u1EC3 vi\u1EBFt g\u1ECDn name="B\xEDp" (kh\xF4ng ngo\u1EB7c vu\xF4ng). [name]="'B\xEDp'" l\xE0 bi\u1EC3u th\u1EE9c, d\xF9ng khi gi\xE1 tr\u1ECB \u0111\u1EBFn t\u1EEB state c\u1EE7a cha: [name]="user().name".`,check(t){let e=t.query(`app-greeting p`).map(o=>g(o.textContent));return JSON.stringify(e)===JSON.stringify([`Xin chào, Bíp!`,`Xin chào, bạn!`])?i():e[0]===`Xin chào, bạn!`?s$1(`Thẻ đầu tiên vẫn chào "bạn": name chưa phải input nên [name] của cha không có tác dụng.`):s$1(`Các lời chào: `+JSON.stringify(e)+`.`)}},{id:`input-transform`,group:`Cha → Con`,title:`input.required và transform`,level:`Trung bình`,lv:2,waitMs:500,desc:`<p><code>input.required()</code> b\u1EAFt bu\u1ED9c cha ph\u1EA3i truy\u1EC1n gi\xE1 tr\u1ECB. Thu\u1ED9c t\xEDnh vi\u1EBFt kh\xF4ng gi\xE1 tr\u1ECB nh\u01B0 <code>&lt;app-price-tag sale /&gt;</code> s\u1EBD truy\u1EC1n v\xE0o <b>chu\u1ED7i r\u1ED7ng</b> <code>''</code> (falsy). <code>transform: booleanAttribute</code> chuy\u1EC3n n\xF3 th\xE0nh <code>true</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\u1EBB gi\xE1 \u0111\u1EA7u ti\xEAn (c\xF3 <code>sale</code>) hi\u1EC7n nh\xE3n <b>Gi\u1EA3m gi\xE1</b>, th\u1EBB th\u1EE9 hai th\xEC kh\xF4ng.</p>`,starter:`@Component({
  selector: 'app-price-tag',
  template: \`
    <span class="price">{{ price() }} \u0111</span>
    @if (sale()) { <span class="sale">Gi\u1EA3m gi\xE1</span> }
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
`,solution:`@Component({
  selector: 'app-price-tag',
  template: \`
    <span class="price">{{ price() }} \u0111</span>
    @if (sale()) { <span class="sale">Gi\u1EA3m gi\xE1</span> }
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
`,hint:`sale = input(false, { transform: booleanAttribute });`,explain:`Tương tự có numberAttribute cho <app-x size="3" />. Trong TypeScript nên khai báo kiểu: input.required<number>(), input(false, { transform: booleanAttribute }).`,check(t){let e=t.query(`app-price-tag`);if(e.length!==2)return s$1(`Cần 2 thẻ <app-price-tag>.`);if(g(e[0].querySelector(`.price`)?.textContent)!==`150000 đ`)return s$1(`Thẻ đầu tiên chưa hiện giá 150000 đ.`);let o=e.map(a=>!!a.querySelector(`.sale`));return JSON.stringify(o)===`[true,false]`?i():o[0]?s$1(`Nhãn Giảm giá đang hiện ở: `+JSON.stringify(o)+`.`):s$1(`Thẻ có thuộc tính sale chưa hiện nhãn: sale đang nhận chuỗi rỗng. Thêm transform: booleanAttribute.`)}},{id:`output-co-ban`,group:`Con → Cha`,title:`Báo sự kiện lên cha: output()`,level:`Dễ`,lv:1,waitMs:600,desc:`<p><code>buy = output()</code> khai b\xE1o s\u1EF1 ki\u1EC7n c\u1EE7a component con; con g\u1ECDi <code>this.buy.emit(gi\xE1 tr\u1ECB)</code>. Cha l\u1EAFng nghe b\u1EB1ng <code>(buy)="add($event)"</code>, trong \u0111\xF3 <code>$event</code> l\xE0 gi\xE1 tr\u1ECB con g\u1EEDi l\xEAn.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>Mua</b> th\xEC s\u1EA3n ph\u1EA9m v\xE0o gi\u1ECF c\u1EE7a cha. Khi ki\u1EC3m tra, trang b\u1EA5m Mua 3 l\u1EA7n (\xC1o thun, M\u0169, \xC1o thun).</p>`,starter:`@Component({
  selector: 'app-product',
  template: \`
    <strong>{{ name() }}</strong>
    <button (click)="onBuy()">Mua</button>
  \`,
})
class Product {
  name = input.required();
  // TODO: khai b\xE1o output buy v\xE0 emit t\xEAn s\u1EA3n ph\u1EA9m khi b\u1EA5m Mua
  onBuy() {}
}

@Component({
  selector: 'app-root',
  imports: [Product],
  template: \`
    <p class="cart">Gi\u1ECF h\xE0ng: {{ cart().length }} m\xF3n</p>
    <div><app-product name="\xC1o thun" (buy)="add($event)" /></div>
    <div><app-product name="M\u0169" (buy)="add($event)" /></div>
  \`,
})
class Root {
  cart = signal([]);

  add(name) {
    this.cart.update(c => [...c, name]);
    log('\u0110\xE3 th\xEAm', name);
  }
}

mount(Root);
`,solution:`@Component({
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
    <p class="cart">Gi\u1ECF h\xE0ng: {{ cart().length }} m\xF3n</p>
    <div><app-product name="\xC1o thun" (buy)="add($event)" /></div>
    <div><app-product name="M\u0169" (buy)="add($event)" /></div>
  \`,
})
class Root {
  cart = signal([]);

  add(name) {
    this.cart.update(c => [...c, name]);
    log('\u0110\xE3 th\xEAm', name);
  }
}

mount(Root);
`,hint:`buy = output(); và onBuy() { this.buy.emit(this.name()); }`,explain:`Con không biết ai đang nghe và cha làm gì với sự kiện; nhờ vậy component con dùng lại được ở nhiều nơi. Trong TypeScript: buy = output<string>().`,simulate(t){t.at(100,()=>t.clickSel(`app-product button`,0)),t.at(200,()=>t.clickSel(`app-product button`,1)),t.at(300,()=>t.clickSel(`app-product button`,0))},check(t){let e=t.text(`.cart`);return e===`Giỏ hàng: 3 món`&&t.logs.includes(`Đã thêm Mũ`)?i():e===`Giỏ hàng: 0 món`?s$1(`Bấm Mua nhưng giỏ hàng vẫn trống: con chưa emit, hoặc chưa khai báo output buy.`):t.logs.includes(`Đã thêm Mũ`)?s$1(`Giỏ hàng đang là "`+e+`", cần "Giỏ hàng: 3 món".`):s$1(`Giỏ có hàng nhưng không nhận đúng tên sản phẩm. emit(this.name()) chưa?`)}},{id:`list-item`,group:`Con → Cha`,title:`Hàng trong danh sách: input object + output id`,level:`Trung bình`,lv:2,waitMs:500,desc:`<p>Pattern r\u1EA5t hay g\u1EB7p: cha gi\u1EEF danh s\xE1ch, m\u1ED7i h\xE0ng l\xE0 m\u1ED9t component con nh\u1EADn <code>user</code> qua input v\xE0 b\xE1o <code>remove</code> (k\xE8m id) qua output. <b>Cha</b> m\u1EDBi l\xE0 n\u01A1i s\u1EEDa danh s\xE1ch.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Xo\xE1</b> \u1EDF h\xE0ng th\u1EE9 hai (Chi). Danh s\xE1ch c\xF2n l\u1EA1i ph\u1EA3i l\xE0 <code>An, B\xECnh</code>.</p>`,starter:`@Component({
  selector: 'app-user-row',
  template: \`
    <li><span class="name">{{ user().name }}</span> <button (click)="remove.emit(user().id)">Xo\xE1</button></li>
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
        <!-- \u2757 cha ch\u01B0a l\u1EAFng nghe s\u1EF1 ki\u1EC7n remove c\u1EE7a h\xE0ng -->
        <app-user-row [user]="u" />
      }
    </ul>
  \`,
})
class UserList {
  users = signal([
    { id: 1, name: 'An' },
    { id: 2, name: 'Chi' },
    { id: 3, name: 'B\xECnh' },
  ]);

  removeUser(id) {
    this.users.update(list => list.filter(u => u.id !== id));
  }
}

mount(UserList);
`,solution:`@Component({
  selector: 'app-user-row',
  template: \`
    <li><span class="name">{{ user().name }}</span> <button (click)="remove.emit(user().id)">Xo\xE1</button></li>
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
    { id: 3, name: 'B\xECnh' },
  ]);

  removeUser(id) {
    this.users.update(list => list.filter(u => u.id !== id));
  }
}

mount(UserList);
`,hint:`Thêm (remove)="removeUser($event)" vào thẻ <app-user-row>.`,explain:`Hàng con không tự xoá mình khỏi mảng của cha: dữ liệu chỉ chảy xuống (input), sự kiện chảy lên (output). Nhờ track u.id, Angular chỉ gỡ đúng một hàng thay vì vẽ lại cả danh sách.`,simulate(t){t.at(100,()=>t.clickSel(`app-user-row button`,1))},check(t){let e=t.query(`app-user-row .name`).map(o=>g(o.textContent));return JSON.stringify(e)===JSON.stringify([`An`,`Bình`])?i():e.length===3?s$1(`Bấm Xoá nhưng danh sách không đổi: cha chưa lắng nghe (remove).`):s$1(`Danh sách còn lại: `+JSON.stringify(e)+`, mong đợi ["An", "Bình"].`)}},{id:`model-hai-chieu`,group:`Hai chiều`,title:`Hai chiều cha ↔ con: model()`,level:`Trung bình`,lv:2,waitMs:500,desc:`<p><code>input()</code> l\xE0 ch\u1EC9-\u0111\u1ECDc v\u1EDBi component con. Khi con c\u0169ng c\u1EA7n <b>ghi</b> gi\xE1 tr\u1ECB v\xE0 b\xE1o ng\u01B0\u1EE3c cho cha (toggle, slider, rating\u2026), d\xF9ng <code>checked = model(false)</code>: con g\u1ECDi <code>checked.set()</code>, cha bind <code>[(checked)]="wifi"</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>T\u1EAFt t\u1EEB cha</b>, r\u1ED3i b\u1EA5m c\xF4ng t\u1EAFc c\u1EE7a con. Cu\u1ED1i c\xF9ng c\u1EA3 cha v\xE0 con \u0111\u1EC1u ph\u1EA3i l\xE0 <b>b\u1EADt</b>.</p>`,starter:`@Component({
  selector: 'app-switch',
  template: '<button class="sw" (click)="toggle()">{{ checked() ? "B\u1EACT" : "T\u1EAET" }}</button>',
})
class Switch {
  // \u2757 input() l\xE0 ch\u1EC9-\u0111\u1ECDc v\u1EDBi con: kh\xF4ng c\xF3 .set()
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
    <p class="state">Wi-Fi: {{ wifi() ? 'b\u1EADt' : 't\u1EAFt' }}</p>
    <button class="off" (click)="wifi.set(false)">T\u1EAFt t\u1EEB cha</button>
  \`,
})
class Root {
  wifi = signal(true);
}

mount(Root);
`,solution:`@Component({
  selector: 'app-switch',
  template: '<button class="sw" (click)="toggle()">{{ checked() ? "B\u1EACT" : "T\u1EAET" }}</button>',
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
    <p class="state">Wi-Fi: {{ wifi() ? 'b\u1EADt' : 't\u1EAFt' }}</p>
    <button class="off" (click)="wifi.set(false)">T\u1EAFt t\u1EEB cha</button>
  \`,
})
class Root {
  wifi = signal(true);
}

mount(Root);
`,hint:`Đổi checked = input(false) thành checked = model(false).`,explain:`model() = một input + một output tên checkedChange. [(checked)]="wifi" là cách viết gọn của [checked]="wifi()" (checkedChange)="wifi.set($event)".`,simulate(t){t.at(100,()=>t.clickSel(`button.off`)),t.at(250,()=>t.clickSel(`button.sw`))},check(t){let e=t.text(`.state`),o=t.text(`.sw`);return e===`Wi-Fi: bật`&&o===`BẬT`?i():t.errors.length?s$1(`Có lỗi: `+t.errMsg()+`. input() không có .set(); dùng model().`):o===`TẮT`?s$1(`Bấm công tắc của con nhưng con vẫn TẮT.`):s$1(`Cha: "`+e+`", con: "`+o+`". Cả hai cần là bật.`)}},{id:`computed-tu-input`,group:`Hai chiều`,title:`Giá trị dẫn xuất từ input: computed`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>Input ch\u1EC9 c\xF3 gi\xE1 tr\u1ECB <b>sau</b> khi component \u0111\u01B0\u1EE3c t\u1EA1o, v\xE0 c\xF3 th\u1EC3 \u0111\u1ED5i b\u1EA5t c\u1EE9 l\xFAc n\xE0o cha mu\u1ED1n. T\xEDnh s\u1EB5n \u1EDF field (<code>total = this.price() * this.qty()</code>) ch\u1EC9 ch\u1EA1y m\u1ED9t l\u1EA7n, l\xFAc input c\xF2n l\xE0 gi\xE1 tr\u1ECB m\u1EB7c \u0111\u1ECBnh.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm 1</b> hai l\u1EA7n \u1EDF cha. D\xF2ng c\u1EE7a con ph\u1EA3i l\xE0 <code>3 \xD7 50000 = 150000 \u0111</code>.</p>`,starter:`@Component({
  selector: 'app-line-total',
  template: '<p class="line">{{ qty() }} \xD7 {{ price() }} = {{ total }} \u0111</p>',
})
class LineTotal {
  price = input(0);
  qty = input(1);
  // \u2757 ch\u1EC9 t\xEDnh m\u1ED9t l\u1EA7n l\xFAc t\u1EA1o component
  total = this.price() * this.qty();
}

@Component({
  selector: 'app-root',
  imports: [LineTotal],
  template: \`
    <app-line-total [price]="50000" [qty]="qty()" />
    <button (click)="qty.update(q => q + 1)">Th\xEAm 1</button>
  \`,
})
class Root {
  qty = signal(1);
}

mount(Root);
`,solution:`@Component({
  selector: 'app-line-total',
  template: '<p class="line">{{ qty() }} \xD7 {{ price() }} = {{ total() }} \u0111</p>',
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
    <button (click)="qty.update(q => q + 1)">Th\xEAm 1</button>
  \`,
})
class Root {
  qty = signal(1);
}

mount(Root);
`,hint:`total = computed(() => this.price() * this.qty()); và template đọc {{ total() }}.`,explain:`Input là signal, nên computed tự cập nhật khi cha đổi giá trị. Không cần ngOnChanges như cách viết cũ với @Input().`,simulate(t){t.at(100,()=>t.click(`Thêm 1`)),t.at(200,()=>t.click(`Thêm 1`))},check(t){let e=t.text(`.line`);return e===`3 × 50000 = 150000 đ`?i():/= 0 đ$/.test(e)?s$1(`Tổng đang là 0: field total được tính lúc input còn là giá trị mặc định, và không bao giờ tính lại. Dùng computed().`):s$1(`Dòng đang là "`+e+`", cần "3 × 50000 = 150000 đ".`)}},{id:`view-child`,group:`Hai chiều`,title:`Cha gọi method của con: viewChild`,level:`Khó`,lv:3,waitMs:700,desc:`<p>\u0110\xF4i khi cha c\u1EA7n ra l\u1EC7nh cho con (reset, focus, cu\u1ED9n\u2026). <code>counter = viewChild.required(Counter)</code> tr\u1EA3 v\u1EC1 signal ch\u1EE9a <b>instance</b> c\u1EE7a component con trong template; cha g\u1ECDi <code>this.counter().reset()</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>+1</b> ba l\u1EA7n \u1EDF con, b\u1EA5m <b>Cha b\u1EA5m Reset</b>, r\u1ED3i b\u1EA5m +1 th\xEAm m\u1ED9t l\u1EA7n. Con ph\u1EA3i hi\u1EC7n <code>Con \u0111\u1EBFm: 1</code>.</p>`,starter:`@Component({
  selector: 'app-counter',
  template: \`
    <p class="count">Con \u0111\u1EBFm: {{ count() }}</p>
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
    <button class="reset" (click)="resetChild()">Cha b\u1EA5m Reset</button>
  \`,
})
class Root {
  // TODO: l\u1EA5y instance c\u1EE7a Counter b\u1EB1ng viewChild r\u1ED3i g\u1ECDi reset()
  resetChild() {}
}

mount(Root);
`,solution:`@Component({
  selector: 'app-counter',
  template: \`
    <p class="count">Con \u0111\u1EBFm: {{ count() }}</p>
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
    <button class="reset" (click)="resetChild()">Cha b\u1EA5m Reset</button>
  \`,
})
class Root {
  counter = viewChild.required(Counter);

  resetChild() {
    this.counter().reset();
  }
}

mount(Root);
`,hint:`counter = viewChild.required(Counter); resetChild() { this.counter().reset(); }`,explain:`viewChild chỉ có giá trị sau khi view của cha được tạo, nên chỉ đọc nó trong event handler, effect hoặc afterNextRender (không đọc trong constructor). Ưu tiên input/output; chỉ dùng viewChild khi thật sự cần gọi lệnh.`,simulate(t){[100,150,200].forEach(e=>t.at(e,()=>t.click(`+1`))),t.at(300,()=>t.click(`Cha bấm Reset`)),t.at(400,()=>t.click(`+1`))},check(t){let e=t.text(`.count`);return e===`Con đếm: 1`?i():e===`Con đếm: 4`?s$1(`Bấm Reset ở cha nhưng con không reset: cha chưa gọi được method reset() của con.`):s$1(`Con đang hiện "`+e+`", cần "Con đếm: 1".`)}}],cheatsheet:[[`Cha truyền dữ liệu xuống`,`<code>name = input('m\u1EB7c \u0111\u1ECBnh')</code> \u1EDF con, <code>[name]="value()"</code> \u1EDF cha`],[`Bắt buộc cha phải truyền`,`<code>input.required()</code>`],[`Thuộc tính boolean viết gọn (<code>&lt;x sale /&gt;</code>)`,`<code>input(false, { transform: booleanAttribute })</code>`],[`Con báo sự kiện lên cha`,`<code>buy = output()</code>, <code>this.buy.emit(x)</code>; cha: <code>(buy)="add($event)"</code>`],[`Con đọc và ghi giá trị của cha`,`<code>model()</code> + <code>[(checked)]="sig"</code>`],[`Giá trị suy ra từ input`,`<code>computed(() => this.price() * this.qty())</code>`],[`Cha ra lệnh cho con`,`<code>viewChild.required(Child)</code> rồi <code>this.child().method()</code>`]]};export{s as LAB};