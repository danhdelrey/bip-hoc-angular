import { type CheckApi, type SimCtx, fmt } from './lab-runtime';

/**
 * Bộ bài tập của RxJS + Signal Lab — bao quát các tình huống hay gặp hằng ngày:
 * state trong service, ô tìm kiếm, gọi HTTP (lỗi, retry, song song, cache, polling),
 * chống bấm liên tục, tải thêm, dọn subscription, store bằng signal.
 *
 * Mỗi bài: starter (chạy được nhưng sai/thiếu), solution, check() chấm dựa trên sự kiện ghi được
 * (spy/watch/fakeApi), và simulate() nếu cần giả lập thao tác người dùng.
 * Chuỗi code KHÔNG dùng backtick hay ${} để giữ nguyên khi đặt trong template literal.
 */
export interface CheckResult {
  ok: boolean;
  msg: string;
}

export interface LabExercise {
  id: string;
  group: string;
  title: string;
  level: string;
  /** 0 = tự do, 1 = dễ, 2 = trung bình, 3 = khó */
  lv: 0 | 1 | 2 | 3;
  noCheck?: boolean;
  /** HTML (đã kiểm soát, không có dữ liệu người dùng) */
  desc: string;
  starter: string;
  solution?: string;
  hint?: string;
  explain?: string;
  /** thời gian chờ (ms) trước khi chấm */
  waitMs?: number;
  simulate?(s: SimCtx): void;
  check?(a: CheckApi, code: string): CheckResult;
}

const OK = (msg = ''): CheckResult => ({ ok: true, msg });
const NO = (msg: string): CheckResult => ({ ok: false, msg });
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const show = (v: unknown) => fmt(v);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export const LAB_EXERCISES: LabExercise[] = [
/* ---------------------------------------------------------------- */
{ id: 'san-choi', group: 'Bắt đầu', title: 'Sân chơi tự do', level: 'Tự do', lv: 0, noCheck: true,
  desc: `<p>Viết bất cứ thứ gì để thử. Mọi hàm của RxJS (<code>of</code>, <code>map</code>, <code>switchMap</code>…) và signal (<code>signal</code>, <code>computed</code>, <code>effect</code>, <code>toSignal</code>, <code>rxResource</code>…) đều có sẵn, <b>không cần import</b> (có viết import thì trang cũng tự bỏ qua). Viết JS hay TypeScript đều được.</p>
<p><code>signal</code>, <code>effect</code>, <code>toSignal</code>, <code>rxResource</code>… ở đây là <b>API thật của Angular 22</b>. Code chạy giống như bên trong <b>constructor của một component</b> (có injection context), và nút <b>Dừng</b> tương đương component bị destroy.</p>
<div class="tip">Các helper chỉ có trong lab này: <code>spy('tên')</code> (observer ghi ra Console + Timeline), <code>watch('tên', signal)</code>, <code>ui.input/button/text/list</code>, <code>fakeApi.*</code>, <code>sleep(ms)</code>. Danh sách đầy đủ ở mục <b>API có sẵn</b> bên dưới.</div>`,
  starter: `// 🎮 Sân chơi — Ctrl+Enter để chạy

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
` },

/* ================= RxJS cơ bản ================= */
{ id: 'observable', group: 'RxJS cơ bản', title: 'Observable & 3 loại thông báo', level: 'Dễ', lv: 1, waitMs: 700,
  desc: `<p>Observable gửi cho subscriber 3 loại thông báo: <code>next(value)</code>, <code>error(err)</code>, <code>complete()</code>. Sau <code>error</code> hoặc <code>complete</code> thì stream kết thúc, không phát gì thêm.</p>
<p><b>Yêu cầu:</b> tạo một Observable phát <code>'A'</code> ngay lập tức, <b>sau 300ms</b> phát <code>'B'</code> rồi <code>complete()</code>. Subscribe bằng <code>spy('src')</code>.</p>
<div class="tip"><code>spy(label)</code> trả về một observer <code>{ next, error, complete }</code>, nên <code>subscribe(spy('src'))</code> cũng giống như tự viết cả 3 callback.</div>`,
  starter: `const src$ = new Observable(subscriber => {
  subscriber.next('A');
  // TODO: sau 300ms phát 'B' rồi complete
});

src$.subscribe(spy('src'));
`,
  solution: `const src$ = new Observable(subscriber => {
  subscriber.next('A');

  const id = setTimeout(() => {
    subscriber.next('B');
    subscriber.complete();
  }, 300);

  // teardown: chạy khi unsubscribe hoặc khi stream kết thúc
  return () => clearTimeout(id);
});

src$.subscribe(spy('src'));
`,
  hint: 'Gọi setTimeout bên trong hàm subscribe. Nhớ return một hàm teardown để clearTimeout khi bị unsubscribe sớm.',
  explain: 'Hàm truyền vào new Observable chỉ chạy khi có người subscribe (lazy), và mỗi subscriber có một lần chạy riêng. Hàm được return là teardown, nơi dọn timer hoặc listener.',
  check(a) {
    const ev = a.events('src');
    if (!ev.length) return NO('Lane "src" chưa có sự kiện nào. Bạn đã gọi subscribe(spy(\'src\')) chưa?');
    const vals = a.values('src');
    if (!same(vals, ['A', 'B'])) return NO('Nhận được ' + show(vals) + ', cần ["A", "B"].');
    if (ev[ev.length - 1].type !== 'complete') return NO('Đã có A và B nhưng stream chưa complete().');
    const tB = ev.find((e) => e.value === 'B')?.t ?? 0;
    if (tB < 250) return NO('"B" được phát lúc ' + tB + 'ms, cần khoảng 300ms.');
    return OK();
  } },

{ id: 'operators', group: 'RxJS cơ bản', title: 'pipe() với filter & map', level: 'Dễ', lv: 1, waitMs: 300,
  desc: `<p>Toán tử (operator) là hàm nhận một Observable và trả về Observable mới. <code>pipe()</code> nối các toán tử theo thứ tự, giống một dây chuyền.</p>
<p><b>Yêu cầu:</b> từ <code>range(1, 10)</code>, chỉ giữ <b>số chẵn</b> rồi <b>nhân 10</b>. Kết quả mong đợi ở lane <code>kq</code>: <code>20, 40, 60, 80, 100</code> rồi complete.</p>`,
  starter: `range(1, 10).pipe(
  // TODO: chỉ giữ số chẵn, rồi nhân mỗi số với 10
).subscribe(spy('kq'));
`,
  solution: `range(1, 10).pipe(
  filter(n => n % 2 === 0),
  map(n => n * 10),
).subscribe(spy('kq'));
`,
  hint: 'filter(n => n % 2 === 0) rồi map(n => n * 10). Thứ tự trong pipe có ý nghĩa.',
  explain: 'Thứ tự trong pipe quan trọng: map trước rồi filter sau sẽ cho kết quả khác. Mỗi toán tử tạo ra một Observable mới, không sửa Observable gốc.',
  check(a) {
    const v = a.values('kq');
    if (!same(v, [20, 40, 60, 80, 100])) return NO('Nhận được ' + show(v) + ', cần [20, 40, 60, 80, 100].');
    if (a.last('kq').type !== 'complete') return NO('Thiếu complete ở cuối.');
    return OK();
  } },

{ id: 'subject', group: 'RxJS cơ bản', title: 'Subject vs BehaviorSubject', level: 'Dễ', lv: 1, waitMs: 500,
  desc: `<p>Trong service, ta hay giữ state bằng Subject. Khác biệt quan trọng là chuyện gì xảy ra với <b>người subscribe muộn</b>:</p>
<table><tr><th>Loại</th><th>Subscriber đến muộn nhận được</th></tr>
<tr><td><code>Subject</code></td><td>Không nhận gì, chỉ nhận các giá trị phát <i>sau</i> khi subscribe</td></tr>
<tr><td><code>BehaviorSubject(init)</code></td><td>Giá trị hiện tại ngay lập tức (bắt buộc có giá trị ban đầu)</td></tr>
<tr><td><code>ReplaySubject(n)</code></td><td>n giá trị gần nhất</td></tr></table>
<p><b>Yêu cầu:</b> sửa <code>state$</code> để có giá trị ban đầu <code>'idle'</code> và subscriber <b>B</b> (vào lúc 200ms) nhận ngay trạng thái hiện tại <code>'loading'</code>. Mong đợi: A = <code>idle, loading, done</code>; B = <code>loading, done</code>.</p>`,
  starter: `// state của một service
const state$ = new Subject();          // ❗ đổi sang loại Subject phù hợp

state$.subscribe(spy('A'));            // A subscribe ngay từ đầu

setTimeout(() => state$.next('loading'), 100);

setTimeout(() => {
  state$.subscribe(spy('B'));          // B subscribe muộn (200ms)
}, 200);

setTimeout(() => state$.next('done'), 300);
`,
  solution: `const state$ = new BehaviorSubject('idle');

state$.subscribe(spy('A'));

setTimeout(() => state$.next('loading'), 100);

setTimeout(() => {
  state$.subscribe(spy('B'));          // nhận ngay 'loading'
}, 200);

setTimeout(() => state$.next('done'), 300);

// Trong Angular hiện đại, state kiểu này thường dùng signal:
//   const state = signal('idle');  → đọc state() lúc nào cũng có giá trị
`,
  hint: 'BehaviorSubject cần một giá trị khởi tạo và luôn phát giá trị hiện tại cho subscriber mới.',
  explain: 'BehaviorSubject luôn có giá trị hiện tại (.value), nên hợp để làm state. Signal cũng có đặc điểm này, vì vậy signal thường thay được BehaviorSubject trong service.',
  check(a) {
    const A = a.values('A'), B = a.values('B');
    if (same(A, ['idle', 'loading', 'done']) && same(B, ['loading', 'done'])) return OK();
    if (!B.length || B[0] !== 'loading') return NO('B nhận được ' + show(B) + '. Subscriber vào muộn cần nhận ngay giá trị hiện tại "loading".');
    if (A[0] !== 'idle') return NO('A nhận được ' + show(A) + '. Cần có giá trị ban đầu "idle".');
    return NO('A = ' + show(A) + ', B = ' + show(B) + '.');
  } },

/* ================= Signal cơ bản ================= */
{ id: 'signal-co-ban', group: 'Signal cơ bản', title: 'signal, computed, effect', level: 'Dễ', lv: 1, waitMs: 400,
  desc: `<ul><li><code>signal(v)</code>: state ghi được bằng <code>.set()</code> / <code>.update()</code></li>
<li><code>computed(fn)</code>: giá trị suy ra, lazy và có cache, chỉ tính lại khi phụ thuộc đổi</li>
<li><code>effect(fn)</code>: side effect, tự chạy lại khi signal nó đọc thay đổi</li></ul>
<p><b>Yêu cầu:</b> (1) tạo <code>double = computed(...)</code>; (2) tạo effect ghi <code>double</code> bằng <code>watch('double', double)</code>; (3) set <code>count</code> = 1, 2, 3 <b>liền nhau</b>; (4) sau <code>await sleep(100)</code> set <code>count</code> = 5.</p>
<p>🤔 <b>Trước khi bấm Kiểm tra, hãy đoán xem lane "double" sẽ có những giá trị nào.</b></p>`,
  starter: `const count = signal(0, { debugName: 'count' });

// TODO 1: computed double = count * 2

// TODO 2: watch('double', double)   (watch = effect ghi giá trị ra timeline)

// TODO 3: set count = 1, 2, 3 liền nhau

await sleep(100);
// TODO 4: set count = 5
`,
  solution: `const count = signal(0, { debugName: 'count' });
const double = computed(() => count() * 2, { debugName: 'double' });

watch('double', double);
// watch(...) tương đương:
// effect(() => spy('double').next(double()));

count.set(1);
count.set(2);
count.set(3);

await sleep(100);
count.set(5);
`,
  hint: 'Effect không chạy ngay khi tạo hay ngay khi signal đổi, mà được lên lịch chạy sau. Lane đúng chỉ có 2 giá trị.',
  explain: 'Kết quả là [6, 10] chứ không phải [0, 2, 4, 6, 10]. Effect được lên lịch và chạy sau khi code đồng bộ xong (trong Angular là lúc change detection), nên 3 lần set liền nhau chỉ để lại giá trị cuối. Signal là state, không phải dòng sự kiện như Subject.next().',
  check(a) {
    const v = a.values('double');
    if (!v.length) return NO('Lane "double" trống. Bạn đã watch(\'double\', double) chưa?');
    if (same(v, [6, 10])) return OK();
    if (v[0] === 0) return NO('Nhận được ' + show(v) + '. Có vẻ bạn đã await giữa lúc tạo effect và lúc set 1, 2, 3. Hãy set liền nhau.');
    return NO('Nhận được ' + show(v) + ', mong đợi [6, 10].');
  } },

{ id: 'update', group: 'Signal cơ bản', title: 'update() và dữ liệu bất biến', level: 'Dễ', lv: 1, waitMs: 400,
  desc: `<p>Signal so sánh giá trị mới với giá trị cũ bằng <code>Object.is</code>. Nếu bạn <b>sửa trực tiếp</b> mảng/object cũ rồi trả lại chính nó, signal cho là "không có gì thay đổi" và UI không cập nhật. Đây là lỗi rất hay gặp.</p>
<p><b>Yêu cầu:</b> tạo <code>remaining</code> (số todo chưa xong) và viết <code>toggle(id)</code> dùng <code>todos.update()</code> trả về <b>mảng mới</b>. Lane <code>remaining</code> phải là <code>2 → 1</code>.</p>`,
  starter: `const todos = signal([
  { id: 1, title: 'Học signal', done: true },
  { id: 2, title: 'Học RxJS', done: false },
  { id: 3, title: 'Làm bài tập', done: false },
], { debugName: 'todos' });

// TODO 1: computed remaining = số todo chưa xong
const remaining = computed(() => 0);

function toggle(id) {
  // TODO 2: dùng todos.update(list => ...) và trả về MẢNG MỚI
}

ui.list(() => todos().map(t => (t.done ? '✅ ' : '⬜ ') + t.title));
ui.text('Còn lại', remaining);
ui.button('Toggle #2', () => toggle(2));
watch('remaining', remaining);

await sleep(100);
toggle(2);
`,
  solution: `const todos = signal([
  { id: 1, title: 'Học signal', done: true },
  { id: 2, title: 'Học RxJS', done: false },
  { id: 3, title: 'Làm bài tập', done: false },
], { debugName: 'todos' });

const remaining = computed(() => todos().filter(t => !t.done).length, { debugName: 'remaining' });

function toggle(id) {
  todos.update(list =>
    list.map(t => t.id === id ? { ...t, done: !t.done } : t)
  );
}

ui.list(() => todos().map(t => (t.done ? '✅ ' : '⬜ ') + t.title));
ui.text('Còn lại', remaining);
ui.button('Toggle #2', () => toggle(2));
watch('remaining', remaining);

await sleep(100);
toggle(2);
`,
  hint: 'list.map(t => t.id === id ? { ...t, done: !t.done } : t) tạo mảng mới và object mới cho phần tử thay đổi.',
  explain: 'Luôn tạo tham chiếu mới khi đổi mảng/object: spread, map, filter. Nếu sửa tại chỗ (t.done = true) rồi return list, Object.is(old, new) là true nên signal bỏ qua thay đổi.',
  check(a) {
    const v = a.values('remaining');
    if (same(v, [2, 1])) return OK();
    if (same(v, [2])) return NO('remaining không đổi sau toggle(2). Có thể bạn đã sửa trực tiếp mảng/object cũ rồi return lại chính nó, nên signal không thấy thay đổi.');
    if (v[0] !== 2) return NO('Giá trị đầu của remaining là ' + show(v[0]) + ', cần 2 (có 2 todo chưa xong).');
    return NO('Nhận được ' + show(v) + ', mong đợi [2, 1].');
  } },

{ id: 'untracked', group: 'Signal cơ bản', title: 'untracked(): đọc mà không theo dõi', level: 'Trung bình', lv: 2, waitMs: 450,
  desc: `<p>Effect tự theo dõi <b>mọi</b> signal được đọc bên trong nó. Đôi khi bạn chỉ muốn chạy lại khi một signal đổi, còn signal khác chỉ cần đọc giá trị hiện tại (ví dụ để ghi log hoặc đính kèm).</p>
<p><b>Yêu cầu:</b> effect "tải dữ liệu" chỉ được chạy lại khi <code>userId</code> đổi. Đổi <code>theme</code> không được làm effect chạy lại, nhưng log vẫn phải ghi theme mới nhất. Lane <code>load</code> phải có đúng 2 dòng.</p>`,
  starter: `const userId = signal(1, { debugName: 'userId' });
const theme = signal('light', { debugName: 'theme' });

effect(() => {
  spy('load').next('Tải dữ liệu user ' + userId() + ' (theme: ' + theme() + ')');
});

await sleep(100);
theme.set('dark');      // ❗ không được làm effect chạy lại

await sleep(100);
userId.set(2);          // ✅ effect phải chạy lại
`,
  solution: `const userId = signal(1, { debugName: 'userId' });
const theme = signal('light', { debugName: 'theme' });

effect(() => {
  const id = userId();                         // theo dõi
  const t = untracked(() => theme());          // chỉ đọc, không theo dõi
  spy('load').next('Tải dữ liệu user ' + id + ' (theme: ' + t + ')');
});

await sleep(100);
theme.set('dark');

await sleep(100);
userId.set(2);
`,
  hint: 'Bọc phần đọc theme trong untracked(() => theme()).',
  explain: 'untracked() dùng nhiều khi effect gọi hàm của service mà hàm đó lại đọc signal khác. Không bọc untracked thì effect sẽ chạy lại ngoài ý muốn.',
  check(a) {
    const v = a.values('load');
    if (v.length === 3) return NO('Effect chạy 3 lần: đổi theme cũng làm nó chạy lại. Hãy dùng untracked().');
    if (v.length !== 2) return NO('Lane "load" có ' + v.length + ' dòng, cần đúng 2.');
    if (!/user 2/.test(String(v[1])) || !/dark/.test(String(v[1]))) return NO('Dòng thứ 2 cần chứa "user 2" và theme mới nhất "dark". Hiện tại: ' + show(v[1]));
    return OK();
  } },

{ id: 'linked-signal', group: 'Signal cơ bản', title: 'linkedSignal(): state phụ thuộc nhưng sửa được', level: 'Trung bình', lv: 2, waitMs: 450,
  desc: `<p>Tình huống thường gặp: dropdown <b>sản phẩm</b> phụ thuộc vào <b>danh mục</b>. Khi đổi danh mục, sản phẩm đang chọn phải tự về món đầu tiên, nhưng người dùng vẫn chọn tay được.</p>
<ul><li><code>computed</code>: tự reset được nhưng không <code>set()</code> được</li>
<li><code>signal</code>: <code>set()</code> được nhưng không tự reset</li>
<li><code>linkedSignal</code>: làm được cả hai</li></ul>
<p><b>Yêu cầu:</b> lane <code>selected</code> phải là <code>apple → banana → carrot</code>.</p>`,
  starter: `const MENU = { fruit: ['apple', 'banana', 'mango'], veg: ['carrot', 'onion'] };

const category = signal('fruit', { debugName: 'category' });
const products = computed(() => MENU[category()]);

// ❗ Khi đổi category, selected phải tự về sản phẩm đầu tiên
const selected = signal(products()[0], { debugName: 'selected' });

ui.text('Danh mục', category);
ui.text('Đang chọn', selected);
watch('selected', selected);

await sleep(100);
selected.set('banana');      // người dùng chọn tay

await sleep(100);
category.set('veg');         // → selected phải thành 'carrot'
`,
  solution: `const MENU = { fruit: ['apple', 'banana', 'mango'], veg: ['carrot', 'onion'] };

const category = signal('fruit', { debugName: 'category' });
const products = computed(() => MENU[category()]);

const selected = linkedSignal(() => products()[0], { debugName: 'selected' });

// Dạng đầy đủ — giữ lựa chọn cũ nếu nó vẫn còn trong danh sách mới:
// const selected = linkedSignal({
//   source: products,
//   computation: (list, prev) => prev && list.includes(prev.value) ? prev.value : list[0],
// });

ui.text('Danh mục', category);
ui.text('Đang chọn', selected);
watch('selected', selected);

await sleep(100);
selected.set('banana');

await sleep(100);
category.set('veg');
`,
  hint: 'linkedSignal(() => products()[0]): tính lại mỗi khi products đổi, và vẫn có .set().',
  explain: 'linkedSignal hợp cho các trường hợp: lựa chọn mặc định theo danh sách, form được khởi tạo từ dữ liệu server nhưng người dùng sửa được, trang hiện tại reset về 1 khi đổi bộ lọc.',
  check(a) {
    const v = a.values('selected');
    if (same(v, ['apple', 'banana', 'carrot'])) return OK();
    if (same(v, ['apple', 'banana'])) return NO('Đổi category nhưng selected vẫn là "banana". signal thường không tự reset theo nguồn.');
    if (a.errors.length) return NO('Có lỗi: ' + a.errMsg() + '. computed không có .set().');
    return NO('Nhận được ' + show(v) + ', mong đợi ["apple", "banana", "carrot"].');
  } },

/* ================= Cầu nối RxJS ↔ Signal ================= */
{ id: 'to-signal', group: 'Cầu nối RxJS ↔ Signal', title: 'toSignal(): Observable thành Signal', level: 'Dễ', lv: 1, waitMs: 1400,
  desc: `<p><code>toSignal(obs$)</code> subscribe ngay khi được tạo và tự unsubscribe khi component destroy, nên không cần <code>async</code> pipe hay <code>ngOnDestroy</code>. Hay dùng cho route params, dữ liệu từ store, hoặc stream dạng <code>valueChanges</code>.</p>
<p><b>Yêu cầu:</b> chuyển <code>ticks$</code> thành signal <code>tick</code> với <b>giá trị ban đầu 0</b>. Lane <code>tick</code> mong đợi: <code>0, 1, 2, 3, 4, 5</code>.</p>`,
  starter: `const ticks$ = interval(200).pipe(take(5), map(i => i + 1));

// TODO: chuyển ticks$ thành signal với giá trị ban đầu 0
const tick = signal(0);

ui.text('tick', tick);
watch('tick', tick);
`,
  solution: `const ticks$ = interval(200).pipe(take(5), map(i => i + 1));

const tick = toSignal(ticks$, { initialValue: 0, debugName: 'tick' });

ui.text('tick', tick);
watch('tick', tick);
`,
  hint: 'toSignal(ticks$, { initialValue: 0 }). Không có initialValue thì giá trị đầu là undefined.',
  explain: 'Không có initialValue thì kiểu là T | undefined. Với BehaviorSubject (luôn phát đồng bộ) có thể dùng { requireSync: true } để có kiểu T. Lưu ý: trong component thật chỉ gọi toSignal ở field hoặc constructor (injection context), hoặc phải truyền { injector }. Lab tự truyền injector nên gọi sau await vẫn chạy.',
  check(a) {
    const v = a.values('tick');
    if (same(v, [0, 1, 2, 3, 4, 5])) return OK();
    if (same(v, [0])) return NO('tick đứng yên ở 0, chưa nối với ticks$.');
    if (v[0] === undefined) return NO('Giá trị đầu là undefined. Thêm { initialValue: 0 }.');
    return NO('Nhận được ' + show(v) + ', mong đợi [0, 1, 2, 3, 4, 5].');
  } },

{ id: 'computed-vs-combine', group: 'Cầu nối RxJS ↔ Signal', title: 'computed thay cho combineLatest', level: 'Trung bình', lv: 2, waitMs: 400,
  desc: `<p>Khi gom nhiều nguồn state, <code>combineLatest</code> phát lại <b>mỗi khi một nguồn đổi</b>. Đổi 2 nguồn liền nhau sẽ sinh ra một giá trị trung gian sai, gọi là <i>glitch</i> (ví dụ giá mới nhân số lượng cũ).</p>
<p><b>Yêu cầu:</b> chạy thử code RxJS bên dưới và để ý giá trị <code>240</code>. Sau đó viết lại bằng <code>signal</code> + <code>computed</code> để lane <code>total</code> chỉ còn <code>200 → 360</code>.</p>`,
  starter: `const price$ = new BehaviorSubject(100);
const qty$ = new BehaviorSubject(2);

combineLatest([price$, qty$]).pipe(
  map(([p, q]) => p * q),
).subscribe(spy('total'));

await sleep(100);
price$.next(120);
qty$.next(3);
`,
  solution: `const price = signal(100, { debugName: 'price' });
const qty = signal(2, { debugName: 'qty' });
const total = computed(() => price() * qty(), { debugName: 'total' });

watch('total', total);

await sleep(100);
price.set(120);
qty.set(3);
`,
  hint: 'price = signal(100), qty = signal(2), total = computed(() => price() * qty()), rồi watch(\'total\', total).',
  explain: 'Signal không bị glitch: computed chỉ được tính lại khi có người đọc, lúc đó mọi nguồn đã cập nhật xong. Với state đồng bộ, computed vừa gọn vừa đúng hơn combineLatest. RxJS vẫn cần cho phần bất đồng bộ.',
  check(a) {
    const v = a.values('total');
    if (same(v, [200, 360])) return OK();
    if (same(v, [200, 240, 360])) return NO('Vẫn còn glitch 240 (giá mới × số lượng cũ). Hãy chuyển sang signal + computed.');
    return NO('Nhận được ' + show(v) + ', mong đợi [200, 360].');
  } },

{ id: 'tim-kiem', group: 'Cầu nối RxJS ↔ Signal', title: 'Ô tìm kiếm: debounce + switchMap', level: 'Trung bình', lv: 2, waitMs: 2700,
  desc: `<p>Đây là pattern kinh điển: input là <b>signal</b>, nhưng debounce và huỷ request cũ là việc của <b>RxJS</b>. Luồng xử lý:</p>
<p><code>signal → toObservable → debounceTime(300) → distinctUntilChanged → filter(≥ 2 ký tự) → switchMap(fakeApi.search) → toSignal</code></p>
<p><b>Yêu cầu:</b> khi bấm Kiểm tra, trang sẽ tự gõ nhanh <code>b, ba, ban</code>, nghỉ một lúc, rồi gõ <code>c, ch, che</code>. Chỉ được có <b>đúng 2 request</b>: <code>ban</code> và <code>che</code>.</p>`,
  starter: `const query = ui.input('Gõ tên trái cây (vd: an, ch)...');

// TODO: biến query thành results bằng RxJS
const results = signal([]);   // ← thay bằng toSignal(...)

ui.list(results);
watch('results', results);
`,
  solution: `const query = ui.input('Gõ tên trái cây (vd: an, ch)...');

const results = toSignal(
  toObservable(query).pipe(
    debounceTime(300),
    map(q => q.trim()),
    distinctUntilChanged(),
    filter(q => q.length >= 2),
    switchMap(q => fakeApi.search(q).pipe(
      catchError(() => of([])),       // lỗi 1 request không làm chết ô search
    )),
  ),
  { initialValue: [] }
);

ui.list(results);
watch('results', results);
`,
  hint: 'toSignal(toObservable(query).pipe(debounceTime(300), distinctUntilChanged(), filter(q => q.length >= 2), switchMap(q => fakeApi.search(q))), { initialValue: [] })',
  explain: 'switchMap tự huỷ request cũ khi có từ khoá mới, nên tránh được race condition (kết quả cũ về sau ghi đè kết quả mới). Cách khác là truyền query đã debounce vào httpResource hoặc rxResource.',
  simulate(s) {
    s.at(0, () => s.type(0, 'b')); s.at(80, () => s.type(0, 'ba')); s.at(160, () => s.type(0, 'ban'));
    s.at(1200, () => s.type(0, 'c')); s.at(1260, () => s.type(0, 'ch')); s.at(1320, () => s.type(0, 'che'));
  },
  check(a) {
    const reqs = a.http('/search').map((h) => h.arg);
    if (!reqs.length) return NO('Không có request nào. Bạn đã gọi fakeApi.search(q) trong switchMap chưa?');
    if (same(reqs, ['ban', 'che'])) {
      const last = (a.values('results').at(-1) ?? []) as string[];
      if (!last.includes('cherry')) return NO('Request đúng nhưng results cuối không chứa "cherry". results đã lấy từ kết quả search chưa?');
      return OK();
    }
    if (reqs.length > 2) return NO('Có ' + reqs.length + ' request: ' + show(reqs) + '. Thiếu debounceTime(300), hoặc thiếu filter ≥ 2 ký tự.');
    return NO('Các request: ' + show(reqs) + ', mong đợi ["ban", "che"].');
  } },

/* ================= Gọi HTTP thường ngày ================= */
{ id: 'catch-error', group: 'Gọi HTTP thường ngày', title: 'catchError đúng chỗ', level: 'Trung bình', lv: 2, waitMs: 2000,
  desc: `<p><code>fakeApi.user(13)</code> luôn trả lỗi 500. Khi một request lỗi trong <code>switchMap</code>, lỗi lan ra stream ngoài và <b>cả stream chết</b>: các lần đổi id sau không còn tải gì nữa, và signal từ <code>toSignal</code> sẽ <b>throw khi bị đọc</b>.</p>
<p><b>Yêu cầu:</b> khi lỗi thì hiển thị user giả <code>{ id, name: '(lỗi)' }</code>, và stream phải <b>sống tiếp</b> để id 2 vẫn tải được. Lane <code>user</code>: <code>…, User 1, (lỗi), User 2</code>.</p>`,
  starter: `const userId = signal(1, { debugName: 'userId' });

const user = toSignal(
  toObservable(userId).pipe(
    switchMap(id => fakeApi.user(id)),
    // ❗ id = 13 trả lỗi 500 → cả stream chết
  ),
  { initialValue: null }
);

ui.text('userId', userId);
ui.text('User', () => user()?.name ?? 'đang tải…');
watch('user', () => user()?.name ?? '…');

await sleep(600);
userId.set(13);     // luôn lỗi
await sleep(600);
userId.set(2);      // vẫn phải tải được
`,
  solution: `const userId = signal(1, { debugName: 'userId' });

const user = toSignal(
  toObservable(userId).pipe(
    switchMap(id => fakeApi.user(id).pipe(
      // ✅ catchError ở BÊN TRONG switchMap: chỉ request này thay bằng fallback,
      //    stream ngoài vẫn sống
      catchError(err => of({ id, name: '(lỗi)' })),
    )),
  ),
  { initialValue: null }
);

ui.text('userId', userId);
ui.text('User', () => user()?.name ?? 'đang tải…');
watch('user', () => user()?.name ?? '…');

await sleep(600);
userId.set(13);
await sleep(600);
userId.set(2);
`,
  hint: 'Đặt catchError trong pipe của fakeApi.user(id), tức là bên trong switchMap, không đặt sau switchMap.',
  explain: 'catchError đặt ngoài switchMap thì stream ngoài bị thay bằng of(fallback) rồi complete, nên các lần đổi id sau bị bỏ qua. Đặt bên trong thì chỉ request lỗi bị thay. Trong thực tế có thể trả về giá trị fallback, hoặc set một signal error để hiển thị thông báo.',
  check(a) {
    const v = a.values('user');
    const last = v[v.length - 1];
    if (a.errors.length) return NO('Có lỗi chưa xử lý: ' + a.errMsg() + '. Cần catchError.');
    if (last === 'User 2' && v.includes('(lỗi)')) return OK();
    if (last === '(lỗi)') return NO('Đã hiện "(lỗi)" nhưng id 2 không tải được. catchError đang đặt ngoài switchMap nên stream đã complete.');
    if (last === 'User 2') return NO('Không thấy "(lỗi)" khi id = 13. Fallback cần có name: \'(lỗi)\'.');
    return NO('Lane user: ' + show(v) + '.');
  } },

{ id: 'fork-join', group: 'Gọi HTTP thường ngày', title: 'Gọi song song với forkJoin', level: 'Trung bình', lv: 2, waitMs: 1300,
  desc: `<p>Màn hình Dashboard cần <b>user</b> và <b>danh sách bài viết</b>. Hai request không phụ thuộc nhau mà lại gọi tuần tự (chờ cái này xong mới gọi cái kia) thì màn hình chậm gấp đôi.</p>
<table><tr><th>Toán tử</th><th>Khi nào dùng</th></tr>
<tr><td><code>forkJoin</code></td><td>Chạy song song, chờ <b>tất cả complete</b>, phát 1 lần (hợp với HTTP)</td></tr>
<tr><td><code>combineLatest</code></td><td>Phát mỗi khi một nguồn đổi (hợp với stream sống lâu)</td></tr>
<tr><td><code>switchMap</code> lồng nhau</td><td>Khi request sau <b>cần kết quả</b> của request trước</td></tr></table>
<p><b>Yêu cầu:</b> dashboard phải có dữ liệu <b>trước 700ms</b> (hiện tại mất khoảng 900ms).</p>`,
  starter: `// ❗ Gọi tuần tự: chờ user xong mới gọi posts
const dashboard$ = fakeApi.user(1).pipe(
  switchMap(user => fakeApi.posts(1).pipe(
    map(posts => ({ user, posts })),
  )),
);

const dashboard = toSignal(dashboard$, { initialValue: null });

ui.text('User', () => dashboard()?.user.name ?? 'đang tải…');
ui.list(() => dashboard()?.posts.map(p => p.title) ?? []);
watch('dashboard', dashboard);
`,
  solution: `const dashboard$ = forkJoin({
  user: fakeApi.user(1),
  posts: fakeApi.posts(1),
});

const dashboard = toSignal(dashboard$, { initialValue: null });

ui.text('User', () => dashboard()?.user.name ?? 'đang tải…');
ui.list(() => dashboard()?.posts.map(p => p.title) ?? []);
watch('dashboard', dashboard);
`,
  hint: 'forkJoin({ user: fakeApi.user(1), posts: fakeApi.posts(1) }) phát ra { user, posts }.',
  explain: 'Lưu ý: forkJoin chỉ phát khi mọi nguồn complete. Nếu một nguồn không bao giờ complete (ví dụ interval) thì nó không bao giờ phát. Một nguồn lỗi thì cả forkJoin lỗi, nên cần catchError cho từng nguồn nếu muốn hiển thị từng phần.',
  check(a) {
    const ev = a.events('dashboard').filter((e) => e.type === 'next' && !!(e.value as Any)?.user && !!(e.value as Any)?.posts);
    if (!ev.length) return NO('Chưa có giá trị dashboard dạng { user, posts }.');
    const t = ev[0].t;
    const reqs = a.http('/users');
    if (t >= 700) return NO('Dashboard có dữ liệu lúc ' + t + 'ms, vẫn chậm. Hai request đang chạy tuần tự.');
    if (reqs.length >= 2 && Math.abs(reqs[0].t - reqs[1].t) > 60) return NO('Hai request không bắt đầu cùng lúc.');
    return OK('Dashboard có dữ liệu lúc ' + t + 'ms.');
  } },

{ id: 'retry', group: 'Gọi HTTP thường ngày', title: 'Mạng chập chờn: retry', level: 'Trung bình', lv: 2, waitMs: 2300,
  desc: `<p><code>fakeApi.flaky()</code> mô phỏng mạng chập chờn: <b>2 lần đầu lỗi</b>, lần thứ 3 mới thành công.</p>
<p><b>Yêu cầu:</b> thử lại tối đa <b>3 lần</b>, mỗi lần <b>cách 300ms</b>. Nếu vẫn lỗi thì trả về <code>'fallback'</code>. Kết quả cuối ở lane <code>data</code> phải là <code>'OK (lần 3)'</code>.</p>`,
  starter: `const data = toSignal(
  fakeApi.flaky().pipe(
    // TODO: thử lại tối đa 3 lần, cách nhau 300ms
    // TODO: hết lượt vẫn lỗi thì trả về 'fallback'
  ),
  { initialValue: 'đang tải…' }
);

ui.text('Kết quả', data);
watch('data', data);
`,
  solution: `const data = toSignal(
  fakeApi.flaky().pipe(
    retry({ count: 3, delay: 300 }),
    catchError(() => of('fallback')),
  ),
  { initialValue: 'đang tải…' }
);

// Backoff tăng dần:
// retry({ count: 3, delay: (err, n) => timer(300 * 2 ** (n - 1)) })

ui.text('Kết quả', data);
watch('data', data);
`,
  hint: 'retry({ count: 3, delay: 300 }) rồi catchError(() => of(\'fallback\')). Thứ tự quan trọng: retry phải đứng trước catchError.',
  explain: 'retry subscribe lại Observable nguồn, tức là gửi lại request. Chỉ retry những lỗi tạm thời (mạng, 503). Lỗi 400/401 thì retry vô ích. Có thể kiểm tra err trong hàm delay và throwError để dừng sớm.',
  check(a) {
    const reqs = a.http('/flaky');
    const v = a.values('data');
    if (a.errors.length) return NO('Có lỗi chưa xử lý: ' + a.errMsg() + '.');
    const last = v[v.length - 1];
    if (last === 'fallback' && reqs.length < 3) return NO('Ra "fallback" sau ' + reqs.length + ' request: catchError đứng trước retry nên lỗi bị nuốt mất và retry không chạy. Hãy đặt retry trước.');
    if (reqs.length < 3) return NO('Chỉ có ' + reqs.length + ' request, cần thử lại cho đến khi thành công.');
    if (last === 'fallback') return NO('Ra "fallback": count quá nhỏ.');
    if (last !== 'OK (lần 3)') return NO('Giá trị cuối: ' + show(last) + '.');
    for (let i = 1; i < reqs.length; i++) {
      if (reqs[i].t - (reqs[i - 1].tEnd ?? 0) < 250) return NO('Các lần thử lại cách nhau quá gần, cần delay 300ms.');
    }
    return OK();
  } },

{ id: 'share-replay', group: 'Gọi HTTP thường ngày', title: 'Cache với shareReplay', level: 'Trung bình', lv: 2, waitMs: 1700,
  desc: `<p>Observable từ HTTP là <b>cold</b>: mỗi lần subscribe là một lần gọi API. Ba phần của trang cùng cần <code>config</code> thì sẽ gọi API 3 lần.</p>
<p><b>Yêu cầu:</b> chỉ gọi <b>đúng 1 request</b>. Cả 3 subscriber nhận kết quả, và subscriber <code>late</code> vào muộn (1000ms) cũng lấy từ cache, không gọi lại.</p>`,
  starter: `// ❗ mỗi subscribe là một request
const config$ = fakeApi.config();

config$.subscribe(spy('header'));
config$.subscribe(spy('sidebar'));
config$.subscribe(spy('footer'));

await sleep(1000);
config$.subscribe(spy('late'));   // vào muộn
`,
  solution: `const config$ = fakeApi.config().pipe(
  shareReplay({ bufferSize: 1, refCount: false }),   // = shareReplay(1)
);

config$.subscribe(spy('header'));
config$.subscribe(spy('sidebar'));
config$.subscribe(spy('footer'));

await sleep(1000);
config$.subscribe(spy('late'));   // lấy từ cache
`,
  hint: 'Thêm .pipe(shareReplay(1)). Dùng share() thì subscriber vào muộn vẫn gây request mới.',
  explain: 'Trong service, shareReplay(1) thường dùng để cache dữ liệu ít đổi (config, danh mục). share() chỉ chia sẻ khi các subscriber đến cùng lúc. Nếu đã chuyển sang signal thì toSignal hoặc rxResource trong service cũng là một dạng cache.',
  check(a) {
    const n = a.http('/config').length;
    const lanes = ['header', 'sidebar', 'footer', 'late'];
    const miss = lanes.filter((l) => !a.values(l).length);
    if (n === 1 && !miss.length) return OK();
    if (n === 2) return NO('Có 2 request: subscriber "late" gây request mới. share() không giữ lại giá trị, hãy dùng shareReplay(1).');
    if (n > 2) return NO('Có ' + n + ' request. Cần chia sẻ một request cho mọi subscriber.');
    return NO('Lane chưa nhận dữ liệu: ' + miss.join(', ') + '.');
  } },

{ id: 'polling', group: 'Gọi HTTP thường ngày', title: 'Polling đến khi xong', level: 'Khó', lv: 3, waitMs: 2700,
  desc: `<p>Theo dõi tiến độ một job (xuất báo cáo, upload…): cứ 400ms hỏi server một lần, <b>dừng</b> khi <code>status === 'done'</code>. Code hiện tại hỏi mãi không dừng, gây lãng phí và rò rỉ.</p>
<p><b>Yêu cầu:</b> dừng polling ngay sau khi nhận <code>done</code>, và <b>vẫn phát</b> giá trị <code>done</code> ra UI. Phải có đúng <b>4 request</b>.</p>`,
  starter: `const job$ = interval(400).pipe(
  switchMap(() => fakeApi.job(42)),
  // TODO: dừng ngay sau khi status === 'done' (vẫn phát giá trị done)
);

const job = toSignal(job$, { initialValue: { progress: 0, status: 'pending' } });

ui.text('Tiến độ', () => job().progress + '% — ' + job().status);
watch('job', () => job().progress + '% ' + job().status);
`,
  solution: `const job$ = timer(0, 400).pipe(           // timer(0, …): hỏi ngay lần đầu
  switchMap(() => fakeApi.job(42)),
  takeWhile(j => j.status !== 'done', true), // true = vẫn phát giá trị làm dừng
);

const job = toSignal(job$, { initialValue: { progress: 0, status: 'pending' } });

ui.text('Tiến độ', () => job().progress + '% — ' + job().status);
watch('job', () => job().progress + '% ' + job().status);
`,
  hint: 'takeWhile(j => j.status !== \'done\', true). Tham số inclusive = true để giá trị done vẫn được phát.',
  explain: 'Thiếu inclusive thì UI dừng ở 75% và không bao giờ thấy done. Nếu request có thể chậm hơn chu kỳ polling, dùng exhaustMap thay cho switchMap để không huỷ request đang chạy.',
  check(a) {
    const n = a.http('/jobs').length;
    const v = a.values('job');
    const last = v[v.length - 1];
    if (n > 4) return NO('Có ' + n + ' request: vẫn hỏi tiếp sau khi job đã done.');
    if (last === '75% running' && n === 4) return NO('Đã dừng đúng lúc nhưng UI không thấy "done". Thêm tham số inclusive = true cho takeWhile.');
    if (n < 4) return NO('Chỉ có ' + n + ' request, dừng quá sớm.');
    if (last !== '100% done') return NO('Giá trị cuối: ' + show(last) + ', cần "100% done".');
    return OK();
  } },

{ id: 'rx-resource', group: 'Gọi HTTP thường ngày', title: 'rxResource: tải theo id', level: 'Trung bình', lv: 2, waitMs: 1300,
  desc: `<p><code>rxResource</code> tự tải lại khi <code>params</code> đổi, tự huỷ request cũ, và có sẵn <code>value()</code>, <code>isLoading()</code>, <code>error()</code>, <code>status()</code>, <code>reload()</code>. Nó thay được combo <code>toObservable → switchMap → toSignal</code> cùng các signal loading/error tự viết.</p>
<p><b>Yêu cầu:</b> tải user theo <code>userId</code>. Khi kiểm tra, trang sẽ bấm <b>Sau ▶</b> 3 lần thật nhanh (id 2, 3, 4). Request cũ phải bị huỷ, và lane <code>name</code> cuối cùng là <code>User 4</code>.</p>
<div class="tip"><code>rxResource</code> là API stable từ Angular 22 (trong <code>@angular/core/rxjs-interop</code>).</div>`,
  starter: `const userId = signal(1, { debugName: 'userId' });

// TODO: tạo rxResource tải user theo userId
// const user = rxResource({
//   params: () => ({ id: userId() }),
//   stream: ({ params }) => ...,
// });

ui.button('◀ Trước', () => userId.update(id => Math.max(1, id - 1)));
ui.button('Sau ▶', () => userId.update(id => id + 1));
ui.text('userId', userId);
// ui.text('Trạng thái', user.status);
// ui.text('Tên', () => user.isLoading() ? 'đang tải…' : user.value()?.name);
// watch('name', () => user.value()?.name);
`,
  solution: `const userId = signal(1, { debugName: 'userId' });

const user = rxResource({
  params: () => ({ id: userId() }),                  // đọc signal ở đây → được theo dõi
  stream: ({ params }) => fakeApi.user(params.id),   // trả về Observable
});

ui.button('◀ Trước', () => userId.update(id => Math.max(1, id - 1)));
ui.button('Sau ▶', () => userId.update(id => id + 1));
ui.button('↻ Tải lại', () => user.reload());
ui.text('userId', userId);
ui.text('Trạng thái', user.status);
ui.text('Tên', () => user.isLoading() ? 'đang tải…' : user.value()?.name);
watch('name', () => user.value()?.name);
`,
  hint: 'stream: ({ params }) => fakeApi.user(params.id). Nhớ bỏ comment các dòng ui.text và watch.',
  explain: 'Chỉ các signal đọc trong params mới được theo dõi; đọc signal trong stream không làm resource tải lại. params trả về undefined thì resource ở trạng thái idle, không gọi API (hợp cho trường hợp "chưa chọn gì").',
  simulate(s) { s.at(100, () => s.click('Sau')); s.at(200, () => s.click('Sau')); s.at(300, () => s.click('Sau')); },
  check(a) {
    const v = a.values('name');
    if (!a.lanes().includes('name')) return NO('Chưa có lane "name". Bỏ comment dòng watch(\'name\', ...).');
    const cancelled = a.http('/users').filter((h) => h.status === 'cancelled').length;
    const last = v[v.length - 1];
    if (last !== 'User 4') return NO('Tên cuối là ' + show(last) + ', cần "User 4".');
    if (cancelled < 2) return NO('Request cũ không bị huỷ khi đổi id.');
    return OK();
  } },

/* ================= Sự kiện người dùng ================= */
{ id: 'exhaust-map', group: 'Sự kiện người dùng', title: 'Nút Lưu: chống bấm liên tục', level: 'Trung bình', lv: 2, waitMs: 1800,
  desc: `<p>Bốn toán tử "flattening" quyết định chuyện gì xảy ra khi sự kiện mới đến lúc việc cũ <b>chưa xong</b>:</p>
<table><tr><th>Toán tử</th><th>Hành vi</th><th>Dùng cho</th></tr>
<tr><td><code>switchMap</code></td><td>Huỷ việc cũ, làm việc mới</td><td>Search, đổi bộ lọc, đổi route</td></tr>
<tr><td><code>mergeMap</code></td><td>Chạy song song tất cả</td><td>Xoá nhiều item, upload nhiều file</td></tr>
<tr><td><code>concatMap</code></td><td>Xếp hàng, làm lần lượt</td><td>Thao tác cần đúng thứ tự</td></tr>
<tr><td><code>exhaustMap</code></td><td>Bỏ qua sự kiện mới khi đang bận</td><td>Nút Lưu/Đăng nhập, refresh</td></tr></table>
<p><b>Yêu cầu:</b> trang sẽ bấm Lưu lúc 0, 100, 200 và 900ms. Chỉ được gửi <b>2 request</b> và không request nào bị huỷ. Thêm điểm: dùng signal <code>saving</code> để hiện trạng thái.</p>`,
  starter: `const saveClick$ = ui.button('💾 Lưu');
const saving = signal(false, { debugName: 'saving' });
ui.text('Đang lưu?', saving);

saveClick$.pipe(
  mergeMap(() => fakeApi.save({ title: 'Bài viết mới' })),   // ❗ đổi toán tử
  takeUntilDestroyed(),
).subscribe(spy('saved'));
`,
  solution: `const saveClick$ = ui.button('💾 Lưu');
const saving = signal(false, { debugName: 'saving' });
ui.text('Đang lưu?', saving);

saveClick$.pipe(
  exhaustMap(() => {
    saving.set(true);
    return fakeApi.save({ title: 'Bài viết mới' }).pipe(
      finalize(() => saving.set(false)),   // chạy cả khi thành công, lỗi hay bị huỷ
    );
  }),
  takeUntilDestroyed(),
).subscribe(spy('saved'));
`,
  hint: 'exhaustMap bỏ qua các click đến khi request hiện tại hoàn tất.',
  explain: 'Vẫn nên disable nút khi saving() là true để báo cho người dùng biết. exhaustMap là lớp bảo vệ ở tầng logic. finalize thích hợp để tắt trạng thái loading vì nó chạy trong mọi trường hợp.',
  simulate(s) { [0, 100, 200, 900].forEach((t) => s.at(t, () => s.click('Lưu'))); },
  check(a) {
    const reqs = a.http('/save');
    const n = reqs.length, cancelled = reqs.filter((h) => h.status === 'cancelled').length;
    if (n === 2 && !cancelled) return OK();
    if (cancelled) return NO('Có ' + cancelled + ' request bị huỷ giữa chừng: switchMap huỷ lần lưu đang chạy, dữ liệu có thể đã ghi hoặc chưa.');
    if (n > 2) return NO('Có ' + n + ' request: các lần bấm trong lúc đang lưu vẫn sinh request (mergeMap chạy song song, concatMap xếp hàng). Chúng phải bị bỏ qua.');
    return NO('Có ' + n + ' request, mong đợi 2.');
  } },

{ id: 'load-more', group: 'Sự kiện người dùng', title: 'Tải thêm: scan + concatMap', level: 'Khó', lv: 3, waitMs: 2000,
  desc: `<p>Danh sách có nút <b>Tải thêm</b> (hoặc infinite scroll): tải trang 1 khi mở màn hình, mỗi lần bấm thì tải trang tiếp theo và <b>gộp</b> vào danh sách cũ. Người dùng bấm nhanh 2 lần thì cũng không được mất trang nào.</p>
<p><b>Yêu cầu:</b> trang sẽ bấm 2 lần liền (700ms và 760ms). Kết quả: đủ <b>15 item</b> (3 trang, mỗi trang 5 item), không request nào bị huỷ.</p>
<div class="tip">Gợi ý toán tử: <code>startWith</code> (phát giá trị đầu), <code>scan</code> (tích luỹ như reduce nhưng phát từng bước), <code>concatMap</code>.</div>`,
  starter: `const loadMore$ = ui.button('⬇ Tải thêm');

// ❗ Hiện tại: chưa tải trang 1 khi mở, mỗi lần bấm THAY danh sách,
//    và bấm nhanh thì trang trước bị huỷ.
const items$ = loadMore$.pipe(
  map((_, i) => i + 1),              // số trang: 1, 2, 3…
  switchMap(page => fakeApi.page(page)),
);

const items = toSignal(items$, { initialValue: [] });

ui.list(items);
watch('items', () => items().length);
`,
  solution: `const loadMore$ = ui.button('⬇ Tải thêm');

const items$ = loadMore$.pipe(
  startWith(null),                         // tải trang 1 ngay khi mở
  map((_, i) => i + 1),                    // 1, 2, 3…
  concatMap(page => fakeApi.page(page)),   // lần lượt, không mất trang nào
  scan((all, page) => [...all, ...page], []),
);

const items = toSignal(items$, { initialValue: [] });

ui.list(items);
watch('items', () => items().length);
`,
  hint: 'startWith(null) → map((_, i) => i + 1) → concatMap(page => fakeApi.page(page)) → scan((all, page) => [...all, ...page], [])',
  explain: 'scan giữ state tích luỹ bên trong stream. Cách làm theo kiểu signal: items = signal([]), và mỗi khi tải xong thì items.update(all => [...all, ...page]). Hai cách đều dùng được.',
  simulate(s) { s.at(700, () => s.click('Tải thêm')); s.at(760, () => s.click('Tải thêm')); },
  check(a) {
    const v = a.values('items');
    const reqs = a.http('/items');
    const cancelled = reqs.filter((h) => h.status === 'cancelled').length;
    const last = v[v.length - 1];
    if (last === 15 && !cancelled) return OK();
    if (!reqs.length || reqs[0].arg !== 1 || reqs[0].t > 150) return NO('Trang 1 chưa được tải ngay khi mở. Dùng startWith().');
    if (cancelled) return NO('Có trang bị huỷ khi bấm nhanh: switchMap không hợp ở đây.');
    if (last === 5) return NO('Danh sách bị thay thế thay vì gộp. Dùng scan để tích luỹ.');
    return NO('Số item cuối: ' + show(last) + ', cần 15.');
  } },

/* ================= Dọn dẹp & kiến trúc ================= */
{ id: 'take-until-destroyed', group: 'Dọn dẹp & kiến trúc', title: 'Rò rỉ subscription', level: 'Dễ', lv: 1, waitMs: 1500,
  desc: `<p>Subscribe thủ công trong component mà không huỷ thì khi component bị destroy, subscription <b>vẫn chạy</b>. Hậu quả là rò rỉ bộ nhớ, gọi API thừa, và lỗi khó hiểu khi code cập nhật một component đã chết.</p>
<p><b>Yêu cầu:</b> khi kiểm tra, trang sẽ <b>destroy component lúc 700ms</b> (vạch đỏ trên Timeline). Sau thời điểm đó lane <code>tick</code> không được phát gì nữa.</p>
<table><tr><th>Cách</th><th>Ghi chú</th></tr>
<tr><td><code>takeUntilDestroyed()</code></td><td>Gọn nhất, dùng trong constructor/field</td></tr>
<tr><td><code>toSignal()</code></td><td>Tự huỷ, không cần subscribe</td></tr>
<tr><td><code>destroyRef.onDestroy(() => sub.unsubscribe())</code></td><td>Dùng khi subscribe ở nơi khác</td></tr></table>`,
  starter: `// Code này chạy như trong constructor của component
interval(200).pipe(
  map(i => 'tick ' + i),
).subscribe(spy('tick'));
`,
  solution: `interval(200).pipe(
  map(i => 'tick ' + i),
  takeUntilDestroyed(),          // complete khi component destroy
).subscribe(spy('tick'));

// Cách khác:
// const sub = interval(200).subscribe(spy('tick'));
// destroyRef.onDestroy(() => sub.unsubscribe());
`,
  hint: 'Thêm takeUntilDestroyed() làm toán tử cuối cùng trong pipe.',
  explain: 'Nên đặt takeUntilDestroyed ở cuối pipe. Đặt trước switchMap hay mergeMap thì các inner Observable vẫn có thể sống tiếp. Ngoài constructor (ví dụ trong ngOnInit) phải truyền vào: takeUntilDestroyed(this.destroyRef).',
  simulate(s) { s.at(700, () => s.destroy()); },
  check(a) {
    const d = a.destroyedAt;
    if (d == null) return NO('Component chưa được destroy (lỗi mô phỏng). Thử lại.');
    const before = a.events('tick').filter((e) => e.type === 'next' && e.t <= d + 5).length;
    const after = a.events('tick').filter((e) => e.type === 'next' && e.t > d + 5);
    if (!before) return NO('Lane "tick" chưa có giá trị nào trước khi destroy.');
    if (after.length) return NO('Sau khi destroy vẫn có ' + after.length + ' tick: subscription bị rò rỉ.');
    return OK();
  } },

{ id: 'store', group: 'Dọn dẹp & kiến trúc', title: 'Service store bằng signal', level: 'Khó', lv: 3, waitMs: 500,
  desc: `<p>Pattern phổ biến trong Angular hiện đại để thay <code>BehaviorSubject</code> trong service:</p>
<ul><li>State <b>private</b> dạng <code>signal</code>: chỉ store được sửa</li>
<li>Bên ngoài chỉ thấy bản <b>readonly</b> (<code>asReadonly()</code>) và các <code>computed</code></li>
<li>Muốn đổi state thì gọi <b>method</b> (<code>add</code>, <code>remove</code>…)</li></ul>
<p><b>Yêu cầu:</b> hoàn thiện <code>CartStore</code> với <code>items</code> (readonly), <code>count</code>, <code>total</code> (computed), <code>add(product)</code> và <code>remove(id)</code>. Lane <code>total</code>: <code>200 → 500 → 300</code>.</p>`,
  starter: `class CartStore {
  // TODO: state private:   #items = signal([])
  // TODO: items = readonly, count & total = computed
  // TODO: add(product), remove(id) — nhớ trả về mảng mới
}

const store = new CartStore();   // trong Angular: inject(CartStore)

ui.list(() => store.items().map(i => i.name + ' — ' + i.price));
ui.text('Số món', () => store.count());
ui.text('Tổng', () => store.total());
watch('total', () => store.total());

store.add({ id: 1, name: 'Áo thun', price: 200 });
await sleep(100);
store.add({ id: 2, name: 'Quần jean', price: 300 });
await sleep(100);
store.remove(1);
`,
  solution: `class CartStore {
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

ui.list(() => store.items().map(i => i.name + ' — ' + i.price));
ui.text('Số món', () => store.count());
ui.text('Tổng', () => store.total());
watch('total', () => store.total());

store.add({ id: 1, name: 'Áo thun', price: 200 });
await sleep(100);
store.add({ id: 2, name: 'Quần jean', price: 300 });
await sleep(100);
store.remove(1);
`,
  hint: 'Field private #items = signal([]); items = this.#items.asReadonly(); add/remove dùng this.#items.update(...).',
  explain: 'Trong Angular viết là @Injectable({ providedIn: \'root\' }) export class CartStore { private readonly _items = signal<Item[]>([]); readonly items = this._items.asReadonly(); … }. Component chỉ đọc store.items() và gọi method, không set trực tiếp.',
  check(a, code) {
    const v = a.values('total');
    if (a.errors.length && !v.length) return NO('Có lỗi: ' + a.errMsg() + '.');
    if (!same(v, [200, 500, 300])) return NO('Lane total: ' + show(v) + ', mong đợi [200, 500, 300].');
    if (!/asReadonly\s*\(/.test(code)) return NO('Kết quả đúng, nhưng items cần là readonly (dùng asReadonly()) để bên ngoài không set được.');
    return OK();
  } },
];
