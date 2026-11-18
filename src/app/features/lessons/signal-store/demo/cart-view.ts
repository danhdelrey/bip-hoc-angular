import { Component, inject } from '@angular/core';
import { CartStore } from './cart.store';

const PRODUCTS = [
  { id: 1, name: 'Áo mưa Bíp', price: 199000 },
  { id: 2, name: 'Ô gấp', price: 89000 },
];

@Component({
  selector: 'app-cart-view',
  providers: [CartStore], // mỗi CartView có một store riêng
  template: `
    @for (p of products; track p.id) {
      <button type="button" (click)="store.add(p)">+ {{ p.name }}</button>
    }
    <ul>
      @for (item of store.entities(); track item.id) {
        <li>{{ item.name }} × {{ item.qty }} <button type="button" (click)="store.remove(item.id)">Xoá</button></li>
      } @empty {
        <li>Giỏ trống</li>
      }
    </ul>
    <input #code placeholder="Mã: BIP10" aria-label="Mã giảm giá" (keyup.enter)="store.applyCoupon(code.value)" />
    <p>{{ store.count() }} món · Tổng: <b>{{ vnd(store.total()) }}</b></p>
  `,
})
export class CartView {
  readonly store = inject(CartStore);
  readonly products = PRODUCTS;
  vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';
}
