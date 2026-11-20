import { type LabExercise, type LabModule, NO, OK } from '../../../shared/lab/lab-model';

/**
 * Bài luyện của bài 14 — @defer. Lab biên dịch component bằng JIT nên phần phụ thuộc trong @defer không thực sự
 * tách thành chunk riêng; nhưng trigger (on interaction, on viewport, on timer, when…) và @placeholder chạy đúng
 * như ứng dụng thật, nên vẫn luyện được "khi nào phần bị hoãn được vẽ".
 */
const HEAVY = `@Component({ selector: 'app-chart', template: '<div class="chart">📊 Biểu đồ doanh thu</div>' })
class Chart {}
`;

/** Ghi lại phần tử `sel` có mặt hay không vào thuộc tính data-<key> của khung preview, để check() đọc sau. */
const mark = (key: string, sel: string) => (r: HTMLElement) => r.setAttribute('data-' + key, r.querySelector(sel) ? '1' : '0');

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Thử các trigger của <code>@defer</code>: <code>on idle</code> (mặc định), <code>on viewport</code>, <code>on interaction</code>, <code>on hover</code>, <code>on timer(1s)</code>, <code>on immediate</code>, <code>when điềuKiện</code>, cùng <code>@placeholder</code>, <code>@loading</code>, <code>@error</code>.</p>
<div class="tip">Lab biên dịch component ngay trong trình duyệt (JIT), nên component trong <code>@defer</code> không bị tách thành file JS riêng như khi <code>ng build</code>. Thời điểm vẽ theo trigger thì vẫn đúng như ứng dụng thật.</div>`,
    starter: HEAVY + `
@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <h3>Báo cáo</h3>
    @defer (on interaction) {
      <app-chart />
    } @placeholder {
      <button>Xem biểu đồ</button>
    }
  \`,
})
class App {}

mount(App);
`,
  },
  {
    id: 'on-interaction', group: 'Trigger', title: 'Chỉ tải khi người dùng bấm: on interaction', level: 'Dễ', lv: 1, waitMs: 800,
    desc: `<p>Không ghi trigger thì <code>@defer</code> dùng <code>on idle</code>: tải ngay khi trình duyệt rảnh, tức là gần như lúc mở trang. Với phần nặng mà không phải ai cũng xem (biểu đồ, trình soạn thảo, bản đồ), hãy chỉ tải khi người dùng tương tác: <code>@defer (on interaction)</code>. Trigger này lắng nghe click trên <b>@placeholder</b>, nên cần có placeholder.</p>
<p><b>Yêu cầu:</b> lúc mở trang chưa có <code>.chart</code>; bấm nút <b>Xem biểu đồ</b> (nằm trong placeholder) thì biểu đồ hiện ra.</p>`,
    starter: HEAVY + `
@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <h3>Báo cáo</h3>
    <!-- ❗ mặc định on idle: tải ngay khi mở trang -->
    @defer {
      <app-chart />
    }
  \`,
})
class App {}

mount(App);
`,
    solution: HEAVY + `
@Component({
  selector: 'app-root',
  imports: [Chart],
  template: \`
    <h3>Báo cáo</h3>
    @defer (on interaction) {
      <app-chart />
    } @placeholder {
      <button>Xem biểu đồ</button>
    }
  \`,
})
class App {}

mount(App);
`,
    hint: 'Đổi thành @defer (on interaction) { <app-chart /> } @placeholder { <button>Xem biểu đồ</button> }.',
    explain: 'Placeholder phải có đúng một phần tử gốc để trigger bám vào. Thêm prefetch on idle nếu muốn tải sẵn code trong nền nhưng vẫn chỉ vẽ khi bấm: @defer (on interaction; prefetch on idle).',
    simulate(s) {
      s.at(350, () => s.dom(mark('truoc', '.chart')));
      s.at(400, () => s.click('Xem biểu đồ'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (a.root()?.getAttribute('data-truoc') !== '0') return NO('Biểu đồ đã hiện ngay khi mở trang: @defer đang dùng on idle mặc định.');
      return a.query('.chart').length ? OK() : NO('Bấm "Xem biểu đồ" nhưng biểu đồ chưa hiện. Nút phải nằm trong @placeholder.');
    },
  },
  {
    id: 'when-mot-chieu', group: 'Trigger', title: '"when" chỉ chạy một chiều', level: 'Trung bình', lv: 2, waitMs: 900,
    desc: `<p><code>@defer (when điềuKiện)</code> vẽ nội dung khi điều kiện chuyển sang true, và <b>chỉ một lần</b>: khi điều kiện trở lại false, nội dung vẫn ở đó. <code>@defer</code> quyết định <i>khi nào tải</i>, còn ẩn/hiện qua lại là việc của <code>@if</code>.</p>
<p><b>Yêu cầu:</b> bấm <b>Hiện</b> thì có <code>.panel</code>, bấm <b>Ẩn</b> thì <code>.panel</code> biến mất. Vẫn giữ <code>@defer</code> để phần panel chỉ được tải khi cần.</p>`,
    starter: `@Component({ selector: 'app-panel', template: '<div class="panel">⚙️ Cài đặt nâng cao</div>' })
class Panel {}

@Component({
  selector: 'app-root',
  imports: [Panel],
  template: \`
    <button (click)="open.set(true)">Hiện</button>
    <button (click)="open.set(false)">Ẩn</button>
    @defer (when open()) {
      <app-panel />
    }
  \`,
})
class App {
  open = signal(false);
}

mount(App);
`,
    solution: `@Component({ selector: 'app-panel', template: '<div class="panel">⚙️ Cài đặt nâng cao</div>' })
class Panel {}

@Component({
  selector: 'app-root',
  imports: [Panel],
  template: \`
    <button (click)="open.set(true)">Hiện</button>
    <button (click)="open.set(false)">Ẩn</button>
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
`,
    hint: 'Bọc @defer trong @if (open()) { @defer { <app-panel /> } }. @if lo ẩn/hiện, @defer bên trong chỉ tải lần đầu.',
    explain: 'Code của Panel chỉ được tải ở lần mở đầu tiên; những lần sau @if chỉ tạo lại view từ code đã có.',
    simulate(s) {
      s.at(200, () => s.click('Hiện'));
      s.at(450, () => s.dom(mark('mo', '.panel')));
      s.at(500, () => s.click('Ẩn'));
    },
    check(a, code) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (!/@defer/.test(code)) return NO('Vẫn cần @defer để panel chỉ được tải khi mở.');
      if (a.root()?.getAttribute('data-mo') !== '1') return NO('Bấm Hiện nhưng panel chưa xuất hiện.');
      return a.query('.panel').length ? NO('Bấm Ẩn mà panel vẫn còn: "when" chỉ chạy một chiều, không ẩn lại được.') : OK();
    },
  },
  {
    id: 'on-timer', group: 'Trigger', title: 'Hiện sau một khoảng thời gian: on timer', level: 'Dễ', lv: 1, waitMs: 1500,
    desc: `<p><code>@defer (on timer(1s))</code> vẽ nội dung sau một khoảng thời gian kể từ lúc khối được tạo. Hợp cho phần phụ không cần ngay (banner khuyến mãi, gợi ý, khung chat hỗ trợ), để phần chính được vẽ trước.</p>
<p><b>Yêu cầu:</b> banner <code>.promo</code> chưa có trong 0,5 giây đầu, và hiện ra sau khoảng 1 giây. Trong lúc chờ, hiện <code>&lt;p class="cho"&gt;</code> làm placeholder.</p>`,
    starter: `@Component({ selector: 'app-promo', template: '<div class="promo">🎁 Giảm 20% hôm nay</div>' })
class Promo {}

@Component({
  selector: 'app-root',
  imports: [Promo],
  template: \`
    <h3>Cửa hàng</h3>
    @defer {
      <app-promo />
    }
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({ selector: 'app-promo', template: '<div class="promo">🎁 Giảm 20% hôm nay</div>' })
class Promo {}

@Component({
  selector: 'app-root',
  imports: [Promo],
  template: \`
    <h3>Cửa hàng</h3>
    @defer (on timer(1s)) {
      <app-promo />
    } @placeholder {
      <p class="cho">…</p>
    }
  \`,
})
class App {}

mount(App);
`,
    hint: 'Dùng @defer (on timer(1s)) { … } @placeholder { <p class="cho">…</p> }. Thời gian viết được 1s hoặc 1000ms.',
    explain: 'Có thể ghép nhiều trigger bằng dấu ;, khối sẽ vẽ khi trigger nào tới trước: @defer (on viewport; on timer(5s)).',
    simulate(s) {
      s.at(500, () => s.dom((r) => { mark('som', '.promo')(r); mark('cho', '.cho')(r); }));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      const r = a.root();
      if (r?.getAttribute('data-som') !== '0') return NO('Banner đã hiện ngay từ đầu, cần chờ khoảng 1 giây (on timer).');
      if (r?.getAttribute('data-cho') !== '1') return NO('Trong lúc chờ cần có @placeholder chứa <p class="cho">.');
      return a.query('.promo').length ? OK() : NO('Sau 1,5 giây banner vẫn chưa hiện. Thời gian chờ có dài quá không?');
    },
  },
  {
    id: 'on-viewport', group: 'Trigger', title: 'Tải khi cuộn tới: on viewport', level: 'Trung bình', lv: 2, waitMs: 1200,
    desc: `<p><code>@defer (on viewport)</code> chỉ vẽ nội dung khi nó cuộn vào vùng nhìn thấy (dùng <code>IntersectionObserver</code>). Angular theo dõi phần tử của <b>@placeholder</b>, nên thiếu placeholder là lỗi biên dịch.</p>
<p><b>Yêu cầu:</b> phần bình luận nằm cuối hộp cuộn. Sửa lỗi để trang chạy được; bình luận <code>.comments</code> chưa có khi mới mở, và hiện ra khi kiểm tra tự cuộn hộp xuống cuối.</p>`,
    starter: `@Component({ selector: 'app-comments', template: '<div class="comments">💬 12 bình luận</div>' })
class Comments {}

@Component({
  selector: 'app-root',
  imports: [Comments],
  template: \`
    <div class="box" style="height: 140px; overflow: auto; border: 1px solid var(--line, #ccc); padding: 8px">
      <article style="height: 400px">Nội dung bài viết dài… (cuộn xuống)</article>
      @defer (on viewport) {
        <app-comments />
      }
    </div>
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({ selector: 'app-comments', template: '<div class="comments">💬 12 bình luận</div>' })
class Comments {}

@Component({
  selector: 'app-root',
  imports: [Comments],
  template: \`
    <div class="box" style="height: 140px; overflow: auto; border: 1px solid var(--line, #ccc); padding: 8px">
      <article style="height: 400px">Nội dung bài viết dài… (cuộn xuống)</article>
      @defer (on viewport) {
        <app-comments />
      } @placeholder {
        <p>Bình luận sẽ hiện khi bạn cuộn tới…</p>
      }
    </div>
  \`,
})
class App {}

mount(App);
`,
    hint: 'Thêm @placeholder { <p>Bình luận sẽ hiện khi bạn cuộn tới…</p> } ngay sau khối @defer. Placeholder cần đúng một phần tử gốc.',
    explain: 'Placeholder nên có chiều cao gần với nội dung thật để trang không bị nhảy (layout shift) khi nội dung thay vào.',
    simulate(s) {
      s.at(300, () => s.dom((r) => { mark('truoc', '.comments')(r); r.scrollIntoView({ block: 'nearest' }); }));
      s.at(400, () => s.dom((r) => { const b = r.querySelector('.box'); if (b) b.scrollTop = b.scrollHeight; }));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (a.root()?.getAttribute('data-truoc') !== '0') return NO('Bình luận đã hiện trước khi cuộn tới.');
      return a.query('.comments').length ? OK() : NO('Đã cuộn xuống cuối hộp nhưng bình luận chưa hiện.');
    },
  },
  {
    id: 'on-hover-ref', group: 'Trigger', title: 'Trigger trên phần tử khác: on hover(ref)', level: 'Trung bình', lv: 2, waitMs: 800,
    desc: `<p>Trigger có thể gắn vào một phần tử <b>bên ngoài</b> khối <code>@defer</code> bằng biến tham chiếu: <code>&lt;a #ten&gt;</code> rồi <code>@defer (on hover(ten))</code>. Hợp cho thẻ xem trước (preview card): chỉ tải khi rê chuột lên tên người dùng.</p>
<p><b>Yêu cầu:</b> lúc mở chưa có <code>.card</code>; rê chuột lên tên <b>@bip</b> thì thẻ hồ sơ hiện ra.</p>`,
    starter: `@Component({ selector: 'app-profile-card', template: '<div class="card">🐣 Bíp · 120 bài viết</div>' })
class ProfileCard {}

@Component({
  selector: 'app-root',
  imports: [ProfileCard],
  template: \`
    <p>Bài viết của <a class="user">@bip</a></p>
    <!-- TODO: chỉ vẽ thẻ khi rê chuột lên tên -->
    @defer {
      <app-profile-card />
    }
  \`,
})
class App {}

mount(App);
`,
    solution: `@Component({ selector: 'app-profile-card', template: '<div class="card">🐣 Bíp · 120 bài viết</div>' })
class ProfileCard {}

@Component({
  selector: 'app-root',
  imports: [ProfileCard],
  template: \`
    <p>Bài viết của <a class="user" #user>@bip</a></p>
    @defer (on hover(user)) {
      <app-profile-card />
    }
  \`,
})
class App {}

mount(App);
`,
    hint: 'Thêm #user vào thẻ <a>, rồi đổi thành @defer (on hover(user)) { … }. Khi trigger trỏ tới phần tử khác thì không bắt buộc có @placeholder.',
    explain: 'on interaction(ref) và on viewport(ref) cũng nhận biến tham chiếu như vậy. Có thể thêm prefetch on hover(user) cho một khối khác để tải sẵn trước khi người dùng bấm.',
    simulate(s) {
      s.at(350, () => s.dom(mark('truoc', '.card')));
      s.at(400, () => s.hover('.user'));
    },
    check(a) {
      if (a.errors.length) return NO('Có lỗi: ' + a.errMsg());
      if (a.root()?.getAttribute('data-truoc') !== '0') return NO('Thẻ hồ sơ đã hiện ngay khi mở trang.');
      return a.query('.card').length ? OK() : NO('Rê chuột lên @bip nhưng thẻ chưa hiện. Trigger cần trỏ tới thẻ <a> qua biến tham chiếu.');
    },
  },
];

export const LAB: LabModule = {
  title: '@defer',
  subtitle: 'bài luyện hoãn tải phần nặng trong template: on interaction, "when" một chiều, on timer, on viewport cần @placeholder, trigger trên phần tử khác.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Mặc định', '<code>@defer { }</code> = <code>on idle</code>, tải gần như ngay'],
    ['Khi bấm', '<code>@defer (on interaction) { } @placeholder { &lt;button&gt; }</code>'],
    ['Khi cuộn tới', '<code>on viewport</code>, bắt buộc có <code>@placeholder</code>'],
    ['Sau một lúc', '<code>on timer(1s)</code>'],
    ['Theo điều kiện', '<code>when cond()</code>, chỉ một chiều; ẩn/hiện dùng <code>@if</code>'],
    ['Phần tử khác', '<code>&lt;a #ref&gt;</code> + <code>on hover(ref)</code>'],
    ['Tải sẵn', '<code>; prefetch on idle</code>'],
  ],
};
