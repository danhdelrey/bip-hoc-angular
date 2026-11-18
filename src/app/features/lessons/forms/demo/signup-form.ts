import { Component, signal } from '@angular/core';
import { FormField, email, form, min, minLength, required } from '@angular/forms/signals';

interface Signup {
  email: string;
  password: string;
  age: number | null;
}

@Component({
  selector: 'app-signup-form',
  imports: [FormField],
  template: `
    <label>Email <input type="email" [formField]="f.email" /></label>
    <label>Mật khẩu <input type="password" [formField]="f.password" /></label>
    <label>Tuổi <input type="number" [formField]="f.age" /></label>
    <p>Form hợp lệ: {{ f().valid() ? '✅' : '❌' }}</p>
    @for (e of f.email().errors(); track e.kind) {
      <small>email lỗi: {{ e.kind }} </small>
    }
  `,
})
export class SignupForm {
  model = signal<Signup>({ email: '', password: '', age: null });

  f = form(this.model, (p) => {
    required(p.email);
    email(p.email);
    required(p.password);
    minLength(p.password, 6);
    min(p.age, 13);
  });
}
