# Bíp Học Angular 🤖

Website học Angular **trực quan, tương tác, phong cách đơn giản hiện đại** (vẫn có linh vật Bíp). Người học *nhìn thấy* cơ chế bên trong Angular chạy qua các visualizer có step-player (▶ ⏸ ⏭ + tốc độ), thay vì chỉ đọc chữ.

- Angular **22** (standalone, signals, `@if/@for`, zoneless mặc định, `inject()`, `@Service()`)
- Chỉ frontend, mọi dữ liệu/HTTP đều mock
- Giao diện: font **Be Vietnam Pro**, viền 1px, bóng mềm, sơ đồ SVG nét sạch (rough.js với roughness 0); highlight code bằng **Shiki** (lazy-load)
- **Tailwind CSS v4** chỉ được dùng bên trong bài 15 (site chính dùng design tokens riêng)
- Bài nâng cao dùng thêm **@angular/aria** (tabs headless) và **@ngrx/signals** (SignalStore)
- Mỗi bài mở đầu bằng **định nghĩa chuyên ngành**; ẩn dụ chỉ xuất hiện ở khung "Hình dung" ngay trên visualizer, kèm bảng ánh xạ hình ảnh → thuật ngữ
- Tiến độ + huy hiệu lưu `localStorage` (bọc try/catch); sáng/tối; tôn trọng `prefers-reduced-motion`

> **Trạng thái: 27 bài** — 15 bài lộ trình chính + 12 bài trên 8 **nhánh nâng cao** (mỗi bài đủ 7 phần), lộ trình ở sidebar có nhánh rẽ sang bài nâng cao, style guide, huy hiệu và màn ăn mừng khi xong lộ trình.

| Nhánh (rẽ sau bài) | Bài |
| --- | --- |
| Nền Móng+ (sau 4 Lifecycle) | 16 Content projection · 17 Component động |
| Template+ (sau 5 Control flow) | 18 Accessibility & Angular Aria |
| Dịch Vụ+ (sau 7 Dependency Injection) | 19 DI nâng cao |
| Phản Ứng+ (sau 9 RxJS) | 20 Subject & multicast · 21 RxJS flattening & race condition · 22 State lớn với SignalStore |
| Điều Hướng+ (sau 11 Routing) | 23 Routing nâng cao |
| Biểu Mẫu+ (sau 12 Forms) | 24 Reactive Forms |
| Kiểm Thử+ (sau 13 HTTP) | 25 Testing với TestBed |
| Hiệu Năng+ (sau 14 @defer) | 26 Hiệu năng render · 27 SSR & Hydration |

Bài nâng cao có chip "Nâng cao" ở đầu trang. Trên bản đồ sidebar, đường chính đi qua 15 bài; mỗi đảo phụ rẽ nhánh ngay sau bài nền tảng của nó (xem cột "rẽ sau bài" ở bảng trên) (cấu hình ở `ISLAND_BRANCHES` trong `lessons.registry.ts`). Màn ăn mừng lớn vẫn chỉ tính 15 bài chính; đảo phụ có huy hiệu riêng ("Người qua cầu", "Huyền thoại đảo phụ").
>
> Bản chạy thật: https://danhdelrey.github.io/bip-hoc-angular/

---

## Chạy dự án

Yêu cầu Node **22.22.3+**, **24.15+** hoặc **26+** (theo `engines` của Angular 22).

```bash
npm install
npm start            # = ng serve → http://localhost:4200
npm run build        # bản production → dist/bip-hoc-angular/browser
npm test             # unit test (Vitest)
npm run check        # so khớp code mẫu + kiểm tra tương phản + build
```

| Script | Việc làm |
|---|---|
| `npm run gen:samples` | Sinh lại `<bài>.samples.ts` từ các file trong `demo/` (liệt kê trong `demo/.samples`) |
| `npm run check:samples` | Đảm bảo code **hiển thị** cho người học trùng với component **thật** đang chạy trong khung "Kết quả live" |
| `npm run check:contrast` | Kiểm tra các cặp màu chữ/nền đạt WCAG AA ở cả 2 theme |

### Deploy lên GitHub Pages

Workflow `.github/workflows/deploy.yml` tự chạy mỗi khi push lên `main`: kiểm tra code mẫu, tương phản, unit test, rồi build và đẩy kết quả lên nhánh `gh-pages`.
Lần đầu tiên, vào **Settings → Pages**, chọn *Source: Deploy from a branch*, nhánh `gh-pages`, thư mục `/ (root)`.
Site sẽ có ở `https://<user>.github.io/<repo>/`.

Router dùng **hash routing** (`/#/bai/signals`) để chạy được trên mọi host tĩnh (GitHub Pages…). Muốn URL đẹp: bỏ `withHashLocation()` trong `src/app/app.config.ts` và cấu hình server trả `index.html` cho mọi đường dẫn.

---

## Cấu trúc thư mục

```
src/
├─ styles/
│  ├─ theme.css        ← FILE TOKENS DUY NHẤT: màu, viền, bóng, bo góc, font, easing (sáng + tối)
│  ├─ base.css         ← reset, typography, lớp tiện ích .toon (card) .btn .chip, keyframes
│  └─ code.css         ← khung code
├─ app/
│  ├─ core/            ← service toàn app: progress, theme, motion, sound, feedback (toast/confetti), safe-storage
│  ├─ layout/          ← shell, sidebar bản đồ màn chơi (level-map), chú giải màu, toasts
│  ├─ shared/ui/       ← component dùng chung (xem bên dưới)
│  ├─ content/         ← lesson.model.ts, lessons.registry.ts (lộ trình 14 bài), badges.ts
│  └─ features/
│     ├─ home/ style-guide/ coming-soon/ not-found/
│     └─ lessons/<tên-bài>/
│        ├─ <bài>.page.ts         ← lắp 7 phần bằng <app-lesson-layout>
│        ├─ <bài>.visualizer.*    ← visualizer + logic sinh các bước
│        ├─ <bài>.content.ts      ← TOÀN BỘ chữ: định nghĩa, ẩn dụ kèm ví dụ, code mẫu, thử thách, lỗi thường gặp, quiz
│        ├─ <bài>.samples.ts      ← SINH TỰ ĐỘNG từ demo/ (đừng sửa tay)
│        └─ demo/                 ← component thật chạy trong khung "Kết quả live" + file .samples
```

### Component dùng chung (`shared/ui`)

| Component | Vai trò |
|---|---|
| `mascot` | Linh vật Bíp (SVG), input `mood`: `happy · thinking · surprised · sad · celebrate · wave` |
| `speech-bubble` / `mascot-says` | Bong bóng thoại, Bíp + bong bóng |
| `rough` (`appRough`, `appArrow`) | Hình và mũi tên cho sơ đồ (rough.js nét sạch, seed cố định, có cache) |
| `step-player` + `step-timeline` | Bộ phát từng bước dùng chung; mỗi bước mang một *frame* đầy đủ nên tua lui/tới rất rẻ |
| `code-panel` | Tab nhiều file, Shiki, copy, **Mở trên StackBlitz**, highlight dòng theo anchor |
| `anchor` (`LessonContext` + `appAnchor`) | Hover code ↔ visualizer hai chiều; báo hoàn thành thử thách |
| `lesson-layout` | Khung 7 phần thống nhất cho mọi bài (slot tuỳ chọn: `advanced`, `practice`) |
| `tree-diagram` | Cây tổng quát (bố cục tự động, dây nối SVG, node là template tuỳ ý) — khu phố component, cây FormGroup, thanh tra change detection |
| `marble-diagram` | Băng chuyền marble cho RxJS, có đầu đọc thời gian |
| `quiz`, `badge`, `confetti`, `browser-frame`, `icon` | Như tên gọi |

---

## Thêm một bài học mới

1. Thêm một dòng vào `content/lessons.registry.ts`. Bài nâng cao thì đặt `tier: 'advanced'` và `island: '<tên đảo phụ>'`.
2. Tạo `features/lessons/<slug>/`:
   - `<slug>.content.ts`: một object `LessonContent` (`definition` chuyên ngành, `intro`, `analogy` = câu hình dung + bảng ánh xạ hình ảnh → thuật ngữ hiển thị ngay trên visualizer, code + `anchors`, 1–3 `challenges`, 2–4 `pitfalls`, 3 câu `quiz`).
   - `<slug>.visualizer.ts`: dùng `createTimeline(initialFrame, { onEnter })`. Mỗi thao tác của người học sinh ra mảng `Step<Frame>` rồi gọi `tl.load(steps)`. Gắn `appAnchor="id"` lên phần tử cần đồng bộ với code. Khi người học làm xong thử thách thì gọi `ctx.completeChallenge(id)`.
   - `demo/`: component thật đúng như code mẫu, liệt kê tên file trong `demo/.samples`, chạy `npm run gen:samples` rồi dùng `SAMPLES['ten-file.ts']` trong content.
   - `<slug>.page.ts`: `providers: [LessonContext]` và
     ```html
     <app-lesson-layout [meta]="meta" [content]="content">
       <app-x-visualizer slot="visualizer" />
       <app-x-demo slot="live" />
       <!-- tuỳ chọn: <app-x-advanced slot="advanced" /> -->
     </app-lesson-layout>
     ```
3. Thêm route lazy trong `app.routes.ts`. Bài cần provider riêng (như HTTP) hay route con (như Routing) thì dùng `loadChildren` với file `<bài>.routes.ts`.

## Đổi theme

Mọi giá trị nằm trong `src/styles/theme.css`:
- **Màu ngữ nghĩa** `--c-data / --c-event / --c-di / --c-signal / --c-error`, cùng biến thể `-strong` dùng khi màu là chữ.
- **Màu chính** `--c-primary` (nền nút, tiến độ) và `--c-primary-text` (khi là chữ).
- **Viền, bóng, bo góc** `--line`, `--border-w`, `--shadow*`, `--radius*`.
- **Font, easing** `--font-*`, `--ease-out`…
- Khối `:root[data-theme='dark']` cho chế độ tối.

Sửa xong thì chạy `npm run check:contrast`. Nếu thêm màu mới, thêm cặp tương ứng vào `scripts/check-contrast.mjs`.

## Đổi linh vật

Bíp nằm trong `shared/ui/mascot/mascot.ts` (SVG) và `mascot.css` (màu + chuyển động). Màu lấy từ token `--mascot-*` trong `theme.css`. Muốn thay nhân vật khác, giữ nguyên API `mood` + `size` thì mọi nơi dùng `<app-mascot>` vẫn chạy.

---

## Ghi chú kỹ thuật

- **Bài Routing** dùng route con thật (`bai/routing/...`): khung "Kết quả live" là `<router-outlet>` của chính app.
- **Bài HTTP** provide `HttpClient` + interceptor ở cấp route; server là interceptor giả lập nên không có request mạng nào.
- **Bài Change detection**: app chạy zoneless thật; chế độ Eager/OnPush + zone.js trong visualizer là mô phỏng theo quy tắc của Angular 22.
- **Bài Forms**: visualizer dùng Reactive forms thật, kết quả live dùng Signal forms (stable từ Angular 22).
- **Bài Tailwind**: PostCSS được bật qua `.postcssrc.json`, nhưng Tailwind chỉ được nạp trong `features/lessons/tailwind/tailwind.css`: không preflight, theme nằm trong `@layer theme` (token của site luôn thắng nếu trùng tên biến), chỉ quét class từ visualizer và thư mục `demo/` của bài (`source(none)` + `@source`). Muốn cả site dùng Tailwind thì thêm `@import "tailwindcss";` vào `src/styles.css`.

- **Bài SSR & Hydration**: GitHub Pages không có server nên visualizer là mô phỏng; demo live chạy ở trình duyệt và minh hoạ `afterNextRender` / `isPlatformBrowser`.
- **Bài Testing**: các file spec chạy THẬT bằng TestBed trong trình duyệt, qua một bộ chạy mini (`testing/demo/vitest-lite.ts`) có API giống Vitest. File spec của bài đặt tên `*.lesson-spec.ts` để `ng test` của chính site không nhặt nhầm.
- **Module luyện tập (Code Lab)**: mỗi bài có một module luyện tập **riêng**, là trang `#/luyen-tap/<slug>` (`features/practice/practice.page.ts`). Trên lộ trình ở sidebar, module này là một nhánh ngắn "Luyện tập · x/y" rẽ ra ngay dưới bài học; cuối trang bài có thẻ `<app-practice-cta>` dẫn sang. Hiện có ở bài 1–26 (bài 27 SSR & Hydration không có, vì cần server thật để minh hoạ). Thêm module cho một bài: viết `features/lessons/<slug>/<slug>.lab.ts` (một `LabModule` gồm bài luyện có `starter`, `solution`, `check()`, và `simulate()` nếu cần giả lập gõ phím, bấm nút, rê chuột hay destroy), thêm một dòng vào `content/practice.registry.ts`, rồi đặt `<app-practice-cta slot="practice" slug="<slug>" />` trong trang bài. Unit test đối chiếu `count` trong registry với file `.lab.ts`. Tiến độ luyện tập nằm ở `PracticeProgress`, riêng với tiến độ "đã hiểu" của bài.
  - Signal, effect, toSignal, rxResource, resource… là API **thật**; mỗi lần chạy có một `EnvironmentInjector` riêng (Dừng = destroy). Gọi trong component thì các API này gắn vào injector của chính component, nên bị huỷ cùng component như app thật.
  - Component của người học được **biên dịch JIT** (`@angular/compiler` tải lười) và render thật bằng `mount(App)`. Decorator class được đổi thành lời gọi hàm (`transformDecorators`), kèm metadata cho `input()/output()/model()/viewChild()…` thay cho bước JIT transform của Angular CLI. Lab chưa hỗ trợ decorator trên field (`@Input()`, `@HostListener`…) và inject qua tham số constructor. Callback của người học thuộc realm iframe, nên API nào Angular nhận dạng bằng `instanceof Function` (như `afterNextRender`) đều được bọc lại trong runtime.
  - Bản production bỏ scope của NgModule AOT, nên `FormsModule`/`ReactiveFormsModule`/`CommonModule` trong lab là NgModule JIT dựng lại bằng `labModule()` (xem `lab-forms.ts`), export đúng directive thật. Bài cần thêm globals khai báo `extras` trong `LabModule`.
  - `bootstrapApplication(App, { providers })` trong lab tạo một ứng dụng Angular **riêng** cho mỗi lần chạy (root injector riêng, huỷ khi Stop): Router dùng location giả (route hiện trên thanh địa chỉ của khung preview, không đổi URL thật), `HttpClient` nói chuyện với backend giả trong `lab-runtime.ts` (`/api/users`, `/api/users/:id`, `/api/private`, `/api/flaky`, `/api/todos`). Globals của Router/HTTP/Forms nằm ở `lab-router.ts`, `lab-http.ts`, `lab-forms.ts`.
  - Bài Tailwind biên dịch Tailwind v4 **ngay trong trình duyệt** (`lab-tailwind.ts`) cho đúng những class có trong code (như bộ quét của Tailwind), không preflight, CSS giới hạn trong `:where(.rxlab-preview)`. Mỗi lần chạy dùng một compiler mới vì `build()` của Tailwind là tăng dần.
  - `@defer` trong lab không tách chunk (JIT), nhưng trigger và `@placeholder` chạy như ứng dụng thật.
  - Bài Testing chạy `TestBed` thật ngay trong trình duyệt với một bộ chạy test nhỏ (`describe`/`it`/`expect`/`fn`, xem `lab-testing.ts`). Môi trường test dùng chính platform của trang (`platformBrowserTesting()` không tạo được khi trang đã có platform), zoneless như mặc định.
  - Globals riêng của từng lab nằm trong `shared/lab/lab-*.ts` và được nạp lười qua `extras` của `LabModule`; key `__globals(g)` trong extras nhận globals của lần chạy (log, ui, timer của iframe) để dựng những helper cần chúng.
  - RxJS chạy trong một iframe ẩn (UMD copy vào `/labs` qua `angular.json`), và code người học được biên dịch bằng `Function` của iframe (cùng realm với RxJS, cần cho `forkJoin({...})`), nên Dừng huỷ sạch mọi timer. TypeScript được bỏ type bằng `sucrase` (lazy-load).
- **Bài Hiệu năng**: số ms trong visualizer là mô hình minh hoạ; con số trong demo live (danh sách 5.000 dòng) được đo thật bằng `afterNextRender`.

## Chưa làm / có thể làm tiếp

- Nút "Mở trên StackBlitz" chưa được thử trên StackBlitz thật (cần mạng; trong khung preview của claude.ai thì bị chặn mở cửa sổ mới).
- Chưa có kiểm thử end-to-end tự động trong repo (đã kiểm tra bằng Playwright khi phát triển).
- Nội dung chỉ có tiếng Việt; chưa có i18n.
