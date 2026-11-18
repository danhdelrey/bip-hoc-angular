import { Component } from '@angular/core';

// File này nằm trong một chunk JS riêng, chỉ tải khi vào /bao-cao
@Component({ selector: 'app-report-stop', template: `<h3>📊 Báo cáo (lazy)</h3><p>Toa hàng này vừa được kéo tới!</p>` })
export class ReportStop {}
