import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-product-box',
  template: `
    <p>Con nhận qty = <b>{{ qty() }}</b></p>
    <button (click)="buy.emit(qty())">Mua {{ qty() }} cái</button>
    <p>
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <button (click)="rating.set(star)">{{ star <= rating() ? '★' : '☆' }}</button>
      }
    </p>
  `,
})
export class ProductBox {
  qty = input.required<number>();
  buy = output<number>();
  rating = model(0);
}
