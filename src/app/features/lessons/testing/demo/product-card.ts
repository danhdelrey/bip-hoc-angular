import { DecimalPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { CartService, type Product } from './cart.service';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe],
  template: `
    <h3>{{ product().name }}</h3>
    <p>{{ product().price | number }}đ</p>
    <button type="button" (click)="add()">Thêm vào giỏ</button>
    @if (added()) {
      <p class="msg">Đã thêm!</p>
    }
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  private readonly cart = inject(CartService);
  readonly added = signal(false);

  add() {
    this.cart.add(this.product());
    this.added.set(true);
  }
}
