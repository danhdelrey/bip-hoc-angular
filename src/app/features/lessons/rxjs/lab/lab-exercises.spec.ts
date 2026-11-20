import { LAB_EXERCISES } from './lab-exercises';
import { highlight } from './lab-editor';
import { TS_RE, fmt, stripModules } from './lab-runtime';

describe('RxJS + Signal Lab — dữ liệu bài tập', () => {
  it('id không trùng', () => {
    const ids = LAB_EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('mọi bài có chấm đều đủ starter, solution, check, waitMs', () => {
    for (const ex of LAB_EXERCISES.filter((e) => !e.noCheck)) {
      expect(ex.starter, ex.id).toBeTruthy();
      expect(ex.solution, ex.id).toBeTruthy();
      expect(typeof ex.check, ex.id).toBe('function');
      expect(ex.waitMs, ex.id).toBeGreaterThan(0);
      expect(ex.solution, ex.id).not.toBe(ex.starter);
    }
  });

  it('code mẫu là JS thuần (không bị nhận nhầm là TypeScript)', () => {
    for (const ex of LAB_EXERCISES) {
      expect(TS_RE.test(ex.starter), ex.id + ' starter').toBe(false);
      if (ex.solution) expect(TS_RE.test(ex.solution), ex.id + ' solution').toBe(false);
    }
  });
});

describe('RxJS + Signal Lab — tiện ích runtime', () => {
  it('stripModules bỏ import/export nhưng giữ số dòng', () => {
    const src = "import { signal } from '@angular/core';\nimport {\n  map,\n} from 'rxjs';\nexport const a = 1;";
    const out = stripModules(src);
    expect(out.split('\n').length).toBe(src.split('\n').length);
    expect(out).not.toContain('import');
    expect(out).toContain('const a = 1;');
  });

  it('TS_RE nhận ra cú pháp TypeScript thường gặp', () => {
    expect(TS_RE.test('const q = signal<string>("");')).toBe(true);
    expect(TS_RE.test('interface User { id: number }')).toBe(true);
    expect(TS_RE.test('function f(x: number): string {}')).toBe(true);
    expect(TS_RE.test("const o = { name: 'a', done: true };")).toBe(false);
  });

  it('fmt định dạng gọn các giá trị', () => {
    expect(fmt([1, 'a', { x: null }])).toBe('[1, "a", { x: null }]');
    expect(fmt('chuỗi', 0, true)).toBe('chuỗi');
    expect(fmt(new Error('hỏng'))).toBe('Error: hỏng');
  });

  it('highlight escape HTML và giữ nguyên nội dung', () => {
    const html = highlight("const a = '<b>';", new Set());
    expect(html).toContain('&lt;b&gt;');
    expect(html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')).toBe("const a = '<b>';");
  });
});
