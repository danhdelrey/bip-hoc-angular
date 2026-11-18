import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Feedback } from '../../core/feedback/feedback';
import { Badge } from '../../shared/ui/badge/badge';
import { Mascot } from '../../shared/ui/mascot/mascot';
import { CORE_LESSONS } from '../../content/lessons.registry';

/** Màn ăn mừng lớn khi hoàn thành cả lộ trình. */
@Component({
  selector: 'app-grand-finale',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Mascot, Badge, RouterLink],
  template: `
    @if (feedback.finale()) {
      <div class="scrim" (click)="close()" aria-hidden="true"></div>
      <div class="finale toon toon-lg" role="dialog" aria-modal="true" aria-labelledby="finale-title">
        <div class="mascots" aria-hidden="true">
          <app-mascot mood="celebrate" [size]="90" />
          <app-badge id="all-done" [unlocked]="true" [size]="120" [showLabel]="false" />
          <app-mascot mood="celebrate" [size]="90" />
        </div>
        <h2 id="finale-title">Bạn đã chinh phục cả bản đồ Angular!</h2>
        <p>{{ total }}/{{ total }} bài. Từ ngôi nhà component tới hộp quà &#64;defer và Tailwind, bạn đã nhìn thấy mọi bánh răng bên trong. Huy hiệu <strong>Bậc thầy Angular</strong> là của bạn! Còn 4 đảo phụ nâng cao đang chờ bên kia cầu.</p>
        <div class="actions">
          <a class="btn btn-primary" routerLink="/" (click)="close()">Về bản đồ</a>
          <button #closeBtn type="button" class="btn" (click)="close()">Đóng</button>
        </div>
      </div>
    }
  `,
  styles: `
    .scrim { position: fixed; inset: 0; z-index: 950; background: rgba(20, 18, 45, 0.55); }
    .finale { position: fixed; z-index: 960; left: 50%; top: 50%; transform: translate(-50%, -50%); width: min(560px, calc(100vw - 32px)); padding: 26px 28px; text-align: center; background: color-mix(in srgb, var(--c-signal) 28%, var(--surface)); }
    .mascots { display: flex; justify-content: center; align-items: flex-end; gap: 14px; }
    h2 { font-size: var(--fs-2xl); margin: 12px 0 8px; }
    .actions { display: flex; justify-content: center; gap: 12px; margin-top: 14px; }
    @media (prefers-reduced-motion: no-preference) {
      .finale { animation: in 600ms var(--ease-bounce); }
    }
    @keyframes in { from { transform: translate(-50%, -40%) scale(0.6); opacity: 0; } }
  `,
})
export class GrandFinale {
  protected readonly feedback = inject(Feedback);
  protected readonly total = CORE_LESSONS.length;
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  constructor() {
    effect(() => this.closeBtn()?.nativeElement.focus());
  }

  protected close(): void {
    this.feedback.finale.set(false);
  }
}
