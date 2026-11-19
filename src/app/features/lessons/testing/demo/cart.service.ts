import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Service()
export class CartService {
  private readonly http = inject(HttpClient);
  readonly items = signal<Product[]>([]);

  add(product: Product) {
    this.items.update((list) => [...list, product]);
  }

  load() {
    return this.http.get<Product[]>('/api/cart').pipe(tap((items) => this.items.set(items)));
  }
}
