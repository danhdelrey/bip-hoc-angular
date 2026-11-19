import { Service } from '@angular/core';
import { delay, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  reviews: string[];
}

const DATA: Product[] = [
  { id: 1, name: 'Áo mưa Bíp', price: 199000, reviews: ['Nhẹ, gấp gọn', 'Màu đẹp'] },
  { id: 2, name: 'Ô gấp', price: 89000, reviews: ['Chắc chắn'] },
  { id: 3, name: 'Ủng đi mưa', price: 259000, reviews: [] },
];

@Service()
export class ProductApi {
  list() {
    return DATA;
  }
  get(id: number) {
    return of(DATA.find((p) => p.id === id)!).pipe(delay(500)); // giả lập mạng chậm
  }
}
