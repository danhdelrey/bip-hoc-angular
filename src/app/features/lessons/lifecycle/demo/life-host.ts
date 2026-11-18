import { Component, inject, signal } from '@angular/core';
import { HookLog } from './hook-log';
import { LifeBuddy } from './life-buddy';

@Component({
  selector: 'app-life-host',
  imports: [LifeBuddy],
  template: `
    <button (click)="show.set(!show())">{{ show() ? 'Huỷ' : 'Tạo' }}</button>
    <button (click)="name.set(name() === 'Bíp' ? 'Bốp' : 'Bíp')">Đổi tên</button>
    @if (show()) {
      <app-life-buddy [name]="name()" />
    }
    <ol>
      @for (line of log.lines(); track $index) {
        <li>{{ line }}</li>
      }
    </ol>
  `,
})
export class LifeHost {
  show = signal(false);
  name = signal('Bíp');
  protected readonly log = inject(HookLog);
}
