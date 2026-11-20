import { type LabExercise, type LabModule, NO, OK, same, show } from '../../../shared/lab/lab-model';
import type { LabHttp } from '../../../shared/lab/lab-runtime';

/**
 * Bài luyện của bài 21 — RxJS flattening. Request giả (fakeApi) hiện trên timeline và trong log mạng;
 * check() đọc thời điểm bắt đầu/kết thúc của từng request để biết chúng chạy song song, lần lượt hay bị huỷ.
 */
const maxOverlap = (reqs: LabHttp[]) => {
  let best = 0;
  for (const r of reqs) {
    const n = reqs.filter((o) => o.t <= r.t && (o.tEnd ?? Infinity) > r.t).length;
    best = Math.max(best, n);
  }
  return best;
};

const EXERCISES: LabExercise[] = [
  {
    id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
    desc: `<p>Bốn toán tử flattening khác nhau ở chỗ: sự kiện mới đến khi việc cũ <b>chưa xong</b> thì làm gì.</p>
<table><tr><th>Toán tử</th><th>Việc cũ đang chạy</th><th>Hợp cho</th></tr>
<tr><td><code>switchMap</code></td><td>huỷ, làm việc mới</td><td>tìm kiếm, đổi tab/bộ lọc (chỉ đọc)</td></tr>
<tr><td><code>mergeMap</code></td><td>chạy song song</td><td>việc độc lập: xoá nhiều dòng, upload</td></tr>
<tr><td><code>concatMap</code></td><td>xếp hàng</td><td>cần đúng thứ tự: lưu nháp</td></tr>
<tr><td><code>exhaustMap</code></td><td>bỏ qua sự kiện mới</td><td>đặt hàng, đăng nhập, refresh</td></tr></table>
<div class="tip">Thử đổi toán tử bên dưới rồi bấm nút liên tục để xem timeline.</div>`,
    starter: `const click$ = ui.button('Gửi');

click$.pipe(
  map((_, i) => i + 1),
  concatMap((n) => fakeApi.get('/job/' + n, { delay: 600, data: 'Xong việc ' + n })),
  takeUntilDestroyed(),
).subscribe(spy('kết quả'));
`,
  },
  {
    id: 'long-subscribe', group: 'Làm phẳng', title: 'Đừng lồng subscribe', level: 'Dễ', lv: 1, waitMs: 1300,
    desc: `<p>Gọi API thứ hai dựa trên kết quả API thứ nhất bằng cách <code>subscribe</code> bên trong <code>subscribe</code> thì subscription bên trong không ai quản lý: không huỷ được, lỗi không đi ra ngoài, và không chọn được cách xử lý khi có nhiều lần gọi chồng nhau. Hãy làm phẳng thành <b>một</b> chuỗi bằng toán tử flattening.</p>
<p><b>Yêu cầu:</b> lấy user 1 rồi lấy bài viết của user đó, với đúng <b>một</b> lần gọi <code>.subscribe(</code>. <code>posts</code> nhận danh sách 3 bài viết.</p>`,
    starter: `fakeApi.user(1).subscribe((user) => {
  fakeApi.posts(user.id).subscribe(spy('posts'));
});
`,
    solution: `fakeApi.user(1).pipe(
  switchMap((user) => fakeApi.posts(user.id)),
).subscribe(spy('posts'));
`,
    hint: 'fakeApi.user(1).pipe(switchMap((user) => fakeApi.posts(user.id))).subscribe(spy(\'posts\')).',
    explain: 'Khi chỉ có một giá trị đầu vào (như một lần gọi HTTP), switchMap, concatMap, mergeMap cho cùng kết quả; chọn switchMap là mặc định hợp lý cho thao tác đọc.',
    check(a, code) {
      const subs = (code.replace(/\/\/.*$/gm, '').match(/\.subscribe\s*\(/g) ?? []).length;
      if (subs > 1) return NO('Có ' + subs + ' lần .subscribe(: vẫn đang lồng subscribe.');
      const p = a.values('posts')[0] as unknown[] | undefined;
      return Array.isArray(p) && p.length === 3 ? OK() : NO('posts nhận được ' + show(a.values('posts')) + ', cần danh sách 3 bài viết.');
    },
  },
  {
    id: 'switch-tab', group: 'Chọn toán tử', title: 'Đổi tab liên tục: switchMap', level: 'Dễ', lv: 1, waitMs: 1300,
    desc: `<p>Người dùng bấm qua các tab rất nhanh. Với <code>mergeMap</code>, mọi request đều chạy và kết quả về lần lượt, màn hình nhảy qua dữ liệu của từng tab cũ; nếu request cũ về sau request mới, màn hình còn hiện <b>sai</b> tab. <code>switchMap</code> huỷ request cũ khi có lựa chọn mới.</p>
<p><b>Yêu cầu:</b> trang bấm <b>Đơn hàng</b>, <b>Hoá đơn</b>, <b>Khách hàng</b> cách nhau 100ms. <code>data</code> chỉ được nhận đúng một giá trị: <code>Dữ liệu Khách hàng</code>.</p>`,
    starter: `const tab$ = merge(
  ui.button('Đơn hàng').pipe(map(() => 'Đơn hàng')),
  ui.button('Hoá đơn').pipe(map(() => 'Hoá đơn')),
  ui.button('Khách hàng').pipe(map(() => 'Khách hàng')),
);

tab$.pipe(
  mergeMap((tab) => fakeApi.get('/tabs/' + tab, { delay: 400, data: 'Dữ liệu ' + tab })),
  takeUntilDestroyed(),
).subscribe(spy('data'));
`,
    solution: `const tab$ = merge(
  ui.button('Đơn hàng').pipe(map(() => 'Đơn hàng')),
  ui.button('Hoá đơn').pipe(map(() => 'Hoá đơn')),
  ui.button('Khách hàng').pipe(map(() => 'Khách hàng')),
);

tab$.pipe(
  switchMap((tab) => fakeApi.get('/tabs/' + tab, { delay: 400, data: 'Dữ liệu ' + tab })),
  takeUntilDestroyed(),
).subscribe(spy('data'));
`,
    hint: 'Đổi mergeMap thành switchMap.',
    explain: 'Huỷ một request GET là an toàn: server có xử lý xong cũng không sao. Với thao tác ghi thì không: huỷ ở phía trình duyệt không hoàn tác được việc server đã làm.',
    simulate(s) {
      s.at(100, () => s.click('Đơn hàng'));
      s.at(200, () => s.click('Hoá đơn'));
      s.at(300, () => s.click('Khách hàng'));
    },
    check(a) {
      const v = a.values('data');
      if (same(v, ['Dữ liệu Khách hàng'])) return OK();
      return NO('data nhận ' + show(v) + ': kết quả của các tab cũ vẫn được hiển thị.');
    },
  },
  {
    id: 'dat-hang', group: 'Chọn toán tử', title: 'Bấm đặt hàng 3 lần: exhaustMap', level: 'Trung bình', lv: 2, waitMs: 1300,
    desc: `<p>Với thao tác <b>ghi</b> như đặt hàng, <code>switchMap</code> là lựa chọn nguy hiểm: nó huỷ request cũ ở trình duyệt, nhưng server có thể <b>đã tạo đơn</b>, và request mới lại tạo thêm một đơn nữa. <code>exhaustMap</code> bỏ qua các lần bấm khi đơn đang được gửi.</p>
<p><b>Yêu cầu:</b> trang bấm <b>Đặt hàng</b> 3 lần cách nhau 100ms. Chỉ có <b>1</b> request <code>/save</code>, và không request nào bị huỷ.</p>`,
    starter: `const order$ = ui.button('Đặt hàng');

order$.pipe(
  switchMap(() => fakeApi.save({ product: 'Áo mưa', qty: 1 })),
  takeUntilDestroyed(),
).subscribe(spy('đơn'));
`,
    solution: `const order$ = ui.button('Đặt hàng');

order$.pipe(
  exhaustMap(() => fakeApi.save({ product: 'Áo mưa', qty: 1 })),
  takeUntilDestroyed(),
).subscribe(spy('đơn'));
`,
    hint: 'Đổi switchMap thành exhaustMap.',
    explain: 'Vẫn nên disable nút trong lúc gửi để người dùng biết. Ở server, nên dùng khoá idempotency để hai request trùng không tạo hai đơn.',
    simulate(s) {
      s.at(100, () => s.click('Đặt hàng'));
      s.at(200, () => s.click('Đặt hàng'));
      s.at(300, () => s.click('Đặt hàng'));
    },
    check(a) {
      const reqs = a.http('/save');
      const cancelled = reqs.filter((r) => r.status === 'cancelled').length;
      if (cancelled) return NO(cancelled + ' request đặt hàng bị huỷ giữa chừng: server có thể đã tạo đơn, rồi request sau lại tạo thêm.');
      return reqs.length === 1 ? OK() : NO('Có ' + reqs.length + ' request đặt hàng, chỉ được có 1.');
    },
  },
  {
    id: 'luu-nhap', group: 'Chọn toán tử', title: 'Tự động lưu nháp đúng thứ tự: concatMap', level: 'Trung bình', lv: 2, waitMs: 1900,
    desc: `<p>Mỗi bản nháp đều phải tới server, và phải tới <b>đúng thứ tự</b>: nếu bản 2 tới sau bản 3, server sẽ lưu nội dung cũ. <code>mergeMap</code> gửi song song nên thứ tự không được đảm bảo; <code>switchMap</code> làm mất bản nháp; <code>exhaustMap</code> bỏ qua bản nháp. <code>concatMap</code> xếp hàng: gửi xong bản này mới gửi bản sau.</p>
<p><b>Yêu cầu:</b> trang bấm <b>Lưu nháp</b> lúc 100, 250, 400ms. Có đủ 3 request, không cái nào bị huỷ, và không có hai request nào chạy chồng lên nhau.</p>`,
    starter: `const save$ = ui.button('Lưu nháp');

save$.pipe(
  map((_, i) => 'Bản ' + (i + 1)),
  mergeMap((draft) => fakeApi.save(draft, 400)),
  takeUntilDestroyed(),
).subscribe(spy('đã lưu'));
`,
    solution: `const save$ = ui.button('Lưu nháp');

save$.pipe(
  map((_, i) => 'Bản ' + (i + 1)),
  concatMap((draft) => fakeApi.save(draft, 400)),
  takeUntilDestroyed(),
).subscribe(spy('đã lưu'));
`,
    hint: 'Đổi mergeMap thành concatMap.',
    explain: 'concatMap giữ hàng đợi trong bộ nhớ; nếu người dùng gõ rất nhanh mà request chậm, hàng đợi dài dần. Lưu nháp thật thường kết hợp debounceTime trước concatMap.',
    simulate(s) {
      s.at(100, () => s.click('Lưu nháp'));
      s.at(250, () => s.click('Lưu nháp'));
      s.at(400, () => s.click('Lưu nháp'));
    },
    check(a) {
      const reqs = a.http('/save');
      const cancelled = reqs.filter((r) => r.status === 'cancelled').length;
      if (reqs.length < 3) return NO('Chỉ có ' + reqs.length + ' request: có bản nháp bị bỏ qua.');
      if (cancelled) return NO(cancelled + ' bản nháp bị huỷ giữa chừng.');
      const ov = maxOverlap(reqs);
      if (ov > 1) return NO('Có ' + ov + ' request chạy cùng lúc: thứ tự tới server không được đảm bảo.');
      return reqs.every((r) => r.status === 'done') ? OK() : NO('Chưa đủ 3 bản nháp được lưu xong.');
    },
  },
  {
    id: 'upload', group: 'Giới hạn song song', title: 'Upload nhiều tệp, tối đa 2 cùng lúc: mergeMap(fn, 2)', level: 'Trung bình', lv: 2, waitMs: 1500,
    desc: `<p><code>mergeMap</code> không giới hạn sẽ gửi cùng lúc mọi request: 6 tệp là 6 kết nối, 600 tệp là 600 kết nối. Tham số thứ hai của <code>mergeMap</code> giới hạn số việc chạy song song; các việc còn lại chờ tới lượt.</p>
<p><b>Yêu cầu:</b> upload đủ 6 tệp, mỗi lúc có <b>đúng 2</b> request chạy song song (không phải 6, cũng không phải lần lượt từng cái).</p>`,
    starter: `const files = ['a.png', 'b.png', 'c.png', 'd.png', 'e.png', 'f.png'];

from(files).pipe(
  mergeMap((f) => fakeApi.get('/upload/' + f, { delay: 300, data: f + ' ✓' })),
).subscribe(spy('uploaded'));
`,
    solution: `const files = ['a.png', 'b.png', 'c.png', 'd.png', 'e.png', 'f.png'];

from(files).pipe(
  mergeMap((f) => fakeApi.get('/upload/' + f, { delay: 300, data: f + ' ✓' }), 2),
).subscribe(spy('uploaded'));
`,
    hint: 'Thêm tham số thứ hai cho mergeMap: mergeMap((f) => …, 2).',
    explain: 'mergeMap(fn, 1) chính là concatMap. Con số phù hợp tuỳ server và loại việc; trình duyệt cũng tự giới hạn khoảng 6 kết nối HTTP/1.1 tới cùng một tên miền.',
    check(a) {
      const reqs = a.http('/upload/');
      const ov = maxOverlap(reqs);
      if (reqs.length !== 6) return NO('Có ' + reqs.length + ' request upload, cần 6.');
      if (ov > 2) return NO('Có ' + ov + ' request chạy cùng lúc, chỉ được tối đa 2.');
      if (ov < 2) return NO('Các tệp đang upload lần lượt từng cái: cho phép 2 cái chạy song song.');
      return a.values('uploaded').length === 6 ? OK() : NO('Chưa nhận đủ 6 kết quả upload.');
    },
  },
  {
    id: 'xoa-nhieu', group: 'Giới hạn song song', title: 'Xoá nhiều dòng khác nhau: không được huỷ, không được bỏ', level: 'Khó', lv: 3, waitMs: 1300,
    desc: `<p>Mỗi lần bấm <b>Xoá</b> ở đây là một việc <b>khác nhau</b> (xoá dòng A, B, C), không phải bấm lặp cùng một việc. <code>switchMap</code> huỷ lệnh xoá trước, <code>exhaustMap</code> bỏ qua lệnh xoá sau: cả hai đều làm mất thao tác của người dùng. Các lệnh xoá độc lập với nhau nên chạy song song được.</p>
<p><b>Yêu cầu:</b> trang bấm <b>Xoá A</b>, <b>Xoá B</b>, <b>Xoá C</b> cách nhau 100ms. Cả 3 lệnh xoá đều xong (không lệnh nào bị huỷ) và danh sách còn lại trống.</p>`,
    starter: `const items = signal(['A', 'B', 'C']);
ui.text('Còn lại', items);

const delete$ = merge(
  ui.button('Xoá A').pipe(map(() => 'A')),
  ui.button('Xoá B').pipe(map(() => 'B')),
  ui.button('Xoá C').pipe(map(() => 'C')),
);

delete$.pipe(
  switchMap((id) => fakeApi.get('/items/' + id + '/delete', { delay: 400, data: id })),
  takeUntilDestroyed(),
).subscribe((id) => {
  items.update((list) => list.filter((x) => x !== id));
  log('Đã xoá', id);
});
`,
    solution: `const items = signal(['A', 'B', 'C']);
ui.text('Còn lại', items);

const delete$ = merge(
  ui.button('Xoá A').pipe(map(() => 'A')),
  ui.button('Xoá B').pipe(map(() => 'B')),
  ui.button('Xoá C').pipe(map(() => 'C')),
);

delete$.pipe(
  mergeMap((id) => fakeApi.get('/items/' + id + '/delete', { delay: 400, data: id })),
  takeUntilDestroyed(),
).subscribe((id) => {
  items.update((list) => list.filter((x) => x !== id));
  log('Đã xoá', id);
});
`,
    hint: 'Đổi switchMap thành mergeMap (concatMap cũng đạt, chỉ chậm hơn).',
    explain: 'Nếu bấm lặp cùng một dòng thì nên chặn ở UI (disable nút của dòng đang xoá), hoặc dùng groupBy theo id rồi exhaustMap trong từng nhóm.',
    simulate(s) {
      s.at(100, () => s.click('Xoá A'));
      s.at(200, () => s.click('Xoá B'));
      s.at(300, () => s.click('Xoá C'));
    },
    check(a) {
      const reqs = a.http('/items/');
      const cancelled = reqs.filter((r) => r.status === 'cancelled').length;
      if (cancelled) return NO(cancelled + ' lệnh xoá bị huỷ giữa chừng: người dùng bấm xoá mà dòng vẫn còn.');
      if (reqs.length < 3) return NO('Chỉ có ' + reqs.length + ' lệnh xoá được gửi: các lần bấm khác bị bỏ qua.');
      const done = a.logs.filter((l) => l.startsWith('Đã xoá')).length;
      return done === 3 ? OK() : NO('Mới xoá xong ' + done + '/3 dòng.');
    },
  },
];

export const LAB: LabModule = {
  title: 'RxJS flattening',
  subtitle: 'bài luyện chọn switchMap, mergeMap, concatMap, exhaustMap theo tình huống: bỏ subscribe lồng, đổi tab, đặt hàng, lưu nháp, upload có giới hạn, xoá nhiều dòng.',
  exercises: EXERCISES,
  cheatsheet: [
    ['Chỉ cần kết quả mới nhất (đọc)', '<code>switchMap</code>'],
    ['Đúng thứ tự, không bỏ', '<code>concatMap</code>'],
    ['Bỏ qua khi đang bận (ghi)', '<code>exhaustMap</code>'],
    ['Song song, độc lập', '<code>mergeMap</code>, giới hạn: <code>mergeMap(fn, 2)</code>'],
    ['Không bao giờ', '<code>subscribe</code> lồng trong <code>subscribe</code>'],
  ],
};
