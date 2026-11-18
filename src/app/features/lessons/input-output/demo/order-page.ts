import { Component, signal } from '@angular/core';
import { ProductBox } from './product-box';

@Component({
  selector: 'app-order-page',
  imports: [ProductBox],
  template: `
    <button (click)="quantity.update((q) => q + 1)">Cha: +1</button>
    <p>Cha: quantity = {{ quantity() }} · rating = {{ rating() }} · đã đặt {{ orders() }}</p>
    <app-product-box
      [qty]="quantity()"
      (buy)="onBuy($event)"
      [(rating)]="rating"
    />
  `,
})
export class OrderPage {
  quantity = signal(1);
  rating = signal(3);
  orders = signal(0);

  onBuy(n: number) {
    this.orders.update((o) => o + n);
  }
}
