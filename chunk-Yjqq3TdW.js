import{a as s$1,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var s={title:`Data binding`,subtitle:`bài luyện binding giữa class và DOM trên component thật: interpolation, [property], (event) + $event, [class], [style], [(ngModel)], lọc phím.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Thử mọi kiểu binding: <code>{{ x() }}</code>, <code>[prop]</code>, <code>(event)</code>, <code>[class.x]</code>, <code>[style.x]</code>, <code>[(ngModel)]</code>. <code>FormsModule</code> có sẵn để thêm vào <code>imports</code>.</p>`,starter:`@Component({
  selector: 'app-playground',
  imports: [FormsModule],
  template: \`
    <input [(ngModel)]="name" placeholder="T\xEAn" />
    <p [class.long]="name().length > 5">Xin ch\xE0o, {{ name() }}!</p>
    <button [disabled]="!name()" (click)="name.set('')">Xo\xE1</button>
  \`,
  styles: '.long { color: rgb(79, 70, 229); font-weight: 700; }',
})
class Playground {
  name = signal('B\xEDp');
}

mount(Playground);
`},{id:`interpolation`,group:`Class → DOM`,title:`Interpolation {{ }}`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Interpolation <code>{{ bi\u1EC3u th\u1EE9c }}</code> \u0111\u01B0a gi\xE1 tr\u1ECB t\u1EEB class v\xE0o ch\u1EEF c\u1EE7a template. Signal l\xE0 m\u1ED9t h\xE0m, n\xEAn ph\u1EA3i <b>g\u1ECDi</b> n\xF3: <code>{{ name() }}</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> \u0111o\u1EA1n v\u0103n ph\u1EA3i hi\u1EC3n th\u1ECB <code>B\xEDp c\xF3 3 l\u01B0\u1EE3t th\xEDch</code>.</p>`,starter:`@Component({
  selector: 'app-profile',
  template: \`
    <p>{{ name }} c\xF3 {{ likes }} l\u01B0\u1EE3t th\xEDch</p>
  \`,
})
class Profile {
  name = signal('B\xEDp');
  likes = signal(3);
}

mount(Profile);
`,solution:`@Component({
  selector: 'app-profile',
  template: \`
    <p>{{ name() }} c\xF3 {{ likes() }} l\u01B0\u1EE3t th\xEDch</p>
  \`,
})
class Profile {
  name = signal('B\xEDp');
  likes = signal(3);
}

mount(Profile);
`,hint:`Thêm () sau name và likes trong template.`,explain:`Quên () thì template in ra chính hàm signal (mã nguồn của nó) thay vì giá trị. Đây là lỗi hay gặp nhất khi mới chuyển sang signal.`,check(t){let e=t.text(`p`);return e===`Bíp có 3 lượt thích`?i():/=>|function/.test(e)?s$1(`Đoạn văn đang in ra mã nguồn của hàm: bạn quên () khi đọc signal.`):s$1(`Đoạn văn đang là "`+e+`", cần "Bíp có 3 lượt thích".`)}},{id:`property-binding`,group:`Class → DOM`,title:`Property binding [disabled]`,level:`Dễ`,lv:1,waitMs:1e3,desc:`<p><code>[prop]="bi\u1EC3u th\u1EE9c"</code> g\xE1n <b>gi\xE1 tr\u1ECB</b> (boolean, s\u1ED1, object\u2026) v\xE0o property c\u1EE7a ph\u1EA7n t\u1EED. Interpolation <code>prop="{{ \u2026 }}"</code> lu\xF4n t\u1EA1o ra <b>chu\u1ED7i</b>, m\xE0 chu\u1ED7i <code>"false"</code> v\u1EABn l\xE0 truthy n\xEAn n\xFAt b\u1ECB kho\xE1.</p>
<p><b>Y\xEAu c\u1EA7u:</b> n\xFAt <b>Th\xEAm m\xF3n</b> ch\u1EC9 b\u1ECB kho\xE1 khi \u0111\xE3 \u0111\u1EE7 5 m\xF3n. Khi ki\u1EC3m tra, trang b\u1EA5m n\xFAt 7 l\u1EA7n; k\u1EBFt qu\u1EA3 ph\u1EA3i l\xE0 <code>\u0110\xE3 th\xEAm 5/5 m\xF3n</code> v\xE0 n\xFAt b\u1ECB kho\xE1.</p>`,starter:`@Component({
  selector: 'app-limit',
  template: \`
    <p>\u0110\xE3 th\xEAm {{ count() }}/5 m\xF3n</p>
    <button disabled="{{ count() >= 5 }}" (click)="add()">Th\xEAm m\xF3n</button>
  \`,
})
class Limit {
  count = signal(0);

  add() {
    this.count.update(c => c + 1);
  }
}

mount(Limit);
`,solution:`@Component({
  selector: 'app-limit',
  template: \`
    <p>\u0110\xE3 th\xEAm {{ count() }}/5 m\xF3n</p>
    <button [disabled]="count() >= 5" (click)="add()">Th\xEAm m\xF3n</button>
  \`,
})
class Limit {
  count = signal(0);

  add() {
    this.count.update(c => c + 1);
  }
}

mount(Limit);
`,hint:`Đổi disabled="{{ … }}" thành [disabled]="count() >= 5".`,explain:`Dùng interpolation cho thuộc tính chỉ đúng khi giá trị là chuỗi (title, alt, placeholder…). Với boolean, số, object hãy luôn dùng [prop].`,simulate(t){for(let e=1;e<=7;e++)t.at(e*100,()=>t.click(`Thêm món`))},check(t){let e=t.text(`p`),i$1=t.query(`button`)[0];return e===`Đã thêm 0/5 món`?s$1(`Nút bị khoá ngay từ đầu: interpolation biến false thành chuỗi "false", vẫn là truthy. Dùng [disabled].`):e!==`Đã thêm 5/5 món`?s$1(`Đoạn văn đang là "`+e+`", cần "Đã thêm 5/5 món" (nút phải khoá khi đủ 5).`):i$1?.disabled?i():s$1(`Đã đủ 5 món nhưng nút chưa bị khoá.`)}},{id:`event-binding`,group:`DOM → Class`,title:`Event binding và $event`,level:`Dễ`,lv:1,waitMs:500,desc:`<p><code>(s\u1EF1-ki\u1EC7n)="method($event)"</code> g\u1ECDi method khi s\u1EF1 ki\u1EC7n DOM x\u1EA3y ra; <code>$event</code> l\xE0 object s\u1EF1 ki\u1EC7n. S\u1EF1 ki\u1EC7n <code>change</code> c\u1EE7a \xF4 nh\u1EADp ch\u1EC9 ch\u1EA1y khi r\u1EDDi \xF4, c\xF2n <code>input</code> ch\u1EA1y sau <b>m\u1ED7i l\u1EA7n g\xF5</b>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> l\u1EDDi ch\xE0o c\u1EADp nh\u1EADt ngay khi g\xF5. Khi ki\u1EC3m tra, trang g\xF5 <code>An</code> (kh\xF4ng r\u1EDDi \xF4); \u0111o\u1EA1n v\u0103n ph\u1EA3i l\xE0 <code>Xin ch\xE0o, An!</code>.</p>`,starter:`@Component({
  selector: 'app-greet',
  template: \`
    <input placeholder="T\xEAn c\u1EE7a b\u1EA1n" (change)="onName($event)" />
    <p>Xin ch\xE0o, {{ name() || 'b\u1EA1n' }}!</p>
  \`,
})
class Greet {
  name = signal('');

  onName(event) {
    this.name.set(event.target.value);
  }
}

mount(Greet);
`,solution:`@Component({
  selector: 'app-greet',
  template: \`
    <input placeholder="T\xEAn c\u1EE7a b\u1EA1n" (input)="onName($event)" />
    <p>Xin ch\xE0o, {{ name() || 'b\u1EA1n' }}!</p>
  \`,
})
class Greet {
  name = signal('');

  onName(event) {
    this.name.set(event.target.value);
  }
}

mount(Greet);
`,hint:`Đổi (change) thành (input).`,explain:`Trong TypeScript, $event có kiểu Event nên cần ép kiểu: (event.target as HTMLInputElement).value. Với form phức tạp, dùng [(ngModel)] hoặc Signal Forms/Reactive Forms thay vì tự đọc $event.`,simulate(t){t.at(100,()=>t.type(0,`An`))},check(t){let e=t.text(`p`);return e===`Xin chào, An!`?i():e===`Xin chào, bạn!`?s$1(`Gõ "An" nhưng lời chào chưa đổi: (change) chỉ chạy khi rời ô nhập. Dùng (input).`):s$1(`Đoạn văn đang là "`+e+`", cần "Xin chào, An!".`)}},{id:`class-binding`,group:`Class → DOM`,title:`Class binding [class.active]`,level:`Dễ`,lv:1,waitMs:500,desc:`<p><code>[class.t\xEAn]="\u0111i\u1EC1u ki\u1EC7n"</code> b\u1EADt/t\u1EAFt m\u1ED9t class CSS theo \u0111i\u1EC1u ki\u1EC7n. Kh\xF4ng c\u1EA7n t\u1EF1 gh\xE9p chu\u1ED7i class.</p>
<p><b>Y\xEAu c\u1EA7u:</b> tab \u0111ang ch\u1ECDn c\xF3 class <code>active</code>, c\xE1c tab kh\xE1c th\xEC kh\xF4ng. Khi ki\u1EC3m tra, trang b\u1EA5m tab <b>\u0110\xE1nh gi\xE1</b>.</p>`,starter:`@Component({
  selector: 'app-tabs',
  template: \`
    <!-- TODO: th\xEAm [class.active] cho t\u1EEBng tab -->
    <button class="tab" (click)="active.set('M\xF4 t\u1EA3')">M\xF4 t\u1EA3</button>
    <button class="tab" (click)="active.set('\u0110\xE1nh gi\xE1')">\u0110\xE1nh gi\xE1</button>
    <button class="tab" (click)="active.set('H\u1ECFi \u0111\xE1p')">H\u1ECFi \u0111\xE1p</button>
    <p>\u0110ang xem: {{ active() }}</p>
  \`,
  styles: '.tab.active { font-weight: 700; border-bottom: 3px solid rgb(79, 70, 229); }',
})
class Tabs {
  active = signal('M\xF4 t\u1EA3');
}

mount(Tabs);
`,solution:`@Component({
  selector: 'app-tabs',
  template: \`
    <button class="tab" [class.active]="active() === 'M\xF4 t\u1EA3'" (click)="active.set('M\xF4 t\u1EA3')">M\xF4 t\u1EA3</button>
    <button class="tab" [class.active]="active() === '\u0110\xE1nh gi\xE1'" (click)="active.set('\u0110\xE1nh gi\xE1')">\u0110\xE1nh gi\xE1</button>
    <button class="tab" [class.active]="active() === 'H\u1ECFi \u0111\xE1p'" (click)="active.set('H\u1ECFi \u0111\xE1p')">H\u1ECFi \u0111\xE1p</button>
    <p>\u0110ang xem: {{ active() }}</p>
  \`,
  styles: '.tab.active { font-weight: 700; border-bottom: 3px solid rgb(79, 70, 229); }',
})
class Tabs {
  active = signal('M\xF4 t\u1EA3');
}

mount(Tabs);
`,hint:`[class.active]="active() === '\u0110\xE1nh gi\xE1'" cho tab \u0110\xE1nh gi\xE1, t\u01B0\u01A1ng t\u1EF1 v\u1EDBi hai tab c\xF2n l\u1EA1i.`,explain:`Class binding giữ nguyên các class tĩnh (class="tab"). Nhiều class cùng lúc thì dùng [class]="{ active: a, disabled: b }".`,simulate(t){t.at(100,()=>t.click(`Đánh giá`))},check(t){let i$2=t.query(`button.tab`).map(c=>c.classList.contains(`active`));return JSON.stringify(i$2)===`[false,true,false]`?i():i$2.some(Boolean)?s$1(`Class active đang ở: `+JSON.stringify(i$2)+`, cần chỉ tab Đánh giá.`):s$1(`Chưa tab nào có class active.`)}},{id:`style-binding`,group:`Class → DOM`,title:`Style binding [style.width.%]`,level:`Dễ`,lv:1,waitMs:600,desc:`<p><code>[style.thu\u1ED9c-t\xEDnh.\u0111\u01A1n-v\u1ECB]="gi\xE1 tr\u1ECB"</code> g\xE1n style theo state, v\xED d\u1EE5 <code>[style.width.%]="value()"</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> thanh ti\u1EBFn \u0111\u1ED9 <code>.bar</code> r\u1ED9ng \u0111\xFAng b\u1EB1ng <code>value()</code> ph\u1EA7n tr\u0103m. Khi ki\u1EC3m tra, trang b\u1EA5m <b>+20%</b> ba l\u1EA7n; <code>.bar</code> ph\u1EA3i r\u1ED9ng <code>60%</code>.</p>`,starter:`@Component({
  selector: 'app-progress',
  template: \`
    <div class="track"><div class="bar"></div></div>
    <p>{{ value() }}%</p>
    <button (click)="step()">+20%</button>
  \`,
  styles: \`
    .track { height: 10px; background: rgb(226, 232, 240); border-radius: 99px; overflow: hidden; }
    .bar { height: 100%; width: 0; background: rgb(79, 70, 229); transition: width .2s; }
  \`,
})
class Progress {
  value = signal(0);

  step() {
    this.value.update(v => Math.min(100, v + 20));
  }
}

mount(Progress);
`,solution:`@Component({
  selector: 'app-progress',
  template: \`
    <div class="track"><div class="bar" [style.width.%]="value()"></div></div>
    <p>{{ value() }}%</p>
    <button (click)="step()">+20%</button>
  \`,
  styles: \`
    .track { height: 10px; background: rgb(226, 232, 240); border-radius: 99px; overflow: hidden; }
    .bar { height: 100%; width: 0; background: rgb(79, 70, 229); transition: width .2s; }
  \`,
})
class Progress {
  value = signal(0);

  step() {
    this.value.update(v => Math.min(100, v + 20));
  }
}

mount(Progress);
`,hint:`Thêm [style.width.%]="value()" vào thẻ div.bar.`,explain:`Ph\u1EA7n \u0111\u01A1n v\u1ECB (.%, .px, .rem) gi\xFAp kh\u1ECFi gh\xE9p chu\u1ED7i. Nhi\u1EC1u style c\xF9ng l\xFAc: [style]="{ width: w + '%', opacity: o }".`,simulate(t){[100,200,300].forEach(e=>t.at(e,()=>t.click(`+20%`)))},check(t){let e=t.query(`.bar`)[0];return e?e.style.width===`60%`?i():e.style.width?s$1(`.bar đang rộng `+e.style.width+`, cần 60%.`):s$1(`.bar chưa có style width nào được bind. Dùng [style.width.%].`):s$1(`Không thấy thẻ .bar.`)}},{id:`ngmodel`,group:`Hai chiều`,title:`Hai chiều với [(ngModel)]`,level:`Trung bình`,lv:2,waitMs:800,desc:`<p><code>[(ngModel)]="sig"</code> ("h\u1ED9p chu\u1ED1i") \u0111\u1ED3ng b\u1ED9 hai chi\u1EC1u gi\u1EEFa \xF4 nh\u1EADp v\xE0 signal: g\xF5 th\xEC signal \u0111\u1ED5i, set signal th\xEC \xF4 nh\u1EADp \u0111\u1ED5i. Directive <code>ngModel</code> n\u1EB1m trong <code>FormsModule</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang g\xF5 <code>B\xEDp si\xEAu nh\xE2n</code> r\u1ED3i b\u1EA5m <b>Xo\xE1</b>. Signal ph\u1EA3i nh\u1EADn gi\xE1 tr\u1ECB \u0111\xE3 g\xF5 (xem log), v\xE0 \xF4 nh\u1EADp ph\u1EA3i tr\u1ED1ng sau khi Xo\xE1.</p>`,starter:`@Component({
  selector: 'app-nickname',
  template: \`
    <input placeholder="Bi\u1EC7t danh" [(ngModel)]="nickname" />
    <p>Bi\u1EC7t danh: {{ nickname() }}</p>
    <button (click)="nickname.set('')">Xo\xE1</button>
  \`,
})
class Nickname {
  nickname = signal('B\xEDp');

  constructor() {
    effect(() => log('nickname =', this.nickname()));
  }
}

mount(Nickname);
`,solution:`@Component({
  selector: 'app-nickname',
  imports: [FormsModule],
  template: \`
    <input placeholder="Bi\u1EC7t danh" [(ngModel)]="nickname" />
    <p>Bi\u1EC7t danh: {{ nickname() }}</p>
    <button (click)="nickname.set('')">Xo\xE1</button>
  \`,
})
class Nickname {
  nickname = signal('B\xEDp');

  constructor() {
    effect(() => log('nickname =', this.nickname()));
  }
}

mount(Nickname);
`,hint:`Thêm imports: [FormsModule] vào metadata của component.`,explain:`Thiếu FormsModule thì bản production không báo lỗi: [(ngModel)] bị coi là property lạ của <input>. Thứ tự đúng là [( )] — "hộp chuối" — không phải ([ ]).`,simulate(t){t.at(200,()=>t.type(0,`Bíp siêu nhân`)),t.at(450,()=>t.click(`Xoá`))},check(t){let e=t.query(`input`)[0];return t.logs.includes(`nickname = Bíp siêu nhân`)?e&&e.value!==``?s$1(`Bấm Xoá nhưng ô nhập vẫn còn "`+e.value+`": chiều signal → ô nhập chưa chạy.`):i():s$1(`Gõ "Bíp siêu nhân" nhưng signal không nhận được giá trị (log không có). Kiểm tra imports: [FormsModule].`)}},{id:`keyup-enter`,group:`DOM → Class`,title:`Nhấn Enter để thêm: (keyup.enter) + #ref`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>Angular l\u1ECDc ph\xEDm ngay trong event binding: <code>(keyup.enter)</code> ch\u1EC9 ch\u1EA1y khi nh\u1EA5n Enter. Template reference <code>#box</code> cho ph\xE9p template \u0111\u1ECDc tr\u1EF1c ti\u1EBFp ph\u1EA7n t\u1EED <code>&lt;input&gt;</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> nh\u1EA5n Enter trong \xF4 nh\u1EADp c\u0169ng th\xEAm vi\u1EC7c (gi\u1ED1ng b\u1EA5m n\xFAt) r\u1ED3i xo\xE1 \xF4 nh\u1EADp. Khi ki\u1EC3m tra, trang g\xF5 hai vi\u1EC7c, m\u1ED7i vi\u1EC7c nh\u1EA5n Enter m\u1ED9t l\u1EA7n.</p>`,starter:`@Component({
  selector: 'app-todo',
  template: \`
    <input #box placeholder="Vi\u1EC7c c\u1EA7n l\xE0m" />
    <button (click)="add(box.value); box.value = ''">Th\xEAm</button>
    <p>\u0110\xE3 c\xF3 {{ todos().length }} vi\u1EC7c: {{ todos().join(', ') }}</p>
  \`,
})
class Todo {
  todos = signal([]);

  add(text) {
    if (text.trim()) this.todos.update(list => [...list, text.trim()]);
  }
}

mount(Todo);
`,solution:`@Component({
  selector: 'app-todo',
  template: \`
    <input #box placeholder="Vi\u1EC7c c\u1EA7n l\xE0m" (keyup.enter)="add(box.value); box.value = ''" />
    <button (click)="add(box.value); box.value = ''">Th\xEAm</button>
    <p>\u0110\xE3 c\xF3 {{ todos().length }} vi\u1EC7c: {{ todos().join(', ') }}</p>
  \`,
})
class Todo {
  todos = signal([]);

  add(text) {
    if (text.trim()) this.todos.update(list => [...list, text.trim()]);
  }
}

mount(Todo);
`,hint:`Th\xEAm (keyup.enter)="add(box.value); box.value = ''" v\xE0o th\u1EBB input.`,explain:`Có thể lọc tổ hợp phím: (keydown.control.s), (keyup.shift.enter)… Template reference (#box) tiện cho trường hợp đơn giản; dữ liệu cần validate thì nên dùng form.`,simulate(t){t.at(100,()=>t.type(0,`Học Angular`)),t.at(200,()=>t.press(0,`Enter`)),t.at(300,()=>t.type(0,`Đi chợ`)),t.at(400,()=>t.press(0,`Enter`))},check(t){let e=t.text(`p`),i$3=t.query(`input`)[0];return e===`Đã có 2 việc: Học Angular, Đi chợ`&&i$3?.value===``?i():e.startsWith(`Đã có 0`)?s$1(`Nhấn Enter chưa thêm việc nào. Dùng (keyup.enter) trên ô nhập.`):i$3&&i$3.value!==``?s$1(`Đã thêm nhưng ô nhập chưa được xoá sau khi nhấn Enter.`):s$1(`Đoạn văn đang là "`+e+`", cần "Đã có 2 việc: Học Angular, Đi chợ".`)}}],extras:()=>import(`./chunk-Da5SC_zW.js`).then(t=>t.formsExtras()),cheatsheet:[[`Hiển thị giá trị trong chữ`,`<code>{{ value() }}</code>`],[`Gán property (boolean, số, object)`,`<code>[disabled]="cond()"</code>, <code>[src]="url()"</code>`],[`Bắt sự kiện`,`<code>(click)="save()"</code>, <code>(input)="onInput($event)"</code>`],[`Lọc phím`,`<code>(keyup.enter)</code>, <code>(keydown.escape)</code>`],[`Bật/tắt class`,`<code>[class.active]="cond()"</code> hoặc <code>[class]="{ a: x, b: y }"</code>`],[`Style theo state`,`<code>[style.width.%]="value()"</code>`],[`Hai chiều với ô nhập`,`<code>[(ngModel)]="sig"</code> + <code>imports: [FormsModule]</code>`],[`Đọc phần tử trong template`,`template reference <code>#box</code> → <code>box.value</code>`]]};export{s as LAB};