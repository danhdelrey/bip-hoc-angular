import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeLab } from './code-lab';
import type { LabModule } from './lab-model';

/**
 * Gắn khu luyện code vào trang bài học (slot "practice" của lesson-layout).
 * Engine và nội dung bài luyện chỉ được tải khi người học cuộn tới.
 *
 *   <app-lesson-lab slot="practice" labId="component" [load]="lab" />
 *   protected readonly lab = () => import('./component.lab').then((m) => m.LAB);
 */
@Component({
  selector: 'app-lesson-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeLab],
  template: `
    @defer (on viewport) {
      <app-code-lab [load]="load()" [storageKey]="storageKey() || 'bip-lab.' + labId()" />
    } @placeholder {
      <div class="ph toon" aria-hidden="true">Đang chuẩn bị khu luyện code…</div>
    }
  `,
  styles: `
    :host { display: block; }
    .ph { min-height: 320px; display: grid; place-items: center; margin: 0 0 44px; color: var(--text-muted); }
  `,
})
export class LessonLab {
  readonly labId = input.required<string>();
  readonly load = input.required<() => Promise<LabModule>>();
  /** ghi đè khoá lưu trữ (giữ tiến độ cũ của lab RxJS) */
  readonly storageKey = input('');
}
