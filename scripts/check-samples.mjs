// Kiểm tra code mẫu HIỂN THỊ (trong *.content.ts) trùng khớp với component THẬT đang chạy (demo/).
// Chạy: npm run check:samples
import { readFileSync } from 'node:fs';

const L = 'src/app/features/lessons';
const pairs = [
  ['data-binding/data-binding.content.ts', 'PROFILE_CARD_HTML', 'data-binding/demo/profile-card.html'],
  ['dependency-injection/dependency-injection.content.ts', 'CART_SERVICE_TS', 'dependency-injection/demo/cart.service.ts'],
  ['dependency-injection/dependency-injection.content.ts', 'CART_BADGE_TS', 'dependency-injection/demo/cart-badge.ts'],
  ['dependency-injection/dependency-injection.content.ts', 'CART_PANEL_TS', 'dependency-injection/demo/cart-panel.ts'],
  ['dependency-injection/dependency-injection.content.ts', 'SHOP_PAGE_TS', 'dependency-injection/demo/shop-page.ts'],
  ['signals/signals.content.ts', 'CART_SUMMARY_TS', 'signals/demo/cart-summary.ts'],
  ['signals/signals.content.ts', 'CART_SUMMARY_HTML', 'signals/demo/cart-summary.html'],
];
// Demo của Data binding có thêm styleUrl + comment để hiển thị đẹp trong khung live -> so sánh sau khi bỏ 2 phần đó
const normalize = (s) =>
  s
    .replace(/\/\*\*[\s\S]*?\*\/\n/g, '')
    .replace(/\n\s*styleUrl: '[^']+',/g, '')
    .trim();

let fail = 0;
for (const [contentFile, name, demoFile] of [
  ...pairs,
  ['data-binding/data-binding.content.ts', 'PROFILE_CARD_TS', 'data-binding/demo/profile-card.ts'],
]) {
  const src = readFileSync(`${L}/${contentFile}`, 'utf8');
  const m = new RegExp(`export const ${name} = \`([\\s\\S]*?)\`;\\n`).exec(src);
  const shown = m[1].replace(/\\`/g, '`').replace(/\\\$/g, '$');
  const real = readFileSync(`${L}/${demoFile}`, 'utf8');
  const ok = normalize(shown) === normalize(real);
  if (!ok) fail++;
  console.log(`${ok ? '✔' : '✘'} ${name}  ⇄  ${demoFile}`);
}
process.exit(fail ? 1 : 0);
