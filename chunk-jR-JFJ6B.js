import{a as s,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var p={title:`SignalStore`,subtitle:`bài luyện quản lý state theo tính năng với @ngrx/signals: withMethods, cập nhật bất biến, withComputed, entities, withHooks, phạm vi của store.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>D\u1EF1ng m\u1ED9t store b\u1EB1ng <code>signalStore(withState(\u2026), withComputed(\u2026), withMethods(\u2026))</code>, provide n\xF3 r\u1ED3i <code>inject</code> trong component. M\u1ED7i kho\xE1 trong state th\xE0nh m\u1ED9t signal \u0111\u1ECDc \u0111\u01B0\u1EE3c: <code>store.items()</code>.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>signalStore</code>, <code>withState</code>, <code>withComputed</code>, <code>withMethods</code>, <code>withHooks</code>, <code>withProps</code>, <code>patchState</code>, <code>getState</code>, <code>withEntities</code>, <code>addEntity</code>, <code>updateEntity</code>, <code>removeEntity</code>, <code>setAllEntities</code>, <code>rxMethod</code>.</div>`,starter:`const CounterStore = signalStore(
  withState({ count: 0 }),
  withComputed((store) => ({ double: computed(() => store.count() * 2) })),
  withMethods((store) => ({
    inc() { patchState(store, (s) => ({ count: s.count + 1 })); },
  })),
);

@Component({
  selector: 'app-root',
  providers: [CounterStore],
  template: '<button (click)="store.inc()">+1</button> {{ store.count() }} \xD7 2 = {{ store.double() }}',
})
class App {
  store = inject(CounterStore);
}

mount(App);
`},{id:`with-methods`,group:`Cập nhật state`,title:`Logic cập nhật nằm trong store: withMethods`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>Component t\u1EF1 g\u1ECDi <code>patchState(this.store, \u2026)</code> th\xEC logic c\u1EADp nh\u1EADt state r\u1EA3i ra kh\u1EAFp n\u01A1i, m\u1ED7i ch\u1ED7 vi\u1EBFt m\u1ED9t ki\u1EC3u v\xE0 d\u1EC5 sai. \u0110\u1EB7t m\u1ECDi thay \u0111\u1ED5i state v\xE0o <code>withMethods</code>; component ch\u1EC9 g\u1ECDi <code>store.addItem(name)</code>. (M\u1EB7c \u0111\u1ECBnh state c\u1EE7a SignalStore l\xE0 protected: TypeScript b\xE1o l\u1ED7i khi g\u1ECDi <code>patchState</code> t\u1EEB b\xEAn ngo\xE0i store.)</p>
<p><b>Y\xEAu c\u1EA7u:</b> chuy\u1EC3n logic th\xEAm h\xE0ng v\xE0o method <code>addItem</code> c\u1EE7a store v\xE0 s\u1EEDa lu\xF4n l\u1ED7i: th\xEAm "\xC1o m\u01B0a" l\u1EA7n n\u1EEFa th\xEC <b>t\u0103ng s\u1ED1 l\u01B0\u1EE3ng</b> ch\u1EE9 kh\xF4ng t\u1EA1o d\xF2ng m\u1EDBi. Khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm \xC1o m\u01B0a</b> hai l\u1EA7n; gi\u1ECF c\xF3 \u0111\xFAng 1 d\xF2ng <code>\xC1o m\u01B0a \xD7 2</code>.</p>`,starter:`const CartStore = signalStore(
  withState({ items: [] }),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    <button (click)="add('\xC1o m\u01B0a')">Th\xEAm \xC1o m\u01B0a</button>
    @for (it of store.items(); track $index) { <p class="line">{{ it.name }} \xD7 {{ it.qty }}</p> }
  \`,
})
class App {
  store = inject(CartStore);

  // \u2757 logic c\u1EADp nh\u1EADt state n\u1EB1m trong component (v\xE0 c\xF2n sai: lu\xF4n th\xEAm d\xF2ng m\u1EDBi)
  add(name) {
    patchState(this.store, (s) => ({ items: [...s.items, { name, qty: 1 }] }));
  }
}

mount(App);
`,solution:`const CartStore = signalStore(
  withState({ items: [] }),
  withMethods((store) => ({
    addItem(name) {
      patchState(store, (s) => {
        const found = s.items.find((it) => it.name === name);
        return {
          items: found
            ? s.items.map((it) => (it === found ? { ...it, qty: it.qty + 1 } : it))
            : [...s.items, { name, qty: 1 }],
        };
      });
    },
  })),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    <button (click)="store.addItem('\xC1o m\u01B0a')">Th\xEAm \xC1o m\u01B0a</button>
    @for (it of store.items(); track it.name) { <p class="line">{{ it.name }} \xD7 {{ it.qty }}</p> }
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,hint:`Thêm withMethods((store) => ({ addItem(name) { patchState(store, (s) => …) } })) vào signalStore. Trong updater: nếu đã có dòng cùng tên thì map ra dòng mới với qty + 1, chưa có thì thêm { name, qty: 1 }. Nút gọi store.addItem('Áo mưa').`,explain:`Gom logic vào store giúp test được store riêng, và mọi component dùng chung một cách cập nhật. Muốn tắt bảo vệ thì truyền { protectedState: false } cho signalStore, nhưng hiếm khi nên làm.`,simulate(t){t.at(200,()=>t.click(`Thêm Áo mưa`)),t.at(300,()=>t.click(`Thêm Áo mưa`))},check(t,o){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());if(/patchState\s*\(\s*this\.store/.test(o))return s(`Component vẫn tự gọi patchState(this.store, …): đưa logic vào withMethods của store.`);if(!/withMethods\s*\(/.test(o))return s(`Store cần có withMethods với method addItem.`);let n=t.query(`.line`).map(c=>g(c.textContent));return n.join(`|`)===`Áo mưa × 2`?i():s(`Giỏ hàng đang là `+JSON.stringify(n)+`, cần đúng một dòng "Áo mưa × 2".`)}},{id:`bat-bien`,group:`Cập nhật state`,title:`Không sửa trực tiếp state`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p><code>patchState</code> ch\u1EC9 b\xE1o thay \u0111\u1ED5i khi gi\xE1 tr\u1ECB c\u1EE7a m\u1ED9t kho\xE1 l\xE0 <b>tham chi\u1EBFu m\u1EDBi</b> (so s\xE1nh b\u1EB1ng <code>!==</code>). <code>push</code> v\xE0o m\u1EA3ng c\u0169 r\u1ED3i \u0111\u01B0a l\u1EA1i \u0111\xFAng m\u1EA3ng \u0111\xF3 th\xEC v\u1EDBi SignalStore l\xE0 "kh\xF4ng c\xF3 g\xEC \u0111\u1ED5i": signal kh\xF4ng ph\xE1t, giao di\u1EC7n kh\xF4ng v\u1EBD l\u1EA1i.</p>
<p>L\u1ED7i n\xE0y hay b\u1ECB che: click l\xE0m component v\u1EBD l\u1EA1i n\xEAn ch\u1ED7 n\xE0o \u0111\u1ECDc th\u1EB3ng m\u1EA3ng c\xF3 th\u1EC3 <i>tr\xF4ng nh\u01B0</i> \u0111\xFAng, nh\u01B0ng m\u1ECDi <code>computed</code> v\xE0 component kh\xE1c d\u1EF1a tr\xEAn state th\xEC \u0111\u1EE9ng y\xEAn.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>Th\xEAm vi\u1EC7c</b> hai l\u1EA7n, <code>store.count()</code> ph\u1EA3i hi\u1EC7n <code>2 vi\u1EC7c</code>.</p>`,starter:`const TodoStore = signalStore(
  withState({ todos: [] }),
  withComputed((store) => ({ count: computed(() => store.todos().length) })),
  withMethods((store) => ({
    add(title) {
      const todos = store.todos();
      todos.push({ title, done: false }); // \u2757 s\u1EEDa th\u1EB3ng m\u1EA3ng hi\u1EC7n t\u1EA1i
      patchState(store, { todos });
    },
  })),
);

@Component({
  selector: 'app-root',
  providers: [TodoStore],
  template: \`
    <button (click)="store.add('Vi\u1EC7c m\u1EDBi')">Th\xEAm vi\u1EC7c</button>
    <p class="count">{{ store.count() }} vi\u1EC7c</p>
  \`,
})
class App {
  store = inject(TodoStore);
}

mount(App);
`,solution:`const TodoStore = signalStore(
  withState({ todos: [] }),
  withComputed((store) => ({ count: computed(() => store.todos().length) })),
  withMethods((store) => ({
    add(title) {
      patchState(store, (s) => ({ todos: [...s.todos, { title, done: false }] }));
    },
  })),
);

@Component({
  selector: 'app-root',
  providers: [TodoStore],
  template: \`
    <button (click)="store.add('Vi\u1EC7c m\u1EDBi')">Th\xEAm vi\u1EC7c</button>
    <p class="count">{{ store.count() }} vi\u1EC7c</p>
  \`,
})
class App {
  store = inject(TodoStore);
}

mount(App);
`,hint:`Tạo mảng mới: patchState(store, (s) => ({ todos: [...s.todos, { title, done: false }] })).`,explain:`Ở chế độ dev, signalStore đóng băng state (Object.freeze), nên push sẽ ném lỗi ngay thay vì âm thầm không cập nhật.`,simulate(t){t.at(200,()=>t.click(`Thêm việc`)),t.at(300,()=>t.click(`Thêm việc`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. State đang bị sửa trực tiếp.`);let o=g(t.text(`.count`));return o===`2 việc`?i():s(`Trang đang hiện "`+o+`": mảng cũ bị sửa tại chỗ nên patchState coi như không đổi, computed count không tính lại.`)}},{id:`with-computed`,group:`State dẫn xuất`,title:`Giá trị tính từ state: withComputed`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>T\u1ED5ng ti\u1EC1n t\xEDnh \u0111\u01B0\u1EE3c t\u1EEB danh s\xE1ch h\xE0ng v\xE0 m\xE3 gi\u1EA3m gi\xE1 th\xEC <b>kh\xF4ng n\xEAn</b> l\u01B0u trong state: l\u01B0u th\xEC m\u1ED7i method \u0111\u1EC1u ph\u1EA3i nh\u1EDB c\u1EADp nh\u1EADt l\u1EA1i n\xF3, qu\xEAn m\u1ED9t ch\u1ED7 l\xE0 sai. Khai b\xE1o n\xF3 trong <code>withComputed</code>: t\u1EF1 t\xEDnh l\u1EA1i khi ph\u1EA7n state n\xF3 \u0111\u1ECDc thay \u0111\u1ED5i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> gi\u1ECF c\xF3 200.000\u0111 h\xE0ng; khi ki\u1EC3m tra, trang b\u1EA5m <b>\xC1p m\xE3 BIP10</b>. T\u1ED5ng ph\u1EA3i l\xE0 <code>180000</code>.</p>`,starter:`const CartStore = signalStore(
  withState({ items: [{ name: '\xC1o m\u01B0a', price: 120000 }, { name: '\xD4 g\u1EA5p', price: 80000 }], coupon: '', total: 200000 }),
  withMethods((store) => ({
    applyCoupon(code) {
      patchState(store, { coupon: code }); // \u2757 qu\xEAn t\xEDnh l\u1EA1i total
    },
  })),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    <button (click)="store.applyCoupon('BIP10')">\xC1p m\xE3 BIP10</button>
    <p>T\u1ED5ng: <b class="total">{{ store.total() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,solution:`const CartStore = signalStore(
  withState({ items: [{ name: '\xC1o m\u01B0a', price: 120000 }, { name: '\xD4 g\u1EA5p', price: 80000 }], coupon: '' }),
  withComputed((store) => ({
    subtotal: computed(() => store.items().reduce((sum, it) => sum + it.price, 0)),
  })),
  withComputed((store) => ({
    total: computed(() => (store.coupon() === 'BIP10' ? store.subtotal() * 0.9 : store.subtotal())),
  })),
  withMethods((store) => ({
    applyCoupon(code) {
      patchState(store, { coupon: code });
    },
  })),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    <button (click)="store.applyCoupon('BIP10')">\xC1p m\xE3 BIP10</button>
    <p>T\u1ED5ng: <b class="total">{{ store.total() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,hint:`Bỏ total khỏi withState; thêm withComputed((store) => ({ total: computed(() => …) })) tính từ store.items() và store.coupon() (BIP10 giảm 10%).`,explain:`Mỗi withComputed thấy được các computed khai báo ở những feature đứng trước nó, nên có thể tách subtotal rồi total như lời giải.`,simulate(t){t.at(200,()=>t.click(`Áp mã BIP10`))},check(t,o){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());if(!/withComputed\s*\(/.test(o))return s(`Hãy tính total bằng withComputed thay vì lưu trong state.`);let n=g(t.text(`.total`));return n===`180000`?i():s(`Tổng đang là `+n+`, cần 180000 sau khi áp mã.`)}},{id:`entities`,group:`Entities`,title:`Sửa một phần tử: updateEntity`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p><code>withEntities()</code> l\u01B0u danh s\xE1ch theo id v\xE0 cho s\u1EB5n <code>store.entities()</code>, <code>store.entityMap()</code>, <code>store.ids()</code>. Thay \u0111\u1ED5i \u0111i qua c\xE1c h\xE0m c\u1EADp nh\u1EADt: <code>addEntity</code>, <code>updateEntity</code>, <code>removeEntity</code>, <code>setAllEntities</code>\u2026 truy\u1EC1n v\xE0o <code>patchState</code>. S\u1EEDa th\u1EB3ng object <code>e.qty++</code> th\xEC kh\xF4ng ai bi\u1EBFt state \u0111\xE3 \u0111\u1ED5i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>+</b> \u1EDF d\xF2ng \u0111\u1EA7u: s\u1ED1 l\u01B0\u1EE3ng c\u1EE7a n\xF3 th\xE0nh <code>2</code> v\xE0 <b>t\u1ED5ng s\u1ED1 l\u01B0\u1EE3ng</b> (m\u1ED9t <code>withComputed</code>) th\xE0nh <code>3</code>.</p>`,starter:`const CartStore = signalStore(
  withEntities(),
  withComputed((store) => ({ totalQty: computed(() => store.entities().reduce((n, it) => n + it.qty, 0)) })),
  withMethods((store) => ({
    increase(id) {
      const item = store.entityMap()[id];
      item.qty++; // \u2757 s\u1EEDa th\u1EB3ng object trong state
    },
  })),
  withHooks({
    onInit(store) {
      patchState(store, setAllEntities([{ id: 1, name: '\xC1o m\u01B0a', qty: 1 }, { id: 2, name: '\xD4 g\u1EA5p', qty: 1 }]));
    },
  }),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    @for (it of store.entities(); track it.id) {
      <p>{{ it.name }}: <b class="qty">{{ it.qty }}</b> <button (click)="store.increase(it.id)">+ {{ it.name }}</button></p>
    }
    <p>T\u1ED5ng s\u1ED1 l\u01B0\u1EE3ng: <b class="total">{{ store.totalQty() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,solution:`const CartStore = signalStore(
  withEntities(),
  withComputed((store) => ({ totalQty: computed(() => store.entities().reduce((n, it) => n + it.qty, 0)) })),
  withMethods((store) => ({
    increase(id) {
      patchState(store, updateEntity({ id, changes: (it) => ({ qty: it.qty + 1 }) }));
    },
  })),
  withHooks({
    onInit(store) {
      patchState(store, setAllEntities([{ id: 1, name: '\xC1o m\u01B0a', qty: 1 }, { id: 2, name: '\xD4 g\u1EA5p', qty: 1 }]));
    },
  }),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    @for (it of store.entities(); track it.id) {
      <p>{{ it.name }}: <b class="qty">{{ it.qty }}</b> <button (click)="store.increase(it.id)">+ {{ it.name }}</button></p>
    }
    <p>T\u1ED5ng s\u1ED1 l\u01B0\u1EE3ng: <b class="total">{{ store.totalQty() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,hint:`patchState(store, updateEntity({ id, changes: (it) => ({ qty: it.qty + 1 }) })).`,explain:`changes nhận object hoặc hàm nhận phần tử hiện tại. Có thể đặt tên cho tập entity (withEntities({ entity: type<Item>(), collection: "cart" })) khi một store giữ nhiều danh sách.`,simulate(t){t.at(200,()=>t.click(`+ Áo mưa`))},check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. Object trong state đang bị sửa trực tiếp.`);let o=t.query(`.qty`).map(c=>g(c.textContent));if(o.join(`|`)!==`2|1`)return s(`Số lượng đang là `+o.join(`, `)+`, cần 2 cho dòng đầu và 1 cho dòng sau.`);let n=g(t.text(`.total`));return n===`3`?i():s(`Dòng đầu hiện 2 chỉ vì click làm component vẽ lại, còn tổng (computed) vẫn là `+n+`: state không hề báo là đã đổi.`)}},{id:`with-hooks`,group:`Vòng đời`,title:`Tải dữ liệu một lần: withHooks onInit`,level:`Trung bình`,lv:2,waitMs:900,desc:`<p>N\u1EBFu m\u1ED7i component d\xF9ng store \u0111\u1EC1u g\u1ECDi <code>store.load()</code> trong constructor, d\u1EEF li\u1EC7u b\u1ECB t\u1EA3i nhi\u1EC1u l\u1EA7n. Vi\u1EC7c "kh\u1EDFi \u0111\u1ED9ng" c\u1EE7a store thu\u1ED9c v\u1EC1 ch\xEDnh store: <code>withHooks({ onInit(store) { store.load(); } })</code> ch\u1EA1y \u0111\xFAng m\u1ED9t l\u1EA7n khi store \u0111\u01B0\u1EE3c t\u1EA1o.</p>
<p><b>Y\xEAu c\u1EA7u:</b> c\xF3 hai component d\xF9ng chung store. Ch\u1EC9 \u0111\u01B0\u1EE3c c\xF3 <b>m\u1ED9t</b> request <code>/products</code>, v\xE0 c\u1EA3 hai component \u0111\u1EC1u hi\u1EC7n <code>3 s\u1EA3n ph\u1EA9m</code>.</p>`,starter:`const ProductStore = signalStore(
  withState({ products: [] }),
  withMethods((store) => ({
    load() {
      fakeApi.get('/products', { delay: 300, data: ['\xC1o m\u01B0a', '\xD4 g\u1EA5p', '\u1EE6ng'] })
        .subscribe((products) => patchState(store, { products }));
    },
  })),
);

@Component({ selector: 'app-header', template: '<p class="n">Header: {{ store.products().length }} s\u1EA3n ph\u1EA9m</p>' })
class Header {
  store = inject(ProductStore);
  constructor() { this.store.load(); } // \u2757
}

@Component({ selector: 'app-list', template: '<p class="n">Danh s\xE1ch: {{ store.products().length }} s\u1EA3n ph\u1EA9m</p>' })
class List {
  store = inject(ProductStore);
  constructor() { this.store.load(); } // \u2757
}

@Component({ selector: 'app-root', imports: [Header, List], providers: [ProductStore], template: '<app-header /><app-list />' })
class App {}

mount(App);
`,solution:`const ProductStore = signalStore(
  withState({ products: [] }),
  withMethods((store) => ({
    load() {
      fakeApi.get('/products', { delay: 300, data: ['\xC1o m\u01B0a', '\xD4 g\u1EA5p', '\u1EE6ng'] })
        .subscribe((products) => patchState(store, { products }));
    },
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);

@Component({ selector: 'app-header', template: '<p class="n">Header: {{ store.products().length }} s\u1EA3n ph\u1EA9m</p>' })
class Header {
  store = inject(ProductStore);
}

@Component({ selector: 'app-list', template: '<p class="n">Danh s\xE1ch: {{ store.products().length }} s\u1EA3n ph\u1EA9m</p>' })
class List {
  store = inject(ProductStore);
}

@Component({ selector: 'app-root', imports: [Header, List], providers: [ProductStore], template: '<app-header /><app-list />' })
class App {}

mount(App);
`,hint:`Thêm withHooks({ onInit(store) { store.load(); } }) sau withMethods, và bỏ hai dòng load() trong constructor của component.`,explain:`onInit chạy trong injection context, nên dùng được inject() hoặc rxMethod tại đó. Có cả onDestroy để dọn dẹp khi store bị huỷ (store provide ở component bị huỷ theo component).`,check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg());let o=t.http(`/products`).length;if(o!==1)return s(`Có `+o+` request /products, chỉ được có 1.`);let n=t.query(`.n`).map(c=>g(c.textContent).split(`: `)[1]);return n.join(`|`)===`3 sản phẩm|3 sản phẩm`?i():s(`Hai component đang hiện `+JSON.stringify(n)+`.`)}},{id:`pham-vi`,group:`Vòng đời`,title:`Mỗi màn hình một store: không providedIn root`,level:`Dễ`,lv:1,waitMs:600,desc:`<p><code>signalStore({ providedIn: 'root' }, \u2026)</code> t\u1EA1o <b>m\u1ED9t</b> store cho c\u1EA3 \u1EE9ng d\u1EE5ng. V\u1EDBi state c\u1EE7a m\u1ED9t m\xE0n h\xECnh hay m\u1ED9t kh\u1ED1i giao di\u1EC7n (form ch\u1EC9nh s\u1EEDa, b\u1ED9 l\u1ECDc c\u1EE7a b\u1EA3ng), h\xE3y b\u1ECF <code>providedIn</code> v\xE0 provide store \u1EDF component: m\u1ED7i component c\xF3 store ri\xEAng, r\u1EDDi m\xE0n h\xECnh l\xE0 store b\u1ECB d\u1ECDn.</p>
<p><b>Y\xEAu c\u1EA7u:</b> c\xF3 hai tr\xECnh so\u1EA1n th\u1EA3o. G\xF5 v\xE0o tr\xECnh so\u1EA1n th\u1EA3o \u0111\u1EA7u ti\xEAn th\xEC ch\u1EC9 n\xF3 \u0111\u1ED5i; tr\xECnh so\u1EA1n th\u1EA3o th\u1EE9 hai v\u1EABn tr\u1ED1ng.</p>`,starter:`const EditorStore = signalStore(
  { providedIn: 'root' },
  withState({ text: '' }),
  withMethods((store) => ({ setText(text) { patchState(store, { text }); } })),
);

@Component({
  selector: 'app-editor',
  template: '<input [value]="store.text()" (input)="store.setText($any($event.target).value)" /> <span class="preview">{{ store.text() }}</span>',
})
class Editor {
  store = inject(EditorStore);
}

@Component({ selector: 'app-root', imports: [Editor], template: '<app-editor /><app-editor />' })
class App {}

mount(App);
`,solution:`const EditorStore = signalStore(
  withState({ text: '' }),
  withMethods((store) => ({ setText(text) { patchState(store, { text }); } })),
);

@Component({
  selector: 'app-editor',
  providers: [EditorStore],
  template: '<input [value]="store.text()" (input)="store.setText($any($event.target).value)" /> <span class="preview">{{ store.text() }}</span>',
})
class Editor {
  store = inject(EditorStore);
}

@Component({ selector: 'app-root', imports: [Editor], template: '<app-editor /><app-editor />' })
class App {}

mount(App);
`,hint:`Bỏ { providedIn: 'root' } khỏi signalStore và thêm providers: [EditorStore] vào @Component của Editor.`,explain:`Chỉ để providedIn: "root" cho state thật sự toàn cục: người dùng đăng nhập, giỏ hàng, cài đặt giao diện.`,simulate(t){t.at(200,()=>t.type(0,`Bản nháp của tôi`))},check(t){let o=t.query(`.preview`).map(n=>g(n.textContent));return o[0]!==`Bản nháp của tôi`?s(`Trình soạn thảo đầu chưa hiện nội dung vừa gõ.`):o[1]===``?i():s(`Trình soạn thảo thứ hai cũng đổi theo ("`+o[1]+`"): hai component đang dùng chung một store ở root.`)}}],extras:()=>import(`./chunk-DYBlVJGX.js`).then(t=>t.signalStoreExtras()),cheatsheet:[[`Khai báo`,`<code>signalStore(withState({…}), withComputed(…), withMethods(…))</code>`],[`Cập nhật`,`<code>patchState(store, (s) =&gt; ({ items: [...s.items, x] }))</code> trong withMethods`],[`Dẫn xuất`,`<code>withComputed((store) =&gt; ({ total: computed(…) }))</code>`],[`Danh sách theo id`,`<code>withEntities()</code> + <code>addEntity</code> / <code>updateEntity</code> / <code>removeEntity</code>`],[`Khởi động`,`<code>withHooks({ onInit(store) { store.load(); } })</code>`],[`Phạm vi`,`state của màn hình: <code>providers: [Store]</code>; toàn cục: <code>{ providedIn: 'root' }</code>`]]};export{p as LAB};