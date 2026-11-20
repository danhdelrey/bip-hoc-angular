import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 1 — Component: khai báo component, state trong class, ghép component (imports),
 * mỗi instance một state, styles + :host, giá trị dẫn xuất bằng computed.
 * Code mẫu dùng \` cho template (escape vì cả chuỗi nằm trong template literal).
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Viết component như trong dự án thật: <code>&#64;Component({ ... }) class App { ... }</code> rồi gọi <code>mount(App)</code> để render vào khung trình duyệt. Mọi API của Angular (<code>signal</code>, <code>computed</code>, <code>input</code>, <code>output</code>…) đều có sẵn, không cần import.</p>
<div class="tip">Component được biên dịch JIT ngay trong trang và chạy trên Angular 22 thật. Nút <b>Dừng</b> sẽ destroy component.</div>`,
    starter: `@Component({
  selector: 'app-hello',
  template: \`
    <h2>Xin chào, {{ name() }}!</h2>
    <button (click)="name.set('Bíp')">Đổi tên</button>
  \`,
  styles: 'h2 { color: rgb(79, 70, 229); }',
})
class Hello {
  name = signal('Angular');
}

mount(Hello);
`,
  },
  {
    id: 'component-dau-tien', group: 'Khai báo component', title: 'Component đầu tiên', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Một component gồm <b>class</b> (logic, state) và metadata trong <code>&#64;Component</code>: <code>selector</code> (tên thẻ dùng trong template khác) và <code>template</code> (giao diện).</p>
<p><b>Yêu cầu:</b> biến class <code>Hello</code> thành component có selector <code>app-hello</code>, template hiển thị <code>&lt;h2&gt;Xin chào, Bíp!&lt;/h2&gt;</code>.</p>`,
    starter: `// TODO: thêm @Component với selector 'app-hello'
//       và template hiển thị <h2>Xin chào, Bíp!</h2>
class Hello {}

mount(Hello);
`,
    solution: `@Component({
  selector: 'app-hello',
  template: '<h2>Xin chào, Bíp!</h2>',
})
class Hello {}

mount(Hello);
`,
    hint: "Đặt @Component({ selector: 'app-hello', template: '<h2>Xin chào, Bíp!</h2>' }) ngay trên dòng class Hello {}.",
    explain: 'Selector nên có tiền tố (app-, shop-…) để không trùng với thẻ HTML có sẵn hoặc thẻ của thư viện khác. mount() trong lab tương đương việc Angular bootstrap component gốc.',
    check(a, code) {
      if (!a.query('h2').length) return NO('Khung giao diện chưa có <h2>. Bạn đã thêm @Component có template và gọi mount(Hello) chưa?');
      if (a.text('h2') !== 'Xin chào, Bíp!') return NO('<h2> đang hiển thị "' + a.text('h2') + '", cần "Xin chào, Bíp!".');
      if (!/selector\s*:\s*['"]app-hello['"]/.test(code)) return NO('Giao diện đúng, nhưng selector cần là app-hello.');
      return OK();
    },
  },
  {
    id: 'state-trong-class', group: 'Khai báo component', title: 'State trong class, hiển thị ở template', level: 'Dễ', lv: 1, waitMs: 800,
    desc: `<p>State của component là các field trong class (thường là <code>signal</code>). Template đọc state bằng <code>{{ count() }}</code> và gọi method qua event binding <code>(click)</code>.</p>
<p><b>Yêu cầu:</b> tạo state <code>count</code> và method <code>increment()</code>. Khi kiểm tra, trang sẽ bấm nút <b>+1</b> ba lần; đoạn văn phải hiện <code>Đã bấm 3 lần</code>.</p>`,
    starter: `@Component({
  selector: 'app-counter',
  template: \`
    <p>Đã bấm 0 lần</p>
    <button>+1</button>
  \`,
})
class Counter {
  // TODO: state count = signal(0) và method increment()
}

mount(Counter);
`,
    solution: `@Component({
  selector: 'app-counter',
  template: \`
    <p>Đã bấm {{ count() }} lần</p>
    <button (click)="increment()">+1</button>
  \`,
})
class Counter {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }
}

mount(Counter);
`,
    hint: 'count = signal(0); increment() { this.count.update(c => c + 1); } — template dùng {{ count() }} và (click)="increment()".',
    explain: 'Signal báo cho Angular biết phần nào của template phụ thuộc vào nó, nên khi count đổi chỉ đoạn text đó được cập nhật (không cần zone.js).',
    simulate(s) { [100, 200, 300].forEach((t) => s.at(t, () => s.click('+1'))); },
    check(a) {
      const t = a.text('p');
      if (t === 'Đã bấm 3 lần') return OK();
      if (t === 'Đã bấm 0 lần') return NO('Bấm 3 lần nhưng vẫn hiện 0: template chưa đọc count(), hoặc nút chưa có (click).');
      return NO('Đoạn văn đang là "' + t + '", cần "Đã bấm 3 lần".');
    },
  },
  {
    id: 'ghep-component', group: 'Ghép component', title: 'Dùng component con: imports', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Component standalone phải khai báo trong <code>imports</code> những component/directive/pipe mà template của nó dùng. Thiếu khai báo thì ở bản production Angular coi <code>&lt;app-product-card&gt;</code> là thẻ lạ và để trống, không báo lỗi.</p>
<p><b>Yêu cầu:</b> sửa <code>Shop</code> để hai thẻ <code>&lt;app-product-card&gt;</code> hiển thị nội dung của <code>ProductCard</code>.</p>`,
    starter: `@Component({
  selector: 'app-product-card',
  template: '<div class="card">🛍️ Sản phẩm mới</div>',
  styles: '.card { padding: 8px 12px; border: 1px solid rgb(203, 213, 225); border-radius: 8px; margin: 6px 0; }',
})
class ProductCard {}

@Component({
  selector: 'app-shop',
  // ❗ template dùng <app-product-card> nhưng Shop chưa khai báo nó
  template: \`
    <h3>Cửa hàng của Bíp</h3>
    <app-product-card />
    <app-product-card />
  \`,
})
class Shop {}

mount(Shop);
`,
    solution: `@Component({
  selector: 'app-product-card',
  template: '<div class="card">🛍️ Sản phẩm mới</div>',
  styles: '.card { padding: 8px 12px; border: 1px solid rgb(203, 213, 225); border-radius: 8px; margin: 6px 0; }',
})
class ProductCard {}

@Component({
  selector: 'app-shop',
  imports: [ProductCard],
  template: \`
    <h3>Cửa hàng của Bíp</h3>
    <app-product-card />
    <app-product-card />
  \`,
})
class Shop {}

mount(Shop);
`,
    hint: 'Thêm imports: [ProductCard] vào metadata của Shop. ProductCard phải được khai báo phía trên Shop.',
    explain: 'Ở chế độ dev, Angular báo NG0304 "is not a known element"; bản production thì im lặng. Nếu thấy thẻ component trống trơn, việc đầu tiên là kiểm tra imports.',
    check(a) {
      const hosts = a.query('app-product-card');
      if (hosts.length !== 2) return NO('Cần đúng 2 thẻ <app-product-card> trong giao diện, đang có ' + hosts.length + '.');
      if (!a.query('app-product-card .card').length) return NO('Thẻ <app-product-card> có trong DOM nhưng trống: Angular chưa biết đó là component. Thêm ProductCard vào imports của Shop.');
      return OK();
    },
  },
  {
    id: 'moi-instance', group: 'Ghép component', title: 'Mỗi instance một state riêng', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Mỗi lần dùng <code>&lt;app-like-card /&gt;</code>, Angular tạo một <b>instance</b> mới của class. State khai báo là field của class thì mỗi instance có bản riêng; state đặt ngoài class (biến của module) thì mọi instance dùng chung.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang sẽ bấm nút của thẻ thứ 1 rồi thẻ thứ 3. Kết quả phải là <code>❤️ Đã thích · 🤍 Thích · ❤️ Đã thích</code>.</p>`,
    starter: `// ❗ state đặt NGOÀI class → mọi thẻ dùng chung một giá trị
const liked = signal(false);

@Component({
  selector: 'app-like-card',
  template: \`
    <div class="card">
      Bài viết
      <button (click)="toggle()">{{ liked() ? '❤️ Đã thích' : '🤍 Thích' }}</button>
    </div>
  \`,
})
class LikeCard {
  liked = liked;

  toggle() {
    this.liked.update(v => !v);
  }
}

@Component({
  selector: 'app-feed',
  imports: [LikeCard],
  template: '<app-like-card /><app-like-card /><app-like-card />',
})
class Feed {}

mount(Feed);
`,
    solution: `@Component({
  selector: 'app-like-card',
  template: \`
    <div class="card">
      Bài viết
      <button (click)="toggle()">{{ liked() ? '❤️ Đã thích' : '🤍 Thích' }}</button>
    </div>
  \`,
})
class LikeCard {
  liked = signal(false);   // mỗi instance một signal riêng

  toggle() {
    this.liked.update(v => !v);
  }
}

@Component({
  selector: 'app-feed',
  imports: [LikeCard],
  template: '<app-like-card /><app-like-card /><app-like-card />',
})
class Feed {}

mount(Feed);
`,
    hint: 'Bỏ const liked ở ngoài, khai báo liked = signal(false) ngay trong class LikeCard.',
    explain: 'Khi thật sự cần chia sẻ state giữa nhiều component, hãy đưa nó vào một service (bài Dependency Injection) chứ không dùng biến module: service có vòng đời và phạm vi rõ ràng, test được.',
    simulate(s) { s.at(100, () => s.clickSel('app-like-card button', 0)); s.at(250, () => s.clickSel('app-like-card button', 2)); },
    check(a) {
      const labels = a.query('app-like-card button').map((b) => norm(b.textContent));
      const want = ['❤️ Đã thích', '🤍 Thích', '❤️ Đã thích'];
      if (JSON.stringify(labels) === JSON.stringify(want)) return OK();
      if (labels.length === 3 && new Set(labels).size === 1) return NO('Cả 3 thẻ luôn giống nhau: state đang dùng chung. Hãy khai báo signal làm field của class.');
      return NO('Các nút đang là ' + JSON.stringify(labels) + ', mong đợi ' + JSON.stringify(want) + '.');
    },
  },
  {
    id: 'styles-host', group: 'Giao diện', title: 'styles và :host', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>CSS trong <code>styles</code> chỉ áp dụng cho template của component đó (view encapsulation). <code>:host</code> chọn chính thẻ của component (ở đây là <code>&lt;app-badge&gt;</code>).</p>
<p><b>Yêu cầu:</b> trong <code>Badge</code>, cho <code>:host</code> hiển thị <code>inline-block</code>, có <code>padding</code> và bo góc (<code>border-radius</code> khác 0); <code>.label</code> có màu <code>rgb(220, 38, 38)</code>. Chữ <code>.label</code> nằm ngoài component <b>không được</b> đổi màu.</p>`,
    starter: `@Component({
  selector: 'app-badge',
  template: '<span class="label">Mới</span>',
  // TODO: styles cho :host và .label
})
class Badge {}

@Component({
  selector: 'app-page',
  imports: [Badge],
  template: \`
    <p><span class="label">Chữ ngoài component</span></p>
    <app-badge />
  \`,
})
class Page {}

mount(Page);
`,
    solution: `@Component({
  selector: 'app-badge',
  template: '<span class="label">Mới</span>',
  styles: \`
    :host {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgb(254, 226, 226);
    }
    .label { color: rgb(220, 38, 38); font-weight: 600; }
  \`,
})
class Badge {}

@Component({
  selector: 'app-page',
  imports: [Badge],
  template: \`
    <p><span class="label">Chữ ngoài component</span></p>
    <app-badge />
  \`,
})
class Page {}

mount(Page);
`,
    hint: "styles: ':host { display: inline-block; padding: 4px 10px; border-radius: 999px } .label { color: rgb(220, 38, 38) }'",
    explain: 'Phần tử host mặc định là inline và không có kích thước riêng, nên component dạng khối thường cần :host { display: block }. Encapsulation giúp .label của Badge không ảnh hưởng tới phần còn lại của trang.',
    check(a) {
      const host = a.query('app-badge')[0];
      if (!host) return NO('Không thấy <app-badge>. Đừng xoá imports: [Badge] của Page.');
      const hs = getComputedStyle(host);
      if (hs.display !== 'inline-block') return NO(':host đang có display "' + hs.display + '", cần "inline-block".');
      if (hs.borderTopLeftRadius === '0px') return NO(':host chưa được bo góc (border-radius).');
      if (hs.paddingLeft === '0px') return NO(':host chưa có padding.');
      const inner = a.query('app-badge .label')[0];
      if (!inner || getComputedStyle(inner).color !== 'rgb(220, 38, 38)') return NO('.label trong Badge chưa có màu rgb(220, 38, 38).');
      const outer = a.query('p .label')[0];
      if (outer && getComputedStyle(outer).color === 'rgb(220, 38, 38)') return NO('Chữ ngoài component cũng bị đổi màu: style đang lọt ra ngoài (ViewEncapsulation.None hoặc ::ng-deep?).');
      return OK();
    },
  },
  {
    id: 'computed-trong-component', group: 'Giao diện', title: 'Giá trị dẫn xuất: computed', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Field khởi tạo bằng một biểu thức chỉ được tính <b>một lần</b> khi tạo instance. Giá trị phụ thuộc vào state khác (họ tên đầy đủ, tổng tiền…) phải là <code>computed</code> để luôn cập nhật.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Đổi tên thành An</b>; tiêu đề phải thành <code>Nguyễn An</code>.</p>`,
    starter: `@Component({
  selector: 'app-user-card',
  template: \`
    <h3>{{ fullName }}</h3>
    <button (click)="firstName.set('An')">Đổi tên thành An</button>
  \`,
})
class UserCard {
  firstName = signal('Bíp');
  lastName = signal('Nguyễn');
  // ❗ chỉ được tính MỘT lần khi tạo component
  fullName = this.lastName() + ' ' + this.firstName();
}

mount(UserCard);
`,
    solution: `@Component({
  selector: 'app-user-card',
  template: \`
    <h3>{{ fullName() }}</h3>
    <button (click)="firstName.set('An')">Đổi tên thành An</button>
  \`,
})
class UserCard {
  firstName = signal('Bíp');
  lastName = signal('Nguyễn');
  fullName = computed(() => this.lastName() + ' ' + this.firstName());
}

mount(UserCard);
`,
    hint: "fullName = computed(() => this.lastName() + ' ' + this.firstName()); và nhớ đổi template thành {{ fullName() }}.",
    explain: 'computed có cache: chỉ tính lại khi firstName hoặc lastName đổi, và chỉ khi có nơi đọc nó. Tránh gọi method nặng trực tiếp trong template; dùng computed thay thế.',
    simulate(s) { s.at(150, () => s.click('Đổi tên')); },
    check(a) {
      const t = a.text('h3');
      if (t === 'Nguyễn An') return OK();
      if (t === 'Nguyễn Bíp') return NO('Bấm đổi tên nhưng tiêu đề vẫn là "Nguyễn Bíp": fullName chưa phụ thuộc vào signal. Dùng computed().');
      return NO('Tiêu đề đang là "' + t + '", cần "Nguyễn An".');
    },
  },
];

export const LAB: LabModule = {
  title: 'Component',
  subtitle: 'bài viết component thật (biên dịch JIT, render ngay trong khung trình duyệt): khai báo, state, ghép component, mỗi instance một state, styles/:host, computed.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Tạo component', '<code>&#64;Component({ selector, template, styles })</code> trên một class'],
    ['Dùng component khác trong template', 'thêm vào <code>imports: [...]</code>'],
    ['State của component', 'field là <code>signal()</code>; đọc trong template bằng <code>count()</code>'],
    ['Giá trị suy ra từ state', '<code>computed(() => …)</code>, không tính một lần ở field'],
    ['Style riêng cho component', '<code>styles</code> (encapsulated); <code>:host</code> cho chính thẻ component'],
    ['State dùng chung giữa nhiều component', 'service (bài Dependency Injection), không dùng biến module'],
  ],
};
