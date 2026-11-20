import{a as s,i as o,r as i,t as c}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var p=t=>{let n=0;for(let e of t){let i=t.filter(h=>h.t<=e.t&&(h.tEnd??1/0)>e.t).length;n=Math.max(n,i)}return n};var r={title:`RxJS flattening`,subtitle:`bài luyện chọn switchMap, mergeMap, concatMap, exhaustMap theo tình huống: bỏ subscribe lồng, đổi tab, đặt hàng, lưu nháp, upload có giới hạn, xoá nhiều dòng.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>B\u1ED1n to\xE1n t\u1EED flattening kh\xE1c nhau \u1EDF ch\u1ED7: s\u1EF1 ki\u1EC7n m\u1EDBi \u0111\u1EBFn khi vi\u1EC7c c\u0169 <b>ch\u01B0a xong</b> th\xEC l\xE0m g\xEC.</p>
<table><tr><th>To\xE1n t\u1EED</th><th>Vi\u1EC7c c\u0169 \u0111ang ch\u1EA1y</th><th>H\u1EE3p cho</th></tr>
<tr><td><code>switchMap</code></td><td>hu\u1EF7, l\xE0m vi\u1EC7c m\u1EDBi</td><td>t\xECm ki\u1EBFm, \u0111\u1ED5i tab/b\u1ED9 l\u1ECDc (ch\u1EC9 \u0111\u1ECDc)</td></tr>
<tr><td><code>mergeMap</code></td><td>ch\u1EA1y song song</td><td>vi\u1EC7c \u0111\u1ED9c l\u1EADp: xo\xE1 nhi\u1EC1u d\xF2ng, upload</td></tr>
<tr><td><code>concatMap</code></td><td>x\u1EBFp h\xE0ng</td><td>c\u1EA7n \u0111\xFAng th\u1EE9 t\u1EF1: l\u01B0u nh\xE1p</td></tr>
<tr><td><code>exhaustMap</code></td><td>b\u1ECF qua s\u1EF1 ki\u1EC7n m\u1EDBi</td><td>\u0111\u1EB7t h\xE0ng, \u0111\u0103ng nh\u1EADp, refresh</td></tr></table>
<div class="tip">Th\u1EED \u0111\u1ED5i to\xE1n t\u1EED b\xEAn d\u01B0\u1EDBi r\u1ED3i b\u1EA5m n\xFAt li\xEAn t\u1EE5c \u0111\u1EC3 xem timeline.</div>`,starter:`const click$ = ui.button('G\u1EEDi');

click$.pipe(
  map((_, i) => i + 1),
  concatMap((n) => fakeApi.get('/job/' + n, { delay: 600, data: 'Xong vi\u1EC7c ' + n })),
  takeUntilDestroyed(),
).subscribe(spy('k\u1EBFt qu\u1EA3'));
`},{id:`long-subscribe`,group:`Làm phẳng`,title:`Đừng lồng subscribe`,level:`Dễ`,lv:1,waitMs:1300,desc:`<p>G\u1ECDi API th\u1EE9 hai d\u1EF1a tr\xEAn k\u1EBFt qu\u1EA3 API th\u1EE9 nh\u1EA5t b\u1EB1ng c\xE1ch <code>subscribe</code> b\xEAn trong <code>subscribe</code> th\xEC subscription b\xEAn trong kh\xF4ng ai qu\u1EA3n l\xFD: kh\xF4ng hu\u1EF7 \u0111\u01B0\u1EE3c, l\u1ED7i kh\xF4ng \u0111i ra ngo\xE0i, v\xE0 kh\xF4ng ch\u1ECDn \u0111\u01B0\u1EE3c c\xE1ch x\u1EED l\xFD khi c\xF3 nhi\u1EC1u l\u1EA7n g\u1ECDi ch\u1ED3ng nhau. H\xE3y l\xE0m ph\u1EB3ng th\xE0nh <b>m\u1ED9t</b> chu\u1ED7i b\u1EB1ng to\xE1n t\u1EED flattening.</p>
<p><b>Y\xEAu c\u1EA7u:</b> l\u1EA5y user 1 r\u1ED3i l\u1EA5y b\xE0i vi\u1EBFt c\u1EE7a user \u0111\xF3, v\u1EDBi \u0111\xFAng <b>m\u1ED9t</b> l\u1EA7n g\u1ECDi <code>.subscribe(</code>. <code>posts</code> nh\u1EADn danh s\xE1ch 3 b\xE0i vi\u1EBFt.</p>`,starter:`fakeApi.user(1).subscribe((user) => {
  fakeApi.posts(user.id).subscribe(spy('posts'));
});
`,solution:`fakeApi.user(1).pipe(
  switchMap((user) => fakeApi.posts(user.id)),
).subscribe(spy('posts'));
`,hint:`fakeApi.user(1).pipe(switchMap((user) => fakeApi.posts(user.id))).subscribe(spy('posts')).`,explain:`Khi chỉ có một giá trị đầu vào (như một lần gọi HTTP), switchMap, concatMap, mergeMap cho cùng kết quả; chọn switchMap là mặc định hợp lý cho thao tác đọc.`,check(t,n){let e=(n.replace(/\/\/.*$/gm,``).match(/\.subscribe\s*\(/g)??[]).length;if(e>1)return s(`Có `+e+` lần .subscribe(: vẫn đang lồng subscribe.`);let i$1=t.values(`posts`)[0];return Array.isArray(i$1)&&i$1.length===3?i():s(`posts nhận được `+c(t.values(`posts`))+`, cần danh sách 3 bài viết.`)}},{id:`switch-tab`,group:`Chọn toán tử`,title:`Đổi tab liên tục: switchMap`,level:`Dễ`,lv:1,waitMs:1300,desc:`<p>Ng\u01B0\u1EDDi d\xF9ng b\u1EA5m qua c\xE1c tab r\u1EA5t nhanh. V\u1EDBi <code>mergeMap</code>, m\u1ECDi request \u0111\u1EC1u ch\u1EA1y v\xE0 k\u1EBFt qu\u1EA3 v\u1EC1 l\u1EA7n l\u01B0\u1EE3t, m\xE0n h\xECnh nh\u1EA3y qua d\u1EEF li\u1EC7u c\u1EE7a t\u1EEBng tab c\u0169; n\u1EBFu request c\u0169 v\u1EC1 sau request m\u1EDBi, m\xE0n h\xECnh c\xF2n hi\u1EC7n <b>sai</b> tab. <code>switchMap</code> hu\u1EF7 request c\u0169 khi c\xF3 l\u1EF1a ch\u1ECDn m\u1EDBi.</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang b\u1EA5m <b>\u0110\u01A1n h\xE0ng</b>, <b>Ho\xE1 \u0111\u01A1n</b>, <b>Kh\xE1ch h\xE0ng</b> c\xE1ch nhau 100ms. <code>data</code> ch\u1EC9 \u0111\u01B0\u1EE3c nh\u1EADn \u0111\xFAng m\u1ED9t gi\xE1 tr\u1ECB: <code>D\u1EEF li\u1EC7u Kh\xE1ch h\xE0ng</code>.</p>`,starter:`const tab$ = merge(
  ui.button('\u0110\u01A1n h\xE0ng').pipe(map(() => '\u0110\u01A1n h\xE0ng')),
  ui.button('Ho\xE1 \u0111\u01A1n').pipe(map(() => 'Ho\xE1 \u0111\u01A1n')),
  ui.button('Kh\xE1ch h\xE0ng').pipe(map(() => 'Kh\xE1ch h\xE0ng')),
);

tab$.pipe(
  mergeMap((tab) => fakeApi.get('/tabs/' + tab, { delay: 400, data: 'D\u1EEF li\u1EC7u ' + tab })),
  takeUntilDestroyed(),
).subscribe(spy('data'));
`,solution:`const tab$ = merge(
  ui.button('\u0110\u01A1n h\xE0ng').pipe(map(() => '\u0110\u01A1n h\xE0ng')),
  ui.button('Ho\xE1 \u0111\u01A1n').pipe(map(() => 'Ho\xE1 \u0111\u01A1n')),
  ui.button('Kh\xE1ch h\xE0ng').pipe(map(() => 'Kh\xE1ch h\xE0ng')),
);

tab$.pipe(
  switchMap((tab) => fakeApi.get('/tabs/' + tab, { delay: 400, data: 'D\u1EEF li\u1EC7u ' + tab })),
  takeUntilDestroyed(),
).subscribe(spy('data'));
`,hint:`Đổi mergeMap thành switchMap.`,explain:`Huỷ một request GET là an toàn: server có xử lý xong cũng không sao. Với thao tác ghi thì không: huỷ ở phía trình duyệt không hoàn tác được việc server đã làm.`,simulate(t){t.at(100,()=>t.click(`Đơn hàng`)),t.at(200,()=>t.click(`Hoá đơn`)),t.at(300,()=>t.click(`Khách hàng`))},check(t){let n=t.values(`data`);return o(n,[`Dữ liệu Khách hàng`])?i():s(`data nhận `+c(n)+`: kết quả của các tab cũ vẫn được hiển thị.`)}},{id:`dat-hang`,group:`Chọn toán tử`,title:`Bấm đặt hàng 3 lần: exhaustMap`,level:`Trung bình`,lv:2,waitMs:1300,desc:`<p>V\u1EDBi thao t\xE1c <b>ghi</b> nh\u01B0 \u0111\u1EB7t h\xE0ng, <code>switchMap</code> l\xE0 l\u1EF1a ch\u1ECDn nguy hi\u1EC3m: n\xF3 hu\u1EF7 request c\u0169 \u1EDF tr\xECnh duy\u1EC7t, nh\u01B0ng server c\xF3 th\u1EC3 <b>\u0111\xE3 t\u1EA1o \u0111\u01A1n</b>, v\xE0 request m\u1EDBi l\u1EA1i t\u1EA1o th\xEAm m\u1ED9t \u0111\u01A1n n\u1EEFa. <code>exhaustMap</code> b\u1ECF qua c\xE1c l\u1EA7n b\u1EA5m khi \u0111\u01A1n \u0111ang \u0111\u01B0\u1EE3c g\u1EEDi.</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang b\u1EA5m <b>\u0110\u1EB7t h\xE0ng</b> 3 l\u1EA7n c\xE1ch nhau 100ms. Ch\u1EC9 c\xF3 <b>1</b> request <code>/save</code>, v\xE0 kh\xF4ng request n\xE0o b\u1ECB hu\u1EF7.</p>`,starter:`const order$ = ui.button('\u0110\u1EB7t h\xE0ng');

order$.pipe(
  switchMap(() => fakeApi.save({ product: '\xC1o m\u01B0a', qty: 1 })),
  takeUntilDestroyed(),
).subscribe(spy('\u0111\u01A1n'));
`,solution:`const order$ = ui.button('\u0110\u1EB7t h\xE0ng');

order$.pipe(
  exhaustMap(() => fakeApi.save({ product: '\xC1o m\u01B0a', qty: 1 })),
  takeUntilDestroyed(),
).subscribe(spy('\u0111\u01A1n'));
`,hint:`Đổi switchMap thành exhaustMap.`,explain:`Vẫn nên disable nút trong lúc gửi để người dùng biết. Ở server, nên dùng khoá idempotency để hai request trùng không tạo hai đơn.`,simulate(t){t.at(100,()=>t.click(`Đặt hàng`)),t.at(200,()=>t.click(`Đặt hàng`)),t.at(300,()=>t.click(`Đặt hàng`))},check(t){let n=t.http(`/save`),e=n.filter(i=>i.status===`cancelled`).length;return e?s(e+` request đặt hàng bị huỷ giữa chừng: server có thể đã tạo đơn, rồi request sau lại tạo thêm.`):n.length===1?i():s(`Có `+n.length+` request đặt hàng, chỉ được có 1.`)}},{id:`luu-nhap`,group:`Chọn toán tử`,title:`Tự động lưu nháp đúng thứ tự: concatMap`,level:`Trung bình`,lv:2,waitMs:1900,desc:`<p>M\u1ED7i b\u1EA3n nh\xE1p \u0111\u1EC1u ph\u1EA3i t\u1EDBi server, v\xE0 ph\u1EA3i t\u1EDBi <b>\u0111\xFAng th\u1EE9 t\u1EF1</b>: n\u1EBFu b\u1EA3n 2 t\u1EDBi sau b\u1EA3n 3, server s\u1EBD l\u01B0u n\u1ED9i dung c\u0169. <code>mergeMap</code> g\u1EEDi song song n\xEAn th\u1EE9 t\u1EF1 kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EA3m b\u1EA3o; <code>switchMap</code> l\xE0m m\u1EA5t b\u1EA3n nh\xE1p; <code>exhaustMap</code> b\u1ECF qua b\u1EA3n nh\xE1p. <code>concatMap</code> x\u1EBFp h\xE0ng: g\u1EEDi xong b\u1EA3n n\xE0y m\u1EDBi g\u1EEDi b\u1EA3n sau.</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang b\u1EA5m <b>L\u01B0u nh\xE1p</b> l\xFAc 100, 250, 400ms. C\xF3 \u0111\u1EE7 3 request, kh\xF4ng c\xE1i n\xE0o b\u1ECB hu\u1EF7, v\xE0 kh\xF4ng c\xF3 hai request n\xE0o ch\u1EA1y ch\u1ED3ng l\xEAn nhau.</p>`,starter:`const save$ = ui.button('L\u01B0u nh\xE1p');

save$.pipe(
  map((_, i) => 'B\u1EA3n ' + (i + 1)),
  mergeMap((draft) => fakeApi.save(draft, 400)),
  takeUntilDestroyed(),
).subscribe(spy('\u0111\xE3 l\u01B0u'));
`,solution:`const save$ = ui.button('L\u01B0u nh\xE1p');

save$.pipe(
  map((_, i) => 'B\u1EA3n ' + (i + 1)),
  concatMap((draft) => fakeApi.save(draft, 400)),
  takeUntilDestroyed(),
).subscribe(spy('\u0111\xE3 l\u01B0u'));
`,hint:`Đổi mergeMap thành concatMap.`,explain:`concatMap giữ hàng đợi trong bộ nhớ; nếu người dùng gõ rất nhanh mà request chậm, hàng đợi dài dần. Lưu nháp thật thường kết hợp debounceTime trước concatMap.`,simulate(t){t.at(100,()=>t.click(`Lưu nháp`)),t.at(250,()=>t.click(`Lưu nháp`)),t.at(400,()=>t.click(`Lưu nháp`))},check(t){let n=t.http(`/save`),e=n.filter(h=>h.status===`cancelled`).length;if(n.length<3)return s(`Chỉ có `+n.length+` request: có bản nháp bị bỏ qua.`);if(e)return s(e+` bản nháp bị huỷ giữa chừng.`);let i$2=p(n);return i$2>1?s(`Có `+i$2+` request chạy cùng lúc: thứ tự tới server không được đảm bảo.`):n.every(h=>h.status===`done`)?i():s(`Chưa đủ 3 bản nháp được lưu xong.`)}},{id:`upload`,group:`Giới hạn song song`,title:`Upload nhiều tệp, tối đa 2 cùng lúc: mergeMap(fn, 2)`,level:`Trung bình`,lv:2,waitMs:1500,desc:`<p><code>mergeMap</code> kh\xF4ng gi\u1EDBi h\u1EA1n s\u1EBD g\u1EEDi c\xF9ng l\xFAc m\u1ECDi request: 6 t\u1EC7p l\xE0 6 k\u1EBFt n\u1ED1i, 600 t\u1EC7p l\xE0 600 k\u1EBFt n\u1ED1i. Tham s\u1ED1 th\u1EE9 hai c\u1EE7a <code>mergeMap</code> gi\u1EDBi h\u1EA1n s\u1ED1 vi\u1EC7c ch\u1EA1y song song; c\xE1c vi\u1EC7c c\xF2n l\u1EA1i ch\u1EDD t\u1EDBi l\u01B0\u1EE3t.</p>
<p><b>Y\xEAu c\u1EA7u:</b> upload \u0111\u1EE7 6 t\u1EC7p, m\u1ED7i l\xFAc c\xF3 <b>\u0111\xFAng 2</b> request ch\u1EA1y song song (kh\xF4ng ph\u1EA3i 6, c\u0169ng kh\xF4ng ph\u1EA3i l\u1EA7n l\u01B0\u1EE3t t\u1EEBng c\xE1i).</p>`,starter:`const files = ['a.png', 'b.png', 'c.png', 'd.png', 'e.png', 'f.png'];

from(files).pipe(
  mergeMap((f) => fakeApi.get('/upload/' + f, { delay: 300, data: f + ' \u2713' })),
).subscribe(spy('uploaded'));
`,solution:`const files = ['a.png', 'b.png', 'c.png', 'd.png', 'e.png', 'f.png'];

from(files).pipe(
  mergeMap((f) => fakeApi.get('/upload/' + f, { delay: 300, data: f + ' \u2713' }), 2),
).subscribe(spy('uploaded'));
`,hint:`Thêm tham số thứ hai cho mergeMap: mergeMap((f) => …, 2).`,explain:`mergeMap(fn, 1) chính là concatMap. Con số phù hợp tuỳ server và loại việc; trình duyệt cũng tự giới hạn khoảng 6 kết nối HTTP/1.1 tới cùng một tên miền.`,check(t){let n=t.http(`/upload/`),e=p(n);return n.length!==6?s(`Có `+n.length+` request upload, cần 6.`):e>2?s(`Có `+e+` request chạy cùng lúc, chỉ được tối đa 2.`):e<2?s(`Các tệp đang upload lần lượt từng cái: cho phép 2 cái chạy song song.`):t.values(`uploaded`).length===6?i():s(`Chưa nhận đủ 6 kết quả upload.`)}},{id:`xoa-nhieu`,group:`Giới hạn song song`,title:`Xoá nhiều dòng khác nhau: không được huỷ, không được bỏ`,level:`Khó`,lv:3,waitMs:1300,desc:`<p>M\u1ED7i l\u1EA7n b\u1EA5m <b>Xo\xE1</b> \u1EDF \u0111\xE2y l\xE0 m\u1ED9t vi\u1EC7c <b>kh\xE1c nhau</b> (xo\xE1 d\xF2ng A, B, C), kh\xF4ng ph\u1EA3i b\u1EA5m l\u1EB7p c\xF9ng m\u1ED9t vi\u1EC7c. <code>switchMap</code> hu\u1EF7 l\u1EC7nh xo\xE1 tr\u01B0\u1EDBc, <code>exhaustMap</code> b\u1ECF qua l\u1EC7nh xo\xE1 sau: c\u1EA3 hai \u0111\u1EC1u l\xE0m m\u1EA5t thao t\xE1c c\u1EE7a ng\u01B0\u1EDDi d\xF9ng. C\xE1c l\u1EC7nh xo\xE1 \u0111\u1ED9c l\u1EADp v\u1EDBi nhau n\xEAn ch\u1EA1y song song \u0111\u01B0\u1EE3c.</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang b\u1EA5m <b>Xo\xE1 A</b>, <b>Xo\xE1 B</b>, <b>Xo\xE1 C</b> c\xE1ch nhau 100ms. C\u1EA3 3 l\u1EC7nh xo\xE1 \u0111\u1EC1u xong (kh\xF4ng l\u1EC7nh n\xE0o b\u1ECB hu\u1EF7) v\xE0 danh s\xE1ch c\xF2n l\u1EA1i tr\u1ED1ng.</p>`,starter:`const items = signal(['A', 'B', 'C']);
ui.text('C\xF2n l\u1EA1i', items);

const delete$ = merge(
  ui.button('Xo\xE1 A').pipe(map(() => 'A')),
  ui.button('Xo\xE1 B').pipe(map(() => 'B')),
  ui.button('Xo\xE1 C').pipe(map(() => 'C')),
);

delete$.pipe(
  switchMap((id) => fakeApi.get('/items/' + id + '/delete', { delay: 400, data: id })),
  takeUntilDestroyed(),
).subscribe((id) => {
  items.update((list) => list.filter((x) => x !== id));
  log('\u0110\xE3 xo\xE1', id);
});
`,solution:`const items = signal(['A', 'B', 'C']);
ui.text('C\xF2n l\u1EA1i', items);

const delete$ = merge(
  ui.button('Xo\xE1 A').pipe(map(() => 'A')),
  ui.button('Xo\xE1 B').pipe(map(() => 'B')),
  ui.button('Xo\xE1 C').pipe(map(() => 'C')),
);

delete$.pipe(
  mergeMap((id) => fakeApi.get('/items/' + id + '/delete', { delay: 400, data: id })),
  takeUntilDestroyed(),
).subscribe((id) => {
  items.update((list) => list.filter((x) => x !== id));
  log('\u0110\xE3 xo\xE1', id);
});
`,hint:`Đổi switchMap thành mergeMap (concatMap cũng đạt, chỉ chậm hơn).`,explain:`Nếu bấm lặp cùng một dòng thì nên chặn ở UI (disable nút của dòng đang xoá), hoặc dùng groupBy theo id rồi exhaustMap trong từng nhóm.`,simulate(t){t.at(100,()=>t.click(`Xoá A`)),t.at(200,()=>t.click(`Xoá B`)),t.at(300,()=>t.click(`Xoá C`))},check(t){let n=t.http(`/items/`),e=n.filter(h=>h.status===`cancelled`).length;if(e)return s(e+` lệnh xoá bị huỷ giữa chừng: người dùng bấm xoá mà dòng vẫn còn.`);if(n.length<3)return s(`Chỉ có `+n.length+` lệnh xoá được gửi: các lần bấm khác bị bỏ qua.`);let i$3=t.logs.filter(h=>h.startsWith(`Đã xoá`)).length;return i$3===3?i():s(`Mới xoá xong `+i$3+`/3 dòng.`)}}],cheatsheet:[[`Chỉ cần kết quả mới nhất (đọc)`,`<code>switchMap</code>`],[`Đúng thứ tự, không bỏ`,`<code>concatMap</code>`],[`Bỏ qua khi đang bận (ghi)`,`<code>exhaustMap</code>`],[`Song song, độc lập`,`<code>mergeMap</code>, giới hạn: <code>mergeMap(fn, 2)</code>`],[`Không bao giờ`,`<code>subscribe</code> lồng trong <code>subscribe</code>`]]};export{r as LAB};