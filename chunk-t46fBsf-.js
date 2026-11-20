import{a as s$1,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var s={title:`Change detection`,subtitle:`bài luyện change detection trong app zoneless với component OnPush: setTimeout, object input, markForCheck, hàm nặng trong template, subscribe tay.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>App của lab chạy <b>zoneless</b> như Angular 22 mặc định. Thử component <code>ChangeDetectionStrategy.OnPush</code>, đổi state bằng signal và bằng biến thường, rồi xem cái nào cập nhật giao diện.</p>`,starter:`@Component({
  selector: 'app-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p>Signal: {{ count() }}</p>
    <p>Bi\u1EBFn th\u01B0\u1EDDng: {{ plain }}</p>
    <button (click)="bump()">B\u1EA5m (event \u2192 c\xF3 change detection)</button>
  \`,
})
class Demo {
  count = signal(0);
  plain = 0;

  constructor() {
    setInterval(() => {
      this.plain++;               // kh\xF4ng b\xE1o cho Angular
      this.count.update(c => c + 1); // b\xE1o cho Angular
    }, 1000);
  }

  bump() {
    this.plain += 100;
  }
}

mount(Demo);
`},{id:`zoneless-setTimeout`,group:`Zoneless`,title:`Biến thường đổi trong setTimeout`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>Kh\xF4ng c\xF3 zone.js, Angular <b>kh\xF4ng t\u1EF1 bi\u1EBFt</b> khi n\xE0o <code>setTimeout</code>, <code>subscribe</code> hay <code>fetch</code> xong. G\xE1n bi\u1EBFn th\u01B0\u1EDDng trong callback \u0111\xF3 th\xEC component OnPush kh\xF4ng bao gi\u1EDD v\u1EBD l\u1EA1i. Signal th\xEC t\u1EF1 b\xE1o cho Angular ph\u1EA7n n\xE0o c\u1EA7n c\u1EADp nh\u1EADt.</p>
<p><b>Y\xEAu c\u1EA7u:</b> sau 300ms \u0111o\u1EA1n v\u0103n ph\u1EA3i \u0111\u1ED5i th\xE0nh <code>\u0110\xE3 t\u1EA3i xong!</code>.</p>`,starter:`@Component({
  selector: 'app-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="msg">{{ message }}</p>',
})
class Status {
  message = '\u0110ang t\u1EA3i\u2026';

  constructor() {
    // \u2757 Angular kh\xF4ng bi\u1EBFt bi\u1EBFn n\xE0y \u0111\xE3 \u0111\u1ED5i
    setTimeout(() => (this.message = '\u0110\xE3 t\u1EA3i xong!'), 300);
  }
}

mount(Status);
`,solution:`@Component({
  selector: 'app-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="msg">{{ message() }}</p>',
})
class Status {
  message = signal('\u0110ang t\u1EA3i\u2026');

  constructor() {
    setTimeout(() => this.message.set('\u0110\xE3 t\u1EA3i xong!'), 300);
  }
}

mount(Status);
`,hint:`message = signal('Đang tải…'); trong setTimeout gọi this.message.set('Đã tải xong!'); template đọc {{ message() }}.`,explain:`Trong app zoneless, những thứ kích hoạt change detection gồm: signal được template đọc thay đổi, sự kiện template ((click)…), markForCheck(), AsyncPipe. Biến thường đổi trong callback không nằm trong danh sách đó.`,check(n){let t=n.text(`.msg`);return t===`Đã tải xong!`?i():t===`Đang tải…`?s$1(`Sau 300ms giao diện vẫn là "Đang tải…": Angular không được báo rằng message đã đổi.`):s$1(`Đoạn văn đang là "`+t+`".`)}},{id:`onpush-input-object`,group:`OnPush`,title:`OnPush và object input`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>Component OnPush ch\u1EC9 ki\u1EC3m tra l\u1EA1i khi input nh\u1EADn <b>tham chi\u1EBFu m\u1EDBi</b> (ho\u1EB7c signal n\xF3 \u0111\u1ECDc \u0111\u1ED5i, ho\u1EB7c s\u1EF1 ki\u1EC7n c\u1EE7a ch\xEDnh n\xF3). Cha s\u1EEDa ru\u1ED9t object r\u1ED3i truy\u1EC1n l\u1EA1i ch\xEDnh object \u0111\xF3 th\xEC con OnPush kh\xF4ng th\u1EA5y g\xEC.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\u1ED5i t\xEAn</b> \u1EDF cha; th\u1EBB con ph\u1EA3i hi\u1EC7n <code>An (VIP)</code>.</p>`,starter:`@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="card">{{ user().name }} ({{ user().tier }})</p>',
})
class UserCard {
  user = input.required();
}

@Component({
  selector: 'app-root',
  imports: [UserCard],
  template: \`
    <app-user-card [user]="user" />
    <button (click)="rename()">\u0110\u1ED5i t\xEAn</button>
  \`,
})
class Root {
  user = { name: 'B\xEDp', tier: 'th\u01B0\u1EDDng' };

  rename() {
    // \u2757 s\u1EEDa ru\u1ED9t object c\u0169: tham chi\u1EBFu kh\xF4ng \u0111\u1ED5i
    this.user.name = 'An';
    this.user.tier = 'VIP';
  }
}

mount(Root);
`,solution:`@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="card">{{ user().name }} ({{ user().tier }})</p>',
})
class UserCard {
  user = input.required();
}

@Component({
  selector: 'app-root',
  imports: [UserCard],
  template: \`
    <app-user-card [user]="user()" />
    <button (click)="rename()">\u0110\u1ED5i t\xEAn</button>
  \`,
})
class Root {
  user = signal({ name: 'B\xEDp', tier: 'th\u01B0\u1EDDng' });

  rename() {
    this.user.update(u => ({ ...u, name: 'An', tier: 'VIP' }));
  }
}

mount(Root);
`,hint:`T\u1EA1o object m\u1EDBi thay v\xEC s\u1EEDa ru\u1ED9t: d\xF9ng signal user v\xE0 this.user.update(u => ({ ...u, name: 'An', tier: 'VIP' })), bind [user]="user()".`,explain:`Dữ liệu bất biến + OnPush là bộ đôi giúp Angular bỏ qua cả nhánh component không đổi. Mọi component mới nên là OnPush.`,simulate(n){n.at(150,()=>n.click(`Đổi tên`))},check(n){let t=n.text(`.card`);return t===`An (VIP)`?i():t===`Bíp (thường)`?s$1(`Thẻ con vẫn là "Bíp (thường)": object bị sửa tại chỗ nên input của con OnPush không đổi tham chiếu.`):s$1(`Thẻ con đang là "`+t+`", cần "An (VIP)".`)}},{id:`mark-for-check`,group:`OnPush`,title:`Thư viện ngoài gọi callback: markForCheck`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>\u0110\xF4i khi state n\u1EB1m trong code kh\xF4ng d\xF9ng signal (th\u01B0 vi\u1EC7n b\xEAn th\u1EE9 ba, code c\u0169) v\xE0 ch\u1EC9 b\xE1o b\u1EB1ng callback. Khi \u0111\xF3 inject <code>ChangeDetectorRef</code> v\xE0 g\u1ECDi <code>markForCheck()</code> \u0111\u1EC3 Angular ki\u1EC3m tra l\u1EA1i component (v\xE0 c\xE1c t\u1ED5 ti\xEAn) \u1EDF l\u1EA7n render t\u1EDBi.</p>
<p><b>Y\xEAu c\u1EA7u:</b> kh\xF4ng \u0111\u1ED5i class <code>OldChatClient</code>; component ph\u1EA3i hi\u1EC7n <code>Tin nh\u1EAFn: 3</code> sau khi client nh\u1EADn \u0111\u1EE7 3 tin.</p>`,starter:`// Th\u01B0 vi\u1EC7n c\u0169: kh\xF4ng bi\u1EBFt g\xEC v\u1EC1 Angular hay signal
class OldChatClient {
  count = 0;
  onMessage(cb) {
    let n = 0;
    const id = setInterval(() => {
      this.count++;
      cb();
      if (++n === 3) clearInterval(id);
    }, 120);
  }
}

@Component({
  selector: 'app-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="count">Tin nh\u1EAFn: {{ client.count }}</p>',
})
class Chat {
  client = new OldChatClient();

  constructor() {
    this.client.onMessage(() => {
      // TODO: b\xE1o cho Angular r\u1EB1ng c\u1EA7n v\u1EBD l\u1EA1i
    });
  }
}

mount(Chat);
`,solution:`// Th\u01B0 vi\u1EC7n c\u0169: kh\xF4ng bi\u1EBFt g\xEC v\u1EC1 Angular hay signal
class OldChatClient {
  count = 0;
  onMessage(cb) {
    let n = 0;
    const id = setInterval(() => {
      this.count++;
      cb();
      if (++n === 3) clearInterval(id);
    }, 120);
  }
}

@Component({
  selector: 'app-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="count">Tin nh\u1EAFn: {{ client.count }}</p>',
})
class Chat {
  client = new OldChatClient();
  cdr = inject(ChangeDetectorRef);

  constructor() {
    this.client.onMessage(() => this.cdr.markForCheck());
  }
}

mount(Chat);
`,hint:`cdr = inject(ChangeDetectorRef); và trong callback gọi this.cdr.markForCheck().`,explain:`Một cách khác là tự giữ state trong signal: count = signal(0) và trong callback gọi this.count.set(this.client.count). markForCheck hợp khi bạn không muốn bọc lại toàn bộ dữ liệu của thư viện.`,check(n){let t=n.text(`.count`);return t===`Tin nhắn: 3`?i():t===`Tin nhắn: 0`?s$1(`Client đã nhận 3 tin nhưng giao diện vẫn 0: Angular chưa được báo để kiểm tra lại component.`):s$1(`Đang hiển thị "`+t+`", cần "Tin nhắn: 3".`)}},{id:`ham-nang-template`,group:`Hiệu năng`,title:`Hàm nặng trong template`,level:`Trung bình`,lv:2,waitMs:1100,desc:`<p>G\u1ECDi method trong template (<code>{{ calcTotal() }}</code>) ngh\u0129a l\xE0 method ch\u1EA1y l\u1EA1i <b>m\u1ED7i l\u1EA7n</b> component \u0111\u01B0\u1EE3c ki\u1EC3m tra, k\u1EC3 c\u1EA3 khi d\u1EEF li\u1EC7u c\u1EE7a n\xF3 kh\xF4ng \u0111\u1ED5i. <code>computed</code> c\xF3 cache: ch\u1EC9 t\xEDnh l\u1EA1i khi ph\u1EE5 thu\u1ED9c \u0111\u1ED5i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> component c\xF3 \u0111\u1ED3ng h\u1ED3 \u0111\u1ED5i m\u1ED7i 150ms. Ph\xE9p t\xEDnh t\u1ED5ng ti\u1EC1n (in log <code>t\xEDnh t\u1ED5ng</code>) ch\u1EC9 \u0111\u01B0\u1EE3c ch\u1EA1y t\u1ED1i \u0111a 2 l\u1EA7n trong su\u1ED1t b\xE0i.</p>`,starter:`@Component({
  selector: 'app-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p class="clock">\u23F1 {{ seconds() }}</p>
    <p class="total">T\u1ED5ng: {{ calcTotal() }}</p>
  \`,
})
class Invoice {
  items = signal([120000, 80000, 50000]);
  seconds = signal(0);

  constructor() {
    const id = setInterval(() => this.seconds.update(s => s + 1), 150);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  // \u2757 ch\u1EA1y l\u1EA1i m\u1ED7i l\u1EA7n component \u0111\u01B0\u1EE3c ki\u1EC3m tra (m\u1ED7i nh\u1ECBp \u0111\u1ED3ng h\u1ED3)
  calcTotal() {
    log('t\xEDnh t\u1ED5ng');
    return this.items().reduce((s, x) => s + x, 0);
  }
}

mount(Invoice);
`,solution:`@Component({
  selector: 'app-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p class="clock">\u23F1 {{ seconds() }}</p>
    <p class="total">T\u1ED5ng: {{ total() }}</p>
  \`,
})
class Invoice {
  items = signal([120000, 80000, 50000]);
  seconds = signal(0);
  total = computed(() => {
    log('t\xEDnh t\u1ED5ng');
    return this.items().reduce((s, x) => s + x, 0);
  });

  constructor() {
    const id = setInterval(() => this.seconds.update(s => s + 1), 150);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}

mount(Invoice);
`,hint:`total = computed(() => { log('tính tổng'); return this.items().reduce((s, x) => s + x, 0); }); template đọc {{ total() }}.`,explain:`Nếu cần biến đổi để hiển thị mà không phụ thuộc state của component, pipe pure cũng có cache theo đầu vào. Tránh gọi method có tính toán, lọc hay sắp xếp trực tiếp trong template.`,check(n){let t=n.logs.filter(o=>o===`tính tổng`).length;return n.text(`.total`)!==`Tổng: 250000`?s$1(`Tổng tiền cần là 250000.`):t<=2?i(`Phép tính chỉ chạy `+t+` lần.`):s$1(`Phép tính chạy `+t+` lần dù danh sách không đổi: method trong template chạy lại mỗi lần kiểm tra. Dùng computed.`)}},{id:`subscribe-gan-bien`,group:`Zoneless`,title:`Subscribe tay rồi gán biến: dùng toSignal`,level:`Dễ`,lv:1,waitMs:1e3,desc:`<p>Subscribe m\u1ED9t Observable r\u1ED3i g\xE1n v\xE0o bi\u1EBFn th\u01B0\u1EDDng trong component OnPush: d\u1EEF li\u1EC7u v\u1EC1 nh\u01B0ng giao di\u1EC7n kh\xF4ng \u0111\u1ED5i (v\xE0 c\xF2n ph\u1EA3i t\u1EF1 unsubscribe). <code>toSignal()</code> v\u1EEBa b\xE1o cho Angular, v\u1EEBa t\u1EF1 hu\u1EF7 khi component b\u1ECB hu\u1EF7.</p>
<p><b>Y\xEAu c\u1EA7u:</b> hi\u1EC3n th\u1ECB <code>User 5</code> t\u1EEB <code>fakeApi.user(5)</code>.</p>`,starter:`@Component({
  selector: 'app-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="name">{{ user?.name ?? "\u0110ang t\u1EA3i\u2026" }}</p>',
})
class UserView {
  user = null;

  constructor() {
    // \u2757 g\xE1n bi\u1EBFn th\u01B0\u1EDDng trong subscribe
    fakeApi.user(5).subscribe(u => (this.user = u));
  }
}

mount(UserView);
`,solution:`@Component({
  selector: 'app-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="name">{{ user()?.name ?? "\u0110ang t\u1EA3i\u2026" }}</p>',
})
class UserView {
  user = toSignal(fakeApi.user(5), { initialValue: null });
}

mount(UserView);
`,hint:`user = toSignal(fakeApi.user(5), { initialValue: null }); và template đọc user()?.name.`,explain:`Thay thế khác: AsyncPipe (| async) cũng tự markForCheck và unsubscribe. Với dữ liệu tải theo tham số, dùng rxResource/httpResource.`,check(n){let t=n.text(`.name`);return t===`User 5`?i():t===`Đang tải…`?s$1(`Dữ liệu đã về (xem Console) nhưng giao diện vẫn "Đang tải…".`):s$1(`Đang hiển thị "`+t+`", cần "User 5".`)}}],cheatsheet:[[`State đổi trong callback (setTimeout, subscribe…)`,`giữ trong <code>signal</code>; hoặc <code>markForCheck()</code>`],[`Component mới`,`<code>changeDetection: ChangeDetectionStrategy.OnPush</code>`],[`Truyền object xuống con OnPush`,`tạo object mới khi đổi (<code>{ ...u, name }</code>)`],[`State nằm trong thư viện ngoài`,`<code>inject(ChangeDetectorRef).markForCheck()</code> trong callback`],[`Tính toán để hiển thị`,`<code>computed</code> hoặc pipe pure; không gọi method nặng trong template`],[`Hiển thị Observable`,`<code>toSignal()</code> hoặc <code>| async</code>`]]};export{s as LAB};