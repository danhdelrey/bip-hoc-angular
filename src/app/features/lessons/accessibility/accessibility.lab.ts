import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 18 — Accessibility. Chấm theo DOM thật: thẻ, thuộc tính ARIA, label, focus (document.activeElement)
 * và phím bấm mô phỏng. Phím mô phỏng là sự kiện tổng hợp: chạy được handler (keydown.enter) nhưng không kích hoạt
 * hành vi mặc định của trình duyệt (Enter trên <button> sinh click), nên với <button> thật bài chấm dựa vào thẻ.
 */
const hasName = (el: Element) => {
  const label = el.getAttribute('aria-label') ?? '';
  const by = el.getAttribute('aria-labelledby');
  const byText = by ? by.split(/\s+/).map((id) => el.ownerDocument.getElementById(id)?.textContent ?? '').join(' ') : '';
  const hidden = [...el.querySelectorAll('.sr-only, .visually-hidden')].map((x) => x.textContent ?? '').join(' ');
  return /[a-zA-ZÀ-ỹ]{2,}/.test(label + ' ' + byText + ' ' + hidden);
};

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử dùng trang chỉ bằng bàn phím: <kbd>Tab</kbd> để đi qua các phần tử, <kbd>Enter</kbd>/<kbd>Space</kbd> để bấm, phím mũi tên trong nhóm tab. Bên dưới là tabs của <code>@angular/aria</code>: directive không kèm giao diện, lo sẵn role, <code>aria-selected</code>, focus và phím mũi tên.</p>
<div class="tip">Có sẵn: <code>Tabs</code>, <code>TabList</code>, <code>Tab</code>, <code>TabPanel</code>, <code>TabContent</code> từ <code>@angular/aria/tabs</code>.</div>`,
    starter: `@Component({
  selector: 'app-root',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: \`
    <div ngTabs>
      <ul ngTabList [(selectedTab)]="tab" aria-label="Thông tin sản phẩm" style="display:flex; gap:6px; list-style:none; padding:0">
        <li ngTab value="mo-ta">Mô tả</li>
        <li ngTab value="thong-so">Thông số</li>
      </ul>
      <div ngTabPanel value="mo-ta"><ng-template ngTabContent>Áo mưa siêu nhẹ.</ng-template></div>
      <div ngTabPanel value="thong-so"><ng-template ngTabContent>Nặng 180g.</ng-template></div>
    </div>
  \`,
})
class App {
  tab = signal('mo-ta');
}

mount(App);
`,
  },
  {
    id: 'div-button', group: 'Phần tử đúng nghĩa', title: 'Dùng <button>, không dùng div làm nút', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p><code>&lt;div (click)&gt;</code> bấm được bằng chuột, nhưng không nhận focus bằng <kbd>Tab</kbd>, không phản hồi <kbd>Enter</kbd>/<kbd>Space</kbd>, và trình đọc màn hình không biết đó là nút. <code>&lt;button&gt;</code> có sẵn tất cả những điều đó. Thêm <code>role="button"</code> vào div chỉ đổi <i>tên gọi</i>, còn focus và phím thì vẫn phải tự làm.</p>
<p><b>Yêu cầu:</b> phần tử <code>.like</code> phải là nút thật (hoặc tự làm đủ: <code>role="button"</code>, <code>tabindex="0"</code>, và Enter/Space đều bấm được). Khi kiểm tra, trang bấm vào nó một lần.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <div class="like" (click)="likes.update((n) => n + 1)">♥ Thích</div>
    <p class="count">{{ likes() }} lượt thích</p>
  \`,
})
class App {
  likes = signal(0);
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="like" (click)="likes.update((n) => n + 1)">♥ Thích</button>
    <p class="count">{{ likes() }} lượt thích</p>
  \`,
})
class App {
  likes = signal(0);
}

mount(App);
`,
    hint: 'Đổi <div class="like" …>…</div> thành <button type="button" class="like" …>…</button>.',
    explain: 'type="button" tránh việc nút vô tình submit form khi nằm trong <form>. Nút trông khác thì sửa bằng CSS, đừng đổi thẻ.',
    simulate(s) {
      s.at(150, () => s.clickSel('.like'));
      s.at(250, () => s.press('.like', 'Enter'));
      s.at(300, () => s.press('.like', ' '));
    },
    check(a) {
      const el = a.query('.like')[0];
      if (!el) return NO('Không thấy phần tử .like.');
      const count = a.text('.count');
      if (el.tagName === 'BUTTON') return count.startsWith('1 ') ? OK() : NO('Bấm nút nhưng số lượt thích đang là "' + count + '".');
      if (el.getAttribute('role') !== 'button') return NO('.like đang là <' + el.tagName.toLowerCase() + '>: trình đọc màn hình không biết đây là nút, bàn phím cũng không tới được.');
      if (el.getAttribute('tabindex') !== '0') return NO('Có role="button" nhưng thiếu tabindex="0": vẫn không Tab tới được.');
      return count.startsWith('3 ') ? OK() : NO('Bấm chuột, Enter, Space phải ra 3 lượt thích (đang là "' + count + '"). Dùng <button> thì có sẵn tất cả.');
    },
  },
  {
    id: 'icon-label', group: 'Tên cho phần tử', title: 'Nút chỉ có icon cần tên: aria-label', level: 'Dễ', lv: 1, waitMs: 400,
    desc: `<p>Trình đọc màn hình đọc <b>tên</b> của nút. Nút chỉ có icon (🗑, ✏️, ⋯) không có chữ nào, nên nó bị đọc là "nút" trống trơn hoặc đọc tên emoji. Đặt tên bằng <code>aria-label="Xoá"</code>, hoặc thêm chữ ẩn bằng class <code>sr-only</code>.</p>
<p><b>Yêu cầu:</b> mọi nút <code>.icon-btn</code> phải có tên bằng chữ mô tả hành động.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    @for (f of files; track f) {
      <div class="row">
        {{ f }}
        <button type="button" class="icon-btn">✏️</button>
        <button type="button" class="icon-btn">🗑</button>
      </div>
    }
  \`,
})
class App {
  files = ['bao-cao.pdf', 'anh.png'];
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    @for (f of files; track f) {
      <div class="row">
        {{ f }}
        <button type="button" class="icon-btn" [attr.aria-label]="'Đổi tên ' + f">✏️</button>
        <button type="button" class="icon-btn" [attr.aria-label]="'Xoá ' + f">🗑</button>
      </div>
    }
  \`,
})
class App {
  files = ['bao-cao.pdf', 'anh.png'];
}

mount(App);
`,
    hint: 'Thêm aria-label="Đổi tên" và aria-label="Xoá" (tốt hơn nữa: [attr.aria-label]="\'Xoá \' + f" để biết xoá tệp nào).',
    explain: 'Trong danh sách có nhiều nút "Xoá", đưa tên đối tượng vào nhãn ("Xoá anh.png") giúp người dùng trình đọc màn hình không phải đoán. Dùng [attr.aria-label] vì aria-label là thuộc tính HTML, không phải property của phần tử.',
    check(a) {
      const btns = a.query('.icon-btn');
      if (!btns.length) return NO('Không thấy nút .icon-btn nào.');
      const bad = btns.filter((b) => !hasName(b)).length;
      return bad ? NO(bad + '/' + btns.length + ' nút chưa có tên bằng chữ (aria-label hoặc chữ ẩn .sr-only).') : OK();
    },
  },
  {
    id: 'label-input', group: 'Tên cho phần tử', title: 'Ô nhập cần label, placeholder không thay được', level: 'Dễ', lv: 1, waitMs: 400,
    desc: `<p><code>placeholder</code> biến mất khi bắt đầu gõ và nhiều trình đọc màn hình không coi nó là tên của ô. Mỗi ô nhập cần một <code>&lt;label&gt;</code>: gắn bằng <code>for</code>/<code>id</code>, hoặc bọc ô nhập bên trong label. Bấm vào label cũng đưa focus vào ô, vùng bấm to hơn.</p>
<p><b>Yêu cầu:</b> cả hai ô nhập phải có label (<code>input.labels</code> không rỗng), hoặc ít nhất có <code>aria-label</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <form class="login">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Mật khẩu" />
      <button type="submit">Đăng nhập</button>
    </form>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <form class="login">
      <label for="email">Email</label>
      <input id="email" type="email" autocomplete="email" />
      <label for="pw">Mật khẩu</label>
      <input id="pw" type="password" autocomplete="current-password" />
      <button type="submit">Đăng nhập</button>
    </form>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Thêm <label for="email">Email</label> trước ô email và đặt id="email" cho ô đó; làm tương tự cho mật khẩu.',
    explain: 'id phải duy nhất trên cả trang; trong component dùng lại nhiều lần, bọc ô nhập trong <label> sẽ không cần id. autocomplete giúp trình quản lý mật khẩu điền đúng ô.',
    check(a) {
      const inputs = a.query('.login input') as HTMLInputElement[];
      if (inputs.length < 2) return NO('Cần đủ hai ô nhập.');
      const bad = inputs.filter((i) => !(i.labels?.length && norm(i.labels[0].textContent)) && !hasName(i));
      return bad.length ? NO('Ô ' + bad.map((i) => i.type).join(', ') + ' chưa có label.') : OK();
    },
  },
  {
    id: 'aria-expanded', group: 'Trạng thái', title: 'Nút mở/đóng: aria-expanded', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Với nút mở/đóng một vùng nội dung (câu hỏi thường gặp, menu), người nhìn thấy vùng đó hiện ra, còn người dùng trình đọc màn hình thì không. <code>aria-expanded</code> cho biết vùng đang mở hay đóng; <code>aria-controls</code> trỏ tới <code>id</code> của vùng đó.</p>
<p><b>Yêu cầu:</b> nút <code>.faq-btn</code> có <code>aria-expanded="false"</code> lúc đầu và <code>"true"</code> sau khi bấm; <code>aria-controls</code> trỏ tới vùng trả lời đang hiện.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="faq-btn" (click)="open.set(!open())">Đổi trả trong bao lâu?</button>
    @if (open()) {
      <div class="faq-answer">Trong 30 ngày, miễn phí.</div>
    }
  \`,
})
class App {
  open = signal(false);
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="faq-btn" (click)="open.set(!open())"
            [attr.aria-expanded]="open()" aria-controls="faq-1">
      Đổi trả trong bao lâu?
    </button>
    @if (open()) {
      <div class="faq-answer" id="faq-1">Trong 30 ngày, miễn phí.</div>
    }
  \`,
})
class App {
  open = signal(false);
}

mount(App);
`,
    hint: 'Trên nút: [attr.aria-expanded]="open()" aria-controls="faq-1"; trên vùng trả lời: id="faq-1".',
    explain: '[attr.aria-expanded]="open()" sinh ra chuỗi "true"/"false" đúng như ARIA yêu cầu. Đừng dùng [attr.aria-expanded]="open() || null": khi đóng, thuộc tính bị xoá và trình đọc màn hình không còn biết đây là nút mở/đóng.',
    simulate(s) {
      s.at(150, () => s.dom((r) => r.setAttribute('data-truoc', r.querySelector('.faq-btn')?.getAttribute('aria-expanded') ?? '(không có)')));
      s.at(200, () => s.click('Đổi trả'));
    },
    check(a) {
      const btn = a.query('.faq-btn')[0];
      if (!btn) return NO('Không thấy .faq-btn.');
      const before = a.root()?.getAttribute('data-truoc');
      if (before !== 'false') return NO('Lúc đầu aria-expanded đang là ' + before + ', cần "false".');
      if (btn.getAttribute('aria-expanded') !== 'true') return NO('Sau khi bấm, aria-expanded cần là "true".');
      const id = btn.getAttribute('aria-controls');
      const panel = id ? a.root()?.querySelector('#' + CSS.escape(id)) : null;
      return panel?.classList.contains('faq-answer') ? OK() : NO('aria-controls cần trỏ tới id của vùng .faq-answer.');
    },
  },
  {
    id: 'focus', group: 'Focus', title: 'Đưa focus vào hộp thoại và trả lại khi đóng', level: 'Khó', lv: 3, waitMs: 800,
    desc: `<p>Mở hộp thoại mà focus vẫn ở nút bên dưới thì người dùng bàn phím phải Tab mò mẫm, trình đọc màn hình cũng không biết hộp thoại đã mở. Quy tắc: khi mở, đưa focus vào phần tử đầu tiên trong hộp thoại; khi đóng, trả focus về nút đã mở nó.</p>
<p><b>Yêu cầu:</b> bấm <b>Đổi tên</b> thì focus nằm ở ô nhập trong hộp thoại; bấm <b>Huỷ</b> thì focus quay về nút <b>Đổi tên</b>. Ô nhập chỉ có trong DOM sau khi hộp thoại được vẽ, nên phải focus <i>sau</i> lần render đó (<code>afterNextRender</code>).</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="opener" #opener (click)="open()">Đổi tên</button>
    @if (isOpen()) {
      <div class="dialog" role="dialog" aria-label="Đổi tên tệp">
        <input class="name" #nameInput value="bao-cao.pdf" aria-label="Tên tệp" />
        <button type="button" (click)="close()">Huỷ</button>
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
    // TODO: đưa focus vào ô nhập sau khi hộp thoại được vẽ
  }

  close() {
    this.isOpen.set(false);
    // TODO: trả focus về nút Đổi tên
  }
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  template: \`
    <button type="button" class="opener" #opener (click)="open()">Đổi tên</button>
    @if (isOpen()) {
      <div class="dialog" role="dialog" aria-label="Đổi tên tệp">
        <input class="name" #nameInput value="bao-cao.pdf" aria-label="Tên tệp" />
        <button type="button" (click)="close()">Huỷ</button>
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
`,
    hint: 'Inject Injector; trong open(): afterNextRender(() => this.nameInput()?.nativeElement.focus(), { injector: this.injector }); trong close(): this.opener()?.nativeElement.focus().',
    explain: 'Hộp thoại thật còn cần giữ focus bên trong (focus trap) và đóng bằng Esc. Thẻ <dialog> với showModal() hoặc Dialog của Angular CDK làm sẵn những việc này.',
    simulate(s) {
      s.at(150, () => s.dom((r) => (r.querySelector('.opener') as HTMLElement | null)?.focus()));
      s.at(200, () => s.click('Đổi tên'));
      s.at(400, () => s.dom((r) => r.setAttribute('data-f1', (document.activeElement as HTMLElement | null)?.className ?? '')));
      s.at(450, () => s.click('Huỷ'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const f1 = a.root()?.getAttribute('data-f1') ?? '';
      if (!f1.split(' ').includes('name')) return NO('Sau khi mở hộp thoại, focus cần ở ô nhập .name (đang ở "' + (f1 || 'body') + '").');
      const f2 = document.activeElement as HTMLElement | null;
      return f2?.classList.contains('opener') ? OK() : NO('Sau khi bấm Huỷ, focus cần quay về nút Đổi tên.');
    },
  },
  {
    id: 'aria-tabs', group: 'Angular Aria', title: 'Tabs đúng chuẩn với @angular/aria', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Tabs tự làm bằng <code>div (click)</code> thường thiếu đủ thứ: role <code>tablist</code>/<code>tab</code>/<code>tabpanel</code>, <code>aria-selected</code>, chỉ một tab nằm trong thứ tự Tab, và phím ← → để chuyển tab. Directive tabs của <code>@angular/aria</code> lo hết phần đó; bạn chỉ lo giao diện.</p>
<p><b>Yêu cầu:</b> dùng <code>ngTabs</code>, <code>ngTabList</code>, <code>ngTab</code>, <code>ngTabPanel</code>. Khi kiểm tra, trang đặt focus vào tab <b>Mô tả</b> và nhấn <kbd>→</kbd>: tab <b>Thông số</b> phải được chọn (<code>aria-selected="true"</code>) và hiện <code>Nặng 180g</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  template: \`
    <div class="tabs">
      <div class="tab" (click)="tab.set('mo-ta')">Mô tả</div>
      <div class="tab" (click)="tab.set('thong-so')">Thông số</div>
    </div>
    @if (tab() === 'mo-ta') { <div class="panel">Áo mưa siêu nhẹ.</div> }
    @if (tab() === 'thong-so') { <div class="panel">Nặng 180g.</div> }
  \`,
})
class App {
  tab = signal('mo-ta');
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: \`
    <div ngTabs>
      <ul ngTabList [(selectedTab)]="tab" aria-label="Thông tin sản phẩm">
        <li ngTab value="mo-ta">Mô tả</li>
        <li ngTab value="thong-so">Thông số</li>
      </ul>
      <div ngTabPanel value="mo-ta"><ng-template ngTabContent>Áo mưa siêu nhẹ.</ng-template></div>
      <div ngTabPanel value="thong-so"><ng-template ngTabContent>Nặng 180g.</ng-template></div>
    </div>
  \`,
})
class App {
  tab = signal('mo-ta');
}

mount(App);
`,
    hint: 'imports: [Tabs, TabList, Tab, TabPanel, TabContent]; bọc trong <div ngTabs>, hàng tab là <ul ngTabList [(selectedTab)]="tab">, mỗi tab <li ngTab value="…">, mỗi panel <div ngTabPanel value="…"><ng-template ngTabContent>…</ng-template></div>.',
    explain: 'Mặc định selectionMode="follow": tab được chọn theo focus khi dùng phím mũi tên. Đặt selectionMode="explicit" nếu muốn phải nhấn Enter/Space mới chọn (hợp khi nội dung tab tải chậm).',
    simulate(s) {
      s.at(200, () => s.dom((r) => (r.querySelector('[role=tab]') as HTMLElement | null)?.focus()));
      s.at(250, () => s.press('[role=tab]', 'ArrowRight'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const tabs = a.query('[role=tab]');
      if (tabs.length !== 2) return NO('Không thấy phần tử nào có role="tab": trình đọc màn hình không biết đây là nhóm tab.');
      const sel = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
      if (norm(sel?.textContent) !== 'Thông số') return NO('Nhấn → khi đang ở tab Mô tả cần chọn tab Thông số (đang chọn: ' + (norm(sel?.textContent) || 'không có') + ').');
      const panel = a.query('[role=tabpanel]').map((p) => norm(p.textContent)).filter(Boolean);
      return panel.includes('Nặng 180g.') ? OK() : NO('Chưa hiện nội dung tab Thông số.');
    },
  },
];

export const LAB: LabModule = {
  title: 'Accessibility',
  subtitle: 'bài luyện làm giao diện dùng được bằng bàn phím và trình đọc màn hình: button thật, tên cho nút icon, label, aria-expanded, quản lý focus, tabs của @angular/aria.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-a11y').then((m) => m.a11yExtras()),
  cheatsheet: [
    ['Bấm được', '<code>&lt;button type="button"&gt;</code>, không phải <code>div (click)</code>'],
    ['Nút icon', '<code>aria-label="Xoá anh.png"</code>'],
    ['Ô nhập', '<code>&lt;label for="email"&gt;</code> + <code>id="email"</code>'],
    ['Mở/đóng', '<code>[attr.aria-expanded]="open()"</code> + <code>aria-controls</code>'],
    ['Focus sau render', '<code>afterNextRender(() =&gt; el.focus(), { injector })</code>'],
    ['Widget phức tạp', '<code>@angular/aria</code>: tabs, listbox, menu, combobox…'],
  ],
};
