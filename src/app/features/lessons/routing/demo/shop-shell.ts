import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from './auth';

@Component({
  selector: 'app-shop-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav>
      <a routerLink="./" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }">Ga chính</a>
      <a routerLink="san-pham/42" routerLinkActive="on">SP 42</a>
      <a routerLink="admin" routerLinkActive="on">Admin</a>
      <a routerLink="bao-cao" routerLinkActive="on">Báo cáo</a>
      <a routerLink="ga-ma">Ga ma</a>
    </nav>
    <button (click)="auth.toggle()">{{ auth.loggedIn() ? 'Đăng xuất' : 'Đăng nhập' }}</button>
    @if (auth.blockedAt(); as t) {
      <p>⛔ Soát vé lúc {{ t }}: cần đăng nhập để vào Admin.</p>
    }
    <router-outlet />
  `,
})
export class ShopShell {
  protected readonly auth = inject(Auth);
}
