import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-badge',
  template: `
    <span>🛒 Giỏ #{{ cart.id }}: {{ cart.count() }} món</span>
    <button (click)="cart.add()">+1</button>
  `,
})
export class CartBadge {
  protected readonly cart = inject(CartService);
}
