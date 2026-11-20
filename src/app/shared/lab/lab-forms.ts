import * as f from '@angular/forms';
import * as sf from '@angular/forms/signals';
import { labModule } from './lab-runtime';

/**
 * Globals cho bài luyện có form: FormsModule / ReactiveFormsModule (dựng lại bằng labModule vì bản production
 * không giữ scope của NgModule AOT) cùng các class của @angular/forms. Tải lười qua `extras` của LabModule.
 */
const SHARED = [
  f.ɵNgNoValidate, f.NgSelectOption, f.ɵNgSelectMultipleOption, f.DefaultValueAccessor, f.NumberValueAccessor,
  f.RangeValueAccessor, f.CheckboxControlValueAccessor, f.SelectControlValueAccessor, f.SelectMultipleControlValueAccessor,
  f.RadioControlValueAccessor, f.NgControlStatus, f.NgControlStatusGroup, f.RequiredValidator, f.MinLengthValidator,
  f.MaxLengthValidator, f.PatternValidator, f.CheckboxRequiredValidator, f.EmailValidator, f.MinValidator, f.MaxValidator,
];

let cache: Record<string, unknown> | null = null;
export function formsExtras(): Record<string, unknown> {
  cache ??= {
    FormsModule: labModule('FormsModule', [...SHARED, f.NgModel, f.NgModelGroup, f.NgForm]),
    ReactiveFormsModule: labModule('ReactiveFormsModule', [
      ...SHARED, f.FormControlDirective, f.FormGroupDirective, f.FormControlName, f.FormGroupName, f.FormArrayName,
    ]),
    FormControl: f.FormControl,
    FormGroup: f.FormGroup,
    FormArray: f.FormArray,
    FormRecord: f.FormRecord,
    FormBuilder: f.FormBuilder,
    NonNullableFormBuilder: f.NonNullableFormBuilder,
    Validators: f.Validators,
    ...signalFormsExtras(),
  };
  return cache;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...a: any[]) => any;
/**
 * Signal Forms nhận dạng option kiểu hàm bằng `instanceof Function` (realm của trang). Hàm do người học viết thuộc
 * realm iframe, nên bọc lại mọi đối số là hàm (và thuộc tính hàm của object option) bằng hàm của trang.
 */
const wrapFn = (v: unknown): unknown => (typeof v === 'function' ? (...a: unknown[]) => (v as Fn)(...a) : v);
const wrapArg = (v: unknown): unknown => {
  if (typeof v === 'function') return wrapFn(v);
  if (v && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v)?.constructor?.name === 'Object')
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, wrapFn(x)]));
  return v;
};
const wrapRule = (fn: Fn): Fn => (path: unknown, ...rest: unknown[]) => fn(path, ...rest.map(wrapArg));

function signalFormsExtras(): Record<string, unknown> {
  return {
    form: (model: unknown, schema?: unknown, opts?: unknown) =>
      schema === undefined ? sf.form(model as never) : sf.form(model as never, wrapFn(schema) as never, opts as never),
    FormField: sf.FormField,
    FormRoot: sf.FormRoot,
    submit: (f2: unknown, action: unknown) => sf.submit(f2 as never, wrapArg(action) as never),
    required: wrapRule(sf.required),
    email: wrapRule(sf.email),
    min: wrapRule(sf.min),
    max: wrapRule(sf.max),
    minLength: wrapRule(sf.minLength),
    maxLength: wrapRule(sf.maxLength),
    pattern: wrapRule(sf.pattern),
    validate: wrapRule(sf.validate),
    disabled: wrapRule(sf.disabled),
    hidden: wrapRule(sf.hidden),
    readonly: wrapRule(sf.readonly),
    debounce: wrapRule(sf.debounce as Fn),
    apply: sf.apply,
    applyEach: sf.applyEach,
    schema: (fn: unknown) => sf.schema(wrapFn(fn) as never),
  };
}
