import { Component } from '@angular/core';

// Giả sử đây là một component "nặng" (thư viện biểu đồ…) — nằm trong chunk riêng nhờ @defer
@Component({
  selector: 'app-heavy-chart',
  template: `
    <svg viewBox="0 0 160 60" width="160" height="60" role="img" aria-label="Biểu đồ doanh số">
      @for (h of bars; track $index) {
        <rect [attr.x]="$index * 20 + 4" [attr.y]="60 - h" width="14" [attr.height]="h" fill="#4cc9f0" />
      }
    </svg>
    <p>📈 Biểu đồ đã tải xong!</p>
  `,
})
export class HeavyChart {
  bars = [18, 32, 24, 44, 38, 52, 30, 56];
}
