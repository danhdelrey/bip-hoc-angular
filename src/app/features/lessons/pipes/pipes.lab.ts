import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 6 — Pipe: pipe có sẵn (uppercase/date/number), thứ tự khi nối pipe,
 * pipe tự viết, pipe có tham số, pipe pure + dữ liệu bất biến, async pipe.
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử các pipe có sẵn (<code>DatePipe</code>, <code>DecimalPipe</code>, <code>CurrencyPipe</code>, <code>UpperCasePipe</code>, <code>JsonPipe</code>, <code>AsyncPipe</code>…) và tự viết pipe bằng <code>&#64;Pipe</code>. Nhớ khai báo pipe trong <code>imports</code>. Lab dùng locale mặc định en-US.</p>`,
    starter: `@Pipe({ name: 'shout' })
class ShoutPipe {
  transform(value) {
    return value.toUpperCase() + '!';
  }
}

@Component({
  selector: 'app-pipes',
  imports: [ShoutPipe, DatePipe, DecimalPipe, JsonPipe],
  template: \`
    <p>{{ 'xin chào' | shout }}</p>
    <p>{{ now | date:'dd/MM/yyyy HH:mm' }}</p>
    <p>{{ 1234567.891 | number:'1.0-2' }}</p>
    <pre>{{ user | json }}</pre>
  \`,
})
class Pipes {
  now = new Date();
  user = { name: 'Bíp', level: 3 };
}

mount(Pipes);
`,
  },
  {
    id: 'pipe-co-ban', group: 'Pipe có sẵn', title: 'uppercase, date, number', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Pipe biến đổi giá trị <b>khi hiển thị</b> mà không đổi dữ liệu trong class: <code>{{ x | uppercase }}</code>, <code>{{ d | date:'dd/MM/yyyy' }}</code>, <code>{{ n | number }}</code>. Pipe là class standalone nên phải khai báo trong <code>imports</code>.</p>
<p><b>Yêu cầu:</b> hiển thị <code>ĐƠN HÀNG CỦA BÍP</code>, <code>20/11/2026</code> và <code>1,250,000</code>.</p>`,
    starter: `@Component({
  selector: 'app-order',
  // TODO: khai báo các pipe cần dùng trong imports
  template: \`
    <p class="name">{{ name }}</p>
    <p class="date">{{ createdAt }}</p>
    <p class="total">{{ total }}</p>
  \`,
})
class Order {
  name = 'đơn hàng của bíp';
  createdAt = new Date(2026, 10, 20);
  total = 1250000;
}

mount(Order);
`,
    solution: `@Component({
  selector: 'app-order',
  imports: [UpperCasePipe, DatePipe, DecimalPipe],
  template: \`
    <p class="name">{{ name | uppercase }}</p>
    <p class="date">{{ createdAt | date:'dd/MM/yyyy' }}</p>
    <p class="total">{{ total | number }}</p>
  \`,
})
class Order {
  name = 'đơn hàng của bíp';
  createdAt = new Date(2026, 10, 20);
  total = 1250000;
}

mount(Order);
`,
    hint: "imports: [UpperCasePipe, DatePipe, DecimalPipe]; rồi {{ name | uppercase }}, {{ createdAt | date:'dd/MM/yyyy' }}, {{ total | number }}.",
    explain: 'Định dạng số/ngày phụ thuộc locale (LOCALE_ID). App tiếng Việt sẽ registerLocaleData(localeVi) và cung cấp { provide: LOCALE_ID, useValue: "vi" } để có "1.250.000".',
    check(a) {
      const n = a.text('.name'), d = a.text('.date'), t = a.text('.total');
      if (n !== 'ĐƠN HÀNG CỦA BÍP') return NO('.name đang là "' + n + '", cần "ĐƠN HÀNG CỦA BÍP".');
      if (d !== '20/11/2026') return NO('.date đang là "' + d + '", cần "20/11/2026".');
      if (t !== '1,250,000') return NO('.total đang là "' + t + '", cần "1,250,000".');
      return OK();
    },
  },
  {
    id: 'noi-pipe', group: 'Pipe có sẵn', title: 'Nối pipe đúng thứ tự', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Nối pipe chạy từ trái sang phải: đầu ra của pipe trước là đầu vào của pipe sau. <code>uppercase</code> chỉ nhận chuỗi; đưa vào một <code>Date</code> sẽ lỗi <code>InvalidPipeArgument</code>.</p>
<p><b>Yêu cầu:</b> hiển thị thứ trong tuần viết hoa: <code>FRIDAY</code>, không có lỗi.</p>`,
    starter: `@Component({
  selector: 'app-day',
  imports: [UpperCasePipe, DatePipe],
  template: '<p class="day">{{ today | uppercase | date:"EEEE" }}</p>',
})
class Day {
  today = new Date(2026, 10, 20);
}

mount(Day);
`,
    solution: `@Component({
  selector: 'app-day',
  imports: [UpperCasePipe, DatePipe],
  template: '<p class="day">{{ today | date:"EEEE" | uppercase }}</p>',
})
class Day {
  today = new Date(2026, 10, 20);
}

mount(Day);
`,
    hint: 'date trước để biến Date thành chuỗi "Friday", rồi mới uppercase.',
    explain: 'Khi nối pipe, hãy nghĩ theo kiểu dữ liệu: Date → (date) → string → (uppercase) → string. Pipe có tham số thì tham số đi liền sau dấu hai chấm: date:"EEEE".',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Kiểm tra thứ tự pipe.');
      const t = a.text('.day');
      if (t === 'FRIDAY') return OK();
      return NO('Đang hiển thị "' + t + '", cần "FRIDAY".');
    },
  },
  {
    id: 'pipe-tu-viet', group: 'Pipe tự viết', title: 'Tự viết pipe', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Pipe tự viết là class có method <code>transform(value, ...args)</code> và decorator <code>&#64;Pipe({ name: 'tên' })</code>. Tên này dùng trong template sau dấu <code>|</code>.</p>
<p><b>Yêu cầu:</b> biến <code>VndPipe</code> thành pipe tên <code>vnd</code> và dùng được trong <code>Price</code>; kết quả là <code>1.250.000 đ</code>.</p>`,
    starter: `// TODO: biến class này thành pipe tên 'vnd'
class VndPipe {
  transform(value) {
    return value.toLocaleString('vi-VN') + ' đ';
  }
}

@Component({
  selector: 'app-price',
  // TODO: khai báo pipe trong imports
  template: '<p class="price">{{ 1250000 | vnd }}</p>',
})
class Price {}

mount(Price);
`,
    solution: `@Pipe({ name: 'vnd' })
class VndPipe {
  transform(value) {
    return value.toLocaleString('vi-VN') + ' đ';
  }
}

@Component({
  selector: 'app-price',
  imports: [VndPipe],
  template: '<p class="price">{{ 1250000 | vnd }}</p>',
})
class Price {}

mount(Price);
`,
    hint: "Thêm @Pipe({ name: 'vnd' }) trên class VndPipe, và imports: [VndPipe] trong Price.",
    explain: 'Lỗi NG0302 "pipe could not be found" gần như luôn do quên imports. Trong TypeScript nên implements PipeTransform để kiểm tra chữ ký của transform().',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      const t = a.text('.price');
      if (t === '1.250.000 đ') return OK();
      return NO('Đang hiển thị "' + t + '", cần "1.250.000 đ".');
    },
  },
  {
    id: 'pipe-tham-so', group: 'Pipe tự viết', title: 'Pipe có tham số', level: 'Trung bình', lv: 2, waitMs: 500,
    desc: `<p>Tham số truyền sau dấu hai chấm: <code>{{ text | truncate:12 }}</code> gọi <code>transform(text, 12)</code>. Tham số tuỳ chọn thì đặt giá trị mặc định trong <code>transform</code>.</p>
<p><b>Yêu cầu:</b> hoàn thiện <code>truncate</code>: cắt chuỗi còn tối đa <code>limit</code> ký tự (mặc định 20), thêm <code>…</code> nếu bị cắt.</p>`,
    starter: `@Pipe({ name: 'truncate' })
class TruncatePipe {
  transform(value, limit) {
    // TODO: cắt còn tối đa limit ký tự (mặc định 20), thêm '…' nếu bị cắt
    return value;
  }
}

@Component({
  selector: 'app-news',
  imports: [TruncatePipe],
  template: \`
    <p class="a">{{ long | truncate:12 }}</p>
    <p class="b">{{ short | truncate }}</p>
    <p class="c">{{ long | truncate }}</p>
  \`,
})
class News {
  long = 'Angular là framework frontend của Google';
  short = 'Xin chào';
}

mount(News);
`,
    solution: `@Pipe({ name: 'truncate' })
class TruncatePipe {
  transform(value, limit = 20) {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}

@Component({
  selector: 'app-news',
  imports: [TruncatePipe],
  template: \`
    <p class="a">{{ long | truncate:12 }}</p>
    <p class="b">{{ short | truncate }}</p>
    <p class="c">{{ long | truncate }}</p>
  \`,
})
class News {
  long = 'Angular là framework frontend của Google';
  short = 'Xin chào';
}

mount(News);
`,
    hint: "transform(value, limit = 20) { return value.length > limit ? value.slice(0, limit) + '…' : value; }",
    explain: 'Nhiều tham số thì nối tiếp: {{ x | myPipe:a:b }} → transform(x, a, b). Pipe pure chỉ chạy lại khi value hoặc tham số đổi, nên rẻ hơn gọi method trong template.',
    check(a) {
      const got = [a.text('.a'), a.text('.b'), a.text('.c')];
      const want = ['Angular là f…', 'Xin chào', 'Angular là framework…'];
      if (JSON.stringify(got) === JSON.stringify(want)) return OK();
      return NO('Kết quả: ' + JSON.stringify(got) + ', mong đợi ' + JSON.stringify(want) + '.');
    },
  },
  {
    id: 'pure-bat-bien', group: 'Pipe tự viết', title: 'Pipe pure và dữ liệu bất biến', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Pipe mặc định là <b>pure</b>: chỉ chạy lại khi tham chiếu đầu vào đổi. Push vào mảng cũ thì tham chiếu không đổi, nên pipe (và cả signal) đều không thấy thay đổi. Cách đúng là tạo mảng mới, <b>không</b> phải đặt <code>pure: false</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Thêm việc đã xong</b> hai lần; tóm tắt phải là <code>3/3 việc đã xong</code>.</p>`,
    starter: `@Pipe({ name: 'doneCount' })
class DoneCountPipe {
  transform(todos) {
    return todos.filter(t => t.done).length + '/' + todos.length + ' việc đã xong';
  }
}

@Component({
  selector: 'app-todos',
  imports: [DoneCountPipe],
  template: \`
    <p class="summary">{{ todos() | doneCount }}</p>
    <button (click)="add()">Thêm việc đã xong</button>
  \`,
})
class Todos {
  todos = signal([{ title: 'Học pipe', done: true }]);

  add() {
    // ❗ sửa ruột mảng cũ rồi trả lại chính nó
    this.todos.update(list => {
      list.push({ title: 'Việc mới', done: true });
      return list;
    });
  }
}

mount(Todos);
`,
    solution: `@Pipe({ name: 'doneCount' })
class DoneCountPipe {
  transform(todos) {
    return todos.filter(t => t.done).length + '/' + todos.length + ' việc đã xong';
  }
}

@Component({
  selector: 'app-todos',
  imports: [DoneCountPipe],
  template: \`
    <p class="summary">{{ todos() | doneCount }}</p>
    <button (click)="add()">Thêm việc đã xong</button>
  \`,
})
class Todos {
  todos = signal([{ title: 'Học pipe', done: true }]);

  add() {
    this.todos.update(list => [...list, { title: 'Việc mới', done: true }]);
  }
}

mount(Todos);
`,
    hint: "this.todos.update(list => [...list, { title: 'Việc mới', done: true }]);",
    explain: 'pure: false làm pipe chạy lại ở MỌI lần change detection, rất tốn. Giữ dữ liệu bất biến thì pipe pure, computed và OnPush đều hoạt động đúng và nhanh.',
    simulate(s) { s.at(100, () => s.click('Thêm việc')); s.at(250, () => s.click('Thêm việc')); },
    check(a, code) {
      const t = a.text('.summary');
      if (/pure\s*:\s*false/.test(code)) return NO('Đừng đặt pure: false; hãy tạo mảng mới khi thêm phần tử.');
      if (t === '3/3 việc đã xong') return OK();
      if (t === '1/1 việc đã xong') return NO('Bấm thêm 2 lần nhưng tóm tắt không đổi: mảng cũ bị sửa tại chỗ nên tham chiếu không đổi.');
      return NO('Tóm tắt đang là "' + t + '", cần "3/3 việc đã xong".');
    },
  },
  {
    id: 'async-pipe', group: 'Pipe có sẵn', title: 'Hiển thị Observable: async pipe', level: 'Dễ', lv: 1, waitMs: 1000,
    desc: `<p><code>{{ obs$ | async }}</code> tự subscribe, cập nhật khi có giá trị mới và tự unsubscribe khi component bị huỷ. Kết hợp với <code>@if (user$ | async; as u)</code> để chờ dữ liệu.</p>
<p><b>Yêu cầu:</b> hiển thị <code>User 7 — user7@demo.dev</code> từ <code>fakeApi.user(7)</code>, không có lỗi.</p>`,
    starter: `@Component({
  selector: 'app-user-card',
  // ❗ template dùng pipe async nhưng component chưa khai báo nó
  template: \`
    @if (user$ | async; as u) {
      <p class="name">{{ u.name }} — {{ u.email }}</p>
    } @else {
      <p class="loading">Đang tải…</p>
    }
  \`,
})
class UserCard {
  user$ = fakeApi.user(7);
}

mount(UserCard);
`,
    solution: `@Component({
  selector: 'app-user-card',
  imports: [AsyncPipe],
  template: \`
    @if (user$ | async; as u) {
      <p class="name">{{ u.name }} — {{ u.email }}</p>
    } @else {
      <p class="loading">Đang tải…</p>
    }
  \`,
})
class UserCard {
  user$ = fakeApi.user(7);
}

mount(UserCard);
`,
    hint: 'imports: [AsyncPipe]',
    explain: 'Trong code mới, toSignal(obs$) thường gọn hơn: template đọc user() như mọi signal khác. Mỗi lần dùng | async trên cùng một Observable lạnh là một lần subscribe (một request) riêng.',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      const t = a.text('.name');
      if (t === 'User 7 — user7@demo.dev') return OK();
      return NO('Chưa hiển thị dữ liệu user (đang là "' + (t || a.text()) + '").');
    },
  },
];

export const LAB: LabModule = {
  title: 'Pipe',
  subtitle: 'bài luyện pipe trên component thật: pipe có sẵn, nối pipe đúng thứ tự, pipe tự viết, pipe có tham số, pipe pure + dữ liệu bất biến, async pipe.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Định dạng khi hiển thị', '<code>{{ x | uppercase }}</code>, <code>| date:\'dd/MM/yyyy\'</code>, <code>| number</code>, <code>| currency</code>'],
    ['Dùng pipe trong component', 'khai báo trong <code>imports</code> (<code>DatePipe</code>, <code>AsyncPipe</code>…)'],
    ['Nối nhiều pipe', 'trái sang phải, theo kiểu dữ liệu: <code>d | date:"EEEE" | uppercase</code>'],
    ['Tự viết pipe', '<code>&#64;Pipe({ name: \'x\' })</code> + <code>transform(value, ...args)</code>'],
    ['Pipe không cập nhật khi đổi mảng', 'tạo mảng/object mới; không dùng <code>pure: false</code>'],
    ['Hiển thị Observable', '<code>| async</code> hoặc <code>toSignal()</code>'],
  ],
};
