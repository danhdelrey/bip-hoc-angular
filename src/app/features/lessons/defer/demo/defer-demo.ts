import { Component } from '@angular/core';
import { HeavyChart } from './heavy-chart';

@Component({
  selector: 'app-defer-demo',
  imports: [HeavyChart],
  template: `
    @defer (on interaction) {
      <app-heavy-chart />
    } @placeholder {
      <button>🎁 Bấm để mở biểu đồ</button>
    } @loading (minimum 800ms) {
      <p>⏳ Đang tải chunk…</p>
    }

    @defer (on viewport; prefetch on idle) {
      <app-heavy-chart />
    } @placeholder {
      <p>📦 Hộp này tự mở khi cuộn tới (on viewport)</p>
    }
  `,
})
export class DeferDemo {}
