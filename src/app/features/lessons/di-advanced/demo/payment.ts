import { InjectionToken, type Provider } from '@angular/core';

export interface PaymentMethod {
  id: string;
  label: string;
}

// Token có factory: không ai provide thì vẫn có giá trị mặc định
export const CURRENCY = new InjectionToken<string>('CURRENCY', { factory: () => 'VND' });
export const THEME = new InjectionToken<string>('THEME');
export const PROMO_CODE = new InjectionToken<string>('PROMO_CODE');

// multi: true → mỗi provider GÓP thêm một phần tử vào mảng
export const PAYMENT_METHODS = new InjectionToken<PaymentMethod[]>('PAYMENT_METHODS');
export const PAYMENT_PROVIDERS: Provider[] = [
  { provide: PAYMENT_METHODS, multi: true, useValue: { id: 'card', label: 'Thẻ ngân hàng' } },
  { provide: PAYMENT_METHODS, multi: true, useValue: { id: 'wallet', label: 'Ví điện tử' } },
  { provide: PAYMENT_METHODS, multi: true, useFactory: () => ({ id: 'cod', label: 'Trả khi nhận hàng' }) },
];
