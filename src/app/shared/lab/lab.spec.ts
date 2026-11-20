import { LAB as COMPONENT_LAB } from '../../features/lessons/component/component.lab';
import { LAB as DATA_BINDING_LAB } from '../../features/lessons/data-binding/data-binding.lab';
import { LAB as INPUT_OUTPUT_LAB } from '../../features/lessons/input-output/input-output.lab';
import { LAB as RXJS_LAB } from '../../features/lessons/rxjs/rxjs.lab';
import { highlight } from './lab-editor';
import type { LabModule } from './lab-model';
import { TS_RE, fmt, stripModules, transformDecorators } from './lab-runtime';

const LABS: Record<string, LabModule> = {
  component: COMPONENT_LAB,
  'data-binding': DATA_BINDING_LAB,
  'input-output': INPUT_OUTPUT_LAB,
  rxjs: RXJS_LAB,
};

for (const [slug, lab] of Object.entries(LABS)) {
  describe('Code Lab "' + slug + '" — dữ liệu bài tập', () => {
    it('id không trùng', () => {
      const ids = lab.exercises.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('mọi bài có chấm đều đủ starter, solution, check, waitMs', () => {
      for (const ex of lab.exercises.filter((e) => !e.noCheck)) {
        expect(ex.starter, ex.id).toBeTruthy();
        expect(ex.solution, ex.id).toBeTruthy();
        expect(typeof ex.check, ex.id).toBe('function');
        expect(ex.waitMs, ex.id).toBeGreaterThan(0);
        expect(ex.solution, ex.id).not.toBe(ex.starter);
      }
    });
  });
}

describe('Code Lab — tiện ích runtime', () => {
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

  it('transformDecorators đổi decorator class thành lời gọi hàm, giữ số dòng', () => {
    const src = "@Component({\n  selector: 'app-a',\n  template: '<p>{{ x }}</p>',\n})\nexport class A {\n  x = 1;\n  f() { return '}'; }\n}\nmount(A);";
    const out = transformDecorators(src);
    expect(out.split('\n').length).toBe(src.split('\n').length);
    expect(out).not.toMatch(/^@Component/m);
    expect(out).toContain('const __d0_A = Component({');
    expect(out).toContain('};__d0_A(A);');
  });

  it('transformDecorators sinh metadata cho input/output/model/viewChild', () => {
    const out = transformDecorators("@Component({ selector: 'x', template: '' })\nclass C {\n  a = input.required();\n  b = input(0, { alias: 'bee' });\n  c = model(false);\n  d = output();\n  e = viewChild.required(Other);\n  f() { const g = input(1); }\n}");
    expect(out).toContain("__ng.Input({ isSignal: true, alias: \"a\", required: true, transform: undefined })(C.prototype, \"a\")");
    expect(out).toContain('alias: "bee", required: false');
    expect(out).toContain('__ng.Output("cChange")(C.prototype, "c")');
    expect(out).toContain('__ng.Output("d")(C.prototype, "d")');
    expect(out).toContain('__ng.ViewChild(Other, { ...({}), isSignal: true })(C.prototype, "e")');
    expect(out).not.toContain('"g"');
  });

  it('transformDecorators áp dụng nhiều decorator theo thứ tự từ dưới lên', () => {
    const out = transformDecorators('@Injectable()\n@Service()\nclass S {}');
    expect(out).toContain('__d1_S(S);__d0_S(S);');
  });
});
