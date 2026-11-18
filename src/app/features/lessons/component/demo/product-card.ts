import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  name = signal('Robot Bíp mini');
  price = signal(199);
  inCart = signal(false);

  toggleCart() {
    this.inCart.update((v) => !v);
  }
}
