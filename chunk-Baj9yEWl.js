import{a as s,n as g,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var l={title:`Reactive Forms`,subtitle:`bài luyện cây form FormGroup/FormArray: thêm dòng, validator so sánh ở cấp nhóm, async validator, getRawValue, kết hợp với signal, báo lỗi khi submit.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>D\u1EF1ng c\xE2y form b\u1EB1ng <code>FormGroup</code>, <code>FormControl</code>, <code>FormArray</code>, g\u1EAFn v\xE0o template b\u1EB1ng <code>[formGroup]</code>, <code>formControlName</code>, <code>formArrayName</code>. Tr\u1EA1ng th\xE1i (valid, touched, dirty\u2026) lan t\u1EEB control l\xEAn nh\xF3m cha.</p>
<div class="tip">C\xF3 s\u1EB5n: <code>ReactiveFormsModule</code>, <code>FormGroup</code>, <code>FormControl</code>, <code>FormArray</code>, <code>FormBuilder</code>, <code>NonNullableFormBuilder</code>, <code>Validators</code>.</div>`,starter:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  template: \`
    <form [formGroup]="form">
      <input formControlName="name" placeholder="T\xEAn" />
      <input formControlName="email" placeholder="Email" />
    </form>
    <pre>{{ form.value | json }} \xB7 {{ form.status }}</pre>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}

mount(App);
`},{id:`form-array`,group:`Cấu trúc form`,title:`Thêm dòng vào FormArray`,level:`Dễ`,lv:1,waitMs:600,desc:`<p><code>form.value</code> ch\u1EC9 l\xE0 <b>b\u1EA3n ch\u1EE5p</b> gi\xE1 tr\u1ECB; \u0111\u1EA9y ph\u1EA7n t\u1EED v\xE0o \u0111\xF3 kh\xF4ng t\u1EA1o ra \xF4 nh\u1EADp n\xE0o. Mu\u1ED1n th\xEAm m\u1ED9t d\xF2ng, ph\u1EA3i th\xEAm m\u1ED9t <b>control</b> v\xE0o <code>FormArray</code>: <code>this.items.push(new FormControl(''))</code>. Template l\u1EB7p qua <code>items.controls</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>Th\xEAm m\xF3n</b> hai l\u1EA7n; ph\u1EA3i c\xF3 3 \xF4 nh\u1EADp m\xF3n v\xE0 <code>form.value.items</code> c\xF3 3 ph\u1EA7n t\u1EED.</p>`,starter:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  template: \`
    <form [formGroup]="form">
      <div formArrayName="items">
        @for (c of items.controls; track $index) {
          <input class="item" [formControlName]="$index" placeholder="M\xF3n {{ $index + 1 }}" />
        }
      </div>
      <button type="button" (click)="addItem()">Th\xEAm m\xF3n</button>
    </form>
    <pre class="value">{{ form.value | json }}</pre>
  \`,
})
class App {
  form = new FormGroup({ items: new FormArray([new FormControl('Ph\u1EDF')]) });
  get items() { return this.form.controls.items; }

  addItem() {
    this.form.value.items.push(''); // \u2757 ch\u1EC9 s\u1EEDa b\u1EA3n ch\u1EE5p gi\xE1 tr\u1ECB
  }
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  template: \`
    <form [formGroup]="form">
      <div formArrayName="items">
        @for (c of items.controls; track $index) {
          <input class="item" [formControlName]="$index" placeholder="M\xF3n {{ $index + 1 }}" />
        }
      </div>
      <button type="button" (click)="addItem()">Th\xEAm m\xF3n</button>
    </form>
    <pre class="value">{{ form.value | json }}</pre>
  \`,
})
class App {
  form = new FormGroup({ items: new FormArray([new FormControl('Ph\u1EDF')]) });
  get items() { return this.form.controls.items; }

  addItem() {
    this.items.push(new FormControl(''));
  }
}

mount(App);
`,hint:`Trong addItem(): this.items.push(new FormControl('')).`,explain:`Xoá dòng dùng items.removeAt(i). Khi mỗi dòng có nhiều ô, đẩy vào một FormGroup và dùng [formGroupName]="$index" trong vòng lặp.`,simulate(o){o.at(200,()=>o.click(`Thêm món`)),o.at(300,()=>o.click(`Thêm món`))},check(o){if(o.errors.length)return s(`Có lỗi: `+o.errMsg());let t=o.query(`.item`).length;if(t!==3)return s(`Có `+t+` ô nhập món, cần 3: chưa có control nào được thêm vào FormArray.`);let r={};try{r=JSON.parse(o.text(`.value`))}catch{}return r.items?.length===3?i():s(`form.value.items đang có `+(r.items?.length??`?`)+` phần tử, cần 3.`)}},{id:`validator-nhom`,group:`Validator`,title:`So sánh hai ô: validator đặt ở nhóm`,level:`Trung bình`,lv:2,waitMs:800,desc:`<p>Validator ch\u1EC9 ch\u1EA1y l\u1EA1i khi <b>ch\xEDnh control c\u1EE7a n\xF3</b> \u0111\u1ED5i gi\xE1 tr\u1ECB. \u0110\u1EB7t validator "kh\u1EDBp m\u1EADt kh\u1EA9u" l\xEAn \xF4 x\xE1c nh\u1EADn th\xEC khi ng\u01B0\u1EDDi d\xF9ng s\u1EEDa \xF4 m\u1EADt kh\u1EA9u sau \u0111\xF3, \xF4 x\xE1c nh\u1EADn kh\xF4ng \u0111\u01B0\u1EE3c ki\u1EC3m tra l\u1EA1i v\xE0 l\u1ED7i kh\xF4ng hi\u1EC7n. Validator so s\xE1nh nhi\u1EC1u \xF4 ph\u1EA3i \u0111\u1EB7t \u1EDF <b>FormGroup</b> ch\u1EE9a ch\xFAng: nh\xF3m ki\u1EC3m tra l\u1EA1i m\u1ED7i khi b\u1EA5t k\u1EF3 \xF4 con n\xE0o \u0111\u1ED5i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang g\xF5 m\u1EADt kh\u1EA9u <code>abc123</code>, x\xE1c nh\u1EADn <code>abc123</code> (ch\u01B0a \u0111\u01B0\u1EE3c c\xF3 l\u1ED7i), r\u1ED3i s\u1EEDa m\u1EADt kh\u1EA9u th\xE0nh <code>abc999</code>: ph\u1EA3i hi\u1EC7n <code>.err</code> "M\u1EADt kh\u1EA9u kh\xF4ng kh\u1EDBp". L\u1ED7i n\u1EB1m \u1EDF nh\xF3m <code>account</code> (<code>account.hasError('mismatch')</code>).</p>`,starter:`const matchPassword = (confirm) => {
  const pw = confirm.parent?.get('password')?.value;
  return confirm.value === pw ? null : { mismatch: true };
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div formGroupName="account">
        <input type="password" formControlName="password" placeholder="M\u1EADt kh\u1EA9u" />
        <input type="password" formControlName="confirm" placeholder="Nh\u1EADp l\u1EA1i" />
      </div>
      @if (account.hasError('mismatch') || account.get('confirm').hasError('mismatch')) {
        <small class="err">M\u1EADt kh\u1EA9u kh\xF4ng kh\u1EDBp</small>
      }
      <p class="where">nh\xF3m: {{ account.hasError('mismatch') }}</p>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    account: new FormGroup({
      password: new FormControl(''),
      confirm: new FormControl('', matchPassword), // \u2757 ch\u1EC9 ch\u1EA1y khi \xF4 x\xE1c nh\u1EADn \u0111\u1ED5i
    }),
  });
  get account() { return this.form.controls.account; }
}

mount(App);
`,solution:`const matchPassword = (group) => {
  const { password, confirm } = group.value;
  return password === confirm ? null : { mismatch: true };
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div formGroupName="account">
        <input type="password" formControlName="password" placeholder="M\u1EADt kh\u1EA9u" />
        <input type="password" formControlName="confirm" placeholder="Nh\u1EADp l\u1EA1i" />
      </div>
      @if (account.hasError('mismatch')) {
        <small class="err">M\u1EADt kh\u1EA9u kh\xF4ng kh\u1EDBp</small>
      }
      <p class="where">nh\xF3m: {{ account.hasError('mismatch') }}</p>
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
`,hint:`Viết matchPassword nhận group: so sánh group.value.password với group.value.confirm. Bỏ validator khỏi ô confirm và truyền { validators: matchPassword } làm đối số thứ hai của FormGroup account.`,explain:`Lỗi cấp nhóm không tự gắn vào ô nào; template đọc account.hasError("mismatch") để hiện. Muốn tô đỏ ô xác nhận, kết hợp thêm điều kiện account.hasError(...) && confirm.touched.`,simulate(o){o.at(150,()=>o.type(0,`abc123`)),o.at(250,()=>o.type(1,`abc123`)),o.at(400,()=>o.dom(t=>t.setAttribute(`data-err1`,t.querySelector(`.err`)?`1`:`0`))),o.at(450,()=>o.type(0,`abc999`))},check(o){return o.errors.length?s(`Có lỗi: `+o.errMsg()):o.root()?.getAttribute(`data-err1`)!==`0`?s(`Hai ô đang khớp (abc123) mà vẫn báo lỗi.`):o.query(`.err`).length?g(o.text(`.where`))===`nhóm: true`?i():s(`Lỗi cần nằm ở nhóm account (account.hasError("mismatch")).`):s(`Sửa mật khẩu thành abc999 mà không báo lỗi: validator đặt ở ô xác nhận nên không được chạy lại.`)}},{id:`async-validator`,group:`Validator`,title:`Async validator không gọi API mỗi phím`,level:`Khó`,lv:3,waitMs:1400,desc:`<p>Async validator ch\u1EA1y <b>sau</b> c\xE1c validator th\u01B0\u1EDDng, m\u1ED7i l\u1EA7n gi\xE1 tr\u1ECB \u0111\u1ED5i; trong l\xFAc ch\u1EDD, control \u1EDF tr\u1EA1ng th\xE1i <code>PENDING</code>. G\u1ECDi API th\u1EB3ng trong validator th\xEC g\xF5 "bip" l\xE0 3 request. Angular t\u1EF1 hu\u1EF7 l\u1EA7n ki\u1EC3m tra c\u0169 khi c\xF3 gi\xE1 tr\u1ECB m\u1EDBi, n\xEAn ch\u1EC9 c\u1EA7n ch\u1EDD m\u1ED9t ch\xFAt tr\u01B0\u1EDBc khi g\u1ECDi: <code>timer(300).pipe(switchMap(() =&gt; api\u2026))</code>. (C\xE1ch kh\xE1c: <code>updateOn: 'blur'</code>.)</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang g\xF5 <code>b</code>, <code>bi</code>, <code>bip</code> c\xE1ch nhau 50ms. Ch\u1EC9 \u0111\u01B0\u1EE3c c\xF3 <b>1</b> request ki\u1EC3m tra t\xEAn; tr\u1EA1ng th\xE1i \u0111i qua <code>PENDING</code> r\u1ED3i th\xE0nh <code>INVALID</code> v\u1EDBi l\u1ED7i "T\xEAn \u0111\xE3 c\xF3 ng\u01B0\u1EDDi d\xF9ng".</p>`,starter:`const uniqueName = (c) =>
  fakeApi.get('/check-name?u=' + c.value, { delay: 300, data: c.value === 'bip' }).pipe(
    map((taken) => (taken ? { taken: true } : null)),
  );

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="username" placeholder="T\xEAn \u0111\u0103ng nh\u1EADp" />
    <p class="status">{{ username.status }}</p>
    @if (username.hasError('taken')) { <small class="err">T\xEAn \u0111\xE3 c\xF3 ng\u01B0\u1EDDi d\xF9ng</small> }
  \`,
})
class App {
  username = new FormControl('', { asyncValidators: [uniqueName] });
}

mount(App);
`,solution:`const uniqueName = (c) =>
  timer(300).pipe(
    switchMap(() => fakeApi.get('/check-name?u=' + c.value, { delay: 300, data: c.value === 'bip' })),
    map((taken) => (taken ? { taken: true } : null)),
  );

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="username" placeholder="T\xEAn \u0111\u0103ng nh\u1EADp" />
    <p class="status">{{ username.status }}</p>
    @if (username.hasError('taken')) { <small class="err">T\xEAn \u0111\xE3 c\xF3 ng\u01B0\u1EDDi d\xF9ng</small> }
  \`,
})
class App {
  username = new FormControl('', { asyncValidators: [uniqueName] });
}

mount(App);
`,hint:`Bọc lời gọi API: timer(300).pipe(switchMap(() => fakeApi.get(…)), map(…)). Khi giá trị đổi trong 300ms đó, Angular huỷ timer cũ nên request chưa kịp gửi.`,explain:`Async validator chỉ chạy khi các validator thường đã hợp lệ, nên đặt Validators.required / minLength trước để khỏi gọi API với giá trị rỗng. Không dùng debounceTime trong validator: mỗi lần chạy là một Observable mới chỉ có một giá trị.`,simulate(o){o.at(100,()=>o.type(0,`b`)),o.at(150,()=>o.type(0,`bi`)),o.at(200,()=>o.type(0,`bip`)),o.at(350,()=>o.dom(t=>t.setAttribute(`data-st`,g(t.querySelector(`.status`)?.textContent))))},check(o){if(o.errors.length)return s(`Có lỗi: `+o.errMsg());let t=o.http(`/check-name`).length;return t>1?s(`Có `+t+` request kiểm tra tên: validator đang gọi API ở mỗi lần gõ.`):t===0?s(`Không có request kiểm tra tên nào.`):o.root()?.getAttribute(`data-st`)!==`PENDING`?s(`Trong lúc kiểm tra, trạng thái cần là PENDING (đang là `+o.root()?.getAttribute(`data-st`)+`).`):g(o.text(`.status`))!==`INVALID`?s(`Sau khi kiểm tra xong, trạng thái cần là INVALID.`):o.query(`.err`).length?i():s(`Chưa hiện lỗi "Tên đã có người dùng".`)}},{id:`raw-value`,group:`Đọc giá trị`,title:`Control bị disable biến mất khỏi value: getRawValue()`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Control b\u1ECB <code>disable()</code> kh\xF4ng n\u1EB1m trong <code>form.value</code> (v\xE0 kh\xF4ng t\xEDnh v\xE0o valid/invalid). \xD4 email b\u1ECB kho\xE1 v\xEC \u0111\xE3 x\xE1c minh, n\xEAn g\u1EEDi <code>form.value</code> th\xEC server kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c email. D\xF9ng <code>form.getRawValue()</code> \u0111\u1EC3 l\u1EA5y c\u1EA3 gi\xE1 tr\u1ECB c\u1EE7a control b\u1ECB disable.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>G\u1EEDi</b>, log ph\u1EA3i l\xE0 <code>G\u1EEDi {"name":"B\xEDp","email":"bip@demo.dev"}</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" />
      <input formControlName="email" />
      <button type="submit">G\u1EEDi</button>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('B\xEDp'),
    email: new FormControl({ value: 'bip@demo.dev', disabled: true }), // email \u0111\xE3 x\xE1c minh, kh\xF4ng cho s\u1EEDa
  });

  send() {
    log('G\u1EEDi ' + JSON.stringify(this.form.value));
  }
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" />
      <input formControlName="email" />
      <button type="submit">G\u1EEDi</button>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('B\xEDp'),
    email: new FormControl({ value: 'bip@demo.dev', disabled: true }),
  });

  send() {
    log('G\u1EEDi ' + JSON.stringify(this.form.getRawValue()));
  }
}

mount(App);
`,hint:`Đổi this.form.value thành this.form.getRawValue().`,explain:`Nếu chỉ muốn ô không sửa được mà vẫn nằm trong value, dùng thuộc tính readonly trên <input> thay cho disable().`,simulate(o){o.at(200,()=>o.click(`Gửi`))},check(o){let t=o.logs.find(r=>r.startsWith(`Gửi`));return t?t===`Gửi {"name":"Bíp","email":"bip@demo.dev"}`?i():s(`Log đang là `+t+`: thiếu email vì control bị disable không có trong form.value.`):s(`Bấm Gửi nhưng không có log nào.`)}},{id:`value-changes`,group:`Đọc giá trị`,title:`Form không phải signal: toSignal(valueChanges)`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p><code>form.value</code> l\xE0 thu\u1ED9c t\xEDnh th\u01B0\u1EDDng, kh\xF4ng ph\u1EA3i signal. Vi\u1EBFt <code>computed(() =&gt; this.form.value.qty * 10000)</code> th\xEC computed ch\u1EC9 t\xEDnh <b>m\u1ED9t l\u1EA7n</b> v\xE0 kh\xF4ng bao gi\u1EDD bi\u1EBFt form \u0111\xE3 \u0111\u1ED5i. \u0110\u1ED5i lu\u1ED3ng <code>valueChanges</code> th\xE0nh signal (k\xE8m gi\xE1 tr\u1ECB ban \u0111\u1EA7u) r\u1ED3i m\u1EDBi d\xF9ng trong computed.</p>
<p><b>Y\xEAu c\u1EA7u:</b> g\xF5 s\u1ED1 l\u01B0\u1EE3ng <code>3</code>, t\u1ED5ng ti\u1EC1n ph\u1EA3i hi\u1EC7n <code>30000</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form"><input type="number" formControlName="qty" aria-label="S\u1ED1 l\u01B0\u1EE3ng" /></form>
    <p>T\u1ED5ng: <b class="total">{{ total() }}</b></p>
  \`,
})
class App {
  form = new FormGroup({ qty: new FormControl(1) });
  // \u2757 form.value kh\xF4ng ph\u1EA3i signal: computed kh\xF4ng bi\u1EBFt khi n\xE0o c\u1EA7n t\xEDnh l\u1EA1i
  total = computed(() => this.form.value.qty * 10000);
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form"><input type="number" formControlName="qty" aria-label="S\u1ED1 l\u01B0\u1EE3ng" /></form>
    <p>T\u1ED5ng: <b class="total">{{ total() }}</b></p>
  \`,
})
class App {
  form = new FormGroup({ qty: new FormControl(1) });
  value = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  total = computed(() => this.value().qty * 10000);
}

mount(App);
`,hint:`value = toSignal(this.form.valueChanges, { initialValue: this.form.value }); rồi total = computed(() => this.value().qty * 10000).`,explain:`Signal Forms (bài 12) làm form thành signal ngay từ đầu, không cần cầu nối này. Với Reactive Forms có sẵn, toSignal(valueChanges) là cách gọn nhất để kết hợp với computed.`,simulate(o){o.at(200,()=>o.type(0,`3`))},check(o){if(o.errors.length)return s(`Có lỗi: `+o.errMsg());let t=g(o.text(`.total`));return t===`30000`?i():s(`Tổng đang là `+t+`: computed không biết form.value đã đổi.`)}},{id:`submit-touched`,group:`Gửi form`,title:`Bấm gửi khi form lỗi: markAllAsTouched()`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>L\u1ED7i th\u01B0\u1EDDng ch\u1EC9 hi\u1EC7n khi control \u0111\xE3 <code>touched</code> (ng\u01B0\u1EDDi d\xF9ng \u0111\xE3 r\u1EDDi \xF4), \u0111\u1EC3 kh\xF4ng \u0111\u1ECF c\u1EA3 form ngay l\xFAc m\u1EDF. Nh\u01B0ng ng\u01B0\u1EDDi d\xF9ng b\u1EA5m <b>G\u1EEDi</b> ngay m\xE0 ch\u01B0a ch\u1EA1m \xF4 n\xE0o th\xEC kh\xF4ng th\u1EA5y l\u1ED7i g\xEC v\xE0 t\u01B0\u1EDFng n\xFAt h\u1ECFng. Khi submit m\xE0 form ch\u01B0a h\u1EE3p l\u1EC7: g\u1ECDi <code>form.markAllAsTouched()</code> v\xE0 d\u1EEBng l\u1EA1i.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>G\u1EEDi</b> khi form tr\u1ED1ng: hi\u1EC7n \u0111\u1EE7 2 l\u1ED7i v\xE0 kh\xF4ng c\xF3 log <code>\u0110\xE3 g\u1EEDi</code>.</p>`,starter:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" placeholder="T\xEAn" />
      @if (form.controls.name.touched && form.controls.name.invalid) { <small class="err">C\u1EA7n nh\u1EADp t\xEAn</small> }
      <input formControlName="email" placeholder="Email" />
      @if (form.controls.email.touched && form.controls.email.invalid) { <small class="err">Email kh\xF4ng h\u1EE3p l\u1EC7</small> }
      <button type="submit">G\u1EEDi</button>
    </form>
  \`,
})
class App {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  send() {
    if (this.form.invalid) return; // \u2757 im l\u1EB7ng, ng\u01B0\u1EDDi d\xF9ng kh\xF4ng bi\u1EBFt sai \u1EDF \u0111\xE2u
    log('\u0110\xE3 g\u1EEDi', this.form.value);
  }
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="send()">
      <input formControlName="name" placeholder="T\xEAn" />
      @if (form.controls.name.touched && form.controls.name.invalid) { <small class="err">C\u1EA7n nh\u1EADp t\xEAn</small> }
      <input formControlName="email" placeholder="Email" />
      @if (form.controls.email.touched && form.controls.email.invalid) { <small class="err">Email kh\xF4ng h\u1EE3p l\u1EC7</small> }
      <button type="submit">G\u1EEDi</button>
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
    log('\u0110\xE3 g\u1EEDi', this.form.value);
  }
}

mount(App);
`,hint:`Trong send(): nếu this.form.invalid thì gọi this.form.markAllAsTouched() rồi return.`,explain:`Thêm một bước tốt cho accessibility: đưa focus tới ô lỗi đầu tiên để người dùng bàn phím và trình đọc màn hình biết cần sửa ở đâu.`,simulate(o){o.at(200,()=>o.click(`Gửi`))},check(o){if(o.logs.some(r=>r.startsWith(`Đã gửi`)))return s(`Form trống mà vẫn gửi đi.`);let t=o.query(`.err`).length;return t===2?i():s(`Bấm Gửi khi form trống mà chỉ hiện `+t+` lỗi, cần 2.`)}}],extras:()=>import(`./chunk-Da5SC_zW.js`).then(o=>o.formsExtras()),cheatsheet:[[`Thêm dòng`,`<code>items.push(new FormControl(''))</code>, xoá: <code>removeAt(i)</code>`],[`So sánh nhiều ô`,`<code>new FormGroup({...}, { validators: fn })</code>`],[`Kiểm tra qua API`,`<code>{ asyncValidators: [c =&gt; timer(300).pipe(switchMap(…))] }</code>`],[`Lấy cả ô bị disable`,`<code>form.getRawValue()</code>`],[`Dùng với signal`,`<code>toSignal(form.valueChanges, { initialValue: form.value })</code>`],[`Submit khi lỗi`,`<code>form.markAllAsTouched()</code>`]]};export{l as LAB};