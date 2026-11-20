import{a as s$1,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var s=t=>{let n=t.getAttribute(`aria-label`)??``,a=t.getAttribute(`aria-labelledby`),o=a?a.split(/\s+/).map(r=>t.ownerDocument.getElementById(r)?.textContent??``).join(` `):``,l=[...t.querySelectorAll(`.sr-only, .visually-hidden`)].map(r=>r.textContent??``).join(` `);return/[a-zA-ZÀ-ỹ]{2,}/.test(n+` `+o+` `+l)};var b={title:`Accessibility`,subtitle:`bài luyện làm giao diện dùng được bằng bàn phím và trình đọc màn hình: button thật, tên cho nút icon, label, aria-expanded, quản lý focus, tabs của @angular/aria.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Th\u1EED d\xF9ng trang ch\u1EC9 b\u1EB1ng b\xE0n ph\xEDm: <kbd>Tab</kbd> \u0111\u1EC3 \u0111i qua c\xE1c ph\u1EA7n t\u1EED, <kbd>Enter</kbd>/<kbd>Space</kbd> \u0111\u1EC3 b\u1EA5m, ph\xEDm m\u0169i t\xEAn trong nh\xF3m tab. B\xEAn d\u01B0\u1EDBi l\xE0 tabs c\u1EE7a <code>@angular/aria</code>: directive kh\xF4ng k\xE8m giao di\u1EC7n, lo s\u1EB5n role, <code>aria-selected</code>, focus v\xE0 ph\xEDm m\u0169i t\xEAn.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>Tabs</code>, <code>TabList</code>, <code>Tab</code>, <code>TabPanel</code>, <code>TabContent</code> t\u1EEB <code>@angular/aria/tabs</code>.</div>`,starter:`@Component({
  selector: 'app-root',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: \`
    <div ngTabs>
      <ul ngTabList [(selectedTab)]="tab" aria-label="Th\xF4ng tin s\u1EA3n ph\u1EA9m" style="display:flex; gap:6px; list-style:none; padding:0">
        <li ngTab value="mo-ta">M\xF4 t\u1EA3</li>
        <li ngTab value="thong-so">Th\xF4ng s\u1ED1</li>
      </ul>
      <div ngTabPanel value="mo-ta"><ng-template ngTabContent>\xC1o m\u01B0a si\xEAu nh\u1EB9.</ng-template></div>
      <div ngTabPanel value="thong-so"><ng-template ngTabContent>N\u1EB7ng 180g.</ng-template></div>
    </div>
  \`,
})
class App {
  tab = signal('mo-ta');
}

mount(App);
`},{id:`div-button`,group:`Phần tử đúng nghĩa`,title:`Dùng <button>, không dùng div làm nút`,level:`Dễ`,lv:1,waitMs:500,desc:`<p><code>&lt;div (click)&gt;</code> b\u1EA5m \u0111\u01B0\u1EE3c b\u1EB1ng chu\u1ED9t, nh\u01B0ng kh\xF4ng nh\u1EADn focus b\u1EB1ng <kbd>Tab</kbd>, kh\xF4ng ph\u1EA3n h\u1ED3i <kbd>Enter</kbd>/<kbd>Space</kbd>, v\xE0 tr\xECnh \u0111\u1ECDc m\xE0n h\xECnh kh\xF4ng bi\u1EBFt \u0111\xF3 l\xE0 n\xFAt. <code>&lt;button&gt;</code> c\xF3 s\u1EB5n t\u1EA5t c\u1EA3 nh\u1EEFng \u0111i\u1EC1u \u0111\xF3. Th\xEAm <code>role="button"</code> v\xE0o div ch\u1EC9 \u0111\u1ED5i <i>t\xEAn g\u1ECDi</i>, c\xF2n focus v\xE0 ph\xEDm th\xEC v\u1EABn ph\u1EA3i t\u1EF1 l\xE0m.</p>
<p><b>Y\xEAu c\u1EA7u:</b> ph\u1EA7n t\u1EED <code>.like</code> ph\u1EA3i l\xE0 n\xFAt th\u1EADt (ho\u1EB7c t\u1EF1 l\xE0m \u0111\u1EE7: <code>role="button"</code>, <code>tabindex="0"</code>, v\xE0 Enter/Space \u0111\u1EC1u b\u1EA5m \u0111\u01B0\u1EE3c). Khi ki\u1EC3m tra, trang b\u1EA5m v\xE0o n\xF3 m\u1ED9t l\u1EA7n.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <div class="like" (click)="likes.update((n) => n + 1)">\u2665 Th\xEDch</div>
    <p class="count">{{ likes() }} l\u01B0\u1EE3t th\xEDch</p>
  \`,
})
class App {
  likes = signal(0);
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="like" (click)="likes.update((n) => n + 1)">\u2665 Th\xEDch</button>
    <p class="count">{{ likes() }} l\u01B0\u1EE3t th\xEDch</p>
  \`,
})
class App {
  likes = signal(0);
}

mount(App);
`,hint:`Đổi <div class="like" …>…</div> thành <button type="button" class="like" …>…</button>.`,explain:`type="button" tránh việc nút vô tình submit form khi nằm trong <form>. Nút trông khác thì sửa bằng CSS, đừng đổi thẻ.`,simulate(t){t.at(150,()=>t.clickSel(`.like`)),t.at(250,()=>t.press(`.like`,`Enter`)),t.at(300,()=>t.press(`.like`,` `))},check(t){let n=t.query(`.like`)[0];if(!n)return s$1(`Không thấy phần tử .like.`);let a=t.text(`.count`);return n.tagName===`BUTTON`?a.startsWith(`1 `)?i():s$1(`Bấm nút nhưng số lượt thích đang là "`+a+`".`):n.getAttribute(`role`)!==`button`?s$1(`.like đang là <`+n.tagName.toLowerCase()+`>: trình đọc màn hình không biết đây là nút, bàn phím cũng không tới được.`):n.getAttribute(`tabindex`)!==`0`?s$1(`Có role="button" nhưng thiếu tabindex="0": vẫn không Tab tới được.`):a.startsWith(`3 `)?i():s$1(`Bấm chuột, Enter, Space phải ra 3 lượt thích (đang là "`+a+`"). Dùng <button> thì có sẵn tất cả.`)}},{id:`icon-label`,group:`Tên cho phần tử`,title:`Nút chỉ có icon cần tên: aria-label`,level:`Dễ`,lv:1,waitMs:400,desc:`<p>Tr\xECnh \u0111\u1ECDc m\xE0n h\xECnh \u0111\u1ECDc <b>t\xEAn</b> c\u1EE7a n\xFAt. N\xFAt ch\u1EC9 c\xF3 icon (\u{1F5D1}, \u270F\uFE0F, \u22EF) kh\xF4ng c\xF3 ch\u1EEF n\xE0o, n\xEAn n\xF3 b\u1ECB \u0111\u1ECDc l\xE0 "n\xFAt" tr\u1ED1ng tr\u01A1n ho\u1EB7c \u0111\u1ECDc t\xEAn emoji. \u0110\u1EB7t t\xEAn b\u1EB1ng <code>aria-label="Xo\xE1"</code>, ho\u1EB7c th\xEAm ch\u1EEF \u1EA9n b\u1EB1ng class <code>sr-only</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> m\u1ECDi n\xFAt <code>.icon-btn</code> ph\u1EA3i c\xF3 t\xEAn b\u1EB1ng ch\u1EEF m\xF4 t\u1EA3 h\xE0nh \u0111\u1ED9ng.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    @for (f of files; track f) {
      <div class="row">
        {{ f }}
        <button type="button" class="icon-btn">\u270F\uFE0F</button>
        <button type="button" class="icon-btn">\u{1F5D1}</button>
      </div>
    }
  \`,
})
class App {
  files = ['bao-cao.pdf', 'anh.png'];
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    @for (f of files; track f) {
      <div class="row">
        {{ f }}
        <button type="button" class="icon-btn" [attr.aria-label]="'\u0110\u1ED5i t\xEAn ' + f">\u270F\uFE0F</button>
        <button type="button" class="icon-btn" [attr.aria-label]="'Xo\xE1 ' + f">\u{1F5D1}</button>
      </div>
    }
  \`,
})
class App {
  files = ['bao-cao.pdf', 'anh.png'];
}

mount(App);
`,hint:`Th\xEAm aria-label="\u0110\u1ED5i t\xEAn" v\xE0 aria-label="Xo\xE1" (t\u1ED1t h\u01A1n n\u1EEFa: [attr.aria-label]="'Xo\xE1 ' + f" \u0111\u1EC3 bi\u1EBFt xo\xE1 t\u1EC7p n\xE0o).`,explain:`Trong danh sách có nhiều nút "Xoá", đưa tên đối tượng vào nhãn ("Xoá anh.png") giúp người dùng trình đọc màn hình không phải đoán. Dùng [attr.aria-label] vì aria-label là thuộc tính HTML, không phải property của phần tử.`,check(t){let n=t.query(`.icon-btn`);if(!n.length)return s$1(`Không thấy nút .icon-btn nào.`);let a=n.filter(o=>!s(o)).length;return a?s$1(a+`/`+n.length+` nút chưa có tên bằng chữ (aria-label hoặc chữ ẩn .sr-only).`):i()}},{id:`label-input`,group:`Tên cho phần tử`,title:`Ô nhập cần label, placeholder không thay được`,level:`Dễ`,lv:1,waitMs:400,desc:`<p><code>placeholder</code> bi\u1EBFn m\u1EA5t khi b\u1EAFt \u0111\u1EA7u g\xF5 v\xE0 nhi\u1EC1u tr\xECnh \u0111\u1ECDc m\xE0n h\xECnh kh\xF4ng coi n\xF3 l\xE0 t\xEAn c\u1EE7a \xF4. M\u1ED7i \xF4 nh\u1EADp c\u1EA7n m\u1ED9t <code>&lt;label&gt;</code>: g\u1EAFn b\u1EB1ng <code>for</code>/<code>id</code>, ho\u1EB7c b\u1ECDc \xF4 nh\u1EADp b\xEAn trong label. B\u1EA5m v\xE0o label c\u0169ng \u0111\u01B0a focus v\xE0o \xF4, v\xF9ng b\u1EA5m to h\u01A1n.</p>
<p><b>Y\xEAu c\u1EA7u:</b> c\u1EA3 hai \xF4 nh\u1EADp ph\u1EA3i c\xF3 label (<code>input.labels</code> kh\xF4ng r\u1ED7ng), ho\u1EB7c \xEDt nh\u1EA5t c\xF3 <code>aria-label</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <form class="login">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="M\u1EADt kh\u1EA9u" />
      <button type="submit">\u0110\u0103ng nh\u1EADp</button>
    </form>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <form class="login">
      <label for="email">Email</label>
      <input id="email" type="email" autocomplete="email" />
      <label for="pw">M\u1EADt kh\u1EA9u</label>
      <input id="pw" type="password" autocomplete="current-password" />
      <button type="submit">\u0110\u0103ng nh\u1EADp</button>
    </form>
  \`,
})
class App {}

mount(App);
`,hint:`Thêm <label for="email">Email</label> trước ô email và đặt id="email" cho ô đó; làm tương tự cho mật khẩu.`,explain:`id phải duy nhất trên cả trang; trong component dùng lại nhiều lần, bọc ô nhập trong <label> sẽ không cần id. autocomplete giúp trình quản lý mật khẩu điền đúng ô.`,check(t){let n=t.query(`.login input`);if(n.length<2)return s$1(`Cần đủ hai ô nhập.`);let a=n.filter(o=>!(o.labels?.length&&g(o.labels[0].textContent))&&!s(o));return a.length?s$1(`Ô `+a.map(o=>o.type).join(`, `)+` chưa có label.`):i()}},{id:`aria-expanded`,group:`Trạng thái`,title:`Nút mở/đóng: aria-expanded`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>V\u1EDBi n\xFAt m\u1EDF/\u0111\xF3ng m\u1ED9t v\xF9ng n\u1ED9i dung (c\xE2u h\u1ECFi th\u01B0\u1EDDng g\u1EB7p, menu), ng\u01B0\u1EDDi nh\xECn th\u1EA5y v\xF9ng \u0111\xF3 hi\u1EC7n ra, c\xF2n ng\u01B0\u1EDDi d\xF9ng tr\xECnh \u0111\u1ECDc m\xE0n h\xECnh th\xEC kh\xF4ng. <code>aria-expanded</code> cho bi\u1EBFt v\xF9ng \u0111ang m\u1EDF hay \u0111\xF3ng; <code>aria-controls</code> tr\u1ECF t\u1EDBi <code>id</code> c\u1EE7a v\xF9ng \u0111\xF3.</p>
<p><b>Y\xEAu c\u1EA7u:</b> n\xFAt <code>.faq-btn</code> c\xF3 <code>aria-expanded="false"</code> l\xFAc \u0111\u1EA7u v\xE0 <code>"true"</code> sau khi b\u1EA5m; <code>aria-controls</code> tr\u1ECF t\u1EDBi v\xF9ng tr\u1EA3 l\u1EDDi \u0111ang hi\u1EC7n.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="faq-btn" (click)="open.set(!open())">\u0110\u1ED5i tr\u1EA3 trong bao l\xE2u?</button>
    @if (open()) {
      <div class="faq-answer">Trong 30 ng\xE0y, mi\u1EC5n ph\xED.</div>
    }
  \`,
})
class App {
  open = signal(false);
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="faq-btn" (click)="open.set(!open())"
            [attr.aria-expanded]="open()" aria-controls="faq-1">
      \u0110\u1ED5i tr\u1EA3 trong bao l\xE2u?
    </button>
    @if (open()) {
      <div class="faq-answer" id="faq-1">Trong 30 ng\xE0y, mi\u1EC5n ph\xED.</div>
    }
  \`,
})
class App {
  open = signal(false);
}

mount(App);
`,hint:`Trên nút: [attr.aria-expanded]="open()" aria-controls="faq-1"; trên vùng trả lời: id="faq-1".`,explain:`[attr.aria-expanded]="open()" sinh ra chuỗi "true"/"false" đúng như ARIA yêu cầu. Đừng dùng [attr.aria-expanded]="open() || null": khi đóng, thuộc tính bị xoá và trình đọc màn hình không còn biết đây là nút mở/đóng.`,simulate(t){t.at(150,()=>t.dom(n=>n.setAttribute(`data-truoc`,n.querySelector(`.faq-btn`)?.getAttribute(`aria-expanded`)??`(không có)`))),t.at(200,()=>t.click(`Đổi trả`))},check(t){let n=t.query(`.faq-btn`)[0];if(!n)return s$1(`Không thấy .faq-btn.`);let a=t.root()?.getAttribute(`data-truoc`);if(a!==`false`)return s$1(`Lúc đầu aria-expanded đang là `+a+`, cần "false".`);if(n.getAttribute(`aria-expanded`)!==`true`)return s$1(`Sau khi bấm, aria-expanded cần là "true".`);let o=n.getAttribute(`aria-controls`);return(o?t.root()?.querySelector(`#`+CSS.escape(o)):null)?.classList.contains(`faq-answer`)?i():s$1(`aria-controls cần trỏ tới id của vùng .faq-answer.`)}},{id:`focus`,group:`Focus`,title:`Đưa focus vào hộp thoại và trả lại khi đóng`,level:`Khó`,lv:3,waitMs:800,desc:`<p>M\u1EDF h\u1ED9p tho\u1EA1i m\xE0 focus v\u1EABn \u1EDF n\xFAt b\xEAn d\u01B0\u1EDBi th\xEC ng\u01B0\u1EDDi d\xF9ng b\xE0n ph\xEDm ph\u1EA3i Tab m\xF2 m\u1EABm, tr\xECnh \u0111\u1ECDc m\xE0n h\xECnh c\u0169ng kh\xF4ng bi\u1EBFt h\u1ED9p tho\u1EA1i \u0111\xE3 m\u1EDF. Quy t\u1EAFc: khi m\u1EDF, \u0111\u01B0a focus v\xE0o ph\u1EA7n t\u1EED \u0111\u1EA7u ti\xEAn trong h\u1ED9p tho\u1EA1i; khi \u0111\xF3ng, tr\u1EA3 focus v\u1EC1 n\xFAt \u0111\xE3 m\u1EDF n\xF3.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>\u0110\u1ED5i t\xEAn</b> th\xEC focus n\u1EB1m \u1EDF \xF4 nh\u1EADp trong h\u1ED9p tho\u1EA1i; b\u1EA5m <b>Hu\u1EF7</b> th\xEC focus quay v\u1EC1 n\xFAt <b>\u0110\u1ED5i t\xEAn</b>. \xD4 nh\u1EADp ch\u1EC9 c\xF3 trong DOM sau khi h\u1ED9p tho\u1EA1i \u0111\u01B0\u1EE3c v\u1EBD, n\xEAn ph\u1EA3i focus <i>sau</i> l\u1EA7n render \u0111\xF3 (<code>afterNextRender</code>).</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="opener" #opener (click)="open()">\u0110\u1ED5i t\xEAn</button>
    @if (isOpen()) {
      <div class="dialog" role="dialog" aria-label="\u0110\u1ED5i t\xEAn t\u1EC7p">
        <input class="name" #nameInput value="bao-cao.pdf" aria-label="T\xEAn t\u1EC7p" />
        <button type="button" (click)="close()">Hu\u1EF7</button>
      </div>
    }
  \`,
})
class App {
  isOpen = signal(false);
  nameInput = viewChild('nameInput');
  opener = viewChild('opener');

  open() {
    this.isOpen.set(true);
    // TODO: \u0111\u01B0a focus v\xE0o \xF4 nh\u1EADp sau khi h\u1ED9p tho\u1EA1i \u0111\u01B0\u1EE3c v\u1EBD
  }

  close() {
    this.isOpen.set(false);
    // TODO: tr\u1EA3 focus v\u1EC1 n\xFAt \u0110\u1ED5i t\xEAn
  }
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="opener" #opener (click)="open()">\u0110\u1ED5i t\xEAn</button>
    @if (isOpen()) {
      <div class="dialog" role="dialog" aria-label="\u0110\u1ED5i t\xEAn t\u1EC7p">
        <input class="name" #nameInput value="bao-cao.pdf" aria-label="T\xEAn t\u1EC7p" />
        <button type="button" (click)="close()">Hu\u1EF7</button>
      </div>
    }
  \`,
})
class App {
  isOpen = signal(false);
  nameInput = viewChild('nameInput');
  opener = viewChild('opener');
  private injector = inject(Injector);

  open() {
    this.isOpen.set(true);
    afterNextRender(() => this.nameInput()?.nativeElement.focus(), { injector: this.injector });
  }

  close() {
    this.isOpen.set(false);
    this.opener()?.nativeElement.focus();
  }
}

mount(App);
`,hint:`Inject Injector; trong open(): afterNextRender(() => this.nameInput()?.nativeElement.focus(), { injector: this.injector }); trong close(): this.opener()?.nativeElement.focus().`,explain:`Hộp thoại thật còn cần giữ focus bên trong (focus trap) và đóng bằng Esc. Thẻ <dialog> với showModal() hoặc Dialog của Angular CDK làm sẵn những việc này.`,simulate(t){t.at(150,()=>t.dom(n=>n.querySelector(`.opener`)?.focus())),t.at(200,()=>t.click(`Đổi tên`)),t.at(400,()=>t.dom(n=>n.setAttribute(`data-f1`,document.activeElement?.className??``))),t.at(450,()=>t.click(`Huỷ`))},check(t){if(t.errors.length)return s$1(`Có lỗi: `+t.errMsg());let n=t.root()?.getAttribute(`data-f1`)??``;return n.split(` `).includes(`name`)?document.activeElement?.classList.contains(`opener`)?i():s$1(`Sau khi bấm Huỷ, focus cần quay về nút Đổi tên.`):s$1(`Sau khi mở hộp thoại, focus cần ở ô nhập .name (đang ở "`+(n||`body`)+`").`)}},{id:`aria-tabs`,group:`Angular Aria`,title:`Tabs đúng chuẩn với @angular/aria`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>Tabs t\u1EF1 l\xE0m b\u1EB1ng <code>div (click)</code> th\u01B0\u1EDDng thi\u1EBFu \u0111\u1EE7 th\u1EE9: role <code>tablist</code>/<code>tab</code>/<code>tabpanel</code>, <code>aria-selected</code>, ch\u1EC9 m\u1ED9t tab n\u1EB1m trong th\u1EE9 t\u1EF1 Tab, v\xE0 ph\xEDm \u2190 \u2192 \u0111\u1EC3 chuy\u1EC3n tab. Directive tabs c\u1EE7a <code>@angular/aria</code> lo h\u1EBFt ph\u1EA7n \u0111\xF3; b\u1EA1n ch\u1EC9 lo giao di\u1EC7n.</p>
<p><b>Y\xEAu c\u1EA7u:</b> d\xF9ng <code>ngTabs</code>, <code>ngTabList</code>, <code>ngTab</code>, <code>ngTabPanel</code>. Khi ki\u1EC3m tra, trang \u0111\u1EB7t focus v\xE0o tab <b>M\xF4 t\u1EA3</b> v\xE0 nh\u1EA5n <kbd>\u2192</kbd>: tab <b>Th\xF4ng s\u1ED1</b> ph\u1EA3i \u0111\u01B0\u1EE3c ch\u1ECDn (<code>aria-selected="true"</code>) v\xE0 hi\u1EC7n <code>N\u1EB7ng 180g</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <div class="tabs">
      <div class="tab" (click)="tab.set('mo-ta')">M\xF4 t\u1EA3</div>
      <div class="tab" (click)="tab.set('thong-so')">Th\xF4ng s\u1ED1</div>
    </div>
    @if (tab() === 'mo-ta') { <div class="panel">\xC1o m\u01B0a si\xEAu nh\u1EB9.</div> }
    @if (tab() === 'thong-so') { <div class="panel">N\u1EB7ng 180g.</div> }
  \`,
})
class App {
  tab = signal('mo-ta');
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: \`
    <div ngTabs>
      <ul ngTabList [(selectedTab)]="tab" aria-label="Th\xF4ng tin s\u1EA3n ph\u1EA9m">
        <li ngTab value="mo-ta">M\xF4 t\u1EA3</li>
        <li ngTab value="thong-so">Th\xF4ng s\u1ED1</li>
      </ul>
      <div ngTabPanel value="mo-ta"><ng-template ngTabContent>\xC1o m\u01B0a si\xEAu nh\u1EB9.</ng-template></div>
      <div ngTabPanel value="thong-so"><ng-template ngTabContent>N\u1EB7ng 180g.</ng-template></div>
    </div>
  \`,
})
class App {
  tab = signal('mo-ta');
}

mount(App);
`,hint:`imports: [Tabs, TabList, Tab, TabPanel, TabContent]; bọc trong <div ngTabs>, hàng tab là <ul ngTabList [(selectedTab)]="tab">, mỗi tab <li ngTab value="…">, mỗi panel <div ngTabPanel value="…"><ng-template ngTabContent>…</ng-template></div>.`,explain:`Mặc định selectionMode="follow": tab được chọn theo focus khi dùng phím mũi tên. Đặt selectionMode="explicit" nếu muốn phải nhấn Enter/Space mới chọn (hợp khi nội dung tab tải chậm).`,simulate(t){t.at(200,()=>t.dom(n=>n.querySelector(`[role=tab]`)?.focus())),t.at(250,()=>t.press(`[role=tab]`,`ArrowRight`))},check(t){if(t.errors.length)return s$1(`Có lỗi: `+t.errMsg());let n=t.query(`[role=tab]`);if(n.length!==2)return s$1(`Không thấy phần tử nào có role="tab": trình đọc màn hình không biết đây là nhóm tab.`);let a=n.find(l=>l.getAttribute(`aria-selected`)===`true`);return g(a?.textContent)!==`Thông số`?s$1(`Nhấn → khi đang ở tab Mô tả cần chọn tab Thông số (đang chọn: `+(g(a?.textContent)||`không có`)+`).`):t.query(`[role=tabpanel]`).map(l=>g(l.textContent)).filter(Boolean).includes(`Nặng 180g.`)?i():s$1(`Chưa hiện nội dung tab Thông số.`)}}],extras:()=>import(`./chunk-BCCm-3JY.js`).then(t=>t.a11yExtras()),cheatsheet:[[`Bấm được`,`<code>&lt;button type="button"&gt;</code>, không phải <code>div (click)</code>`],[`Nút icon`,`<code>aria-label="Xoá anh.png"</code>`],[`Ô nhập`,`<code>&lt;label for="email"&gt;</code> + <code>id="email"</code>`],[`Mở/đóng`,`<code>[attr.aria-expanded]="open()"</code> + <code>aria-controls</code>`],[`Focus sau render`,`<code>afterNextRender(() =&gt; el.focus(), { injector })</code>`],[`Widget phức tạp`,`<code>@angular/aria</code>: tabs, listbox, menu, combobox…`]]};export{b as LAB};