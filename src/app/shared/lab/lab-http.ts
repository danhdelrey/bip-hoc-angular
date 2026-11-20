import * as h from '@angular/common/http';

/**
 * Globals cho bài luyện HTTP. Ứng dụng tạo bằng bootstrapApplication() của lab dùng backend giả:
 * GET /api/users, GET /api/users/:id (13 → 500), GET /api/private (cần Authorization: Bearer bip-token),
 * GET /api/flaky (lần đầu 500), POST /api/todos, GET /api/todos.
 */
export function httpExtras(): Record<string, unknown> {
  return {
    provideHttpClient: h.provideHttpClient,
    withInterceptors: h.withInterceptors,
    withFetch: h.withFetch,
    HttpClient: h.HttpClient,
    HttpErrorResponse: h.HttpErrorResponse,
    HttpHeaders: h.HttpHeaders,
    HttpParams: h.HttpParams,
    HttpContext: h.HttpContext,
    HttpContextToken: h.HttpContextToken,
    httpResource: h.httpResource,
  };
}
