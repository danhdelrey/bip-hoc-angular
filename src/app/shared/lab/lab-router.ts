import * as r from '@angular/router';

/** Globals cho bài luyện có Router (dùng với bootstrapApplication của lab — location giả, không đổi URL thật). */
export function routerExtras(): Record<string, unknown> {
  return {
    provideRouter: r.provideRouter,
    withComponentInputBinding: r.withComponentInputBinding,
    withRouterConfig: r.withRouterConfig,
    RouterOutlet: r.RouterOutlet,
    RouterLink: r.RouterLink,
    RouterLinkActive: r.RouterLinkActive,
    Router: r.Router,
    ActivatedRoute: r.ActivatedRoute,
    RedirectCommand: r.RedirectCommand,
  };
}
