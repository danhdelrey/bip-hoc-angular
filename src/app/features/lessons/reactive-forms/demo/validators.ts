import type { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { map, timer } from 'rxjs';

// Validator cấp NHÓM: so sánh hai control con
export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const { password, confirm } = group.value;
  return password === confirm ? null : { mismatch: true };
};

// Validator BẤT ĐỒNG BỘ: giả lập gọi API kiểm tra tên đăng nhập
const TAKEN = ['admin', 'bip'];
export const usernameAvailable: AsyncValidatorFn = (control) =>
  timer(600).pipe(map(() => (TAKEN.includes(control.value) ? { taken: true } : null)));
