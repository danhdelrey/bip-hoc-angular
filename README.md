# Bíp Học Angular 🤖

Website học Angular **trực quan, tương tác, phong cách hoạt hình**. Người học *nhìn thấy* cơ chế bên trong Angular chạy qua các visualizer có step-player (▶ ⏸ ⏭ + tốc độ), thay vì chỉ đọc chữ.

- Angular **22** (standalone, signals, `@if/@for`, zoneless mặc định, `inject()`, `@Service()`)
- Chỉ frontend, mọi dữ liệu/HTTP đều mock
- Animation: CSS + SVG, nét vẽ tay bằng **rough.js**; highlight code bằng **Shiki** (lazy-load)
- Tiến độ + huy hiệu lưu `localStorage` (bọc try/catch); sáng/tối; tôn trọng `prefers-reduced-motion`

> **Trạng thái: Giai đoạn 1 xong** — design tokens, linh vật Bíp, style guide, khung app, và 3 bài mẫu hoàn chỉnh: **Data binding**, **Dependency Injection**, **Signals**.

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
│     ├─ home/ style-guide/ coming-soon/ not-found/
│     └─ lessons/<tên-bài>/
│        ├─ <bài>.page.ts         ← lắp 7 phần bằng <app-lesson-layout>
│        ├─ <bài>.visualizer.*    ← visualizer + logic sinh các bước
│        ├─ <bài>.content.ts      ← TOÀN BỘ chữ: ẩn dụ, code mẫu, thử thách, lỗi thường gặp, quiz
│        └─ demo/                 ← component thật chạy trong khung "Kết quả live"
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
| `quiz`, `badge`, `confetti`, `browser-frame`, `icon` | Như tên gọi |

---

## Thêm một bài học mới

1. Trong `content/lessons.registry.ts`, đặt `available: true` cho bài đó.
2. Tạo `features/lessons/<slug>/`:
   - `<slug>.content.ts`: một object `LessonContent` (ẩn dụ, intro, code + `anchors`, 1–3 `challenges`, 2–4 `pitfalls`, 3 câu `quiz`).
   - `<slug>.visualizer.ts`: dùng `createTimeline(initialFrame, { onEnter })`. Mỗi thao tác của người học sinh ra mảng `Step<Frame>` rồi gọi `tl.load(steps)`. Gắn `appAnchor="id"` lên phần tử cần đồng bộ với code. Khi người học làm xong thử thách thì gọi `ctx.completeChallenge(id)`.
   - `demo/`: component thật đúng như code mẫu, rồi thêm cặp vào `scripts/check-samples.mjs`.
   - `<slug>.page.ts`: `providers: [LessonContext]` và
     ```html
     <app-lesson-layout [meta]="meta" [content]="content">
       <app-x-visualizer slot="visualizer" />
       <app-x-demo slot="live" />
       <!-- tuỳ chọn: <app-x-advanced slot="advanced" /> -->
     </app-lesson-layout>
     ```
3. Thêm route lazy trong `app.routes.ts` (đặt **trước** route `bai/:slug`).

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

## Chưa làm (Giai đoạn 2)

- 11 bài còn lại: Component, Input/Output/model(), Lifecycle, Control flow & Directive, Pipe, RxJS, Change detection, Routing, Forms (dự kiến so sánh template-driven / reactive / **signal forms**), HTTP & Interceptors, @defer.
- Component dùng chung `tree-diagram` (cho Component, Control flow, Forms) và `marble-diagram` (cho RxJS).
- Trang chủ dạng **bản đồ khái niệm hình đảo** (hiện là lưới lộ trình tạm).
- Trang **Angular vs React**.
- Màn ăn mừng lớn khi xong cả lộ trình (huy hiệu + confetti lớn đã có sẵn, còn thiếu màn hình riêng).
- Nút StackBlitz cần mạng và chưa được thử trên StackBlitz thật trong môi trường build này.
