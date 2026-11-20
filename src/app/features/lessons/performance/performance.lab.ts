import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 26 — Hiệu năng render. Không đo mili-giây (khác nhau giữa các máy) mà đếm thứ quyết định
 * chi phí: số lần một hàm được tính lại, số lần component được vẽ, số node DOM bị tạo mới.
 */
const count = (logs: string[], prefix: string) => logs.filter((l) => l.startsWith(prefix)).length;

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Đo trước, tối ưu sau. Trong lab, cách đo đơn giản là đếm: thêm <code>log()</code> vào hàm hay template để thấy nó chạy bao nhiêu lần khi bạn thao tác. Ngoài đời, dùng tab Profiler của Angular DevTools.</p>
<div class="tip">Có sẵn: <code>ChangeDetectionStrategy</code>, <code>CdkVirtualScrollViewport</code>, <code>CdkFixedSizeVirtualScroll</code>, <code>CdkVirtualForOf</code> (virtual scroll của Angular CDK).</div>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Gõ thử vào đây" (input)="note.set($any($event.target).value)" />
    <p>{{ heavy() }}</p>
  \`,
})
class App {
  note = signal('');
  heavy() {
    log('heavy() chạy');
    return 'Kết quả tính toán';
  }
}

mount(App);
`,
  },
  {
    id: 'track', group: 'Danh sách', title: 'Tải lại danh sách mà không vẽ lại DOM: track theo id', level: 'Dễ', lv: 1, waitMs: 900,
    desc: `<p>API trả về danh sách mới thì mỗi phần tử là một object <b>mới</b>, dù id và nội dung y như cũ. <code>track row</code> so theo object nên Angular coi mọi dòng là dòng mới: xoá hết DOM cũ, tạo lại từ đầu (mất cả focus, trạng thái cuộn, animation). <code>track row.id</code> cho Angular nhận ra dòng cũ và giữ nguyên node DOM.</p>
<p><b>Yêu cầu:</b> bấm <b>Tải lại</b>: cả 3 dòng phải được <b>dùng lại</b> (không node <code>.row</code> nào bị tạo mới).</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <button (click)="reload()">Tải lại</button>
    <ul>
      @for (row of rows(); track row) {
        <li class="row">{{ row.name }}</li>
      }
    </ul>
  \`,
})
class App {
  rows = signal(this.fromApi());

  // giả lập API: mỗi lần trả về object mới, cùng id và nội dung
  fromApi() {
    return [{ id: 1, name: 'An' }, { id: 2, name: 'Bình' }, { id: 3, name: 'Chi' }];
  }
  reload() {
    this.rows.set(this.fromApi());
  }
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <button (click)="reload()">Tải lại</button>
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
    return [{ id: 1, name: 'An' }, { id: 2, name: 'Bình' }, { id: 3, name: 'Chi' }];
  }
  reload() {
    this.rows.set(this.fromApi());
  }
}

mount(App);
`,
    hint: 'Đổi track row thành track row.id.',
    explain: 'track $index cũng giữ được DOM ở đây, nhưng sai khi chèn/xoá/sắp xếp: dòng thứ i luôn được coi là "cùng một dòng" dù dữ liệu đã khác. Id ổn định từ dữ liệu là lựa chọn đúng.',
    simulate(s) {
      s.at(250, () => s.dom((r) => r.querySelectorAll('.row').forEach((el) => el.setAttribute('data-cu', '1'))));
      s.at(300, () => s.click('Tải lại'));
    },
    check(a) {
      const rows = a.query('.row');
      if (rows.length !== 3) return NO('Cần 3 dòng sau khi tải lại.');
      const kept = rows.filter((r) => r.getAttribute('data-cu') === '1').length;
      return kept === 3 ? OK() : NO(3 - kept + '/3 dòng bị xoá và tạo lại sau khi tải: track đang so theo object.');
    },
  },
  {
    id: 'ham-template', group: 'Template', title: 'Gọi hàm tính toán trong template', level: 'Dễ', lv: 1, waitMs: 800,
    desc: `<p>Hàm gọi trong template (<code>{{ filtered().length }}</code> khi <code>filtered</code> là method) chạy lại ở <b>mỗi lần</b> component được vẽ lại, kể cả khi thứ thay đổi chẳng liên quan gì tới nó (ví dụ gõ vào ô ghi chú). <code>computed()</code> nhớ kết quả và chỉ tính lại khi signal nó đọc thay đổi.</p>
<p><b>Yêu cầu:</b> gõ 4 ký tự vào ô <b>Ghi chú</b>: hàm lọc chỉ được chạy lần đầu (log <code>Lọc danh sách</code> không quá 1 lần).</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Ghi chú" (input)="note.set($any($event.target).value)" />
    <p class="count">{{ filtered().length }} sản phẩm còn hàng</p>
  \`,
})
class App {
  products = signal(Array.from({ length: 200 }, (_, i) => ({ id: i, stock: i % 3 })));
  note = signal('');

  filtered() {
    log('Lọc danh sách');
    return this.products().filter((p) => p.stock > 0);
  }
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Ghi chú" (input)="note.set($any($event.target).value)" />
    <p class="count">{{ filtered().length }} sản phẩm còn hàng</p>
  \`,
})
class App {
  products = signal(Array.from({ length: 200 }, (_, i) => ({ id: i, stock: i % 3 })));
  note = signal('');

  filtered = computed(() => {
    log('Lọc danh sách');
    return this.products().filter((p) => p.stock > 0);
  });
}

mount(App);
`,
    hint: 'Đổi method filtered() thành filtered = computed(() => { … }). Template giữ nguyên filtered().',
    explain: 'Gọi signal hay computed trong template thì rẻ (chỉ đọc giá trị đã có). Thứ đắt là method tự tính toán. Pipe pure cũng cho hiệu quả tương tự khi biến đổi một giá trị đầu vào.',
    simulate(s) {
      ['a', 'ab', 'abc', 'abcd'].forEach((t, i) => s.at(200 + i * 80, () => s.type(0, t)));
    },
    check(a) {
      const n = count(a.logs, 'Lọc danh sách');
      if (norm(a.text('.count')) !== '133 sản phẩm còn hàng') return NO('Kết quả lọc phải là 133 sản phẩm còn hàng.');
      return n <= 1 ? OK() : NO('Hàm lọc chạy ' + n + ' lần dù danh sách không đổi: method trong template chạy lại mỗi lần component được vẽ.');
    },
  },
  {
    id: 'onpush', group: 'Template', title: 'Component con bị vẽ lại theo cha: bỏ Eager', level: 'Trung bình', lv: 2, waitMs: 800,
    desc: `<p>Từ Angular 22, component mặc định là <b>OnPush</b>: chỉ được kiểm tra lại khi input đổi, có sự kiện bên trong nó, hoặc signal nó đọc thay đổi. Chiến lược cũ nay tên là <code>ChangeDetectionStrategy.Eager</code> (tên cũ <code>Default</code>): component bị kiểm tra <b>mỗi lần</b> component cha được kiểm tra. Code cũ thường còn khai báo <code>Eager</code>/<code>Default</code> để giữ hành vi trước đây; với component đã dùng input signal thì có thể bỏ.</p>
<p><b>Yêu cầu:</b> gõ 4 ký tự vào ô tìm kiếm của trang: biểu đồ (<code>Chart</code>) chỉ được vẽ lần đầu (log <code>Vẽ biểu đồ</code> không quá 1 lần), và vẫn hiện đúng dữ liệu.</p>`,
    starter: `@Component({
  selector: 'app-chart',
  changeDetection: ChangeDetectionStrategy.Eager, // giữ lại từ code cũ
  template: '<div class="chart">📊 {{ draw() }}</div>',
})
class Chart {
  data = input([]);
  draw() {
    log('Vẽ biểu đồ');
    return this.data().join(' · ');
  }
}

@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <input placeholder="Tìm kiếm" (input)="q.set($any($event.target).value)" />
    <app-chart [data]="sales()" />
  \`,
})
class App {
  q = signal('');
  sales = signal([12, 19, 7]);
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-chart',
  // không khai báo changeDetection: OnPush là mặc định từ Angular 22
  template: '<div class="chart">📊 {{ draw() }}</div>',
})
class Chart {
  data = input([]);
  draw() {
    log('Vẽ biểu đồ');
    return this.data().join(' · ');
  }
}

@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <input placeholder="Tìm kiếm" (input)="q.set($any($event.target).value)" />
    <app-chart [data]="sales()" />
  \`,
})
class App {
  q = signal('');
  sales = signal([12, 19, 7]);
}

mount(App);
`,
    hint: 'Bỏ dòng changeDetection: ChangeDetectionStrategy.Eager khỏi Chart (hoặc đổi thành ChangeDetectionStrategy.OnPush).',
    explain: 'Trước khi bỏ Eager, kiểm tra component không dựa vào việc tự được vẽ lại khi dữ liệu bị sửa tại chỗ (mutate object, gán biến thường trong setTimeout…): với OnPush, những thay đổi đó không hiện lên. Đổi draw() thành computed cũng giảm chi phí, nhưng OnPush mới là thứ bỏ qua cả component.',
    simulate(s) {
      ['a', 'ab', 'abc', 'abcd'].forEach((t, i) => s.at(200 + i * 80, () => s.type(0, t)));
    },
    check(a) {
      const n = count(a.logs, 'Vẽ biểu đồ');
      if (norm(a.text('.chart')) !== '📊 12 · 19 · 7') return NO('Biểu đồ cần hiện đúng dữ liệu 12 · 19 · 7.');
      return n <= 1 ? OK() : NO('Chart được vẽ ' + n + ' lần dù dữ liệu không đổi: Chart dùng Eager nên bị kiểm tra theo mỗi lần cha được vẽ.');
    },
  },
  {
    id: 'debounce', group: 'Nhập liệu', title: 'Lọc khi người dùng ngừng gõ: debounce', level: 'Trung bình', lv: 2, waitMs: 1200,
    desc: `<p>Lọc danh sách lớn ngay ở mỗi phím gõ thì người gõ nhanh sẽ thấy ô nhập bị giật: việc lọc chạy cho cả những từ khoá chưa gõ xong. Hãy chỉ lọc khi người dùng <b>ngừng gõ</b> một chút: <code>toSignal(toObservable(query).pipe(debounceTime(300)))</code>.</p>
<p><b>Yêu cầu:</b> gõ <code>áo</code> rồi <code>áo m</code>, <code>áo mư</code>, <code>áo mưa</code> cách nhau 60ms. Việc lọc (log <code>Lọc theo</code>) chỉ chạy tối đa 2 lần (giá trị ban đầu và từ khoá cuối), và kết quả cuối đúng cho <code>áo mưa</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Tìm sản phẩm" (input)="query.set($any($event.target).value)" />
    <p class="result">{{ results().length }} kết quả</p>
  \`,
})
class App {
  products = ['áo mưa', 'áo mưa trẻ em', 'áo khoác', 'ô gấp', 'ủng'];
  query = signal('');

  results = computed(() => {
    const q = this.query(); // ❗ lọc lại ở mỗi phím gõ
    log('Lọc theo "' + q + '"');
    return this.products.filter((p) => p.includes(q));
  });
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="Tìm sản phẩm" (input)="query.set($any($event.target).value)" />
    <p class="result">{{ results().length }} kết quả</p>
  \`,
})
class App {
  products = ['áo mưa', 'áo mưa trẻ em', 'áo khoác', 'ô gấp', 'ủng'];
  query = signal('');
  debouncedQuery = toSignal(toObservable(this.query).pipe(debounceTime(300)), { initialValue: '' });

  results = computed(() => {
    const q = this.debouncedQuery();
    log('Lọc theo "' + q + '"');
    return this.products.filter((p) => p.includes(q));
  });
}

mount(App);
`,
    hint: "debouncedQuery = toSignal(toObservable(this.query).pipe(debounceTime(300)), { initialValue: '' }); rồi results đọc this.debouncedQuery() thay cho this.query().",
    explain: 'Ô nhập vẫn hiện từng ký tự ngay vì nó gắn với query; chỉ phần tính toán nặng mới chờ. Với dữ liệu từ server, đây cũng là chỗ thêm switchMap để huỷ request cũ.',
    simulate(s) {
      ['áo', 'áo m', 'áo mư', 'áo mưa'].forEach((t, i) => s.at(200 + i * 60, () => s.type(0, t)));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const n = count(a.logs, 'Lọc theo');
      if (norm(a.text('.result')) !== '2 kết quả') return NO('Kết quả cuối cho "áo mưa" phải là 2 kết quả (đang: ' + norm(a.text('.result')) + ').');
      return n <= 2 ? OK() : NO('Việc lọc chạy ' + n + ' lần: đang lọc ở mỗi phím gõ.');
    },
  },
  {
    id: 'virtual-scroll', group: 'Danh sách', title: 'Hàng nghìn dòng: virtual scroll', level: 'Khó', lv: 3, waitMs: 1200,
    desc: `<p>Vẽ 5.000 dòng là 5.000 node DOM: trang tải chậm, cuộn giật, tốn bộ nhớ, dù người dùng chỉ nhìn thấy khoảng 10 dòng. Virtual scroll của Angular CDK chỉ vẽ những dòng đang nằm trong khung nhìn (cộng một ít dự phòng) và thay nội dung khi cuộn.</p>
<p><b>Yêu cầu:</b> dùng <code>&lt;cdk-virtual-scroll-viewport itemSize="32"&gt;</code> với <code>*cdkVirtualFor</code>. Số <code>.row</code> trong DOM phải dưới 100; khi kiểm tra tự cuộn xuống cuối thì phải thấy <code>Dòng 5000</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <div class="list" style="height: 240px; overflow: auto">
      @for (n of rows; track n) {
        <div class="row" style="height: 32px">Dòng {{ n }}</div>
      }
    </div>
  \`,
})
class App {
  rows = Array.from({ length: 5000 }, (_, i) => i + 1);
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf],
  template: \`
    <cdk-virtual-scroll-viewport class="list" itemSize="32" style="height: 240px; display: block">
      <div class="row" *cdkVirtualFor="let n of rows" style="height: 32px">Dòng {{ n }}</div>
    </cdk-virtual-scroll-viewport>
  \`,
})
class App {
  rows = Array.from({ length: 5000 }, (_, i) => i + 1);
}

mount(App);
`,
    hint: 'imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf]; thay khung bằng <cdk-virtual-scroll-viewport class="list" itemSize="32" style="height: 240px; display: block"> và mỗi dòng là <div class="row" *cdkVirtualFor="let n of rows">.',
    explain: 'itemSize phải đúng chiều cao thật của mỗi dòng. Dòng cao không đều thì cân nhắc phân trang, "tải thêm", hoặc @defer (on viewport) cho từng khối.',
    simulate(s) {
      s.at(300, () => s.dom((r) => {
        r.setAttribute('data-n', String(r.querySelectorAll('.row').length));
        const list = r.querySelector('.list');
        if (list) list.scrollTop = list.scrollHeight;
      }));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const n = Number(a.root()?.getAttribute('data-n') ?? 0);
      if (!n) return NO('Không thấy dòng .row nào.');
      if (n >= 100) return NO('DOM đang có ' + n + ' dòng .row: mọi dòng đều được vẽ.');
      const texts = a.query('.row').map((e) => norm(e.textContent));
      return texts.includes('Dòng 5000') ? OK() : NO('Đã cuộn xuống cuối nhưng chưa thấy "Dòng 5000".');
    },
  },
];

export const LAB: LabModule = {
  title: 'Hiệu năng render',
  subtitle: 'bài luyện đếm và giảm việc vẽ lại: track theo id, computed thay cho method, bỏ Eager để dùng OnPush, debounce khi gõ, virtual scroll cho danh sách dài.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-perf').then((m) => m.perfExtras()),
  cheatsheet: [
    ['Danh sách', '<code>@for (… ; track row.id)</code>'],
    ['Tính toán trong template', '<code>computed()</code> thay cho method'],
    ['Component con', 'OnPush (mặc định từ Angular 22), bỏ <code>Eager</code> khi không cần'],
    ['Gõ nhanh', '<code>toSignal(toObservable(q).pipe(debounceTime(300)))</code>'],
    ['Hàng nghìn dòng', '<code>cdk-virtual-scroll-viewport</code> + <code>*cdkVirtualFor</code>'],
    ['Trước khi tối ưu', 'đo bằng Angular DevTools Profiler'],
  ],
};
