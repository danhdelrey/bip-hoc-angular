import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 2 — Data binding: interpolation, property binding, event binding + $event,
 * class binding, style binding, [(ngModel)] hai chiều, lọc phím (keyup.enter) + template reference.
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử mọi kiểu binding: <code>{{ x() }}</code>, <code>[prop]</code>, <code>(event)</code>, <code>[class.x]</code>, <code>[style.x]</code>, <code>[(ngModel)]</code>. <code>FormsModule</code> có sẵn để thêm vào <code>imports</code>.</p>`,
    starter: `@Component({
  selector: 'app-playground',
  imports: [FormsModule],
  template: \`
    <input [(ngModel)]="name" placeholder="Tên" />
    <p [class.long]="name().length > 5">Xin chào, {{ name() }}!</p>
    <button [disabled]="!name()" (click)="name.set('')">Xoá</button>
  \`,
  styles: '.long { color: rgb(79, 70, 229); font-weight: 700; }',
})
class Playground {
  name = signal('Bíp');
}

mount(Playground);
`,
  },
  {
    id: 'interpolation', group: 'Class → DOM', title: 'Interpolation {{ }}', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Interpolation <code>{{ biểu thức }}</code> đưa giá trị từ class vào chữ của template. Signal là một hàm, nên phải <b>gọi</b> nó: <code>{{ name() }}</code>.</p>
<p><b>Yêu cầu:</b> đoạn văn phải hiển thị <code>Bíp có 3 lượt thích</code>.</p>`,
    starter: `@Component({
  selector: 'app-profile',
  template: \`
    <p>{{ name }} có {{ likes }} lượt thích</p>
  \`,
})
class Profile {
  name = signal('Bíp');
  likes = signal(3);
}

mount(Profile);
`,
    solution: `@Component({
  selector: 'app-profile',
  template: \`
    <p>{{ name() }} có {{ likes() }} lượt thích</p>
  \`,
})
class Profile {
  name = signal('Bíp');
  likes = signal(3);
}

mount(Profile);
`,
    hint: 'Thêm () sau name và likes trong template.',
    explain: 'Quên () thì template in ra chính hàm signal (mã nguồn của nó) thay vì giá trị. Đây là lỗi hay gặp nhất khi mới chuyển sang signal.',
    check(a) {
      const t = a.text('p');
      if (t === 'Bíp có 3 lượt thích') return OK();
      if (/=>|function/.test(t)) return NO('Đoạn văn đang in ra mã nguồn của hàm: bạn quên () khi đọc signal.');
      return NO('Đoạn văn đang là "' + t + '", cần "Bíp có 3 lượt thích".');
    },
  },
  {
    id: 'property-binding', group: 'Class → DOM', title: 'Property binding [disabled]', level: 'Dễ', lv: 1, waitMs: 1000,
    desc: `<p><code>[prop]="biểu thức"</code> gán <b>giá trị</b> (boolean, số, object…) vào property của phần tử. Interpolation <code>prop="{{ … }}"</code> luôn tạo ra <b>chuỗi</b>, mà chuỗi <code>"false"</code> vẫn là truthy nên nút bị khoá.</p>
<p><b>Yêu cầu:</b> nút <b>Thêm món</b> chỉ bị khoá khi đã đủ 5 món. Khi kiểm tra, trang bấm nút 7 lần; kết quả phải là <code>Đã thêm 5/5 món</code> và nút bị khoá.</p>`,
    starter: `@Component({
  selector: 'app-limit',
  template: \`
    <p>Đã thêm {{ count() }}/5 món</p>
    <button disabled="{{ count() >= 5 }}" (click)="add()">Thêm món</button>
  \`,
})
class Limit {
  count = signal(0);

  add() {
    this.count.update(c => c + 1);
  }
}

mount(Limit);
`,
    solution: `@Component({
  selector: 'app-limit',
  template: \`
    <p>Đã thêm {{ count() }}/5 món</p>
    <button [disabled]="count() >= 5" (click)="add()">Thêm món</button>
  \`,
})
class Limit {
  count = signal(0);

  add() {
    this.count.update(c => c + 1);
  }
}

mount(Limit);
`,
    hint: 'Đổi disabled="{{ … }}" thành [disabled]="count() >= 5".',
    explain: 'Dùng interpolation cho thuộc tính chỉ đúng khi giá trị là chuỗi (title, alt, placeholder…). Với boolean, số, object hãy luôn dùng [prop].',
    simulate(s) { for (let i = 1; i <= 7; i++) s.at(i * 100, () => s.click('Thêm món')); },
    check(a) {
      const t = a.text('p');
      const btn = a.query('button')[0] as HTMLButtonElement | undefined;
      if (t === 'Đã thêm 0/5 món') return NO('Nút bị khoá ngay từ đầu: interpolation biến false thành chuỗi "false", vẫn là truthy. Dùng [disabled].');
      if (t !== 'Đã thêm 5/5 món') return NO('Đoạn văn đang là "' + t + '", cần "Đã thêm 5/5 món" (nút phải khoá khi đủ 5).');
      if (!btn?.disabled) return NO('Đã đủ 5 món nhưng nút chưa bị khoá.');
      return OK();
    },
  },
  {
    id: 'event-binding', group: 'DOM → Class', title: 'Event binding và $event', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p><code>(sự-kiện)="method($event)"</code> gọi method khi sự kiện DOM xảy ra; <code>$event</code> là object sự kiện. Sự kiện <code>change</code> của ô nhập chỉ chạy khi rời ô, còn <code>input</code> chạy sau <b>mỗi lần gõ</b>.</p>
<p><b>Yêu cầu:</b> lời chào cập nhật ngay khi gõ. Khi kiểm tra, trang gõ <code>An</code> (không rời ô); đoạn văn phải là <code>Xin chào, An!</code>.</p>`,
    starter: `@Component({
  selector: 'app-greet',
  template: \`
    <input placeholder="Tên của bạn" (change)="onName($event)" />
    <p>Xin chào, {{ name() || 'bạn' }}!</p>
  \`,
})
class Greet {
  name = signal('');

  onName(event) {
    this.name.set(event.target.value);
  }
}

mount(Greet);
`,
    solution: `@Component({
  selector: 'app-greet',
  template: \`
    <input placeholder="Tên của bạn" (input)="onName($event)" />
    <p>Xin chào, {{ name() || 'bạn' }}!</p>
  \`,
})
class Greet {
  name = signal('');

  onName(event) {
    this.name.set(event.target.value);
  }
}

mount(Greet);
`,
    hint: 'Đổi (change) thành (input).',
    explain: 'Trong TypeScript, $event có kiểu Event nên cần ép kiểu: (event.target as HTMLInputElement).value. Với form phức tạp, dùng [(ngModel)] hoặc Signal Forms/Reactive Forms thay vì tự đọc $event.',
    simulate(s) { s.at(100, () => s.type(0, 'An')); },
    check(a) {
      const t = a.text('p');
      if (t === 'Xin chào, An!') return OK();
      if (t === 'Xin chào, bạn!') return NO('Gõ "An" nhưng lời chào chưa đổi: (change) chỉ chạy khi rời ô nhập. Dùng (input).');
      return NO('Đoạn văn đang là "' + t + '", cần "Xin chào, An!".');
    },
  },
  {
    id: 'class-binding', group: 'Class → DOM', title: 'Class binding [class.active]', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p><code>[class.tên]="điều kiện"</code> bật/tắt một class CSS theo điều kiện. Không cần tự ghép chuỗi class.</p>
<p><b>Yêu cầu:</b> tab đang chọn có class <code>active</code>, các tab khác thì không. Khi kiểm tra, trang bấm tab <b>Đánh giá</b>.</p>`,
    starter: `@Component({
  selector: 'app-tabs',
  template: \`
    <!-- TODO: thêm [class.active] cho từng tab -->
    <button class="tab" (click)="active.set('Mô tả')">Mô tả</button>
    <button class="tab" (click)="active.set('Đánh giá')">Đánh giá</button>
    <button class="tab" (click)="active.set('Hỏi đáp')">Hỏi đáp</button>
    <p>Đang xem: {{ active() }}</p>
  \`,
  styles: '.tab.active { font-weight: 700; border-bottom: 3px solid rgb(79, 70, 229); }',
})
class Tabs {
  active = signal('Mô tả');
}

mount(Tabs);
`,
    solution: `@Component({
  selector: 'app-tabs',
  template: \`
    <button class="tab" [class.active]="active() === 'Mô tả'" (click)="active.set('Mô tả')">Mô tả</button>
    <button class="tab" [class.active]="active() === 'Đánh giá'" (click)="active.set('Đánh giá')">Đánh giá</button>
    <button class="tab" [class.active]="active() === 'Hỏi đáp'" (click)="active.set('Hỏi đáp')">Hỏi đáp</button>
    <p>Đang xem: {{ active() }}</p>
  \`,
  styles: '.tab.active { font-weight: 700; border-bottom: 3px solid rgb(79, 70, 229); }',
})
class Tabs {
  active = signal('Mô tả');
}

mount(Tabs);
`,
    hint: "[class.active]=\"active() === 'Đánh giá'\" cho tab Đánh giá, tương tự với hai tab còn lại.",
    explain: 'Class binding giữ nguyên các class tĩnh (class="tab"). Nhiều class cùng lúc thì dùng [class]="{ active: a, disabled: b }".',
    simulate(s) { s.at(100, () => s.click('Đánh giá')); },
    check(a) {
      const tabs = a.query('button.tab');
      const act = tabs.map((t) => t.classList.contains('active'));
      if (JSON.stringify(act) === '[false,true,false]') return OK();
      if (!act.some(Boolean)) return NO('Chưa tab nào có class active.');
      return NO('Class active đang ở: ' + JSON.stringify(act) + ', cần chỉ tab Đánh giá.');
    },
  },
  {
    id: 'style-binding', group: 'Class → DOM', title: 'Style binding [style.width.%]', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p><code>[style.thuộc-tính.đơn-vị]="giá trị"</code> gán style theo state, ví dụ <code>[style.width.%]="value()"</code>.</p>
<p><b>Yêu cầu:</b> thanh tiến độ <code>.bar</code> rộng đúng bằng <code>value()</code> phần trăm. Khi kiểm tra, trang bấm <b>+20%</b> ba lần; <code>.bar</code> phải rộng <code>60%</code>.</p>`,
    starter: `@Component({
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
`,
    solution: `@Component({
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
`,
    hint: 'Thêm [style.width.%]="value()" vào thẻ div.bar.',
    explain: 'Phần đơn vị (.%, .px, .rem) giúp khỏi ghép chuỗi. Nhiều style cùng lúc: [style]="{ width: w + \'%\', opacity: o }".',
    simulate(s) { [100, 200, 300].forEach((t) => s.at(t, () => s.click('+20%'))); },
    check(a) {
      const bar = a.query('.bar')[0] as HTMLElement | undefined;
      if (!bar) return NO('Không thấy thẻ .bar.');
      if (bar.style.width === '60%') return OK();
      if (!bar.style.width) return NO('.bar chưa có style width nào được bind. Dùng [style.width.%].');
      return NO('.bar đang rộng ' + bar.style.width + ', cần 60%.');
    },
  },
  {
    id: 'ngmodel', group: 'Hai chiều', title: 'Hai chiều với [(ngModel)]', level: 'Trung bình', lv: 2, waitMs: 800,
    desc: `<p><code>[(ngModel)]="sig"</code> ("hộp chuối") đồng bộ hai chiều giữa ô nhập và signal: gõ thì signal đổi, set signal thì ô nhập đổi. Directive <code>ngModel</code> nằm trong <code>FormsModule</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang gõ <code>Bíp siêu nhân</code> rồi bấm <b>Xoá</b>. Signal phải nhận giá trị đã gõ (xem log), và ô nhập phải trống sau khi Xoá.</p>`,
    starter: `@Component({
  selector: 'app-nickname',
  template: \`
    <input placeholder="Biệt danh" [(ngModel)]="nickname" />
    <p>Biệt danh: {{ nickname() }}</p>
    <button (click)="nickname.set('')">Xoá</button>
  \`,
})
class Nickname {
  nickname = signal('Bíp');

  constructor() {
    effect(() => log('nickname =', this.nickname()));
  }
}

mount(Nickname);
`,
    solution: `@Component({
  selector: 'app-nickname',
  imports: [FormsModule],
  template: \`
    <input placeholder="Biệt danh" [(ngModel)]="nickname" />
    <p>Biệt danh: {{ nickname() }}</p>
    <button (click)="nickname.set('')">Xoá</button>
  \`,
})
class Nickname {
  nickname = signal('Bíp');

  constructor() {
    effect(() => log('nickname =', this.nickname()));
  }
}

mount(Nickname);
`,
    hint: 'Thêm imports: [FormsModule] vào metadata của component.',
    explain: 'Thiếu FormsModule thì bản production không báo lỗi: [(ngModel)] bị coi là property lạ của <input>. Thứ tự đúng là [( )] — "hộp chuối" — không phải ([ ]).',
    simulate(s) { s.at(200, () => s.type(0, 'Bíp siêu nhân')); s.at(450, () => s.click('Xoá')); },
    check(a) {
      const inp = a.query('input')[0] as HTMLInputElement | undefined;
      if (!a.logs.includes('nickname = Bíp siêu nhân')) return NO('Gõ "Bíp siêu nhân" nhưng signal không nhận được giá trị (log không có). Kiểm tra imports: [FormsModule].');
      if (inp && inp.value !== '') return NO('Bấm Xoá nhưng ô nhập vẫn còn "' + inp.value + '": chiều signal → ô nhập chưa chạy.');
      return OK();
    },
  },
  {
    id: 'keyup-enter', group: 'DOM → Class', title: 'Nhấn Enter để thêm: (keyup.enter) + #ref', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p>Angular lọc phím ngay trong event binding: <code>(keyup.enter)</code> chỉ chạy khi nhấn Enter. Template reference <code>#box</code> cho phép template đọc trực tiếp phần tử <code>&lt;input&gt;</code>.</p>
<p><b>Yêu cầu:</b> nhấn Enter trong ô nhập cũng thêm việc (giống bấm nút) rồi xoá ô nhập. Khi kiểm tra, trang gõ hai việc, mỗi việc nhấn Enter một lần.</p>`,
    starter: `@Component({
  selector: 'app-todo',
  template: \`
    <input #box placeholder="Việc cần làm" />
    <button (click)="add(box.value); box.value = ''">Thêm</button>
    <p>Đã có {{ todos().length }} việc: {{ todos().join(', ') }}</p>
  \`,
})
class Todo {
  todos = signal([]);

  add(text) {
    if (text.trim()) this.todos.update(list => [...list, text.trim()]);
  }
}

mount(Todo);
`,
    solution: `@Component({
  selector: 'app-todo',
  template: \`
    <input #box placeholder="Việc cần làm" (keyup.enter)="add(box.value); box.value = ''" />
    <button (click)="add(box.value); box.value = ''">Thêm</button>
    <p>Đã có {{ todos().length }} việc: {{ todos().join(', ') }}</p>
  \`,
})
class Todo {
  todos = signal([]);

  add(text) {
    if (text.trim()) this.todos.update(list => [...list, text.trim()]);
  }
}

mount(Todo);
`,
    hint: "Thêm (keyup.enter)=\"add(box.value); box.value = ''\" vào thẻ input.",
    explain: 'Có thể lọc tổ hợp phím: (keydown.control.s), (keyup.shift.enter)… Template reference (#box) tiện cho trường hợp đơn giản; dữ liệu cần validate thì nên dùng form.',
    simulate(s) {
      s.at(100, () => s.type(0, 'Học Angular')); s.at(200, () => s.press(0, 'Enter'));
      s.at(300, () => s.type(0, 'Đi chợ')); s.at(400, () => s.press(0, 'Enter'));
    },
    check(a) {
      const t = a.text('p');
      const inp = a.query('input')[0] as HTMLInputElement | undefined;
      if (t === 'Đã có 2 việc: Học Angular, Đi chợ' && inp?.value === '') return OK();
      if (t.startsWith('Đã có 0')) return NO('Nhấn Enter chưa thêm việc nào. Dùng (keyup.enter) trên ô nhập.');
      if (inp && inp.value !== '') return NO('Đã thêm nhưng ô nhập chưa được xoá sau khi nhấn Enter.');
      return NO('Đoạn văn đang là "' + t + '", cần "Đã có 2 việc: Học Angular, Đi chợ".');
    },
  },
];

export const LAB: LabModule = {
  title: 'Data binding',
  subtitle: 'bài luyện binding giữa class và DOM trên component thật: interpolation, [property], (event) + $event, [class], [style], [(ngModel)], lọc phím.',
  exercises: EXERCISES,
  extras: () => import('../../../shared/lab/lab-forms').then((m) => m.formsExtras()),
  cheatsheet: [
    ['Hiển thị giá trị trong chữ', '<code>{{ value() }}</code>'],
    ['Gán property (boolean, số, object)', '<code>[disabled]="cond()"</code>, <code>[src]="url()"</code>'],
    ['Bắt sự kiện', '<code>(click)="save()"</code>, <code>(input)="onInput($event)"</code>'],
    ['Lọc phím', '<code>(keyup.enter)</code>, <code>(keydown.escape)</code>'],
    ['Bật/tắt class', '<code>[class.active]="cond()"</code> hoặc <code>[class]="{ a: x, b: y }"</code>'],
    ['Style theo state', '<code>[style.width.%]="value()"</code>'],
    ['Hai chiều với ô nhập', '<code>[(ngModel)]="sig"</code> + <code>imports: [FormsModule]</code>'],
    ['Đọc phần tử trong template', 'template reference <code>#box</code> → <code>box.value</code>'],
  ],
};
