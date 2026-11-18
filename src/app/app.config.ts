import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';

// Angular 22: zoneless là mặc định — không cần zone.js, không cần provideZonelessChangeDetection().
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      // Cuộn lên đầu do Shell tự lo (chỉ khi đổi BÀI), để route con của bài Routing không làm trang nhảy
      withInMemoryScrolling({ scrollPositionRestoration: 'disabled', anchorScrolling: 'enabled' }),
      // Hash routing để chạy được trên mọi host tĩnh (GitHub Pages, preview...). Xem README để đổi.
      withHashLocation(),
    ),
  ],
};
