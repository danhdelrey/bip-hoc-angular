import { type LabExercise, type LabModule, NO, OK, same, show } from '../../../shared/lab/lab-model';

/** Bài luyện của bài 20 — Subject & multicast. Thuần RxJS: spy('A') ghi lại mọi thông báo lên timeline. */
const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>So sánh các loại Subject và toán tử multicast. <code>subscribe(spy('A'))</code> vẽ mọi giá trị A nhận được lên timeline.</p>
<table><tr><th>Loại</th><th>Subscriber đến muộn nhận</th></tr>
<tr><td><code>Subject</code></td><td>chỉ giá trị phát sau khi subscribe</td></tr>
<tr><td><code>BehaviorSubject(v)</code></td><td>giá trị hiện tại</td></tr>
<tr><td><code>ReplaySubject(n)</code></td><td>n giá trị gần nhất, kể cả sau khi complete</td></tr></table>`,
    starter: `const s = new ReplaySubject(2);

s.subscribe(spy('A'));
s.next(1);
s.next(2);
s.next(3);

setTimeout(() => s.subscribe(spy('B')), 200); // B đến muộn: nhận 2, 3
`,
  },
  {
    id: 'su-kien', group: 'Chọn loại Subject', title: 'Sự kiện một lần: Subject, không phải BehaviorSubject', level: 'Dễ', lv: 1, waitMs: 600,
    desc: `<p><code>BehaviorSubject</code> hợp với <b>state</b> (luôn có giá trị hiện tại). Với <b>sự kiện</b> xảy ra một lần (hiện thông báo, điều hướng, "đã lưu"), nó lại gây lỗi: ai subscribe sau nhận ngay sự kiện cũ, như thể sự kiện vừa xảy ra lại. Sự kiện nên dùng <code>Subject</code>.</p>
<p><b>Yêu cầu:</b> A (vào từ đầu) nhận <code>Đã lưu</code>, <code>Đã xoá</code>. B vào lúc 250ms, sau khi "Đã lưu" đã qua, chỉ được nhận <code>Đã xoá</code>.</p>`,
    starter: `// kênh thông báo toast của ứng dụng
const toast$ = new BehaviorSubject(null);

toast$.subscribe(spy('A'));                       // component toast chính
setTimeout(() => toast$.next('Đã lưu'), 100);
setTimeout(() => toast$.subscribe(spy('B')), 250); // một component mở muộn
setTimeout(() => toast$.next('Đã xoá'), 400);
`,
    solution: `const toast$ = new Subject();

toast$.subscribe(spy('A'));
setTimeout(() => toast$.next('Đã lưu'), 100);
setTimeout(() => toast$.subscribe(spy('B')), 250);
setTimeout(() => toast$.next('Đã xoá'), 400);
`,
    hint: 'Đổi new BehaviorSubject(null) thành new Subject().',
    explain: 'Dấu hiệu dùng sai BehaviorSubject: phải tạo nó với giá trị null rồi filter(x => x !== null) ở mọi nơi. Nếu cần "state" thì trong Angular hiện đại, signal thường gọn hơn BehaviorSubject.',
    check(a) {
      const A = a.values('A'), B = a.values('B');
      if (A.includes(null)) return NO('A nhận cả giá trị null ban đầu: ' + show(A) + '. Sự kiện không có "giá trị hiện tại".');
      if (B.includes('Đã lưu')) return NO('B vào sau khi "Đã lưu" xảy ra nhưng vẫn nhận nó: ' + show(B) + '.');
      return same(A, ['Đã lưu', 'Đã xoá']) && same(B, ['Đã xoá']) ? OK() : NO('A = ' + show(A) + ', B = ' + show(B) + '.');
    },
  },
  {
    id: 'replay', group: 'Chọn loại Subject', title: 'Đến sau khi đã complete: ReplaySubject', level: 'Dễ', lv: 1, waitMs: 700,
    desc: `<p>Sau khi <code>complete()</code>, <code>BehaviorSubject</code> không phát lại giá trị nào cho subscriber mới: nó chỉ nhận ngay thông báo complete. <code>ReplaySubject(n)</code> thì vẫn phát lại <code>n</code> giá trị gần nhất rồi mới complete, nên hợp cho dữ liệu "đã tải xong, ai đến sau vẫn cần xem".</p>
<p><b>Yêu cầu:</b> C vào lúc 400ms (sau khi đã complete) vẫn nhận <b>2 giá trị cuối</b> <code>2, 3</code> rồi complete.</p>`,
    starter: `const log$ = new BehaviorSubject(0);

setTimeout(() => log$.next(1), 50);
setTimeout(() => log$.next(2), 100);
setTimeout(() => log$.next(3), 150);
setTimeout(() => log$.complete(), 200);

setTimeout(() => log$.subscribe(spy('C')), 400);
`,
    solution: `const log$ = new ReplaySubject(2);

setTimeout(() => log$.next(1), 50);
setTimeout(() => log$.next(2), 100);
setTimeout(() => log$.next(3), 150);
setTimeout(() => log$.complete(), 200);

setTimeout(() => log$.subscribe(spy('C')), 400);
`,
    hint: 'Đổi thành new ReplaySubject(2).',
    explain: 'ReplaySubject không giới hạn (new ReplaySubject()) giữ mọi giá trị trong bộ nhớ mãi mãi; luôn truyền kích thước bộ đệm, có thể thêm thời gian sống: new ReplaySubject(2, 5000).',
    check(a) {
      const C = a.values('C');
      const done = a.events('C').some((e) => e.type === 'complete');
      if (same(C, [2, 3]) && done) return OK();
      return NO('C nhận được ' + show(C) + (done ? ' rồi complete' : '') + ', cần 2, 3 rồi complete.');
    },
  },
  {
    id: 'as-observable', group: 'Đóng gói', title: 'Không để Subject public: asObservable()', level: 'Trung bình', lv: 2, waitMs: 400,
    desc: `<p>Store để <code>items$</code> là Subject public thì <b>bất kỳ ai</b> cũng gọi được <code>store.items$.next(…)</code> và ghi đè state, bỏ qua mọi logic của store. Giữ Subject ở trường private, chỉ mở ra phiên bản chỉ đọc bằng <code>asObservable()</code>; muốn đổi state thì phải gọi hàm của store.</p>
<p><b>Yêu cầu:</b> sửa <code>CartStore</code> để dòng "lỡ tay" ở cuối không xoá được giỏ hàng: <code>cart</code> nhận <code>[]</code>, <code>["Áo"]</code> và dừng ở đó. Đừng sửa phần kiểm tra.</p>`,
    starter: `class CartStore {
  items$ = new BehaviorSubject([]);

  add(item) {
    this.items$.next([...this.items$.value, item]);
  }
}

// --- phần kiểm tra, đừng sửa ---
const store = new CartStore();
store.items$.subscribe(spy('cart'));
store.add('Áo');
store.items$.next?.([]); // một component "lỡ tay" ghi thẳng vào state
`,
    solution: `class CartStore {
  #items = new BehaviorSubject([]);
  items$ = this.#items.asObservable();

  add(item) {
    this.#items.next([...this.#items.value, item]);
  }
}

// --- phần kiểm tra, đừng sửa ---
const store = new CartStore();
store.items$.subscribe(spy('cart'));
store.add('Áo');
store.items$.next?.([]); // một component "lỡ tay" ghi thẳng vào state
`,
    hint: 'Giữ BehaviorSubject trong trường private (#items hoặc private items), và đặt items$ = this.#items.asObservable(). Hàm add() dùng #items.',
    explain: 'Cùng ý tưởng với signal: giữ signal ghi được ở private và mở ra bản chỉ đọc bằng items = this.#items.asReadonly().',
    check(a, code) {
      if (!/store\.items\$\.next\?\.\(\[\]\)/.test(code)) return NO('Hãy giữ nguyên dòng store.items$.next?.([]) trong phần kiểm tra.');
      const v = a.values('cart');
      if (same(v, [[], ['Áo']])) return OK();
      if (same(v.at(-1), [])) return NO('Dòng "lỡ tay" đã xoá giỏ hàng: ' + show(v) + '. items$ vẫn là Subject ghi được.');
      return NO('cart nhận được ' + show(v) + ', cần [], ["Áo"].');
    },
  },
  {
    id: 'share', group: 'Multicast', title: 'Hai subscriber, một kết nối: share()', level: 'Trung bình', lv: 2, waitMs: 1200,
    desc: `<p>Observable <b>cold</b> chạy lại từ đầu cho <b>mỗi</b> subscriber: hai component cùng nghe một luồng giá trị trực tiếp là hai kết nối tới server. <code>share()</code> biến nó thành <b>hot</b>: subscriber đầu tiên mở kết nối, các subscriber sau dùng chung, và khi không còn ai nghe thì kết nối đóng.</p>
<p><b>Yêu cầu:</b> chỉ có <b>một</b> dòng log <code>Mở kết nối</code>, và cả A lẫn B đều nhận đủ giá trị giá.</p>`,
    starter: `// luồng giá trực tiếp (giả lập WebSocket)
const price$ = timer(0, 200).pipe(
  tap({ subscribe: () => log('Mở kết nối') }),
  map((i) => 100 + i),
  take(4),
);

price$.subscribe(spy('A')); // header
price$.subscribe(spy('B')); // biểu đồ
`,
    solution: `const price$ = timer(0, 200).pipe(
  tap({ subscribe: () => log('Mở kết nối') }),
  map((i) => 100 + i),
  take(4),
  share(),
);

price$.subscribe(spy('A'));
price$.subscribe(spy('B'));
`,
    hint: 'Thêm share() vào cuối pipe.',
    explain: 'share() không giữ giá trị cũ: ai subscribe muộn chỉ nhận từ lúc đó. Cần giá trị gần nhất cho người đến muộn thì dùng shareReplay({ bufferSize: 1, refCount: true }).',
    check(a) {
      const opens = a.logs.filter((l) => l.includes('Mở kết nối')).length;
      const A = a.values('A'), B = a.values('B');
      if (opens !== 1) return NO('Có ' + opens + ' lần "Mở kết nối": mỗi subscriber đang chạy lại Observable từ đầu.');
      return same(A, [100, 101, 102, 103]) && same(B, A) ? OK() : NO('A = ' + show(A) + ', B = ' + show(B) + ', cả hai cần 100…103.');
    },
  },
  {
    id: 'ref-count', group: 'Multicast', title: 'shareReplay cần refCount', level: 'Khó', lv: 3, waitMs: 1000,
    desc: `<p><code>shareReplay(1)</code> mặc định <code>refCount: false</code>: khi mọi subscriber đã huỷ, nó <b>vẫn giữ</b> subscription tới nguồn. Với nguồn không tự kết thúc (interval, WebSocket, valueChanges), nguồn chạy mãi sau khi component đã bị huỷ: một kiểu rò rỉ khó thấy.</p>
<p><b>Yêu cầu:</b> sau khi A huỷ subscription lúc 350ms, nguồn phải dừng: tổng số log <code>tick</code> không quá 4.</p>`,
    starter: `const ticker$ = interval(100).pipe(
  tap((i) => log('tick ' + i)),
  shareReplay(1),
);

const sub = ticker$.subscribe(spy('A'));
setTimeout(() => sub.unsubscribe(), 350); // component bị huỷ
`,
    solution: `const ticker$ = interval(100).pipe(
  tap((i) => log('tick ' + i)),
  shareReplay({ bufferSize: 1, refCount: true }),
);

const sub = ticker$.subscribe(spy('A'));
setTimeout(() => sub.unsubscribe(), 350);
`,
    hint: 'shareReplay({ bufferSize: 1, refCount: true }).',
    explain: 'refCount: false chỉ hợp lý khi nguồn tự complete (như một lần gọi HTTP) và bạn muốn giữ kết quả làm cache cho cả vòng đời ứng dụng.',
    check(a) {
      const ticks = a.logs.filter((l) => l.startsWith('tick')).length;
      if (!ticks) return NO('Không có tick nào: A cần nhận giá trị trước khi huỷ.');
      return ticks <= 4 ? OK() : NO('Có ' + ticks + ' tick: nguồn vẫn chạy sau khi A đã huỷ subscription.');
    },
  },
];

export const LAB: LabModule = {
  title: 'Subject & multicast',
  subtitle: 'bài luyện chọn đúng loại Subject và chia sẻ một luồng cho nhiều subscriber: Subject cho sự kiện, ReplaySubject, asObservable, share, refCount.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Sự kiện một lần', '<code>new Subject()</code>'],
    ['State hiện tại', '<code>new BehaviorSubject(init)</code> (hoặc signal)'],
    ['Phát lại n giá trị', '<code>new ReplaySubject(n)</code>'],
    ['Chỉ đọc', '<code>#items = new BehaviorSubject(…)</code>; <code>items$ = this.#items.asObservable()</code>'],
    ['Dùng chung luồng', '<code>share()</code>'],
    ['Dùng chung + giá trị gần nhất', '<code>shareReplay({ bufferSize: 1, refCount: true })</code>'],
  ],
};
