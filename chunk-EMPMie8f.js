import{a as s,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var r={title:`Pipe`,subtitle:`bài luyện pipe trên component thật: pipe có sẵn, nối pipe đúng thứ tự, pipe tự viết, pipe có tham số, pipe pure + dữ liệu bất biến, async pipe.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Thử các pipe có sẵn (<code>DatePipe</code>, <code>DecimalPipe</code>, <code>CurrencyPipe</code>, <code>UpperCasePipe</code>, <code>JsonPipe</code>, <code>AsyncPipe</code>…) và tự viết pipe bằng <code>&#64;Pipe</code>. Nhớ khai báo pipe trong <code>imports</code>. Lab dùng locale mặc định en-US.</p>`,starter:`@Pipe({ name: 'shout' })
class ShoutPipe {
  transform(value) {
    return value.toUpperCase() + '!';
  }
}

@Component({
  selector: 'app-pipes',
  imports: [ShoutPipe, DatePipe, DecimalPipe, JsonPipe],
  template: \`
    <p>{{ 'xin ch\xE0o' | shout }}</p>
    <p>{{ now | date:'dd/MM/yyyy HH:mm' }}</p>
    <p>{{ 1234567.891 | number:'1.0-2' }}</p>
    <pre>{{ user | json }}</pre>
  \`,
})
class Pipes {
  now = new Date();
  user = { name: 'B\xEDp', level: 3 };
}

mount(Pipes);
`},{id:`pipe-co-ban`,group:`Pipe có sẵn`,title:`uppercase, date, number`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Pipe bi\u1EBFn \u0111\u1ED5i gi\xE1 tr\u1ECB <b>khi hi\u1EC3n th\u1ECB</b> m\xE0 kh\xF4ng \u0111\u1ED5i d\u1EEF li\u1EC7u trong class: <code>{{ x | uppercase }}</code>, <code>{{ d | date:'dd/MM/yyyy' }}</code>, <code>{{ n | number }}</code>. Pipe l\xE0 class standalone n\xEAn ph\u1EA3i khai b\xE1o trong <code>imports</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> hi\u1EC3n th\u1ECB <code>\u0110\u01A0N H\xC0NG C\u1EE6A B\xCDP</code>, <code>20/11/2026</code> v\xE0 <code>1,250,000</code>.</p>`,starter:`@Component({
  selector: 'app-order',
  // TODO: khai b\xE1o c\xE1c pipe c\u1EA7n d\xF9ng trong imports
  template: \`
    <p class="name">{{ name }}</p>
    <p class="date">{{ createdAt }}</p>
    <p class="total">{{ total }}</p>
  \`,
})
class Order {
  name = '\u0111\u01A1n h\xE0ng c\u1EE7a b\xEDp';
  createdAt = new Date(2026, 10, 20);
  total = 1250000;
}

mount(Order);
`,solution:`@Component({
  selector: 'app-order',
  imports: [UpperCasePipe, DatePipe, DecimalPipe],
  template: \`
    <p class="name">{{ name | uppercase }}</p>
    <p class="date">{{ createdAt | date:'dd/MM/yyyy' }}</p>
    <p class="total">{{ total | number }}</p>
  \`,
})
class Order {
  name = '\u0111\u01A1n h\xE0ng c\u1EE7a b\xEDp';
  createdAt = new Date(2026, 10, 20);
  total = 1250000;
}

mount(Order);
`,hint:`imports: [UpperCasePipe, DatePipe, DecimalPipe]; rồi {{ name | uppercase }}, {{ createdAt | date:'dd/MM/yyyy' }}, {{ total | number }}.`,explain:`Định dạng số/ngày phụ thuộc locale (LOCALE_ID). App tiếng Việt sẽ registerLocaleData(localeVi) và cung cấp { provide: LOCALE_ID, useValue: "vi" } để có "1.250.000".`,check(e){let t=e.text(`.name`),i$1=e.text(`.date`),c=e.text(`.total`);return t!==`ĐƠN HÀNG CỦA BÍP`?s(`.name đang là "`+t+`", cần "ĐƠN HÀNG CỦA BÍP".`):i$1!==`20/11/2026`?s(`.date đang là "`+i$1+`", cần "20/11/2026".`):c!==`1,250,000`?s(`.total đang là "`+c+`", cần "1,250,000".`):i()}},{id:`noi-pipe`,group:`Pipe có sẵn`,title:`Nối pipe đúng thứ tự`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>N\u1ED1i pipe ch\u1EA1y t\u1EEB tr\xE1i sang ph\u1EA3i: \u0111\u1EA7u ra c\u1EE7a pipe tr\u01B0\u1EDBc l\xE0 \u0111\u1EA7u v\xE0o c\u1EE7a pipe sau. <code>uppercase</code> ch\u1EC9 nh\u1EADn chu\u1ED7i; \u0111\u01B0a v\xE0o m\u1ED9t <code>Date</code> s\u1EBD l\u1ED7i <code>InvalidPipeArgument</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> hi\u1EC3n th\u1ECB th\u1EE9 trong tu\u1EA7n vi\u1EBFt hoa: <code>FRIDAY</code>, kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:`@Component({
  selector: 'app-day',
  imports: [UpperCasePipe, DatePipe],
  template: '<p class="day">{{ today | uppercase | date:"EEEE" }}</p>',
})
class Day {
  today = new Date(2026, 10, 20);
}

mount(Day);
`,solution:`@Component({
  selector: 'app-day',
  imports: [UpperCasePipe, DatePipe],
  template: '<p class="day">{{ today | date:"EEEE" | uppercase }}</p>',
})
class Day {
  today = new Date(2026, 10, 20);
}

mount(Day);
`,hint:`date trước để biến Date thành chuỗi "Friday", rồi mới uppercase.`,explain:`Khi nối pipe, hãy nghĩ theo kiểu dữ liệu: Date → (date) → string → (uppercase) → string. Pipe có tham số thì tham số đi liền sau dấu hai chấm: date:"EEEE".`,check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg()+`. Kiểm tra thứ tự pipe.`);let t=e.text(`.day`);return t===`FRIDAY`?i():s(`Đang hiển thị "`+t+`", cần "FRIDAY".`)}},{id:`pipe-tu-viet`,group:`Pipe tự viết`,title:`Tự viết pipe`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Pipe t\u1EF1 vi\u1EBFt l\xE0 class c\xF3 method <code>transform(value, ...args)</code> v\xE0 decorator <code>&#64;Pipe({ name: 't\xEAn' })</code>. T\xEAn n\xE0y d\xF9ng trong template sau d\u1EA5u <code>|</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> bi\u1EBFn <code>VndPipe</code> th\xE0nh pipe t\xEAn <code>vnd</code> v\xE0 d\xF9ng \u0111\u01B0\u1EE3c trong <code>Price</code>; k\u1EBFt qu\u1EA3 l\xE0 <code>1.250.000 \u0111</code>.</p>`,starter:`// TODO: bi\u1EBFn class n\xE0y th\xE0nh pipe t\xEAn 'vnd'
class VndPipe {
  transform(value) {
    return value.toLocaleString('vi-VN') + ' \u0111';
  }
}

@Component({
  selector: 'app-price',
  // TODO: khai b\xE1o pipe trong imports
  template: '<p class="price">{{ 1250000 | vnd }}</p>',
})
class Price {}

mount(Price);
`,solution:`@Pipe({ name: 'vnd' })
class VndPipe {
  transform(value) {
    return value.toLocaleString('vi-VN') + ' \u0111';
  }
}

@Component({
  selector: 'app-price',
  imports: [VndPipe],
  template: '<p class="price">{{ 1250000 | vnd }}</p>',
})
class Price {}

mount(Price);
`,hint:`Thêm @Pipe({ name: 'vnd' }) trên class VndPipe, và imports: [VndPipe] trong Price.`,explain:`Lỗi NG0302 "pipe could not be found" gần như luôn do quên imports. Trong TypeScript nên implements PipeTransform để kiểm tra chữ ký của transform().`,check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg()+`.`);let t=e.text(`.price`);return t===`1.250.000 đ`?i():s(`Đang hiển thị "`+t+`", cần "1.250.000 đ".`)}},{id:`pipe-tham-so`,group:`Pipe tự viết`,title:`Pipe có tham số`,level:`Trung bình`,lv:2,waitMs:500,desc:`<p>Tham s\u1ED1 truy\u1EC1n sau d\u1EA5u hai ch\u1EA5m: <code>{{ text | truncate:12 }}</code> g\u1ECDi <code>transform(text, 12)</code>. Tham s\u1ED1 tu\u1EF3 ch\u1ECDn th\xEC \u0111\u1EB7t gi\xE1 tr\u1ECB m\u1EB7c \u0111\u1ECBnh trong <code>transform</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> ho\xE0n thi\u1EC7n <code>truncate</code>: c\u1EAFt chu\u1ED7i c\xF2n t\u1ED1i \u0111a <code>limit</code> k\xFD t\u1EF1 (m\u1EB7c \u0111\u1ECBnh 20), th\xEAm <code>\u2026</code> n\u1EBFu b\u1ECB c\u1EAFt.</p>`,starter:`@Pipe({ name: 'truncate' })
class TruncatePipe {
  transform(value, limit) {
    // TODO: c\u1EAFt c\xF2n t\u1ED1i \u0111a limit k\xFD t\u1EF1 (m\u1EB7c \u0111\u1ECBnh 20), th\xEAm '\u2026' n\u1EBFu b\u1ECB c\u1EAFt
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
  long = 'Angular l\xE0 framework frontend c\u1EE7a Google';
  short = 'Xin ch\xE0o';
}

mount(News);
`,solution:`@Pipe({ name: 'truncate' })
class TruncatePipe {
  transform(value, limit = 20) {
    return value.length > limit ? value.slice(0, limit) + '\u2026' : value;
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
  long = 'Angular l\xE0 framework frontend c\u1EE7a Google';
  short = 'Xin ch\xE0o';
}

mount(News);
`,hint:`transform(value, limit = 20) { return value.length > limit ? value.slice(0, limit) + '…' : value; }`,explain:`Nhiều tham số thì nối tiếp: {{ x | myPipe:a:b }} → transform(x, a, b). Pipe pure chỉ chạy lại khi value hoặc tham số đổi, nên rẻ hơn gọi method trong template.`,check(e){let t=[e.text(`.a`),e.text(`.b`),e.text(`.c`)],i$2=[`Angular là f…`,`Xin chào`,`Angular là framework…`];return JSON.stringify(t)===JSON.stringify(i$2)?i():s(`Kết quả: `+JSON.stringify(t)+`, mong đợi `+JSON.stringify(i$2)+`.`)}},{id:`pure-bat-bien`,group:`Pipe tự viết`,title:`Pipe pure và dữ liệu bất biến`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>Pipe m\u1EB7c \u0111\u1ECBnh l\xE0 <b>pure</b>: ch\u1EC9 ch\u1EA1y l\u1EA1i khi tham chi\u1EBFu \u0111\u1EA7u v\xE0o \u0111\u1ED5i. Push v\xE0o m\u1EA3ng c\u0169 th\xEC tham chi\u1EBFu kh\xF4ng \u0111\u1ED5i, n\xEAn pipe (v\xE0 c\u1EA3 signal) \u0111\u1EC1u kh\xF4ng th\u1EA5y thay \u0111\u1ED5i. C\xE1ch \u0111\xFAng l\xE0 t\u1EA1o m\u1EA3ng m\u1EDBi, <b>kh\xF4ng</b> ph\u1EA3i \u0111\u1EB7t <code>pure: false</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm vi\u1EC7c \u0111\xE3 xong</b> hai l\u1EA7n; t\xF3m t\u1EAFt ph\u1EA3i l\xE0 <code>3/3 vi\u1EC7c \u0111\xE3 xong</code>.</p>`,starter:`@Pipe({ name: 'doneCount' })
class DoneCountPipe {
  transform(todos) {
    return todos.filter(t => t.done).length + '/' + todos.length + ' vi\u1EC7c \u0111\xE3 xong';
  }
}

@Component({
  selector: 'app-todos',
  imports: [DoneCountPipe],
  template: \`
    <p class="summary">{{ todos() | doneCount }}</p>
    <button (click)="add()">Th\xEAm vi\u1EC7c \u0111\xE3 xong</button>
  \`,
})
class Todos {
  todos = signal([{ title: 'H\u1ECDc pipe', done: true }]);

  add() {
    // \u2757 s\u1EEDa ru\u1ED9t m\u1EA3ng c\u0169 r\u1ED3i tr\u1EA3 l\u1EA1i ch\xEDnh n\xF3
    this.todos.update(list => {
      list.push({ title: 'Vi\u1EC7c m\u1EDBi', done: true });
      return list;
    });
  }
}

mount(Todos);
`,solution:`@Pipe({ name: 'doneCount' })
class DoneCountPipe {
  transform(todos) {
    return todos.filter(t => t.done).length + '/' + todos.length + ' vi\u1EC7c \u0111\xE3 xong';
  }
}

@Component({
  selector: 'app-todos',
  imports: [DoneCountPipe],
  template: \`
    <p class="summary">{{ todos() | doneCount }}</p>
    <button (click)="add()">Th\xEAm vi\u1EC7c \u0111\xE3 xong</button>
  \`,
})
class Todos {
  todos = signal([{ title: 'H\u1ECDc pipe', done: true }]);

  add() {
    this.todos.update(list => [...list, { title: 'Vi\u1EC7c m\u1EDBi', done: true }]);
  }
}

mount(Todos);
`,hint:`this.todos.update(list => [...list, { title: 'Việc mới', done: true }]);`,explain:`pure: false làm pipe chạy lại ở MỌI lần change detection, rất tốn. Giữ dữ liệu bất biến thì pipe pure, computed và OnPush đều hoạt động đúng và nhanh.`,simulate(e){e.at(100,()=>e.click(`Thêm việc`)),e.at(250,()=>e.click(`Thêm việc`))},check(e,t){let i$3=e.text(`.summary`);return/pure\s*:\s*false/.test(t)?s(`Đừng đặt pure: false; hãy tạo mảng mới khi thêm phần tử.`):i$3===`3/3 việc đã xong`?i():i$3===`1/1 việc đã xong`?s(`Bấm thêm 2 lần nhưng tóm tắt không đổi: mảng cũ bị sửa tại chỗ nên tham chiếu không đổi.`):s(`Tóm tắt đang là "`+i$3+`", cần "3/3 việc đã xong".`)}},{id:`async-pipe`,group:`Pipe có sẵn`,title:`Hiển thị Observable: async pipe`,level:`Dễ`,lv:1,waitMs:1e3,desc:`<p><code>{{ obs$ | async }}</code> t\u1EF1 subscribe, c\u1EADp nh\u1EADt khi c\xF3 gi\xE1 tr\u1ECB m\u1EDBi v\xE0 t\u1EF1 unsubscribe khi component b\u1ECB hu\u1EF7. K\u1EBFt h\u1EE3p v\u1EDBi <code>@if (user$ | async; as u)</code> \u0111\u1EC3 ch\u1EDD d\u1EEF li\u1EC7u.</p>
<p><b>Y\xEAu c\u1EA7u:</b> hi\u1EC3n th\u1ECB <code>User 7 \u2014 user7@demo.dev</code> t\u1EEB <code>fakeApi.user(7)</code>, kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:`@Component({
  selector: 'app-user-card',
  // \u2757 template d\xF9ng pipe async nh\u01B0ng component ch\u01B0a khai b\xE1o n\xF3
  template: \`
    @if (user$ | async; as u) {
      <p class="name">{{ u.name }} \u2014 {{ u.email }}</p>
    } @else {
      <p class="loading">\u0110ang t\u1EA3i\u2026</p>
    }
  \`,
})
class UserCard {
  user$ = fakeApi.user(7);
}

mount(UserCard);
`,solution:`@Component({
  selector: 'app-user-card',
  imports: [AsyncPipe],
  template: \`
    @if (user$ | async; as u) {
      <p class="name">{{ u.name }} \u2014 {{ u.email }}</p>
    } @else {
      <p class="loading">\u0110ang t\u1EA3i\u2026</p>
    }
  \`,
})
class UserCard {
  user$ = fakeApi.user(7);
}

mount(UserCard);
`,hint:`imports: [AsyncPipe]`,explain:`Trong code mới, toSignal(obs$) thường gọn hơn: template đọc user() như mọi signal khác. Mỗi lần dùng | async trên cùng một Observable lạnh là một lần subscribe (một request) riêng.`,check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg()+`.`);let t=e.text(`.name`);return t===`User 7 — user7@demo.dev`?i():s(`Chưa hiển thị dữ liệu user (đang là "`+(t||e.text())+`").`)}}],cheatsheet:[[`Định dạng khi hiển thị`,`<code>{{ x | uppercase }}</code>, <code>| date:'dd/MM/yyyy'</code>, <code>| number</code>, <code>| currency</code>`],[`Dùng pipe trong component`,`khai báo trong <code>imports</code> (<code>DatePipe</code>, <code>AsyncPipe</code>…)`],[`Nối nhiều pipe`,`trái sang phải, theo kiểu dữ liệu: <code>d | date:"EEEE" | uppercase</code>`],[`Tự viết pipe`,`<code>&#64;Pipe({ name: 'x' })</code> + <code>transform(value, ...args)</code>`],[`Pipe không cập nhật khi đổi mảng`,`tạo mảng/object mới; không dùng <code>pure: false</code>`],[`Hiển thị Observable`,`<code>| async</code> hoặc <code>toSignal()</code>`]]};export{r as LAB};