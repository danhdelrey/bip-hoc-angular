import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Feedback } from '../../core/feedback/feedback';
import { Badge } from '../../shared/ui/badge/badge';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';

/** Toast có Bíp: khen khi xong thử thách, báo huy hiệu mới... */
@Component({
  selector: 'app-toasts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Mascot, Badge, Icon],
  template: `
    <div class="stack" aria-live="polite">
      @for (t of feedback.toasts(); track t.id) {
        <div class="toast">
          @if (t.badge) {
            <app-badge [id]="t.badge" [unlocked]="true" [size]="58" [showLabel]="false" />
          } @else {
            <app-mascot [mood]="t.mood" [size]="52" />
          }
          <p>{{ t.text }}</p>
          <button type="button" class="x" (click)="feedback.dismiss(t.id)" aria-label="Đóng thông báo">
            <app-icon name="close" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .stack { position: fixed; right: 16px; top: calc(var(--header-h) + 12px); z-index: 900; display: flex; flex-direction: column; gap: 10px; width: min(440px, calc(100vw - 32px)); }
    .toast { display: flex; align-items: center; gap: 12px; padding: 8px 12px 8px 10px; background: var(--surface); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); }
    p { flex: 1; margin: 0; font-weight: 800; }
    .x { display: grid; place-items: center; width: 32px; height: 32px; background: transparent; border: 2px solid var(--line); border-radius: 50%; cursor: pointer; }
    @media (prefers-reduced-motion: no-preference) {
      .toast { animation: rise 460ms var(--ease-bounce) both; }
    }
    @keyframes rise { from { transform: translateX(40px) scale(0.85); opacity: 0; } }
  `,
})
export class Toasts {
  protected readonly feedback = inject(Feedback);
}
