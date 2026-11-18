import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from '../icon/icon';
import type { StepTimeline } from './step-timeline';

/** Thanh điều khiển ▶ ⏸ ⏭ + slider tốc độ — dùng chung cho mọi visualizer. */
@Component({
  selector: 'app-step-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    @let t = timeline();
    <div class="controls" role="group" aria-label="Điều khiển từng bước">
      <button class="btn btn-sm btn-icon" type="button" (click)="t.prev()" [disabled]="t.index() === 0 || !t.total()" aria-label="Bước trước">
        <app-icon name="prev" [size]="18" />
      </button>
      <button class="btn btn-icon btn-signal play" type="button" (click)="t.toggle()" [disabled]="!t.total()"
              [attr.aria-label]="t.playing() ? 'Tạm dừng' : 'Phát'">
        <app-icon [name]="t.playing() ? 'pause' : 'play'" [size]="20" />
      </button>
      <button class="btn btn-sm btn-icon" type="button" (click)="t.next()" [disabled]="t.atEnd() || !t.total()" aria-label="Bước tiếp theo">
        <app-icon name="next" [size]="18" />
      </button>
      <button class="btn btn-sm btn-icon" type="button" (click)="t.restart()" [disabled]="!t.total()" aria-label="Phát lại từ đầu">
        <app-icon name="replay" [size]="18" />
      </button>

      <label class="speed">
        <span>Tốc độ <b>{{ t.speed() }}×</b></span>
        <input type="range" min="0.25" max="2" step="0.25" [value]="t.speed()"
               (input)="t.speed.set(+$any($event.target).value)" aria-label="Tốc độ phát" />
      </label>

      <div class="dots" aria-hidden="true">
        @for (s of t.steps(); track $index) {
          <span class="dot" [class.on]="$index <= t.index()" [class.cur]="$index === t.index()"></span>
        }
      </div>
      <span class="count">{{ t.total() ? 'Bước ' + (t.index() + 1) + '/' + t.total() : 'Chưa có bước' }}</span>
    </div>
    <p class="caption" aria-live="polite">
      <span class="caption-badge">{{ t.total() ? t.index() + 1 : '?' }}</span>
      {{ caption() }}
    </p>
  `,
  styleUrl: './step-player.css',
})
export class StepPlayer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- player không cần biết kiểu frame
  readonly timeline = input.required<StepTimeline<any>>();
  readonly emptyText = input('Thử bấm một nút điều khiển ở trên để bắt đầu nhé!');
  protected readonly caption = computed(() => this.timeline().current()?.caption ?? this.emptyText());
}
