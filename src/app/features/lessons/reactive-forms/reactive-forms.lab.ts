import { type LabExercise, type LabModule, NO, OK, norm } from '../../../shared/lab/lab-model';

/** Bài luyện của bài 24 — Reactive Forms: FormArray, validator cấp nhóm, async validator, getRawValue, valueChanges + signal, submit. */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Dựng cây form bằng <code>FormGroup</code>, <code>FormControl</code>, <code>FormArray</code>, gắn vào template bằng <code>[formGroup]</code>, <code>formControlName</code>, <code>formArrayName</code>. Trạng thái (valid, touched, dirty…) lan từ control lên nhóm cha.</p>
<div class="tip">Có sẵn: <code>ReactiveFormsModule</code>, <code>FormGroup</code>, <code>FormControl</code>, <code>FormArray</code>, <code>FormBuilder</code>, <code>NonNullableFormBuilder</code>, <code>Validators</code>.</div>`,
    starter: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  template: \`
    <form [formGroup]="form">
      <input formControlName="name" placeholder="Tên" />
      <input formControlName="email" placeholder="Email" />
    </form>
    <pre>{{ form.value | json }} · {{ form.status }}</pre>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}

mount(App);
`,
  },
  {
    id: 'form-array', group: 'Cấu trúc form', title: 'Thêm dòng vào FormArray', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p><code>form.value</code> chỉ là <b>bản chụp</b> giá trị; đẩy phần tử vào đó không tạo ra ô nhập nào. Muốn thêm một dòng, phải thêm một <b>control</b> vào <code>FormArray</code>: <code>this.items.push(new FormControl(''))</code>. Template lặp qua <code>items.controls</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Thêm món</b> hai lần; phải có 3 ô nhập món và <code>form.value.items</code> có 3 phần tử.</p>`,
    starter: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  template: \`
    <form [formGroup]="form">
      <div formArrayName="items">
        @for (c of items.controls; track $index) {
          <input class="item" [formControlName]="$index" placeholder="Món {{ $index + 1 }}" />
        }
      </div>
      <button type="button" (click)="addItem()">Thêm món</button>
    </form>
    <pre class="value">{{ form.value | json }}</pre>
  \`,
})
class App {
  form = new FormGroup({ items: new FormArray([new FormControl('Phở')]) });
  get items() { return this.form.controls.items; }

  addItem() {
    this.form.value.items.push(''); // ❗ chỉ sửa bản chụp giá trị
  }
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  template: \`
    <form [formGroup]="form">
      <div formArrayName="items">
        @for (c of items.controls; track $index) {
          <input class="item" [formControlName]="$index" placeholder="Món {{ $index + 1 }}" />
        }
      </div>
      <button type="button" (click)="addItem()">Thêm món</button>
    </form>
    <pre class="value">{{ form.value | json }}</pre>
  \`,
})
class App {
  form = new FormGroup({ items: new FormArray([new FormControl('Phở')]) });
  get items() { return this.form.controls.items; }

  addItem() {
    this.items.push(new FormControl(''));
  }
}

mount(App);
`,
    hint: "Trong addItem(): this.items.push(new FormControl('')).",
    explain: 'Xoá dòng dùng items.removeAt(i). Khi mỗi dòng có nhiều ô, đẩy vào một FormGroup và dùng [formGroupName]="$index" trong vòng lặp.',
    simulate(s) {
      s.at(200, () => s.click('Thêm món'));
      s.at(300, () => s.click('Thêm món'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const n = a.query('.item').length;
      if (n !== 3) return NO('Có ' + n + ' ô nhập món, cần 3: chưa có control nào được thêm vào FormArray.');
      let v: { items?: unknown[] } = {};
      try { v = JSON.parse(a.text('.value')); } catch { /* bỏ qua */ }
      return v.items?.length === 3 ? OK() : NO('form.value.items đang có ' + (v.items?.length ?? '?') + ' phần tử, cần 3.');
    },
  },
  {
    id: 'validator-nhom', group: 'Validator', title: 'So sánh hai ô: validator đặt ở nhóm', level: 'Trung bình', lv: 2, waitMs: 800,
    desc: `<p>Validator chỉ chạy lại khi <b>chính control của nó</b> đổi giá trị. Đặt validator "khớp mật khẩu" lên ô xác nhận thì khi người dùng sửa ô mật khẩu sau đó, ô xác nhận không được kiểm tra lại và lỗi không hiện. Validator so sánh nhiều ô phải đặt ở <b>FormGroup</b> chứa chúng: nhóm kiểm tra lại mỗi khi bất kỳ ô con nào đổi.</p>
<p><b>Yêu cầu:</b> trang gõ mật khẩu <code>abc123</code>, xác nhận <code>abc123</code> (chưa được có lỗi), rồi sửa mật khẩu thành <code>abc999</code>: phải hiện <code>.err</code> "Mật khẩu không khớp". Lỗi nằm ở nhóm <code>account</code> (<code>account.hasError('mismatch')</code>).</p>`,
    starter: `const matchPassword = (confirm) => {
  const pw = confirm.parent?.get('password')?.value;
  return confirm.value === pw ? null : { mismatch: true };
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div formGroupName="account">
        <input type="password" formControlName="password" placeholder="Mật khẩu" />
        <input type="password" formControlName="confirm" placeholder="Nhập lại" />
      </div>
      @if (account.hasError('mismatch') || account.get('confirm').hasError('mismatch')) {
        <small class="err">Mật khẩu không khớp</small>
      }
      <p class="where">nhóm: {{ account.hasError('mismatch') }}</p>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    account: new FormGroup({
      password: new FormControl(''),
      confirm: new FormControl('', matchPassword), // ❗ chỉ chạy khi ô xác nhận đổi
    }),
  });
  get account() { return this.form.controls.account; }
}

mount(App);
`,
    solution: `const matchPassword = (group) => {
  const { password, confirm } = group.value;
  return password === confirm ? null : { mismatch: true };
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div formGroupName="account">
        <input type="password" formControlName="password" placeholder="Mật khẩu" />
        <input type="password" formControlName="confirm" placeholder="Nhập lại" />
      </div>
      @if (account.hasError('mismatch')) {
        <small class="err">Mật khẩu không khớp</small>
      }
      <p class="where">nhóm: {{ account.hasError('mismatch') }}</p>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    account: new FormGroup(
      {
        password: new FormControl(''),
        confirm: new FormControl(''),
      },
      { validators: matchPassword },
    ),
  });
  get account() { return this.form.controls.account; }
}

mount(App);
`,
    hint: 'Viết matchPassword nhận group: so sánh group.value.password với group.value.confirm. Bỏ validator khỏi ô confirm và truyền { validators: matchPassword } làm đối số thứ hai của FormGroup account.',
    explain: 'Lỗi cấp nhóm không tự gắn vào ô nào; template đọc account.hasError("mismatch") để hiện. Muốn tô đỏ ô xác nhận, kết hợp thêm điều kiện account.hasError(...) && confirm.touched.',
    simulate(s) {
      s.at(150, () => s.type(0, 'abc123'));
      s.at(250, () => s.type(1, 'abc123'));
      s.at(400, () => s.dom((r) => r.setAttribute('data-err1', r.querySelector('.err') ? '1' : '0')));
      s.at(450, () => s.type(0, 'abc999'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (a.root()?.getAttribute('data-err1') !== '0') return NO('Hai ô đang khớp (abc123) mà vẫn báo lỗi.');
      if (!a.query('.err').length) return NO('Sửa mật khẩu thành abc999 mà không báo lỗi: validator đặt ở ô xác nhận nên không được chạy lại.');
      return norm(a.text('.where')) === 'nhóm: true' ? OK() : NO('Lỗi cần nằm ở nhóm account (account.hasError("mismatch")).');
    },
  },
  {
    id: 'async-validator', group: 'Validator', title: 'Async validator không gọi API mỗi phím', level: 'Khó', lv: 3, waitMs: 1400,
    desc: `<p>Async validator chạy <b>sau</b> các validator thường, mỗi lần giá trị đổi; trong lúc chờ, control ở trạng thái <code>PENDING</code>. Gọi API thẳng trong validator thì gõ "bip" là 3 request. Angular tự huỷ lần kiểm tra cũ khi có giá trị mới, nên chỉ cần chờ một chút trước khi gọi: <code>timer(300).pipe(switchMap(() =&gt; api…))</code>. (Cách khác: <code>updateOn: 'blur'</code>.)</p>
<p><b>Yêu cầu:</b> trang gõ <code>b</code>, <code>bi</code>, <code>bip</code> cách nhau 50ms. Chỉ được có <b>1</b> request kiểm tra tên; trạng thái đi qua <code>PENDING</code> rồi thành <code>INVALID</code> với lỗi "Tên đã có người dùng".</p>`,
    starter: `const uniqueName = (c) =>
  fakeApi.get('/check-name?u=' + c.value, { delay: 300, data: c.value === 'bip' }).pipe(
    map((taken) => (taken ? { taken: true } : null)),
  );

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="username" placeholder="Tên đăng nhập" />
    <p class="status">{{ username.status }}</p>
    @if (username.hasError('taken')) { <small class="err">Tên đã có người dùng</small> }
  \`,
})
class App {
  username = new FormControl('', { asyncValidators: [uniqueName] });
}

mount(App);
`,
    solution: `const uniqueName = (c) =>
  timer(300).pipe(
    switchMap(() => fakeApi.get('/check-name?u=' + c.value, { delay: 300, data: c.value === 'bip' })),
    map((taken) => (taken ? { taken: true } : null)),
  );

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="username" placeholder="Tên đăng nhập" />
    <p class="status">{{ username.status }}</p>
    @if (username.hasError('taken')) { <small class="err">Tên đã có người dùng</small> }
  \`,
})
class App {
  username = new FormControl('', { asyncValidators: [uniqueName] });
}

mount(App);
`,
    hint: "Bọc lời gọi API: timer(300).pipe(switchMap(() => fakeApi.get(…)), map(…)). Khi giá trị đổi trong 300ms đó, Angular huỷ timer cũ nên request chưa kịp gửi.",
    explain: 'Async validator chỉ chạy khi các validator thường đã hợp lệ, nên đặt Validators.required / minLength trước để khỏi gọi API với giá trị rỗng. Không dùng debounceTime trong validator: mỗi lần chạy là một Observable mới chỉ có một giá trị.',
    simulate(s) {
      s.at(100, () => s.type(0, 'b'));
      s.at(150, () => s.type(0, 'bi'));
      s.at(200, () => s.type(0, 'bip'));
      s.at(350, () => s.dom((r) => r.setAttribute('data-st', norm(r.querySelector('.status')?.textContent))));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const n = a.http('/check-name').length;
      if (n > 1) return NO('Có ' + n + ' request kiểm tra tên: validator đang gọi API ở mỗi lần gõ.');
      if (n === 0) return NO('Không có request kiểm tra tên nào.');
      if (a.root()?.getAttribute('data-st') !== 'PENDING') return NO('Trong lúc kiểm tra, trạng thái cần là PENDING (đang là ' + a.root()?.getAttribute('data-st') + ').');
      if (norm(a.text('.status')) !== 'INVALID') return NO('Sau khi kiểm tra xong, trạng thái cần là INVALID.');
      return a.query('.err').length ? OK() : NO('Chưa hiện lỗi "Tên đã có người dùng".');
    },
  },
  {
    id: 'raw-value', group: 'Đọc giá trị', title: 'Control bị disable biến mất khỏi value: getRawValue()', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Control bị <code>disable()</code> không nằm trong <code>form.value</code> (và không tính vào valid/invalid). Ô email bị khoá vì đã xác minh, nên gửi <code>form.value</code> thì server không nhận được email. Dùng <code>form.getRawValue()</code> để lấy cả giá trị của control bị disable.</p>
<p><b>Yêu cầu:</b> bấm <b>Gửi</b>, log phải là <code>Gửi {"name":"Bíp","email":"bip@demo.dev"}</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" />
      <input formControlName="email" />
      <button type="submit">Gửi</button>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('Bíp'),
    email: new FormControl({ value: 'bip@demo.dev', disabled: true }), // email đã xác minh, không cho sửa
  });

  send() {
    log('Gửi ' + JSON.stringify(this.form.value));
  }
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" />
      <input formControlName="email" />
      <button type="submit">Gửi</button>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('Bíp'),
    email: new FormControl({ value: 'bip@demo.dev', disabled: true }),
  });

  send() {
    log('Gửi ' + JSON.stringify(this.form.getRawValue()));
  }
}

mount(App);
`,
    hint: 'Đổi this.form.value thành this.form.getRawValue().',
    explain: 'Nếu chỉ muốn ô không sửa được mà vẫn nằm trong value, dùng thuộc tính readonly trên <input> thay cho disable().',
    simulate(s) { s.at(200, () => s.click('Gửi')); },
    check(a) {
      const l = a.logs.find((x) => x.startsWith('Gửi'));
      if (!l) return NO('Bấm Gửi nhưng không có log nào.');
      return l === 'Gửi {"name":"Bíp","email":"bip@demo.dev"}' ? OK() : NO('Log đang là ' + l + ': thiếu email vì control bị disable không có trong form.value.');
    },
  },
  {
    id: 'value-changes', group: 'Đọc giá trị', title: 'Form không phải signal: toSignal(valueChanges)', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p><code>form.value</code> là thuộc tính thường, không phải signal. Viết <code>computed(() =&gt; this.form.value.qty * 10000)</code> thì computed chỉ tính <b>một lần</b> và không bao giờ biết form đã đổi. Đổi luồng <code>valueChanges</code> thành signal (kèm giá trị ban đầu) rồi mới dùng trong computed.</p>
<p><b>Yêu cầu:</b> gõ số lượng <code>3</code>, tổng tiền phải hiện <code>30000</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form"><input type="number" formControlName="qty" aria-label="Số lượng" /></form>
    <p>Tổng: <b class="total">{{ total() }}</b></p>
  \`,
})
class App {
  form = new FormGroup({ qty: new FormControl(1) });
  // ❗ form.value không phải signal: computed không biết khi nào cần tính lại
  total = computed(() => this.form.value.qty * 10000);
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form"><input type="number" formControlName="qty" aria-label="Số lượng" /></form>
    <p>Tổng: <b class="total">{{ total() }}</b></p>
  \`,
})
class App {
  form = new FormGroup({ qty: new FormControl(1) });
  value = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  total = computed(() => this.value().qty * 10000);
}

mount(App);
`,
    hint: 'value = toSignal(this.form.valueChanges, { initialValue: this.form.value }); rồi total = computed(() => this.value().qty * 10000).',
    explain: 'Signal Forms (bài 12) làm form thành signal ngay từ đầu, không cần cầu nối này. Với Reactive Forms có sẵn, toSignal(valueChanges) là cách gọn nhất để kết hợp với computed.',
    simulate(s) { s.at(200, () => s.type(0, '3')); },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const t = norm(a.text('.total'));
      return t === '30000' ? OK() : NO('Tổng đang là ' + t + ': computed không biết form.value đã đổi.');
    },
  },
  {
    id: 'submit-touched', group: 'Gửi form', title: 'Bấm gửi khi form lỗi: markAllAsTouched()', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Lỗi thường chỉ hiện khi control đã <code>touched</code> (người dùng đã rời ô), để không đỏ cả form ngay lúc mở. Nhưng người dùng bấm <b>Gửi</b> ngay mà chưa chạm ô nào thì không thấy lỗi gì và tưởng nút hỏng. Khi submit mà form chưa hợp lệ: gọi <code>form.markAllAsTouched()</code> và dừng lại.</p>
<p><b>Yêu cầu:</b> bấm <b>Gửi</b> khi form trống: hiện đủ 2 lỗi và không có log <code>Đã gửi</code>.</p>`,
    starter: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" placeholder="Tên" />
      @if (form.controls.name.touched && form.controls.name.invalid) { <small class="err">Cần nhập tên</small> }
      <input formControlName="email" placeholder="Email" />
      @if (form.controls.email.touched && form.controls.email.invalid) { <small class="err">Email không hợp lệ</small> }
      <button type="submit">Gửi</button>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  send() {
    if (this.form.invalid) return; // ❗ im lặng, người dùng không biết sai ở đâu
    log('Đã gửi', this.form.value);
  }
}

mount(App);
`,
    solution: `@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" placeholder="Tên" />
      @if (form.controls.name.touched && form.controls.name.invalid) { <small class="err">Cần nhập tên</small> }
      <input formControlName="email" placeholder="Email" />
      @if (form.controls.email.touched && form.controls.email.invalid) { <small class="err">Email không hợp lệ</small> }
      <button type="submit">Gửi</button>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    log('Đã gửi', this.form.value);
  }
}

mount(App);
`,
    hint: 'Trong send(): nếu this.form.invalid thì gọi this.form.markAllAsTouched() rồi return.',
    explain: 'Thêm một bước tốt cho accessibility: đưa focus tới ô lỗi đầu tiên để người dùng bàn phím và trình đọc màn hình biết cần sửa ở đâu.',
    simulate(s) { s.at(200, () => s.click('Gửi')); },
    check(a) {
      if (a.logs.some((l) => l.startsWith('Đã gửi'))) return NO('Form trống mà vẫn gửi đi.');
      const n = a.query('.err').length;
      return n === 2 ? OK() : NO('Bấm Gửi khi form trống mà chỉ hiện ' + n + ' lỗi, cần 2.');
    },
  },
];

export const LAB: LabModule = {
  title: 'Reactive Forms',
  subtitle: 'bài luyện cây form FormGroup/FormArray: thêm dòng, validator so sánh ở cấp nhóm, async validator, getRawValue, kết hợp với signal, báo lỗi khi submit.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-forms').then((m) => m.formsExtras()),
  cheatsheet: [
    ['Thêm dòng', '<code>items.push(new FormControl(\'\'))</code>, xoá: <code>removeAt(i)</code>'],
    ['So sánh nhiều ô', '<code>new FormGroup({...}, { validators: fn })</code>'],
    ['Kiểm tra qua API', '<code>{ asyncValidators: [c =&gt; timer(300).pipe(switchMap(…))] }</code>'],
    ['Lấy cả ô bị disable', '<code>form.getRawValue()</code>'],
    ['Dùng với signal', '<code>toSignal(form.valueChanges, { initialValue: form.value })</code>'],
    ['Submit khi lỗi', '<code>form.markAllAsTouched()</code>'],
  ],
};
