import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 4 — Lifecycle hooks: input chưa có trong constructor, phản ứng khi input đổi,
 * dọn dẹp khi bị huỷ (DestroyRef), đo DOM sau khi render (afterNextRender), thứ tự hook,
 * takeUntilDestroyed trong component bị @if gỡ bỏ.
 */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thêm các hook <code>ngOnInit</code>, <code>ngOnChanges</code>, <code>ngAfterViewInit</code>, <code>ngOnDestroy</code> và in log để xem thứ tự Angular gọi chúng. Bấm <b>Dừng</b> để component bị destroy.</p>`,
    starter: `@Component({
  selector: 'app-child',
  template: '<p>Con nhận: {{ value() }}</p>',
})
class Child {
  value = input(0);
  constructor() { log('constructor'); }
  ngOnChanges() { log('ngOnChanges', this.value()); }
  ngOnInit() { log('ngOnInit'); }
  ngAfterViewInit() { log('ngAfterViewInit'); }
  ngOnDestroy() { log('ngOnDestroy'); }
}

@Component({
  selector: 'app-root',
  imports: [Child],
  template: \`
    @if (show()) { <app-child [value]="n()" /> }
    <button (click)="n.update(v => v + 1)">Đổi input</button>
    <button (click)="show.set(!show())">Tạo / Huỷ</button>
  \`,
})
class Root {
  n = signal(0);
  show = signal(true);
}

mount(Root);
`,
  },
  {
    id: 'input-trong-constructor', group: 'Khởi tạo', title: 'Input chưa có trong constructor', level: 'Dễ', lv: 1, waitMs: 500,
    desc: `<p>Angular tạo instance (chạy <code>constructor</code>) <b>trước</b> khi gán input. Đọc input bắt buộc trong constructor sẽ gặp lỗi <code>NG0950</code>. Logic cần input thì đặt trong <code>ngOnInit</code> (chạy sau lần gán input đầu tiên), hoặc dùng <code>computed</code>.</p>
<p><b>Yêu cầu:</b> component con hiển thị <code>Xin chào Bíp</code> mà không có lỗi.</p>`,
    starter: `@Component({
  selector: 'app-greeting',
  template: '<p>{{ message }}</p>',
})
class Greeting {
  name = input.required();
  message = '';

  constructor() {
    // ❗ lúc này Angular CHƯA gán input
    this.message = 'Xin chào ' + this.name();
    log(this.message);
  }
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: '<app-greeting name="Bíp" />',
})
class Root {}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-greeting',
  template: '<p>{{ message }}</p>',
})
class Greeting {
  name = input.required();
  message = '';

  ngOnInit() {
    this.message = 'Xin chào ' + this.name();
    log(this.message);
  }
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: '<app-greeting name="Bíp" />',
})
class Root {}

mount(Root);
`,
    hint: 'Đổi constructor() thành ngOnInit() (giữ nguyên nội dung bên trong).',
    explain: 'Cách hiện đại hơn: message = computed(() => "Xin chào " + this.name()) — vừa không lo thời điểm, vừa tự cập nhật khi input đổi. constructor chỉ nên dùng cho inject() và khởi tạo không phụ thuộc input.',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Đọc input trong constructor là quá sớm.');
      const t = a.text('app-greeting p');
      if (t === 'Xin chào Bíp') return OK();
      return NO('Component con đang hiển thị "' + t + '", cần "Xin chào Bíp".');
    },
  },
  {
    id: 'phan-ung-input-doi', group: 'Khởi tạo', title: 'Phản ứng mỗi khi input đổi', level: 'Trung bình', lv: 2, waitMs: 700,
    desc: `<p><code>ngOnInit</code> chỉ chạy <b>một lần</b>. Khi cha đổi input (ví dụ chọn user khác), logic "tải lại" đặt trong <code>ngOnInit</code> sẽ không chạy nữa. Hai cách đúng: <code>effect()</code> đọc input (chạy lại mỗi khi input đổi), hoặc hook <code>ngOnChanges</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>User tiếp</b> hai lần. Log phải có đủ <code>Tải user 1</code>, <code>Tải user 2</code>, <code>Tải user 3</code>.</p>`,
    starter: `@Component({
  selector: 'app-user-detail',
  template: '<p class="who">Đang xem user {{ userId() }}</p>',
})
class UserDetail {
  userId = input.required();

  ngOnInit() {
    // ❗ chỉ chạy MỘT lần
    log('Tải user ' + this.userId());
  }
}

@Component({
  selector: 'app-root',
  imports: [UserDetail],
  template: \`
    <app-user-detail [userId]="id()" />
    <button (click)="id.update(i => i + 1)">User tiếp</button>
  \`,
})
class Root {
  id = signal(1);
}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-user-detail',
  template: '<p class="who">Đang xem user {{ userId() }}</p>',
})
class UserDetail {
  userId = input.required();

  constructor() {
    effect(() => log('Tải user ' + this.userId()));
  }
}

@Component({
  selector: 'app-root',
  imports: [UserDetail],
  template: \`
    <app-user-detail [userId]="id()" />
    <button (click)="id.update(i => i + 1)">User tiếp</button>
  \`,
})
class Root {
  id = signal(1);
}

mount(Root);
`,
    hint: "constructor() { effect(() => log('Tải user ' + this.userId())); } — hoặc đổi ngOnInit thành ngOnChanges.",
    explain: 'Với việc tải dữ liệu theo input, cách gọn nhất là resource()/rxResource() với params: () => this.userId(): tự tải lại, tự huỷ request cũ, có sẵn trạng thái loading.',
    simulate(s) { s.at(200, () => s.click('User tiếp')); s.at(400, () => s.click('User tiếp')); },
    check(a) {
      const loads = a.logs.filter((l) => l.startsWith('Tải user'));
      if (JSON.stringify(loads) === JSON.stringify(['Tải user 1', 'Tải user 2', 'Tải user 3'])) return OK();
      if (loads.length === 1) return NO('Chỉ tải một lần (user 1): ngOnInit không chạy lại khi input đổi.');
      return NO('Log đang có: ' + JSON.stringify(loads) + ', mong đợi user 1, 2, 3.');
    },
  },
  {
    id: 'don-dep-destroy', group: 'Huỷ', title: 'Dọn dẹp khi component bị huỷ', level: 'Trung bình', lv: 2, waitMs: 1500,
    desc: `<p>Timer, listener, kết nối… do component tạo ra phải được dọn khi component bị huỷ, nếu không chúng chạy tiếp mãi (rò rỉ). Đăng ký việc dọn dẹp bằng <code>inject(DestroyRef).onDestroy(…)</code> hoặc hook <code>ngOnDestroy</code>.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Đóng đồng hồ</b> lúc 700ms (<code>@if</code> gỡ component). Sau đó lane <code>tick</code> không được phát thêm.</p>`,
    starter: `@Component({
  selector: 'app-clock',
  template: '<p>⏰ Đồng hồ đang chạy</p>',
})
class Clock {
  constructor() {
    let n = 0;
    // ❗ interval không bao giờ được dừng
    setInterval(() => spy('tick').next(++n), 200);
  }
}

@Component({
  selector: 'app-root',
  imports: [Clock],
  template: \`
    @if (open()) { <app-clock /> }
    <button (click)="close()">Đóng đồng hồ</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('đóng');
  }
}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-clock',
  template: '<p>⏰ Đồng hồ đang chạy</p>',
})
class Clock {
  constructor() {
    let n = 0;
    const id = setInterval(() => spy('tick').next(++n), 200);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}

@Component({
  selector: 'app-root',
  imports: [Clock],
  template: \`
    @if (open()) { <app-clock /> }
    <button (click)="close()">Đóng đồng hồ</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('đóng');
  }
}

mount(Root);
`,
    hint: 'Lưu id của setInterval, rồi inject(DestroyRef).onDestroy(() => clearInterval(id)) ngay trong constructor.',
    explain: 'DestroyRef dùng được ở bất kỳ đâu có injection context (component, directive, service), không cần implement OnDestroy. Với RxJS thì dùng takeUntilDestroyed() (bài cuối cùng của module này).',
    simulate(s) { s.at(700, () => s.click('Đóng đồng hồ')); },
    check(a) {
      const closeT = a.events('close')[0]?.t;
      if (closeT == null) return NO('Không thấy sự kiện đóng. Đừng xoá spy(\'close\') trong close().');
      const ticks = a.events('tick');
      if (!ticks.some((e) => e.t < closeT)) return NO('Đồng hồ chưa chạy trước khi đóng.');
      const after = ticks.filter((e) => e.t > closeT + 50);
      if (after.length) return NO('Đã đóng đồng hồ nhưng vẫn có ' + after.length + ' tick sau đó: interval chưa được dọn.');
      return OK();
    },
  },
  {
    id: 'after-next-render', group: 'View', title: 'Đo DOM sau khi render: afterNextRender', level: 'Trung bình', lv: 2, waitMs: 600,
    desc: `<p>Trong <code>constructor</code>, template <b>chưa</b> được vẽ nên <code>viewChild</code> chưa có phần tử và DOM chưa có kích thước. Việc đọc/đo/focus DOM đặt trong <code>afterNextRender(() => …)</code> (gọi trong constructor), callback chạy sau lần render kế tiếp.</p>
<p><b>Yêu cầu:</b> hiển thị chiều rộng thật của hộp: <code>Rộng: 240px</code>.</p>`,
    starter: `@Component({
  selector: 'app-measure',
  template: \`
    <div #box class="box">Hộp</div>
    <p class="w">Rộng: {{ width() }}px</p>
  \`,
  styles: '.box { width: 240px; padding: 8px; box-sizing: border-box; background: rgb(224, 231, 255); }',
})
class Measure {
  box = viewChild.required('box');
  width = signal(0);

  constructor() {
    // ❗ template chưa được vẽ
    this.width.set(this.box().nativeElement.offsetWidth);
  }
}

mount(Measure);
`,
    solution: `@Component({
  selector: 'app-measure',
  template: \`
    <div #box class="box">Hộp</div>
    <p class="w">Rộng: {{ width() }}px</p>
  \`,
  styles: '.box { width: 240px; padding: 8px; box-sizing: border-box; background: rgb(224, 231, 255); }',
})
class Measure {
  box = viewChild.required('box');
  width = signal(0);

  constructor() {
    afterNextRender(() => {
      this.width.set(this.box().nativeElement.offsetWidth);
    });
  }
}

mount(Measure);
`,
    hint: 'Bọc dòng this.width.set(...) trong afterNextRender(() => { ... }).',
    explain: 'afterNextRender chỉ chạy ở trình duyệt (không chạy khi SSR), nên đây là chỗ an toàn để dùng window, document, thư viện chart/map. Cần chạy sau MỖI lần render thì dùng afterRenderEffect.',
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. Trong constructor view chưa có.');
      const t = a.text('.w');
      if (t === 'Rộng: 240px') return OK();
      return NO('Đang hiển thị "' + t + '", cần "Rộng: 240px".');
    },
  },
  {
    id: 'thu-tu-hook', group: 'View', title: 'Thứ tự các hook', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p>Thứ tự trong một đời component: <code>constructor</code> → <code>ngOnChanges</code> (nếu có input) → <code>ngOnInit</code> → <code>ngAfterViewInit</code> (view đã render xong) → … → <code>ngOnDestroy</code>.</p>
<p><b>Yêu cầu:</b> thêm <code>ngAfterViewInit</code> và <code>ngOnDestroy</code>, mỗi hook <code>log()</code> đúng tên của nó. Khi kiểm tra, trang destroy component lúc 300ms; log phải là <code>constructor, ngOnInit, ngAfterViewInit, ngOnDestroy</code>.</p>`,
    starter: `@Component({
  selector: 'app-life',
  template: '<p>Tôi đang sống</p>',
})
class Life {
  constructor() { log('constructor'); }
  ngOnInit() { log('ngOnInit'); }
  // TODO: thêm ngAfterViewInit() và ngOnDestroy()
}

mount(Life);
`,
    solution: `@Component({
  selector: 'app-life',
  template: '<p>Tôi đang sống</p>',
})
class Life {
  constructor() { log('constructor'); }
  ngOnInit() { log('ngOnInit'); }
  ngAfterViewInit() { log('ngAfterViewInit'); }
  ngOnDestroy() { log('ngOnDestroy'); }
}

mount(Life);
`,
    hint: "ngAfterViewInit() { log('ngAfterViewInit'); } và ngOnDestroy() { log('ngOnDestroy'); }",
    explain: 'Component không có input thì không có ngOnChanges. Trong TypeScript nên implements OnInit, AfterViewInit, OnDestroy để trình biên dịch bắt lỗi gõ sai tên hook.',
    simulate(s) { s.at(300, () => s.destroy()); },
    check(a) {
      const want = ['constructor', 'ngOnInit', 'ngAfterViewInit', 'ngOnDestroy'];
      if (JSON.stringify(a.logs) === JSON.stringify(want)) return OK();
      return NO('Log đang là ' + JSON.stringify(a.logs) + ', mong đợi ' + JSON.stringify(want) + '.');
    },
  },
  {
    id: 'take-until-destroyed', group: 'Huỷ', title: 'RxJS trong component: takeUntilDestroyed', level: 'Trung bình', lv: 2, waitMs: 1500,
    desc: `<p>Subscribe thủ công trong component thì subscription sống tiếp sau khi component bị huỷ. <code>takeUntilDestroyed()</code> gọi trong constructor tự lấy <code>DestroyRef</code> của chính component và complete stream khi component bị huỷ.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang bấm <b>Đóng bảng giá</b> lúc 700ms. Sau đó lane <code>price</code> không được phát thêm.</p>`,
    starter: `@Component({
  selector: 'app-ticker',
  template: '<p>📈 Giá đang cập nhật…</p>',
})
class Ticker {
  constructor() {
    interval(200).pipe(
      map(i => 'giá #' + i),
      // TODO: huỷ subscription khi component bị huỷ
    ).subscribe(spy('price'));
  }
}

@Component({
  selector: 'app-root',
  imports: [Ticker],
  template: \`
    @if (open()) { <app-ticker /> }
    <button (click)="close()">Đóng bảng giá</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('đóng');
  }
}

mount(Root);
`,
    solution: `@Component({
  selector: 'app-ticker',
  template: '<p>📈 Giá đang cập nhật…</p>',
})
class Ticker {
  constructor() {
    interval(200).pipe(
      map(i => 'giá #' + i),
      takeUntilDestroyed(),
    ).subscribe(spy('price'));
  }
}

@Component({
  selector: 'app-root',
  imports: [Ticker],
  template: \`
    @if (open()) { <app-ticker /> }
    <button (click)="close()">Đóng bảng giá</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('đóng');
  }
}

mount(Root);
`,
    hint: 'Thêm takeUntilDestroyed() làm toán tử cuối cùng trong pipe.',
    explain: 'Ngoài constructor (ví dụ trong ngOnInit hay method) không có injection context, phải truyền vào: takeUntilDestroyed(this.destroyRef) với destroyRef = inject(DestroyRef). Nếu chỉ cần hiển thị thì toSignal() còn gọn hơn: không cần subscribe.',
    simulate(s) { s.at(700, () => s.click('Đóng bảng giá')); },
    check(a) {
      const closeT = a.events('close')[0]?.t;
      if (closeT == null) return NO('Không thấy sự kiện đóng. Đừng xoá spy(\'close\') trong close().');
      const prices = a.events('price').filter((e) => e.type === 'next');
      if (!prices.some((e) => e.t < closeT)) return NO('Bảng giá chưa phát giá trị nào trước khi đóng.');
      const after = prices.filter((e) => e.t > closeT + 50);
      if (after.length) return NO('Đã đóng nhưng vẫn có ' + after.length + ' giá trị sau đó: subscription bị rò rỉ.');
      return OK();
    },
  },
];

export const LAB: LabModule = {
  title: 'Lifecycle hooks',
  subtitle: 'bài luyện vòng đời component: input chưa có trong constructor, phản ứng khi input đổi, dọn dẹp khi huỷ, afterNextRender, thứ tự hook, takeUntilDestroyed.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Khởi tạo cần giá trị input', '<code>ngOnInit</code> hoặc <code>computed</code>; không đọc input trong constructor'],
    ['Làm lại việc mỗi khi input đổi', '<code>effect(() => … this.id() …)</code>, <code>ngOnChanges</code>, hoặc <code>resource()</code>'],
    ['Dọn timer/listener khi huỷ', '<code>inject(DestroyRef).onDestroy(…)</code> hoặc <code>ngOnDestroy</code>'],
    ['Huỷ subscription RxJS', '<code>takeUntilDestroyed()</code> trong constructor, hoặc dùng <code>toSignal</code>'],
    ['Đọc/đo/focus DOM', '<code>afterNextRender(() => …)</code> gọi trong constructor'],
    ['Chạy sau mỗi lần render', '<code>afterRenderEffect</code>'],
  ],
};
