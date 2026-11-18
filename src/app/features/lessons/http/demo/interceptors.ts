import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, of, retry, switchMap, throwError, timer } from 'rxjs';
import { HttpLog } from './http-log';
import { MockServer } from './mock-server';

// Trạm 1: đóng dấu token
export const authInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { Authorization: 'Bearer bip-token-123' } }));

// Trạm 2: ghi sổ thời gian đi - về
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const log = inject(HttpLog);
  const started = performance.now();
  log.add(`→ ${req.method} ${req.url} (token: ${req.headers.has('Authorization') ? 'có' : 'không'})`);
  return next(req).pipe(finalize(() => log.add(`← ${req.url} sau ${Math.round(performance.now() - started)}ms`)));
};

// Trạm 3: xử lý lỗi — thử lại 1 lần nếu 500, dịch lỗi cho dễ hiểu
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    retry({ count: 1, delay: (err: HttpErrorResponse) => (err.status === 500 ? timer(300) : throwError(() => err)) }),
    catchError((err: HttpErrorResponse) =>
      throwError(() => new Error(err.status === 401 ? '401: Bạn cần đăng nhập lại' : `${err.status}: Server đang lỗi`)),
    ),
  );

// Trạm cuối: server giả lập (không gọi next → không có request thật nào)
export const mockBackend: HttpInterceptorFn = (req) => {
  const server = inject(MockServer);
  const status = server.status();
  const res$ =
    status === 200
      ? of(new HttpResponse({ status, url: req.url, body: { name: 'Bíp', role: 'robot hướng dẫn' } }))
      : throwError(() => new HttpErrorResponse({ status, url: req.url }));
  return timer(server.latency()).pipe(switchMap(() => res$));
};
