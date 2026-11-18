import { Component } from '@angular/core';
import { CartBadge } from './cart-badge';
import { CartPanel } from './cart-panel';

@Component({
  selector: 'app-shop-page',
  imports: [CartBadge, CartPanel],
  template: `
    <app-cart-badge />
    <app-cart-panel />
  `,
})
export class ShopPage {}
