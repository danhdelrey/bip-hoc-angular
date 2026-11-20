import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 10 — Change detection (app zoneless của Angular 22, component OnPush):
 * biến thường đổi trong setTimeout, sửa ruột object input, markForCheck, hàm nặng trong template,
 * subscribe tay rồi gán biến thường.
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>App của lab chạy <b>zoneless</b> như Angular 22 mặc định. Thử component <code>ChangeDetectionStrategy.OnPush</code>, đổi state bằng signal và bằng biến thường, rồi xem cái nào cập nhật giao diện.</p>`,
    starter: `@Component({
  selector: 'app-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p>Signal: {{ count() }}</p>
    <p>Biến thường: {{ plain }}</p>
    <button (click)="bump()">Bấm (event → có change detection)</button>
  \`,
})
class Demo {
  count = signal(0);
  plain = 0;

  constructor() {
    setInterval(() => {
      this.plain++;               // không báo cho Angular
      this.count.update(c => c + 1); // báo cho Angular
    }, 1000);
  }

  bump() {
    this.plain += 100;
  }
}

mount(Demo);
`,
  },
  {
    id: 'zoneless-setTimeout', group: 'Zoneless', title: 'Biến thường đổi trong setTimeout', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p>Không có zone.js, Angular <b>không tự biết</b> khi nào <code>setTimeout</code>, <code>subscribe</code> hay <code>fetch</code> xong. Gán biến thường trong callback đó thì component OnPush không bao giờ vẽ lại. Signal thì tự báo cho Angular phần nào cần cập nhật.</p>
<p><b>Yêu cầu:</b> sau 300ms đoạn văn phải đổi thành <code>Đã tải xong!</code>.</p>`,
    starter: `@Component({
  selector: 'app-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="msg">{{ message }}</p>',
})
class Status {
  message = 'Đang tải…';

  constructor() {
    // ❗ Angular không biết biến này đã đổi
    setTimeout(() => (this.message = 'Đã tải xong!'), 300);
  }
}

mount(Status);
`,
    solution: `@Component({
  selector: 'app-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="msg">{{ message() }}</p>',
})
class Status {
  message = signal('Đang tải…');

  constructor() {
    setTimeout(() => this.message.set('Đã tải xong!'), 300);
  }
}

mount(Status);
`,
    hint: "message = signal('Đang tải…'); trong setTimeout gọi this.message.set('Đã tải xong!'); template đọc {{ message() }}.",
    explain: 'Trong app zoneless, những thứ kích hoạt change detection gồm: signal được template đọc thay đổi, sự kiện template ((click)…), markForCheck(), AsyncPipe. Biến thường đổi trong callback không nằm trong danh sách đó.',
    check(a) {
      const t = a.text('.msg');
      if (t === 'Đã tải xong!') return OK();
      if (t === 'Đang tải…') return NO('Sau 300ms giao diện vẫn là "Đang tải…": Angular không được báo rằng message đã đổi.');
      return NO('Đoạn văn đang là "' + t + '".');
    },
  },
  {
    id: 'onpush-input-object', group: 'OnPush', title: 'OnPush và object input', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Component OnPush chỉ kiểm tra lại khi input nhận <b>tham chiếu mới</b> (hoặc signal nó đọc đổi, hoặc sự kiện của chính nó). Cha sửa ruột object rồi truyền lại chính object đó thì con OnPush không thấy gì.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Đổi tên</b> ở cha; thẻ con phải hiện <code>An (VIP)</code>.</p>`,
    starter: `@Component({
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
    <button (click)="rename()">Đổi tên</button>
  \`,
})
class Root {
  user = { name: 'Bíp', tier: 'thường' };

  rename() {
    // ❗ sửa ruột object cũ: tham chiếu không đổi
    this.user.name = 'An';
    this.user.tier = 'VIP';
  }
}

mount(Root);
`,
    solution: `@Component({
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
    <button (click)="rename()">Đổi tên</button>
  \`,
})
class Root {
  user = signal({ name: 'Bíp', tier: 'thường' });

  rename() {
    this.user.update(u => ({ ...u, name: 'An', tier: 'VIP' }));
  }
}

mount(Root);
`,
    hint: "Tạo object mới thay vì sửa ruột: dùng signal user và this.user.update(u => ({ ...u, name: 'An', tier: 'VIP' })), bind [user]=\"user()\".",
    explain: 'Dữ liệu bất biến + OnPush là bộ đôi giúp Angular bỏ qua cả nhánh component không đổi. Mọi component mới nên là OnPush.',
    simulate(s) { s.at(150, () => s.click('Đổi tên')); },
    check(a) {
      const t = a.text('.card');
      if (t === 'An (VIP)') return OK();
      if (t === 'Bíp (thường)') return NO('Thẻ con vẫn là "Bíp (thường)": object bị sửa tại chỗ nên input của con OnPush không đổi tham chiếu.');
      return NO('Thẻ con đang là "' + t + '", cần "An (VIP)".');
    },
  },
  {
    id: 'mark-for-check', group: 'OnPush', title: 'Thư viện ngoài gọi callback: markForCheck', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Đôi khi state nằm trong code không dùng signal (thư viện bên thứ ba, code cũ) và chỉ báo bằng callback. Khi đó inject <code>ChangeDetectorRef</code> và gọi <code>markForCheck()</code> để Angular kiểm tra lại component (và các tổ tiên) ở lần render tới.</p>
<p><b>Yêu cầu:</b> không đổi class <code>OldChatClient</code>; component phải hiện <code>Tin nhắn: 3</code> sau khi client nhận đủ 3 tin.</p>`,
    starter: `// Thư viện cũ: không biết gì về Angular hay signal
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
  template: '<p class="count">Tin nhắn: {{ client.count }}</p>',
})
class Chat {
  client = new OldChatClient();

  constructor() {
    this.client.onMessage(() => {
      // TODO: báo cho Angular rằng cần vẽ lại
    });
  }
}

mount(Chat);
`,
    solution: `// Thư viện cũ: không biết gì về Angular hay signal
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
  template: '<p class="count">Tin nhắn: {{ client.count }}</p>',
})
class Chat {
  client = new OldChatClient();
  cdr = inject(ChangeDetectorRef);

  constructor() {
    this.client.onMessage(() => this.cdr.markForCheck());
  }
}

mount(Chat);
`,
    hint: 'cdr = inject(ChangeDetectorRef); và trong callback gọi this.cdr.markForCheck().',
    explain: 'Một cách khác là tự giữ state trong signal: count = signal(0) và trong callback gọi this.count.set(this.client.count). markForCheck hợp khi bạn không muốn bọc lại toàn bộ dữ liệu của thư viện.',
    check(a) {
      const t = a.text('.count');
      if (t === 'Tin nhắn: 3') return OK();
      if (t === 'Tin nhắn: 0') return NO('Client đã nhận 3 tin nhưng giao diện vẫn 0: Angular chưa được báo để kiểm tra lại component.');
      return NO('Đang hiển thị "' + t + '", cần "Tin nhắn: 3".');
    },
  },
  {
    id: 'ham-nang-template', group: 'Hiệu năng', title: 'Hàm nặng trong template', level: 'Trung bình', lv: 2, waitMs: 1100,
    desc: `<p>Gọi method trong template (<code>{{ calcTotal() }}</code>) nghĩa là method chạy lại <b>mỗi lần</b> component được kiểm tra, kể cả khi dữ liệu của nó không đổi. <code>computed</code> có cache: chỉ tính lại khi phụ thuộc đổi.</p>
<p><b>Yêu cầu:</b> component có đồng hồ đổi mỗi 150ms. Phép tính tổng tiền (in log <code>tính tổng</code>) chỉ được chạy tối đa 2 lần trong suốt bài.</p>`,
    starter: `@Component({
  selector: 'app-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p class="clock">⏱ {{ seconds() }}</p>
    <p class="total">Tổng: {{ calcTotal() }}</p>
  \`,
})
class Invoice {
  items = signal([120000, 80000, 50000]);
  seconds = signal(0);

  constructor() {
    const id = setInterval(() => this.seconds.update(s => s + 1), 150);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  // ❗ chạy lại mỗi lần component được kiểm tra (mỗi nhịp đồng hồ)
  calcTotal() {
    log('tính tổng');
    return this.items().reduce((s, x) => s + x, 0);
  }
}

mount(Invoice);
`,
    solution: `@Component({
  selector: 'app-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p class="clock">⏱ {{ seconds() }}</p>
    <p class="total">Tổng: {{ total() }}</p>
  \`,
})
class Invoice {
  items = signal([120000, 80000, 50000]);
  seconds = signal(0);
  total = computed(() => {
    log('tính tổng');
    return this.items().reduce((s, x) => s + x, 0);
  });

  constructor() {
    const id = setInterval(() => this.seconds.update(s => s + 1), 150);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}

mount(Invoice);
`,
    hint: "total = computed(() => { log('tính tổng'); return this.items().reduce((s, x) => s + x, 0); }); template đọc {{ total() }}.",
    explain: 'Nếu cần biến đổi để hiển thị mà không phụ thuộc state của component, pipe pure cũng có cache theo đầu vào. Tránh gọi method có tính toán, lọc hay sắp xếp trực tiếp trong template.',
    check(a) {
      const runs = a.logs.filter((l) => l === 'tính tổng').length;
      if (a.text('.total') !== 'Tổng: 250000') return NO('Tổng tiền cần là 250000.');
      if (runs <= 2) return OK('Phép tính chỉ chạy ' + runs + ' lần.');
      return NO('Phép tính chạy ' + runs + ' lần dù danh sách không đổi: method trong template chạy lại mỗi lần kiểm tra. Dùng computed.');
    },
  },
  {
    id: 'subscribe-gan-bien', group: 'Zoneless', title: 'Subscribe tay rồi gán biến: dùng toSignal', level: 'Dễ', lv: 1, waitMs: 1000,
    desc: `<p>Subscribe một Observable rồi gán vào biến thường trong component OnPush: dữ liệu về nhưng giao diện không đổi (và còn phải tự unsubscribe). <code>toSignal()</code> vừa báo cho Angular, vừa tự huỷ khi component bị huỷ.</p>
<p><b>Yêu cầu:</b> hiển thị <code>User 5</code> từ <code>fakeApi.user(5)</code>.</p>`,
    starter: `@Component({
  selector: 'app-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="name">{{ user?.name ?? "Đang tải…" }}</p>',
})
class UserView {
  user = null;

  constructor() {
    // ❗ gán biến thường trong subscribe
    fakeApi.user(5).subscribe(u => (this.user = u));
  }
}

mount(UserView);
`,
    solution: `@Component({
  selector: 'app-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p class="name">{{ user()?.name ?? "Đang tải…" }}</p>',
})
class UserView {
  user = toSignal(fakeApi.user(5), { initialValue: null });
}

mount(UserView);
`,
    hint: 'user = toSignal(fakeApi.user(5), { initialValue: null }); và template đọc user()?.name.',
    explain: 'Thay thế khác: AsyncPipe (| async) cũng tự markForCheck và unsubscribe. Với dữ liệu tải theo tham số, dùng rxResource/httpResource.',
    check(a) {
      const t = a.text('.name');
      if (t === 'User 5') return OK();
      if (t === 'Đang tải…') return NO('Dữ liệu đã về (xem Console) nhưng giao diện vẫn "Đang tải…".');
      return NO('Đang hiển thị "' + t + '", cần "User 5".');
    },
  },
];

export const LAB: LabModule = {
  title: 'Change detection',
  subtitle: 'bài luyện change detection trong app zoneless với component OnPush: setTimeout, object input, markForCheck, hàm nặng trong template, subscribe tay.',
  exercises: EXERCISES,
  cheatsheet: [
    ['State đổi trong callback (setTimeout, subscribe…)', 'giữ trong <code>signal</code>; hoặc <code>markForCheck()</code>'],
    ['Component mới', '<code>changeDetection: ChangeDetectionStrategy.OnPush</code>'],
    ['Truyền object xuống con OnPush', 'tạo object mới khi đổi (<code>{ ...u, name }</code>)'],
    ['State nằm trong thư viện ngoài', '<code>inject(ChangeDetectorRef).markForCheck()</code> trong callback'],
    ['Tính toán để hiển thị', '<code>computed</code> hoặc pipe pure; không gọi method nặng trong template'],
    ['Hiển thị Observable', '<code>toSignal()</code> hoặc <code>| async</code>'],
  ],
};
