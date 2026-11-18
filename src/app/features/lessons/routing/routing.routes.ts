import { Routes } from '@angular/router';
import { SHOP_ROUTES } from './demo/shop.routes';
import { RoutingPage } from './routing.page';

/**
 * Trang bài Routing có route con THẬT (SHOP_ROUTES): khung "Kết quả live" chứa <router-outlet>
 * của chính ứng dụng, nên URL trên thanh địa chỉ đổi theo khi bạn bấm link trong demo.
 */
export const ROUTING_LESSON_ROUTES: Routes = [{ path: '', component: RoutingPage, children: SHOP_ROUTES }];
