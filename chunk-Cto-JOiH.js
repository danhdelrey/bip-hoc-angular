import{a as s,i as o,r as i,t as c}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var d={title:`RxJS + Signal Lab`,subtitle:`bài viết code thật, chạy ngay trong trang và được chấm tự động. Bao quát các tình huống hay gặp: state trong service, ô tìm kiếm, gọi HTTP (lỗi, retry, song song, cache, polling), chống bấm liên tục, tải thêm, dọn subscription.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Vi\u1EBFt b\u1EA5t c\u1EE9 th\u1EE9 g\xEC \u0111\u1EC3 th\u1EED. M\u1ECDi h\xE0m c\u1EE7a RxJS (<code>of</code>, <code>map</code>, <code>switchMap</code>\u2026) v\xE0 signal (<code>signal</code>, <code>computed</code>, <code>effect</code>, <code>toSignal</code>, <code>rxResource</code>\u2026) \u0111\u1EC1u c\xF3 s\u1EB5n, <b>kh\xF4ng c\u1EA7n import</b> (c\xF3 vi\u1EBFt import th\xEC trang c\u0169ng t\u1EF1 b\u1ECF qua). Vi\u1EBFt JS hay TypeScript \u0111\u1EC1u \u0111\u01B0\u1EE3c.</p>
<p><code>signal</code>, <code>effect</code>, <code>toSignal</code>, <code>rxResource</code>\u2026 \u1EDF \u0111\xE2y l\xE0 <b>API th\u1EADt c\u1EE7a Angular 22</b>. Code ch\u1EA1y gi\u1ED1ng nh\u01B0 b\xEAn trong <b>constructor c\u1EE7a m\u1ED9t component</b> (c\xF3 injection context), v\xE0 n\xFAt <b>D\u1EEBng</b> t\u01B0\u01A1ng \u0111\u01B0\u01A1ng component b\u1ECB destroy.</p>
<div class="tip">C\xE1c helper ch\u1EC9 c\xF3 trong lab n\xE0y: <code>spy('t\xEAn')</code> (observer ghi ra Console + Timeline), <code>watch('t\xEAn', signal)</code>, <code>ui.input/button/text/list</code>, <code>fakeApi.*</code>, <code>sleep(ms)</code>. Danh s\xE1ch \u0111\u1EA7y \u0111\u1EE7 \u1EDF m\u1EE5c <b>API c\xF3 s\u1EB5n</b> b\xEAn d\u01B0\u1EDBi.</div>`,starter:`// \u{1F3AE} S\xE2n ch\u01A1i \u2014 Ctrl+Enter \u0111\u1EC3 ch\u1EA1y

const count = signal(0, { debugName: 'count' });
const double = computed(() => count() * 2, { debugName: 'double' });

ui.text('count', count);
ui.text('double', double);
ui.button('+1', () => count.update(c => c + 1));
ui.button('Reset', () => count.set(0));

watch('double', double);

interval(500).pipe(
  take(4),
  map(i => i * 10),
).subscribe(spy('interval'));
`},{id:`observable`,group:`RxJS cơ bản`,title:`Observable & 3 loại thông báo`,level:`Dễ`,lv:1,waitMs:700,desc:`<p>Observable g\u1EEDi cho subscriber 3 lo\u1EA1i th\xF4ng b\xE1o: <code>next(value)</code>, <code>error(err)</code>, <code>complete()</code>. Sau <code>error</code> ho\u1EB7c <code>complete</code> th\xEC stream k\u1EBFt th\xFAc, kh\xF4ng ph\xE1t g\xEC th\xEAm.</p>
<p><b>Y\xEAu c\u1EA7u:</b> t\u1EA1o m\u1ED9t Observable ph\xE1t <code>'A'</code> ngay l\u1EADp t\u1EE9c, <b>sau 300ms</b> ph\xE1t <code>'B'</code> r\u1ED3i <code>complete()</code>. Subscribe b\u1EB1ng <code>spy('src')</code>.</p>
<div class="tip"><code>spy(label)</code> tr\u1EA3 v\u1EC1 m\u1ED9t observer <code>{ next, error, complete }</code>, n\xEAn <code>subscribe(spy('src'))</code> c\u0169ng gi\u1ED1ng nh\u01B0 t\u1EF1 vi\u1EBFt c\u1EA3 3 callback.</div>`,starter:`const src$ = new Observable(subscriber => {
  subscriber.next('A');
  // TODO: sau 300ms ph\xE1t 'B' r\u1ED3i complete
});

src$.subscribe(spy('src'));
`,solution:`const src$ = new Observable(subscriber => {
  subscriber.next('A');

  const id = setTimeout(() => {
    subscriber.next('B');
    subscriber.complete();
  }, 300);

  // teardown: ch\u1EA1y khi unsubscribe ho\u1EB7c khi stream k\u1EBFt th\xFAc
  return () => clearTimeout(id);
});

src$.subscribe(spy('src'));
`,hint:`Gọi setTimeout bên trong hàm subscribe. Nhớ return một hàm teardown để clearTimeout khi bị unsubscribe sớm.`,explain:`Hàm truyền vào new Observable chỉ chạy khi có người subscribe (lazy), và mỗi subscriber có một lần chạy riêng. Hàm được return là teardown, nơi dọn timer hoặc listener.`,check(e){let t=e.events(`src`);if(!t.length)return s(`Lane "src" ch\u01B0a c\xF3 s\u1EF1 ki\u1EC7n n\xE0o. B\u1EA1n \u0111\xE3 g\u1ECDi subscribe(spy('src')) ch\u01B0a?`);let i$1=e.values(`src`);if(!o(i$1,[`A`,`B`]))return s(`Nhận được `+c(i$1)+`, cần ["A", "B"].`);if(t[t.length-1].type!==`complete`)return s(`Đã có A và B nhưng stream chưa complete().`);let c$1=t.find(a=>a.value===`B`)?.t??0;return c$1<250?s(`"B" được phát lúc `+c$1+`ms, cần khoảng 300ms.`):i()}},{id:`operators`,group:`RxJS cơ bản`,title:`pipe() với filter & map`,level:`Dễ`,lv:1,waitMs:300,desc:`<p>To\xE1n t\u1EED (operator) l\xE0 h\xE0m nh\u1EADn m\u1ED9t Observable v\xE0 tr\u1EA3 v\u1EC1 Observable m\u1EDBi. <code>pipe()</code> n\u1ED1i c\xE1c to\xE1n t\u1EED theo th\u1EE9 t\u1EF1, gi\u1ED1ng m\u1ED9t d\xE2y chuy\u1EC1n.</p>
<p><b>Y\xEAu c\u1EA7u:</b> t\u1EEB <code>range(1, 10)</code>, ch\u1EC9 gi\u1EEF <b>s\u1ED1 ch\u1EB5n</b> r\u1ED3i <b>nh\xE2n 10</b>. K\u1EBFt qu\u1EA3 mong \u0111\u1EE3i \u1EDF lane <code>kq</code>: <code>20, 40, 60, 80, 100</code> r\u1ED3i complete.</p>`,starter:`range(1, 10).pipe(
  // TODO: ch\u1EC9 gi\u1EEF s\u1ED1 ch\u1EB5n, r\u1ED3i nh\xE2n m\u1ED7i s\u1ED1 v\u1EDBi 10
).subscribe(spy('kq'));
`,solution:`range(1, 10).pipe(
  filter(n => n % 2 === 0),
  map(n => n * 10),
).subscribe(spy('kq'));
`,hint:`filter(n => n % 2 === 0) rồi map(n => n * 10). Thứ tự trong pipe có ý nghĩa.`,explain:`Thứ tự trong pipe quan trọng: map trước rồi filter sau sẽ cho kết quả khác. Mỗi toán tử tạo ra một Observable mới, không sửa Observable gốc.`,check(e){let t=e.values(`kq`);return o(t,[20,40,60,80,100])?e.last(`kq`).type!==`complete`?s(`Thiếu complete ở cuối.`):i():s(`Nhận được `+c(t)+`, cần [20, 40, 60, 80, 100].`)}},{id:`subject`,group:`RxJS cơ bản`,title:`Subject vs BehaviorSubject`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Trong service, ta hay gi\u1EEF state b\u1EB1ng Subject. Kh\xE1c bi\u1EC7t quan tr\u1ECDng l\xE0 chuy\u1EC7n g\xEC x\u1EA3y ra v\u1EDBi <b>ng\u01B0\u1EDDi subscribe mu\u1ED9n</b>:</p>
<table><tr><th>Lo\u1EA1i</th><th>Subscriber \u0111\u1EBFn mu\u1ED9n nh\u1EADn \u0111\u01B0\u1EE3c</th></tr>
<tr><td><code>Subject</code></td><td>Kh\xF4ng nh\u1EADn g\xEC, ch\u1EC9 nh\u1EADn c\xE1c gi\xE1 tr\u1ECB ph\xE1t <i>sau</i> khi subscribe</td></tr>
<tr><td><code>BehaviorSubject(init)</code></td><td>Gi\xE1 tr\u1ECB hi\u1EC7n t\u1EA1i ngay l\u1EADp t\u1EE9c (b\u1EAFt bu\u1ED9c c\xF3 gi\xE1 tr\u1ECB ban \u0111\u1EA7u)</td></tr>
<tr><td><code>ReplaySubject(n)</code></td><td>n gi\xE1 tr\u1ECB g\u1EA7n nh\u1EA5t</td></tr></table>
<p><b>Y\xEAu c\u1EA7u:</b> s\u1EEDa <code>state$</code> \u0111\u1EC3 c\xF3 gi\xE1 tr\u1ECB ban \u0111\u1EA7u <code>'idle'</code> v\xE0 subscriber <b>B</b> (v\xE0o l\xFAc 200ms) nh\u1EADn ngay tr\u1EA1ng th\xE1i hi\u1EC7n t\u1EA1i <code>'loading'</code>. Mong \u0111\u1EE3i: A = <code>idle, loading, done</code>; B = <code>loading, done</code>.</p>`,starter:`// state c\u1EE7a m\u1ED9t service
const state$ = new Subject();          // \u2757 \u0111\u1ED5i sang lo\u1EA1i Subject ph\xF9 h\u1EE3p

state$.subscribe(spy('A'));            // A subscribe ngay t\u1EEB \u0111\u1EA7u

setTimeout(() => state$.next('loading'), 100);

setTimeout(() => {
  state$.subscribe(spy('B'));          // B subscribe mu\u1ED9n (200ms)
}, 200);

setTimeout(() => state$.next('done'), 300);
`,solution:`const state$ = new BehaviorSubject('idle');

state$.subscribe(spy('A'));

setTimeout(() => state$.next('loading'), 100);

setTimeout(() => {
  state$.subscribe(spy('B'));          // nh\u1EADn ngay 'loading'
}, 200);

setTimeout(() => state$.next('done'), 300);

// Trong Angular hi\u1EC7n \u0111\u1EA1i, state ki\u1EC3u n\xE0y th\u01B0\u1EDDng d\xF9ng signal:
//   const state = signal('idle');  \u2192 \u0111\u1ECDc state() l\xFAc n\xE0o c\u0169ng c\xF3 gi\xE1 tr\u1ECB
`,hint:`BehaviorSubject cần một giá trị khởi tạo và luôn phát giá trị hiện tại cho subscriber mới.`,explain:`BehaviorSubject luôn có giá trị hiện tại (.value), nên hợp để làm state. Signal cũng có đặc điểm này, vì vậy signal thường thay được BehaviorSubject trong service.`,check(e){let t=e.values(`A`),i$2=e.values(`B`);return o(t,[`idle`,`loading`,`done`])&&o(i$2,[`loading`,`done`])?i():!i$2.length||i$2[0]!==`loading`?s(`B nhận được `+c(i$2)+`. Subscriber vào muộn cần nhận ngay giá trị hiện tại "loading".`):t[0]!==`idle`?s(`A nhận được `+c(t)+`. Cần có giá trị ban đầu "idle".`):s(`A = `+c(t)+`, B = `+c(i$2)+`.`)}},{id:`signal-co-ban`,group:`Signal cơ bản`,title:`signal, computed, effect`,level:`Dễ`,lv:1,waitMs:400,desc:`<ul><li><code>signal(v)</code>: state ghi \u0111\u01B0\u1EE3c b\u1EB1ng <code>.set()</code> / <code>.update()</code></li>
<li><code>computed(fn)</code>: gi\xE1 tr\u1ECB suy ra, lazy v\xE0 c\xF3 cache, ch\u1EC9 t\xEDnh l\u1EA1i khi ph\u1EE5 thu\u1ED9c \u0111\u1ED5i</li>
<li><code>effect(fn)</code>: side effect, t\u1EF1 ch\u1EA1y l\u1EA1i khi signal n\xF3 \u0111\u1ECDc thay \u0111\u1ED5i</li></ul>
<p><b>Y\xEAu c\u1EA7u:</b> (1) t\u1EA1o <code>double = computed(...)</code>; (2) t\u1EA1o effect ghi <code>double</code> b\u1EB1ng <code>watch('double', double)</code>; (3) set <code>count</code> = 1, 2, 3 <b>li\u1EC1n nhau</b>; (4) sau <code>await sleep(100)</code> set <code>count</code> = 5.</p>
<p>\u{1F914} <b>Tr\u01B0\u1EDBc khi b\u1EA5m Ki\u1EC3m tra, h\xE3y \u0111o\xE1n xem lane "double" s\u1EBD c\xF3 nh\u1EEFng gi\xE1 tr\u1ECB n\xE0o.</b></p>`,starter:`const count = signal(0, { debugName: 'count' });

// TODO 1: computed double = count * 2

// TODO 2: watch('double', double)   (watch = effect ghi gi\xE1 tr\u1ECB ra timeline)

// TODO 3: set count = 1, 2, 3 li\u1EC1n nhau

await sleep(100);
// TODO 4: set count = 5
`,solution:`const count = signal(0, { debugName: 'count' });
const double = computed(() => count() * 2, { debugName: 'double' });

watch('double', double);
// watch(...) t\u01B0\u01A1ng \u0111\u01B0\u01A1ng:
// effect(() => spy('double').next(double()));

count.set(1);
count.set(2);
count.set(3);

await sleep(100);
count.set(5);
`,hint:`Effect không chạy ngay khi tạo hay ngay khi signal đổi, mà được lên lịch chạy sau. Lane đúng chỉ có 2 giá trị.`,explain:`Kết quả là [6, 10] chứ không phải [0, 2, 4, 6, 10]. Effect được lên lịch và chạy sau khi code đồng bộ xong (trong Angular là lúc change detection), nên 3 lần set liền nhau chỉ để lại giá trị cuối. Signal là state, không phải dòng sự kiện như Subject.next().`,check(e){let t=e.values(`double`);return t.length?o(t,[6,10])?i():t[0]===0?s(`Nhận được `+c(t)+`. Có vẻ bạn đã await giữa lúc tạo effect và lúc set 1, 2, 3. Hãy set liền nhau.`):s(`Nhận được `+c(t)+`, mong đợi [6, 10].`):s(`Lane "double" tr\u1ED1ng. B\u1EA1n \u0111\xE3 watch('double', double) ch\u01B0a?`)}},{id:`update`,group:`Signal cơ bản`,title:`update() và dữ liệu bất biến`,level:`Dễ`,lv:1,waitMs:400,desc:`<p>Signal so s\xE1nh gi\xE1 tr\u1ECB m\u1EDBi v\u1EDBi gi\xE1 tr\u1ECB c\u0169 b\u1EB1ng <code>Object.is</code>. N\u1EBFu b\u1EA1n <b>s\u1EEDa tr\u1EF1c ti\u1EBFp</b> m\u1EA3ng/object c\u0169 r\u1ED3i tr\u1EA3 l\u1EA1i ch\xEDnh n\xF3, signal cho l\xE0 "kh\xF4ng c\xF3 g\xEC thay \u0111\u1ED5i" v\xE0 UI kh\xF4ng c\u1EADp nh\u1EADt. \u0110\xE2y l\xE0 l\u1ED7i r\u1EA5t hay g\u1EB7p.</p>
<p><b>Y\xEAu c\u1EA7u:</b> t\u1EA1o <code>remaining</code> (s\u1ED1 todo ch\u01B0a xong) v\xE0 vi\u1EBFt <code>toggle(id)</code> d\xF9ng <code>todos.update()</code> tr\u1EA3 v\u1EC1 <b>m\u1EA3ng m\u1EDBi</b>. Lane <code>remaining</code> ph\u1EA3i l\xE0 <code>2 \u2192 1</code>.</p>`,starter:`const todos = signal([
  { id: 1, title: 'H\u1ECDc signal', done: true },
  { id: 2, title: 'H\u1ECDc RxJS', done: false },
  { id: 3, title: 'L\xE0m b\xE0i t\u1EADp', done: false },
], { debugName: 'todos' });

// TODO 1: computed remaining = s\u1ED1 todo ch\u01B0a xong
const remaining = computed(() => 0);

function toggle(id) {
  // TODO 2: d\xF9ng todos.update(list => ...) v\xE0 tr\u1EA3 v\u1EC1 M\u1EA2NG M\u1EDAI
}

ui.list(() => todos().map(t => (t.done ? '\u2705 ' : '\u2B1C ') + t.title));
ui.text('C\xF2n l\u1EA1i', remaining);
ui.button('Toggle #2', () => toggle(2));
watch('remaining', remaining);

await sleep(100);
toggle(2);
`,solution:`const todos = signal([
  { id: 1, title: 'H\u1ECDc signal', done: true },
  { id: 2, title: 'H\u1ECDc RxJS', done: false },
  { id: 3, title: 'L\xE0m b\xE0i t\u1EADp', done: false },
], { debugName: 'todos' });

const remaining = computed(() => todos().filter(t => !t.done).length, { debugName: 'remaining' });

function toggle(id) {
  todos.update(list =>
    list.map(t => t.id === id ? { ...t, done: !t.done } : t)
  );
}

ui.list(() => todos().map(t => (t.done ? '\u2705 ' : '\u2B1C ') + t.title));
ui.text('C\xF2n l\u1EA1i', remaining);
ui.button('Toggle #2', () => toggle(2));
watch('remaining', remaining);

await sleep(100);
toggle(2);
`,hint:`list.map(t => t.id === id ? { ...t, done: !t.done } : t) tạo mảng mới và object mới cho phần tử thay đổi.`,explain:`Luôn tạo tham chiếu mới khi đổi mảng/object: spread, map, filter. Nếu sửa tại chỗ (t.done = true) rồi return list, Object.is(old, new) là true nên signal bỏ qua thay đổi.`,check(e){let t=e.values(`remaining`);return o(t,[2,1])?i():o(t,[2])?s(`remaining không đổi sau toggle(2). Có thể bạn đã sửa trực tiếp mảng/object cũ rồi return lại chính nó, nên signal không thấy thay đổi.`):t[0]!==2?s(`Giá trị đầu của remaining là `+c(t[0])+`, cần 2 (có 2 todo chưa xong).`):s(`Nhận được `+c(t)+`, mong đợi [2, 1].`)}},{id:`untracked`,group:`Signal cơ bản`,title:`untracked(): đọc mà không theo dõi`,level:`Trung bình`,lv:2,waitMs:450,desc:`<p>Effect t\u1EF1 theo d\xF5i <b>m\u1ECDi</b> signal \u0111\u01B0\u1EE3c \u0111\u1ECDc b\xEAn trong n\xF3. \u0110\xF4i khi b\u1EA1n ch\u1EC9 mu\u1ED1n ch\u1EA1y l\u1EA1i khi m\u1ED9t signal \u0111\u1ED5i, c\xF2n signal kh\xE1c ch\u1EC9 c\u1EA7n \u0111\u1ECDc gi\xE1 tr\u1ECB hi\u1EC7n t\u1EA1i (v\xED d\u1EE5 \u0111\u1EC3 ghi log ho\u1EB7c \u0111\xEDnh k\xE8m).</p>
<p><b>Y\xEAu c\u1EA7u:</b> effect "t\u1EA3i d\u1EEF li\u1EC7u" ch\u1EC9 \u0111\u01B0\u1EE3c ch\u1EA1y l\u1EA1i khi <code>userId</code> \u0111\u1ED5i. \u0110\u1ED5i <code>theme</code> kh\xF4ng \u0111\u01B0\u1EE3c l\xE0m effect ch\u1EA1y l\u1EA1i, nh\u01B0ng log v\u1EABn ph\u1EA3i ghi theme m\u1EDBi nh\u1EA5t. Lane <code>load</code> ph\u1EA3i c\xF3 \u0111\xFAng 2 d\xF2ng.</p>`,starter:`const userId = signal(1, { debugName: 'userId' });
const theme = signal('light', { debugName: 'theme' });

effect(() => {
  spy('load').next('T\u1EA3i d\u1EEF li\u1EC7u user ' + userId() + ' (theme: ' + theme() + ')');
});

await sleep(100);
theme.set('dark');      // \u2757 kh\xF4ng \u0111\u01B0\u1EE3c l\xE0m effect ch\u1EA1y l\u1EA1i

await sleep(100);
userId.set(2);          // \u2705 effect ph\u1EA3i ch\u1EA1y l\u1EA1i
`,solution:`const userId = signal(1, { debugName: 'userId' });
const theme = signal('light', { debugName: 'theme' });

effect(() => {
  const id = userId();                         // theo d\xF5i
  const t = untracked(() => theme());          // ch\u1EC9 \u0111\u1ECDc, kh\xF4ng theo d\xF5i
  spy('load').next('T\u1EA3i d\u1EEF li\u1EC7u user ' + id + ' (theme: ' + t + ')');
});

await sleep(100);
theme.set('dark');

await sleep(100);
userId.set(2);
`,hint:`Bọc phần đọc theme trong untracked(() => theme()).`,explain:`untracked() dùng nhiều khi effect gọi hàm của service mà hàm đó lại đọc signal khác. Không bọc untracked thì effect sẽ chạy lại ngoài ý muốn.`,check(e){let t=e.values(`load`);return t.length===3?s(`Effect chạy 3 lần: đổi theme cũng làm nó chạy lại. Hãy dùng untracked().`):t.length!==2?s(`Lane "load" có `+t.length+` dòng, cần đúng 2.`):!/user 2/.test(String(t[1]))||!/dark/.test(String(t[1]))?s(`Dòng thứ 2 cần chứa "user 2" và theme mới nhất "dark". Hiện tại: `+c(t[1])):i()}},{id:`linked-signal`,group:`Signal cơ bản`,title:`linkedSignal(): state phụ thuộc nhưng sửa được`,level:`Trung bình`,lv:2,waitMs:450,desc:`<p>T\xECnh hu\u1ED1ng th\u01B0\u1EDDng g\u1EB7p: dropdown <b>s\u1EA3n ph\u1EA9m</b> ph\u1EE5 thu\u1ED9c v\xE0o <b>danh m\u1EE5c</b>. Khi \u0111\u1ED5i danh m\u1EE5c, s\u1EA3n ph\u1EA9m \u0111ang ch\u1ECDn ph\u1EA3i t\u1EF1 v\u1EC1 m\xF3n \u0111\u1EA7u ti\xEAn, nh\u01B0ng ng\u01B0\u1EDDi d\xF9ng v\u1EABn ch\u1ECDn tay \u0111\u01B0\u1EE3c.</p>
<ul><li><code>computed</code>: t\u1EF1 reset \u0111\u01B0\u1EE3c nh\u01B0ng kh\xF4ng <code>set()</code> \u0111\u01B0\u1EE3c</li>
<li><code>signal</code>: <code>set()</code> \u0111\u01B0\u1EE3c nh\u01B0ng kh\xF4ng t\u1EF1 reset</li>
<li><code>linkedSignal</code>: l\xE0m \u0111\u01B0\u1EE3c c\u1EA3 hai</li></ul>
<p><b>Y\xEAu c\u1EA7u:</b> lane <code>selected</code> ph\u1EA3i l\xE0 <code>apple \u2192 banana \u2192 carrot</code>.</p>`,starter:`const MENU = { fruit: ['apple', 'banana', 'mango'], veg: ['carrot', 'onion'] };

const category = signal('fruit', { debugName: 'category' });
const products = computed(() => MENU[category()]);

// \u2757 Khi \u0111\u1ED5i category, selected ph\u1EA3i t\u1EF1 v\u1EC1 s\u1EA3n ph\u1EA9m \u0111\u1EA7u ti\xEAn
const selected = signal(products()[0], { debugName: 'selected' });

ui.text('Danh m\u1EE5c', category);
ui.text('\u0110ang ch\u1ECDn', selected);
watch('selected', selected);

await sleep(100);
selected.set('banana');      // ng\u01B0\u1EDDi d\xF9ng ch\u1ECDn tay

await sleep(100);
category.set('veg');         // \u2192 selected ph\u1EA3i th\xE0nh 'carrot'
`,solution:`const MENU = { fruit: ['apple', 'banana', 'mango'], veg: ['carrot', 'onion'] };

const category = signal('fruit', { debugName: 'category' });
const products = computed(() => MENU[category()]);

const selected = linkedSignal(() => products()[0], { debugName: 'selected' });

// D\u1EA1ng \u0111\u1EA7y \u0111\u1EE7 \u2014 gi\u1EEF l\u1EF1a ch\u1ECDn c\u0169 n\u1EBFu n\xF3 v\u1EABn c\xF2n trong danh s\xE1ch m\u1EDBi:
// const selected = linkedSignal({
//   source: products,
//   computation: (list, prev) => prev && list.includes(prev.value) ? prev.value : list[0],
// });

ui.text('Danh m\u1EE5c', category);
ui.text('\u0110ang ch\u1ECDn', selected);
watch('selected', selected);

await sleep(100);
selected.set('banana');

await sleep(100);
category.set('veg');
`,hint:`linkedSignal(() => products()[0]): tính lại mỗi khi products đổi, và vẫn có .set().`,explain:`linkedSignal hợp cho các trường hợp: lựa chọn mặc định theo danh sách, form được khởi tạo từ dữ liệu server nhưng người dùng sửa được, trang hiện tại reset về 1 khi đổi bộ lọc.`,check(e){let t=e.values(`selected`);return o(t,[`apple`,`banana`,`carrot`])?i():o(t,[`apple`,`banana`])?s(`Đổi category nhưng selected vẫn là "banana". signal thường không tự reset theo nguồn.`):e.errors.length?s(`Có lỗi: `+e.errMsg()+`. computed không có .set().`):s(`Nhận được `+c(t)+`, mong đợi ["apple", "banana", "carrot"].`)}},{id:`to-signal`,group:`Cầu nối RxJS ↔ Signal`,title:`toSignal(): Observable thành Signal`,level:`Dễ`,lv:1,waitMs:1400,desc:`<p><code>toSignal(obs$)</code> subscribe ngay khi \u0111\u01B0\u1EE3c t\u1EA1o v\xE0 t\u1EF1 unsubscribe khi component destroy, n\xEAn kh\xF4ng c\u1EA7n <code>async</code> pipe hay <code>ngOnDestroy</code>. Hay d\xF9ng cho route params, d\u1EEF li\u1EC7u t\u1EEB store, ho\u1EB7c stream d\u1EA1ng <code>valueChanges</code>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> chuy\u1EC3n <code>ticks$</code> th\xE0nh signal <code>tick</code> v\u1EDBi <b>gi\xE1 tr\u1ECB ban \u0111\u1EA7u 0</b>. Lane <code>tick</code> mong \u0111\u1EE3i: <code>0, 1, 2, 3, 4, 5</code>.</p>`,starter:`const ticks$ = interval(200).pipe(take(5), map(i => i + 1));

// TODO: chuy\u1EC3n ticks$ th\xE0nh signal v\u1EDBi gi\xE1 tr\u1ECB ban \u0111\u1EA7u 0
const tick = signal(0);

ui.text('tick', tick);
watch('tick', tick);
`,solution:`const ticks$ = interval(200).pipe(take(5), map(i => i + 1));

const tick = toSignal(ticks$, { initialValue: 0, debugName: 'tick' });

ui.text('tick', tick);
watch('tick', tick);
`,hint:`toSignal(ticks$, { initialValue: 0 }). Không có initialValue thì giá trị đầu là undefined.`,explain:`Không có initialValue thì kiểu là T | undefined. Với BehaviorSubject (luôn phát đồng bộ) có thể dùng { requireSync: true } để có kiểu T. Lưu ý: trong component thật chỉ gọi toSignal ở field hoặc constructor (injection context), hoặc phải truyền { injector }. Lab tự truyền injector nên gọi sau await vẫn chạy.`,check(e){let t=e.values(`tick`);return o(t,[0,1,2,3,4,5])?i():o(t,[0])?s(`tick đứng yên ở 0, chưa nối với ticks$.`):t[0]===void 0?s(`Giá trị đầu là undefined. Thêm { initialValue: 0 }.`):s(`Nhận được `+c(t)+`, mong đợi [0, 1, 2, 3, 4, 5].`)}},{id:`computed-vs-combine`,group:`Cầu nối RxJS ↔ Signal`,title:`computed thay cho combineLatest`,level:`Trung bình`,lv:2,waitMs:400,desc:`<p>Khi gom nhi\u1EC1u ngu\u1ED3n state, <code>combineLatest</code> ph\xE1t l\u1EA1i <b>m\u1ED7i khi m\u1ED9t ngu\u1ED3n \u0111\u1ED5i</b>. \u0110\u1ED5i 2 ngu\u1ED3n li\u1EC1n nhau s\u1EBD sinh ra m\u1ED9t gi\xE1 tr\u1ECB trung gian sai, g\u1ECDi l\xE0 <i>glitch</i> (v\xED d\u1EE5 gi\xE1 m\u1EDBi nh\xE2n s\u1ED1 l\u01B0\u1EE3ng c\u0169).</p>
<p><b>Y\xEAu c\u1EA7u:</b> ch\u1EA1y th\u1EED code RxJS b\xEAn d\u01B0\u1EDBi v\xE0 \u0111\u1EC3 \xFD gi\xE1 tr\u1ECB <code>240</code>. Sau \u0111\xF3 vi\u1EBFt l\u1EA1i b\u1EB1ng <code>signal</code> + <code>computed</code> \u0111\u1EC3 lane <code>total</code> ch\u1EC9 c\xF2n <code>200 \u2192 360</code>.</p>`,starter:`const price$ = new BehaviorSubject(100);
const qty$ = new BehaviorSubject(2);

combineLatest([price$, qty$]).pipe(
  map(([p, q]) => p * q),
).subscribe(spy('total'));

await sleep(100);
price$.next(120);
qty$.next(3);
`,solution:`const price = signal(100, { debugName: 'price' });
const qty = signal(2, { debugName: 'qty' });
const total = computed(() => price() * qty(), { debugName: 'total' });

watch('total', total);

await sleep(100);
price.set(120);
qty.set(3);
`,hint:`price = signal(100), qty = signal(2), total = computed(() => price() * qty()), rồi watch('total', total).`,explain:`Signal không bị glitch: computed chỉ được tính lại khi có người đọc, lúc đó mọi nguồn đã cập nhật xong. Với state đồng bộ, computed vừa gọn vừa đúng hơn combineLatest. RxJS vẫn cần cho phần bất đồng bộ.`,check(e){let t=e.values(`total`);return o(t,[200,360])?i():o(t,[200,240,360])?s(`Vẫn còn glitch 240 (giá mới × số lượng cũ). Hãy chuyển sang signal + computed.`):s(`Nhận được `+c(t)+`, mong đợi [200, 360].`)}},{id:`tim-kiem`,group:`Cầu nối RxJS ↔ Signal`,title:`Ô tìm kiếm: debounce + switchMap`,level:`Trung bình`,lv:2,waitMs:2700,desc:`<p>\u0110\xE2y l\xE0 pattern kinh \u0111i\u1EC3n: input l\xE0 <b>signal</b>, nh\u01B0ng debounce v\xE0 hu\u1EF7 request c\u0169 l\xE0 vi\u1EC7c c\u1EE7a <b>RxJS</b>. Lu\u1ED3ng x\u1EED l\xFD:</p>
<p><code>signal \u2192 toObservable \u2192 debounceTime(300) \u2192 distinctUntilChanged \u2192 filter(\u2265 2 k\xFD t\u1EF1) \u2192 switchMap(fakeApi.search) \u2192 toSignal</code></p>
<p><b>Y\xEAu c\u1EA7u:</b> khi b\u1EA5m Ki\u1EC3m tra, trang s\u1EBD t\u1EF1 g\xF5 nhanh <code>b, ba, ban</code>, ngh\u1EC9 m\u1ED9t l\xFAc, r\u1ED3i g\xF5 <code>c, ch, che</code>. Ch\u1EC9 \u0111\u01B0\u1EE3c c\xF3 <b>\u0111\xFAng 2 request</b>: <code>ban</code> v\xE0 <code>che</code>.</p>`,starter:`const query = ui.input('G\xF5 t\xEAn tr\xE1i c\xE2y (vd: an, ch)...');

// TODO: bi\u1EBFn query th\xE0nh results b\u1EB1ng RxJS
const results = signal([]);   // \u2190 thay b\u1EB1ng toSignal(...)

ui.list(results);
watch('results', results);
`,solution:`const query = ui.input('G\xF5 t\xEAn tr\xE1i c\xE2y (vd: an, ch)...');

const results = toSignal(
  toObservable(query).pipe(
    debounceTime(300),
    map(q => q.trim()),
    distinctUntilChanged(),
    filter(q => q.length >= 2),
    switchMap(q => fakeApi.search(q).pipe(
      catchError(() => of([])),       // l\u1ED7i 1 request kh\xF4ng l\xE0m ch\u1EBFt \xF4 search
    )),
  ),
  { initialValue: [] }
);

ui.list(results);
watch('results', results);
`,hint:`toSignal(toObservable(query).pipe(debounceTime(300), distinctUntilChanged(), filter(q => q.length >= 2), switchMap(q => fakeApi.search(q))), { initialValue: [] })`,explain:`switchMap tự huỷ request cũ khi có từ khoá mới, nên tránh được race condition (kết quả cũ về sau ghi đè kết quả mới). Cách khác là truyền query đã debounce vào httpResource hoặc rxResource.`,simulate(e){e.at(0,()=>e.type(0,`b`)),e.at(80,()=>e.type(0,`ba`)),e.at(160,()=>e.type(0,`ban`)),e.at(1200,()=>e.type(0,`c`)),e.at(1260,()=>e.type(0,`ch`)),e.at(1320,()=>e.type(0,`che`))},check(e){let t=e.http(`/search`).map(i=>i.arg);return t.length?o(t,[`ban`,`che`])?(e.values(`results`).at(-1)??[]).includes(`cherry`)?i():s(`Request đúng nhưng results cuối không chứa "cherry". results đã lấy từ kết quả search chưa?`):t.length>2?s(`Có `+t.length+` request: `+c(t)+`. Thiếu debounceTime(300), hoặc thiếu filter ≥ 2 ký tự.`):s(`Các request: `+c(t)+`, mong đợi ["ban", "che"].`):s(`Không có request nào. Bạn đã gọi fakeApi.search(q) trong switchMap chưa?`)}},{id:`catch-error`,group:`Gọi HTTP thường ngày`,title:`catchError đúng chỗ`,level:`Trung bình`,lv:2,waitMs:2e3,desc:`<p><code>fakeApi.user(13)</code> lu\xF4n tr\u1EA3 l\u1ED7i 500. Khi m\u1ED9t request l\u1ED7i trong <code>switchMap</code>, l\u1ED7i lan ra stream ngo\xE0i v\xE0 <b>c\u1EA3 stream ch\u1EBFt</b>: c\xE1c l\u1EA7n \u0111\u1ED5i id sau kh\xF4ng c\xF2n t\u1EA3i g\xEC n\u1EEFa, v\xE0 signal t\u1EEB <code>toSignal</code> s\u1EBD <b>throw khi b\u1ECB \u0111\u1ECDc</b>.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi l\u1ED7i th\xEC hi\u1EC3n th\u1ECB user gi\u1EA3 <code>{ id, name: '(l\u1ED7i)' }</code>, v\xE0 stream ph\u1EA3i <b>s\u1ED1ng ti\u1EBFp</b> \u0111\u1EC3 id 2 v\u1EABn t\u1EA3i \u0111\u01B0\u1EE3c. Lane <code>user</code>: <code>\u2026, User 1, (l\u1ED7i), User 2</code>.</p>`,starter:`const userId = signal(1, { debugName: 'userId' });

const user = toSignal(
  toObservable(userId).pipe(
    switchMap(id => fakeApi.user(id)),
    // \u2757 id = 13 tr\u1EA3 l\u1ED7i 500 \u2192 c\u1EA3 stream ch\u1EBFt
  ),
  { initialValue: null }
);

ui.text('userId', userId);
ui.text('User', () => user()?.name ?? '\u0111ang t\u1EA3i\u2026');
watch('user', () => user()?.name ?? '\u2026');

await sleep(600);
userId.set(13);     // lu\xF4n l\u1ED7i
await sleep(600);
userId.set(2);      // v\u1EABn ph\u1EA3i t\u1EA3i \u0111\u01B0\u1EE3c
`,solution:`const userId = signal(1, { debugName: 'userId' });

const user = toSignal(
  toObservable(userId).pipe(
    switchMap(id => fakeApi.user(id).pipe(
      // \u2705 catchError \u1EDF B\xCAN TRONG switchMap: ch\u1EC9 request n\xE0y thay b\u1EB1ng fallback,
      //    stream ngo\xE0i v\u1EABn s\u1ED1ng
      catchError(err => of({ id, name: '(l\u1ED7i)' })),
    )),
  ),
  { initialValue: null }
);

ui.text('userId', userId);
ui.text('User', () => user()?.name ?? '\u0111ang t\u1EA3i\u2026');
watch('user', () => user()?.name ?? '\u2026');

await sleep(600);
userId.set(13);
await sleep(600);
userId.set(2);
`,hint:`Đặt catchError trong pipe của fakeApi.user(id), tức là bên trong switchMap, không đặt sau switchMap.`,explain:`catchError đặt ngoài switchMap thì stream ngoài bị thay bằng of(fallback) rồi complete, nên các lần đổi id sau bị bỏ qua. Đặt bên trong thì chỉ request lỗi bị thay. Trong thực tế có thể trả về giá trị fallback, hoặc set một signal error để hiển thị thông báo.`,check(e){let t=e.values(`user`),i$3=t[t.length-1];return e.errors.length?s(`Có lỗi chưa xử lý: `+e.errMsg()+`. Cần catchError.`):i$3===`User 2`&&t.includes(`(lỗi)`)?i():i$3===`(lỗi)`?s(`Đã hiện "(lỗi)" nhưng id 2 không tải được. catchError đang đặt ngoài switchMap nên stream đã complete.`):i$3===`User 2`?s(`Kh\xF4ng th\u1EA5y "(l\u1ED7i)" khi id = 13. Fallback c\u1EA7n c\xF3 name: '(l\u1ED7i)'.`):s(`Lane user: `+c(t)+`.`)}},{id:`fork-join`,group:`Gọi HTTP thường ngày`,title:`Gọi song song với forkJoin`,level:`Trung bình`,lv:2,waitMs:1300,desc:`<p>M\xE0n h\xECnh Dashboard c\u1EA7n <b>user</b> v\xE0 <b>danh s\xE1ch b\xE0i vi\u1EBFt</b>. Hai request kh\xF4ng ph\u1EE5 thu\u1ED9c nhau m\xE0 l\u1EA1i g\u1ECDi tu\u1EA7n t\u1EF1 (ch\u1EDD c\xE1i n\xE0y xong m\u1EDBi g\u1ECDi c\xE1i kia) th\xEC m\xE0n h\xECnh ch\u1EADm g\u1EA5p \u0111\xF4i.</p>
<table><tr><th>To\xE1n t\u1EED</th><th>Khi n\xE0o d\xF9ng</th></tr>
<tr><td><code>forkJoin</code></td><td>Ch\u1EA1y song song, ch\u1EDD <b>t\u1EA5t c\u1EA3 complete</b>, ph\xE1t 1 l\u1EA7n (h\u1EE3p v\u1EDBi HTTP)</td></tr>
<tr><td><code>combineLatest</code></td><td>Ph\xE1t m\u1ED7i khi m\u1ED9t ngu\u1ED3n \u0111\u1ED5i (h\u1EE3p v\u1EDBi stream s\u1ED1ng l\xE2u)</td></tr>
<tr><td><code>switchMap</code> l\u1ED3ng nhau</td><td>Khi request sau <b>c\u1EA7n k\u1EBFt qu\u1EA3</b> c\u1EE7a request tr\u01B0\u1EDBc</td></tr></table>
<p><b>Y\xEAu c\u1EA7u:</b> dashboard ph\u1EA3i c\xF3 d\u1EEF li\u1EC7u <b>tr\u01B0\u1EDBc 700ms</b> (hi\u1EC7n t\u1EA1i m\u1EA5t kho\u1EA3ng 900ms).</p>`,starter:`// \u2757 G\u1ECDi tu\u1EA7n t\u1EF1: ch\u1EDD user xong m\u1EDBi g\u1ECDi posts
const dashboard$ = fakeApi.user(1).pipe(
  switchMap(user => fakeApi.posts(1).pipe(
    map(posts => ({ user, posts })),
  )),
);

const dashboard = toSignal(dashboard$, { initialValue: null });

ui.text('User', () => dashboard()?.user.name ?? '\u0111ang t\u1EA3i\u2026');
ui.list(() => dashboard()?.posts.map(p => p.title) ?? []);
watch('dashboard', dashboard);
`,solution:`const dashboard$ = forkJoin({
  user: fakeApi.user(1),
  posts: fakeApi.posts(1),
});

const dashboard = toSignal(dashboard$, { initialValue: null });

ui.text('User', () => dashboard()?.user.name ?? '\u0111ang t\u1EA3i\u2026');
ui.list(() => dashboard()?.posts.map(p => p.title) ?? []);
watch('dashboard', dashboard);
`,hint:`forkJoin({ user: fakeApi.user(1), posts: fakeApi.posts(1) }) phát ra { user, posts }.`,explain:`Lưu ý: forkJoin chỉ phát khi mọi nguồn complete. Nếu một nguồn không bao giờ complete (ví dụ interval) thì nó không bao giờ phát. Một nguồn lỗi thì cả forkJoin lỗi, nên cần catchError cho từng nguồn nếu muốn hiển thị từng phần.`,check(e){let t=e.events(`dashboard`).filter(a=>a.type===`next`&&!!a.value?.user&&!!a.value?.posts);if(!t.length)return s(`Chưa có giá trị dashboard dạng { user, posts }.`);let i$4=t[0].t,c=e.http(`/users`);return i$4>=700?s(`Dashboard có dữ liệu lúc `+i$4+`ms, vẫn chậm. Hai request đang chạy tuần tự.`):c.length>=2&&Math.abs(c[0].t-c[1].t)>60?s(`Hai request không bắt đầu cùng lúc.`):i(`Dashboard có dữ liệu lúc `+i$4+`ms.`)}},{id:`retry`,group:`Gọi HTTP thường ngày`,title:`Mạng chập chờn: retry`,level:`Trung bình`,lv:2,waitMs:2300,desc:`<p><code>fakeApi.flaky()</code> m\xF4 ph\u1ECFng m\u1EA1ng ch\u1EADp ch\u1EDDn: <b>2 l\u1EA7n \u0111\u1EA7u l\u1ED7i</b>, l\u1EA7n th\u1EE9 3 m\u1EDBi th\xE0nh c\xF4ng.</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\u1EED l\u1EA1i t\u1ED1i \u0111a <b>3 l\u1EA7n</b>, m\u1ED7i l\u1EA7n <b>c\xE1ch 300ms</b>. N\u1EBFu v\u1EABn l\u1ED7i th\xEC tr\u1EA3 v\u1EC1 <code>'fallback'</code>. K\u1EBFt qu\u1EA3 cu\u1ED1i \u1EDF lane <code>data</code> ph\u1EA3i l\xE0 <code>'OK (l\u1EA7n 3)'</code>.</p>`,starter:`const data = toSignal(
  fakeApi.flaky().pipe(
    // TODO: th\u1EED l\u1EA1i t\u1ED1i \u0111a 3 l\u1EA7n, c\xE1ch nhau 300ms
    // TODO: h\u1EBFt l\u01B0\u1EE3t v\u1EABn l\u1ED7i th\xEC tr\u1EA3 v\u1EC1 'fallback'
  ),
  { initialValue: '\u0111ang t\u1EA3i\u2026' }
);

ui.text('K\u1EBFt qu\u1EA3', data);
watch('data', data);
`,solution:`const data = toSignal(
  fakeApi.flaky().pipe(
    retry({ count: 3, delay: 300 }),
    catchError(() => of('fallback')),
  ),
  { initialValue: '\u0111ang t\u1EA3i\u2026' }
);

// Backoff t\u0103ng d\u1EA7n:
// retry({ count: 3, delay: (err, n) => timer(300 * 2 ** (n - 1)) })

ui.text('K\u1EBFt qu\u1EA3', data);
watch('data', data);
`,hint:`retry({ count: 3, delay: 300 }) rồi catchError(() => of('fallback')). Thứ tự quan trọng: retry phải đứng trước catchError.`,explain:`retry subscribe lại Observable nguồn, tức là gửi lại request. Chỉ retry những lỗi tạm thời (mạng, 503). Lỗi 400/401 thì retry vô ích. Có thể kiểm tra err trong hàm delay và throwError để dừng sớm.`,check(e){let t=e.http(`/flaky`),i$5=e.values(`data`);if(e.errors.length)return s(`Có lỗi chưa xử lý: `+e.errMsg()+`.`);let c$2=i$5[i$5.length-1];if(c$2===`fallback`&&t.length<3)return s(`Ra "fallback" sau `+t.length+` request: catchError đứng trước retry nên lỗi bị nuốt mất và retry không chạy. Hãy đặt retry trước.`);if(t.length<3)return s(`Chỉ có `+t.length+` request, cần thử lại cho đến khi thành công.`);if(c$2===`fallback`)return s(`Ra "fallback": count quá nhỏ.`);if(c$2!==`OK (lần 3)`)return s(`Giá trị cuối: `+c(c$2)+`.`);for(let a=1;a<t.length;a++)if(t[a].t-(t[a-1].tEnd??0)<250)return s(`Các lần thử lại cách nhau quá gần, cần delay 300ms.`);return i()}},{id:`share-replay`,group:`Gọi HTTP thường ngày`,title:`Cache với shareReplay`,level:`Trung bình`,lv:2,waitMs:1700,desc:`<p>Observable t\u1EEB HTTP l\xE0 <b>cold</b>: m\u1ED7i l\u1EA7n subscribe l\xE0 m\u1ED9t l\u1EA7n g\u1ECDi API. Ba ph\u1EA7n c\u1EE7a trang c\xF9ng c\u1EA7n <code>config</code> th\xEC s\u1EBD g\u1ECDi API 3 l\u1EA7n.</p>
<p><b>Y\xEAu c\u1EA7u:</b> ch\u1EC9 g\u1ECDi <b>\u0111\xFAng 1 request</b>. C\u1EA3 3 subscriber nh\u1EADn k\u1EBFt qu\u1EA3, v\xE0 subscriber <code>late</code> v\xE0o mu\u1ED9n (1000ms) c\u0169ng l\u1EA5y t\u1EEB cache, kh\xF4ng g\u1ECDi l\u1EA1i.</p>`,starter:`// \u2757 m\u1ED7i subscribe l\xE0 m\u1ED9t request
const config$ = fakeApi.config();

config$.subscribe(spy('header'));
config$.subscribe(spy('sidebar'));
config$.subscribe(spy('footer'));

await sleep(1000);
config$.subscribe(spy('late'));   // v\xE0o mu\u1ED9n
`,solution:`const config$ = fakeApi.config().pipe(
  shareReplay({ bufferSize: 1, refCount: false }),   // = shareReplay(1)
);

config$.subscribe(spy('header'));
config$.subscribe(spy('sidebar'));
config$.subscribe(spy('footer'));

await sleep(1000);
config$.subscribe(spy('late'));   // l\u1EA5y t\u1EEB cache
`,hint:`Thêm .pipe(shareReplay(1)). Dùng share() thì subscriber vào muộn vẫn gây request mới.`,explain:`Trong service, shareReplay(1) thường dùng để cache dữ liệu ít đổi (config, danh mục). share() chỉ chia sẻ khi các subscriber đến cùng lúc. Nếu đã chuyển sang signal thì toSignal hoặc rxResource trong service cũng là một dạng cache.`,check(e){let t=e.http(`/config`).length,c=[`header`,`sidebar`,`footer`,`late`].filter(a=>!e.values(a).length);return t===1&&!c.length?i():t===2?s(`Có 2 request: subscriber "late" gây request mới. share() không giữ lại giá trị, hãy dùng shareReplay(1).`):t>2?s(`Có `+t+` request. Cần chia sẻ một request cho mọi subscriber.`):s(`Lane chưa nhận dữ liệu: `+c.join(`, `)+`.`)}},{id:`polling`,group:`Gọi HTTP thường ngày`,title:`Polling đến khi xong`,level:`Khó`,lv:3,waitMs:2700,desc:`<p>Theo d\xF5i ti\u1EBFn \u0111\u1ED9 m\u1ED9t job (xu\u1EA5t b\xE1o c\xE1o, upload\u2026): c\u1EE9 400ms h\u1ECFi server m\u1ED9t l\u1EA7n, <b>d\u1EEBng</b> khi <code>status === 'done'</code>. Code hi\u1EC7n t\u1EA1i h\u1ECFi m\xE3i kh\xF4ng d\u1EEBng, g\xE2y l\xE3ng ph\xED v\xE0 r\xF2 r\u1EC9.</p>
<p><b>Y\xEAu c\u1EA7u:</b> d\u1EEBng polling ngay sau khi nh\u1EADn <code>done</code>, v\xE0 <b>v\u1EABn ph\xE1t</b> gi\xE1 tr\u1ECB <code>done</code> ra UI. Ph\u1EA3i c\xF3 \u0111\xFAng <b>4 request</b>.</p>`,starter:`const job$ = interval(400).pipe(
  switchMap(() => fakeApi.job(42)),
  // TODO: d\u1EEBng ngay sau khi status === 'done' (v\u1EABn ph\xE1t gi\xE1 tr\u1ECB done)
);

const job = toSignal(job$, { initialValue: { progress: 0, status: 'pending' } });

ui.text('Ti\u1EBFn \u0111\u1ED9', () => job().progress + '% \u2014 ' + job().status);
watch('job', () => job().progress + '% ' + job().status);
`,solution:`const job$ = timer(0, 400).pipe(           // timer(0, \u2026): h\u1ECFi ngay l\u1EA7n \u0111\u1EA7u
  switchMap(() => fakeApi.job(42)),
  takeWhile(j => j.status !== 'done', true), // true = v\u1EABn ph\xE1t gi\xE1 tr\u1ECB l\xE0m d\u1EEBng
);

const job = toSignal(job$, { initialValue: { progress: 0, status: 'pending' } });

ui.text('Ti\u1EBFn \u0111\u1ED9', () => job().progress + '% \u2014 ' + job().status);
watch('job', () => job().progress + '% ' + job().status);
`,hint:`takeWhile(j => j.status !== 'done', true). Tham số inclusive = true để giá trị done vẫn được phát.`,explain:`Thiếu inclusive thì UI dừng ở 75% và không bao giờ thấy done. Nếu request có thể chậm hơn chu kỳ polling, dùng exhaustMap thay cho switchMap để không huỷ request đang chạy.`,check(e){let t=e.http(`/jobs`).length,i$6=e.values(`job`),c$3=i$6[i$6.length-1];return t>4?s(`Có `+t+` request: vẫn hỏi tiếp sau khi job đã done.`):c$3===`75% running`&&t===4?s(`Đã dừng đúng lúc nhưng UI không thấy "done". Thêm tham số inclusive = true cho takeWhile.`):t<4?s(`Chỉ có `+t+` request, dừng quá sớm.`):c$3!==`100% done`?s(`Giá trị cuối: `+c(c$3)+`, cần "100% done".`):i()}},{id:`rx-resource`,group:`Gọi HTTP thường ngày`,title:`rxResource: tải theo id`,level:`Trung bình`,lv:2,waitMs:1300,desc:`<p><code>rxResource</code> t\u1EF1 t\u1EA3i l\u1EA1i khi <code>params</code> \u0111\u1ED5i, t\u1EF1 hu\u1EF7 request c\u0169, v\xE0 c\xF3 s\u1EB5n <code>value()</code>, <code>isLoading()</code>, <code>error()</code>, <code>status()</code>, <code>reload()</code>. N\xF3 thay \u0111\u01B0\u1EE3c combo <code>toObservable \u2192 switchMap \u2192 toSignal</code> c\xF9ng c\xE1c signal loading/error t\u1EF1 vi\u1EBFt.</p>
<p><b>Y\xEAu c\u1EA7u:</b> t\u1EA3i user theo <code>userId</code>. Khi ki\u1EC3m tra, trang s\u1EBD b\u1EA5m <b>Sau \u25B6</b> 3 l\u1EA7n th\u1EADt nhanh (id 2, 3, 4). Request c\u0169 ph\u1EA3i b\u1ECB hu\u1EF7, v\xE0 lane <code>name</code> cu\u1ED1i c\xF9ng l\xE0 <code>User 4</code>.</p>
<div class="tip"><code>rxResource</code> l\xE0 API stable t\u1EEB Angular 22 (trong <code>@angular/core/rxjs-interop</code>).</div>`,starter:`const userId = signal(1, { debugName: 'userId' });

// TODO: t\u1EA1o rxResource t\u1EA3i user theo userId
// const user = rxResource({
//   params: () => ({ id: userId() }),
//   stream: ({ params }) => ...,
// });

ui.button('\u25C0 Tr\u01B0\u1EDBc', () => userId.update(id => Math.max(1, id - 1)));
ui.button('Sau \u25B6', () => userId.update(id => id + 1));
ui.text('userId', userId);
// ui.text('Tr\u1EA1ng th\xE1i', user.status);
// ui.text('T\xEAn', () => user.isLoading() ? '\u0111ang t\u1EA3i\u2026' : user.value()?.name);
// watch('name', () => user.value()?.name);
`,solution:`const userId = signal(1, { debugName: 'userId' });

const user = rxResource({
  params: () => ({ id: userId() }),                  // \u0111\u1ECDc signal \u1EDF \u0111\xE2y \u2192 \u0111\u01B0\u1EE3c theo d\xF5i
  stream: ({ params }) => fakeApi.user(params.id),   // tr\u1EA3 v\u1EC1 Observable
});

ui.button('\u25C0 Tr\u01B0\u1EDBc', () => userId.update(id => Math.max(1, id - 1)));
ui.button('Sau \u25B6', () => userId.update(id => id + 1));
ui.button('\u21BB T\u1EA3i l\u1EA1i', () => user.reload());
ui.text('userId', userId);
ui.text('Tr\u1EA1ng th\xE1i', user.status);
ui.text('T\xEAn', () => user.isLoading() ? '\u0111ang t\u1EA3i\u2026' : user.value()?.name);
watch('name', () => user.value()?.name);
`,hint:`stream: ({ params }) => fakeApi.user(params.id). Nhớ bỏ comment các dòng ui.text và watch.`,explain:`Chỉ các signal đọc trong params mới được theo dõi; đọc signal trong stream không làm resource tải lại. params trả về undefined thì resource ở trạng thái idle, không gọi API (hợp cho trường hợp "chưa chọn gì").`,simulate(e){e.at(100,()=>e.click(`Sau`)),e.at(200,()=>e.click(`Sau`)),e.at(300,()=>e.click(`Sau`))},check(e){let t=e.values(`name`);if(!e.lanes().includes(`name`))return s(`Ch\u01B0a c\xF3 lane "name". B\u1ECF comment d\xF2ng watch('name', ...).`);let i$7=e.http(`/users`).filter(a=>a.status===`cancelled`).length,c$4=t[t.length-1];return c$4!==`User 4`?s(`Tên cuối là `+c(c$4)+`, cần "User 4".`):i$7<2?s(`Request cũ không bị huỷ khi đổi id.`):i()}},{id:`exhaust-map`,group:`Sự kiện người dùng`,title:`Nút Lưu: chống bấm liên tục`,level:`Trung bình`,lv:2,waitMs:1800,desc:`<p>B\u1ED1n to\xE1n t\u1EED "flattening" quy\u1EBFt \u0111\u1ECBnh chuy\u1EC7n g\xEC x\u1EA3y ra khi s\u1EF1 ki\u1EC7n m\u1EDBi \u0111\u1EBFn l\xFAc vi\u1EC7c c\u0169 <b>ch\u01B0a xong</b>:</p>
<table><tr><th>To\xE1n t\u1EED</th><th>H\xE0nh vi</th><th>D\xF9ng cho</th></tr>
<tr><td><code>switchMap</code></td><td>Hu\u1EF7 vi\u1EC7c c\u0169, l\xE0m vi\u1EC7c m\u1EDBi</td><td>Search, \u0111\u1ED5i b\u1ED9 l\u1ECDc, \u0111\u1ED5i route</td></tr>
<tr><td><code>mergeMap</code></td><td>Ch\u1EA1y song song t\u1EA5t c\u1EA3</td><td>Xo\xE1 nhi\u1EC1u item, upload nhi\u1EC1u file</td></tr>
<tr><td><code>concatMap</code></td><td>X\u1EBFp h\xE0ng, l\xE0m l\u1EA7n l\u01B0\u1EE3t</td><td>Thao t\xE1c c\u1EA7n \u0111\xFAng th\u1EE9 t\u1EF1</td></tr>
<tr><td><code>exhaustMap</code></td><td>B\u1ECF qua s\u1EF1 ki\u1EC7n m\u1EDBi khi \u0111ang b\u1EADn</td><td>N\xFAt L\u01B0u/\u0110\u0103ng nh\u1EADp, refresh</td></tr></table>
<p><b>Y\xEAu c\u1EA7u:</b> trang s\u1EBD b\u1EA5m L\u01B0u l\xFAc 0, 100, 200 v\xE0 900ms. Ch\u1EC9 \u0111\u01B0\u1EE3c g\u1EEDi <b>2 request</b> v\xE0 kh\xF4ng request n\xE0o b\u1ECB hu\u1EF7. Th\xEAm \u0111i\u1EC3m: d\xF9ng signal <code>saving</code> \u0111\u1EC3 hi\u1EC7n tr\u1EA1ng th\xE1i.</p>`,starter:`const saveClick$ = ui.button('\u{1F4BE} L\u01B0u');
const saving = signal(false, { debugName: 'saving' });
ui.text('\u0110ang l\u01B0u?', saving);

saveClick$.pipe(
  mergeMap(() => fakeApi.save({ title: 'B\xE0i vi\u1EBFt m\u1EDBi' })),   // \u2757 \u0111\u1ED5i to\xE1n t\u1EED
  takeUntilDestroyed(),
).subscribe(spy('saved'));
`,solution:`const saveClick$ = ui.button('\u{1F4BE} L\u01B0u');
const saving = signal(false, { debugName: 'saving' });
ui.text('\u0110ang l\u01B0u?', saving);

saveClick$.pipe(
  exhaustMap(() => {
    saving.set(true);
    return fakeApi.save({ title: 'B\xE0i vi\u1EBFt m\u1EDBi' }).pipe(
      finalize(() => saving.set(false)),   // ch\u1EA1y c\u1EA3 khi th\xE0nh c\xF4ng, l\u1ED7i hay b\u1ECB hu\u1EF7
    );
  }),
  takeUntilDestroyed(),
).subscribe(spy('saved'));
`,hint:`exhaustMap bỏ qua các click đến khi request hiện tại hoàn tất.`,explain:`Vẫn nên disable nút khi saving() là true để báo cho người dùng biết. exhaustMap là lớp bảo vệ ở tầng logic. finalize thích hợp để tắt trạng thái loading vì nó chạy trong mọi trường hợp.`,simulate(e){[0,100,200,900].forEach(t=>e.at(t,()=>e.click(`Lưu`)))},check(e){let t=e.http(`/save`),i$8=t.length,c=t.filter(a=>a.status===`cancelled`).length;return i$8===2&&!c?i():c?s(`Có `+c+` request bị huỷ giữa chừng: switchMap huỷ lần lưu đang chạy, dữ liệu có thể đã ghi hoặc chưa.`):i$8>2?s(`Có `+i$8+` request: các lần bấm trong lúc đang lưu vẫn sinh request (mergeMap chạy song song, concatMap xếp hàng). Chúng phải bị bỏ qua.`):s(`Có `+i$8+` request, mong đợi 2.`)}},{id:`load-more`,group:`Sự kiện người dùng`,title:`Tải thêm: scan + concatMap`,level:`Khó`,lv:3,waitMs:2e3,desc:`<p>Danh s\xE1ch c\xF3 n\xFAt <b>T\u1EA3i th\xEAm</b> (ho\u1EB7c infinite scroll): t\u1EA3i trang 1 khi m\u1EDF m\xE0n h\xECnh, m\u1ED7i l\u1EA7n b\u1EA5m th\xEC t\u1EA3i trang ti\u1EBFp theo v\xE0 <b>g\u1ED9p</b> v\xE0o danh s\xE1ch c\u0169. Ng\u01B0\u1EDDi d\xF9ng b\u1EA5m nhanh 2 l\u1EA7n th\xEC c\u0169ng kh\xF4ng \u0111\u01B0\u1EE3c m\u1EA5t trang n\xE0o.</p>
<p><b>Y\xEAu c\u1EA7u:</b> trang s\u1EBD b\u1EA5m 2 l\u1EA7n li\u1EC1n (700ms v\xE0 760ms). K\u1EBFt qu\u1EA3: \u0111\u1EE7 <b>15 item</b> (3 trang, m\u1ED7i trang 5 item), kh\xF4ng request n\xE0o b\u1ECB hu\u1EF7.</p>
<div class="tip">G\u1EE3i \xFD to\xE1n t\u1EED: <code>startWith</code> (ph\xE1t gi\xE1 tr\u1ECB \u0111\u1EA7u), <code>scan</code> (t\xEDch lu\u1EF9 nh\u01B0 reduce nh\u01B0ng ph\xE1t t\u1EEBng b\u01B0\u1EDBc), <code>concatMap</code>.</div>`,starter:`const loadMore$ = ui.button('\u2B07 T\u1EA3i th\xEAm');

// \u2757 Hi\u1EC7n t\u1EA1i: ch\u01B0a t\u1EA3i trang 1 khi m\u1EDF, m\u1ED7i l\u1EA7n b\u1EA5m THAY danh s\xE1ch,
//    v\xE0 b\u1EA5m nhanh th\xEC trang tr\u01B0\u1EDBc b\u1ECB hu\u1EF7.
const items$ = loadMore$.pipe(
  map((_, i) => i + 1),              // s\u1ED1 trang: 1, 2, 3\u2026
  switchMap(page => fakeApi.page(page)),
);

const items = toSignal(items$, { initialValue: [] });

ui.list(items);
watch('items', () => items().length);
`,solution:`const loadMore$ = ui.button('\u2B07 T\u1EA3i th\xEAm');

const items$ = loadMore$.pipe(
  startWith(null),                         // t\u1EA3i trang 1 ngay khi m\u1EDF
  map((_, i) => i + 1),                    // 1, 2, 3\u2026
  concatMap(page => fakeApi.page(page)),   // l\u1EA7n l\u01B0\u1EE3t, kh\xF4ng m\u1EA5t trang n\xE0o
  scan((all, page) => [...all, ...page], []),
);

const items = toSignal(items$, { initialValue: [] });

ui.list(items);
watch('items', () => items().length);
`,hint:`startWith(null) → map((_, i) => i + 1) → concatMap(page => fakeApi.page(page)) → scan((all, page) => [...all, ...page], [])`,explain:`scan giữ state tích luỹ bên trong stream. Cách làm theo kiểu signal: items = signal([]), và mỗi khi tải xong thì items.update(all => [...all, ...page]). Hai cách đều dùng được.`,simulate(e){e.at(700,()=>e.click(`Tải thêm`)),e.at(760,()=>e.click(`Tải thêm`))},check(e){let t=e.values(`items`),i$9=e.http(`/items`),c$5=i$9.filter(l=>l.status===`cancelled`).length,a=t[t.length-1];return a===15&&!c$5?i():!i$9.length||i$9[0].arg!==1||i$9[0].t>150?s(`Trang 1 chưa được tải ngay khi mở. Dùng startWith().`):c$5?s(`Có trang bị huỷ khi bấm nhanh: switchMap không hợp ở đây.`):a===5?s(`Danh sách bị thay thế thay vì gộp. Dùng scan để tích luỹ.`):s(`Số item cuối: `+c(a)+`, cần 15.`)}},{id:`take-until-destroyed`,group:`Dọn dẹp & kiến trúc`,title:`Rò rỉ subscription`,level:`Dễ`,lv:1,waitMs:1500,desc:`<p>Subscribe th\u1EE7 c\xF4ng trong component m\xE0 kh\xF4ng hu\u1EF7 th\xEC khi component b\u1ECB destroy, subscription <b>v\u1EABn ch\u1EA1y</b>. H\u1EADu qu\u1EA3 l\xE0 r\xF2 r\u1EC9 b\u1ED9 nh\u1EDB, g\u1ECDi API th\u1EEBa, v\xE0 l\u1ED7i kh\xF3 hi\u1EC3u khi code c\u1EADp nh\u1EADt m\u1ED9t component \u0111\xE3 ch\u1EBFt.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi ki\u1EC3m tra, trang s\u1EBD <b>destroy component l\xFAc 700ms</b> (v\u1EA1ch \u0111\u1ECF tr\xEAn Timeline). Sau th\u1EDDi \u0111i\u1EC3m \u0111\xF3 lane <code>tick</code> kh\xF4ng \u0111\u01B0\u1EE3c ph\xE1t g\xEC n\u1EEFa.</p>
<table><tr><th>C\xE1ch</th><th>Ghi ch\xFA</th></tr>
<tr><td><code>takeUntilDestroyed()</code></td><td>G\u1ECDn nh\u1EA5t, d\xF9ng trong constructor/field</td></tr>
<tr><td><code>toSignal()</code></td><td>T\u1EF1 hu\u1EF7, kh\xF4ng c\u1EA7n subscribe</td></tr>
<tr><td><code>destroyRef.onDestroy(() => sub.unsubscribe())</code></td><td>D\xF9ng khi subscribe \u1EDF n\u01A1i kh\xE1c</td></tr></table>`,starter:`// Code n\xE0y ch\u1EA1y nh\u01B0 trong constructor c\u1EE7a component
interval(200).pipe(
  map(i => 'tick ' + i),
).subscribe(spy('tick'));
`,solution:`interval(200).pipe(
  map(i => 'tick ' + i),
  takeUntilDestroyed(),          // complete khi component destroy
).subscribe(spy('tick'));

// C\xE1ch kh\xE1c:
// const sub = interval(200).subscribe(spy('tick'));
// destroyRef.onDestroy(() => sub.unsubscribe());
`,hint:`Thêm takeUntilDestroyed() làm toán tử cuối cùng trong pipe.`,explain:`Nên đặt takeUntilDestroyed ở cuối pipe. Đặt trước switchMap hay mergeMap thì các inner Observable vẫn có thể sống tiếp. Ngoài constructor (ví dụ trong ngOnInit) phải truyền vào: takeUntilDestroyed(this.destroyRef).`,simulate(e){e.at(700,()=>e.destroy())},check(e){let t=e.destroyedAt;if(t==null)return s(`Component chưa được destroy (lỗi mô phỏng). Thử lại.`);let i$10=e.events(`tick`).filter(a=>a.type===`next`&&a.t<=t+5).length,c=e.events(`tick`).filter(a=>a.type===`next`&&a.t>t+5);return i$10?c.length?s(`Sau khi destroy vẫn có `+c.length+` tick: subscription bị rò rỉ.`):i():s(`Lane "tick" chưa có giá trị nào trước khi destroy.`)}},{id:`store`,group:`Dọn dẹp & kiến trúc`,title:`Service store bằng signal`,level:`Khó`,lv:3,waitMs:500,desc:`<p>Pattern ph\u1ED5 bi\u1EBFn trong Angular hi\u1EC7n \u0111\u1EA1i \u0111\u1EC3 thay <code>BehaviorSubject</code> trong service:</p>
<ul><li>State <b>private</b> d\u1EA1ng <code>signal</code>: ch\u1EC9 store \u0111\u01B0\u1EE3c s\u1EEDa</li>
<li>B\xEAn ngo\xE0i ch\u1EC9 th\u1EA5y b\u1EA3n <b>readonly</b> (<code>asReadonly()</code>) v\xE0 c\xE1c <code>computed</code></li>
<li>Mu\u1ED1n \u0111\u1ED5i state th\xEC g\u1ECDi <b>method</b> (<code>add</code>, <code>remove</code>\u2026)</li></ul>
<p><b>Y\xEAu c\u1EA7u:</b> ho\xE0n thi\u1EC7n <code>CartStore</code> v\u1EDBi <code>items</code> (readonly), <code>count</code>, <code>total</code> (computed), <code>add(product)</code> v\xE0 <code>remove(id)</code>. Lane <code>total</code>: <code>200 \u2192 500 \u2192 300</code>.</p>`,starter:`class CartStore {
  // TODO: state private:   #items = signal([])
  // TODO: items = readonly, count & total = computed
  // TODO: add(product), remove(id) \u2014 nh\u1EDB tr\u1EA3 v\u1EC1 m\u1EA3ng m\u1EDBi
}

const store = new CartStore();   // trong Angular: inject(CartStore)

ui.list(() => store.items().map(i => i.name + ' \u2014 ' + i.price));
ui.text('S\u1ED1 m\xF3n', () => store.count());
ui.text('T\u1ED5ng', () => store.total());
watch('total', () => store.total());

store.add({ id: 1, name: '\xC1o thun', price: 200 });
await sleep(100);
store.add({ id: 2, name: 'Qu\u1EA7n jean', price: 300 });
await sleep(100);
store.remove(1);
`,solution:`class CartStore {
  #items = signal([], { debugName: 'cart.items' });

  items = this.#items.asReadonly();
  count = computed(() => this.#items().length, { debugName: 'cart.count' });
  total = computed(() => this.#items().reduce((sum, i) => sum + i.price, 0), { debugName: 'cart.total' });

  add(product) {
    this.#items.update(list => [...list, product]);
  }

  remove(id) {
    this.#items.update(list => list.filter(i => i.id !== id));
  }
}

const store = new CartStore();

ui.list(() => store.items().map(i => i.name + ' \u2014 ' + i.price));
ui.text('S\u1ED1 m\xF3n', () => store.count());
ui.text('T\u1ED5ng', () => store.total());
watch('total', () => store.total());

store.add({ id: 1, name: '\xC1o thun', price: 200 });
await sleep(100);
store.add({ id: 2, name: 'Qu\u1EA7n jean', price: 300 });
await sleep(100);
store.remove(1);
`,hint:`Field private #items = signal([]); items = this.#items.asReadonly(); add/remove dùng this.#items.update(...).`,explain:`Trong Angular viết là @Injectable({ providedIn: 'root' }) export class CartStore { private readonly _items = signal<Item[]>([]); readonly items = this._items.asReadonly(); … }. Component chỉ đọc store.items() và gọi method, không set trực tiếp.`,check(e,t){let i$11=e.values(`total`);return e.errors.length&&!i$11.length?s(`Có lỗi: `+e.errMsg()+`.`):o(i$11,[200,500,300])?/asReadonly\s*\(/.test(t)?i():s(`Kết quả đúng, nhưng items cần là readonly (dùng asReadonly()) để bên ngoài không set được.`):s(`Lane total: `+c(i$11)+`, mong đợi [200, 500, 300].`)}}],cheatsheet:[[`State của component/service`,`<code>signal</code> + <code>computed</code> (thay <code>BehaviorSubject</code>)`],[`Giá trị suy ra từ nhiều state`,`<code>computed</code> (không glitch như <code>combineLatest</code>)`],[`State phụ thuộc nhưng sửa được`,`<code>linkedSignal</code>`],[`Đồng bộ ra ngoài (localStorage, log, thư viện DOM)`,`<code>effect</code>; không dùng effect để copy signal sang signal`],[`Tải dữ liệu theo tham số`,`<code>rxResource</code> / <code>httpResource</code>, hoặc <code>toObservable → switchMap → toSignal</code>`],[`Ô tìm kiếm`,`<code>debounceTime</code> + <code>distinctUntilChanged</code> + <code>switchMap</code>`],[`Nút Lưu, Submit, Đăng nhập`,`<code>exhaustMap</code>`],[`Hàng đợi theo thứ tự / nhiều việc song song`,`<code>concatMap</code> / <code>mergeMap</code>, <code>forkJoin</code>`],[`Lỗi mạng tạm thời`,`<code>retry({ count, delay })</code>`],[`Một request lỗi không làm chết stream`,`<code>catchError</code> <b>bên trong</b> <code>switchMap</code>`],[`Cache kết quả dùng chung`,`<code>shareReplay(1)</code>`],[`Polling đến khi xong`,`<code>timer(0, ms)</code> + <code>switchMap</code> + <code>takeWhile(…, true)</code>`],[`Tích luỹ (tải thêm, giỏ hàng)`,`<code>scan</code> hoặc <code>signal.update</code>`],[`Subscribe thủ công trong component`,`<code>takeUntilDestroyed()</code>, hoặc dùng <code>toSignal</code> cho khỏi subscribe`],[`Tắt loading dù thành công/lỗi/huỷ`,`<code>finalize</code>`]]};export{d as LAB};