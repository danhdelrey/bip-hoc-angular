import{a as s,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var g={title:`Lifecycle hooks`,subtitle:`bài luyện vòng đời component: input chưa có trong constructor, phản ứng khi input đổi, dọn dẹp khi huỷ, afterNextRender, thứ tự hook, takeUntilDestroyed.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Thêm các hook <code>ngOnInit</code>, <code>ngOnChanges</code>, <code>ngAfterViewInit</code>, <code>ngOnDestroy</code> và in log để xem thứ tự Angular gọi chúng. Bấm <b>Dừng</b> để component bị destroy.</p>`,starter:`@Component({
  selector: 'app-child',
  template: '<p>Con nh\u1EADn: {{ value() }}</p>',
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
    <button (click)="n.update(v => v + 1)">\u0110\u1ED5i input</button>
    <button (click)="show.set(!show())">T\u1EA1o / Hu\u1EF7</button>
  \`,
})
class Root {
  n = signal(0);
  show = signal(true);
}

mount(Root);
`},{id:`input-trong-constructor`,group:`Khởi tạo`,title:`Input chưa có trong constructor`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Angular t\u1EA1o instance (ch\u1EA1y <code>constructor</code>) <b>tr\u01B0\u1EDBc</b> khi g\xE1n input. \u0110\u1ECDc input b\u1EAFt bu\u1ED9c trong constructor s\u1EBD g\u1EB7p l\u1ED7i <code>NG0950</code>. Logic c\u1EA7n input th\xEC \u0111\u1EB7t trong <code>ngOnInit</code> (ch\u1EA1y sau l\u1EA7n g\xE1n input \u0111\u1EA7u ti\xEAn), ho\u1EB7c d\xF9ng <code>computed</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> component con hi\u1EC3n th\u1ECB <code>Xin ch\xE0o B\xEDp</code> m\xE0 kh\xF4ng c\xF3 l\u1ED7i.</p>`,starter:`@Component({
  selector: 'app-greeting',
  template: '<p>{{ message }}</p>',
})
class Greeting {
  name = input.required();
  message = '';

  constructor() {
    // \u2757 l\xFAc n\xE0y Angular CH\u01AFA g\xE1n input
    this.message = 'Xin ch\xE0o ' + this.name();
    log(this.message);
  }
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: '<app-greeting name="B\xEDp" />',
})
class Root {}

mount(Root);
`,solution:`@Component({
  selector: 'app-greeting',
  template: '<p>{{ message }}</p>',
})
class Greeting {
  name = input.required();
  message = '';

  ngOnInit() {
    this.message = 'Xin ch\xE0o ' + this.name();
    log(this.message);
  }
}

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: '<app-greeting name="B\xEDp" />',
})
class Root {}

mount(Root);
`,hint:`Đổi constructor() thành ngOnInit() (giữ nguyên nội dung bên trong).`,explain:`Cách hiện đại hơn: message = computed(() => "Xin chào " + this.name()) — vừa không lo thời điểm, vừa tự cập nhật khi input đổi. constructor chỉ nên dùng cho inject() và khởi tạo không phụ thuộc input.`,check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. Đọc input trong constructor là quá sớm.`);let e=t.text(`app-greeting p`);return e===`Xin chào Bíp`?i():s(`Component con đang hiển thị "`+e+`", cần "Xin chào Bíp".`)}},{id:`phan-ung-input-doi`,group:`Khởi tạo`,title:`Phản ứng mỗi khi input đổi`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p><code>ngOnInit</code> ch\u1EC9 ch\u1EA1y <b>m\u1ED9t l\u1EA7n</b>. Khi cha \u0111\u1ED5i input (v\xED d\u1EE5 ch\u1ECDn user kh\xE1c), logic "t\u1EA3i l\u1EA1i" \u0111\u1EB7t trong <code>ngOnInit</code> s\u1EBD kh\xF4ng ch\u1EA1y n\u1EEFa. Hai c\xE1ch \u0111\xFAng: <code>effect()</code> \u0111\u1ECDc input (ch\u1EA1y l\u1EA1i m\u1ED7i khi input \u0111\u1ED5i), ho\u1EB7c hook <code>ngOnChanges</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>User ti\u1EBFp</b> hai l\u1EA7n. Log ph\u1EA3i c\xF3 \u0111\u1EE7 <code>T\u1EA3i user 1</code>, <code>T\u1EA3i user 2</code>, <code>T\u1EA3i user 3</code>.</p>`,starter:`@Component({
  selector: 'app-user-detail',
  template: '<p class="who">\u0110ang xem user {{ userId() }}</p>',
})
class UserDetail {
  userId = input.required();

  ngOnInit() {
    // \u2757 ch\u1EC9 ch\u1EA1y M\u1ED8T l\u1EA7n
    log('T\u1EA3i user ' + this.userId());
  }
}

@Component({
  selector: 'app-root',
  imports: [UserDetail],
  template: \`
    <app-user-detail [userId]="id()" />
    <button (click)="id.update(i => i + 1)">User ti\u1EBFp</button>
  \`,
})
class Root {
  id = signal(1);
}

mount(Root);
`,solution:`@Component({
  selector: 'app-user-detail',
  template: '<p class="who">\u0110ang xem user {{ userId() }}</p>',
})
class UserDetail {
  userId = input.required();

  constructor() {
    effect(() => log('T\u1EA3i user ' + this.userId()));
  }
}

@Component({
  selector: 'app-root',
  imports: [UserDetail],
  template: \`
    <app-user-detail [userId]="id()" />
    <button (click)="id.update(i => i + 1)">User ti\u1EBFp</button>
  \`,
})
class Root {
  id = signal(1);
}

mount(Root);
`,hint:`constructor() { effect(() => log('Tải user ' + this.userId())); } — hoặc đổi ngOnInit thành ngOnChanges.`,explain:`Với việc tải dữ liệu theo input, cách gọn nhất là resource()/rxResource() với params: () => this.userId(): tự tải lại, tự huỷ request cũ, có sẵn trạng thái loading.`,simulate(t){t.at(200,()=>t.click(`User tiếp`)),t.at(400,()=>t.click(`User tiếp`))},check(t){let e=t.logs.filter(c=>c.startsWith(`Tải user`));return JSON.stringify(e)===JSON.stringify([`Tải user 1`,`Tải user 2`,`Tải user 3`])?i():e.length===1?s(`Chỉ tải một lần (user 1): ngOnInit không chạy lại khi input đổi.`):s(`Log đang có: `+JSON.stringify(e)+`, mong đợi user 1, 2, 3.`)}},{id:`don-dep-destroy`,group:`Huỷ`,title:`Dọn dẹp khi component bị huỷ`,level:`Trung bình`,lv:2,waitMs:1500,desc:`<p>Timer, listener, k\u1EBFt n\u1ED1i\u2026 do component t\u1EA1o ra ph\u1EA3i \u0111\u01B0\u1EE3c d\u1ECDn khi component b\u1ECB hu\u1EF7, n\u1EBFu kh\xF4ng ch\xFAng ch\u1EA1y ti\u1EBFp m\xE3i (r\xF2 r\u1EC9). \u0110\u0103ng k\xFD vi\u1EC7c d\u1ECDn d\u1EB9p b\u1EB1ng <code>inject(DestroyRef).onDestroy(\u2026)</code> ho\u1EB7c hook <code>ngOnDestroy</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\xF3ng \u0111\u1ED3ng h\u1ED3</b> l\xFAc 700ms (<code>@if</code> g\u1EE1 component). Sau \u0111\xF3 lane <code>tick</code> kh\xF4ng \u0111\u01B0\u1EE3c ph\xE1t th\xEAm.</p>`,starter:`@Component({
  selector: 'app-clock',
  template: '<p>\u23F0 \u0110\u1ED3ng h\u1ED3 \u0111ang ch\u1EA1y</p>',
})
class Clock {
  constructor() {
    let n = 0;
    // \u2757 interval kh\xF4ng bao gi\u1EDD \u0111\u01B0\u1EE3c d\u1EEBng
    setInterval(() => spy('tick').next(++n), 200);
  }
}

@Component({
  selector: 'app-root',
  imports: [Clock],
  template: \`
    @if (open()) { <app-clock /> }
    <button (click)="close()">\u0110\xF3ng \u0111\u1ED3ng h\u1ED3</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('\u0111\xF3ng');
  }
}

mount(Root);
`,solution:`@Component({
  selector: 'app-clock',
  template: '<p>\u23F0 \u0110\u1ED3ng h\u1ED3 \u0111ang ch\u1EA1y</p>',
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
    <button (click)="close()">\u0110\xF3ng \u0111\u1ED3ng h\u1ED3</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('\u0111\xF3ng');
  }
}

mount(Root);
`,hint:`Lưu id của setInterval, rồi inject(DestroyRef).onDestroy(() => clearInterval(id)) ngay trong constructor.`,explain:`DestroyRef dùng được ở bất kỳ đâu có injection context (component, directive, service), không cần implement OnDestroy. Với RxJS thì dùng takeUntilDestroyed() (bài cuối cùng của module này).`,simulate(t){t.at(700,()=>t.click(`Đóng đồng hồ`))},check(t){let e=t.events(`close`)[0]?.t;if(e==null)return s(`Không thấy sự kiện đóng. Đừng xoá spy('close') trong close().`);let c=t.events(`tick`);if(!c.some(o=>o.t<e))return s(`Đồng hồ chưa chạy trước khi đóng.`);let r=c.filter(o=>o.t>e+50);return r.length?s(`Đã đóng đồng hồ nhưng vẫn có `+r.length+` tick sau đó: interval chưa được dọn.`):i()}},{id:`after-next-render`,group:`View`,title:`Đo DOM sau khi render: afterNextRender`,level:`Trung bình`,lv:2,waitMs:600,desc:`<p>Trong <code>constructor</code>, template <b>ch\u01B0a</b> \u0111\u01B0\u1EE3c v\u1EBD n\xEAn <code>viewChild</code> ch\u01B0a c\xF3 ph\u1EA7n t\u1EED v\xE0 DOM ch\u01B0a c\xF3 k\xEDch th\u01B0\u1EDBc. Vi\u1EC7c \u0111\u1ECDc/\u0111o/focus DOM \u0111\u1EB7t trong <code>afterNextRender(() => \u2026)</code> (g\u1ECDi trong constructor), callback ch\u1EA1y sau l\u1EA7n render k\u1EBF ti\u1EBFp.</p>
<p><b>Y\xEAu c\u1EA7u:</b> hi\u1EC3n th\u1ECB chi\u1EC1u r\u1ED9ng th\u1EADt c\u1EE7a h\u1ED9p: <code>R\u1ED9ng: 240px</code>.</p>`,starter:`@Component({
  selector: 'app-measure',
  template: \`
    <div #box class="box">H\u1ED9p</div>
    <p class="w">R\u1ED9ng: {{ width() }}px</p>
  \`,
  styles: '.box { width: 240px; padding: 8px; box-sizing: border-box; background: rgb(224, 231, 255); }',
})
class Measure {
  box = viewChild.required('box');
  width = signal(0);

  constructor() {
    // \u2757 template ch\u01B0a \u0111\u01B0\u1EE3c v\u1EBD
    this.width.set(this.box().nativeElement.offsetWidth);
  }
}

mount(Measure);
`,solution:`@Component({
  selector: 'app-measure',
  template: \`
    <div #box class="box">H\u1ED9p</div>
    <p class="w">R\u1ED9ng: {{ width() }}px</p>
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
`,hint:`Bọc dòng this.width.set(...) trong afterNextRender(() => { ... }).`,explain:`afterNextRender chỉ chạy ở trình duyệt (không chạy khi SSR), nên đây là chỗ an toàn để dùng window, document, thư viện chart/map. Cần chạy sau MỖI lần render thì dùng afterRenderEffect.`,check(t){if(t.errors.length)return s(`Có lỗi: `+t.errMsg()+`. Trong constructor view chưa có.`);let e=t.text(`.w`);return e===`Rộng: 240px`?i():s(`Đang hiển thị "`+e+`", cần "Rộng: 240px".`)}},{id:`thu-tu-hook`,group:`View`,title:`Thứ tự các hook`,level:`Dễ`,lv:1,waitMs:600,desc:`<p>Th\u1EE9 t\u1EF1 trong m\u1ED9t \u0111\u1EDDi component: <code>constructor</code> \u2192 <code>ngOnChanges</code> (n\u1EBFu c\xF3 input) \u2192 <code>ngOnInit</code> \u2192 <code>ngAfterViewInit</code> (view \u0111\xE3 render xong) \u2192 \u2026 \u2192 <code>ngOnDestroy</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\xEAm <code>ngAfterViewInit</code> v\xE0 <code>ngOnDestroy</code>, m\u1ED7i hook <code>log()</code> \u0111\xFAng t\xEAn c\u1EE7a n\xF3. Khi ki\u1EC3m tra, trang destroy component l\xFAc 300ms; log ph\u1EA3i l\xE0 <code>constructor, ngOnInit, ngAfterViewInit, ngOnDestroy</code>.</p>`,starter:`@Component({
  selector: 'app-life',
  template: '<p>T\xF4i \u0111ang s\u1ED1ng</p>',
})
class Life {
  constructor() { log('constructor'); }
  ngOnInit() { log('ngOnInit'); }
  // TODO: th\xEAm ngAfterViewInit() v\xE0 ngOnDestroy()
}

mount(Life);
`,solution:`@Component({
  selector: 'app-life',
  template: '<p>T\xF4i \u0111ang s\u1ED1ng</p>',
})
class Life {
  constructor() { log('constructor'); }
  ngOnInit() { log('ngOnInit'); }
  ngAfterViewInit() { log('ngAfterViewInit'); }
  ngOnDestroy() { log('ngOnDestroy'); }
}

mount(Life);
`,hint:`ngAfterViewInit() { log('ngAfterViewInit'); } và ngOnDestroy() { log('ngOnDestroy'); }`,explain:`Component không có input thì không có ngOnChanges. Trong TypeScript nên implements OnInit, AfterViewInit, OnDestroy để trình biên dịch bắt lỗi gõ sai tên hook.`,simulate(t){t.at(300,()=>t.destroy())},check(t){let e=[`constructor`,`ngOnInit`,`ngAfterViewInit`,`ngOnDestroy`];return JSON.stringify(t.logs)===JSON.stringify(e)?i():s(`Log đang là `+JSON.stringify(t.logs)+`, mong đợi `+JSON.stringify(e)+`.`)}},{id:`take-until-destroyed`,group:`Huỷ`,title:`RxJS trong component: takeUntilDestroyed`,level:`Trung bình`,lv:2,waitMs:1500,desc:`<p>Subscribe th\u1EE7 c\xF4ng trong component th\xEC subscription s\u1ED1ng ti\u1EBFp sau khi component b\u1ECB hu\u1EF7. <code>takeUntilDestroyed()</code> g\u1ECDi trong constructor t\u1EF1 l\u1EA5y <code>DestroyRef</code> c\u1EE7a ch\xEDnh component v\xE0 complete stream khi component b\u1ECB hu\u1EF7.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\xF3ng b\u1EA3ng gi\xE1</b> l\xFAc 700ms. Sau \u0111\xF3 lane <code>price</code> kh\xF4ng \u0111\u01B0\u1EE3c ph\xE1t th\xEAm.</p>`,starter:`@Component({
  selector: 'app-ticker',
  template: '<p>\u{1F4C8} Gi\xE1 \u0111ang c\u1EADp nh\u1EADt\u2026</p>',
})
class Ticker {
  constructor() {
    interval(200).pipe(
      map(i => 'gi\xE1 #' + i),
      // TODO: hu\u1EF7 subscription khi component b\u1ECB hu\u1EF7
    ).subscribe(spy('price'));
  }
}

@Component({
  selector: 'app-root',
  imports: [Ticker],
  template: \`
    @if (open()) { <app-ticker /> }
    <button (click)="close()">\u0110\xF3ng b\u1EA3ng gi\xE1</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('\u0111\xF3ng');
  }
}

mount(Root);
`,solution:`@Component({
  selector: 'app-ticker',
  template: '<p>\u{1F4C8} Gi\xE1 \u0111ang c\u1EADp nh\u1EADt\u2026</p>',
})
class Ticker {
  constructor() {
    interval(200).pipe(
      map(i => 'gi\xE1 #' + i),
      takeUntilDestroyed(),
    ).subscribe(spy('price'));
  }
}

@Component({
  selector: 'app-root',
  imports: [Ticker],
  template: \`
    @if (open()) { <app-ticker /> }
    <button (click)="close()">\u0110\xF3ng b\u1EA3ng gi\xE1</button>
  \`,
})
class Root {
  open = signal(true);

  close() {
    this.open.set(false);
    spy('close').next('\u0111\xF3ng');
  }
}

mount(Root);
`,hint:`Thêm takeUntilDestroyed() làm toán tử cuối cùng trong pipe.`,explain:`Ngoài constructor (ví dụ trong ngOnInit hay method) không có injection context, phải truyền vào: takeUntilDestroyed(this.destroyRef) với destroyRef = inject(DestroyRef). Nếu chỉ cần hiển thị thì toSignal() còn gọn hơn: không cần subscribe.`,simulate(t){t.at(700,()=>t.click(`Đóng bảng giá`))},check(t){let e=t.events(`close`)[0]?.t;if(e==null)return s(`Không thấy sự kiện đóng. Đừng xoá spy('close') trong close().`);let c=t.events(`price`).filter(o=>o.type===`next`);if(!c.some(o=>o.t<e))return s(`Bảng giá chưa phát giá trị nào trước khi đóng.`);let r=c.filter(o=>o.t>e+50);return r.length?s(`Đã đóng nhưng vẫn có `+r.length+` giá trị sau đó: subscription bị rò rỉ.`):i()}}],cheatsheet:[[`Khởi tạo cần giá trị input`,`<code>ngOnInit</code> hoặc <code>computed</code>; không đọc input trong constructor`],[`Làm lại việc mỗi khi input đổi`,`<code>effect(() => … this.id() …)</code>, <code>ngOnChanges</code>, hoặc <code>resource()</code>`],[`Dọn timer/listener khi huỷ`,`<code>inject(DestroyRef).onDestroy(…)</code> hoặc <code>ngOnDestroy</code>`],[`Huỷ subscription RxJS`,`<code>takeUntilDestroyed()</code> trong constructor, hoặc dùng <code>toSignal</code>`],[`Đọc/đo/focus DOM`,`<code>afterNextRender(() => …)</code> gọi trong constructor`],[`Chạy sau mỗi lần render`,`<code>afterRenderEffect</code>`]]};export{g as LAB};