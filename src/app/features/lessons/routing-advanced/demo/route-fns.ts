import { inject } from '@angular/core';
import type { CanDeactivateFn, ResolveFn } from '@angular/router';
import { type Product, ProductApi } from './product-api';

// Resolver: tải dữ liệu XONG rồi mới kích hoạt route
export const productResolver: ResolveFn<Product> = (route) =>
  inject(ProductApi).get(Number(route.paramMap.get('id')));

// Guard rời trang: component tự quyết (có thể hỏi người dùng, trả Promise)
export interface CanLeave {
  canLeave(): boolean | Promise<boolean>;
}
export const unsavedChangesGuard: CanDeactivateFn<CanLeave> = (component) => component.canLeave();
