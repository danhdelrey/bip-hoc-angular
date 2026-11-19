import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordsMatch, usernameAvailable } from './validators';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="username" placeholder="Tên đăng nhập (thử: bip)" aria-label="Tên đăng nhập" />
      @if (form.controls.username.pending) { <small>Đang kiểm tra…</small> }
      @if (form.controls.username.hasError('taken')) { <small class="err">Tên đã có người dùng</small> }

      <div formGroupName="account">
        <input type="password" formControlName="password" placeholder="Mật khẩu (≥ 6)" aria-label="Mật khẩu" />
        <input type="password" formControlName="confirm" placeholder="Nhập lại" aria-label="Nhập lại mật khẩu" />
      </div>
      @if (form.controls.account.hasError('mismatch')) { <small class="err">Mật khẩu không khớp</small> }

      <div formArrayName="items">
        @for (item of items.controls; track item; let i = $index) {
          <div [formGroupName]="i">
            <input formControlName="name" [placeholder]="'Món ' + (i + 1)" [attr.aria-label]="'Tên món ' + (i + 1)" />
            <input type="number" formControlName="qty" aria-label="Số lượng" />
            <button type="button" (click)="items.removeAt(i)" aria-label="Xoá món">✕</button>
          </div>
        }
      </div>
      <button type="button" (click)="addItem()">+ Thêm món</button>
      <button type="submit" [disabled]="status() !== 'VALID'">Đặt hàng</button>
      <p>Trạng thái: <b>{{ status() }}</b> @if (sent()) { · đã gửi ✓ }</p>
      <pre>{{ value() | json }}</pre>
    </form>
  `,
})
export class OrderForm {
  private readonly fb = inject(NonNullableFormBuilder); // control không nhận null khi reset

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)], [usernameAvailable]],
    account: this.fb.group(
      { password: ['', [Validators.required, Validators.minLength(6)]], confirm: [''] },
      { validators: passwordsMatch },
    ),
    items: this.fb.array([this.newItem()]),
  });

  // Đưa trạng thái và giá trị sang signal để template luôn cập nhật (zoneless)
  readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  get items() {
    return this.form.controls.items;
  }

  newItem() {
    return this.fb.group({ name: ['', Validators.required], qty: [1, [Validators.required, Validators.min(1)]] });
  }

  addItem() {
    this.items.push(this.newItem());
  }

  readonly sent = signal(false);

  submit() {
    this.sent.set(true); // thực tế: gọi API với this.form.getRawValue()
  }
}
