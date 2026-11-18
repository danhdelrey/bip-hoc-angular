import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-panel',
  providers: [CartService], // provider riêng: CartPanel nhận instance mới
  template: `
    <h3>CartPanel — Giỏ #{{ cart.id }}</h3>
    <button (click)="cart.add()">+1 món ({{ cart.count() }})</button>
  `,
})
export class CartPanel {
  protected readonly cart = inject(CartService);
}
