import{a as s,n as g,r as i$1}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var i=`@Component({
  selector: 'app-toast',
  template: '<div class="toast">{{ message() }} <button (click)="closed.emit()">\xD7</button></div>',
})
class Toast {
  message = input('\u0110\xE3 l\u01B0u');
  closed = output();
  constructor() {
    inject(DestroyRef).onDestroy(() => log('Toast hu\u1EF7'));
  }
}
`;var r={title:`Component động`,subtitle:`bài luyện tạo component lúc chạy: ViewContainerRef, setInput, destroy/clear, nghe output, *ngComponentOutlet, inputBinding.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>T\u1EA1o component l\xFAc ch\u1EA1y: l\u1EA5y m\u1ED9t ch\u1ED7 \u0111\u1EB7t (<code>ViewContainerRef</code>), g\u1ECDi <code>createComponent(Type)</code>, truy\u1EC1n input b\u1EB1ng <code>setInput</code>, hu\u1EF7 b\u1EB1ng <code>destroy()</code>. Ho\u1EB7c d\xF9ng <code>*ngComponentOutlet</code> ngay trong template.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>ViewContainerRef</code>, <code>NgComponentOutlet</code>, <code>inputBinding</code>, <code>outputBinding</code>, <code>createComponent</code>.</div>`,starter:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', 'Th\xF4ng b\xE1o #' + ++this.n);
    ref.instance.closed.subscribe(() => ref.destroy());
  }
}

mount(App);
`},{id:`vcr`,group:`Tạo component`,title:`Chỗ đặt component: read: ViewContainerRef`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>Component \u0111\u1ED9ng c\u1EA7n m\u1ED9t <b>ch\u1ED7 \u0111\u1EB7t</b> trong view: m\u1ED9t <code>ViewContainerRef</code>. C\xE1ch th\u01B0\u1EDDng d\xF9ng l\xE0 \u0111\u1EB7t <code>&lt;ng-container #host /&gt;</code> r\u1ED3i truy v\u1EA5n v\u1EDBi <code>{ read: ViewContainerRef }</code>. Kh\xF4ng c\xF3 <code>read</code>, <code>viewChild('host')</code> tr\u1EA3 v\u1EC1 <code>ElementRef</code>, kh\xF4ng c\xF3 h\xE0m <code>createComponent</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm th\xF4ng b\xE1o</b> hai l\u1EA7n; ph\u1EA3i c\xF3 2 <code>.toast</code> v\xE0 kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host');

  add() {
    this.host().createComponent(Toast);
  }
}

mount(App);
`,solution:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });

  add() {
    this.host().createComponent(Toast);
  }
}

mount(App);
`,hint:`Đổi thành host = viewChild('host', { read: ViewContainerRef }).`,explain:`Component động được chèn ngay sau <ng-container #host />, theo thứ tự tạo. Cũng có thể inject(ViewContainerRef) trong component để chèn ngay sau chính phần tử host của nó.`,simulate(t){t.at(200,()=>t.click(`Thêm thông báo`)),t.at(300,()=>t.click(`Thêm thông báo`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());let e=t.query(`.toast`).length;return e===2?i$1():s(`Có `+e+` thông báo, cần 2.`)}},{id:`set-input`,group:`Tạo component`,title:`Truyền input: setInput()`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>V\u1EDBi component t\u1EA1o \u0111\u1ED9ng, kh\xF4ng c\xF3 template n\xE0o vi\u1EBFt <code>[message]="\u2026"</code>, n\xEAn ph\u1EA3i truy\u1EC1n input b\u1EB1ng <code>ref.setInput('message', gi\xE1Tr\u1ECB)</code>. G\xE1n th\u1EB3ng <code>ref.instance.message = \u2026</code> l\xE0 sai: v\u1EDBi signal input, l\u1EC7nh \u0111\xF3 <b>thay m\u1EA5t</b> signal b\u1EB1ng m\u1ED9t chu\u1ED7i, template g\u1ECDi <code>message()</code> s\u1EBD l\u1ED7i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>Th\xEAm th\xF4ng b\xE1o</b> hai l\u1EA7n; hai th\xF4ng b\xE1o hi\u1EC7n <code>\u0110\xE3 l\u01B0u #1</code> v\xE0 <code>\u0110\xE3 l\u01B0u #2</code>, kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.instance.message = '\u0110\xE3 l\u01B0u #' + ++this.n;
  }
}

mount(App);
`,solution:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', '\u0110\xE3 l\u01B0u #' + ++this.n);
  }
}

mount(App);
`,hint:`Thay dòng gán bằng ref.setInput('message', 'Đã lưu #' + ++this.n).`,explain:`setInput dùng tên public của input (alias nếu có), đánh dấu component cần vẽ lại và chạy transform của input. Nó hoạt động như nhau với input kiểu signal lẫn @Input() cũ.`,simulate(t){t.at(200,()=>t.click(`Thêm thông báo`)),t.at(300,()=>t.click(`Thêm thông báo`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. Gán thẳng vào instance đã thay mất signal input.`);let e=t.query(`.toast`).map(o=>g(o.textContent).replace(` ×`,``));return e.join(`|`)===`Đã lưu #1|Đã lưu #2`?i$1():s(`Thông báo đang là `+JSON.stringify(e)+`.`)}},{id:`destroy`,group:`Vòng đời`,title:`Dọn component động: destroy() / clear()`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>Component t\u1EA1o b\u1EB1ng <code>createComponent</code> s\u1ED1ng t\u1EDBi khi b\u1ECB hu\u1EF7. B\u1ECF tham chi\u1EBFu t\u1EDBi <code>ComponentRef</code> <b>kh\xF4ng</b> xo\xE1 n\xF3: component v\u1EABn n\u1EB1m trong DOM v\xE0 subscription b\xEAn trong v\u1EABn ch\u1EA1y. Ph\u1EA3i g\u1ECDi <code>ref.destroy()</code>, ho\u1EB7c <code>viewContainerRef.clear()</code> \u0111\u1EC3 hu\u1EF7 m\u1ECDi view trong ch\u1ED7 \u0111\u1EB7t.</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\xEAm 2 th\xF4ng b\xE1o r\u1ED3i b\u1EA5m <b>Xo\xE1 h\u1EBFt</b>: kh\xF4ng c\xF2n <code>.toast</code> n\xE0o v\xE0 log c\xF3 2 d\xF2ng <code>Toast hu\u1EF7</code>.</p>`,starter:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <button (click)="clearAll()">Xo\xE1 h\u1EBFt</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  refs = [];

  add() {
    this.refs.push(this.host().createComponent(Toast));
  }

  clearAll() {
    this.refs = []; // \u2757 ch\u1EC9 qu\xEAn tham chi\u1EBFu, component v\u1EABn c\xF2n
  }
}

mount(App);
`,solution:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <button (click)="clearAll()">Xo\xE1 h\u1EBFt</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });

  add() {
    this.host().createComponent(Toast);
  }

  clearAll() {
    this.host().clear();
  }
}

mount(App);
`,hint:`Trong clearAll(): this.host().clear(); hoặc this.refs.forEach(r => r.destroy()).`,explain:`Khi component cha bị huỷ, các view trong ViewContainerRef của nó cũng bị huỷ theo. Nhưng component tạo bằng createComponent() độc lập (gắn vào ApplicationRef) thì phải tự destroy.`,simulate(t){t.at(200,()=>t.click(`Thêm thông báo`)),t.at(300,()=>t.click(`Thêm thông báo`)),t.at(450,()=>t.click(`Xoá hết`))},check(t){let e=t.query(`.toast`).length,o=t.logs.filter(a=>a.includes(`Toast huỷ`)).length;return e?s(`Sau khi Xoá hết vẫn còn `+e+` thông báo.`):o===2?i$1():s(`Có `+o+` dòng "Toast huỷ", cần 2: các component phải được destroy.`)}},{id:`output`,group:`Vòng đời`,title:`Nghe output của component động`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>Output c\u1EE7a component \u0111\u1ED9ng kh\xF4ng g\u1EAFn \u0111\u01B0\u1EE3c b\u1EB1ng <code>(closed)="\u2026"</code> trong template. Thay v\xE0o \u0111\xF3, subscribe tr\xEAn instance: <code>ref.instance.closed.subscribe(() =&gt; \u2026)</code>. Subscription n\xE0y t\u1EF1 k\u1EBFt th\xFAc khi component b\u1ECB hu\u1EF7.</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\xEAm 2 th\xF4ng b\xE1o, r\u1ED3i b\u1EA5m n\xFAt <b>\xD7</b> c\u1EE7a th\xF4ng b\xE1o \u0111\u1EA7u: ch\u1EC9 c\xF2n l\u1EA1i <code>Th\xF4ng b\xE1o #2</code>.</p>`,starter:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', 'Th\xF4ng b\xE1o #' + ++this.n);
    // TODO: khi Toast ph\xE1t closed th\xEC hu\u1EF7 n\xF3
  }
}

mount(App);
`,solution:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Th\xEAm th\xF4ng b\xE1o</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', 'Th\xF4ng b\xE1o #' + ++this.n);
    ref.instance.closed.subscribe(() => ref.destroy());
  }
}

mount(App);
`,hint:`Thêm ref.instance.closed.subscribe(() => ref.destroy()); sau setInput.`,explain:`Với API mới, có thể truyền ngay lúc tạo: createComponent(Toast, { bindings: [outputBinding("closed", () => ...)] }).`,simulate(t){t.at(200,()=>t.click(`Thêm thông báo`)),t.at(300,()=>t.click(`Thêm thông báo`)),t.at(450,()=>t.click(`×`))},check(t){let e=t.query(`.toast`).map(o=>g(o.textContent).replace(` ×`,``));return e.length===2?s(`Bấm × nhưng thông báo không mất: chưa có ai nghe output closed.`):e.join(`|`)===`Thông báo #2`?i$1():s(`Còn lại `+JSON.stringify(e)+`, cần chỉ "Thông báo #2".`)}},{id:`outlet`,group:`Trong template`,title:`Chọn component theo dữ liệu: *ngComponentOutlet`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>Khi component c\u1EA7n hi\u1EC3n th\u1ECB l\u1EA5y t\u1EEB d\u1EEF li\u1EC7u (c\u1EA5u h\xECnh dashboard, lo\u1EA1i block trong CMS), vi\u1EBFt <code>@switch</code> cho t\u1EEBng lo\u1EA1i th\xEC m\u1ED7i l\u1EA7n th\xEAm lo\u1EA1i m\u1EDBi l\u1EA1i ph\u1EA3i s\u1EEDa template. <code>*ngComponentOutlet</code> nh\u1EADn th\u1EB3ng class component, k\xE8m <code>inputs</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> d\xF9ng <code>ngComponentOutlet</code> \u0111\u1EC3 v\u1EBD widget theo <code>WIDGETS[kind()]</code>, truy\u1EC1n input <code>title</code>. Khi ki\u1EC3m tra, trang b\u1EA5m <b>Tin t\u1EE9c</b>; ph\u1EA3i hi\u1EC7n <code>.news</code> v\u1EDBi ti\xEAu \u0111\u1EC1 <code>B\u1EA3ng tin</code>.</p>`,starter:`@Component({ selector: 'app-weather', template: '<div class="weather">\u2600\uFE0F {{ title() }}: 31\xB0C</div>' })
class Weather { title = input(''); }

@Component({ selector: 'app-news', template: '<div class="news">\u{1F4F0} {{ title() }}: 3 tin m\u1EDBi</div>' })
class News { title = input(''); }

const WIDGETS = { weather: Weather, news: News };

@Component({
  selector: 'app-root',
  imports: [Weather],
  template: \`
    <button (click)="kind.set('weather')">Th\u1EDDi ti\u1EBFt</button>
    <button (click)="kind.set('news')">Tin t\u1EE9c</button>
    <!-- \u2757 ch\u1EC9 bi\u1EBFt v\u1EBD Weather; th\xEAm lo\u1EA1i m\u1EDBi l\u1EA1i ph\u1EA3i s\u1EEDa template -->
    @if (kind() === 'weather') {
      <app-weather [title]="title()" />
    }
  \`,
})
class App {
  kind = signal('weather');
  title = signal('B\u1EA3ng tin');
}

mount(App);
`,solution:`@Component({ selector: 'app-weather', template: '<div class="weather">\u2600\uFE0F {{ title() }}: 31\xB0C</div>' })
class Weather { title = input(''); }

@Component({ selector: 'app-news', template: '<div class="news">\u{1F4F0} {{ title() }}: 3 tin m\u1EDBi</div>' })
class News { title = input(''); }

const WIDGETS = { weather: Weather, news: News };

@Component({
  selector: 'app-root',
  imports: [NgComponentOutlet],
  template: \`
    <button (click)="kind.set('weather')">Th\u1EDDi ti\u1EBFt</button>
    <button (click)="kind.set('news')">Tin t\u1EE9c</button>
    <ng-container *ngComponentOutlet="widget(); inputs: { title: title() }" />
  \`,
})
class App {
  kind = signal('weather');
  title = signal('B\u1EA3ng tin');
  widget = computed(() => WIDGETS[this.kind()]);
}

mount(App);
`,hint:`imports: [NgComponentOutlet]; widget = computed(() => WIDGETS[this.kind()]); trong template: <ng-container *ngComponentOutlet="widget(); inputs: { title: title() }" />.`,explain:`Khi class đổi, NgComponentOutlet huỷ component cũ và tạo component mới. Kết hợp với import() động để chỉ tải code của widget khi cần.`,simulate(t){t.at(250,()=>t.click(`Tin tức`))},check(t,e){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());if(!/ngComponentOutlet/.test(e))return s(`Hãy dùng *ngComponentOutlet để vẽ widget theo WIDGETS[kind()].`);let o=g(t.text(`.news`));return o?t.query(`.weather`).length?s(`Widget thời tiết vẫn còn sau khi chuyển sang tin tức.`):o.includes(`Bảng tin`)?i$1():s(`Widget tin tức chưa nhận input title (đang hiện "`+o+`").`):s(`Bấm Tin tức nhưng không thấy widget .news.`)}},{id:`input-binding`,group:`Trong template`,title:`Input tự cập nhật: inputBinding()`,level:`Khó`,lv:3,waitMs:900,desc:`<p><code>setInput</code> ch\u1EC9 \u0111\u1EB7t gi\xE1 tr\u1ECB <b>m\u1ED9t l\u1EA7n</b>; signal \u1EDF cha \u0111\u1ED5i sau \u0111\xF3 th\xEC component \u0111\u1ED9ng kh\xF4ng bi\u1EBFt. T\u1EEB Angular 20, truy\u1EC1n <code>bindings</code> khi t\u1EA1o: <code>createComponent(Toast, { bindings: [inputBinding('message', this.status)] })</code>. Input s\u1EBD \u0111i theo signal nh\u01B0 m\u1ED9t binding <code>[message]</code> trong template.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>T\u1EA3i l\xEAn</b> t\u1EA1o m\u1ED9t th\xF4ng b\xE1o hi\u1EC7n tr\u1EA1ng th\xE1i hi\u1EC7n t\u1EA1i; khi <code>status</code> \u0111\u1ED5i th\xE0nh <code>Ho\xE0n t\u1EA5t \u2713</code>, th\xF4ng b\xE1o \u0111ang c\xF3 ph\u1EA3i hi\u1EC7n <code>Ho\xE0n t\u1EA5t \u2713</code>.</p>`,starter:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="upload()">T\u1EA3i l\xEAn</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  status = signal('\u0110ang t\u1EA3i l\xEAn\u2026');

  upload() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', this.status()); // \u2757 ch\u1EC9 \u0111\u1EB7t m\u1ED9t l\u1EA7n
    setTimeout(() => this.status.set('Ho\xE0n t\u1EA5t \u2713'), 300);
  }
}

mount(App);
`,solution:i+`
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="upload()">T\u1EA3i l\xEAn</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  status = signal('\u0110ang t\u1EA3i l\xEAn\u2026');

  upload() {
    this.host().createComponent(Toast, {
      bindings: [inputBinding('message', this.status)],
    });
    setTimeout(() => this.status.set('Ho\xE0n t\u1EA5t \u2713'), 300);
  }
}

mount(App);
`,hint:`createComponent(Toast, { bindings: [inputBinding('message', this.status)] }) và bỏ dòng setInput.`,explain:`inputBinding nhận signal hoặc hàm không tham số. Cùng chỗ đó có outputBinding('closed', fn) và twoWayBinding('value', signal) cho model().`,simulate(t){t.at(200,()=>t.click(`Tải lên`)),t.at(320,()=>t.dom(e=>e.setAttribute(`data-t1`,g(e.querySelector(`.toast`)?.textContent).replace(` ×`,``))))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());let e=t.root()?.getAttribute(`data-t1`)??``;if(e!==`Đang tải lên…`)return s(`Lúc vừa tạo, thông báo cần hiện "Đang tải lên…" (đang là "`+e+`").`);let o=t.query(`.toast`).map(a=>g(a.textContent).replace(` ×`,``));return o.join(`|`)===`Hoàn tất ✓`?i$1():s(`Sau khi status đổi, thông báo đang hiện `+JSON.stringify(o)+`: setInput chỉ đặt giá trị một lần.`)}}],extras:()=>import(`./chunk-ClJj8OMc.js`).then(t=>t.dynamicExtras()),cheatsheet:[[`Chỗ đặt`,`<code>&lt;ng-container #host /&gt;</code> + <code>viewChild('host', { read: ViewContainerRef })</code>`],[`Tạo`,`<code>const ref = host().createComponent(Toast)</code>`],[`Input`,`<code>ref.setInput('message', v)</code>, không gán vào instance`],[`Output`,`<code>ref.instance.closed.subscribe(…)</code>`],[`Huỷ`,`<code>ref.destroy()</code> hoặc <code>host().clear()</code>`],[`Theo dữ liệu`,`<code>*ngComponentOutlet="type; inputs: {…}"</code>`],[`Input theo signal`,`<code>{ bindings: [inputBinding('message', sig)] }</code>`]]};export{r as LAB};