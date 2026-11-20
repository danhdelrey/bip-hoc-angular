import{a as s,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var m={title:`Forms`,subtitle:`bài luyện Signal Forms trên component thật: [formField], validator có sẵn, lỗi khi đã chạm, submit(), validator tự viết, vô hiệu hoá theo điều kiện.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Signal Forms: model là một <code>signal</code>, <code>form(model, schema)</code> tạo cây field, <code>[formField]</code> nối ô nhập với field (nhớ <code>imports: [FormField]</code>). Có sẵn <code>required</code>, <code>email</code>, <code>minLength</code>, <code>min</code>, <code>validate</code>, <code>disabled</code>, <code>submit</code>… <code>FormsModule</code>/<code>ReactiveFormsModule</code> cũng dùng được.</p>`,starter:`@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <label>Email <input [formField]="f.email" /></label>
    <p>H\u1EE3p l\u1EC7: {{ f().valid() ? '\u2705' : '\u274C' }} \xB7 \u0110\xE3 ch\u1EA1m: {{ f.email().touched() }}</p>
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
`},{id:`form-field`,group:`Nối ô nhập`,title:`Nối ô nhập với model: [formField]`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>V\u1EDBi Signal Forms, d\u1EEF li\u1EC7u form l\xE0 m\u1ED9t <code>signal</code> (model). <code>form(this.model)</code> t\u1EA1o c\xE2y field c\xF3 c\xF9ng h\xECnh d\u1EA1ng; <code>[formField]="f.name"</code> \u0111\u1ED3ng b\u1ED9 hai chi\u1EC1u \xF4 nh\u1EADp v\u1EDBi <code>model().name</code>. Directive <code>FormField</code> ph\u1EA3i c\xF3 trong <code>imports</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang g\xF5 <code>B\xEDp</code>; \u0111o\u1EA1n v\u0103n ph\u1EA3i l\xE0 <code>Xin ch\xE0o, B\xEDp</code>.</p>`,starter:`@Component({
  selector: 'app-hello-form',
  // \u2757 template d\xF9ng [formField] nh\u01B0ng ch\u01B0a khai b\xE1o directive
  template: \`
    <input placeholder="T\xEAn" [formField]="f.name" />
    <p class="out">Xin ch\xE0o, {{ model().name || 'b\u1EA1n' }}</p>
  \`,
})
class HelloForm {
  model = signal({ name: '' });
  f = form(this.model);
}

mount(HelloForm);
`,solution:`@Component({
  selector: 'app-hello-form',
  imports: [FormField],
  template: \`
    <input placeholder="T\xEAn" [formField]="f.name" />
    <p class="out">Xin ch\xE0o, {{ model().name || 'b\u1EA1n' }}</p>
  \`,
})
class HelloForm {
  model = signal({ name: '' });
  f = form(this.model);
}

mount(HelloForm);
`,hint:`imports: [FormField]`,explain:`Model vẫn là signal bình thường: set/update nó thì ô nhập tự đổi theo. Trong TypeScript nên khai báo kiểu cho model (interface) để f.name, f.email… được kiểm tra khi biên dịch.`,simulate(e){e.at(150,()=>e.type(0,`Bíp`))},check(e){let i$1=e.text(`.out`);return i$1===`Xin chào, Bíp`?i():i$1===`Xin chào, bạn`?s(`Gõ "Bíp" nhưng model không đổi: [formField] chưa hoạt động. Thêm FormField vào imports.`):s(`Đoạn văn đang là "`+i$1+`", cần "Xin chào, Bíp".`)}},{id:`validators`,group:`Kiểm tra dữ liệu`,title:`Validator có sẵn và trạng thái hợp lệ`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>H\xE0m schema (\u0111\u1ED1i s\u1ED1 th\u1EE9 hai c\u1EE7a <code>form()</code>) khai b\xE1o lu\u1EADt: <code>required(p.name)</code>, <code>email(p.email)</code>, <code>minLength(p.password, 6)</code>\u2026 Tr\u1EA1ng th\xE1i c\u1EE7a c\u1EA3 form \u0111\u1ECDc b\u1EB1ng <code>f().valid()</code> / <code>f().invalid()</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> t\xEAn b\u1EAFt bu\u1ED9c, email b\u1EAFt bu\u1ED9c v\xE0 \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng; n\xFAt <b>\u0110\u0103ng k\xFD</b> b\u1ECB kho\xE1 khi form ch\u01B0a h\u1EE3p l\u1EC7. Khi ki\u1EC3m tra, trang g\xF5 t\xEAn v\xE0 email h\u1EE3p l\u1EC7.</p>`,starter:`@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <input placeholder="T\xEAn" [formField]="f.name" />
    <input placeholder="Email" [formField]="f.email" />
    <button [disabled]="f().invalid()">\u0110\u0103ng k\xFD</button>
  \`,
})
class Signup {
  model = signal({ name: '', email: '' });
  // TODO: t\xEAn b\u1EAFt bu\u1ED9c; email b\u1EAFt bu\u1ED9c v\xE0 \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng
  f = form(this.model);
}

mount(Signup);
`,solution:`@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <input placeholder="T\xEAn" [formField]="f.name" />
    <input placeholder="Email" [formField]="f.email" />
    <button [disabled]="f().invalid()">\u0110\u0103ng k\xFD</button>
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
`,hint:`f = form(this.model, (p) => { required(p.name); required(p.email); email(p.email); });`,explain:`Mỗi validator thêm một loại lỗi (kind: "required", "email"…) vào field; f.email().errors() trả về danh sách đó. Validator có tham số động thì truyền hàm: minLength(p.password, () => this.minLen()).`,simulate(e){e.at(100,()=>e.dom(i=>i.setAttribute(`data-init`,String(i.querySelector(`button`)?.disabled)))),e.at(150,()=>e.type(0,`Bíp`)),e.at(250,()=>e.type(1,`bip@`)),e.at(350,()=>e.dom(i=>i.setAttribute(`data-mid`,String(i.querySelector(`button`)?.disabled)))),e.at(400,()=>e.type(1,`bip@demo.dev`))},check(e){let i$2=e.query(`button`)[0];return e.root()?.getAttribute(`data-init`)!==`true`?s(`Form trống mà nút Đăng ký vẫn bấm được: chưa có luật required.`):e.root()?.getAttribute(`data-mid`)!==`true`?s(`Email "bip@" sai định dạng mà form vẫn hợp lệ: thiếu luật email.`):i$2?.disabled?s(`Đã nhập đúng tên và email nhưng nút vẫn bị khoá.`):i()}},{id:`loi-khi-touched`,group:`Kiểm tra dữ liệu`,title:`Chỉ hiện lỗi khi đã chạm`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>Hi\u1EC7n l\u1ED7i \u0111\u1ECF ngay khi trang v\u1EEBa m\u1EDF (ng\u01B0\u1EDDi d\xF9ng ch\u01B0a g\xF5 g\xEC) l\xE0 tr\u1EA3i nghi\u1EC7m t\u1EC7. Field c\xF3 <code>touched()</code> = \u0111\xE3 r\u1EDDi kh\u1ECFi \xF4 \xEDt nh\u1EA5t m\u1ED9t l\u1EA7n; ch\u1EC9 hi\u1EC7n l\u1ED7i khi <code>touched() &amp;&amp; invalid()</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> l\xFAc m\u1EDBi m\u1EDF kh\xF4ng c\xF3 <code>.err</code>; khi ki\u1EC3m tra, trang g\xF5 <code>abc</code> r\u1ED3i r\u1EDDi \xF4, l\xFAc \u0111\xF3 <code>.err</code> ph\u1EA3i hi\u1EC7n.</p>`,starter:`@Component({
  selector: 'app-email-field',
  imports: [FormField],
  template: \`
    <input placeholder="Email" [formField]="f.email" />
    <!-- \u2757 l\u1ED7i hi\u1EC7n ngay c\u1EA3 khi ng\u01B0\u1EDDi d\xF9ng ch\u01B0a \u0111\u1EE5ng v\xE0o \xF4 -->
    @if (f.email().invalid()) {
      <small class="err">Email kh\xF4ng h\u1EE3p l\u1EC7</small>
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
`,solution:`@Component({
  selector: 'app-email-field',
  imports: [FormField],
  template: \`
    <input placeholder="Email" [formField]="f.email" />
    @if (f.email().touched() && f.email().invalid()) {
      <small class="err">Email kh\xF4ng h\u1EE3p l\u1EC7</small>
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
`,hint:`@if (f.email().touched() && f.email().invalid()) { … }`,explain:`Ngoài touched còn có dirty (giá trị đã bị sửa). Khi bấm gửi form, đánh dấu mọi field là touched để người dùng thấy hết lỗi (bài tiếp theo với submit()).`,simulate(e){e.at(100,()=>e.dom(i=>i.setAttribute(`data-init`,String(!!i.querySelector(`.err`))))),e.at(150,()=>e.type(0,`abc`)),e.at(250,()=>e.blur(0))},check(e){return e.root()?.getAttribute(`data-init`)!==`false`?s(`Trang vừa mở đã hiện lỗi dù người dùng chưa đụng vào ô.`):e.query(`.err`).length?i():s(`Gõ "abc" rồi rời ô nhưng lỗi không hiện.`)}},{id:`submit`,group:`Gửi form`,title:`Gửi form đúng cách: [formRoot]`,level:`Trung bình`,lv:2,waitMs:900,desc:`<p>Signal Forms g\u1EAFn thu\u1ED9c t\xEDnh <code>required</code> l\xEAn <code>&lt;input&gt;</code>, n\xEAn khi form c\xF2n tr\u1ED1ng, tr\xECnh duy\u1EC7t t\u1EF1 ch\u1EB7n vi\u1EC7c g\u1EEDi (ki\u1EC3m tra d\u1EEF li\u1EC7u g\u1ED1c c\u1EE7a HTML): handler kh\xF4ng ch\u1EA1y v\xE0 l\u1ED7i c\u1EE7a Angular c\u0169ng kh\xF4ng hi\u1EC7n. C\xE1ch chu\u1EA9n l\xE0 <code>&lt;form [formRoot]="f"&gt;</code>: directive t\u1EF1 th\xEAm <code>novalidate</code>, t\u1EF1 <code>preventDefault()</code>, \u0111\xE1nh d\u1EA5u m\u1ECDi field l\xE0 touched, r\u1ED3i ch\u1EC9 ch\u1EA1y <code>submission.action</code> (khai b\xE1o trong options c\u1EE7a <code>form()</code>) khi form h\u1EE3p l\u1EC7.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\u0103ng k\xFD</b> l\xFAc form c\xF2n tr\u1ED1ng (ph\u1EA3i hi\u1EC7n 2 l\u1ED7i, kh\xF4ng g\u1EEDi), r\u1ED3i \u0111i\u1EC1n \u0111\u1EE7 v\xE0 b\u1EA5m l\u1EA1i (log c\xF3 <code>\u0110\xE3 g\u1EEDi bip@demo.dev</code>).</p>`,starter:`@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: \`
    <form (submit)="onSubmit($event)">
      <input placeholder="T\xEAn" [formField]="f.name" />
      @if (f.name().touched() && f.name().invalid()) { <small class="err">C\u1EA7n nh\u1EADp t\xEAn</small> }
      <input placeholder="Email" [formField]="f.email" />
      @if (f.email().touched() && f.email().invalid()) { <small class="err">Email kh\xF4ng h\u1EE3p l\u1EC7</small> }
      <button type="submit">\u0110\u0103ng k\xFD</button>
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

  // \u2757 form tr\u1ED1ng: tr\xECnh duy\u1EC7t ch\u1EB7n submit n\xEAn h\xE0m n\xE0y kh\xF4ng ch\u1EA1y, l\u1ED7i c\u0169ng kh\xF4ng hi\u1EC7n
  onSubmit(event) {
    event.preventDefault();
    log('\u0110\xE3 g\u1EEDi', this.model().email);
  }
}

mount(Signup);
`,solution:`@Component({
  selector: 'app-signup',
  imports: [FormField, FormRoot],
  template: \`
    <form [formRoot]="f">
      <input placeholder="T\xEAn" [formField]="f.name" />
      @if (f.name().touched() && f.name().invalid()) { <small class="err">C\u1EA7n nh\u1EADp t\xEAn</small> }
      <input placeholder="Email" [formField]="f.email" />
      @if (f.email().touched() && f.email().invalid()) { <small class="err">Email kh\xF4ng h\u1EE3p l\u1EC7</small> }
      <button type="submit">\u0110\u0103ng k\xFD</button>
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
          log('\u0110\xE3 g\u1EEDi', this.model().email);
        },
      },
    },
  );
}

mount(Signup);
`,hint:`Th\xEAm FormRoot v\xE0o imports, \u0111\u1ED5i th\u1EBB form th\xE0nh <form [formRoot]="f">, v\xE0 truy\u1EC1n { submission: { action: async () => { log('\u0110\xE3 g\u1EEDi', this.model().email); } } } l\xE0m \u0111\u1ED1i s\u1ED1 th\u1EE9 ba c\u1EE7a form().`,explain:`action có thể trả về lỗi từ server (ví dụ email đã tồn tại) để gắn vào field. Không dùng [formRoot] thì phải tự thêm novalidate cho <form> và tự gọi submit(this.f, …) trong handler.`,simulate(e){e.at(150,()=>e.click(`Đăng ký`)),e.at(300,()=>e.dom(i=>i.setAttribute(`data-errs`,String(i.querySelectorAll(`.err`).length)))),e.at(350,()=>e.type(0,`Bíp`)),e.at(450,()=>e.type(1,`bip@demo.dev`)),e.at(550,()=>e.click(`Đăng ký`))},check(e){let i$3=e.logs.filter(l=>l.startsWith(`Đã gửi`));return e.root()?.getAttribute(`data-errs`)!==`2`?s(`Bấm Đăng ký lúc form trống cần hiện đủ 2 lỗi (đang có `+e.root()?.getAttribute(`data-errs`)+`). Trình duyệt đang tự chặn submit và các field chưa được đánh dấu touched.`):i$3[0]!==`Đã gửi bip@demo.dev`||i$3.length!==1?s(`Form chỉ được gửi một lần, khi đã hợp lệ (log: `+JSON.stringify(i$3)+`).`):i()}},{id:`validate-tu-viet`,group:`Kiểm tra dữ liệu`,title:`Validator tự viết: nhập lại mật khẩu`,level:`Khó`,lv:3,waitMs:700,desc:`<p><code>validate(p.confirm, (ctx) => \u2026)</code> th\xEAm lu\u1EADt t\u1EF1 vi\u1EBFt: tr\u1EA3 v\u1EC1 m\u1ED9t l\u1ED7i <code>{ kind, message }</code> ho\u1EB7c <code>undefined</code> khi h\u1EE3p l\u1EC7. <code>ctx.value()</code> l\xE0 gi\xE1 tr\u1ECB c\u1EE7a field \u0111ang ki\u1EC3m tra, <code>ctx.valueOf(p.password)</code> \u0111\u1ECDc field kh\xE1c.</p>
<p><b>Y\xEAu c\u1EA7u:</b> n\u1EBFu \xF4 nh\u1EADp l\u1EA1i kh\xE1c m\u1EADt kh\u1EA9u th\xEC hi\u1EC7n l\u1ED7i <code>M\u1EADt kh\u1EA9u nh\u1EADp l\u1EA1i kh\xF4ng kh\u1EDBp</code>; kh\u1EDBp th\xEC h\u1EBFt l\u1ED7i.</p>`,starter:`@Component({
  selector: 'app-password',
  imports: [FormField],
  template: \`
    <input type="password" placeholder="M\u1EADt kh\u1EA9u" [formField]="f.password" />
    <input type="password" placeholder="Nh\u1EADp l\u1EA1i" [formField]="f.confirm" />
    @for (e of f.confirm().errors(); track e.kind) {
      <small class="err">{{ e.message }}</small>
    }
  \`,
})
class Password {
  model = signal({ password: '', confirm: '' });
  f = form(this.model, (p) => {
    required(p.password);
    // TODO: confirm ph\u1EA3i b\u1EB1ng password
  });
}

mount(Password);
`,solution:`@Component({
  selector: 'app-password',
  imports: [FormField],
  template: \`
    <input type="password" placeholder="M\u1EADt kh\u1EA9u" [formField]="f.password" />
    <input type="password" placeholder="Nh\u1EADp l\u1EA1i" [formField]="f.confirm" />
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
        ? { kind: 'mismatch', message: 'M\u1EADt kh\u1EA9u nh\u1EADp l\u1EA1i kh\xF4ng kh\u1EDBp' }
        : undefined
    );
  });
}

mount(Password);
`,hint:`validate(p.confirm, ({ value, valueOf }) => value() !== valueOf(p.password) ? { kind: 'mismatch', message: 'Mật khẩu nhập lại không khớp' } : undefined);`,explain:`Validator chạy lại tự động khi bất kỳ signal nào nó đọc thay đổi: sửa ô mật khẩu cũng làm lỗi ở ô nhập lại cập nhật. Kiểm tra cần gọi server (email trùng…) thì dùng validateAsync/validateHttp.`,simulate(e){e.at(100,()=>e.type(0,`abc123`)),e.at(200,()=>e.type(1,`abc12`)),e.at(300,()=>e.dom(i=>i.setAttribute(`data-mid`,(i.querySelector(`.err`)?.textContent??``).trim()))),e.at(350,()=>e.type(1,`abc123`))},check(e){return e.errors.length?s(`Có lỗi: `+e.errMsg()+`.`):e.root()?.getAttribute(`data-mid`)!==`Mật khẩu nhập lại không khớp`?s(`Nhập lại "abc12" khác mật khẩu nhưng chưa hiện lỗi "Mật khẩu nhập lại không khớp".`):e.query(`.err`).length?s(`Đã nhập khớp nhưng lỗi vẫn còn.`):i()}},{id:`disabled-dieu-kien`,group:`Gửi form`,title:`Vô hiệu hoá theo điều kiện`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>Lu\u1EADt <code>disabled(p.company, { when: (ctx) => \u2026 })</code> kho\xE1 field theo gi\xE1 tr\u1ECB field kh\xE1c. Field b\u1ECB kho\xE1 kh\xF4ng b\u1ECB ki\u1EC3m tra l\u1ED7i v\xE0 \xF4 nh\u1EADp t\u1EF1 c\xF3 thu\u1ED9c t\xEDnh <code>disabled</code>, kh\xF4ng c\u1EA7n <code>[disabled]</code> trong template.</p>
<p><b>Y\xEAu c\u1EA7u:</b> \xF4 <b>T\xEAn c\xF4ng ty</b> ch\u1EC9 d\xF9ng \u0111\u01B0\u1EE3c khi tick <b>Kh\xE1ch doanh nghi\u1EC7p</b>.</p>`,starter:`@Component({
  selector: 'app-invoice-form',
  imports: [FormField],
  template: \`
    <label><input type="checkbox" class="biz" [formField]="f.isBusiness" /> Kh\xE1ch doanh nghi\u1EC7p</label>
    <input class="company" placeholder="T\xEAn c\xF4ng ty" [formField]="f.company" />
  \`,
})
class InvoiceForm {
  model = signal({ isBusiness: false, company: '' });
  f = form(this.model, (p) => {
    required(p.company);
    // TODO: kho\xE1 company khi isBusiness l\xE0 false
  });
}

mount(InvoiceForm);
`,solution:`@Component({
  selector: 'app-invoice-form',
  imports: [FormField],
  template: \`
    <label><input type="checkbox" class="biz" [formField]="f.isBusiness" /> Kh\xE1ch doanh nghi\u1EC7p</label>
    <input class="company" placeholder="T\xEAn c\xF4ng ty" [formField]="f.company" />
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
`,hint:`disabled(p.company, { when: ({ valueOf }) => !valueOf(p.isBusiness) });`,explain:`Tương tự có hidden() (ẩn field, không tính vào form) và readonly(). Logic điều kiện nằm trong schema thay vì rải [disabled] khắp template, nên form và giao diện luôn khớp nhau.`,simulate(e){e.at(100,()=>e.dom(i=>i.setAttribute(`data-init`,String(i.querySelector(`.company`)?.disabled)))),e.at(150,()=>e.tick(`.biz`,!0))},check(e){let i$4=e.query(`.company`)[0];return e.root()?.getAttribute(`data-init`)!==`true`?s(`Chưa tick "Khách doanh nghiệp" mà ô Tên công ty vẫn nhập được.`):i$4?.disabled?s(`Đã tick "Khách doanh nghiệp" nhưng ô Tên công ty vẫn bị khoá.`):i()}}],extras:()=>import(`./chunk-Da5SC_zW.js`).then(e=>e.formsExtras()),cheatsheet:[[`Tạo form`,`<code>model = signal({...})</code>; <code>f = form(this.model, (p) => { … })</code>`],[`Nối ô nhập`,`<code>[formField]="f.email"</code> + <code>imports: [FormField]</code>`],[`Luật có sẵn`,`<code>required</code>, <code>email</code>, <code>minLength</code>, <code>min</code>, <code>pattern</code>…`],[`Luật tự viết`,`<code>validate(p.x, (ctx) => lỗi | undefined)</code>`],[`Hiện lỗi đúng lúc`,`<code>f.x().touched() &amp;&amp; f.x().invalid()</code>`],[`Gửi form`,`<code>&lt;form [formRoot]="f"&gt;</code> + <code>form(model, schema, { submission: { action } })</code>`],[`Khoá field theo điều kiện`,`<code>disabled(p.x, { when: (ctx) => … })</code>`]]};export{m as LAB};