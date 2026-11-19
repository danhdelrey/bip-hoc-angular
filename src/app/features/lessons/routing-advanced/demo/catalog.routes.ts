import type { Routes } from '@angular/router';
import { CatalogList } from './catalog-list';
import { ProductDetail, ProductInfo, ProductReviews } from './product-detail';
import { ProductEdit } from './product-edit';
import { productResolver, unsavedChangesGuard } from './route-fns';

export const CATALOG_ROUTES: Routes = [
  { path: '', component: CatalogList },
  {
    path: 'sp/:id/sua',
    component: ProductEdit,
    resolve: { product: productResolver },
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'sp/:id',
    component: ProductDetail,
    resolve: { product: productResolver }, // → input product
    children: [
      { path: '', redirectTo: 'mo-ta', pathMatch: 'full' },
      { path: 'mo-ta', component: ProductInfo },
      { path: 'danh-gia', component: ProductReviews },
    ],
  },
];
