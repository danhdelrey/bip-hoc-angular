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
const ink = '#0f172a';
const accents = { mint: '#34d399', orange: '#fb923c', lavender: '#a78bfa', lemon: '#facc15', red: '#f87171', sky: '#38bdf8', coral: '#f472b6' };
const themes = {
  light: {
    text: '#0f172a', muted: '#475569',
    bgs: { bg: '#f6f7f9', surface: '#ffffff', 'surface-2': '#f1f5f9', sunken: '#eef1f5' },
    strong: { data: '#0b6e45', event: '#9a4a00', di: '#5b34c9', signal: '#7a5c00', error: '#b3261e', primary: '#4338ca' },
    code: { bg: '#ffffff', gutter: '#64748b', comment: '#6e7781', keyword: '#cf222e', string: '#0a3069' },
    button: ['#ffffff', '#4f46e5'],
  },
  dark: {
    text: '#e5e9f0', muted: '#a3adbd',
    bgs: { bg: '#0b1120', surface: '#151d2e', 'surface-2': '#1f2a3d', sunken: '#0a0f1c' },
    strong: { data: '#5df0b0', event: '#ffb871', di: '#c4b1ff', signal: '#ffe066', error: '#ff8a8a', primary: '#a5b4fc' },
    code: { bg: '#0d1424', gutter: '#8a94a6', comment: '#8b949e', keyword: '#ff7b72', string: '#a5d6ff' },
    button: ['#ffffff', '#5b5ef0'],
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
  check('chữ trắng trên nút chính', t.button[0], t.button[1]);
}
console.log('\n== chữ mực trên nền màu nhấn (cả 2 theme) ==');
for (const [n, c] of Object.entries(accents)) check(`ink on ${n}`, ink, c);
process.exit(fail ? 1 : 0);
