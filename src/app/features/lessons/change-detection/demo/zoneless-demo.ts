import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-zoneless-demo',
  template: `
    <p>Biến thường: <b>{{ plainCount }}</b> · Signal: <b>{{ signalCount() }}</b></p>
    <button (click)="plainLater()">Biến thường +1 sau 1 giây</button>
    <button (click)="signalLater()">Signal +1 sau 1 giây</button>
  `,
})
export class ZonelessDemo {
  plainCount = 0;
  signalCount = signal(0);

  plainLater() {
    // Zoneless: Angular KHÔNG biết setTimeout vừa đổi biến → màn hình chưa cập nhật
    setTimeout(() => this.plainCount++, 1000);
  }

  signalLater() {
    // Signal tự báo cho Angular → lên lịch kiểm tra đúng component này
    setTimeout(() => this.signalCount.update((n) => n + 1), 1000);
  }
}
