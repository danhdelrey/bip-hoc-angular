import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

/** Khung live: thanh trạng thái điều hướng + outlet của route con */
@Component({
  selector: 'app-catalog-shell',
  imports: [RouterOutlet],
  template: `
    <p class="bar">{{ loading() ? '⏳ Đang chạy resolver…' : '✓ ' + url() }}</p>
    <router-outlet />
  `,
})
export class CatalogShell {
  private readonly router = inject(Router);
  readonly loading = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError),
      map((e) => e instanceof NavigationStart),
    ),
    { initialValue: false },
  );
  readonly url = toSignal(this.router.events.pipe(filter((e) => e instanceof NavigationEnd), map(() => this.router.url)), { initialValue: this.router.url });
}
