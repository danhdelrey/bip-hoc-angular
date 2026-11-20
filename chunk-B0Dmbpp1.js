import{a as s,i as o,r as i,t as c}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var l={title:`Subject & multicast`,subtitle:`bài luyện chọn đúng loại Subject và chia sẻ một luồng cho nhiều subscriber: Subject cho sự kiện, ReplaySubject, asObservable, share, refCount.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>So s\xE1nh c\xE1c lo\u1EA1i Subject v\xE0 to\xE1n t\u1EED multicast. <code>subscribe(spy('A'))</code> v\u1EBD m\u1ECDi gi\xE1 tr\u1ECB A nh\u1EADn \u0111\u01B0\u1EE3c l\xEAn timeline.</p>
<table><tr><th>Lo\u1EA1i</th><th>Subscriber \u0111\u1EBFn mu\u1ED9n nh\u1EADn</th></tr>
<tr><td><code>Subject</code></td><td>ch\u1EC9 gi\xE1 tr\u1ECB ph\xE1t sau khi subscribe</td></tr>
<tr><td><code>BehaviorSubject(v)</code></td><td>gi\xE1 tr\u1ECB hi\u1EC7n t\u1EA1i</td></tr>
<tr><td><code>ReplaySubject(n)</code></td><td>n gi\xE1 tr\u1ECB g\u1EA7n nh\u1EA5t, k\u1EC3 c\u1EA3 sau khi complete</td></tr></table>`,starter:`const s = new ReplaySubject(2);

s.subscribe(spy('A'));
s.next(1);
s.next(2);
s.next(3);

setTimeout(() => s.subscribe(spy('B')), 200); // B \u0111\u1EBFn mu\u1ED9n: nh\u1EADn 2, 3
`},{id:`su-kien`,group:`Chọn loại Subject`,title:`Sự kiện một lần: Subject, không phải BehaviorSubject`,level:`Dễ`,lv:1,waitMs:600,desc:`<p><code>BehaviorSubject</code> h\u1EE3p v\u1EDBi <b>state</b> (lu\xF4n c\xF3 gi\xE1 tr\u1ECB hi\u1EC7n t\u1EA1i). V\u1EDBi <b>s\u1EF1 ki\u1EC7n</b> x\u1EA3y ra m\u1ED9t l\u1EA7n (hi\u1EC7n th\xF4ng b\xE1o, \u0111i\u1EC1u h\u01B0\u1EDBng, "\u0111\xE3 l\u01B0u"), n\xF3 l\u1EA1i g\xE2y l\u1ED7i: ai subscribe sau nh\u1EADn ngay s\u1EF1 ki\u1EC7n c\u0169, nh\u01B0 th\u1EC3 s\u1EF1 ki\u1EC7n v\u1EEBa x\u1EA3y ra l\u1EA1i. S\u1EF1 ki\u1EC7n n\xEAn d\xF9ng <code>Subject</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> A (v\xE0o t\u1EEB \u0111\u1EA7u) nh\u1EADn <code>\u0110\xE3 l\u01B0u</code>, <code>\u0110\xE3 xo\xE1</code>. B v\xE0o l\xFAc 250ms, sau khi "\u0110\xE3 l\u01B0u" \u0111\xE3 qua, ch\u1EC9 \u0111\u01B0\u1EE3c nh\u1EADn <code>\u0110\xE3 xo\xE1</code>.</p>`,starter:`// k\xEAnh th\xF4ng b\xE1o toast c\u1EE7a \u1EE9ng d\u1EE5ng
const toast$ = new BehaviorSubject(null);

toast$.subscribe(spy('A'));                       // component toast ch\xEDnh
setTimeout(() => toast$.next('\u0110\xE3 l\u01B0u'), 100);
setTimeout(() => toast$.subscribe(spy('B')), 250); // m\u1ED9t component m\u1EDF mu\u1ED9n
setTimeout(() => toast$.next('\u0110\xE3 xo\xE1'), 400);
`,solution:`const toast$ = new Subject();

toast$.subscribe(spy('A'));
setTimeout(() => toast$.next('\u0110\xE3 l\u01B0u'), 100);
setTimeout(() => toast$.subscribe(spy('B')), 250);
setTimeout(() => toast$.next('\u0110\xE3 xo\xE1'), 400);
`,hint:`Đổi new BehaviorSubject(null) thành new Subject().`,explain:`Dấu hiệu dùng sai BehaviorSubject: phải tạo nó với giá trị null rồi filter(x => x !== null) ở mọi nơi. Nếu cần "state" thì trong Angular hiện đại, signal thường gọn hơn BehaviorSubject.`,check(i$1){let t=i$1.values(`A`),e=i$1.values(`B`);return t.includes(null)?s(`A nhận cả giá trị null ban đầu: `+c(t)+`. Sự kiện không có "giá trị hiện tại".`):e.includes(`Đã lưu`)?s(`B vào sau khi "Đã lưu" xảy ra nhưng vẫn nhận nó: `+c(e)+`.`):o(t,[`Đã lưu`,`Đã xoá`])&&o(e,[`Đã xoá`])?i():s(`A = `+c(t)+`, B = `+c(e)+`.`)}},{id:`replay`,group:`Chọn loại Subject`,title:`Đến sau khi đã complete: ReplaySubject`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>Sau khi <code>complete()</code>, <code>BehaviorSubject</code> kh\xF4ng ph\xE1t l\u1EA1i gi\xE1 tr\u1ECB n\xE0o cho subscriber m\u1EDBi: n\xF3 ch\u1EC9 nh\u1EADn ngay th\xF4ng b\xE1o complete. <code>ReplaySubject(n)</code> th\xEC v\u1EABn ph\xE1t l\u1EA1i <code>n</code> gi\xE1 tr\u1ECB g\u1EA7n nh\u1EA5t r\u1ED3i m\u1EDBi complete, n\xEAn h\u1EE3p cho d\u1EEF li\u1EC7u "\u0111\xE3 t\u1EA3i xong, ai \u0111\u1EBFn sau v\u1EABn c\u1EA7n xem".</p>
<p><b>Y\xEAu c\u1EA7u:</b> C v\xE0o l\xFAc 400ms (sau khi \u0111\xE3 complete) v\u1EABn nh\u1EADn <b>2 gi\xE1 tr\u1ECB cu\u1ED1i</b> <code>2, 3</code> r\u1ED3i complete.</p>`,starter:`const log$ = new BehaviorSubject(0);

setTimeout(() => log$.next(1), 50);
setTimeout(() => log$.next(2), 100);
setTimeout(() => log$.next(3), 150);
setTimeout(() => log$.complete(), 200);

setTimeout(() => log$.subscribe(spy('C')), 400);
`,solution:`const log$ = new ReplaySubject(2);

setTimeout(() => log$.next(1), 50);
setTimeout(() => log$.next(2), 100);
setTimeout(() => log$.next(3), 150);
setTimeout(() => log$.complete(), 200);

setTimeout(() => log$.subscribe(spy('C')), 400);
`,hint:`Đổi thành new ReplaySubject(2).`,explain:`ReplaySubject không giới hạn (new ReplaySubject()) giữ mọi giá trị trong bộ nhớ mãi mãi; luôn truyền kích thước bộ đệm, có thể thêm thời gian sống: new ReplaySubject(2, 5000).`,check(i$2){let t=i$2.values(`C`),e=i$2.events(`C`).some(r=>r.type===`complete`);return o(t,[2,3])&&e?i():s(`C nhận được `+c(t)+(e?` rồi complete`:``)+`, cần 2, 3 rồi complete.`)}},{id:`as-observable`,group:`Đóng gói`,title:`Không để Subject public: asObservable()`,level:`Trung bình`,lv:2,waitMs:400,desc:`<p>Store \u0111\u1EC3 <code>items$</code> l\xE0 Subject public th\xEC <b>b\u1EA5t k\u1EF3 ai</b> c\u0169ng g\u1ECDi \u0111\u01B0\u1EE3c <code>store.items$.next(\u2026)</code> v\xE0 ghi \u0111\xE8 state, b\u1ECF qua m\u1ECDi logic c\u1EE7a store. Gi\u1EEF Subject \u1EDF tr\u01B0\u1EDDng private, ch\u1EC9 m\u1EDF ra phi\xEAn b\u1EA3n ch\u1EC9 \u0111\u1ECDc b\u1EB1ng <code>asObservable()</code>; mu\u1ED1n \u0111\u1ED5i state th\xEC ph\u1EA3i g\u1ECDi h\xE0m c\u1EE7a store.</p>
<p><b>Y\xEAu c\u1EA7u:</b> s\u1EEDa <code>CartStore</code> \u0111\u1EC3 d\xF2ng "l\u1EE1 tay" \u1EDF cu\u1ED1i kh\xF4ng xo\xE1 \u0111\u01B0\u1EE3c gi\u1ECF h\xE0ng: <code>cart</code> nh\u1EADn <code>[]</code>, <code>["\xC1o"]</code> v\xE0 d\u1EEBng \u1EDF \u0111\xF3. \u0110\u1EEBng s\u1EEDa ph\u1EA7n ki\u1EC3m tra.</p>`,starter:`class CartStore {
  items$ = new BehaviorSubject([]);

  add(item) {
    this.items$.next([...this.items$.value, item]);
  }
}

// --- ph\u1EA7n ki\u1EC3m tra, \u0111\u1EEBng s\u1EEDa ---
const store = new CartStore();
store.items$.subscribe(spy('cart'));
store.add('\xC1o');
store.items$.next?.([]); // m\u1ED9t component "l\u1EE1 tay" ghi th\u1EB3ng v\xE0o state
`,solution:`class CartStore {
  #items = new BehaviorSubject([]);
  items$ = this.#items.asObservable();

  add(item) {
    this.#items.next([...this.#items.value, item]);
  }
}

// --- ph\u1EA7n ki\u1EC3m tra, \u0111\u1EEBng s\u1EEDa ---
const store = new CartStore();
store.items$.subscribe(spy('cart'));
store.add('\xC1o');
store.items$.next?.([]); // m\u1ED9t component "l\u1EE1 tay" ghi th\u1EB3ng v\xE0o state
`,hint:`Giữ BehaviorSubject trong trường private (#items hoặc private items), và đặt items$ = this.#items.asObservable(). Hàm add() dùng #items.`,explain:`Cùng ý tưởng với signal: giữ signal ghi được ở private và mở ra bản chỉ đọc bằng items = this.#items.asReadonly().`,check(i$3,t){if(!/store\.items\$\.next\?\.\(\[\]\)/.test(t))return s(`Hãy giữ nguyên dòng store.items$.next?.([]) trong phần kiểm tra.`);let e=i$3.values(`cart`);return o(e,[[],[`Áo`]])?i():o(e.at(-1),[])?s(`Dòng "lỡ tay" đã xoá giỏ hàng: `+c(e)+`. items$ vẫn là Subject ghi được.`):s(`cart nhận được `+c(e)+`, cần [], ["Áo"].`)}},{id:`share`,group:`Multicast`,title:`Hai subscriber, một kết nối: share()`,level:`Trung bình`,lv:2,waitMs:1200,desc:`<p>Observable <b>cold</b> ch\u1EA1y l\u1EA1i t\u1EEB \u0111\u1EA7u cho <b>m\u1ED7i</b> subscriber: hai component c\xF9ng nghe m\u1ED9t lu\u1ED3ng gi\xE1 tr\u1ECB tr\u1EF1c ti\u1EBFp l\xE0 hai k\u1EBFt n\u1ED1i t\u1EDBi server. <code>share()</code> bi\u1EBFn n\xF3 th\xE0nh <b>hot</b>: subscriber \u0111\u1EA7u ti\xEAn m\u1EDF k\u1EBFt n\u1ED1i, c\xE1c subscriber sau d\xF9ng chung, v\xE0 khi kh\xF4ng c\xF2n ai nghe th\xEC k\u1EBFt n\u1ED1i \u0111\xF3ng.</p>
<p><b>Y\xEAu c\u1EA7u:</b> ch\u1EC9 c\xF3 <b>m\u1ED9t</b> d\xF2ng log <code>M\u1EDF k\u1EBFt n\u1ED1i</code>, v\xE0 c\u1EA3 A l\u1EABn B \u0111\u1EC1u nh\u1EADn \u0111\u1EE7 gi\xE1 tr\u1ECB gi\xE1.</p>`,starter:`// lu\u1ED3ng gi\xE1 tr\u1EF1c ti\u1EBFp (gi\u1EA3 l\u1EADp WebSocket)
const price$ = timer(0, 200).pipe(
  tap({ subscribe: () => log('M\u1EDF k\u1EBFt n\u1ED1i') }),
  map((i) => 100 + i),
  take(4),
);

price$.subscribe(spy('A')); // header
price$.subscribe(spy('B')); // bi\u1EC3u \u0111\u1ED3
`,solution:`const price$ = timer(0, 200).pipe(
  tap({ subscribe: () => log('M\u1EDF k\u1EBFt n\u1ED1i') }),
  map((i) => 100 + i),
  take(4),
  share(),
);

price$.subscribe(spy('A'));
price$.subscribe(spy('B'));
`,hint:`Thêm share() vào cuối pipe.`,explain:`share() không giữ giá trị cũ: ai subscribe muộn chỉ nhận từ lúc đó. Cần giá trị gần nhất cho người đến muộn thì dùng shareReplay({ bufferSize: 1, refCount: true }).`,check(i$4){let t=i$4.logs.filter(u=>u.includes(`Mở kết nối`)).length,e=i$4.values(`A`),r=i$4.values(`B`);return t!==1?s(`Có `+t+` lần "Mở kết nối": mỗi subscriber đang chạy lại Observable từ đầu.`):o(e,[100,101,102,103])&&o(r,e)?i():s(`A = `+c(e)+`, B = `+c(r)+`, cả hai cần 100…103.`)}},{id:`ref-count`,group:`Multicast`,title:`shareReplay cần refCount`,level:`Khó`,lv:3,waitMs:1e3,desc:`<p><code>shareReplay(1)</code> m\u1EB7c \u0111\u1ECBnh <code>refCount: false</code>: khi m\u1ECDi subscriber \u0111\xE3 hu\u1EF7, n\xF3 <b>v\u1EABn gi\u1EEF</b> subscription t\u1EDBi ngu\u1ED3n. V\u1EDBi ngu\u1ED3n kh\xF4ng t\u1EF1 k\u1EBFt th\xFAc (interval, WebSocket, valueChanges), ngu\u1ED3n ch\u1EA1y m\xE3i sau khi component \u0111\xE3 b\u1ECB hu\u1EF7: m\u1ED9t ki\u1EC3u r\xF2 r\u1EC9 kh\xF3 th\u1EA5y.</p>
<p><b>Y\xEAu c\u1EA7u:</b> sau khi A hu\u1EF7 subscription l\xFAc 350ms, ngu\u1ED3n ph\u1EA3i d\u1EEBng: t\u1ED5ng s\u1ED1 log <code>tick</code> kh\xF4ng qu\xE1 4.</p>`,starter:`const ticker$ = interval(100).pipe(
  tap((i) => log('tick ' + i)),
  shareReplay(1),
);

const sub = ticker$.subscribe(spy('A'));
setTimeout(() => sub.unsubscribe(), 350); // component b\u1ECB hu\u1EF7
`,solution:`const ticker$ = interval(100).pipe(
  tap((i) => log('tick ' + i)),
  shareReplay({ bufferSize: 1, refCount: true }),
);

const sub = ticker$.subscribe(spy('A'));
setTimeout(() => sub.unsubscribe(), 350);
`,hint:`shareReplay({ bufferSize: 1, refCount: true }).`,explain:`refCount: false chỉ hợp lý khi nguồn tự complete (như một lần gọi HTTP) và bạn muốn giữ kết quả làm cache cho cả vòng đời ứng dụng.`,check(i$5){let t=i$5.logs.filter(e=>e.startsWith(`tick`)).length;return t?t<=4?i():s(`Có `+t+` tick: nguồn vẫn chạy sau khi A đã huỷ subscription.`):s(`Không có tick nào: A cần nhận giá trị trước khi huỷ.`)}}],cheatsheet:[[`Sự kiện một lần`,`<code>new Subject()</code>`],[`State hiện tại`,`<code>new BehaviorSubject(init)</code> (hoặc signal)`],[`Phát lại n giá trị`,`<code>new ReplaySubject(n)</code>`],[`Chỉ đọc`,`<code>#items = new BehaviorSubject(…)</code>; <code>items$ = this.#items.asObservable()</code>`],[`Dùng chung luồng`,`<code>share()</code>`],[`Dùng chung + giá trị gần nhất`,`<code>shareReplay({ bufferSize: 1, refCount: true })</code>`]]};export{l as LAB};