import { Routes } from '@angular/router';

/** Mỗi bài học là một route lazy-load riêng. */
export const routes: Routes = [
  { path: '', title: 'Bíp Học Angular', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  {
    path: 'style-guide',
    title: 'Style guide · Bíp Học Angular',
    loadComponent: () => import('./features/style-guide/style-guide').then((m) => m.StyleGuide),
  },
  {
    path: 'bai/data-binding',
    title: 'Data binding · Bíp Học Angular',
    loadComponent: () => import('./features/lessons/data-binding/data-binding.page').then((m) => m.DataBindingPage),
  },
  {
    path: 'bai/dependency-injection',
    title: 'Dependency Injection · Bíp Học Angular',
    loadComponent: () =>
      import('./features/lessons/dependency-injection/dependency-injection.page').then((m) => m.DependencyInjectionPage),
  },
  {
    path: 'bai/signals',
    title: 'Signals · Bíp Học Angular',
    loadComponent: () => import('./features/lessons/signals/signals.page').then((m) => m.SignalsPage),
  },
  // Các bài chưa làm (Giai đoạn 2)
  {
    path: 'bai/:slug',
    title: 'Sắp có · Bíp Học Angular',
    loadComponent: () => import('./features/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  { path: '**', title: 'Lạc đường · Bíp Học Angular', loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound) },
];
