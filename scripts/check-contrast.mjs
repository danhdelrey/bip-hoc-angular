// Kiểm tra tương phản WCAG AA (≥ 4.5 cho chữ thường) cho các cặp màu chính trong theme.css.
// Chạy: npm run check:contrast
const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255);
const lum = (h) => {
  const [r, g, b] = hex(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const ink = '#1e1b3a';
const accents = { mint: '#3ddc97', orange: '#ff9f43', lavender: '#a78bfa', lemon: '#ffd43b', red: '#ff5c5c', sky: '#4cc9f0', coral: '#ff8fab' };
const themes = {
  light: {
    text: '#1e1b3a', muted: '#4a4570',
    bgs: { bg: '#fff8e7', surface: '#ffffff', 'surface-2': '#fff1cc', sunken: '#f5ecd6' },
    strong: { data: '#0b6e45', event: '#9a4a00', di: '#5b34c9', signal: '#7a5c00', error: '#b3261e' },
    code: { bg: '#ffffff', gutter: '#6b6890', comment: '#6e7781', keyword: '#cf222e', string: '#0a3069' },
  },
  dark: {
    text: '#f5f0e1', muted: '#c9c3e6',
    bgs: { bg: '#17183a', surface: '#23255a', 'surface-2': '#2f3270', sunken: '#121331' },
    strong: { data: '#5df0b0', event: '#ffb871', di: '#c4b1ff', signal: '#ffe066', error: '#ff8a8a' },
    code: { bg: '#0f1030', gutter: '#9a96c4', comment: '#8b949e', keyword: '#ff7b72', string: '#a5d6ff' },
  },
};
let fail = 0;
const check = (label, fg, bg, min = 4.5) => {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? '✔' : '✘'} ${r.toFixed(2).padStart(5)}  ${label}`);
};
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n== ${name} ==`);
  for (const [bn, bg] of Object.entries(t.bgs)) {
    check(`text on ${bn}`, t.text, bg);
    check(`muted on ${bn}`, t.muted, bg);
    for (const [sn, c] of Object.entries(t.strong)) if (bn !== 'sunken') check(`${sn}-strong on ${bn}`, c, bg);
  }
  for (const [k, c] of Object.entries(t.code)) if (k !== 'bg') check(`code ${k} on code-bg`, c, t.code.bg);
}
console.log('\n== chữ mực trên nền màu nhấn (cả 2 theme) ==');
for (const [n, c] of Object.entries(accents)) check(`ink on ${n}`, ink, c);
process.exit(fail ? 1 : 0);
