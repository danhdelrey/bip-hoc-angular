import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/** Bài luyện của bài 17 — Component động: ViewContainerRef, setInput, destroy, output, NgComponentOutlet, inputBinding. */
const TOAST = `@Component({
  selector: 'app-toast',
  template: '<div class="toast">{{ message() }} <button (click)="closed.emit()">×</button></div>',
})
class Toast {
  message = input('Đã lưu');
  closed = output();
  constructor() {
    inject(DestroyRef).onDestroy(() => log('Toast huỷ'));
  }
}
`;

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Tạo component lúc chạy: lấy một chỗ đặt (<code>ViewContainerRef</code>), gọi <code>createComponent(Type)</code>, truyền input bằng <code>setInput</code>, huỷ bằng <code>destroy()</code>. Hoặc dùng <code>*ngComponentOutlet</code> ngay trong template.</p>
<div class="tip">Có sẵn: <code>ViewContainerRef</code>, <code>NgComponentOutlet</code>, <code>inputBinding</code>, <code>outputBinding</code>, <code>createComponent</code>.</div>`,
    starter: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', 'Thông báo #' + ++this.n);
    ref.instance.closed.subscribe(() => ref.destroy());
  }
}

mount(App);
`,
  },
  {
    id: 'vcr', group: 'Tạo component', title: 'Chỗ đặt component: read: ViewContainerRef', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Component động cần một <b>chỗ đặt</b> trong view: một <code>ViewContainerRef</code>. Cách thường dùng là đặt <code>&lt;ng-container #host /&gt;</code> rồi truy vấn với <code>{ read: ViewContainerRef }</code>. Không có <code>read</code>, <code>viewChild('host')</code> trả về <code>ElementRef</code>, không có hàm <code>createComponent</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Thêm thông báo</b> hai lần; phải có 2 <code>.toast</code> và không có lỗi.</p>`,
    starter: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
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
`,
    solution: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
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
`,
    hint: "Đổi thành host = viewChild('host', { read: ViewContainerRef }).",
    explain: 'Component động được chèn ngay sau <ng-container #host />, theo thứ tự tạo. Cũng có thể inject(ViewContainerRef) trong component để chèn ngay sau chính phần tử host của nó.',
    simulate(s) {
      s.at(200, () => s.click('Thêm thông báo'));
      s.at(300, () => s.click('Thêm thông báo'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const n = a.query('.toast').length;
      return n === 2 ? OK() : NO('Có ' + n + ' thông báo, cần 2.');
    },
  },
  {
    id: 'set-input', group: 'Tạo component', title: 'Truyền input: setInput()', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Với component tạo động, không có template nào viết <code>[message]="…"</code>, nên phải truyền input bằng <code>ref.setInput('message', giáTrị)</code>. Gán thẳng <code>ref.instance.message = …</code> là sai: với signal input, lệnh đó <b>thay mất</b> signal bằng một chuỗi, template gọi <code>message()</code> sẽ lỗi.</p>
<p><b>Yêu cầu:</b> bấm <b>Thêm thông báo</b> hai lần; hai thông báo hiện <code>Đã lưu #1</code> và <code>Đã lưu #2</code>, không có lỗi.</p>`,
    starter: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.instance.message = 'Đã lưu #' + ++this.n;
  }
}

mount(App);
`,
    solution: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', 'Đã lưu #' + ++this.n);
  }
}

mount(App);
`,
    hint: "Thay dòng gán bằng ref.setInput('message', 'Đã lưu #' + ++this.n).",
    explain: 'setInput dùng tên public của input (alias nếu có), đánh dấu component cần vẽ lại và chạy transform của input. Nó hoạt động như nhau với input kiểu signal lẫn @Input() cũ.',
    simulate(s) {
      s.at(200, () => s.click('Thêm thông báo'));
      s.at(300, () => s.click('Thêm thông báo'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Gán thẳng vào instance đã thay mất signal input.');
      const t = a.query('.toast').map((e) => norm(e.textContent).replace(' ×', ''));
      return t.join('|') === 'Đã lưu #1|Đã lưu #2' ? OK() : NO('Thông báo đang là ' + JSON.stringify(t) + '.');
    },
  },
  {
    id: 'destroy', group: 'Vòng đời', title: 'Dọn component động: destroy() / clear()', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Component tạo bằng <code>createComponent</code> sống tới khi bị huỷ. Bỏ tham chiếu tới <code>ComponentRef</code> <b>không</b> xoá nó: component vẫn nằm trong DOM và subscription bên trong vẫn chạy. Phải gọi <code>ref.destroy()</code>, hoặc <code>viewContainerRef.clear()</code> để huỷ mọi view trong chỗ đặt.</p>
<p><b>Yêu cầu:</b> thêm 2 thông báo rồi bấm <b>Xoá hết</b>: không còn <code>.toast</code> nào và log có 2 dòng <code>Toast huỷ</code>.</p>`,
    starter: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
    <button (click)="clearAll()">Xoá hết</button>
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
    this.refs = []; // ❗ chỉ quên tham chiếu, component vẫn còn
  }
}

mount(App);
`,
    solution: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
    <button (click)="clearAll()">Xoá hết</button>
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
`,
    hint: 'Trong clearAll(): this.host().clear(); hoặc this.refs.forEach(r => r.destroy()).',
    explain: 'Khi component cha bị huỷ, các view trong ViewContainerRef của nó cũng bị huỷ theo. Nhưng component tạo bằng createComponent() độc lập (gắn vào ApplicationRef) thì phải tự destroy.',
    simulate(s) {
      s.at(200, () => s.click('Thêm thông báo'));
      s.at(300, () => s.click('Thêm thông báo'));
      s.at(450, () => s.click('Xoá hết'));
    },
    check(a) {
      const n = a.query('.toast').length;
      const d = a.logs.filter((l) => l.includes('Toast huỷ')).length;
      if (n) return NO('Sau khi Xoá hết vẫn còn ' + n + ' thông báo.');
      return d === 2 ? OK() : NO('Có ' + d + ' dòng "Toast huỷ", cần 2: các component phải được destroy.');
    },
  },
  {
    id: 'output', group: 'Vòng đời', title: 'Nghe output của component động', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Output của component động không gắn được bằng <code>(closed)="…"</code> trong template. Thay vào đó, subscribe trên instance: <code>ref.instance.closed.subscribe(() =&gt; …)</code>. Subscription này tự kết thúc khi component bị huỷ.</p>
<p><b>Yêu cầu:</b> thêm 2 thông báo, rồi bấm nút <b>×</b> của thông báo đầu: chỉ còn lại <code>Thông báo #2</code>.</p>`,
    starter: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', 'Thông báo #' + ++this.n);
    // TODO: khi Toast phát closed thì huỷ nó
  }
}

mount(App);
`,
    solution: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="add()">Thêm thông báo</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  n = 0;

  add() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', 'Thông báo #' + ++this.n);
    ref.instance.closed.subscribe(() => ref.destroy());
  }
}

mount(App);
`,
    hint: 'Thêm ref.instance.closed.subscribe(() => ref.destroy()); sau setInput.',
    explain: 'Với API mới, có thể truyền ngay lúc tạo: createComponent(Toast, { bindings: [outputBinding("closed", () => ...)] }).',
    simulate(s) {
      s.at(200, () => s.click('Thêm thông báo'));
      s.at(300, () => s.click('Thêm thông báo'));
      s.at(450, () => s.click('×'));
    },
    check(a) {
      const t = a.query('.toast').map((e) => norm(e.textContent).replace(' ×', ''));
      if (t.length === 2) return NO('Bấm × nhưng thông báo không mất: chưa có ai nghe output closed.');
      return t.join('|') === 'Thông báo #2' ? OK() : NO('Còn lại ' + JSON.stringify(t) + ', cần chỉ "Thông báo #2".');
    },
  },
  {
    id: 'outlet', group: 'Trong template', title: 'Chọn component theo dữ liệu: *ngComponentOutlet', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Khi component cần hiển thị lấy từ dữ liệu (cấu hình dashboard, loại block trong CMS), viết <code>@switch</code> cho từng loại thì mỗi lần thêm loại mới lại phải sửa template. <code>*ngComponentOutlet</code> nhận thẳng class component, kèm <code>inputs</code>.</p>
<p><b>Yêu cầu:</b> dùng <code>ngComponentOutlet</code> để vẽ widget theo <code>WIDGETS[kind()]</code>, truyền input <code>title</code>. Khi kiểm tra, trang bấm <b>Tin tức</b>; phải hiện <code>.news</code> với tiêu đề <code>Bảng tin</code>.</p>`,
    starter: `@Component({ selector: 'app-weather', template: '<div class="weather">☀️ {{ title() }}: 31°C</div>' })
class Weather { title = input(''); }

@Component({ selector: 'app-news', template: '<div class="news">📰 {{ title() }}: 3 tin mới</div>' })
class News { title = input(''); }

const WIDGETS = { weather: Weather, news: News };

@Component({
  selector: 'app-root',
  imports: [Weather],
  template: \`
    <button (click)="kind.set('weather')">Thời tiết</button>
    <button (click)="kind.set('news')">Tin tức</button>
    <!-- ❗ chỉ biết vẽ Weather; thêm loại mới lại phải sửa template -->
    @if (kind() === 'weather') {
      <app-weather [title]="title()" />
    }
  \`,
})
class App {
  kind = signal('weather');
  title = signal('Bảng tin');
}

mount(App);
`,
    solution: `@Component({ selector: 'app-weather', template: '<div class="weather">☀️ {{ title() }}: 31°C</div>' })
class Weather { title = input(''); }

@Component({ selector: 'app-news', template: '<div class="news">📰 {{ title() }}: 3 tin mới</div>' })
class News { title = input(''); }

const WIDGETS = { weather: Weather, news: News };

@Component({
  selector: 'app-root',
  imports: [NgComponentOutlet],
  template: \`
    <button (click)="kind.set('weather')">Thời tiết</button>
    <button (click)="kind.set('news')">Tin tức</button>
    <ng-container *ngComponentOutlet="widget(); inputs: { title: title() }" />
  \`,
})
class App {
  kind = signal('weather');
  title = signal('Bảng tin');
  widget = computed(() => WIDGETS[this.kind()]);
}

mount(App);
`,
    hint: 'imports: [NgComponentOutlet]; widget = computed(() => WIDGETS[this.kind()]); trong template: <ng-container *ngComponentOutlet="widget(); inputs: { title: title() }" />.',
    explain: 'Khi class đổi, NgComponentOutlet huỷ component cũ và tạo component mới. Kết hợp với import() động để chỉ tải code của widget khi cần.',
    simulate(s) { s.at(250, () => s.click('Tin tức')); },
    check(a, code) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (!/ngComponentOutlet/.test(code)) return NO('Hãy dùng *ngComponentOutlet để vẽ widget theo WIDGETS[kind()].');
      const t = norm(a.text('.news'));
      if (!t) return NO('Bấm Tin tức nhưng không thấy widget .news.');
      if (a.query('.weather').length) return NO('Widget thời tiết vẫn còn sau khi chuyển sang tin tức.');
      return t.includes('Bảng tin') ? OK() : NO('Widget tin tức chưa nhận input title (đang hiện "' + t + '").');
    },
  },
  {
    id: 'input-binding', group: 'Trong template', title: 'Input tự cập nhật: inputBinding()', level: 'Khó', lv: 3, waitMs: 900,
    desc: `<p><code>setInput</code> chỉ đặt giá trị <b>một lần</b>; signal ở cha đổi sau đó thì component động không biết. Từ Angular 20, truyền <code>bindings</code> khi tạo: <code>createComponent(Toast, { bindings: [inputBinding('message', this.status)] })</code>. Input sẽ đi theo signal như một binding <code>[message]</code> trong template.</p>
<p><b>Yêu cầu:</b> bấm <b>Tải lên</b> tạo một thông báo hiện trạng thái hiện tại; khi <code>status</code> đổi thành <code>Hoàn tất ✓</code>, thông báo đang có phải hiện <code>Hoàn tất ✓</code>.</p>`,
    starter: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="upload()">Tải lên</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  status = signal('Đang tải lên…');

  upload() {
    const ref = this.host().createComponent(Toast);
    ref.setInput('message', this.status()); // ❗ chỉ đặt một lần
    setTimeout(() => this.status.set('Hoàn tất ✓'), 300);
  }
}

mount(App);
`,
    solution: TOAST + `
@Component({
  selector: 'app-root',
  template: \`
    <button (click)="upload()">Tải lên</button>
    <ng-container #host />
  \`,
})
class App {
  host = viewChild('host', { read: ViewContainerRef });
  status = signal('Đang tải lên…');

  upload() {
    this.host().createComponent(Toast, {
      bindings: [inputBinding('message', this.status)],
    });
    setTimeout(() => this.status.set('Hoàn tất ✓'), 300);
  }
}

mount(App);
`,
    hint: "createComponent(Toast, { bindings: [inputBinding('message', this.status)] }) và bỏ dòng setInput.",
    explain: "inputBinding nhận signal hoặc hàm không tham số. Cùng chỗ đó có outputBinding('closed', fn) và twoWayBinding('value', signal) cho model().",
    simulate(s) {
      s.at(200, () => s.click('Tải lên'));
      s.at(320, () => s.dom((r) => r.setAttribute('data-t1', norm(r.querySelector('.toast')?.textContent).replace(' ×', ''))));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const t1 = a.root()?.getAttribute('data-t1') ?? '';
      if (t1 !== 'Đang tải lên…') return NO('Lúc vừa tạo, thông báo cần hiện "Đang tải lên…" (đang là "' + t1 + '").');
      const t = a.query('.toast').map((e) => norm(e.textContent).replace(' ×', ''));
      return t.join('|') === 'Hoàn tất ✓' ? OK() : NO('Sau khi status đổi, thông báo đang hiện ' + JSON.stringify(t) + ': setInput chỉ đặt giá trị một lần.');
    },
  },
];

export const LAB: LabModule = {
  title: 'Component động',
  subtitle: 'bài luyện tạo component lúc chạy: ViewContainerRef, setInput, destroy/clear, nghe output, *ngComponentOutlet, inputBinding.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-dynamic').then((m) => m.dynamicExtras()),
  cheatsheet: [
    ['Chỗ đặt', '<code>&lt;ng-container #host /&gt;</code> + <code>viewChild(\'host\', { read: ViewContainerRef })</code>'],
    ['Tạo', '<code>const ref = host().createComponent(Toast)</code>'],
    ['Input', '<code>ref.setInput(\'message\', v)</code>, không gán vào instance'],
    ['Output', '<code>ref.instance.closed.subscribe(…)</code>'],
    ['Huỷ', '<code>ref.destroy()</code> hoặc <code>host().clear()</code>'],
    ['Theo dữ liệu', '<code>*ngComponentOutlet="type; inputs: {…}"</code>'],
    ['Input theo signal', '<code>{ bindings: [inputBinding(\'message\', sig)] }</code>'],
  ],
};
