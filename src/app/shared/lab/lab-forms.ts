import * as f from '@angular/forms';
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
  };
  return cache;
}
