import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductApi } from './product-api';

@Component({
  selector: 'app-catalog-list',
  imports: [RouterLink, DecimalPipe],
  template: `
    <p>Sắp xếp:
      <a routerLink="." [queryParams]="{ sort: 'ten' }">tên</a> ·
      <a routerLink="." [queryParams]="{ sort: 'gia' }">giá</a>
    </p>
    <ul>
      @for (p of products(); track p.id) {
        <li><a [routerLink]="['sp', p.id]">{{ p.name }}</a> — {{ p.price | number }}đ</li>
      }
    </ul>
  `,
})
export class CatalogList {
  readonly sort = input<'ten' | 'gia'>(); // ?sort=... → input (withComponentInputBinding)
  private readonly api = inject(ProductApi);
  readonly products = computed(() => {
    const list = [...this.api.list()];
    return this.sort() === 'gia' ? list.sort((a, b) => a.price - b.price) : list.sort((a, b) => a.name.localeCompare(b.name));
  });
}
