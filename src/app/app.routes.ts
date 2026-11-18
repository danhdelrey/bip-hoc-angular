import { Routes } from '@angular/router';

const t = (s: string) => `${s} · Bíp Học Angular`;

/** Mỗi bài học là một route lazy-load riêng (thư mục features/lessons/<tên-bài>). */
export const routes: Routes = [
  { path: '', title: 'Bíp Học Angular', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  { path: 'style-guide', title: t('Style guide'), loadComponent: () => import('./features/style-guide/style-guide').then((m) => m.StyleGuide) },
  { path: 'angular-vs-react', title: t('Angular vs React'), loadComponent: () => import('./features/angular-vs-react/angular-vs-react').then((m) => m.AngularVsReact) },

  { path: 'bai/component', title: t('Component'), loadComponent: () => import('./features/lessons/component/component.page').then((m) => m.ComponentPage) },
  { path: 'bai/data-binding', title: t('Data binding'), loadComponent: () => import('./features/lessons/data-binding/data-binding.page').then((m) => m.DataBindingPage) },
  { path: 'bai/input-output', title: t('Input / Output / model()'), loadComponent: () => import('./features/lessons/input-output/input-output.page').then((m) => m.InputOutputPage) },
  { path: 'bai/lifecycle', title: t('Lifecycle hooks'), loadComponent: () => import('./features/lessons/lifecycle/lifecycle.page').then((m) => m.LifecyclePage) },
  { path: 'bai/control-flow', title: t('Control flow & Directive'), loadComponent: () => import('./features/lessons/control-flow/control-flow.page').then((m) => m.ControlFlowPage) },
  { path: 'bai/pipes', title: t('Pipe'), loadComponent: () => import('./features/lessons/pipes/pipes.page').then((m) => m.PipesPage) },
  {
    path: 'bai/dependency-injection',
    title: t('Dependency Injection'),
    loadComponent: () => import('./features/lessons/dependency-injection/dependency-injection.page').then((m) => m.DependencyInjectionPage),
  },
  { path: 'bai/signals', title: t('Signals'), loadComponent: () => import('./features/lessons/signals/signals.page').then((m) => m.SignalsPage) },
  { path: 'bai/rxjs', title: t('RxJS cơ bản'), loadComponent: () => import('./features/lessons/rxjs/rxjs.page').then((m) => m.RxjsPage) },
  { path: 'bai/change-detection', title: t('Change detection'), loadComponent: () => import('./features/lessons/change-detection/change-detection.page').then((m) => m.ChangeDetectionPage) },
  // Bài Routing có route con THẬT: khung "Kết quả live" là một <router-outlet> của chính app
  { path: 'bai/routing', title: t('Routing'), loadChildren: () => import('./features/lessons/routing/routing.routes').then((m) => m.ROUTING_LESSON_ROUTES) },
  { path: 'bai/forms', title: t('Forms'), loadComponent: () => import('./features/lessons/forms/forms.page').then((m) => m.FormsPage) },
  // Bài HTTP: HttpClient + interceptors được provide ở cấp route (environment injector riêng)
  { path: 'bai/http', title: t('HTTP & Interceptors'), loadChildren: () => import('./features/lessons/http/http.routes').then((m) => m.HTTP_LESSON_ROUTES) },
  // Bài Tailwind: Tailwind v4 chỉ được nạp trong phạm vi bài này (xem features/lessons/tailwind/tailwind.css)
  { path: 'bai/tailwind', title: t('Tailwind CSS'), loadComponent: () => import('./features/lessons/tailwind/tailwind.page').then((m) => m.TailwindPage) },
  { path: 'bai/defer', title: t('@defer'), loadComponent: () => import('./features/lessons/defer/defer.page').then((m) => m.DeferPage) },

  { path: 'bai/:slug', title: t('Sắp có'), loadComponent: () => import('./features/coming-soon/coming-soon').then((m) => m.ComingSoon) },
  { path: '**', title: t('Lạc đường'), loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound) },
];
