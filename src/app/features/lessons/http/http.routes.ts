import { Routes } from '@angular/router';
import { HTTP_PROVIDERS } from './demo/http.providers';
import { HttpPage } from './http.page';

/** HttpClient + interceptor chỉ tồn tại trong phạm vi route của bài này (environment injector riêng). */
export const HTTP_LESSON_ROUTES: Routes = [{ path: '', component: HttpPage, providers: HTTP_PROVIDERS }];
