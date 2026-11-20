import { compile } from 'tailwindcss';

/**
 * Tailwind cho bài luyện Tailwind: biên dịch NGAY TRONG TRÌNH DUYỆT các class xuất hiện trong code người học
 * (giống bộ quét của Tailwind: chỉ nhận tên class viết đủ, không nhận chuỗi ghép động).
 * CSS sinh ra bị giới hạn trong khung preview (:where(.rxlab-preview)), không có preflight, theme ở chế độ
 * reference (giá trị nằm sẵn trong var(..., fallback)) nên không ghi đè design token của site.
 * Biến thể dark: gắn với theme sáng/tối của site ([data-theme=dark]).
 */
const INPUT = `@import "tailwindcss/theme.css" theme(reference);
@import "tailwindcss/utilities.css";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`;

/** token trùng tên giữa Tailwind và site: đặt lại giá trị Tailwind cho phần tử trong preview */
const SCOPED_VARS =
  ':where(.rxlab-preview) .ng-host{--radius-xs:.125rem;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-4xl:2rem}';
const STYLE_ID = 'code-lab-tailwind';

/** Nội dung theme.css / utilities.css: tải một lần rồi giữ lại. */
const sheets = new Map<string, Promise<string>>();
function loadSheet(name: string): Promise<string> {
  let p = sheets.get(name);
  if (!p) {
    p = fetch(new URL('labs/tailwind/' + name, document.baseURI).href).then((res) => {
      if (!res.ok) throw new Error('Không tải được ' + name);
      return res.text();
    });
    p.catch(() => sheets.delete(name));
    sheets.set(name, p);
  }
  return p;
}

/**
 * Biên dịch MỚI mỗi lần chạy: build() của Tailwind là tăng dần (nhớ mọi class đã thấy), nên dùng lại một compiler
 * thì class của lần chạy trước (ví dụ của lời giải) vẫn còn CSS và làm sai kết quả của code hiện tại.
 */
function freshCompiler(): ReturnType<typeof compile> {
  return compile(INPUT, {
    base: '/',
    loadStylesheet: async (id: string) => {
      const name = id.replace(/^tailwindcss\//, '');
      return { path: id, base: '/', content: await loadSheet(name) };
    },
  });
}

/** Ứng viên class: mọi "từ" trong code (Tailwind tự bỏ qua những từ không phải utility). */
export function candidates(code: string): string[] {
  const out = new Set<string>();
  for (const t of code.split(/[\s'"`<>{}=,;]+/)) {
    if (t.length > 0 && t.length < 80 && /^[!-]?[a-z@[*]/i.test(t)) out.add(t);
  }
  return [...out];
}

/** Đưa các luật thường vào :where(.rxlab-preview) { … }; @property / @layer giữ ở cấp ngoài cùng. */
export function scopeCss(css: string): string {
  const top: string[] = [];
  const inner: string[] = [];
  let i = 0, depth = 0, start = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (; i < css.length; i++) {
    const c = css[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) { push(css.slice(start, i + 1)); start = i + 1; }
    } else if (c === ';' && depth === 0) { push(css.slice(start, i + 1)); start = i + 1; }
  }
  function push(seg: string) {
    const s = seg.trim();
    if (!s) return;
    (/^@(property|layer)\b/.test(s) ? top : inner).push(s);
  }
  return top.join('\n') + '\n:where(.rxlab-preview){\n' + inner.join('\n') + '\n}\n' + SCOPED_VARS;
}

async function prepare(code: string): Promise<void> {
  const c = await freshCompiler();
  const css = scopeCss(c.build(candidates(code)));
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

export function removeTailwindStyles(): void {
  document.getElementById(STYLE_ID)?.remove();
}

export function tailwindExtras(): Record<string, unknown> {
  return { __prepare: prepare };
}
