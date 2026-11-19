import type { Routes } from '@angular/router';
import { CATALOG_ROUTES } from './demo/catalog.routes';
import { RoutingAdvancedPage } from './routing-advanced.page';

/** Trang bài có route con THẬT: khung "Kết quả live" chứa <router-outlet> của ứng dụng */
export const ROUTING_ADVANCED_ROUTES: Routes = [{ path: '', component: RoutingAdvancedPage, children: CATALOG_ROUTES }];
