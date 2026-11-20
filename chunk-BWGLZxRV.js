import{a as s$1,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var s={title:`Component`,subtitle:`bài viết component thật (biên dịch JIT, render ngay trong khung trình duyệt): khai báo, state, ghép component, mỗi instance một state, styles/:host, computed.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Vi\u1EBFt component nh\u01B0 trong d\u1EF1 \xE1n th\u1EADt: <code>&#64;Component({ ... }) class App { ... }</code> r\u1ED3i g\u1ECDi <code>mount(App)</code> \u0111\u1EC3 render v\xE0o khung tr\xECnh duy\u1EC7t. M\u1ECDi API c\u1EE7a Angular (<code>signal</code>, <code>computed</code>, <code>input</code>, <code>output</code>\u2026) \u0111\u1EC1u c\xF3 s\u1EB5n, kh\xF4ng c\u1EA7n import.</p>
<div class="tip">Component \u0111\u01B0\u1EE3c bi\xEAn d\u1ECBch JIT ngay trong trang v\xE0 ch\u1EA1y tr\xEAn Angular 22 th\u1EADt. N\xFAt <b>D\u1EEBng</b> s\u1EBD destroy component.</div>`,starter:`@Component({
  selector: 'app-hello',
  template: \`
    <h2>Xin ch\xE0o, {{ name() }}!</h2>
    <button (click)="name.set('B\xEDp')">\u0110\u1ED5i t\xEAn</button>
  \`,
  styles: 'h2 { color: rgb(79, 70, 229); }',
})
class Hello {
  name = signal('Angular');
}

mount(Hello);
`},{id:`component-dau-tien`,group:`Khai báo component`,title:`Component đầu tiên`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>M\u1ED9t component g\u1ED3m <b>class</b> (logic, state) v\xE0 metadata trong <code>&#64;Component</code>: <code>selector</code> (t\xEAn th\u1EBB d\xF9ng trong template kh\xE1c) v\xE0 <code>template</code> (giao di\u1EC7n).</p>
<p><b>Y\xEAu c\u1EA7u:</b> bi\u1EBFn class <code>Hello</code> th\xE0nh component c\xF3 selector <code>app-hello</code>, template hi\u1EC3n th\u1ECB <code>&lt;h2&gt;Xin ch\xE0o, B\xEDp!&lt;/h2&gt;</code>.</p>`,starter:`// TODO: th\xEAm @Component v\u1EDBi selector 'app-hello'
//       v\xE0 template hi\u1EC3n th\u1ECB <h2>Xin ch\xE0o, B\xEDp!</h2>
class Hello {}

mount(Hello);
`,solution:`@Component({
  selector: 'app-hello',
  template: '<h2>Xin ch\xE0o, B\xEDp!</h2>',
})
class Hello {}

mount(Hello);
`,hint:`Đặt @Component({ selector: 'app-hello', template: '<h2>Xin chào, Bíp!</h2>' }) ngay trên dòng class Hello {}.`,explain:`Selector nên có tiền tố (app-, shop-…) để không trùng với thẻ HTML có sẵn hoặc thẻ của thư viện khác. mount() trong lab tương đương việc Angular bootstrap component gốc.`,check(t,e){return t.query(`h2`).length?t.text(`h2`)!==`Xin chào, Bíp!`?s$1(`<h2> đang hiển thị "`+t.text(`h2`)+`", cần "Xin chào, Bíp!".`):/selector\s*:\s*['"]app-hello['"]/.test(e)?i():s$1(`Giao diện đúng, nhưng selector cần là app-hello.`):s$1(`Khung giao diện chưa có <h2>. Bạn đã thêm @Component có template và gọi mount(Hello) chưa?`)}},{id:`state-trong-class`,group:`Khai báo component`,title:`State trong class, hiển thị ở template`,level:`Dễ`,lv:1,waitMs:800,desc:`<p>State c\u1EE7a component l\xE0 c\xE1c field trong class (th\u01B0\u1EDDng l\xE0 <code>signal</code>). Template \u0111\u1ECDc state b\u1EB1ng <code>{{ count() }}</code> v\xE0 g\u1ECDi method qua event binding <code>(click)</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> t\u1EA1o state <code>count</code> v\xE0 method <code>increment()</code>. Khi ki\u1EC3m tra, trang s\u1EBD b\u1EA5m n\xFAt <b>+1</b> ba l\u1EA7n; \u0111o\u1EA1n v\u0103n ph\u1EA3i hi\u1EC7n <code>\u0110\xE3 b\u1EA5m 3 l\u1EA7n</code>.</p>`,starter:`@Component({
  selector: 'app-counter',
  template: \`
    <p>\u0110\xE3 b\u1EA5m 0 l\u1EA7n</p>
    <button>+1</button>
  \`,
})
class Counter {
  // TODO: state count = signal(0) v\xE0 method increment()
}

mount(Counter);
`,solution:`@Component({
  selector: 'app-counter',
  template: \`
    <p>\u0110\xE3 b\u1EA5m {{ count() }} l\u1EA7n</p>
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
`,hint:`count = signal(0); increment() { this.count.update(c => c + 1); } — template dùng {{ count() }} và (click)="increment()".`,explain:`Signal báo cho Angular biết phần nào của template phụ thuộc vào nó, nên khi count đổi chỉ đoạn text đó được cập nhật (không cần zone.js).`,simulate(t){[100,200,300].forEach(e=>t.at(e,()=>t.click(`+1`)))},check(t){let e=t.text(`p`);return e===`Đã bấm 3 lần`?i():e===`Đã bấm 0 lần`?s$1(`Bấm 3 lần nhưng vẫn hiện 0: template chưa đọc count(), hoặc nút chưa có (click).`):s$1(`Đoạn văn đang là "`+e+`", cần "Đã bấm 3 lần".`)}},{id:`ghep-component`,group:`Ghép component`,title:`Dùng component con: imports`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>Component standalone ph\u1EA3i khai b\xE1o trong <code>imports</code> nh\u1EEFng component/directive/pipe m\xE0 template c\u1EE7a n\xF3 d\xF9ng. Thi\u1EBFu khai b\xE1o th\xEC \u1EDF b\u1EA3n production Angular coi <code>&lt;app-product-card&gt;</code> l\xE0 th\u1EBB l\u1EA1 v\xE0 \u0111\u1EC3 tr\u1ED1ng, kh\xF4ng b\xE1o l\u1ED7i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> s\u1EEDa <code>Shop</code> \u0111\u1EC3 hai th\u1EBB <code>&lt;app-product-card&gt;</code> hi\u1EC3n th\u1ECB n\u1ED9i dung c\u1EE7a <code>ProductCard</code>.</p>`,starter:`@Component({
  selector: 'app-product-card',
  template: '<div class="card">\u{1F6CD}\uFE0F S\u1EA3n ph\u1EA9m m\u1EDBi</div>',
  styles: '.card { padding: 8px 12px; border: 1px solid rgb(203, 213, 225); border-radius: 8px; margin: 6px 0; }',
})
class ProductCard {}

@Component({
  selector: 'app-shop',
  // \u2757 template d\xF9ng <app-product-card> nh\u01B0ng Shop ch\u01B0a khai b\xE1o n\xF3
  template: \`
    <h3>C\u1EEDa h\xE0ng c\u1EE7a B\xEDp</h3>
    <app-product-card />
    <app-product-card />
  \`,
})
class Shop {}

mount(Shop);
`,solution:`@Component({
  selector: 'app-product-card',
  template: '<div class="card">\u{1F6CD}\uFE0F S\u1EA3n ph\u1EA9m m\u1EDBi</div>',
  styles: '.card { padding: 8px 12px; border: 1px solid rgb(203, 213, 225); border-radius: 8px; margin: 6px 0; }',
})
class ProductCard {}

@Component({
  selector: 'app-shop',
  imports: [ProductCard],
  template: \`
    <h3>C\u1EEDa h\xE0ng c\u1EE7a B\xEDp</h3>
    <app-product-card />
    <app-product-card />
  \`,
})
class Shop {}

mount(Shop);
`,hint:`Thêm imports: [ProductCard] vào metadata của Shop. ProductCard phải được khai báo phía trên Shop.`,explain:`Ở chế độ dev, Angular báo NG0304 "is not a known element"; bản production thì im lặng. Nếu thấy thẻ component trống trơn, việc đầu tiên là kiểm tra imports.`,check(t){let e=t.query(`app-product-card`);return e.length!==2?s$1(`Cần đúng 2 thẻ <app-product-card> trong giao diện, đang có `+e.length+`.`):t.query(`app-product-card .card`).length?i():s$1(`Thẻ <app-product-card> có trong DOM nhưng trống: Angular chưa biết đó là component. Thêm ProductCard vào imports của Shop.`)}},{id:`moi-instance`,group:`Ghép component`,title:`Mỗi instance một state riêng`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>M\u1ED7i l\u1EA7n d\xF9ng <code>&lt;app-like-card /&gt;</code>, Angular t\u1EA1o m\u1ED9t <b>instance</b> m\u1EDBi c\u1EE7a class. State khai b\xE1o l\xE0 field c\u1EE7a class th\xEC m\u1ED7i instance c\xF3 b\u1EA3n ri\xEAng; state \u0111\u1EB7t ngo\xE0i class (bi\u1EBFn c\u1EE7a module) th\xEC m\u1ECDi instance d\xF9ng chung.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang s\u1EBD b\u1EA5m n\xFAt c\u1EE7a th\u1EBB th\u1EE9 1 r\u1ED3i th\u1EBB th\u1EE9 3. K\u1EBFt qu\u1EA3 ph\u1EA3i l\xE0 <code>\u2764\uFE0F \u0110\xE3 th\xEDch \xB7 \u{1F90D} Th\xEDch \xB7 \u2764\uFE0F \u0110\xE3 th\xEDch</code>.</p>`,starter:`// \u2757 state \u0111\u1EB7t NGO\xC0I class \u2192 m\u1ECDi th\u1EBB d\xF9ng chung m\u1ED9t gi\xE1 tr\u1ECB
const liked = signal(false);

@Component({
  selector: 'app-like-card',
  template: \`
    <div class="card">
      B\xE0i vi\u1EBFt
      <button (click)="toggle()">{{ liked() ? '\u2764\uFE0F \u0110\xE3 th\xEDch' : '\u{1F90D} Th\xEDch' }}</button>
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
`,solution:`@Component({
  selector: 'app-like-card',
  template: \`
    <div class="card">
      B\xE0i vi\u1EBFt
      <button (click)="toggle()">{{ liked() ? '\u2764\uFE0F \u0110\xE3 th\xEDch' : '\u{1F90D} Th\xEDch' }}</button>
    </div>
  \`,
})
class LikeCard {
  liked = signal(false);   // m\u1ED7i instance m\u1ED9t signal ri\xEAng

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
`,hint:`Bỏ const liked ở ngoài, khai báo liked = signal(false) ngay trong class LikeCard.`,explain:`Khi thật sự cần chia sẻ state giữa nhiều component, hãy đưa nó vào một service (bài Dependency Injection) chứ không dùng biến module: service có vòng đời và phạm vi rõ ràng, test được.`,simulate(t){t.at(100,()=>t.clickSel(`app-like-card button`,0)),t.at(250,()=>t.clickSel(`app-like-card button`,2))},check(t){let e=t.query(`app-like-card button`).map(a=>g(a.textContent)),o=[`❤️ Đã thích`,`🤍 Thích`,`❤️ Đã thích`];return JSON.stringify(e)===JSON.stringify(o)?i():e.length===3&&new Set(e).size===1?s$1(`Cả 3 thẻ luôn giống nhau: state đang dùng chung. Hãy khai báo signal làm field của class.`):s$1(`Các nút đang là `+JSON.stringify(e)+`, mong đợi `+JSON.stringify(o)+`.`)}},{id:`styles-host`,group:`Giao diện`,title:`styles và :host`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>CSS trong <code>styles</code> ch\u1EC9 \xE1p d\u1EE5ng cho template c\u1EE7a component \u0111\xF3 (view encapsulation). <code>:host</code> ch\u1ECDn ch\xEDnh th\u1EBB c\u1EE7a component (\u1EDF \u0111\xE2y l\xE0 <code>&lt;app-badge&gt;</code>).</p>
<p><b>Y\xEAu c\u1EA7u:</b> trong <code>Badge</code>, cho <code>:host</code> hi\u1EC3n th\u1ECB <code>inline-block</code>, c\xF3 <code>padding</code> v\xE0 bo g\xF3c (<code>border-radius</code> kh\xE1c 0); <code>.label</code> c\xF3 m\xE0u <code>rgb(220, 38, 38)</code>. Ch\u1EEF <code>.label</code> n\u1EB1m ngo\xE0i component <b>kh\xF4ng \u0111\u01B0\u1EE3c</b> \u0111\u1ED5i m\xE0u.</p>`,starter:`@Component({
  selector: 'app-badge',
  template: '<span class="label">M\u1EDBi</span>',
  // TODO: styles cho :host v\xE0 .label
})
class Badge {}

@Component({
  selector: 'app-page',
  imports: [Badge],
  template: \`
    <p><span class="label">Ch\u1EEF ngo\xE0i component</span></p>
    <app-badge />
  \`,
})
class Page {}

mount(Page);
`,solution:`@Component({
  selector: 'app-badge',
  template: '<span class="label">M\u1EDBi</span>',
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
    <p><span class="label">Ch\u1EEF ngo\xE0i component</span></p>
    <app-badge />
  \`,
})
class Page {}

mount(Page);
`,hint:`styles: ':host { display: inline-block; padding: 4px 10px; border-radius: 999px } .label { color: rgb(220, 38, 38) }'`,explain:`Phần tử host mặc định là inline và không có kích thước riêng, nên component dạng khối thường cần :host { display: block }. Encapsulation giúp .label của Badge không ảnh hưởng tới phần còn lại của trang.`,check(t){let e=t.query(`app-badge`)[0];if(!e)return s$1(`Không thấy <app-badge>. Đừng xoá imports: [Badge] của Page.`);let o=getComputedStyle(e);if(o.display!==`inline-block`)return s$1(`:host đang có display "`+o.display+`", cần "inline-block".`);if(o.borderTopLeftRadius===`0px`)return s$1(`:host chưa được bo góc (border-radius).`);if(o.paddingLeft===`0px`)return s$1(`:host chưa có padding.`);let a=t.query(`app-badge .label`)[0];if(!a||getComputedStyle(a).color!==`rgb(220, 38, 38)`)return s$1(`.label trong Badge chưa có màu rgb(220, 38, 38).`);let i$1=t.query(`p .label`)[0];return i$1&&getComputedStyle(i$1).color===`rgb(220, 38, 38)`?s$1(`Chữ ngoài component cũng bị đổi màu: style đang lọt ra ngoài (ViewEncapsulation.None hoặc ::ng-deep?).`):i()}},{id:`computed-trong-component`,group:`Giao diện`,title:`Giá trị dẫn xuất: computed`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>Field kh\u1EDFi t\u1EA1o b\u1EB1ng m\u1ED9t bi\u1EC3u th\u1EE9c ch\u1EC9 \u0111\u01B0\u1EE3c t\xEDnh <b>m\u1ED9t l\u1EA7n</b> khi t\u1EA1o instance. Gi\xE1 tr\u1ECB ph\u1EE5 thu\u1ED9c v\xE0o state kh\xE1c (h\u1ECD t\xEAn \u0111\u1EA7y \u0111\u1EE7, t\u1ED5ng ti\u1EC1n\u2026) ph\u1EA3i l\xE0 <code>computed</code> \u0111\u1EC3 lu\xF4n c\u1EADp nh\u1EADt.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\u1ED5i t\xEAn th\xE0nh An</b>; ti\xEAu \u0111\u1EC1 ph\u1EA3i th\xE0nh <code>Nguy\u1EC5n An</code>.</p>`,starter:`@Component({
  selector: 'app-user-card',
  template: \`
    <h3>{{ fullName }}</h3>
    <button (click)="firstName.set('An')">\u0110\u1ED5i t\xEAn th\xE0nh An</button>
  \`,
})
class UserCard {
  firstName = signal('B\xEDp');
  lastName = signal('Nguy\u1EC5n');
  // \u2757 ch\u1EC9 \u0111\u01B0\u1EE3c t\xEDnh M\u1ED8T l\u1EA7n khi t\u1EA1o component
  fullName = this.lastName() + ' ' + this.firstName();
}

mount(UserCard);
`,solution:`@Component({
  selector: 'app-user-card',
  template: \`
    <h3>{{ fullName() }}</h3>
    <button (click)="firstName.set('An')">\u0110\u1ED5i t\xEAn th\xE0nh An</button>
  \`,
})
class UserCard {
  firstName = signal('B\xEDp');
  lastName = signal('Nguy\u1EC5n');
  fullName = computed(() => this.lastName() + ' ' + this.firstName());
}

mount(UserCard);
`,hint:`fullName = computed(() => this.lastName() + ' ' + this.firstName()); và nhớ đổi template thành {{ fullName() }}.`,explain:`computed có cache: chỉ tính lại khi firstName hoặc lastName đổi, và chỉ khi có nơi đọc nó. Tránh gọi method nặng trực tiếp trong template; dùng computed thay thế.`,simulate(t){t.at(150,()=>t.click(`Đổi tên`))},check(t){let e=t.text(`h3`);return e===`Nguyễn An`?i():e===`Nguyễn Bíp`?s$1(`Bấm đổi tên nhưng tiêu đề vẫn là "Nguyễn Bíp": fullName chưa phụ thuộc vào signal. Dùng computed().`):s$1(`Tiêu đề đang là "`+e+`", cần "Nguyễn An".`)}}],cheatsheet:[[`Tạo component`,`<code>&#64;Component({ selector, template, styles })</code> trên một class`],[`Dùng component khác trong template`,`thêm vào <code>imports: [...]</code>`],[`State của component`,`field là <code>signal()</code>; đọc trong template bằng <code>count()</code>`],[`Giá trị suy ra từ state`,`<code>computed(() => …)</code>, không tính một lần ở field`],[`Style riêng cho component`,`<code>styles</code> (encapsulated); <code>:host</code> cho chính thẻ component`],[`State dùng chung giữa nhiều component`,`service (bài Dependency Injection), không dùng biến module`]]};export{s as LAB};