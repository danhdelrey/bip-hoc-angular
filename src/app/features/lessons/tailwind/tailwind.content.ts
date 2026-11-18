import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './tailwind.samples';

const POSTCSS_JSON = `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}`;

const STYLES_CSS = `/* src/styles.css */
@import "tailwindcss";

/* Tuỳ biến theme bằng CSS (v4 không cần tailwind.config.js) */
@theme {
  --color-bip: #4cc9f0;
}`;

const SETUP_SH = `# Cách 1 — để Angular CLI tự cài:
ng add tailwindcss

# Cách 2 — cài tay:
npm install tailwindcss @tailwindcss/postcss postcss
# rồi tạo .postcssrc.json và thêm @import "tailwindcss" vào styles.css`;

export const TAILWIND: LessonContent = {
  slug: 'tailwind',
  definition:
    'Tailwind CSS là framework CSS utility-first: giao diện được dựng bằng các class nhỏ, mỗi class ứng với một vài khai báo CSS.',
  analogy: {
    text: 'Ví dụ xem các utility class như những viên gạch LEGO ghép thành giao diện.',
    map: [
      ['Viên gạch', 'một utility class'],
      ['Ghép gạch', 'tổ hợp class trên phần tử'],
      ['Bộ màu của hộp gạch', 'theme (@theme)'],
    ],
  },
  intro:
    'Tailwind CSS là framework "utility-first": thay vì viết .card { padding: 1rem }, bạn viết class="p-4" thẳng vào HTML. Tailwind v4 cài vào Angular qua PostCSS, cấu hình bằng CSS (@theme) và chỉ sinh CSS cho những class bạn thật sự dùng.',
  visualizer: {
    title: 'Xưởng ghép class',
    hint: 'Bấm chọn class ở bên trái để ghép lên tấm thẻ. Kéo thanh bề ngang để thử responsive bằng container query, bật Dark để thử dark:. Bấm "Giải mã từng class" để xem CSS Tailwind sinh ra.',
  },
  code: [
    { name: 'pricing-card.ts', lang: 'angular-ts', code: SAMPLES['pricing-card.ts'], anchors: { 6: 'frame', 7: 'layout', 8: 'bg', 9: 'layout', 10: 'text', 11: 'text', 14: 'hover', 15: 'hover', 16: 'binding', 17: 'binding', 22: 'align' } },
    { name: '.postcssrc.json', lang: 'typescript', code: POSTCSS_JSON },
    { name: 'styles.css', lang: 'css', code: STYLES_CSS },
    { name: 'cai-dat.sh', lang: 'typescript', code: SETUP_SH },
  ],
  liveNote: 'Component thật chỉ dùng class Tailwind (kể cả container query @xs: và giá trị tuỳ ý shadow-[…]). Thu hẹp cửa sổ để thấy bố cục đổi.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { PricingCard } from './app/pricing-card';

bootstrapApplication(PricingCard).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Tailwind</title></head>\n<body class="p-6 bg-slate-100"><app-pricing-card></app-pricing-card></body>\n</html>\n`,
    'src/styles.css': `@import "tailwindcss";\n`,
    '.postcssrc.json': POSTCSS_JSON + '\n',
    'package.json': JSON.stringify(
      {
        name: 'bip-hoc-angular-tailwind',
        private: true,
        scripts: { start: 'ng serve', build: 'ng build' },
        dependencies: {
          '@angular/common': '^22.2.0', '@angular/compiler': '^22.2.0', '@angular/core': '^22.2.0', '@angular/forms': '^22.2.0',
          '@angular/platform-browser': '^22.2.0', '@angular/router': '^22.2.0', rxjs: '~7.8.0', tslib: '^2.3.0',
        },
        devDependencies: {
          '@angular/build': '^22.2.0', '@angular/cli': '^22.2.0', '@angular/compiler-cli': '^22.2.0', typescript: '~6.0.2',
          tailwindcss: '^4.3.0', '@tailwindcss/postcss': '^4.3.0', postcss: '^8.5.0',
        },
      },
      null,
      2,
    ),
  },
  challenges: [
    { id: 'tw-card', title: 'Ghép một tấm thẻ "ra dáng": chọn đủ Đệm, Màu nền, Bo góc và Viền & bóng.', hint: 'Mỗi nhóm bên trái chọn một viên gạch. Thử border-2 + shadow-[6px_6px_0_#1e1b3a] cho chất cartoon!', praise: 'Đẹp rồi! Bốn class nhỏ đã thay cho cả một khối CSS.' },
    { id: 'tw-responsive', title: 'Dùng "flex flex-col @md:flex-row" rồi kéo khung rộng quá 448px để thấy bố cục đổi chiều.', hint: 'Chọn lựa chọn thứ ba ở nhóm Bố cục, sau đó kéo thanh "Bề ngang khung" sang phải.', praise: 'Chuẩn! @md: là container query — đổi theo bề ngang khung chứa, không phải cả màn hình.' },
    { id: 'tw-dark', title: 'Thêm class dark: rồi bật chế độ Dark cho khung xem trước.', hint: 'Chọn "dark:bg-slate-800 dark:text-white" ở nhóm Dark mode, rồi bấm công tắc Light/Dark.', praise: 'Tuyệt! Biến thể dark: chỉ có tác dụng khi đang ở chế độ tối.' },
  ],
  pitfalls: [
    {
      title: 'Ghép tên class bằng chuỗi động',
      explain: 'Tailwind tìm class bằng cách đọc mã nguồn như văn bản. "bg-" + color() không xuất hiện nguyên vẹn nên sẽ không được sinh CSS. Hãy viết đủ tên class.',
      wrong: { lang: 'angular-html', code: `<div [class]="'bg-' + color() + '-300'">…</div>` },
      right: { lang: 'angular-html', code: `<div [class.bg-amber-300]="color() === 'amber'"\n     [class.bg-sky-300]="color() === 'sky'">…</div>` },
    },
    {
      title: 'Dùng cách cài của Tailwind v3 cho v4',
      explain: 'Tailwind v4 không cần tailwind.config.js và các dòng @tailwind base/components/utilities. Chỉ cần plugin PostCSS và một dòng @import.',
      wrong: { lang: 'css', code: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` },
      right: { lang: 'css', code: `@import "tailwindcss";` },
    },
    {
      title: 'Hai class cùng thuộc tính trên một phần tử',
      explain: 'Với class="p-2 p-4", thứ tự trong HTML KHÔNG quyết định cái nào thắng — thứ tự trong file CSS mới quyết định. Mỗi thuộc tính chỉ nên có một class.',
      wrong: { lang: 'angular-html', code: `<div class="p-2 p-4">…</div>` },
      right: { lang: 'angular-html', code: `<div class="p-4">…</div>` },
    },
    {
      title: 'Lặp đi lặp lại một chuỗi class dài',
      explain: 'Khi cùng một chuỗi class xuất hiện ở nhiều nơi, hãy tách thành component Angular (ví dụ <app-button>) thay vì copy-paste hoặc lạm dụng @apply.',
      wrong: { lang: 'angular-html', code: `<button class="rounded-xl border-2 px-4 py-2 font-bold …">Lưu</button>\n<button class="rounded-xl border-2 px-4 py-2 font-bold …">Huỷ</button>` },
      right: { lang: 'angular-html', code: `<app-button>Lưu</app-button>\n<app-button>Huỷ</app-button>` },
    },
  ],
  quiz: [
    { question: 'Với Tailwind v4 trong Angular, bạn cần thêm gì vào src/styles.css?', options: ['@tailwind base; @tailwind utilities;', '@import "tailwindcss";', 'Không cần gì, chỉ cần tailwind.config.js', '<link> tới CDN Tailwind'], correct: 1, explain: 'v4 chỉ cần @import "tailwindcss" cùng plugin @tailwindcss/postcss trong .postcssrc.json (hoặc chạy ng add tailwindcss).' },
    { question: 'Vì sao class="{{ \'text-\' + size }}" có thể không hoạt động?', options: ['Angular cấm nối chuỗi', 'Tailwind không thấy tên class đầy đủ trong mã nguồn nên không sinh CSS', 'Thiếu dấu chấm phẩy', 'Tailwind không hỗ trợ Angular'], correct: 1, explain: 'Tailwind quét mã nguồn để tìm tên class; tên ghép lúc chạy thì nó không đoán được.' },
    { question: 'class="hover:bg-sky-200" nghĩa là gì?', options: ['Luôn có nền sky-200', 'Nền sky-200 chỉ khi rê chuột lên phần tử', 'Nền sky-200 trên màn hình lớn', 'Lỗi cú pháp'], correct: 1, explain: 'hover: là một biến thể (variant): utility phía sau chỉ áp dụng khi phần tử đang được hover.' },
  ],
  doneMessage: 'Bạn đã ghép LEGO class thành thạo! Tailwind và Angular là một cặp ăn ý.',
};
