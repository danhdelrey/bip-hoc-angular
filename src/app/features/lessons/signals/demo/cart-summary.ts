import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.html',
})
export class CartSummary {
  price = signal(80);
  qty = signal(2);
  vip = signal(false);

  subtotal = computed(() => this.price() * this.qty());
  freeShip = computed(() => this.subtotal() >= 200);
  shipLabel = computed(() => (this.freeShip() ? 'Miễn phí ship' : 'Ship 15k'));
  total = computed(
    () => this.subtotal() * (this.vip() ? 0.9 : 1) + (this.freeShip() ? 0 : 15),
  );

  log = signal<string[]>([]);

  constructor() {
    effect(() => {
      const t = this.total();
      this.log.update((l) => [`🔔 Tổng: ${t}k`, ...l].slice(0, 3));
    });
  }
}
