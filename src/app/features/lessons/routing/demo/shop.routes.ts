import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { AdminStop, HomeStop, LostStop, ProductStop } from './stops';

export const SHOP_ROUTES: Routes = [
  { path: '', component: HomeStop },
  { path: 'san-pham/:id', component: ProductStop },
  { path: 'admin', component: AdminStop, canActivate: [authGuard] },
  { path: 'bao-cao', loadComponent: () => import('./report-stop').then((m) => m.ReportStop) },
  { path: '**', component: LostStop },
];
