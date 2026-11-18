import { Component, inject, signal } from '@angular/core';
import { CURRENCY, PAYMENT_METHODS, PAYMENT_PROVIDERS, PROMO_CODE, THEME } from './payment';

@Component({
  selector: 'app-pay-button',
  providers: [{ provide: THEME, useValue: 'tối' }],
  template: `<button type="button">Thanh toán</button>
    <small> theme của tôi: {{ mine }} · theme của cha: {{ parent }}</small>`,
})
export class PayButton {
  readonly mine = inject(THEME); // tìm từ chính nó trước → 'tối'
  readonly parent = inject(THEME, { skipSelf: true }); // bỏ qua chính nó → 'sáng'
}

@Component({
  selector: 'app-checkout',
  imports: [PayButton],
  providers: [PAYMENT_PROVIDERS, { provide: THEME, useValue: 'sáng' }],
  template: `
    @for (m of methods; track m.id) {
      <label><input type="radio" name="pay" [checked]="m.id === picked()" (change)="picked.set(m.id)" /> {{ m.label }}</label>
    }
    <p>Tiền tệ: {{ currency }} · Mã giảm giá: {{ promo ?? 'không có' }}</p>
    <app-pay-button />
  `,
})
export class Checkout {
  readonly methods = inject(PAYMENT_METHODS); // mảng 3 phần tử
  readonly currency = inject(CURRENCY); // 'VND' từ factory của token
  readonly promo = inject(PROMO_CODE, { optional: true }); // không ai provide → null, không lỗi
  readonly picked = signal('card');
}
