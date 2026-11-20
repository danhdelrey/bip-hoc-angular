import{a as s$1,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var l=(t,e)=>t.filter(n=>n.startsWith(e)).length;var s={title:`Hiệu năng render`,subtitle:`bài luyện đếm và giảm việc vẽ lại: track theo id, computed thay cho method, bỏ Eager để dùng OnPush, debounce khi gõ, virtual scroll cho danh sách dài.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>\u0110o tr\u01B0\u1EDBc, t\u1ED1i \u01B0u sau. Trong lab, c\xE1ch \u0111o \u0111\u01A1n gi\u1EA3n l\xE0 \u0111\u1EBFm: th\xEAm <code>log()</code> v\xE0o h\xE0m hay template \u0111\u1EC3 th\u1EA5y n\xF3 ch\u1EA1y bao nhi\xEAu l\u1EA7n khi b\u1EA1n thao t\xE1c. Ngo\xE0i \u0111\u1EDDi, d\xF9ng tab Profiler c\u1EE7a Angular DevTools.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>ChangeDetectionStrategy</code>, <code>CdkVirtualScrollViewport</code>, <code>CdkFixedSizeVirtualScroll</code>, <code>CdkVirtualForOf</code> (virtual scroll c\u1EE7a Angular CDK).</div>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="G\xF5 th\u1EED v\xE0o \u0111\xE2y" (input)="note.set($any($event.target).value)" />
    <p>{{ heavy() }}</p>
  \`,
})
class App {
  note = signal('');
  heavy() {
    log('heavy() ch\u1EA1y');
    return 'K\u1EBFt qu\u1EA3 t\xEDnh to\xE1n';
  }
}

mount(App);
`},{id:`track`,group:`Danh sách`,title:`Tải lại danh sách mà không vẽ lại DOM: track theo id`,level:`Dễ`,lv:1,waitMs:900,desc:`<p>API tr\u1EA3 v\u1EC1 danh s\xE1ch m\u1EDBi th\xEC m\u1ED7i ph\u1EA7n t\u1EED l\xE0 m\u1ED9t object <b>m\u1EDBi</b>, d\xF9 id v\xE0 n\u1ED9i dung y nh\u01B0 c\u0169. <code>track row</code> so theo object n\xEAn Angular coi m\u1ECDi d\xF2ng l\xE0 d\xF2ng m\u1EDBi: xo\xE1 h\u1EBFt DOM c\u0169, t\u1EA1o l\u1EA1i t\u1EEB \u0111\u1EA7u (m\u1EA5t c\u1EA3 focus, tr\u1EA1ng th\xE1i cu\u1ED9n, animation). <code>track row.id</code> cho Angular nh\u1EADn ra d\xF2ng c\u0169 v\xE0 gi\u1EEF nguy\xEAn node DOM.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>T\u1EA3i l\u1EA1i</b>: c\u1EA3 3 d\xF2ng ph\u1EA3i \u0111\u01B0\u1EE3c <b>d\xF9ng l\u1EA1i</b> (kh\xF4ng node <code>.row</code> n\xE0o b\u1ECB t\u1EA1o m\u1EDBi).</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <button (click)="reload()">T\u1EA3i l\u1EA1i</button>
    <ul>
      @for (row of rows(); track row) {
        <li class="row">{{ row.name }}</li>
      }
    </ul>
  \`,
})
class App {
  rows = signal(this.fromApi());

  // gi\u1EA3 l\u1EADp API: m\u1ED7i l\u1EA7n tr\u1EA3 v\u1EC1 object m\u1EDBi, c\xF9ng id v\xE0 n\u1ED9i dung
  fromApi() {
    return [{ id: 1, name: 'An' }, { id: 2, name: 'B\xECnh' }, { id: 3, name: 'Chi' }];
  }
  reload() {
    this.rows.set(this.fromApi());
  }
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <button (click)="reload()">T\u1EA3i l\u1EA1i</button>
    <ul>
      @for (row of rows(); track row.id) {
        <li class="row">{{ row.name }}</li>
      }
    </ul>
  \`,
})
class App {
  rows = signal(this.fromApi());

  fromApi() {
    return [{ id: 1, name: 'An' }, { id: 2, name: 'B\xECnh' }, { id: 3, name: 'Chi' }];
  }
  reload() {
    this.rows.set(this.fromApi());
  }
}

mount(App);
`,hint:`Đổi track row thành track row.id.`,explain:`track $index cũng giữ được DOM ở đây, nhưng sai khi chèn/xoá/sắp xếp: dòng thứ i luôn được coi là "cùng một dòng" dù dữ liệu đã khác. Id ổn định từ dữ liệu là lựa chọn đúng.`,simulate(t){t.at(250,()=>t.dom(e=>e.querySelectorAll(`.row`).forEach(n=>n.setAttribute(`data-cu`,`1`)))),t.at(300,()=>t.click(`Tải lại`))},check(t){let e=t.query(`.row`);if(e.length!==3)return s$1(`Cần 3 dòng sau khi tải lại.`);let n=e.filter(r=>r.getAttribute(`data-cu`)===`1`).length;return n===3?i():s$1(3-n+`/3 dòng bị xoá và tạo lại sau khi tải: track đang so theo object.`)}},{id:`ham-template`,group:`Template`,title:`Gọi hàm tính toán trong template`,level:`Dễ`,lv:1,waitMs:800,desc:`<p>H\xE0m g\u1ECDi trong template (<code>{{ filtered().length }}</code> khi <code>filtered</code> l\xE0 method) ch\u1EA1y l\u1EA1i \u1EDF <b>m\u1ED7i l\u1EA7n</b> component \u0111\u01B0\u1EE3c v\u1EBD l\u1EA1i, k\u1EC3 c\u1EA3 khi th\u1EE9 thay \u0111\u1ED5i ch\u1EB3ng li\xEAn quan g\xEC t\u1EDBi n\xF3 (v\xED d\u1EE5 g\xF5 v\xE0o \xF4 ghi ch\xFA). <code>computed()</code> nh\u1EDB k\u1EBFt qu\u1EA3 v\xE0 ch\u1EC9 t\xEDnh l\u1EA1i khi signal n\xF3 \u0111\u1ECDc thay \u0111\u1ED5i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> g\xF5 4 k\xFD t\u1EF1 v\xE0o \xF4 <b>Ghi ch\xFA</b>: h\xE0m l\u1ECDc ch\u1EC9 \u0111\u01B0\u1EE3c ch\u1EA1y l\u1EA7n \u0111\u1EA7u (log <code>L\u1ECDc danh s\xE1ch</code> kh\xF4ng qu\xE1 1 l\u1EA7n).</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Ghi ch\xFA" (input)="note.set($any($event.target).value)" />
    <p class="count">{{ filtered().length }} s\u1EA3n ph\u1EA9m c\xF2n h\xE0ng</p>
  \`,
})
class App {
  products = signal(Array.from({ length: 200 }, (_, i) => ({ id: i, stock: i % 3 })));
  note = signal('');

  filtered() {
    log('L\u1ECDc danh s\xE1ch');
    return this.products().filter((p) => p.stock > 0);
  }
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Ghi ch\xFA" (input)="note.set($any($event.target).value)" />
    <p class="count">{{ filtered().length }} s\u1EA3n ph\u1EA9m c\xF2n h\xE0ng</p>
  \`,
})
class App {
  products = signal(Array.from({ length: 200 }, (_, i) => ({ id: i, stock: i % 3 })));
  note = signal('');

  filtered = computed(() => {
    log('L\u1ECDc danh s\xE1ch');
    return this.products().filter((p) => p.stock > 0);
  });
}

mount(App);
`,hint:`Đổi method filtered() thành filtered = computed(() => { … }). Template giữ nguyên filtered().`,explain:`Gọi signal hay computed trong template thì rẻ (chỉ đọc giá trị đã có). Thứ đắt là method tự tính toán. Pipe pure cũng cho hiệu quả tương tự khi biến đổi một giá trị đầu vào.`,simulate(t){[`a`,`ab`,`abc`,`abcd`].forEach((e,n)=>t.at(200+n*80,()=>t.type(0,e)))},check(t){let e=l(t.logs,`Lọc danh sách`);return g(t.text(`.count`))!==`133 sản phẩm còn hàng`?s$1(`Kết quả lọc phải là 133 sản phẩm còn hàng.`):e<=1?i():s$1(`Hàm lọc chạy `+e+` lần dù danh sách không đổi: method trong template chạy lại mỗi lần component được vẽ.`)}},{id:`onpush`,group:`Template`,title:`Component con bị vẽ lại theo cha: bỏ Eager`,level:`Trung bình`,lv:2,waitMs:800,desc:`<p>T\u1EEB Angular 22, component m\u1EB7c \u0111\u1ECBnh l\xE0 <b>OnPush</b>: ch\u1EC9 \u0111\u01B0\u1EE3c ki\u1EC3m tra l\u1EA1i khi input \u0111\u1ED5i, c\xF3 s\u1EF1 ki\u1EC7n b\xEAn trong n\xF3, ho\u1EB7c signal n\xF3 \u0111\u1ECDc thay \u0111\u1ED5i. Chi\u1EBFn l\u01B0\u1EE3c c\u0169 nay t\xEAn l\xE0 <code>ChangeDetectionStrategy.Eager</code> (t\xEAn c\u0169 <code>Default</code>): component b\u1ECB ki\u1EC3m tra <b>m\u1ED7i l\u1EA7n</b> component cha \u0111\u01B0\u1EE3c ki\u1EC3m tra. Code c\u0169 th\u01B0\u1EDDng c\xF2n khai b\xE1o <code>Eager</code>/<code>Default</code> \u0111\u1EC3 gi\u1EEF h\xE0nh vi tr\u01B0\u1EDBc \u0111\xE2y; v\u1EDBi component \u0111\xE3 d\xF9ng input signal th\xEC c\xF3 th\u1EC3 b\u1ECF.</p>
<p><b>Y\xEAu c\u1EA7u:</b> g\xF5 4 k\xFD t\u1EF1 v\xE0o \xF4 t\xECm ki\u1EBFm c\u1EE7a trang: bi\u1EC3u \u0111\u1ED3 (<code>Chart</code>) ch\u1EC9 \u0111\u01B0\u1EE3c v\u1EBD l\u1EA7n \u0111\u1EA7u (log <code>V\u1EBD bi\u1EC3u \u0111\u1ED3</code> kh\xF4ng qu\xE1 1 l\u1EA7n), v\xE0 v\u1EABn hi\u1EC7n \u0111\xFAng d\u1EEF li\u1EC7u.</p>`,starter:`@Component({
  selector: 'app-chart',
  changeDetection: ChangeDetectionStrategy.Eager, // gi\u1EEF l\u1EA1i t\u1EEB code c\u0169
  template: '<div class="chart">\u{1F4CA} {{ draw() }}</div>',
})
class Chart {
  data = input([]);
  draw() {
    log('V\u1EBD bi\u1EC3u \u0111\u1ED3');
    return this.data().join(' \xB7 ');
  }
}

@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <input placeholder="T\xECm ki\u1EBFm" (input)="q.set($any($event.target).value)" />
    <app-chart [data]="sales()" />
  \`,
})
class App {
  q = signal('');
  sales = signal([12, 19, 7]);
}

mount(App);
`,solution:`@Component({
  selector: 'app-chart',
  // kh\xF4ng khai b\xE1o changeDetection: OnPush l\xE0 m\u1EB7c \u0111\u1ECBnh t\u1EEB Angular 22
  template: '<div class="chart">\u{1F4CA} {{ draw() }}</div>',
})
class Chart {
  data = input([]);
  draw() {
    log('V\u1EBD bi\u1EC3u \u0111\u1ED3');
    return this.data().join(' \xB7 ');
  }
}

@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <input placeholder="T\xECm ki\u1EBFm" (input)="q.set($any($event.target).value)" />
    <app-chart [data]="sales()" />
  \`,
})
class App {
  q = signal('');
  sales = signal([12, 19, 7]);
}

mount(App);
`,hint:`Bỏ dòng changeDetection: ChangeDetectionStrategy.Eager khỏi Chart (hoặc đổi thành ChangeDetectionStrategy.OnPush).`,explain:`Trước khi bỏ Eager, kiểm tra component không dựa vào việc tự được vẽ lại khi dữ liệu bị sửa tại chỗ (mutate object, gán biến thường trong setTimeout…): với OnPush, những thay đổi đó không hiện lên. Đổi draw() thành computed cũng giảm chi phí, nhưng OnPush mới là thứ bỏ qua cả component.`,simulate(t){[`a`,`ab`,`abc`,`abcd`].forEach((e,n)=>t.at(200+n*80,()=>t.type(0,e)))},check(t){let e=l(t.logs,`Vẽ biểu đồ`);return g(t.text(`.chart`))!==`📊 12 · 19 · 7`?s$1(`Biểu đồ cần hiện đúng dữ liệu 12 · 19 · 7.`):e<=1?i():s$1(`Chart được vẽ `+e+` lần dù dữ liệu không đổi: Chart dùng Eager nên bị kiểm tra theo mỗi lần cha được vẽ.`)}},{id:`debounce`,group:`Nhập liệu`,title:`Lọc khi người dùng ngừng gõ: debounce`,level:`Trung bình`,lv:2,waitMs:1200,desc:`<p>L\u1ECDc danh s\xE1ch l\u1EDBn ngay \u1EDF m\u1ED7i ph\xEDm g\xF5 th\xEC ng\u01B0\u1EDDi g\xF5 nhanh s\u1EBD th\u1EA5y \xF4 nh\u1EADp b\u1ECB gi\u1EADt: vi\u1EC7c l\u1ECDc ch\u1EA1y cho c\u1EA3 nh\u1EEFng t\u1EEB kho\xE1 ch\u01B0a g\xF5 xong. H\xE3y ch\u1EC9 l\u1ECDc khi ng\u01B0\u1EDDi d\xF9ng <b>ng\u1EEBng g\xF5</b> m\u1ED9t ch\xFAt: <code>toSignal(toObservable(query).pipe(debounceTime(300)))</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> g\xF5 <code>\xE1o</code> r\u1ED3i <code>\xE1o m</code>, <code>\xE1o m\u01B0</code>, <code>\xE1o m\u01B0a</code> c\xE1ch nhau 60ms. Vi\u1EC7c l\u1ECDc (log <code>L\u1ECDc theo</code>) ch\u1EC9 ch\u1EA1y t\u1ED1i \u0111a 2 l\u1EA7n (gi\xE1 tr\u1ECB ban \u0111\u1EA7u v\xE0 t\u1EEB kho\xE1 cu\u1ED1i), v\xE0 k\u1EBFt qu\u1EA3 cu\u1ED1i \u0111\xFAng cho <code>\xE1o m\u01B0a</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="T\xECm s\u1EA3n ph\u1EA9m" (input)="query.set($any($event.target).value)" />
    <p class="result">{{ results().length }} k\u1EBFt qu\u1EA3</p>
  \`,
})
class App {
  products = ['\xE1o m\u01B0a', '\xE1o m\u01B0a tr\u1EBB em', '\xE1o kho\xE1c', '\xF4 g\u1EA5p', '\u1EE7ng'];
  query = signal('');

  results = computed(() => {
    const q = this.query(); // \u2757 l\u1ECDc l\u1EA1i \u1EDF m\u1ED7i ph\xEDm g\xF5
    log('L\u1ECDc theo "' + q + '"');
    return this.products.filter((p) => p.includes(q));
  });
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="T\xECm s\u1EA3n ph\u1EA9m" (input)="query.set($any($event.target).value)" />
    <p class="result">{{ results().length }} k\u1EBFt qu\u1EA3</p>
  \`,
})
class App {
  products = ['\xE1o m\u01B0a', '\xE1o m\u01B0a tr\u1EBB em', '\xE1o kho\xE1c', '\xF4 g\u1EA5p', '\u1EE7ng'];
  query = signal('');
  debouncedQuery = toSignal(toObservable(this.query).pipe(debounceTime(300)), { initialValue: '' });

  results = computed(() => {
    const q = this.debouncedQuery();
    log('L\u1ECDc theo "' + q + '"');
    return this.products.filter((p) => p.includes(q));
  });
}

mount(App);
`,hint:`debouncedQuery = toSignal(toObservable(this.query).pipe(debounceTime(300)), { initialValue: '' }); rồi results đọc this.debouncedQuery() thay cho this.query().`,explain:`Ô nhập vẫn hiện từng ký tự ngay vì nó gắn với query; chỉ phần tính toán nặng mới chờ. Với dữ liệu từ server, đây cũng là chỗ thêm switchMap để huỷ request cũ.`,simulate(t){[`áo`,`áo m`,`áo mư`,`áo mưa`].forEach((e,n)=>t.at(200+n*60,()=>t.type(0,e)))},check(t){if(t.errors.length)return s$1(`Có lỗi: `+t.errMsg());let e=l(t.logs,`Lọc theo`);return g(t.text(`.result`))!==`2 kết quả`?s$1(`Kết quả cuối cho "áo mưa" phải là 2 kết quả (đang: `+g(t.text(`.result`))+`).`):e<=2?i():s$1(`Việc lọc chạy `+e+` lần: đang lọc ở mỗi phím gõ.`)}},{id:`virtual-scroll`,group:`Danh sách`,title:`Hàng nghìn dòng: virtual scroll`,level:`Khó`,lv:3,waitMs:1200,desc:`<p>V\u1EBD 5.000 d\xF2ng l\xE0 5.000 node DOM: trang t\u1EA3i ch\u1EADm, cu\u1ED9n gi\u1EADt, t\u1ED1n b\u1ED9 nh\u1EDB, d\xF9 ng\u01B0\u1EDDi d\xF9ng ch\u1EC9 nh\xECn th\u1EA5y kho\u1EA3ng 10 d\xF2ng. Virtual scroll c\u1EE7a Angular CDK ch\u1EC9 v\u1EBD nh\u1EEFng d\xF2ng \u0111ang n\u1EB1m trong khung nh\xECn (c\u1ED9ng m\u1ED9t \xEDt d\u1EF1 ph\xF2ng) v\xE0 thay n\u1ED9i dung khi cu\u1ED9n.</p>
<p><b>Y\xEAu c\u1EA7u:</b> d\xF9ng <code>&lt;cdk-virtual-scroll-viewport itemSize="32"&gt;</code> v\u1EDBi <code>*cdkVirtualFor</code>. S\u1ED1 <code>.row</code> trong DOM ph\u1EA3i d\u01B0\u1EDBi 100; khi ki\u1EC3m tra t\u1EF1 cu\u1ED9n xu\u1ED1ng cu\u1ED1i th\xEC ph\u1EA3i th\u1EA5y <code>D\xF2ng 5000</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <div class="list" style="height: 240px; overflow: auto">
      @for (n of rows; track n) {
        <div class="row" style="height: 32px">D\xF2ng {{ n }}</div>
      }
    </div>
  \`,
})
class App {
  rows = Array.from({ length: 5000 }, (_, i) => i + 1);
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf],
  template: \`
    <cdk-virtual-scroll-viewport class="list" itemSize="32" style="height: 240px; display: block">
      <div class="row" *cdkVirtualFor="let n of rows" style="height: 32px">D\xF2ng {{ n }}</div>
    </cdk-virtual-scroll-viewport>
  \`,
})
class App {
  rows = Array.from({ length: 5000 }, (_, i) => i + 1);
}

mount(App);
`,hint:`imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf]; thay khung bằng <cdk-virtual-scroll-viewport class="list" itemSize="32" style="height: 240px; display: block"> và mỗi dòng là <div class="row" *cdkVirtualFor="let n of rows">.`,explain:`itemSize phải đúng chiều cao thật của mỗi dòng. Dòng cao không đều thì cân nhắc phân trang, "tải thêm", hoặc @defer (on viewport) cho từng khối.`,simulate(t){t.at(300,()=>t.dom(e=>{e.setAttribute(`data-n`,String(e.querySelectorAll(`.row`).length));let n=e.querySelector(`.list`);n&&(n.scrollTop=n.scrollHeight)}))},check(t){if(t.errors.length)return s$1(`Có lỗi: `+t.errMsg());let e=Number(t.root()?.getAttribute(`data-n`)??0);return e?e>=100?s$1(`DOM đang có `+e+` dòng .row: mọi dòng đều được vẽ.`):t.query(`.row`).map(r=>g(r.textContent)).includes(`Dòng 5000`)?i():s$1(`Đã cuộn xuống cuối nhưng chưa thấy "Dòng 5000".`):s$1(`Không thấy dòng .row nào.`)}}],extras:()=>import(`./chunk-kyQkAJo9.js`).then(t=>t.perfExtras()),cheatsheet:[[`Danh sách`,`<code>@for (… ; track row.id)</code>`],[`Tính toán trong template`,`<code>computed()</code> thay cho method`],[`Component con`,`OnPush (mặc định từ Angular 22), bỏ <code>Eager</code> khi không cần`],[`Gõ nhanh`,`<code>toSignal(toObservable(q).pipe(debounceTime(300)))</code>`],[`Hàng nghìn dòng`,`<code>cdk-virtual-scroll-viewport</code> + <code>*cdkVirtualFor</code>`],[`Trước khi tối ưu`,`đo bằng Angular DevTools Profiler`]]};export{s as LAB};