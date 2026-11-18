# Bíp Học Angular 🤖

Website học Angular **trực quan, tương tác, phong cách hoạt hình**. Người học *nhìn thấy* cơ chế bên trong Angular chạy qua các visualizer có step-player (▶ ⏸ ⏭ + tốc độ), thay vì chỉ đọc chữ.

- Angular **22** (standalone, signals, `@if/@for`, zoneless mặc định, `inject()`, `@Service()`)
- Chỉ frontend, mọi dữ liệu/HTTP đều mock
- Animation: CSS + SVG, nét vẽ tay bằng **rough.js**; highlight code bằng **Shiki** (lazy-load)
- **Tailwind CSS v4** chỉ được dùng bên trong bài 15 (site chính dùng design tokens riêng)
- Bài nâng cao dùng thêm **@angular/aria** (tabs headless) và **@ngrx/signals** (SignalStore)
- Tiến độ + huy hiệu lưu `localStorage` (bọc try/catch); sáng/tối; tôn trọng `prefers-reduced-motion`

> **Trạng thái: 23 bài** — 15 bài lộ trình chính + 8 bài trên 4 **đảo phụ nâng cao** (mỗi bài đủ 7 phần), trang chủ bản đồ khái niệm hình đảo có cầu nối sang đảo phụ, trang Angular vs React, style guide, huy hiệu và màn ăn mừng khi xong lộ trình.

| Đảo phụ | Bài |
| --- | --- |
| Nền Móng+ | 16 Content projection · 17 Component động |
| Template+ | 18 Hiệu năng render · 19 Accessibility & Angular Aria |
| Dịch Vụ+ | 20 DI nâng cao · 21 SSR & Hydration |
| Phản Ứng+ | 22 RxJS flattening & race condition · 23 State lớn với SignalStore |

Bài nâng cao có chip "Nâng cao" ở đầu trang và một khu riêng trên bản đồ sidebar. Màn ăn mừng lớn vẫn chỉ tính 15 bài chính; đảo phụ có huy hiệu riêng ("Người qua cầu", "Huyền thoại đảo phụ").
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
│  ├─ base.css         ← reset, nền chấm bi/doodle, lớp tiện ích .toon .btn .chip, keyframes
│  └─ code.css         ← khung code "sạch" (không hoạt hình hoá)
├─ app/
│  ├─ core/            ← service toàn app: progress, theme, motion, sound, feedback (toast/confetti), safe-storage
│  ├─ layout/          ← shell, sidebar bản đồ màn chơi (level-map), chú giải màu, toasts
│  ├─ shared/ui/       ← component dùng chung (xem bên dưới)
│  ├─ content/         ← lesson.model.ts, lessons.registry.ts (lộ trình 14 bài), badges.ts
│  └─ features/
│     ├─ home/ (concept-map.ts) angular-vs-react/ style-guide/ coming-soon/ not-found/
│     └─ lessons/<tên-bài>/
│        ├─ <bài>.page.ts         ← lắp 7 phần bằng <app-lesson-layout>
│        ├─ <bài>.visualizer.*    ← visualizer + logic sinh các bước
│        ├─ <bài>.content.ts      ← TOÀN BỘ chữ: ẩn dụ, code mẫu, thử thách, lỗi thường gặp, quiz
│        ├─ <bài>.samples.ts      ← SINH TỰ ĐỘNG từ demo/ (đừng sửa tay)
│        └─ demo/                 ← component thật chạy trong khung "Kết quả live" + file .samples
```

### Component dùng chung (`shared/ui`)

| Component | Vai trò |
|---|---|
| `mascot` | Linh vật Bíp (SVG), input `mood`: `happy · thinking · surprised · sad · celebrate · wave` |
| `speech-bubble` / `mascot-says` | Bong bóng thoại, Bíp + bong bóng |
| `rough` (`appRough`, `appArrow`) | Hình và mũi tên vẽ tay (rough.js, seed cố định, có cache) |
| `step-player` + `step-timeline` | Bộ phát từng bước dùng chung; mỗi bước mang một *frame* đầy đủ nên tua lui/tới rất rẻ |
| `code-panel` | Tab nhiều file, Shiki, copy, **Mở trên StackBlitz**, highlight dòng theo anchor |
| `anchor` (`LessonContext` + `appAnchor`) | Hover code ↔ visualizer hai chiều; báo hoàn thành thử thách |
| `lesson-layout` | Khung 7 phần thống nhất cho mọi bài |
| `tree-diagram` | Cây tổng quát (bố cục tự động, dây nối vẽ tay, node là template tuỳ ý) — khu phố component, cây FormGroup, thanh tra change detection |
| `marble-diagram` | Băng chuyền marble cho RxJS, có đầu đọc thời gian |
| `quiz`, `badge`, `confetti`, `browser-frame`, `icon` | Như tên gọi |

---

## Thêm một bài học mới

1. Thêm một dòng vào `content/lessons.registry.ts` (và toạ độ ghim trong `features/home/concept-map.ts`). Bài nâng cao thì đặt `tier: 'advanced'` và `island: '<tên đảo phụ>'`.
2. Tạo `features/lessons/<slug>/`:
   - `<slug>.content.ts`: một object `LessonContent` (ẩn dụ, intro, code + `anchors`, 1–3 `challenges`, 2–4 `pitfalls`, 3 câu `quiz`).
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
- **Viền, bóng, bo góc** `--border-w`, `--shadow-offset`, `--radius*`.
- **Font, easing** `--font-*`, `--ease-bounce`…
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
- **Bài Hiệu năng**: số ms trong visualizer là mô hình minh hoạ; con số trong demo live (danh sách 5.000 dòng) được đo thật bằng `afterNextRender`.

## Chưa làm / có thể làm tiếp

- Nút "Mở trên StackBlitz" chưa được thử trên StackBlitz thật (cần mạng; trong khung preview của claude.ai thì bị chặn mở cửa sổ mới).
- Chưa có kiểm thử end-to-end tự động trong repo (đã kiểm tra bằng Playwright khi phát triển).
- Nội dung chỉ có tiếng Việt; chưa có i18n.
