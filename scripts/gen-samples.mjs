// Sinh <bài>.samples.ts từ các file demo THẬT, để code hiển thị cho người học luôn trùng với code đang chạy.
// Chạy: npm run gen:samples   (kiểm tra không ghi file: node scripts/gen-samples.mjs --check)
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

const L = 'src/app/features/lessons';
const check = process.argv.includes('--check');
let stale = 0;

for (const slug of readdirSync(L)) {
  const demoDir = join(L, slug, 'demo');
  const out = join(L, slug, `${slug}.samples.ts`);
  // Bài cũ (Phase 1) tự giữ chuỗi trong content và được kiểm tra bởi check-samples.mjs
  if (!existsSync(demoDir) || !existsSync(join(demoDir, '.samples'))) continue;
  const files = readFileSync(join(demoDir, '.samples'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  const body = files
    .map((f) => `  ${JSON.stringify(basename(f))}: ${JSON.stringify(readFileSync(join(demoDir, f), 'utf8').trimEnd())},`)
    .join('\n');
  const src = `// FILE SINH TỰ ĐỘNG bởi scripts/gen-samples.mjs — đừng sửa tay. Sửa file trong demo/ rồi chạy npm run gen:samples.\nexport const SAMPLES: Record<string, string> = {\n${body}\n};\n`;
  const old = existsSync(out) ? readFileSync(out, 'utf8') : '';
  if (old !== src) {
    if (check) {
      console.log(`✘ ${out} chưa cập nhật`);
      stale++;
    } else {
      writeFileSync(out, src);
      console.log(`✎ ${out}`);
    }
  } else if (check) console.log(`✔ ${out}`);
}
process.exit(stale ? 1 : 0);
