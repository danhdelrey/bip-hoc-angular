import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Theme } from './core/theme/theme';
import { Shell } from './layout/shell/shell';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Shell],
  template: `<app-shell />`,
})
export class App {
  // Khởi tạo theme sớm để tránh nháy màu
  private readonly theme = inject(Theme);
}
