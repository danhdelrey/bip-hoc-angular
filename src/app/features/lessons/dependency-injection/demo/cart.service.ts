import { Service, signal } from '@angular/core';

let nextId = 1;

@Service() // tự đặt "quầy" ở tầng Root
export class CartService {
  readonly id = nextId++;
  readonly count = signal(0);

  add() {
    this.count.update((n) => n + 1);
  }
}
