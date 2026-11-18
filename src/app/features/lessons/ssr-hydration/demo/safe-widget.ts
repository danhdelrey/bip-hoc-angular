import { Component, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-safe-widget',
  template: `
    <p>Đang chạy ở: <b>{{ platform }}</b></p>
    <p>Chiều rộng màn hình: {{ width() ?? '(chưa biết — đang ở server)' }}</p>
    <p>Lần ghé thăm thứ: {{ visits() ?? '…' }}</p>
    <button type="button" (click)="buy()">Mua ({{ cart() }})</button>
  `,
})
export class SafeWidget {
  readonly platform = isPlatformBrowser(inject(PLATFORM_ID)) ? 'trình duyệt' : 'server';
  readonly width = signal<number | null>(null);
  readonly visits = signal<number | null>(null);
  readonly cart = signal(0);

  constructor() {
    // ❌ Đừng đọc window/localStorage ở đây: trên server chúng không tồn tại,
    //    và giá trị khác nhau giữa server/trình duyệt gây lệch hydration.
    afterNextRender(() => {
      // ✅ Chỉ chạy ở trình duyệt, SAU khi hydration xong
      this.width.set(window.innerWidth);
      const n = Number(localStorage.getItem('bip-visits') ?? 0) + 1;
      localStorage.setItem('bip-visits', String(n));
      this.visits.set(n);
    });
  }

  buy() {
    this.cart.update((c) => c + 1);
  }
}
