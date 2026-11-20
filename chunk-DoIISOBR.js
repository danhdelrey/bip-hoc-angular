import{a as s,r as i$1}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var i=`@Component({ selector: 'app-chart', template: '<div class="chart">\u{1F4CA} Bi\u1EC3u \u0111\u1ED3 doanh thu</div>' })
class Chart {}
`;var r=(e,t)=>o=>o.setAttribute(`data-`+e,o.querySelector(t)?`1`:`0`);var a={title:`@defer`,subtitle:`bài luyện hoãn tải phần nặng trong template: on interaction, "when" một chiều, on timer, on viewport cần @placeholder, trigger trên phần tử khác.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Th\u1EED c\xE1c trigger c\u1EE7a <code>@defer</code>: <code>on idle</code> (m\u1EB7c \u0111\u1ECBnh), <code>on viewport</code>, <code>on interaction</code>, <code>on hover</code>, <code>on timer(1s)</code>, <code>on immediate</code>, <code>when \u0111i\u1EC1uKi\u1EC7n</code>, c\xF9ng <code>@placeholder</code>, <code>@loading</code>, <code>@error</code>.</p>
<div class="tip">Lab bi\xEAn d\u1ECBch component ngay trong tr\xECnh duy\u1EC7t (JIT), n\xEAn component trong <code>@defer</code> kh\xF4ng b\u1ECB t\xE1ch th\xE0nh file JS ri\xEAng nh\u01B0 khi <code>ng build</code>. Th\u1EDDi \u0111i\u1EC3m v\u1EBD theo trigger th\xEC v\u1EABn \u0111\xFAng nh\u01B0 \u1EE9ng d\u1EE5ng th\u1EADt.</div>`,starter:i+`
@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <h3>B\xE1o c\xE1o</h3>
    @defer (on interaction) {
      <app-chart />
    } @placeholder {
      <button>Xem bi\u1EC3u \u0111\u1ED3</button>
    }
  \`,
})
class App {}

mount(App);
`},{id:`on-interaction`,group:`Trigger`,title:`Chỉ tải khi người dùng bấm: on interaction`,level:`Dễ`,lv:1,waitMs:800,desc:`<p>Kh\xF4ng ghi trigger th\xEC <code>@defer</code> d\xF9ng <code>on idle</code>: t\u1EA3i ngay khi tr\xECnh duy\u1EC7t r\u1EA3nh, t\u1EE9c l\xE0 g\u1EA7n nh\u01B0 l\xFAc m\u1EDF trang. V\u1EDBi ph\u1EA7n n\u1EB7ng m\xE0 kh\xF4ng ph\u1EA3i ai c\u0169ng xem (bi\u1EC3u \u0111\u1ED3, tr\xECnh so\u1EA1n th\u1EA3o, b\u1EA3n \u0111\u1ED3), h\xE3y ch\u1EC9 t\u1EA3i khi ng\u01B0\u1EDDi d\xF9ng t\u01B0\u01A1ng t\xE1c: <code>@defer (on interaction)</code>. Trigger n\xE0y l\u1EAFng nghe click tr\xEAn <b>@placeholder</b>, n\xEAn c\u1EA7n c\xF3 placeholder.</p>
<p><b>Y\xEAu c\u1EA7u:</b> l\xFAc m\u1EDF trang ch\u01B0a c\xF3 <code>.chart</code>; b\u1EA5m n\xFAt <b>Xem bi\u1EC3u \u0111\u1ED3</b> (n\u1EB1m trong placeholder) th\xEC bi\u1EC3u \u0111\u1ED3 hi\u1EC7n ra.</p>`,starter:i+`
@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <h3>B\xE1o c\xE1o</h3>
    <!-- \u2757 m\u1EB7c \u0111\u1ECBnh on idle: t\u1EA3i ngay khi m\u1EDF trang -->
    @defer {
      <app-chart />
    }
  \`,
})
class App {}

mount(App);
`,solution:i+`
@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <h3>B\xE1o c\xE1o</h3>
    @defer (on interaction) {
      <app-chart />
    } @placeholder {
      <button>Xem bi\u1EC3u \u0111\u1ED3</button>
    }
  \`,
})
class App {}

mount(App);
`,hint:`Đổi thành @defer (on interaction) { <app-chart /> } @placeholder { <button>Xem biểu đồ</button> }.`,explain:`Placeholder phải có đúng một phần tử gốc để trigger bám vào. Thêm prefetch on idle nếu muốn tải sẵn code trong nền nhưng vẫn chỉ vẽ khi bấm: @defer (on interaction; prefetch on idle).`,simulate(e){e.at(350,()=>e.dom(r(`truoc`,`.chart`))),e.at(400,()=>e.click(`Xem biểu đồ`))},check(e){return e.errors.length?s(`Có lỗi: `+e.errMsg()):e.root()?.getAttribute(`data-truoc`)!==`0`?s(`Biểu đồ đã hiện ngay khi mở trang: @defer đang dùng on idle mặc định.`):e.query(`.chart`).length?i$1():s(`Bấm "Xem biểu đồ" nhưng biểu đồ chưa hiện. Nút phải nằm trong @placeholder.`)}},{id:`when-mot-chieu`,group:`Trigger`,title:`"when" chỉ chạy một chiều`,level:`Trung bình`,lv:2,waitMs:900,desc:`<p><code>@defer (when \u0111i\u1EC1uKi\u1EC7n)</code> v\u1EBD n\u1ED9i dung khi \u0111i\u1EC1u ki\u1EC7n chuy\u1EC3n sang true, v\xE0 <b>ch\u1EC9 m\u1ED9t l\u1EA7n</b>: khi \u0111i\u1EC1u ki\u1EC7n tr\u1EDF l\u1EA1i false, n\u1ED9i dung v\u1EABn \u1EDF \u0111\xF3. <code>@defer</code> quy\u1EBFt \u0111\u1ECBnh <i>khi n\xE0o t\u1EA3i</i>, c\xF2n \u1EA9n/hi\u1EC7n qua l\u1EA1i l\xE0 vi\u1EC7c c\u1EE7a <code>@if</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> b\u1EA5m <b>Hi\u1EC7n</b> th\xEC c\xF3 <code>.panel</code>, b\u1EA5m <b>\u1EA8n</b> th\xEC <code>.panel</code> bi\u1EBFn m\u1EA5t. V\u1EABn gi\u1EEF <code>@defer</code> \u0111\u1EC3 ph\u1EA7n panel ch\u1EC9 \u0111\u01B0\u1EE3c t\u1EA3i khi c\u1EA7n.</p>`,starter:`@Component({ selector: 'app-panel', template: '<div class="panel">\u2699\uFE0F C\xE0i \u0111\u1EB7t n\xE2ng cao</div>' })
class Panel {}

@Component({
  selector: 'app-root',
  imports: [Panel],
  template: \`
    <button (click)="open.set(true)">Hi\u1EC7n</button>
    <button (click)="open.set(false)">\u1EA8n</button>
    @defer (when open()) {
      <app-panel />
    }
  \`,
})
class App {
  open = signal(false);
}

mount(App);
`,solution:`@Component({ selector: 'app-panel', template: '<div class="panel">\u2699\uFE0F C\xE0i \u0111\u1EB7t n\xE2ng cao</div>' })
class Panel {}

@Component({
  selector: 'app-root',
  imports: [Panel],
  template: \`
    <button (click)="open.set(true)">Hi\u1EC7n</button>
    <button (click)="open.set(false)">\u1EA8n</button>
    @if (open()) {
      @defer {
        <app-panel />
      }
    }
  \`,
})
class App {
  open = signal(false);
}

mount(App);
`,hint:`Bọc @defer trong @if (open()) { @defer { <app-panel /> } }. @if lo ẩn/hiện, @defer bên trong chỉ tải lần đầu.`,explain:`Code của Panel chỉ được tải ở lần mở đầu tiên; những lần sau @if chỉ tạo lại view từ code đã có.`,simulate(e){e.at(200,()=>e.click(`Hiện`)),e.at(450,()=>e.dom(r(`mo`,`.panel`))),e.at(500,()=>e.click(`Ẩn`))},check(e,t){return e.errors.length?s(`Có lỗi: `+e.errMsg()):/@defer/.test(t)?e.root()?.getAttribute(`data-mo`)!==`1`?s(`Bấm Hiện nhưng panel chưa xuất hiện.`):e.query(`.panel`).length?s(`Bấm Ẩn mà panel vẫn còn: "when" chỉ chạy một chiều, không ẩn lại được.`):i$1():s(`Vẫn cần @defer để panel chỉ được tải khi mở.`)}},{id:`on-timer`,group:`Trigger`,title:`Hiện sau một khoảng thời gian: on timer`,level:`Dễ`,lv:1,waitMs:1500,desc:`<p><code>@defer (on timer(1s))</code> v\u1EBD n\u1ED9i dung sau m\u1ED9t kho\u1EA3ng th\u1EDDi gian k\u1EC3 t\u1EEB l\xFAc kh\u1ED1i \u0111\u01B0\u1EE3c t\u1EA1o. H\u1EE3p cho ph\u1EA7n ph\u1EE5 kh\xF4ng c\u1EA7n ngay (banner khuy\u1EBFn m\xE3i, g\u1EE3i \xFD, khung chat h\u1ED7 tr\u1EE3), \u0111\u1EC3 ph\u1EA7n ch\xEDnh \u0111\u01B0\u1EE3c v\u1EBD tr\u01B0\u1EDBc.</p>
<p><b>Y\xEAu c\u1EA7u:</b> banner <code>.promo</code> ch\u01B0a c\xF3 trong 0,5 gi\xE2y \u0111\u1EA7u, v\xE0 hi\u1EC7n ra sau kho\u1EA3ng 1 gi\xE2y. Trong l\xFAc ch\u1EDD, hi\u1EC7n <code>&lt;p class="cho"&gt;</code> l\xE0m placeholder.</p>`,starter:`@Component({ selector: 'app-promo', template: '<div class="promo">\u{1F381} Gi\u1EA3m 20% h\xF4m nay</div>' })
class Promo {}

@Component({
  selector: 'app-root',
  imports: [Promo],
  template: \`
    <h3>C\u1EEDa h\xE0ng</h3>
    @defer {
      <app-promo />
    }
  \`,
})
class App {}

mount(App);
`,solution:`@Component({ selector: 'app-promo', template: '<div class="promo">\u{1F381} Gi\u1EA3m 20% h\xF4m nay</div>' })
class Promo {}

@Component({
  selector: 'app-root',
  imports: [Promo],
  template: \`
    <h3>C\u1EEDa h\xE0ng</h3>
    @defer (on timer(1s)) {
      <app-promo />
    } @placeholder {
      <p class="cho">\u2026</p>
    }
  \`,
})
class App {}

mount(App);
`,hint:`Dùng @defer (on timer(1s)) { … } @placeholder { <p class="cho">…</p> }. Thời gian viết được 1s hoặc 1000ms.`,explain:`Có thể ghép nhiều trigger bằng dấu ;, khối sẽ vẽ khi trigger nào tới trước: @defer (on viewport; on timer(5s)).`,simulate(e){e.at(500,()=>e.dom(t=>{r(`som`,`.promo`)(t),r(`cho`,`.cho`)(t)}))},check(e){if(e.errors.length)return s(`Có lỗi: `+e.errMsg());let t=e.root();return t?.getAttribute(`data-som`)!==`0`?s(`Banner đã hiện ngay từ đầu, cần chờ khoảng 1 giây (on timer).`):t?.getAttribute(`data-cho`)!==`1`?s(`Trong lúc chờ cần có @placeholder chứa <p class="cho">.`):e.query(`.promo`).length?i$1():s(`Sau 1,5 giây banner vẫn chưa hiện. Thời gian chờ có dài quá không?`)}},{id:`on-viewport`,group:`Trigger`,title:`Tải khi cuộn tới: on viewport`,level:`Trung bình`,lv:2,waitMs:1200,desc:`<p><code>@defer (on viewport)</code> ch\u1EC9 v\u1EBD n\u1ED9i dung khi n\xF3 cu\u1ED9n v\xE0o v\xF9ng nh\xECn th\u1EA5y (d\xF9ng <code>IntersectionObserver</code>). Angular theo d\xF5i ph\u1EA7n t\u1EED c\u1EE7a <b>@placeholder</b>, n\xEAn thi\u1EBFu placeholder l\xE0 l\u1ED7i bi\xEAn d\u1ECBch.</p>
<p><b>Y\xEAu c\u1EA7u:</b> ph\u1EA7n b\xECnh lu\u1EADn n\u1EB1m cu\u1ED1i h\u1ED9p cu\u1ED9n. S\u1EEDa l\u1ED7i \u0111\u1EC3 trang ch\u1EA1y \u0111\u01B0\u1EE3c; b\xECnh lu\u1EADn <code>.comments</code> ch\u01B0a c\xF3 khi m\u1EDBi m\u1EDF, v\xE0 hi\u1EC7n ra khi ki\u1EC3m tra t\u1EF1 cu\u1ED9n h\u1ED9p xu\u1ED1ng cu\u1ED1i.</p>`,starter:`@Component({ selector: 'app-comments', template: '<div class="comments">\u{1F4AC} 12 b\xECnh lu\u1EADn</div>' })
class Comments {}

@Component({
  selector: 'app-root',
  imports: [Comments],
  template: \`
    <div class="box" style="height: 140px; overflow: auto; border: 1px solid var(--line, #ccc); padding: 8px">
      <article style="height: 400px">N\u1ED9i dung b\xE0i vi\u1EBFt d\xE0i\u2026 (cu\u1ED9n xu\u1ED1ng)</article>
      @defer (on viewport) {
        <app-comments />
      }
    </div>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({ selector: 'app-comments', template: '<div class="comments">\u{1F4AC} 12 b\xECnh lu\u1EADn</div>' })
class Comments {}

@Component({
  selector: 'app-root',
  imports: [Comments],
  template: \`
    <div class="box" style="height: 140px; overflow: auto; border: 1px solid var(--line, #ccc); padding: 8px">
      <article style="height: 400px">N\u1ED9i dung b\xE0i vi\u1EBFt d\xE0i\u2026 (cu\u1ED9n xu\u1ED1ng)</article>
      @defer (on viewport) {
        <app-comments />
      } @placeholder {
        <p>B\xECnh lu\u1EADn s\u1EBD hi\u1EC7n khi b\u1EA1n cu\u1ED9n t\u1EDBi\u2026</p>
      }
    </div>
  \`,
})
class App {}

mount(App);
`,hint:`Thêm @placeholder { <p>Bình luận sẽ hiện khi bạn cuộn tới…</p> } ngay sau khối @defer. Placeholder cần đúng một phần tử gốc.`,explain:`Placeholder nên có chiều cao gần với nội dung thật để trang không bị nhảy (layout shift) khi nội dung thay vào.`,simulate(e){e.at(300,()=>e.dom(t=>{r(`truoc`,`.comments`)(t),t.scrollIntoView({block:`nearest`})})),e.at(400,()=>e.dom(t=>{let o=t.querySelector(`.box`);o&&(o.scrollTop=o.scrollHeight)}))},check(e){return e.errors.length?s(`Có lỗi: `+e.errMsg()):e.root()?.getAttribute(`data-truoc`)!==`0`?s(`Bình luận đã hiện trước khi cuộn tới.`):e.query(`.comments`).length?i$1():s(`Đã cuộn xuống cuối hộp nhưng bình luận chưa hiện.`)}},{id:`on-hover-ref`,group:`Trigger`,title:`Trigger trên phần tử khác: on hover(ref)`,level:`Trung bình`,lv:2,waitMs:800,desc:`<p>Trigger c\xF3 th\u1EC3 g\u1EAFn v\xE0o m\u1ED9t ph\u1EA7n t\u1EED <b>b\xEAn ngo\xE0i</b> kh\u1ED1i <code>@defer</code> b\u1EB1ng bi\u1EBFn tham chi\u1EBFu: <code>&lt;a #ten&gt;</code> r\u1ED3i <code>@defer (on hover(ten))</code>. H\u1EE3p cho th\u1EBB xem tr\u01B0\u1EDBc (preview card): ch\u1EC9 t\u1EA3i khi r\xEA chu\u1ED9t l\xEAn t\xEAn ng\u01B0\u1EDDi d\xF9ng.</p>
<p><b>Y\xEAu c\u1EA7u:</b> l\xFAc m\u1EDF ch\u01B0a c\xF3 <code>.card</code>; r\xEA chu\u1ED9t l\xEAn t\xEAn <b>@bip</b> th\xEC th\u1EBB h\u1ED3 s\u01A1 hi\u1EC7n ra.</p>`,starter:`@Component({ selector: 'app-profile-card', template: '<div class="card">\u{1F423} B\xEDp \xB7 120 b\xE0i vi\u1EBFt</div>' })
class ProfileCard {}

@Component({
  selector: 'app-root',
  imports: [ProfileCard],
  template: \`
    <p>B\xE0i vi\u1EBFt c\u1EE7a <a class="user">@bip</a></p>
    <!-- TODO: ch\u1EC9 v\u1EBD th\u1EBB khi r\xEA chu\u1ED9t l\xEAn t\xEAn -->
    @defer {
      <app-profile-card />
    }
  \`,
})
class App {}

mount(App);
`,solution:`@Component({ selector: 'app-profile-card', template: '<div class="card">\u{1F423} B\xEDp \xB7 120 b\xE0i vi\u1EBFt</div>' })
class ProfileCard {}

@Component({
  selector: 'app-root',
  imports: [ProfileCard],
  template: \`
    <p>B\xE0i vi\u1EBFt c\u1EE7a <a class="user" #user>@bip</a></p>
    @defer (on hover(user)) {
      <app-profile-card />
    }
  \`,
})
class App {}

mount(App);
`,hint:`Thêm #user vào thẻ <a>, rồi đổi thành @defer (on hover(user)) { … }. Khi trigger trỏ tới phần tử khác thì không bắt buộc có @placeholder.`,explain:`on interaction(ref) và on viewport(ref) cũng nhận biến tham chiếu như vậy. Có thể thêm prefetch on hover(user) cho một khối khác để tải sẵn trước khi người dùng bấm.`,simulate(e){e.at(350,()=>e.dom(r(`truoc`,`.card`))),e.at(400,()=>e.hover(`.user`))},check(e){return e.errors.length?s(`Có lỗi: `+e.errMsg()):e.root()?.getAttribute(`data-truoc`)!==`0`?s(`Thẻ hồ sơ đã hiện ngay khi mở trang.`):e.query(`.card`).length?i$1():s(`Rê chuột lên @bip nhưng thẻ chưa hiện. Trigger cần trỏ tới thẻ <a> qua biến tham chiếu.`)}}],cheatsheet:[[`Mặc định`,`<code>@defer { }</code> = <code>on idle</code>, tải gần như ngay`],[`Khi bấm`,`<code>@defer (on interaction) { } @placeholder { &lt;button&gt; }</code>`],[`Khi cuộn tới`,`<code>on viewport</code>, bắt buộc có <code>@placeholder</code>`],[`Sau một lúc`,`<code>on timer(1s)</code>`],[`Theo điều kiện`,`<code>when cond()</code>, chỉ một chiều; ẩn/hiện dùng <code>@if</code>`],[`Phần tử khác`,`<code>&lt;a #ref&gt;</code> + <code>on hover(ref)</code>`],[`Tải sẵn`,`<code>; prefetch on idle</code>`]]};export{a as LAB};