import{a as s,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var r={title:`Control flow & Directive`,subtitle:`bài luyện control flow và directive trên component thật: @if/@else, @if … as, @for + track, @empty, @switch, giữ state khi ẩn, attribute directive.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Thử <code>@if</code>, <code>@for</code> (nhớ <code>track</code>), <code>@empty</code>, <code>@switch</code>, <code>@let</code> và viết directive của riêng bạn bằng <code>&#64;Directive</code>.</p>`,starter:`@Component({
  selector: 'app-list',
  template: \`
    <button (click)="add()">Th\xEAm</button>
    <button (click)="items.set([])">Xo\xE1 h\u1EBFt</button>
    <ul>
      @for (it of items(); track it.id; let i = $index) {
        <li>{{ i + 1 }}. {{ it.name }}</li>
      } @empty {
        <li>(tr\u1ED1ng)</li>
      }
    </ul>
    @if (items().length > 3) { <p>Danh s\xE1ch kh\xE1 d\xE0i r\u1ED3i!</p> }
  \`,
})
class List {
  items = signal([{ id: 1, name: 'Ph\u1EDF' }, { id: 2, name: 'B\xFAn ch\u1EA3' }]);
  add() {
    this.items.update(l => [...l, { id: Date.now(), name: 'M\xF3n ' + (l.length + 1) }]);
  }
}

mount(List);
`},{id:`if-else`,group:`Điều kiện`,title:`@if / @else`,level:`Dễ`,lv:1,waitMs:500,desc:`<p><code>@if (\u0111i\u1EC1u ki\u1EC7n) { \u2026 } @else { \u2026 }</code> ch\u1EC9 \u0111\u01B0a v\xE0o DOM <b>m\u1ED9t</b> trong hai kh\u1ED1i. Kh\u1ED1i c\xF2n l\u1EA1i b\u1ECB g\u1EE1 h\u1EB3n kh\u1ECFi DOM (kh\xF4ng ph\u1EA3i \u1EA9n b\u1EB1ng CSS).</p>
<p><b>Y\xEAu c\u1EA7u:</b> ch\u01B0a \u0111\u0103ng nh\u1EADp th\xEC ch\u1EC9 c\xF3 <code>.guest</code>; \u0111\u0103ng nh\u1EADp r\u1ED3i th\xEC ch\u1EC9 c\xF3 <code>.hello</code>. Khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\u0103ng nh\u1EADp</b>.</p>`,starter:`@Component({
  selector: 'app-auth',
  template: \`
    <!-- \u2757 c\u1EA3 hai \u0111o\u1EA1n lu\xF4n n\u1EB1m trong DOM -->
    <p class="hello">Xin ch\xE0o, B\xEDp!</p>
    <p class="guest">B\u1EA1n ch\u01B0a \u0111\u0103ng nh\u1EADp.</p>
    <button (click)="loggedIn.set(!loggedIn())">{{ loggedIn() ? '\u0110\u0103ng xu\u1EA5t' : '\u0110\u0103ng nh\u1EADp' }}</button>
  \`,
})
class Auth {
  loggedIn = signal(false);
}

mount(Auth);
`,solution:`@Component({
  selector: 'app-auth',
  template: \`
    @if (loggedIn()) {
      <p class="hello">Xin ch\xE0o, B\xEDp!</p>
    } @else {
      <p class="guest">B\u1EA1n ch\u01B0a \u0111\u0103ng nh\u1EADp.</p>
    }
    <button (click)="loggedIn.set(!loggedIn())">{{ loggedIn() ? '\u0110\u0103ng xu\u1EA5t' : '\u0110\u0103ng nh\u1EADp' }}</button>
  \`,
})
class Auth {
  loggedIn = signal(false);
}

mount(Auth);
`,hint:`@if (loggedIn()) { <p class="hello">…</p> } @else { <p class="guest">…</p> }`,explain:`Vì khối bị gỡ khỏi DOM, component bên trong @if bị destroy và tạo lại mỗi lần điều kiện đổi. Nhớ điều này khi khối chứa state (xem bài "Giữ state khi ẩn").`,simulate(t){t.at(50,()=>t.dom(e=>e.setAttribute(`data-init`,(e.querySelector(`.hello`)?`H`:``)+(e.querySelector(`.guest`)?`G`:``)))),t.at(150,()=>t.click(`Đăng nhập`))},check(t){let e=t.root()?.getAttribute(`data-init`);return e!==`G`?s(`Lúc chưa đăng nhập, giao diện cần chỉ có .guest (đang có: `+(e||`không gì`)+`).`):t.query(`.guest`).length?s(`Đã đăng nhập nhưng .guest vẫn còn trong DOM.`):t.query(`.hello`).length?i():s(`Đã đăng nhập nhưng chưa thấy .hello.`)}},{id:`if-as`,group:`Điều kiện`,title:`Dữ liệu đang tải: @if (x(); as u)`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>D\u1EEF li\u1EC7u t\u1EA3i b\u1EA5t \u0111\u1ED3ng b\u1ED9 ban \u0111\u1EA7u l\xE0 <code>null</code>; \u0111\u1ECDc <code>user().name</code> l\xFAc \u0111\xF3 s\u1EBD l\u1ED7i. <code>@if (user(); as u) { \u2026 } @else { \u2026 }</code> ch\u1EC9 render khi \u0111\xE3 c\xF3 d\u1EEF li\u1EC7u v\xE0 \u0111\u1EB7t t\xEAn ng\u1EAFn <code>u</code> cho gi\xE1 tr\u1ECB.</p>
<p><b>Y\xEAu c\u1EA7u:</b> trong l\xFAc ch\u1EDD hi\u1EC7n <code>.loading</code>; c\xF3 d\u1EEF li\u1EC7u th\xEC hi\u1EC7n <code>.name</code> l\xE0 <code>Xin ch\xE0o, B\xEDp (H\xE0 N\u1ED9i)</code>. Kh\xF4ng \u0111\u01B0\u1EE3c c\xF3 l\u1ED7i.</p>`,starter:`@Component({
  selector: 'app-profile',
  template: \`
    <!-- \u2757 user() l\xE0 null trong l\xFAc ch\u1EDD t\u1EA3i -->
    <p class="name">Xin ch\xE0o, {{ user().name }} ({{ user().city }})</p>
  \`,
})
class Profile {
  user = signal(null);

  constructor() {
    setTimeout(() => this.user.set({ name: 'B\xEDp', city: 'H\xE0 N\u1ED9i' }), 300);
  }
}

mount(Profile);
`,solution:`@Component({
  selector: 'app-profile',
  template: \`
    @if (user(); as u) {
      <p class="name">Xin ch\xE0o, {{ u.name }} ({{ u.city }})</p>
    } @else {
      <p class="loading">\u0110ang t\u1EA3i\u2026</p>
    }
  \`,
})
class Profile {
  user = signal(null);

  constructor() {
    setTimeout(() => this.user.set({ name: 'B\xEDp', city: 'H\xE0 N\u1ED9i' }), 300);
  }
}

mount(Profile);
`,hint:`@if (user(); as u) { … {{ u.name }} … } @else { <p class="loading">Đang tải…</p> }`,explain:`Có thể dùng optional chaining user()?.name, nhưng @if … as vừa tránh lỗi vừa cho chỗ hiển thị trạng thái đang tải. Với dữ liệu từ API, resource()/rxResource() có sẵn isLoading() và error().`,simulate(t){t.at(120,()=>t.dom(e=>e.setAttribute(`data-init`,e.querySelector(`.loading`)?`1`:`0`)))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. Đừng đọc thuộc tính của null.`);if(t.root()?.getAttribute(`data-init`)!==`1`)return s(`Trong lúc chờ tải chưa thấy .loading.`);let e=t.text(`.name`);return e===`Xin chào, Bíp (Hà Nội)`?i():s(`.name đang là "`+e+`", cần "Xin chào, Bíp (Hà Nội)".`)}},{id:`for-track`,group:`Danh sách`,title:`@for: track theo id`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p><code>track</code> cho Angular bi\u1EBFt h\xE0ng n\xE0o l\xE0 h\xE0ng n\xE0o. <code>track $index</code> g\u1EAFn DOM theo <b>v\u1ECB tr\xED</b>: khi danh s\xE1ch \u0111\u1ED5i th\u1EE9 t\u1EF1, Angular ch\u1EC9 \u0111\u1ED5i ch\u1EEF m\xE0 gi\u1EEF nguy\xEAn c\xE1c node, n\xEAn state trong DOM (\xF4 nh\u1EADp, focus, animation\u2026) n\u1EB1m sai h\xE0ng. Danh s\xE1ch c\xF3 th\u1EC3 s\u1EAFp x\u1EBFp/xo\xE1 th\xEC h\xE3y track theo id.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang g\xF5 ghi ch\xFA <code>\xEDt h\xE0nh</code> cho m\xF3n <b>Ph\u1EDF</b> r\u1ED3i b\u1EA5m <b>\u0110\u1EA3o th\u1EE9 t\u1EF1</b>. Ghi ch\xFA ph\u1EA3i \u0111i theo Ph\u1EDF.</p>`,starter:`@Component({
  selector: 'app-menu',
  template: \`
    <ul>
      @for (item of items(); track $index) {
        <li><span class="name">{{ item.name }}</span> <input placeholder="ghi ch\xFA" /></li>
      }
    </ul>
    <button (click)="reverse()">\u0110\u1EA3o th\u1EE9 t\u1EF1</button>
  \`,
})
class Menu {
  items = signal([
    { id: 1, name: 'Ph\u1EDF' },
    { id: 2, name: 'B\xFAn ch\u1EA3' },
    { id: 3, name: 'B\xE1nh m\xEC' },
  ]);

  reverse() {
    this.items.update(list => [...list].reverse());
  }
}

mount(Menu);
`,solution:`@Component({
  selector: 'app-menu',
  template: \`
    <ul>
      @for (item of items(); track item.id) {
        <li><span class="name">{{ item.name }}</span> <input placeholder="ghi ch\xFA" /></li>
      }
    </ul>
    <button (click)="reverse()">\u0110\u1EA3o th\u1EE9 t\u1EF1</button>
  \`,
})
class Menu {
  items = signal([
    { id: 1, name: 'Ph\u1EDF' },
    { id: 2, name: 'B\xFAn ch\u1EA3' },
    { id: 3, name: 'B\xE1nh m\xEC' },
  ]);

  reverse() {
    this.items.update(list => [...list].reverse());
  }
}

mount(Menu);
`,hint:`Đổi track $index thành track item.id.`,explain:`track item.id còn giúp hiệu năng: khi tải lại dữ liệu từ server (object mới nhưng cùng id), Angular giữ lại node thay vì tạo lại toàn bộ. $index chỉ hợp với danh sách tĩnh, không bao giờ đổi thứ tự.`,simulate(t){t.at(100,()=>t.type(`li input`,`ít hành`)),t.at(250,()=>t.click(`Đảo thứ tự`))},check(t){let e=t.query(`li`),o=e.find(a=>g(a.querySelector(`.name`)?.textContent)===`Phở`);return o?e[0]===o?s(`Phở vẫn đứng đầu: chưa đảo thứ tự?`):o.querySelector(`input`)?.value===`ít hành`?i():s(`Sau khi đảo, ghi chú "ít hành" không còn ở hàng Phở: DOM đang được gắn theo vị trí ($index).`):s(`Không tìm thấy hàng Phở.`)}},{id:`for-empty`,group:`Danh sách`,title:`@for … @empty`,level:`Dễ`,lv:1,waitMs:600,desc:`<p><code>@empty { \u2026 }</code> \u0111\u1EB7t ngay sau kh\u1ED1i <code>@for</code>, ch\u1EC9 hi\u1EC7n khi danh s\xE1ch r\u1ED7ng. Kh\xF4ng c\u1EA7n vi\u1EBFt th\xEAm <code>@if (list.length === 0)</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang g\xF5 <code>b\xFAn</code> (ph\u1EA3i c\xF2n 2 m\xF3n), r\u1ED3i g\xF5 <code>pizza</code>. L\xFAc \u0111\xF3 ph\u1EA3i hi\u1EC7n ph\u1EA7n t\u1EED <code>.empty</code> v\u1EDBi ch\u1EEF <code>Kh\xF4ng t\xECm th\u1EA5y m\xF3n n\xE0o</code>.</p>`,starter:`@Component({
  selector: 'app-search',
  template: \`
    <input placeholder="T\xECm m\xF3n\u2026" (input)="query.set($any($event.target).value)" />
    <ul>
      @for (d of results(); track d) {
        <li>{{ d }}</li>
      }
    </ul>
    <!-- TODO: khi kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3, hi\u1EC7n ph\u1EA7n t\u1EED .empty "Kh\xF4ng t\xECm th\u1EA5y m\xF3n n\xE0o" -->
  \`,
})
class Search {
  dishes = ['Ph\u1EDF', 'B\xFAn ch\u1EA3', 'B\xE1nh m\xEC', 'C\u01A1m t\u1EA5m', 'B\xFAn b\xF2'];
  query = signal('');
  results = computed(() => this.dishes.filter(d => d.toLowerCase().includes(this.query().toLowerCase())));
}

mount(Search);
`,solution:`@Component({
  selector: 'app-search',
  template: \`
    <input placeholder="T\xECm m\xF3n\u2026" (input)="query.set($any($event.target).value)" />
    <ul>
      @for (d of results(); track d) {
        <li>{{ d }}</li>
      } @empty {
        <li class="empty">Kh\xF4ng t\xECm th\u1EA5y m\xF3n n\xE0o</li>
      }
    </ul>
  \`,
})
class Search {
  dishes = ['Ph\u1EDF', 'B\xFAn ch\u1EA3', 'B\xE1nh m\xEC', 'C\u01A1m t\u1EA5m', 'B\xFAn b\xF2'];
  query = signal('');
  results = computed(() => this.dishes.filter(d => d.toLowerCase().includes(this.query().toLowerCase())));
}

mount(Search);
`,hint:`Ngay sau dấu } đóng của @for, thêm @empty { <li class="empty">Không tìm thấy món nào</li> }.`,explain:`@for còn có sẵn các biến $index, $first, $last, $even, $odd, $count: @for (d of list; track d.id; let i = $index, last = $last) { … }.`,simulate(t){t.at(100,()=>t.type(0,`bún`)),t.at(250,()=>t.dom(e=>e.setAttribute(`data-mid`,String(e.querySelectorAll(`li:not(.empty)`).length)))),t.at(300,()=>t.type(0,`pizza`))},check(t){return t.root()?.getAttribute(`data-mid`)!==`2`?s(`Gõ "bún" phải còn đúng 2 món (đừng làm hỏng phần lọc).`):t.query(`.empty`).length?t.text(`.empty`).includes(`Không tìm thấy món nào`)?i():s(`.empty cần có chữ "Không tìm thấy món nào".`):s(`Không còn món nào nhưng chưa thấy phần tử .empty. Dùng @empty.`)}},{id:`switch`,group:`Điều kiện`,title:`@switch cho nhiều trạng thái`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>M\u1ED9t gi\xE1 tr\u1ECB c\xF3 nhi\u1EC1u tr\u01B0\u1EDDng h\u1EE3p (idle/loading/ok/error\u2026) th\xEC d\xF9ng <code>@switch (x) { @case ('a') { \u2026 } @default { \u2026 } }</code> thay cho chu\u1ED7i <code>@if</code> r\u1EDDi r\u1EA1c d\u1EC5 s\xF3t tr\u01B0\u1EDDng h\u1EE3p.</p>
<p><b>Y\xEAu c\u1EA7u:</b> vi\u1EBFt l\u1EA1i b\u1EB1ng <code>@switch</code>: <code>loading</code> \u2192 <code>.loading</code>, <code>ok</code> \u2192 <code>.ok</code>, <code>error</code> \u2192 <code>.err</code> "C\xF3 l\u1ED7i x\u1EA3y ra", c\xF2n l\u1EA1i (<code>@default</code>) \u2192 <code>.idle</code> "Ch\u01B0a l\xE0m g\xEC".</p>`,starter:`@Component({
  selector: 'app-status',
  template: \`
    <button (click)="status.set('loading')">\u0110ang t\u1EA3i</button>
    <button (click)="status.set('ok')">Th\xE0nh c\xF4ng</button>
    <button (click)="status.set('error')">L\u1ED7i</button>
    <div class="box">
      @if (status() === 'loading') { <p class="loading">\u23F3 \u0110ang t\u1EA3i\u2026</p> }
      @if (status() === 'ok') { <p class="ok">\u2705 \u0110\xE3 l\u01B0u</p> }
      <!-- \u2757 thi\u1EBFu tr\u01B0\u1EDDng h\u1EE3p error v\xE0 tr\u01B0\u1EDDng h\u1EE3p m\u1EB7c \u0111\u1ECBnh -->
    </div>
  \`,
})
class Status {
  status = signal('idle');
}

mount(Status);
`,solution:`@Component({
  selector: 'app-status',
  template: \`
    <button (click)="status.set('loading')">\u0110ang t\u1EA3i</button>
    <button (click)="status.set('ok')">Th\xE0nh c\xF4ng</button>
    <button (click)="status.set('error')">L\u1ED7i</button>
    <div class="box">
      @switch (status()) {
        @case ('loading') { <p class="loading">\u23F3 \u0110ang t\u1EA3i\u2026</p> }
        @case ('ok') { <p class="ok">\u2705 \u0110\xE3 l\u01B0u</p> }
        @case ('error') { <p class="err">C\xF3 l\u1ED7i x\u1EA3y ra</p> }
        @default { <p class="idle">Ch\u01B0a l\xE0m g\xEC</p> }
      }
    </div>
  \`,
})
class Status {
  status = signal('idle');
}

mount(Status);
`,hint:`@switch (status()) { @case ('loading') { \u2026 } @case ('ok') { \u2026 } @case ('error') { <p class="err">C\xF3 l\u1ED7i x\u1EA3y ra</p> } @default { <p class="idle">Ch\u01B0a l\xE0m g\xEC</p> } }`,explain:`@switch so sánh bằng ===. Khi trạng thái là union type trong TypeScript, Angular có thể kiểm tra bạn đã xử lý đủ mọi @case (exhaustive check với @default never;).`,simulate(t){t.at(50,()=>t.dom(e=>e.setAttribute(`data-init`,e.querySelector(`.idle`)?`1`:`0`))),t.at(150,()=>t.click(`Lỗi`))},check(t,e){return t.root()?.getAttribute(`data-init`)!==`1`?s(`Lúc đầu (status = idle) cần hiện .idle "Chưa làm gì".`):t.text(`.err`)!==`Có lỗi xảy ra`?s(`Bấm Lỗi nhưng chưa thấy .err "Có lỗi xảy ra".`):t.query(`.idle, .ok, .loading`).length?s(`Đang ở trạng thái lỗi nhưng vẫn còn khối của trạng thái khác.`):/@switch/.test(e)?i():s(`Kết quả đúng, nhưng hãy viết bằng @switch.`)}},{id:`giu-state`,group:`Điều kiện`,title:`Giữ state khi ẩn: [hidden] thay vì @if`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p><code>@if</code> g\u1EE1 component kh\u1ECFi DOM, n\xEAn khi hi\u1EC7n l\u1EA1i th\xEC component \u0111\u01B0\u1EE3c <b>t\u1EA1o m\u1EDBi</b> v\xE0 m\u1EA5t h\u1EBFt state. Tab, form \u0111ang nh\u1EADp d\u1EDF\u2026 c\u1EA7n gi\u1EEF state th\xEC ch\u1EC9 <b>\u1EA9n</b> b\u1EB1ng <code>[hidden]</code> (ho\u1EB7c class CSS).</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>+1</b> ba l\u1EA7n \u1EDF Tab A, sang Tab B r\u1ED3i quay l\u1EA1i Tab A. B\u1ED9 \u0111\u1EBFm ph\u1EA3i v\u1EABn l\xE0 <code>\u0110\u1EBFm: 3</code>.</p>`,starter:`@Component({
  selector: 'app-counter',
  template: '<p class="count">\u0110\u1EBFm: {{ n() }}</p><button (click)="n.update(v => v + 1)">+1</button>',
})
class Counter {
  n = signal(0);
}

@Component({
  selector: 'app-tabs',
  imports: [Counter],
  template: \`
    <button (click)="tab.set('a')">Tab A</button>
    <button (click)="tab.set('b')">Tab B</button>
    <!-- \u2757 @if g\u1EE1 h\u1EB3n Counter \u2192 quay l\u1EA1i l\xE0 m\u1EA5t state -->
    @if (tab() === 'a') { <app-counter /> }
    @if (tab() === 'b') { <p class="b">N\u1ED9i dung tab B</p> }
  \`,
})
class Tabs {
  tab = signal('a');
}

mount(Tabs);
`,solution:`@Component({
  selector: 'app-counter',
  template: '<p class="count">\u0110\u1EBFm: {{ n() }}</p><button (click)="n.update(v => v + 1)">+1</button>',
})
class Counter {
  n = signal(0);
}

@Component({
  selector: 'app-tabs',
  imports: [Counter],
  template: \`
    <button (click)="tab.set('a')">Tab A</button>
    <button (click)="tab.set('b')">Tab B</button>
    <app-counter [hidden]="tab() !== 'a'" />
    @if (tab() === 'b') { <p class="b">N\u1ED9i dung tab B</p> }
  \`,
})
class Tabs {
  tab = signal('a');
}

mount(Tabs);
`,hint:`Thay @if (tab() === 'a') { <app-counter /> } b\u1EB1ng <app-counter [hidden]="tab() !== 'a'" />.`,explain:`Đánh đổi: [hidden] giữ component sống (tốn bộ nhớ, effect vẫn chạy); @if tiết kiệm hơn nhưng mất state. Nếu state quan trọng mà vẫn muốn gỡ khỏi DOM, hãy đưa state lên cha hoặc vào service.`,simulate(t){[100,150,200].forEach(e=>t.at(e,()=>t.click(`+1`))),t.at(300,()=>t.click(`Tab B`)),t.at(400,()=>t.click(`Tab A`))},check(t){let e=t.text(`.count`);return e===`Đếm: 3`?i():e===`Đếm: 0`?s(`Quay lại Tab A thì bộ đếm về 0: Counter đã bị huỷ và tạo lại. Dùng [hidden] để chỉ ẩn.`):s(`Bộ đếm đang là "`+e+`", cần "Đếm: 3".`)}},{id:`directive`,group:`Directive`,title:`Attribute directive tự viết`,level:`Khó`,lv:3,waitMs:600,desc:`<p>Attribute directive g\u1EAFn h\xE0nh vi v\xE0o ph\u1EA7n t\u1EED c\xF3 s\u1EB5n. Khai b\xE1o b\u1EB1ng <code>&#64;Directive({ selector: '[appHighlight]', host: { \u2026 } })</code>: <code>host</code> nghe s\u1EF1 ki\u1EC7n (<code>'(mouseenter)'</code>) v\xE0 bind thu\u1ED9c t\xEDnh/style (<code>'[style.backgroundColor]'</code>) l\xEAn ch\xEDnh ph\u1EA7n t\u1EED \u0111\xF3.</p>
<p><b>Y\xEAu c\u1EA7u:</b> r\xEA chu\u1ED9t v\xE0o <code>.target</code> th\xEC n\u1EC1n th\xE0nh m\xE0u \u0111\u01B0\u1EE3c truy\u1EC1n qua <code>[appHighlight]</code>, r\u1EDDi chu\u1ED9t th\xEC tr\u1EA3 l\u1EA1i nh\u01B0 c\u0169.</p>`,starter:`@Directive({
  selector: '[appHighlight]',
  // TODO: host l\u1EAFng nghe mouseenter/mouseleave v\xE0 bind style.backgroundColor
})
class Highlight {
  color = input('rgb(254, 240, 138)', { alias: 'appHighlight' });
  active = signal(false);
}

@Component({
  selector: 'app-root',
  imports: [Highlight],
  template: '<p class="target" [appHighlight]="\\'rgb(187, 247, 208)\\'">R\xEA chu\u1ED9t v\xE0o \u0111\xE2y</p>',
})
class Root {}

mount(Root);
`,solution:`@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
    '[style.backgroundColor]': 'active() ? color() : null',
  },
})
class Highlight {
  color = input('rgb(254, 240, 138)', { alias: 'appHighlight' });
  active = signal(false);
}

@Component({
  selector: 'app-root',
  imports: [Highlight],
  template: '<p class="target" [appHighlight]="\\'rgb(187, 247, 208)\\'">R\xEA chu\u1ED9t v\xE0o \u0111\xE2y</p>',
})
class Root {}

mount(Root);
`,hint:`host: { '(mouseenter)': 'active.set(true)', '(mouseleave)': 'active.set(false)', '[style.backgroundColor]': 'active() ? color() : null' }`,explain:`Dùng host trong metadata thay cho @HostListener/@HostBinding kiểu cũ. alias cho phép input trùng tên selector, nhờ vậy viết được [appHighlight]="màu". Directive cũng phải có trong imports của component dùng nó.`,simulate(t){t.at(100,()=>t.hover(`.target`)),t.at(200,()=>t.dom(e=>e.setAttribute(`data-hover`,e.querySelector(`.target`)?.style.backgroundColor??``))),t.at(300,()=>t.hover(`.target`,!0))},check(t){let e=t.root()?.getAttribute(`data-hover`);if(e!==`rgb(187, 247, 208)`)return s(`Rê chuột vào nhưng nền đang là "`+(e||`không đổi`)+`", cần rgb(187, 247, 208).`);let o=t.query(`.target`)[0]?.style.backgroundColor;return o?s(`Rời chuột nhưng nền vẫn là `+o+`.`):i()}}],cheatsheet:[[`Hiện/gỡ theo điều kiện`,`<code>@if (x) { … } @else { … }</code>`],[`Dữ liệu có thể null (đang tải)`,`<code>@if (user(); as u) { … } @else { Đang tải… }</code>`],[`Danh sách`,`<code>@for (it of list(); track it.id) { … }</code>`],[`Danh sách rỗng`,`<code>@empty { … }</code> ngay sau <code>@for</code>`],[`Nhiều trạng thái`,`<code>@switch (status()) { @case ('ok') { … } @default { … } }</code>`],[`Ẩn mà vẫn giữ state`,`<code>[hidden]="!show()"</code> thay vì <code>@if</code>`],[`Gắn hành vi vào phần tử`,`<code>&#64;Directive({ selector: '[appX]', host: { … } })</code>`]]};export{r as LAB};