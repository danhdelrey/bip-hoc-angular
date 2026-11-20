import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 12 — Forms với Signal Forms (Angular 22): [formField], validator có sẵn,
 * chỉ hiện lỗi khi đã chạm, submit(), validator tự viết (so khớp mật khẩu), vô hiệu hoá theo điều kiện.
 * (Reactive Forms có module luyện tập riêng ở bài nâng cao.)
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Signal Forms: model là một <code>signal</code>, <code>form(model, schema)</code> tạo cây field, <code>[formField]</code> nối ô nhập với field (nhớ <code>imports: [FormField]</code>). Có sẵn <code>required</code>, <code>email</code>, <code>minLength</code>, <code>min</code>, <code>validate</code>, <code>disabled</code>, <code>submit</code>… <code>FormsModule</code>/<code>ReactiveFormsModule</code> cũng dùng được.</p>`,
    starter: `@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <label>Email <input [formField]="f.email" /></label>
    <p>Hợp lệ: {{ f().valid() ? '✅' : '❌' }} · Đã chạm: {{ f.email().touched() }}</p>
    @for (e of f.email().errors(); track e.kind) {
      <small>{{ e.kind }} </small>
    }
  \`,
})
class Signup {
  model = signal({ email: '' });
  f = form(this.model, (p) => {
    required(p.email);
    email(p.email);
  });
}

mount(Signup);
`,
  },
  {
    id: 'form-field', group: 'Nối ô nhập', title: 'Nối ô nhập với model: [formField]', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Với Signal Forms, dữ liệu form là một <code>signal</code> (model). <code>form(this.model)</code> tạo cây field có cùng hình dạng; <code>[formField]="f.name"</code> đồng bộ hai chiều ô nhập với <code>model().name</code>. Directive <code>FormField</code> phải có trong <code>imports</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang gõ <code>Bíp</code>; đoạn văn phải là <code>Xin chào, Bíp</code>.</p>`,
    starter: `@Component({
  selector: 'app-hello-form',
  // ❗ template dùng [formField] nhưng chưa khai báo directive
  template: \`
    <input placeholder="Tên" [formField]="f.name" />
    <p class="out">Xin chào, {{ model().name || 'bạn' }}</p>
  \`,
})
class HelloForm {
  model = signal({ name: '' });
  f = form(this.model);
}

mount(HelloForm);
`,
    solution: `@Component({
  selector: 'app-hello-form',
  imports: [FormField],
  template: \`
    <input placeholder="Tên" [formField]="f.name" />
    <p class="out">Xin chào, {{ model().name || 'bạn' }}</p>
  \`,
})
class HelloForm {
  model = signal({ name: '' });
  f = form(this.model);
}

mount(HelloForm);
`,
    hint: 'imports: [FormField]',
    explain: 'Model vẫn là signal bình thường: set/update nó thì ô nhập tự đổi theo. Trong TypeScript nên khai báo kiểu cho model (interface) để f.name, f.email… được kiểm tra khi biên dịch.',
    simulate(s) { s.at(150, () => s.type(0, 'Bíp')); },
    check(a) {
      const t = a.text('.out');
      if (t === 'Xin chào, Bíp') return OK();
      if (t === 'Xin chào, bạn') return NO('Gõ "Bíp" nhưng model không đổi: [formField] chưa hoạt động. Thêm FormField vào imports.');
      return NO('Đoạn văn đang là "' + t + '", cần "Xin chào, Bíp".');
    },
  },
  {
    id: 'validators', group: 'Kiểm tra dữ liệu', title: 'Validator có sẵn và trạng thái hợp lệ', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p>Hàm schema (đối số thứ hai của <code>form()</code>) khai báo luật: <code>required(p.name)</code>, <code>email(p.email)</code>, <code>minLength(p.password, 6)</code>… Trạng thái của cả form đọc bằng <code>f().valid()</code> / <code>f().invalid()</code>.</p>
<p><b>Yêu cầu:</b> tên bắt buộc, email bắt buộc và đúng định dạng; nút <b>Đăng ký</b> bị khoá khi form chưa hợp lệ. Khi kiểm tra, trang gõ tên và email hợp lệ.</p>`,
    starter: `@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <input placeholder="Tên" [formField]="f.name" />
    <input placeholder="Email" [formField]="f.email" />
    <button [disabled]="f().invalid()">Đăng ký</button>
  \`,
})
class Signup {
  model = signal({ name: '', email: '' });
  // TODO: tên bắt buộc; email bắt buộc và đúng định dạng
  f = form(this.model);
}

mount(Signup);
`,
    solution: `@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <input placeholder="Tên" [formField]="f.name" />
    <input placeholder="Email" [formField]="f.email" />
    <button [disabled]="f().invalid()">Đăng ký</button>
  \`,
})
class Signup {
  model = signal({ name: '', email: '' });
  f = form(this.model, (p) => {
    required(p.name);
    required(p.email);
    email(p.email);
  });
}

mount(Signup);
`,
    hint: 'f = form(this.model, (p) => { required(p.name); required(p.email); email(p.email); });',
    explain: 'Mỗi validator thêm một loại lỗi (kind: "required", "email"…) vào field; f.email().errors() trả về danh sách đó. Validator có tham số động thì truyền hàm: minLength(p.password, () => this.minLen()).',
    simulate(s) {
      s.at(100, () => s.dom((r) => r.setAttribute('data-init', String((r.querySelector('button') as HTMLButtonElement | null)?.disabled))));
      s.at(150, () => s.type(0, 'Bíp'));
      s.at(250, () => s.type(1, 'bip@'));
      s.at(350, () => s.dom((r) => r.setAttribute('data-mid', String((r.querySelector('button') as HTMLButtonElement | null)?.disabled))));
      s.at(400, () => s.type(1, 'bip@demo.dev'));
    },
    check(a) {
      const btn = a.query('button')[0] as HTMLButtonElement | undefined;
      if (a.root()?.getAttribute('data-init') !== 'true') return NO('Form trống mà nút Đăng ký vẫn bấm được: chưa có luật required.');
      if (a.root()?.getAttribute('data-mid') !== 'true') return NO('Email "bip@" sai định dạng mà form vẫn hợp lệ: thiếu luật email.');
      if (btn?.disabled) return NO('Đã nhập đúng tên và email nhưng nút vẫn bị khoá.');
      return OK();
    },
  },
  {
    id: 'loi-khi-touched', group: 'Kiểm tra dữ liệu', title: 'Chỉ hiện lỗi khi đã chạm', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Hiện lỗi đỏ ngay khi trang vừa mở (người dùng chưa gõ gì) là trải nghiệm tệ. Field có <code>touched()</code> = đã rời khỏi ô ít nhất một lần; chỉ hiện lỗi khi <code>touched() &amp;&amp; invalid()</code>.</p>
<p><b>Yêu cầu:</b> lúc mới mở không có <code>.err</code>; khi kiểm tra, trang gõ <code>abc</code> rồi rời ô, lúc đó <code>.err</code> phải hiện.</p>`,
    starter: `@Component({
  selector: 'app-email-field',
  imports: [FormField],
  template: \`
    <input placeholder="Email" [formField]="f.email" />
    <!-- ❗ lỗi hiện ngay cả khi người dùng chưa đụng vào ô -->
    @if (f.email().invalid()) {
      <small class="err">Email không hợp lệ</small>
    }
  \`,
})
class EmailField {
  model = signal({ email: '' });
  f = form(this.model, (p) => {
    required(p.email);
    email(p.email);
  });
}

mount(EmailField);
`,
    solution: `@Component({
  selector: 'app-email-field',
  imports: [FormField],
  template: \`
    <input placeholder="Email" [formField]="f.email" />
    @if (f.email().touched() && f.email().invalid()) {
      <small class="err">Email không hợp lệ</small>
    }
  \`,
})
class EmailField {
  model = signal({ email: '' });
  f = form(this.model, (p) => {
    required(p.email);
    email(p.email);
  });
}

mount(EmailField);
`,
    hint: '@if (f.email().touched() && f.email().invalid()) { … }',
    explain: 'Ngoài touched còn có dirty (giá trị đã bị sửa). Khi bấm gửi form, đánh dấu mọi field là touched để người dùng thấy hết lỗi (bài tiếp theo với submit()).',
    simulate(s) {
      s.at(100, () => s.dom((r) => r.setAttribute('data-init', String(!!r.querySelector('.err')))));
      s.at(150, () => s.type(0, 'abc'));
      s.at(250, () => s.blur(0));
    },
    check(a) {
      if (a.root()?.getAttribute('data-init') !== 'false') return NO('Trang vừa mở đã hiện lỗi dù người dùng chưa đụng vào ô.');
      if (!a.query('.err').length) return NO('Gõ "abc" rồi rời ô nhưng lỗi không hiện.');
      return OK();
    },
  },
  {
    id: 'submit', group: 'Gửi form', title: 'Gửi form đúng cách: [formRoot]', level: 'Trung bình', lv: 2, waitMs: 900,
    desc: `<p>Signal Forms gắn thuộc tính <code>required</code> lên <code>&lt;input&gt;</code>, nên khi form còn trống, trình duyệt tự chặn việc gửi (kiểm tra dữ liệu gốc của HTML): handler không chạy và lỗi của Angular cũng không hiện. Cách chuẩn là <code>&lt;form [formRoot]="f"&gt;</code>: directive tự thêm <code>novalidate</code>, tự <code>preventDefault()</code>, đánh dấu mọi field là touched, rồi chỉ chạy <code>submission.action</code> (khai báo trong options của <code>form()</code>) khi form hợp lệ.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Đăng ký</b> lúc form còn trống (phải hiện 2 lỗi, không gửi), rồi điền đủ và bấm lại (log có <code>Đã gửi bip@demo.dev</code>).</p>`,
    starter: `@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <form (submit)="onSubmit($event)">
      <input placeholder="Tên" [formField]="f.name" />
      @if (f.name().touched() && f.name().invalid()) { <small class="err">Cần nhập tên</small> }
      <input placeholder="Email" [formField]="f.email" />
      @if (f.email().touched() && f.email().invalid()) { <small class="err">Email không hợp lệ</small> }
      <button type="submit">Đăng ký</button>
    </form>
  \`,
})
class Signup {
  model = signal({ name: '', email: '' });
  f = form(this.model, (p) => {
    required(p.name);
    required(p.email);
    email(p.email);
  });

  // ❗ form trống: trình duyệt chặn submit nên hàm này không chạy, lỗi cũng không hiện
  onSubmit(event) {
    event.preventDefault();
    log('Đã gửi', this.model().email);
  }
}

mount(Signup);
`,
    solution: `@Component({
  selector: 'app-signup',
  imports: [FormField, FormRoot],
  template: \`
    <form [formRoot]="f">
      <input placeholder="Tên" [formField]="f.name" />
      @if (f.name().touched() && f.name().invalid()) { <small class="err">Cần nhập tên</small> }
      <input placeholder="Email" [formField]="f.email" />
      @if (f.email().touched() && f.email().invalid()) { <small class="err">Email không hợp lệ</small> }
      <button type="submit">Đăng ký</button>
    </form>
  \`,
})
class Signup {
  model = signal({ name: '', email: '' });
  f = form(
    this.model,
    (p) => {
      required(p.name);
      required(p.email);
      email(p.email);
    },
    {
      submission: {
        action: async () => {
          log('Đã gửi', this.model().email);
        },
      },
    },
  );
}

mount(Signup);
`,
    hint: "Thêm FormRoot vào imports, đổi thẻ form thành <form [formRoot]=\"f\">, và truyền { submission: { action: async () => { log('Đã gửi', this.model().email); } } } làm đối số thứ ba của form().",
    explain: 'action có thể trả về lỗi từ server (ví dụ email đã tồn tại) để gắn vào field. Không dùng [formRoot] thì phải tự thêm novalidate cho <form> và tự gọi submit(this.f, …) trong handler.',
    simulate(s) {
      s.at(150, () => s.click('Đăng ký'));
      s.at(300, () => s.dom((r) => r.setAttribute('data-errs', String(r.querySelectorAll('.err').length))));
      s.at(350, () => s.type(0, 'Bíp'));
      s.at(450, () => s.type(1, 'bip@demo.dev'));
      s.at(550, () => s.click('Đăng ký'));
    },
    check(a) {
      const sent = a.logs.filter((l) => l.startsWith('Đã gửi'));
      if (a.root()?.getAttribute('data-errs') !== '2') return NO('Bấm Đăng ký lúc form trống cần hiện đủ 2 lỗi (đang có ' + a.root()?.getAttribute('data-errs') + '). Trình duyệt đang tự chặn submit và các field chưa được đánh dấu touched.');
      if (sent[0] !== 'Đã gửi bip@demo.dev' || sent.length !== 1) return NO('Form chỉ được gửi một lần, khi đã hợp lệ (log: ' + JSON.stringify(sent) + ').');
      return OK();
    },
  },
  {
    id: 'validate-tu-viet', group: 'Kiểm tra dữ liệu', title: 'Validator tự viết: nhập lại mật khẩu', level: 'Khó', lv: 3, waitMs: 700,
    desc: `<p><code>validate(p.confirm, (ctx) => …)</code> thêm luật tự viết: trả về một lỗi <code>{ kind, message }</code> hoặc <code>undefined</code> khi hợp lệ. <code>ctx.value()</code> là giá trị của field đang kiểm tra, <code>ctx.valueOf(p.password)</code> đọc field khác.</p>
<p><b>Yêu cầu:</b> nếu ô nhập lại khác mật khẩu thì hiện lỗi <code>Mật khẩu nhập lại không khớp</code>; khớp thì hết lỗi.</p>`,
    starter: `@Component({
  selector: 'app-password',
  imports: [FormField],
  template: \`
    <input type="password" placeholder="Mật khẩu" [formField]="f.password" />
    <input type="password" placeholder="Nhập lại" [formField]="f.confirm" />
    @for (e of f.confirm().errors(); track e.kind) {
      <small class="err">{{ e.message }}</small>
    }
  \`,
})
class Password {
  model = signal({ password: '', confirm: '' });
  f = form(this.model, (p) => {
    required(p.password);
    // TODO: confirm phải bằng password
  });
}

mount(Password);
`,
    solution: `@Component({
  selector: 'app-password',
  imports: [FormField],
  template: \`
    <input type="password" placeholder="Mật khẩu" [formField]="f.password" />
    <input type="password" placeholder="Nhập lại" [formField]="f.confirm" />
    @for (e of f.confirm().errors(); track e.kind) {
      <small class="err">{{ e.message }}</small>
    }
  \`,
})
class Password {
  model = signal({ password: '', confirm: '' });
  f = form(this.model, (p) => {
    required(p.password);
    validate(p.confirm, ({ value, valueOf }) =>
      value() !== valueOf(p.password)
        ? { kind: 'mismatch', message: 'Mật khẩu nhập lại không khớp' }
        : undefined
    );
  });
}

mount(Password);
`,
    hint: "validate(p.confirm, ({ value, valueOf }) => value() !== valueOf(p.password) ? { kind: 'mismatch', message: 'Mật khẩu nhập lại không khớp' } : undefined);",
    explain: 'Validator chạy lại tự động khi bất kỳ signal nào nó đọc thay đổi: sửa ô mật khẩu cũng làm lỗi ở ô nhập lại cập nhật. Kiểm tra cần gọi server (email trùng…) thì dùng validateAsync/validateHttp.',
    simulate(s) {
      s.at(100, () => s.type(0, 'abc123'));
      s.at(200, () => s.type(1, 'abc12'));
      s.at(300, () => s.dom((r) => r.setAttribute('data-mid', (r.querySelector('.err')?.textContent ?? '').trim())));
      s.at(350, () => s.type(1, 'abc123'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '.');
      const mid = a.root()?.getAttribute('data-mid');
      if (mid !== 'Mật khẩu nhập lại không khớp') return NO('Nhập lại "abc12" khác mật khẩu nhưng chưa hiện lỗi "Mật khẩu nhập lại không khớp".');
      if (a.query('.err').length) return NO('Đã nhập khớp nhưng lỗi vẫn còn.');
      return OK();
    },
  },
  {
    id: 'disabled-dieu-kien', group: 'Gửi form', title: 'Vô hiệu hoá theo điều kiện', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Luật <code>disabled(p.company, { when: (ctx) => … })</code> khoá field theo giá trị field khác. Field bị khoá không bị kiểm tra lỗi và ô nhập tự có thuộc tính <code>disabled</code>, không cần <code>[disabled]</code> trong template.</p>
<p><b>Yêu cầu:</b> ô <b>Tên công ty</b> chỉ dùng được khi tick <b>Khách doanh nghiệp</b>.</p>`,
    starter: `@Component({
  selector: 'app-invoice-form',
  imports: [FormField],
  template: \`
    <label><input type="checkbox" class="biz" [formField]="f.isBusiness" /> Khách doanh nghiệp</label>
    <input class="company" placeholder="Tên công ty" [formField]="f.company" />
  \`,
})
class InvoiceForm {
  model = signal({ isBusiness: false, company: '' });
  f = form(this.model, (p) => {
    required(p.company);
    // TODO: khoá company khi isBusiness là false
  });
}

mount(InvoiceForm);
`,
    solution: `@Component({
  selector: 'app-invoice-form',
  imports: [FormField],
  template: \`
    <label><input type="checkbox" class="biz" [formField]="f.isBusiness" /> Khách doanh nghiệp</label>
    <input class="company" placeholder="Tên công ty" [formField]="f.company" />
  \`,
})
class InvoiceForm {
  model = signal({ isBusiness: false, company: '' });
  f = form(this.model, (p) => {
    required(p.company);
    disabled(p.company, { when: ({ valueOf }) => !valueOf(p.isBusiness) });
  });
}

mount(InvoiceForm);
`,
    hint: 'disabled(p.company, { when: ({ valueOf }) => !valueOf(p.isBusiness) });',
    explain: 'Tương tự có hidden() (ẩn field, không tính vào form) và readonly(). Logic điều kiện nằm trong schema thay vì rải [disabled] khắp template, nên form và giao diện luôn khớp nhau.',
    simulate(s) {
      s.at(100, () => s.dom((r) => r.setAttribute('data-init', String((r.querySelector('.company') as HTMLInputElement | null)?.disabled))));
      s.at(150, () => s.tick('.biz', true));
    },
    check(a) {
      const c = a.query('.company')[0] as HTMLInputElement | undefined;
      if (a.root()?.getAttribute('data-init') !== 'true') return NO('Chưa tick "Khách doanh nghiệp" mà ô Tên công ty vẫn nhập được.');
      if (c?.disabled) return NO('Đã tick "Khách doanh nghiệp" nhưng ô Tên công ty vẫn bị khoá.');
      return OK();
    },
  },
];

export const LAB: LabModule = {
  title: 'Forms',
  subtitle: 'bài luyện Signal Forms trên component thật: [formField], validator có sẵn, lỗi khi đã chạm, submit(), validator tự viết, vô hiệu hoá theo điều kiện.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-forms').then((m) => m.formsExtras()),
  cheatsheet: [
    ['Tạo form', '<code>model = signal({...})</code>; <code>f = form(this.model, (p) => { … })</code>'],
    ['Nối ô nhập', '<code>[formField]="f.email"</code> + <code>imports: [FormField]</code>'],
    ['Luật có sẵn', '<code>required</code>, <code>email</code>, <code>minLength</code>, <code>min</code>, <code>pattern</code>…'],
    ['Luật tự viết', '<code>validate(p.x, (ctx) => lỗi | undefined)</code>'],
    ['Hiện lỗi đúng lúc', '<code>f.x().touched() &amp;&amp; f.x().invalid()</code>'],
    ['Gửi form', '<code>&lt;form [formRoot]="f"&gt;</code> + <code>form(model, schema, { submission: { action } })</code>'],
    ['Khoá field theo điều kiện', '<code>disabled(p.x, { when: (ctx) => … })</code>'],
  ],
};
