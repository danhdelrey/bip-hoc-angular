import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/** Bài luyện của bài 16 — Content projection: ng-content, nhiều ô, nội dung dự phòng, ng-template, contentChildren. */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Viết component nhận nội dung từ component cha bằng <code>&lt;ng-content /&gt;</code>, nhiều ô với <code>select</code>, hoặc nhận bản vẽ <code>&lt;ng-template&gt;</code> rồi in bằng <code>ngTemplateOutlet</code>.</p>
<div class="tip">Có sẵn: <code>contentChild</code>, <code>contentChildren</code>, <code>TemplateRef</code>, <code>NgTemplateOutlet</code>.</div>`,
    starter: `@Component({
  selector: 'app-card',
  template: \`
    <article class="card">
      <header><ng-content select="[card-title]" /></header>
      <ng-content />
      <footer><ng-content select="[card-actions]">Không có nút</ng-content></footer>
    </article>
  \`,
})
class Card {}

@Component({
  selector: 'app-root',
  imports: [Card],
  template: \`
    <app-card>
      <h3 card-title>Gói Pro</h3>
      <p>99k/tháng, không quảng cáo.</p>
      <button card-actions>Mua</button>
    </app-card>
  \`,
})
class App {}

mount(App);
`,
  },
  {
    id: 'ng-content', group: 'ng-content', title: 'Chừa chỗ cho nội dung: <ng-content />', level: 'Dễ', lv: 1, waitMs: 400,
    desc: `<p>Nội dung viết giữa thẻ mở và thẻ đóng của component (<code>&lt;app-panel&gt;…&lt;/app-panel&gt;</code>) chỉ hiện ra nếu template của component có <code>&lt;ng-content /&gt;</code> ở đúng chỗ muốn đặt. Không có nó, Angular bỏ nội dung đó đi mà không báo lỗi.</p>
<p><b>Yêu cầu:</b> đoạn <code>&lt;p class="body"&gt;</code> mà App truyền vào phải hiện <b>bên trong</b> <code>.panel</code>, dưới tiêu đề.</p>`,
    starter: `@Component({
  selector: 'app-panel',
  template: \`
    <section class="panel">
      <h3>{{ title() }}</h3>
      <!-- TODO: chỗ đặt nội dung của component cha -->
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
    <app-panel title="Thông báo">
      <p class="body">Hệ thống bảo trì lúc 22h tối nay.</p>
    </app-panel>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({
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
    <app-panel title="Thông báo">
      <p class="body">Hệ thống bảo trì lúc 22h tối nay.</p>
    </app-panel>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Thêm <ng-content /> ngay dưới <h3> trong template của Panel.',
    explain: 'Nội dung được chiếu (projected) vẫn thuộc về component cha: binding trong đó đọc dữ liệu của App, không phải của Panel.',
    check(a) {
      if (a.query('.panel .body').length) return OK();
      return NO('Không thấy <p class="body"> bên trong .panel: Panel chưa có <ng-content />.');
    },
  },
  {
    id: 'nhieu-o', group: 'ng-content', title: 'Nhiều ô: select', level: 'Dễ', lv: 1, waitMs: 400,
    desc: `<p>Muốn đặt từng phần nội dung vào chỗ riêng, dùng nhiều <code>&lt;ng-content select="…"&gt;</code>. <code>select</code> nhận CSS selector: thuộc tính (<code>[card-title]</code>), class, tên thẻ. Phần không khớp ô nào rơi vào <code>&lt;ng-content /&gt;</code> không có <code>select</code>. Đặt nhiều <code>&lt;ng-content /&gt;</code> mặc định thì chỉ <b>một</b> ô nhận nội dung.</p>
<p><b>Yêu cầu:</b> tiêu đề (<code>card-title</code>) nằm trong <code>.card-head</code>, đoạn mô tả trong <code>.card-body</code>, nút (<code>card-actions</code>) trong <code>.card-foot</code>.</p>`,
    starter: `@Component({
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
      <h3 card-title>Gói Pro</h3>
      <p>99k/tháng, không quảng cáo.</p>
      <button card-actions>Mua</button>
    </app-card>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({
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
      <h3 card-title>Gói Pro</h3>
      <p>99k/tháng, không quảng cáo.</p>
      <button card-actions>Mua</button>
    </app-card>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Ô đầu: <ng-content select="[card-title]" />, ô cuối: <ng-content select="[card-actions]" />, ô giữa giữ <ng-content /> để nhận phần còn lại.',
    explain: 'Muốn chiếu nhiều phần tử vào cùng một ô mà không cần thẻ bọc, dùng <ng-container card-actions>…</ng-container>. Angular cũng hỗ trợ ngProjectAs khi selector không khớp được trực tiếp.',
    check(a) {
      const head = a.query('.card-head h3').length, body = a.query('.card-body p').length, foot = a.query('.card-foot button').length;
      if (head && body && foot) return OK();
      const where = (sel: string) => ['.card-head', '.card-body', '.card-foot'].find((c) => a.query(c + ' ' + sel).length) ?? 'không ở đâu';
      return NO('Tiêu đề đang ở ' + where('h3') + ', mô tả ở ' + where('p') + ', nút ở ' + where('button') + '.');
    },
  },
  {
    id: 'du-phong', group: 'ng-content', title: 'Nội dung dự phòng', level: 'Dễ', lv: 1, waitMs: 400,
    desc: `<p>Từ Angular 18, có thể viết nội dung <b>bên trong</b> <code>&lt;ng-content&gt;</code>: nó chỉ hiện khi component cha không truyền gì vào ô đó. Không cần thêm input hay <code>@if</code> để kiểm tra "có nội dung chưa".</p>
<p><b>Yêu cầu:</b> hộp thoại thứ nhất giữ nút <b>Xoá</b> mà App truyền vào (không hiện nút mặc định); hộp thoại thứ hai không truyền nút nào nên hiện nút mặc định <code>&lt;button class="close"&gt;Đóng&lt;/button&gt;</code>.</p>`,
    starter: `@Component({
  selector: 'app-dialog',
  template: \`
    <div class="dialog">
      <ng-content />
      <!-- TODO: nếu cha không truyền [actions] thì hiện <button class="close">Đóng</button> -->
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
      <p>Xoá 3 tệp đã chọn?</p>
      <button actions class="danger">Xoá</button>
    </app-dialog>
    <app-dialog>
      <p>Đã lưu thay đổi.</p>
    </app-dialog>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({
  selector: 'app-dialog',
  template: \`
    <div class="dialog">
      <ng-content />
      <footer class="actions">
        <ng-content select="[actions]">
          <button class="close">Đóng</button>
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
      <p>Xoá 3 tệp đã chọn?</p>
      <button actions class="danger">Xoá</button>
    </app-dialog>
    <app-dialog>
      <p>Đã lưu thay đổi.</p>
    </app-dialog>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Đổi thành <ng-content select="[actions]"><button class="close">Đóng</button></ng-content>.',
    explain: 'Nội dung dự phòng thuộc về component con (Dialog), nên binding trong đó đọc dữ liệu của Dialog.',
    check(a) {
      const [d1, d2] = a.query('.dialog');
      if (!d1 || !d2) return NO('Cần đủ hai hộp thoại.');
      if (!d1.querySelector('.danger')) return NO('Hộp thoại thứ nhất mất nút Xoá của App.');
      if (d1.querySelector('.close')) return NO('Hộp thoại thứ nhất đã có nút riêng, không được hiện thêm nút Đóng mặc định.');
      const c = d2.querySelector('.close');
      return c && norm(c.textContent) === 'Đóng' ? OK() : NO('Hộp thoại thứ hai không truyền nút nào, cần hiện <button class="close">Đóng</button>.');
    },
  },
  {
    id: 'tai-luoi', group: 'ng-template', title: 'Nội dung được chiếu luôn được tạo: dùng ng-template', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Bọc <code>&lt;ng-content /&gt;</code> trong <code>@if</code> chỉ <b>ẩn</b> nội dung. Component được chiếu vào vẫn được component cha <b>tạo ngay</b> (chạy constructor, gọi API…), dù accordion đang đóng. Muốn chỉ tạo khi mở, cha phải truyền một <b>bản vẽ</b> <code>&lt;ng-template&gt;</code>; con lấy nó bằng <code>contentChild(TemplateRef)</code> và tự in khi cần bằng <code>ngTemplateOutlet</code>.</p>
<p><b>Yêu cầu:</b> <code>HeavyChart</code> chỉ được khởi tạo <b>sau khi</b> bấm <b>Mở</b> (log <code>Khởi tạo biểu đồ</code> phải đứng sau log <code>Mở accordion</code>), và biểu đồ hiện ra.</p>`,
    starter: `@Component({ selector: 'app-heavy-chart', template: '<div class="chart">📊 Biểu đồ</div>' })
class HeavyChart {
  constructor() {
    log('Khởi tạo biểu đồ'); // giả sử ở đây gọi API, vẽ canvas…
  }
}

@Component({
  selector: 'app-accordion',
  template: \`
    <button (click)="toggle()">{{ open() ? 'Đóng' : 'Mở' }}</button>
    @if (open()) {
      <ng-content />
    }
  \`,
})
class Accordion {
  open = signal(false);
  toggle() {
    this.open.update((v) => !v);
    log(this.open() ? 'Mở accordion' : 'Đóng accordion');
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
`,
    solution: `@Component({ selector: 'app-heavy-chart', template: '<div class="chart">📊 Biểu đồ</div>' })
class HeavyChart {
  constructor() {
    log('Khởi tạo biểu đồ');
  }
}

@Component({
  selector: 'app-accordion',
  imports: [NgTemplateOutlet],
  template: \`
    <button (click)="toggle()">{{ open() ? 'Đóng' : 'Mở' }}</button>
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
    log(this.open() ? 'Mở accordion' : 'Đóng accordion');
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
`,
    hint: 'App: bọc <app-heavy-chart /> trong <ng-template>. Accordion: content = contentChild(TemplateRef), imports: [NgTemplateOutlet], và thay <ng-content /> bằng <ng-container [ngTemplateOutlet]="content()" />.',
    explain: 'Đây là cách các thư viện như tab, accordion, menu của Angular CDK/Material hoãn tạo nội dung. Với nội dung chỉ cần tải khi xuất hiện, @defer cũng là một lựa chọn.',
    simulate(s) { s.at(300, () => s.click('Mở')); },
    check(a) {
      const iOpen = a.logs.findIndex((l) => l.includes('Mở accordion'));
      const iChart = a.logs.findIndex((l) => l.includes('Khởi tạo biểu đồ'));
      if (iChart < 0) return NO('HeavyChart không được khởi tạo sau khi bấm Mở.');
      if (iOpen < 0 || iChart < iOpen) return NO('HeavyChart được khởi tạo trước khi bấm Mở: nội dung chiếu qua <ng-content> luôn được tạo, @if chỉ ẩn nó đi.');
      return a.query('.chart').length ? OK() : NO('Đã mở mà chưa thấy biểu đồ.');
    },
  },
  {
    id: 'context', group: 'ng-template', title: 'Truyền dữ liệu cho template: context', level: 'Trung bình', lv: 2, waitMs: 400,
    desc: `<p>Component danh sách nhận cách hiển thị mỗi dòng từ cha qua <code>&lt;ng-template let-user let-i="index"&gt;</code>. Các biến <code>let-…</code> lấy giá trị từ <b>context</b> mà con truyền khi in: <code>$implicit</code> gán cho biến <code>let-</code> không tên, các khoá khác gán theo tên. Quên context thì <code>user</code> là <code>undefined</code>.</p>
<p><b>Yêu cầu:</b> danh sách hiện đúng <code>1. An</code>, <code>2. Bình</code>, <code>3. Chi</code> và không có lỗi.</p>`,
    starter: `@Component({
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
  users = [{ id: 1, name: 'An' }, { id: 2, name: 'Bình' }, { id: 3, name: 'Chi' }];
}

mount(App);
`,
    solution: `@Component({
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
  users = [{ id: 1, name: 'An' }, { id: 2, name: 'Bình' }, { id: 3, name: 'Chi' }];
}

mount(App);
`,
    hint: 'Thêm [ngTemplateOutletContext]="{ $implicit: it, index: $index }" vào <ng-container [ngTemplateOutlet]>.',
    explain: 'Có thể viết gọn: *ngTemplateOutlet="row(); context: { $implicit: it, index: $index }". Đặt tên khoá rõ ràng (index, last…) giúp cha biết có những biến nào để dùng.',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Template chưa nhận được context nên user là undefined.');
      const names = a.query('.name').map((e) => norm(e.textContent));
      return names.join('|') === '1. An|2. Bình|3. Chi' ? OK() : NO('Danh sách đang là ' + JSON.stringify(names) + '.');
    },
  },
  {
    id: 'content-children', group: 'Truy vấn nội dung', title: 'Đọc các component được chiếu: contentChildren', level: 'Khó', lv: 3, waitMs: 600,
    desc: `<p>Component <code>Tabs</code> cần biết các <code>&lt;app-tab&gt;</code> mà cha đặt bên trong để vẽ hàng nút. Các tab đó là <b>nội dung được chiếu</b>, không nằm trong template của Tabs, nên <code>viewChildren</code> không thấy chúng; phải dùng <code>contentChildren(Tab)</code>.</p>
<p><b>Yêu cầu:</b> hàng nút hiện đủ 3 tab. Khi kiểm tra, trang bấm <b>Đánh giá</b>; vùng nội dung phải hiện <code>Đánh giá: 5★</code>.</p>`,
    starter: `@Component({
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
  // ❗ các tab nằm trong nội dung được chiếu, không phải trong view của Tabs
  items = viewChildren(Tab);
}

@Component({
  selector: 'app-root',
  imports: [Tabs, Tab],
  template: \`
    <app-tabs>
      <app-tab label="Mô tả">Mô tả: áo mưa siêu nhẹ</app-tab>
      <app-tab label="Đánh giá">Đánh giá: 5★</app-tab>
      <app-tab label="Vận chuyển">Vận chuyển: 2 ngày</app-tab>
    </app-tabs>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({
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
      <app-tab label="Mô tả">Mô tả: áo mưa siêu nhẹ</app-tab>
      <app-tab label="Đánh giá">Đánh giá: 5★</app-tab>
      <app-tab label="Vận chuyển">Vận chuyển: 2 ngày</app-tab>
    </app-tabs>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Đổi items = viewChildren(Tab) thành items = contentChildren(Tab).',
    explain: 'Tab gọi inject(Tabs) được vì trong template của App, <app-tab> nằm trong <app-tabs>: injector của phần tử đi theo cây template nơi nó được khai báo. contentChildren mặc định chỉ tìm con trực tiếp; thêm { descendants: true } để tìm sâu hơn.',
    simulate(s) { s.at(250, () => s.click('Đánh giá')); },
    check(a) {
      const n = a.query('.tab-btn').length;
      if (n !== 3) return NO('Hàng nút đang có ' + n + ' tab, cần 3. viewChildren chỉ thấy phần tử trong template của chính Tabs.');
      const panes = a.query('.pane').map((e) => norm(e.textContent));
      return panes.length === 1 && panes[0] === 'Đánh giá: 5★' ? OK() : NO('Vùng nội dung đang hiện ' + JSON.stringify(panes) + '.');
    },
  },
];

export const LAB: LabModule = {
  title: 'Content projection',
  subtitle: 'bài luyện nhận nội dung từ component cha: ng-content, nhiều ô với select, nội dung dự phòng, ng-template để tạo khi cần, context, contentChildren.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Một ô', '<code>&lt;ng-content /&gt;</code>'],
    ['Nhiều ô', '<code>&lt;ng-content select="[card-title]" /&gt;</code> + một ô không select'],
    ['Dự phòng', '<code>&lt;ng-content select="[actions]"&gt;Mặc định&lt;/ng-content&gt;</code>'],
    ['Tạo khi cần', 'cha truyền <code>&lt;ng-template&gt;</code>, con <code>contentChild(TemplateRef)</code> + <code>ngTemplateOutlet</code>'],
    ['Context', '<code>[ngTemplateOutletContext]="{ $implicit: it, index: $index }"</code>'],
    ['Đọc component được chiếu', '<code>contentChildren(Tab)</code>, không phải <code>viewChildren</code>'],
  ],
};
