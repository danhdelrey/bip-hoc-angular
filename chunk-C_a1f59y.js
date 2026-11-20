import{a as s,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var h={title:`Content projection`,subtitle:`bài luyện nhận nội dung từ component cha: ng-content, nhiều ô với select, nội dung dự phòng, ng-template để tạo khi cần, context, contentChildren.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Vi\u1EBFt component nh\u1EADn n\u1ED9i dung t\u1EEB component cha b\u1EB1ng <code>&lt;ng-content /&gt;</code>, nhi\u1EC1u \xF4 v\u1EDBi <code>select</code>, ho\u1EB7c nh\u1EADn b\u1EA3n v\u1EBD <code>&lt;ng-template&gt;</code> r\u1ED3i in b\u1EB1ng <code>ngTemplateOutlet</code>.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>contentChild</code>, <code>contentChildren</code>, <code>TemplateRef</code>, <code>NgTemplateOutlet</code>.</div>`,starter:`@Component({
  selector: 'app-card',
  template: \`
    <article class="card">
      <header><ng-content select="[card-title]" /></header>
      <ng-content />
      <footer><ng-content select="[card-actions]">Kh\xF4ng c\xF3 n\xFAt</ng-content></footer>
    </article>
  \`,
})
class Card {}

@Component({
  selector: 'app-root',
  imports: [Card],
  template: \`
    <app-card>
      <h3 card-title>G\xF3i Pro</h3>
      <p>99k/th\xE1ng, kh\xF4ng qu\u1EA3ng c\xE1o.</p>
      <button card-actions>Mua</button>
    </app-card>
  \`,
})
class App {}

mount(App);
`},{id:`ng-content`,group:`ng-content`,title:`Chừa chỗ cho nội dung: <ng-content />`,level:`Dễ`,lv:1,waitMs:400,desc:`<p>N\u1ED9i dung vi\u1EBFt gi\u1EEFa th\u1EBB m\u1EDF v\xE0 th\u1EBB \u0111\xF3ng c\u1EE7a component (<code>&lt;app-panel&gt;\u2026&lt;/app-panel&gt;</code>) ch\u1EC9 hi\u1EC7n ra n\u1EBFu template c\u1EE7a component c\xF3 <code>&lt;ng-content /&gt;</code> \u1EDF \u0111\xFAng ch\u1ED7 mu\u1ED1n \u0111\u1EB7t. Kh\xF4ng c\xF3 n\xF3, Angular b\u1ECF n\u1ED9i dung \u0111\xF3 \u0111i m\xE0 kh\xF4ng b\xE1o l\u1ED7i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> \u0111o\u1EA1n <code>&lt;p class="body"&gt;</code> m\xE0 App truy\u1EC1n v\xE0o ph\u1EA3i hi\u1EC7n <b>b\xEAn trong</b> <code>.panel</code>, d\u01B0\u1EDBi ti\xEAu \u0111\u1EC1.</p>`,starter:`@Component({
  selector: 'app-panel',
  template: \`
    <section class="panel">
      <h3>{{ title() }}</h3>
      <!-- TODO: ch\u1ED7 \u0111\u1EB7t n\u1ED9i dung c\u1EE7a component cha -->
    </section>
  \`,
})
class Panel {
  title = input('');
}

@Component({
  selector: 'app-root',
  imports: [Panel],
  template: \`
    <app-panel title="Th\xF4ng b\xE1o">
      <p class="body">H\u1EC7 th\u1ED1ng b\u1EA3o tr\xEC l\xFAc 22h t\u1ED1i nay.</p>
    </app-panel>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({
  selector: 'app-panel',
  template: \`
    <section class="panel">
      <h3>{{ title() }}</h3>
      <ng-content />
    </section>
  \`,
})
class Panel {
  title = input('');
}

@Component({
  selector: 'app-root',
  imports: [Panel],
  template: \`
    <app-panel title="Th\xF4ng b\xE1o">
      <p class="body">H\u1EC7 th\u1ED1ng b\u1EA3o tr\xEC l\xFAc 22h t\u1ED1i nay.</p>
    </app-panel>
  \`,
})
class App {}

mount(App);
`,hint:`Thêm <ng-content /> ngay dưới <h3> trong template của Panel.`,explain:`Nội dung được chiếu (projected) vẫn thuộc về component cha: binding trong đó đọc dữ liệu của App, không phải của Panel.`,check(t){return t.query(`.panel .body`).length?i():s(`Không thấy <p class="body"> bên trong .panel: Panel chưa có <ng-content />.`)}},{id:`nhieu-o`,group:`ng-content`,title:`Nhiều ô: select`,level:`Dễ`,lv:1,waitMs:400,desc:`<p>Mu\u1ED1n \u0111\u1EB7t t\u1EEBng ph\u1EA7n n\u1ED9i dung v\xE0o ch\u1ED7 ri\xEAng, d\xF9ng nhi\u1EC1u <code>&lt;ng-content select="\u2026"&gt;</code>. <code>select</code> nh\u1EADn CSS selector: thu\u1ED9c t\xEDnh (<code>[card-title]</code>), class, t\xEAn th\u1EBB. Ph\u1EA7n kh\xF4ng kh\u1EDBp \xF4 n\xE0o r\u01A1i v\xE0o <code>&lt;ng-content /&gt;</code> kh\xF4ng c\xF3 <code>select</code>. \u0110\u1EB7t nhi\u1EC1u <code>&lt;ng-content /&gt;</code> m\u1EB7c \u0111\u1ECBnh th\xEC ch\u1EC9 <b>m\u1ED9t</b> \xF4 nh\u1EADn n\u1ED9i dung.</p>
<p><b>Y\xEAu c\u1EA7u:</b> ti\xEAu \u0111\u1EC1 (<code>card-title</code>) n\u1EB1m trong <code>.card-head</code>, \u0111o\u1EA1n m\xF4 t\u1EA3 trong <code>.card-body</code>, n\xFAt (<code>card-actions</code>) trong <code>.card-foot</code>.</p>`,starter:`@Component({
  selector: 'app-card',
  template: \`
    <article class="card">
      <header class="card-head"><ng-content /></header>
      <div class="card-body"><ng-content /></div>
      <footer class="card-foot"><ng-content /></footer>
    </article>
  \`,
})
class Card {}

@Component({
  selector: 'app-root',
  imports: [Card],
  template: \`
    <app-card>
      <h3 card-title>G\xF3i Pro</h3>
      <p>99k/th\xE1ng, kh\xF4ng qu\u1EA3ng c\xE1o.</p>
      <button card-actions>Mua</button>
    </app-card>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({
  selector: 'app-card',
  template: \`
    <article class="card">
      <header class="card-head"><ng-content select="[card-title]" /></header>
      <div class="card-body"><ng-content /></div>
      <footer class="card-foot"><ng-content select="[card-actions]" /></footer>
    </article>
  \`,
})
class Card {}

@Component({
  selector: 'app-root',
  imports: [Card],
  template: \`
    <app-card>
      <h3 card-title>G\xF3i Pro</h3>
      <p>99k/th\xE1ng, kh\xF4ng qu\u1EA3ng c\xE1o.</p>
      <button card-actions>Mua</button>
    </app-card>
  \`,
})
class App {}

mount(App);
`,hint:`Ô đầu: <ng-content select="[card-title]" />, ô cuối: <ng-content select="[card-actions]" />, ô giữa giữ <ng-content /> để nhận phần còn lại.`,explain:`Muốn chiếu nhiều phần tử vào cùng một ô mà không cần thẻ bọc, dùng <ng-container card-actions>…</ng-container>. Angular cũng hỗ trợ ngProjectAs khi selector không khớp được trực tiếp.`,check(t){let n=t.query(`.card-head h3`).length,o=t.query(`.card-body p`).length,c=t.query(`.card-foot button`).length;if(n&&o&&c)return i();let p=l=>[`.card-head`,`.card-body`,`.card-foot`].find(r=>t.query(r+` `+l).length)??`không ở đâu`;return s(`Tiêu đề đang ở `+p(`h3`)+`, mô tả ở `+p(`p`)+`, nút ở `+p(`button`)+`.`)}},{id:`du-phong`,group:`ng-content`,title:`Nội dung dự phòng`,level:`Dễ`,lv:1,waitMs:400,desc:`<p>T\u1EEB Angular 18, c\xF3 th\u1EC3 vi\u1EBFt n\u1ED9i dung <b>b\xEAn trong</b> <code>&lt;ng-content&gt;</code>: n\xF3 ch\u1EC9 hi\u1EC7n khi component cha kh\xF4ng truy\u1EC1n g\xEC v\xE0o \xF4 \u0111\xF3. Kh\xF4ng c\u1EA7n th\xEAm input hay <code>@if</code> \u0111\u1EC3 ki\u1EC3m tra "c\xF3 n\u1ED9i dung ch\u01B0a".</p>
<p><b>Y\xEAu c\u1EA7u:</b> h\u1ED9p tho\u1EA1i th\u1EE9 nh\u1EA5t gi\u1EEF n\xFAt <b>Xo\xE1</b> m\xE0 App truy\u1EC1n v\xE0o (kh\xF4ng hi\u1EC7n n\xFAt m\u1EB7c \u0111\u1ECBnh); h\u1ED9p tho\u1EA1i th\u1EE9 hai kh\xF4ng truy\u1EC1n n\xFAt n\xE0o n\xEAn hi\u1EC7n n\xFAt m\u1EB7c \u0111\u1ECBnh <code>&lt;button class="close"&gt;\u0110\xF3ng&lt;/button&gt;</code>.</p>`,starter:`@Component({
  selector: 'app-dialog',
  template: \`
    <div class="dialog">
      <ng-content />
      <!-- TODO: n\u1EBFu cha kh\xF4ng truy\u1EC1n [actions] th\xEC hi\u1EC7n <button class="close">\u0110\xF3ng</button> -->
      <footer class="actions"><ng-content select="[actions]" /></footer>
    </div>
  \`,
})
class Dialog {}

@Component({
  selector: 'app-root',
  imports: [Dialog],
  template: \`
    <app-dialog>
      <p>Xo\xE1 3 t\u1EC7p \u0111\xE3 ch\u1ECDn?</p>
      <button actions class="danger">Xo\xE1</button>
    </app-dialog>
    <app-dialog>
      <p>\u0110\xE3 l\u01B0u thay \u0111\u1ED5i.</p>
    </app-dialog>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({
  selector: 'app-dialog',
  template: \`
    <div class="dialog">
      <ng-content />
      <footer class="actions">
        <ng-content select="[actions]">
          <button class="close">\u0110\xF3ng</button>
        </ng-content>
      </footer>
    </div>
  \`,
})
class Dialog {}

@Component({
  selector: 'app-root',
  imports: [Dialog],
  template: \`
    <app-dialog>
      <p>Xo\xE1 3 t\u1EC7p \u0111\xE3 ch\u1ECDn?</p>
      <button actions class="danger">Xo\xE1</button>
    </app-dialog>
    <app-dialog>
      <p>\u0110\xE3 l\u01B0u thay \u0111\u1ED5i.</p>
    </app-dialog>
  \`,
})
class App {}

mount(App);
`,hint:`Đổi thành <ng-content select="[actions]"><button class="close">Đóng</button></ng-content>.`,explain:`Nội dung dự phòng thuộc về component con (Dialog), nên binding trong đó đọc dữ liệu của Dialog.`,check(t){let[n,o]=t.query(`.dialog`);if(!n||!o)return s(`Cần đủ hai hộp thoại.`);if(!n.querySelector(`.danger`))return s(`Hộp thoại thứ nhất mất nút Xoá của App.`);if(n.querySelector(`.close`))return s(`Hộp thoại thứ nhất đã có nút riêng, không được hiện thêm nút Đóng mặc định.`);let c=o.querySelector(`.close`);return c&&g(c.textContent)===`Đóng`?i():s(`Hộp thoại thứ hai không truyền nút nào, cần hiện <button class="close">Đóng</button>.`)}},{id:`tai-luoi`,group:`ng-template`,title:`Nội dung được chiếu luôn được tạo: dùng ng-template`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>B\u1ECDc <code>&lt;ng-content /&gt;</code> trong <code>@if</code> ch\u1EC9 <b>\u1EA9n</b> n\u1ED9i dung. Component \u0111\u01B0\u1EE3c chi\u1EBFu v\xE0o v\u1EABn \u0111\u01B0\u1EE3c component cha <b>t\u1EA1o ngay</b> (ch\u1EA1y constructor, g\u1ECDi API\u2026), d\xF9 accordion \u0111ang \u0111\xF3ng. Mu\u1ED1n ch\u1EC9 t\u1EA1o khi m\u1EDF, cha ph\u1EA3i truy\u1EC1n m\u1ED9t <b>b\u1EA3n v\u1EBD</b> <code>&lt;ng-template&gt;</code>; con l\u1EA5y n\xF3 b\u1EB1ng <code>contentChild(TemplateRef)</code> v\xE0 t\u1EF1 in khi c\u1EA7n b\u1EB1ng <code>ngTemplateOutlet</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> <code>HeavyChart</code> ch\u1EC9 \u0111\u01B0\u1EE3c kh\u1EDFi t\u1EA1o <b>sau khi</b> b\u1EA5m <b>M\u1EDF</b> (log <code>Kh\u1EDFi t\u1EA1o bi\u1EC3u \u0111\u1ED3</code> ph\u1EA3i \u0111\u1EE9ng sau log <code>M\u1EDF accordion</code>), v\xE0 bi\u1EC3u \u0111\u1ED3 hi\u1EC7n ra.</p>`,starter:`@Component({ selector: 'app-heavy-chart', template: '<div class="chart">\u{1F4CA} Bi\u1EC3u \u0111\u1ED3</div>' })
class HeavyChart {
  constructor() {
    log('Kh\u1EDFi t\u1EA1o bi\u1EC3u \u0111\u1ED3'); // gi\u1EA3 s\u1EED \u1EDF \u0111\xE2y g\u1ECDi API, v\u1EBD canvas\u2026
  }
}

@Component({
  selector: 'app-accordion',
  template: \`
    <button (click)="toggle()">{{ open() ? '\u0110\xF3ng' : 'M\u1EDF' }}</button>
    @if (open()) {
      <ng-content />
    }
  \`,
})
class Accordion {
  open = signal(false);
  toggle() {
    this.open.update((v) => !v);
    log(this.open() ? 'M\u1EDF accordion' : '\u0110\xF3ng accordion');
  }
}

@Component({
  selector: 'app-root',
  imports: [Accordion, HeavyChart],
  template: \`
    <app-accordion>
      <app-heavy-chart />
    </app-accordion>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({ selector: 'app-heavy-chart', template: '<div class="chart">\u{1F4CA} Bi\u1EC3u \u0111\u1ED3</div>' })
class HeavyChart {
  constructor() {
    log('Kh\u1EDFi t\u1EA1o bi\u1EC3u \u0111\u1ED3');
  }
}

@Component({
  selector: 'app-accordion',
  imports: [NgTemplateOutlet],
  template: \`
    <button (click)="toggle()">{{ open() ? '\u0110\xF3ng' : 'M\u1EDF' }}</button>
    @if (open()) {
      <ng-container [ngTemplateOutlet]="content()" />
    }
  \`,
})
class Accordion {
  open = signal(false);
  content = contentChild(TemplateRef);
  toggle() {
    this.open.update((v) => !v);
    log(this.open() ? 'M\u1EDF accordion' : '\u0110\xF3ng accordion');
  }
}

@Component({
  selector: 'app-root',
  imports: [Accordion, HeavyChart],
  template: \`
    <app-accordion>
      <ng-template>
        <app-heavy-chart />
      </ng-template>
    </app-accordion>
  \`,
})
class App {}

mount(App);
`,hint:`App: bọc <app-heavy-chart /> trong <ng-template>. Accordion: content = contentChild(TemplateRef), imports: [NgTemplateOutlet], và thay <ng-content /> bằng <ng-container [ngTemplateOutlet]="content()" />.`,explain:`Đây là cách các thư viện như tab, accordion, menu của Angular CDK/Material hoãn tạo nội dung. Với nội dung chỉ cần tải khi xuất hiện, @defer cũng là một lựa chọn.`,simulate(t){t.at(300,()=>t.click(`Mở`))},check(t){let n=t.logs.findIndex(c=>c.includes(`Mở accordion`)),o=t.logs.findIndex(c=>c.includes(`Khởi tạo biểu đồ`));return o<0?s(`HeavyChart không được khởi tạo sau khi bấm Mở.`):n<0||o<n?s(`HeavyChart được khởi tạo trước khi bấm Mở: nội dung chiếu qua <ng-content> luôn được tạo, @if chỉ ẩn nó đi.`):t.query(`.chart`).length?i():s(`Đã mở mà chưa thấy biểu đồ.`)}},{id:`context`,group:`ng-template`,title:`Truyền dữ liệu cho template: context`,level:`Trung bình`,lv:2,waitMs:400,desc:`<p>Component danh s\xE1ch nh\u1EADn c\xE1ch hi\u1EC3n th\u1ECB m\u1ED7i d\xF2ng t\u1EEB cha qua <code>&lt;ng-template let-user let-i="index"&gt;</code>. C\xE1c bi\u1EBFn <code>let-\u2026</code> l\u1EA5y gi\xE1 tr\u1ECB t\u1EEB <b>context</b> m\xE0 con truy\u1EC1n khi in: <code>$implicit</code> g\xE1n cho bi\u1EBFn <code>let-</code> kh\xF4ng t\xEAn, c\xE1c kho\xE1 kh\xE1c g\xE1n theo t\xEAn. Qu\xEAn context th\xEC <code>user</code> l\xE0 <code>undefined</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> danh s\xE1ch hi\u1EC7n \u0111\xFAng <code>1. An</code>, <code>2. B\xECnh</code>, <code>3. Chi</code> v\xE0 kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:`@Component({
  selector: 'app-data-list',
  imports: [NgTemplateOutlet],
  template: \`
    <ul>
      @for (it of items(); track it.id) {
        <li><ng-container [ngTemplateOutlet]="row()" /></li>
      }
    </ul>
  \`,
})
class DataList {
  items = input([]);
  row = contentChild(TemplateRef);
}

@Component({
  selector: 'app-root',
  imports: [DataList],
  template: \`
    <app-data-list [items]="users">
      <ng-template let-user let-i="index">
        <b class="name">{{ i + 1 }}. {{ user.name }}</b>
      </ng-template>
    </app-data-list>
  \`,
})
class App {
  users = [{ id: 1, name: 'An' }, { id: 2, name: 'B\xECnh' }, { id: 3, name: 'Chi' }];
}

mount(App);
`,solution:`@Component({
  selector: 'app-data-list',
  imports: [NgTemplateOutlet],
  template: \`
    <ul>
      @for (it of items(); track it.id) {
        <li>
          <ng-container [ngTemplateOutlet]="row()" [ngTemplateOutletContext]="{ $implicit: it, index: $index }" />
        </li>
      }
    </ul>
  \`,
})
class DataList {
  items = input([]);
  row = contentChild(TemplateRef);
}

@Component({
  selector: 'app-root',
  imports: [DataList],
  template: \`
    <app-data-list [items]="users">
      <ng-template let-user let-i="index">
        <b class="name">{{ i + 1 }}. {{ user.name }}</b>
      </ng-template>
    </app-data-list>
  \`,
})
class App {
  users = [{ id: 1, name: 'An' }, { id: 2, name: 'B\xECnh' }, { id: 3, name: 'Chi' }];
}

mount(App);
`,hint:`Thêm [ngTemplateOutletContext]="{ $implicit: it, index: $index }" vào <ng-container [ngTemplateOutlet]>.`,explain:`Có thể viết gọn: *ngTemplateOutlet="row(); context: { $implicit: it, index: $index }". Đặt tên khoá rõ ràng (index, last…) giúp cha biết có những biến nào để dùng.`,check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. Template chưa nhận được context nên user là undefined.`);let n=t.query(`.name`).map(o=>g(o.textContent));return n.join(`|`)===`1. An|2. Bình|3. Chi`?i():s(`Danh sách đang là `+JSON.stringify(n)+`.`)}},{id:`content-children`,group:`Truy vấn nội dung`,title:`Đọc các component được chiếu: contentChildren`,level:`Khó`,lv:3,waitMs:600,desc:`<p>Component <code>Tabs</code> c\u1EA7n bi\u1EBFt c\xE1c <code>&lt;app-tab&gt;</code> m\xE0 cha \u0111\u1EB7t b\xEAn trong \u0111\u1EC3 v\u1EBD h\xE0ng n\xFAt. C\xE1c tab \u0111\xF3 l\xE0 <b>n\u1ED9i dung \u0111\u01B0\u1EE3c chi\u1EBFu</b>, kh\xF4ng n\u1EB1m trong template c\u1EE7a Tabs, n\xEAn <code>viewChildren</code> kh\xF4ng th\u1EA5y ch\xFAng; ph\u1EA3i d\xF9ng <code>contentChildren(Tab)</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> h\xE0ng n\xFAt hi\u1EC7n \u0111\u1EE7 3 tab. Khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\xE1nh gi\xE1</b>; v\xF9ng n\u1ED9i dung ph\u1EA3i hi\u1EC7n <code>\u0110\xE1nh gi\xE1: 5\u2605</code>.</p>`,starter:`@Component({
  selector: 'app-tab',
  template: \`@if (active()) { <div class="pane"><ng-content /></div> }\`,
})
class Tab {
  label = input.required();
  private tabs = inject(Tabs);
  active = computed(() => this.tabs.items().indexOf(this) === this.tabs.current());
}

@Component({
  selector: 'app-tabs',
  template: \`
    <nav>
      @for (t of items(); track t) {
        <button class="tab-btn" (click)="current.set($index)">{{ t.label() }}</button>
      }
    </nav>
    <ng-content />
  \`,
})
class Tabs {
  current = signal(0);
  // \u2757 c\xE1c tab n\u1EB1m trong n\u1ED9i dung \u0111\u01B0\u1EE3c chi\u1EBFu, kh\xF4ng ph\u1EA3i trong view c\u1EE7a Tabs
  items = viewChildren(Tab);
}

@Component({
  selector: 'app-root',
  imports: [Tabs, Tab],
  template: \`
    <app-tabs>
      <app-tab label="M\xF4 t\u1EA3">M\xF4 t\u1EA3: \xE1o m\u01B0a si\xEAu nh\u1EB9</app-tab>
      <app-tab label="\u0110\xE1nh gi\xE1">\u0110\xE1nh gi\xE1: 5\u2605</app-tab>
      <app-tab label="V\u1EADn chuy\u1EC3n">V\u1EADn chuy\u1EC3n: 2 ng\xE0y</app-tab>
    </app-tabs>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({
  selector: 'app-tab',
  template: \`@if (active()) { <div class="pane"><ng-content /></div> }\`,
})
class Tab {
  label = input.required();
  private tabs = inject(Tabs);
  active = computed(() => this.tabs.items().indexOf(this) === this.tabs.current());
}

@Component({
  selector: 'app-tabs',
  template: \`
    <nav>
      @for (t of items(); track t) {
        <button class="tab-btn" (click)="current.set($index)">{{ t.label() }}</button>
      }
    </nav>
    <ng-content />
  \`,
})
class Tabs {
  current = signal(0);
  items = contentChildren(Tab);
}

@Component({
  selector: 'app-root',
  imports: [Tabs, Tab],
  template: \`
    <app-tabs>
      <app-tab label="M\xF4 t\u1EA3">M\xF4 t\u1EA3: \xE1o m\u01B0a si\xEAu nh\u1EB9</app-tab>
      <app-tab label="\u0110\xE1nh gi\xE1">\u0110\xE1nh gi\xE1: 5\u2605</app-tab>
      <app-tab label="V\u1EADn chuy\u1EC3n">V\u1EADn chuy\u1EC3n: 2 ng\xE0y</app-tab>
    </app-tabs>
  \`,
})
class App {}

mount(App);
`,hint:`Đổi items = viewChildren(Tab) thành items = contentChildren(Tab).`,explain:`Tab gọi inject(Tabs) được vì trong template của App, <app-tab> nằm trong <app-tabs>: injector của phần tử đi theo cây template nơi nó được khai báo. contentChildren mặc định chỉ tìm con trực tiếp; thêm { descendants: true } để tìm sâu hơn.`,simulate(t){t.at(250,()=>t.click(`Đánh giá`))},check(t){let n=t.query(`.tab-btn`).length;if(n!==3)return s(`Hàng nút đang có `+n+` tab, cần 3. viewChildren chỉ thấy phần tử trong template của chính Tabs.`);let o=t.query(`.pane`).map(c=>g(c.textContent));return o.length===1&&o[0]===`Đánh giá: 5★`?i():s(`Vùng nội dung đang hiện `+JSON.stringify(o)+`.`)}}],cheatsheet:[[`Một ô`,`<code>&lt;ng-content /&gt;</code>`],[`Nhiều ô`,`<code>&lt;ng-content select="[card-title]" /&gt;</code> + một ô không select`],[`Dự phòng`,`<code>&lt;ng-content select="[actions]"&gt;Mặc định&lt;/ng-content&gt;</code>`],[`Tạo khi cần`,`cha truyền <code>&lt;ng-template&gt;</code>, con <code>contentChild(TemplateRef)</code> + <code>ngTemplateOutlet</code>`],[`Context`,`<code>[ngTemplateOutletContext]="{ $implicit: it, index: $index }"</code>`],[`Đọc component được chiếu`,`<code>contentChildren(Tab)</code>, không phải <code>viewChildren</code>`]]};export{h as LAB};