import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/** Bài luyện của bài 22 — SignalStore (@ngrx/signals): withMethods, bất biến, withComputed, entities, withHooks, store theo component. */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Dựng một store bằng <code>signalStore(withState(…), withComputed(…), withMethods(…))</code>, provide nó rồi <code>inject</code> trong component. Mỗi khoá trong state thành một signal đọc được: <code>store.items()</code>.</p>
<div class="tip">Có sẵn: <code>signalStore</code>, <code>withState</code>, <code>withComputed</code>, <code>withMethods</code>, <code>withHooks</code>, <code>withProps</code>, <code>patchState</code>, <code>getState</code>, <code>withEntities</code>, <code>addEntity</code>, <code>updateEntity</code>, <code>removeEntity</code>, <code>setAllEntities</code>, <code>rxMethod</code>.</div>`,
    starter: `const CounterStore = signalStore(
  withState({ count: 0 }),
  withComputed((store) => ({ double: computed(() => store.count() * 2) })),
  withMethods((store) => ({
    inc() { patchState(store, (s) => ({ count: s.count + 1 })); },
  })),
);

@Component({
  selector: 'app-root',
  providers: [CounterStore],
  template: '<button (click)="store.inc()">+1</button> {{ store.count() }} × 2 = {{ store.double() }}',
})
class App {
  store = inject(CounterStore);
}

mount(App);
`,
  },
  {
    id: 'with-methods', group: 'Cập nhật state', title: 'Logic cập nhật nằm trong store: withMethods', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Component tự gọi <code>patchState(this.store, …)</code> thì logic cập nhật state rải ra khắp nơi, mỗi chỗ viết một kiểu và dễ sai. Đặt mọi thay đổi state vào <code>withMethods</code>; component chỉ gọi <code>store.addItem(name)</code>. (Mặc định state của SignalStore là protected: TypeScript báo lỗi khi gọi <code>patchState</code> từ bên ngoài store.)</p>
<p><b>Yêu cầu:</b> chuyển logic thêm hàng vào method <code>addItem</code> của store và sửa luôn lỗi: thêm "Áo mưa" lần nữa thì <b>tăng số lượng</b> chứ không tạo dòng mới. Khi kiểm tra, trang bấm <b>Thêm Áo mưa</b> hai lần; giỏ có đúng 1 dòng <code>Áo mưa × 2</code>.</p>`,
    starter: `const CartStore = signalStore(
  withState({ items: [] }),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    <button (click)="add('Áo mưa')">Thêm Áo mưa</button>
    @for (it of store.items(); track $index) { <p class="line">{{ it.name }} × {{ it.qty }}</p> }
  \`,
})
class App {
  store = inject(CartStore);

  // ❗ logic cập nhật state nằm trong component (và còn sai: luôn thêm dòng mới)
  add(name) {
    patchState(this.store, (s) => ({ items: [...s.items, { name, qty: 1 }] }));
  }
}

mount(App);
`,
    solution: `const CartStore = signalStore(
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
    <button (click)="store.addItem('Áo mưa')">Thêm Áo mưa</button>
    @for (it of store.items(); track it.name) { <p class="line">{{ it.name }} × {{ it.qty }}</p> }
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,
    hint: 'Thêm withMethods((store) => ({ addItem(name) { patchState(store, (s) => …) } })) vào signalStore. Trong updater: nếu đã có dòng cùng tên thì map ra dòng mới với qty + 1, chưa có thì thêm { name, qty: 1 }. Nút gọi store.addItem(\'Áo mưa\').',
    explain: 'Gom logic vào store giúp test được store riêng, và mọi component dùng chung một cách cập nhật. Muốn tắt bảo vệ thì truyền { protectedState: false } cho signalStore, nhưng hiếm khi nên làm.',
    simulate(s) {
      s.at(200, () => s.click('Thêm Áo mưa'));
      s.at(300, () => s.click('Thêm Áo mưa'));
    },
    check(a, code) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (/patchState\s*\(\s*this\.store/.test(code)) return NO('Component vẫn tự gọi patchState(this.store, …): đưa logic vào withMethods của store.');
      if (!/withMethods\s*\(/.test(code)) return NO('Store cần có withMethods với method addItem.');
      const lines = a.query('.line').map((e) => norm(e.textContent));
      return lines.join('|') === 'Áo mưa × 2' ? OK() : NO('Giỏ hàng đang là ' + JSON.stringify(lines) + ', cần đúng một dòng "Áo mưa × 2".');
    },
  },
  {
    id: 'bat-bien', group: 'Cập nhật state', title: 'Không sửa trực tiếp state', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p><code>patchState</code> chỉ báo thay đổi khi giá trị của một khoá là <b>tham chiếu mới</b> (so sánh bằng <code>!==</code>). <code>push</code> vào mảng cũ rồi đưa lại đúng mảng đó thì với SignalStore là "không có gì đổi": signal không phát, giao diện không vẽ lại.</p>
<p>Lỗi này hay bị che: click làm component vẽ lại nên chỗ nào đọc thẳng mảng có thể <i>trông như</i> đúng, nhưng mọi <code>computed</code> và component khác dựa trên state thì đứng yên.</p>
<p><b>Yêu cầu:</b> bấm <b>Thêm việc</b> hai lần, <code>store.count()</code> phải hiện <code>2 việc</code>.</p>`,
    starter: `const TodoStore = signalStore(
  withState({ todos: [] }),
  withComputed((store) => ({ count: computed(() => store.todos().length) })),
  withMethods((store) => ({
    add(title) {
      const todos = store.todos();
      todos.push({ title, done: false }); // ❗ sửa thẳng mảng hiện tại
      patchState(store, { todos });
    },
  })),
);

@Component({
  selector: 'app-root',
  providers: [TodoStore],
  template: \`
    <button (click)="store.add('Việc mới')">Thêm việc</button>
    <p class="count">{{ store.count() }} việc</p>
  \`,
})
class App {
  store = inject(TodoStore);
}

mount(App);
`,
    solution: `const TodoStore = signalStore(
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
    <button (click)="store.add('Việc mới')">Thêm việc</button>
    <p class="count">{{ store.count() }} việc</p>
  \`,
})
class App {
  store = inject(TodoStore);
}

mount(App);
`,
    hint: 'Tạo mảng mới: patchState(store, (s) => ({ todos: [...s.todos, { title, done: false }] })).',
    explain: 'Ở chế độ dev, signalStore đóng băng state (Object.freeze), nên push sẽ ném lỗi ngay thay vì âm thầm không cập nhật.',
    simulate(s) {
      s.at(200, () => s.click('Thêm việc'));
      s.at(300, () => s.click('Thêm việc'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. State đang bị sửa trực tiếp.');
      const t = norm(a.text('.count'));
      return t === '2 việc' ? OK() : NO('Trang đang hiện "' + t + '": mảng cũ bị sửa tại chỗ nên patchState coi như không đổi, computed count không tính lại.');
    },
  },
  {
    id: 'with-computed', group: 'State dẫn xuất', title: 'Giá trị tính từ state: withComputed', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Tổng tiền tính được từ danh sách hàng và mã giảm giá thì <b>không nên</b> lưu trong state: lưu thì mỗi method đều phải nhớ cập nhật lại nó, quên một chỗ là sai. Khai báo nó trong <code>withComputed</code>: tự tính lại khi phần state nó đọc thay đổi.</p>
<p><b>Yêu cầu:</b> giỏ có 200.000đ hàng; khi kiểm tra, trang bấm <b>Áp mã BIP10</b>. Tổng phải là <code>180000</code>.</p>`,
    starter: `const CartStore = signalStore(
  withState({ items: [{ name: 'Áo mưa', price: 120000 }, { name: 'Ô gấp', price: 80000 }], coupon: '', total: 200000 }),
  withMethods((store) => ({
    applyCoupon(code) {
      patchState(store, { coupon: code }); // ❗ quên tính lại total
    },
  })),
);

@Component({
  selector: 'app-root',
  providers: [CartStore],
  template: \`
    <button (click)="store.applyCoupon('BIP10')">Áp mã BIP10</button>
    <p>Tổng: <b class="total">{{ store.total() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,
    solution: `const CartStore = signalStore(
  withState({ items: [{ name: 'Áo mưa', price: 120000 }, { name: 'Ô gấp', price: 80000 }], coupon: '' }),
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
    <button (click)="store.applyCoupon('BIP10')">Áp mã BIP10</button>
    <p>Tổng: <b class="total">{{ store.total() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,
    hint: "Bỏ total khỏi withState; thêm withComputed((store) => ({ total: computed(() => …) })) tính từ store.items() và store.coupon() (BIP10 giảm 10%).",
    explain: 'Mỗi withComputed thấy được các computed khai báo ở những feature đứng trước nó, nên có thể tách subtotal rồi total như lời giải.',
    simulate(s) { s.at(200, () => s.click('Áp mã BIP10')); },
    check(a, code) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (!/withComputed\s*\(/.test(code)) return NO('Hãy tính total bằng withComputed thay vì lưu trong state.');
      const t = norm(a.text('.total'));
      return t === '180000' ? OK() : NO('Tổng đang là ' + t + ', cần 180000 sau khi áp mã.');
    },
  },
  {
    id: 'entities', group: 'Entities', title: 'Sửa một phần tử: updateEntity', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p><code>withEntities()</code> lưu danh sách theo id và cho sẵn <code>store.entities()</code>, <code>store.entityMap()</code>, <code>store.ids()</code>. Thay đổi đi qua các hàm cập nhật: <code>addEntity</code>, <code>updateEntity</code>, <code>removeEntity</code>, <code>setAllEntities</code>… truyền vào <code>patchState</code>. Sửa thẳng object <code>e.qty++</code> thì không ai biết state đã đổi.</p>
<p><b>Yêu cầu:</b> bấm <b>+</b> ở dòng đầu: số lượng của nó thành <code>2</code> và <b>tổng số lượng</b> (một <code>withComputed</code>) thành <code>3</code>.</p>`,
    starter: `const CartStore = signalStore(
  withEntities(),
  withComputed((store) => ({ totalQty: computed(() => store.entities().reduce((n, it) => n + it.qty, 0)) })),
  withMethods((store) => ({
    increase(id) {
      const item = store.entityMap()[id];
      item.qty++; // ❗ sửa thẳng object trong state
    },
  })),
  withHooks({
    onInit(store) {
      patchState(store, setAllEntities([{ id: 1, name: 'Áo mưa', qty: 1 }, { id: 2, name: 'Ô gấp', qty: 1 }]));
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
    <p>Tổng số lượng: <b class="total">{{ store.totalQty() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,
    solution: `const CartStore = signalStore(
  withEntities(),
  withComputed((store) => ({ totalQty: computed(() => store.entities().reduce((n, it) => n + it.qty, 0)) })),
  withMethods((store) => ({
    increase(id) {
      patchState(store, updateEntity({ id, changes: (it) => ({ qty: it.qty + 1 }) }));
    },
  })),
  withHooks({
    onInit(store) {
      patchState(store, setAllEntities([{ id: 1, name: 'Áo mưa', qty: 1 }, { id: 2, name: 'Ô gấp', qty: 1 }]));
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
    <p>Tổng số lượng: <b class="total">{{ store.totalQty() }}</b></p>
  \`,
})
class App {
  store = inject(CartStore);
}

mount(App);
`,
    hint: 'patchState(store, updateEntity({ id, changes: (it) => ({ qty: it.qty + 1 }) })).',
    explain: 'changes nhận object hoặc hàm nhận phần tử hiện tại. Có thể đặt tên cho tập entity (withEntities({ entity: type<Item>(), collection: "cart" })) khi một store giữ nhiều danh sách.',
    simulate(s) { s.at(200, () => s.click('+ Áo mưa')); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Object trong state đang bị sửa trực tiếp.');
      const q = a.query('.qty').map((e) => norm(e.textContent));
      if (q.join('|') !== '2|1') return NO('Số lượng đang là ' + q.join(', ') + ', cần 2 cho dòng đầu và 1 cho dòng sau.');
      const t = norm(a.text('.total'));
      return t === '3' ? OK() : NO('Dòng đầu hiện 2 chỉ vì click làm component vẽ lại, còn tổng (computed) vẫn là ' + t + ': state không hề báo là đã đổi.');
    },
  },
  {
    id: 'with-hooks', group: 'Vòng đời', title: 'Tải dữ liệu một lần: withHooks onInit', level: 'Trung bình', lv: 2, waitMs: 900,
    desc: `<p>Nếu mỗi component dùng store đều gọi <code>store.load()</code> trong constructor, dữ liệu bị tải nhiều lần. Việc "khởi động" của store thuộc về chính store: <code>withHooks({ onInit(store) { store.load(); } })</code> chạy đúng một lần khi store được tạo.</p>
<p><b>Yêu cầu:</b> có hai component dùng chung store. Chỉ được có <b>một</b> request <code>/products</code>, và cả hai component đều hiện <code>3 sản phẩm</code>.</p>`,
    starter: `const ProductStore = signalStore(
  withState({ products: [] }),
  withMethods((store) => ({
    load() {
      fakeApi.get('/products', { delay: 300, data: ['Áo mưa', 'Ô gấp', 'Ủng'] })
        .subscribe((products) => patchState(store, { products }));
    },
  })),
);

@Component({ selector: 'app-header', template: '<p class="n">Header: {{ store.products().length }} sản phẩm</p>' })
class Header {
  store = inject(ProductStore);
  constructor() { this.store.load(); } // ❗
}

@Component({ selector: 'app-list', template: '<p class="n">Danh sách: {{ store.products().length }} sản phẩm</p>' })
class List {
  store = inject(ProductStore);
  constructor() { this.store.load(); } // ❗
}

@Component({ selector: 'app-root', imports: [Header, List], providers: [ProductStore], template: '<app-header /><app-list />' })
class App {}

mount(App);
`,
    solution: `const ProductStore = signalStore(
  withState({ products: [] }),
  withMethods((store) => ({
    load() {
      fakeApi.get('/products', { delay: 300, data: ['Áo mưa', 'Ô gấp', 'Ủng'] })
        .subscribe((products) => patchState(store, { products }));
    },
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);

@Component({ selector: 'app-header', template: '<p class="n">Header: {{ store.products().length }} sản phẩm</p>' })
class Header {
  store = inject(ProductStore);
}

@Component({ selector: 'app-list', template: '<p class="n">Danh sách: {{ store.products().length }} sản phẩm</p>' })
class List {
  store = inject(ProductStore);
}

@Component({ selector: 'app-root', imports: [Header, List], providers: [ProductStore], template: '<app-header /><app-list />' })
class App {}

mount(App);
`,
    hint: 'Thêm withHooks({ onInit(store) { store.load(); } }) sau withMethods, và bỏ hai dòng load() trong constructor của component.',
    explain: 'onInit chạy trong injection context, nên dùng được inject() hoặc rxMethod tại đó. Có cả onDestroy để dọn dẹp khi store bị huỷ (store provide ở component bị huỷ theo component).',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const n = a.http('/products').length;
      if (n !== 1) return NO('Có ' + n + ' request /products, chỉ được có 1.');
      const t = a.query('.n').map((e) => norm(e.textContent).split(': ')[1]);
      return t.join('|') === '3 sản phẩm|3 sản phẩm' ? OK() : NO('Hai component đang hiện ' + JSON.stringify(t) + '.');
    },
  },
  {
    id: 'pham-vi', group: 'Vòng đời', title: 'Mỗi màn hình một store: không providedIn root', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p><code>signalStore({ providedIn: 'root' }, …)</code> tạo <b>một</b> store cho cả ứng dụng. Với state của một màn hình hay một khối giao diện (form chỉnh sửa, bộ lọc của bảng), hãy bỏ <code>providedIn</code> và provide store ở component: mỗi component có store riêng, rời màn hình là store bị dọn.</p>
<p><b>Yêu cầu:</b> có hai trình soạn thảo. Gõ vào trình soạn thảo đầu tiên thì chỉ nó đổi; trình soạn thảo thứ hai vẫn trống.</p>`,
    starter: `const EditorStore = signalStore(
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
`,
    solution: `const EditorStore = signalStore(
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
`,
    hint: "Bỏ { providedIn: 'root' } khỏi signalStore và thêm providers: [EditorStore] vào @Component của Editor.",
    explain: 'Chỉ để providedIn: "root" cho state thật sự toàn cục: người dùng đăng nhập, giỏ hàng, cài đặt giao diện.',
    simulate(s) { s.at(200, () => s.type(0, 'Bản nháp của tôi')); },
    check(a) {
      const p = a.query('.preview').map((e) => norm(e.textContent));
      if (p[0] !== 'Bản nháp của tôi') return NO('Trình soạn thảo đầu chưa hiện nội dung vừa gõ.');
      return p[1] === '' ? OK() : NO('Trình soạn thảo thứ hai cũng đổi theo ("' + p[1] + '"): hai component đang dùng chung một store ở root.');
    },
  },
];

export const LAB: LabModule = {
  title: 'SignalStore',
  subtitle: 'bài luyện quản lý state theo tính năng với @ngrx/signals: withMethods, cập nhật bất biến, withComputed, entities, withHooks, phạm vi của store.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-signal-store').then((m) => m.signalStoreExtras()),
  cheatsheet: [
    ['Khai báo', '<code>signalStore(withState({…}), withComputed(…), withMethods(…))</code>'],
    ['Cập nhật', '<code>patchState(store, (s) =&gt; ({ items: [...s.items, x] }))</code> trong withMethods'],
    ['Dẫn xuất', '<code>withComputed((store) =&gt; ({ total: computed(…) }))</code>'],
    ['Danh sách theo id', '<code>withEntities()</code> + <code>addEntity</code> / <code>updateEntity</code> / <code>removeEntity</code>'],
    ['Khởi động', '<code>withHooks({ onInit(store) { store.load(); } })</code>'],
    ['Phạm vi', 'state của màn hình: <code>providers: [Store]</code>; toàn cục: <code>{ providedIn: \'root\' }</code>'],
  ],
};
