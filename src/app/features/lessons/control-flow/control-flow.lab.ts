import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 5 — Control flow & Directive: @if/@else, @if … as, @for + track, @empty,
 * @switch, giữ state khi ẩn ([hidden] thay vì @if), attribute directive tự viết với host.
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử <code>@if</code>, <code>@for</code> (nhớ <code>track</code>), <code>@empty</code>, <code>@switch</code>, <code>@let</code> và viết directive của riêng bạn bằng <code>&#64;Directive</code>.</p>`,
    starter: `@Component({
  selector: 'app-list',
  template: \`
    <button (click)="add()">Thêm</button>
    <button (click)="items.set([])">Xoá hết</button>
    <ul>
      @for (it of items(); track it.id; let i = $index) {
        <li>{{ i + 1 }}. {{ it.name }}</li>
      } @empty {
        <li>(trống)</li>
      }
    </ul>
    @if (items().length > 3) { <p>Danh sách khá dài rồi!</p> }
  \`,
})
class List {
  items = signal([{ id: 1, name: 'Phở' }, { id: 2, name: 'Bún chả' }]);
  add() {
    this.items.update(l => [...l, { id: Date.now(), name: 'Món ' + (l.length + 1) }]);
  }
}

mount(List);
`,
  },
  {
    id: 'if-else', group: 'Điều kiện', title: '@if / @else', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p><code>@if (điều kiện) { … } @else { … }</code> chỉ đưa vào DOM <b>một</b> trong hai khối. Khối còn lại bị gỡ hẳn khỏi DOM (không phải ẩn bằng CSS).</p>
<p><b>Yêu cầu:</b> chưa đăng nhập thì chỉ có <code>.guest</code>; đăng nhập rồi thì chỉ có <code>.hello</code>. Khi kiểm tra, trang bấm <b>Đăng nhập</b>.</p>`,
    starter: `@Component({
  selector: 'app-auth',
  template: \`
    <!-- ❗ cả hai đoạn luôn nằm trong DOM -->
    <p class="hello">Xin chào, Bíp!</p>
    <p class="guest">Bạn chưa đăng nhập.</p>
    <button (click)="loggedIn.set(!loggedIn())">{{ loggedIn() ? 'Đăng xuất' : 'Đăng nhập' }}</button>
  \`,
})
class Auth {
  loggedIn = signal(false);
}

mount(Auth);
`,
    solution: `@Component({
  selector: 'app-auth',
  template: \`
    @if (loggedIn()) {
      <p class="hello">Xin chào, Bíp!</p>
    } @else {
      <p class="guest">Bạn chưa đăng nhập.</p>
    }
    <button (click)="loggedIn.set(!loggedIn())">{{ loggedIn() ? 'Đăng xuất' : 'Đăng nhập' }}</button>
  \`,
})
class Auth {
  loggedIn = signal(false);
}

mount(Auth);
`,
    hint: '@if (loggedIn()) { <p class="hello">…</p> } @else { <p class="guest">…</p> }',
    explain: 'Vì khối bị gỡ khỏi DOM, component bên trong @if bị destroy và tạo lại mỗi lần điều kiện đổi. Nhớ điều này khi khối chứa state (xem bài "Giữ state khi ẩn").',
    simulate(s) {
      s.at(50, () => s.dom((r) => r.setAttribute('data-init', (r.querySelector('.hello') ? 'H' : '') + (r.querySelector('.guest') ? 'G' : ''))));
      s.at(150, () => s.click('Đăng nhập'));
    },
    check(a) {
      const init = a.root()?.getAttribute('data-init');
      if (init !== 'G') return NO('Lúc chưa đăng nhập, giao diện cần chỉ có .guest (đang có: ' + (init || 'không gì') + ').');
      if (a.query('.guest').length) return NO('Đã đăng nhập nhưng .guest vẫn còn trong DOM.');
      if (!a.query('.hello').length) return NO('Đã đăng nhập nhưng chưa thấy .hello.');
      return OK();
    },
  },
  {
    id: 'if-as', group: 'Điều kiện', title: 'Dữ liệu đang tải: @if (x(); as u)', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p>Dữ liệu tải bất đồng bộ ban đầu là <code>null</code>; đọc <code>user().name</code> lúc đó sẽ lỗi. <code>@if (user(); as u) { … } @else { … }</code> chỉ render khi đã có dữ liệu và đặt tên ngắn <code>u</code> cho giá trị.</p>
<p><b>Yêu cầu:</b> trong lúc chờ hiện <code>.loading</code>; có dữ liệu thì hiện <code>.name</code> là <code>Xin chào, Bíp (Hà Nội)</code>. Không được có lỗi.</p>`,
    starter: `@Component({
  selector: 'app-profile',
  template: \`
    <!-- ❗ user() là null trong lúc chờ tải -->
    <p class="name">Xin chào, {{ user().name }} ({{ user().city }})</p>
  \`,
})
class Profile {
  user = signal(null);

  constructor() {
    setTimeout(() => this.user.set({ name: 'Bíp', city: 'Hà Nội' }), 300);
  }
}

mount(Profile);
`,
    solution: `@Component({
  selector: 'app-profile',
  template: \`
    @if (user(); as u) {
      <p class="name">Xin chào, {{ u.name }} ({{ u.city }})</p>
    } @else {
      <p class="loading">Đang tải…</p>
    }
  \`,
})
class Profile {
  user = signal(null);

  constructor() {
    setTimeout(() => this.user.set({ name: 'Bíp', city: 'Hà Nội' }), 300);
  }
}

mount(Profile);
`,
    hint: '@if (user(); as u) { … {{ u.name }} … } @else { <p class="loading">Đang tải…</p> }',
    explain: 'Có thể dùng optional chaining user()?.name, nhưng @if … as vừa tránh lỗi vừa cho chỗ hiển thị trạng thái đang tải. Với dữ liệu từ API, resource()/rxResource() có sẵn isLoading() và error().',
    simulate(s) { s.at(120, () => s.dom((r) => r.setAttribute('data-init', r.querySelector('.loading') ? '1' : '0'))); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Đừng đọc thuộc tính của null.');
      if (a.root()?.getAttribute('data-init') !== '1') return NO('Trong lúc chờ tải chưa thấy .loading.');
      const t = a.text('.name');
      if (t === 'Xin chào, Bíp (Hà Nội)') return OK();
      return NO('.name đang là "' + t + '", cần "Xin chào, Bíp (Hà Nội)".');
    },
  },
  {
    id: 'for-track', group: 'Danh sách', title: '@for: track theo id', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p><code>track</code> cho Angular biết hàng nào là hàng nào. <code>track $index</code> gắn DOM theo <b>vị trí</b>: khi danh sách đổi thứ tự, Angular chỉ đổi chữ mà giữ nguyên các node, nên state trong DOM (ô nhập, focus, animation…) nằm sai hàng. Danh sách có thể sắp xếp/xoá thì hãy track theo id.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang gõ ghi chú <code>ít hành</code> cho món <b>Phở</b> rồi bấm <b>Đảo thứ tự</b>. Ghi chú phải đi theo Phở.</p>`,
    starter: `@Component({
  selector: 'app-menu',
  template: \`
    <ul>
      @for (item of items(); track $index) {
        <li><span class="name">{{ item.name }}</span> <input placeholder="ghi chú" /></li>
      }
    </ul>
    <button (click)="reverse()">Đảo thứ tự</button>
  \`,
})
class Menu {
  items = signal([
    { id: 1, name: 'Phở' },
    { id: 2, name: 'Bún chả' },
    { id: 3, name: 'Bánh mì' },
  ]);

  reverse() {
    this.items.update(list => [...list].reverse());
  }
}

mount(Menu);
`,
    solution: `@Component({
  selector: 'app-menu',
  template: \`
    <ul>
      @for (item of items(); track item.id) {
        <li><span class="name">{{ item.name }}</span> <input placeholder="ghi chú" /></li>
      }
    </ul>
    <button (click)="reverse()">Đảo thứ tự</button>
  \`,
})
class Menu {
  items = signal([
    { id: 1, name: 'Phở' },
    { id: 2, name: 'Bún chả' },
    { id: 3, name: 'Bánh mì' },
  ]);

  reverse() {
    this.items.update(list => [...list].reverse());
  }
}

mount(Menu);
`,
    hint: 'Đổi track $index thành track item.id.',
    explain: 'track item.id còn giúp hiệu năng: khi tải lại dữ liệu từ server (object mới nhưng cùng id), Angular giữ lại node thay vì tạo lại toàn bộ. $index chỉ hợp với danh sách tĩnh, không bao giờ đổi thứ tự.',
    simulate(s) { s.at(100, () => s.type('li input', 'ít hành')); s.at(250, () => s.click('Đảo thứ tự')); },
    check(a) {
      const rows = a.query('li');
      const pho = rows.find((li) => norm(li.querySelector('.name')?.textContent) === 'Phở');
      if (!pho) return NO('Không tìm thấy hàng Phở.');
      if (rows[0] === pho) return NO('Phở vẫn đứng đầu: chưa đảo thứ tự?');
      const note = (pho.querySelector('input') as HTMLInputElement | null)?.value;
      if (note === 'ít hành') return OK();
      return NO('Sau khi đảo, ghi chú "ít hành" không còn ở hàng Phở: DOM đang được gắn theo vị trí ($index).');
    },
  },
  {
    id: 'for-empty', group: 'Danh sách', title: '@for … @empty', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p><code>@empty { … }</code> đặt ngay sau khối <code>@for</code>, chỉ hiện khi danh sách rỗng. Không cần viết thêm <code>@if (list.length === 0)</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang gõ <code>bún</code> (phải còn 2 món), rồi gõ <code>pizza</code>. Lúc đó phải hiện phần tử <code>.empty</code> với chữ <code>Không tìm thấy món nào</code>.</p>`,
    starter: `@Component({
  selector: 'app-search',
  template: \`
    <input placeholder="Tìm món…" (input)="query.set($any($event.target).value)" />
    <ul>
      @for (d of results(); track d) {
        <li>{{ d }}</li>
      }
    </ul>
    <!-- TODO: khi không có kết quả, hiện phần tử .empty "Không tìm thấy món nào" -->
  \`,
})
class Search {
  dishes = ['Phở', 'Bún chả', 'Bánh mì', 'Cơm tấm', 'Bún bò'];
  query = signal('');
  results = computed(() => this.dishes.filter(d => d.toLowerCase().includes(this.query().toLowerCase())));
}

mount(Search);
`,
    solution: `@Component({
  selector: 'app-search',
  template: \`
    <input placeholder="Tìm món…" (input)="query.set($any($event.target).value)" />
    <ul>
      @for (d of results(); track d) {
        <li>{{ d }}</li>
      } @empty {
        <li class="empty">Không tìm thấy món nào</li>
      }
    </ul>
  \`,
})
class Search {
  dishes = ['Phở', 'Bún chả', 'Bánh mì', 'Cơm tấm', 'Bún bò'];
  query = signal('');
  results = computed(() => this.dishes.filter(d => d.toLowerCase().includes(this.query().toLowerCase())));
}

mount(Search);
`,
    hint: 'Ngay sau dấu } đóng của @for, thêm @empty { <li class="empty">Không tìm thấy món nào</li> }.',
    explain: '@for còn có sẵn các biến $index, $first, $last, $even, $odd, $count: @for (d of list; track d.id; let i = $index, last = $last) { … }.',
    simulate(s) {
      s.at(100, () => s.type(0, 'bún'));
      s.at(250, () => s.dom((r) => r.setAttribute('data-mid', String(r.querySelectorAll('li:not(.empty)').length))));
      s.at(300, () => s.type(0, 'pizza'));
    },
    check(a) {
      if (a.root()?.getAttribute('data-mid') !== '2') return NO('Gõ "bún" phải còn đúng 2 món (đừng làm hỏng phần lọc).');
      if (!a.query('.empty').length) return NO('Không còn món nào nhưng chưa thấy phần tử .empty. Dùng @empty.');
      if (!a.text('.empty').includes('Không tìm thấy món nào')) return NO('.empty cần có chữ "Không tìm thấy món nào".');
      return OK();
    },
  },
  {
    id: 'switch', group: 'Điều kiện', title: '@switch cho nhiều trạng thái', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Một giá trị có nhiều trường hợp (idle/loading/ok/error…) thì dùng <code>@switch (x) { @case ('a') { … } @default { … } }</code> thay cho chuỗi <code>@if</code> rời rạc dễ sót trường hợp.</p>
<p><b>Yêu cầu:</b> viết lại bằng <code>@switch</code>: <code>loading</code> → <code>.loading</code>, <code>ok</code> → <code>.ok</code>, <code>error</code> → <code>.err</code> "Có lỗi xảy ra", còn lại (<code>@default</code>) → <code>.idle</code> "Chưa làm gì".</p>`,
    starter: `@Component({
  selector: 'app-status',
  template: \`
    <button (click)="status.set('loading')">Đang tải</button>
    <button (click)="status.set('ok')">Thành công</button>
    <button (click)="status.set('error')">Lỗi</button>
    <div class="box">
      @if (status() === 'loading') { <p class="loading">⏳ Đang tải…</p> }
      @if (status() === 'ok') { <p class="ok">✅ Đã lưu</p> }
      <!-- ❗ thiếu trường hợp error và trường hợp mặc định -->
    </div>
  \`,
})
class Status {
  status = signal('idle');
}

mount(Status);
`,
    solution: `@Component({
  selector: 'app-status',
  template: \`
    <button (click)="status.set('loading')">Đang tải</button>
    <button (click)="status.set('ok')">Thành công</button>
    <button (click)="status.set('error')">Lỗi</button>
    <div class="box">
      @switch (status()) {
        @case ('loading') { <p class="loading">⏳ Đang tải…</p> }
        @case ('ok') { <p class="ok">✅ Đã lưu</p> }
        @case ('error') { <p class="err">Có lỗi xảy ra</p> }
        @default { <p class="idle">Chưa làm gì</p> }
      }
    </div>
  \`,
})
class Status {
  status = signal('idle');
}

mount(Status);
`,
    hint: "@switch (status()) { @case ('loading') { … } @case ('ok') { … } @case ('error') { <p class=\"err\">Có lỗi xảy ra</p> } @default { <p class=\"idle\">Chưa làm gì</p> } }",
    explain: '@switch so sánh bằng ===. Khi trạng thái là union type trong TypeScript, Angular có thể kiểm tra bạn đã xử lý đủ mọi @case (exhaustive check với @default never;).',
    simulate(s) {
      s.at(50, () => s.dom((r) => r.setAttribute('data-init', r.querySelector('.idle') ? '1' : '0')));
      s.at(150, () => s.click('Lỗi'));
    },
    check(a, code) {
      if (a.root()?.getAttribute('data-init') !== '1') return NO('Lúc đầu (status = idle) cần hiện .idle "Chưa làm gì".');
      if (a.text('.err') !== 'Có lỗi xảy ra') return NO('Bấm Lỗi nhưng chưa thấy .err "Có lỗi xảy ra".');
      if (a.query('.idle, .ok, .loading').length) return NO('Đang ở trạng thái lỗi nhưng vẫn còn khối của trạng thái khác.');
      if (!/@switch/.test(code)) return NO('Kết quả đúng, nhưng hãy viết bằng @switch.');
      return OK();
    },
  },
  {
    id: 'giu-state', group: 'Điều kiện', title: 'Giữ state khi ẩn: [hidden] thay vì @if', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p><code>@if</code> gỡ component khỏi DOM, nên khi hiện lại thì component được <b>tạo mới</b> và mất hết state. Tab, form đang nhập dở… cần giữ state thì chỉ <b>ẩn</b> bằng <code>[hidden]</code> (hoặc class CSS).</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>+1</b> ba lần ở Tab A, sang Tab B rồi quay lại Tab A. Bộ đếm phải vẫn là <code>Đếm: 3</code>.</p>`,
    starter: `@Component({
  selector: 'app-counter',
  template: '<p class="count">Đếm: {{ n() }}</p><button (click)="n.update(v => v + 1)">+1</button>',
})
class Counter {
  n = signal(0);
}

@Component({
  selector: 'app-tabs',
  imports: [Counter],
  template: \`
    <button (click)="tab.set('a')">Tab A</button>
    <button (click)="tab.set('b')">Tab B</button>
    <!-- ❗ @if gỡ hẳn Counter → quay lại là mất state -->
    @if (tab() === 'a') { <app-counter /> }
    @if (tab() === 'b') { <p class="b">Nội dung tab B</p> }
  \`,
})
class Tabs {
  tab = signal('a');
}

mount(Tabs);
`,
    solution: `@Component({
  selector: 'app-counter',
  template: '<p class="count">Đếm: {{ n() }}</p><button (click)="n.update(v => v + 1)">+1</button>',
})
class Counter {
  n = signal(0);
}

@Component({
  selector: 'app-tabs',
  imports: [Counter],
  template: \`
    <button (click)="tab.set('a')">Tab A</button>
    <button (click)="tab.set('b')">Tab B</button>
    <app-counter [hidden]="tab() !== 'a'" />
    @if (tab() === 'b') { <p class="b">Nội dung tab B</p> }
  \`,
})
class Tabs {
  tab = signal('a');
}

mount(Tabs);
`,
    hint: "Thay @if (tab() === 'a') { <app-counter /> } bằng <app-counter [hidden]=\"tab() !== 'a'\" />.",
    explain: 'Đánh đổi: [hidden] giữ component sống (tốn bộ nhớ, effect vẫn chạy); @if tiết kiệm hơn nhưng mất state. Nếu state quan trọng mà vẫn muốn gỡ khỏi DOM, hãy đưa state lên cha hoặc vào service.',
    simulate(s) {
      [100, 150, 200].forEach((t) => s.at(t, () => s.click('+1')));
      s.at(300, () => s.click('Tab B'));
      s.at(400, () => s.click('Tab A'));
    },
    check(a) {
      const t = a.text('.count');
      if (t === 'Đếm: 3') return OK();
      if (t === 'Đếm: 0') return NO('Quay lại Tab A thì bộ đếm về 0: Counter đã bị huỷ và tạo lại. Dùng [hidden] để chỉ ẩn.');
      return NO('Bộ đếm đang là "' + t + '", cần "Đếm: 3".');
    },
  },
  {
    id: 'directive', group: 'Directive', title: 'Attribute directive tự viết', level: 'Khó', lv: 3, waitMs: 600,
    desc: `<p>Attribute directive gắn hành vi vào phần tử có sẵn. Khai báo bằng <code>&#64;Directive({ selector: '[appHighlight]', host: { … } })</code>: <code>host</code> nghe sự kiện (<code>'(mouseenter)'</code>) và bind thuộc tính/style (<code>'[style.backgroundColor]'</code>) lên chính phần tử đó.</p>
<p><b>Yêu cầu:</b> rê chuột vào <code>.target</code> thì nền thành màu được truyền qua <code>[appHighlight]</code>, rời chuột thì trả lại như cũ.</p>`,
    starter: `@Directive({
  selector: '[appHighlight]',
  // TODO: host lắng nghe mouseenter/mouseleave và bind style.backgroundColor
})
class Highlight {
  color = input('rgb(254, 240, 138)', { alias: 'appHighlight' });
  active = signal(false);
}

@Component({
  selector: 'app-root',
  imports: [Highlight],
  template: '<p class="target" [appHighlight]="\\'rgb(187, 247, 208)\\'">Rê chuột vào đây</p>',
})
class Root {}

mount(Root);
`,
    solution: `@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
    '[style.backgroundColor]': 'active() ? color() : null',
  },
})
class Highlight {
  color = input('rgb(254, 240, 138)', { alias: 'appHighlight' });
  active = signal(false);
}

@Component({
  selector: 'app-root',
  imports: [Highlight],
  template: '<p class="target" [appHighlight]="\\'rgb(187, 247, 208)\\'">Rê chuột vào đây</p>',
})
class Root {}

mount(Root);
`,
    hint: "host: { '(mouseenter)': 'active.set(true)', '(mouseleave)': 'active.set(false)', '[style.backgroundColor]': 'active() ? color() : null' }",
    explain: 'Dùng host trong metadata thay cho @HostListener/@HostBinding kiểu cũ. alias cho phép input trùng tên selector, nhờ vậy viết được [appHighlight]="màu". Directive cũng phải có trong imports của component dùng nó.',
    simulate(s) {
      s.at(100, () => s.hover('.target'));
      s.at(200, () => s.dom((r) => r.setAttribute('data-hover', (r.querySelector('.target') as HTMLElement | null)?.style.backgroundColor ?? '')));
      s.at(300, () => s.hover('.target', true));
    },
    check(a) {
      const hover = a.root()?.getAttribute('data-hover');
      if (hover !== 'rgb(187, 247, 208)') return NO('Rê chuột vào nhưng nền đang là "' + (hover || 'không đổi') + '", cần rgb(187, 247, 208).');
      const after = (a.query('.target')[0] as HTMLElement | undefined)?.style.backgroundColor;
      if (after) return NO('Rời chuột nhưng nền vẫn là ' + after + '.');
      return OK();
    },
  },
];

export const LAB: LabModule = {
  title: 'Control flow & Directive',
  subtitle: 'bài luyện control flow và directive trên component thật: @if/@else, @if … as, @for + track, @empty, @switch, giữ state khi ẩn, attribute directive.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Hiện/gỡ theo điều kiện', '<code>@if (x) { … } @else { … }</code>'],
    ['Dữ liệu có thể null (đang tải)', '<code>@if (user(); as u) { … } @else { Đang tải… }</code>'],
    ['Danh sách', '<code>@for (it of list(); track it.id) { … }</code>'],
    ['Danh sách rỗng', '<code>@empty { … }</code> ngay sau <code>@for</code>'],
    ['Nhiều trạng thái', '<code>@switch (status()) { @case (\'ok\') { … } @default { … } }</code>'],
    ['Ẩn mà vẫn giữ state', '<code>[hidden]="!show()"</code> thay vì <code>@if</code>'],
    ['Gắn hành vi vào phần tử', '<code>&#64;Directive({ selector: \'[appX]\', host: { … } })</code>'],
  ],
};
