import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import type { Product } from './product-api';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <h3>{{ product().name }} <small>(id = {{ id() }})</small></h3>
    <nav>
      <a routerLink="mo-ta" routerLinkActive="on">Mô tả</a> ·
      <a routerLink="danh-gia" routerLinkActive="on">Đánh giá ({{ product().reviews.length }})</a> ·
      <a routerLink="sua">Sửa</a> · <a routerLink="../..">← Danh sách</a>
    </nav>
    <router-outlet /> <!-- outlet con: mo-ta hoặc danh-gia -->
  `,
})
export class ProductDetail {
  readonly id = input.required<string>(); // :id trong URL
  readonly product = input.required<Product>(); // từ resolver
}

@Component({ selector: 'app-product-info', template: `<p>Giá: {{ product.price }}đ. Hàng chính hãng Bíp.</p>` })
export class ProductInfo {
  // Route con đọc dữ liệu đã resolve của route cha
  readonly product: Product = inject(ActivatedRoute).parent!.snapshot.data['product'];
}

@Component({
  selector: 'app-product-reviews',
  template: `<ul>@for (r of product.reviews; track r) { <li>{{ r }}</li> } @empty { <li>Chưa có đánh giá</li> }</ul>`,
})
export class ProductReviews {
  readonly product: Product = inject(ActivatedRoute).parent!.snapshot.data['product'];
}
