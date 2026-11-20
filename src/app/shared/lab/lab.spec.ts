import { LAB as LIFECYCLE_LAB } from '../../features/lessons/lifecycle/lifecycle.lab';
import { LAB as CONTROL_FLOW_LAB } from '../../features/lessons/control-flow/control-flow.lab';
import { LAB as PIPES_LAB } from '../../features/lessons/pipes/pipes.lab';
import { LAB as DEPENDENCY_INJECTION_LAB } from '../../features/lessons/dependency-injection/dependency-injection.lab';
import { LAB as SIGNALS_LAB } from '../../features/lessons/signals/signals.lab';
import { LAB as CHANGE_DETECTION_LAB } from '../../features/lessons/change-detection/change-detection.lab';
import { LAB as ROUTING_LAB } from '../../features/lessons/routing/routing.lab';
import { LAB as FORMS_LAB } from '../../features/lessons/forms/forms.lab';
import { LAB as HTTP_LAB } from '../../features/lessons/http/http.lab';
import { LAB as DEFER_LAB } from '../../features/lessons/defer/defer.lab';
import { LAB as TAILWIND_LAB } from '../../features/lessons/tailwind/tailwind.lab';
import { LAB as CONTENT_PROJECTION_LAB } from '../../features/lessons/content-projection/content-projection.lab';
import { LAB as DYNAMIC_COMPONENTS_LAB } from '../../features/lessons/dynamic-components/dynamic-components.lab';
import { LAB as ACCESSIBILITY_LAB } from '../../features/lessons/accessibility/accessibility.lab';
import { LAB as DI_ADVANCED_LAB } from '../../features/lessons/di-advanced/di-advanced.lab';
import { LAB as RXJS_SUBJECTS_LAB } from '../../features/lessons/rxjs-subjects/rxjs-subjects.lab';
import { LAB as RXJS_FLATTENING_LAB } from '../../features/lessons/rxjs-flattening/rxjs-flattening.lab';
import { LAB as COMPONENT_LAB } from '../../features/lessons/component/component.lab';
import { LAB as DATA_BINDING_LAB } from '../../features/lessons/data-binding/data-binding.lab';
import { LAB as INPUT_OUTPUT_LAB } from '../../features/lessons/input-output/input-output.lab';
import { LAB as RXJS_LAB } from '../../features/lessons/rxjs/rxjs.lab';
import { highlight } from './lab-editor';
import { PRACTICES } from '../../content/practice.registry';
import type { LabModule } from './lab-model';
import { TS_RE, explainNg, fmt, stripModules, transformDecorators } from './lab-runtime';
import { candidates } from './lab-tailwind';

const LABS: Record<string, LabModule> = {
  component: COMPONENT_LAB,
  'data-binding': DATA_BINDING_LAB,
  'input-output': INPUT_OUTPUT_LAB,
  rxjs: RXJS_LAB,
  'rxjs-flattening': RXJS_FLATTENING_LAB,
  'rxjs-subjects': RXJS_SUBJECTS_LAB,
  'di-advanced': DI_ADVANCED_LAB,
  'accessibility': ACCESSIBILITY_LAB,
  'dynamic-components': DYNAMIC_COMPONENTS_LAB,
  'content-projection': CONTENT_PROJECTION_LAB,
  'tailwind': TAILWIND_LAB,
  'defer': DEFER_LAB,
  'http': HTTP_LAB,
  'forms': FORMS_LAB,
  'routing': ROUTING_LAB,
  'change-detection': CHANGE_DETECTION_LAB,
  'lifecycle': LIFECYCLE_LAB,
  'control-flow': CONTROL_FLOW_LAB,
  'pipes': PIPES_LAB,
  'dependency-injection': DEPENDENCY_INJECTION_LAB,
  'signals': SIGNALS_LAB,
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

    it('khớp với practice.registry (đúng số bài có chấm)', () => {
      const meta = PRACTICES.find((p) => p.slug === slug);
      expect(meta, slug).toBeTruthy();
      expect(meta!.count).toBe(lab.exercises.filter((e) => !e.noCheck).length);
    });
  });
}

describe('practice.registry', () => {
  it('mọi module luyện tập đều có bài luyện tương ứng trong test', () => {
    for (const p of PRACTICES) expect(Object.keys(LABS), p.slug).toContain(p.slug);
  });
});

describe('Code Lab — tiện ích runtime', () => {
  it('explainNg thêm giải thích tiếng Việt cho lỗi @defer thiếu @placeholder', () => {
    const m = explainNg('Error: defer on trigger with no target name must have a placeholder block');
    expect(m).toContain('@placeholder');
    expect(explainNg(m)).toBe(m);
  });

  it('candidates chỉ nhận tên class viết đủ, không nhận chuỗi ghép', () => {
    const c = candidates(`<p [class]="'text-' + color() + '-600'" class="p-4 disabled:opacity-50"></p>`);
    expect(c).toContain('p-4');
    expect(c).toContain('disabled:opacity-50');
    expect(c.some((x) => x.includes('green'))).toBe(false);
  });

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
