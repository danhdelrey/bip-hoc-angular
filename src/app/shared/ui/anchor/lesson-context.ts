import { Directive, Service, computed, inject, input, signal } from '@angular/core';
import { Feedback } from '../../../core/feedback/feedback';
import { ProgressStore } from '../../../core/progress/progress-store';
import type { LessonContent } from '../../../content/lesson.model';

/**
 * State dùng chung trong MỘT bài học (provide ở cấp component trang bài học).
 * - activeAnchor: phần tử đang được hover, đồng bộ code-panel <-> visualizer
 * - completeChallenge: visualizer báo khi người học hoàn thành thử thách
 */
@Service({ autoProvided: false })
export class LessonContext {
  private readonly progress = inject(ProgressStore);
  private readonly feedback = inject(Feedback);

  readonly content = signal<LessonContent | null>(null);
  readonly activeAnchor = signal<string | null>(null);
  /** anchor do step-player đang chiếu (khác với anchor do chuột hover) */
  readonly stepAnchor = signal<string | null>(null);
  readonly highlighted = computed(() => this.activeAnchor() ?? this.stepAnchor());

  readonly doneChallenges = computed(() => {
    const c = this.content();
    return c ? this.progress.challengesDone(c.slug) : new Set<string>();
  });

  completeChallenge(id: string): void {
    const c = this.content();
    if (!c) return;
    const ch = c.challenges.find((x) => x.id === id);
    if (!ch) return;
    if (this.progress.completeChallenge(c.slug, id)) {
      this.feedback.toast(ch.praise, 'celebrate');
      this.feedback.celebrate('small');
      if (c.challenges.every((x) => this.progress.challengesDone(c.slug).has(x.id))) {
        this.feedback.announceBadges(this.progress.grantChallenger());
      }
    }
  }
}

/**
 * Gắn lên phần tử trong visualizer (HTML hoặc SVG): hover -> highlight dòng code tương ứng,
 * và tự sáng lên khi người học hover dòng code có cùng anchor.
 */
@Directive({
  selector: '[appAnchor]',
  host: {
    '[class.is-hl]': 'ctx?.highlighted() === appAnchor()',
    '[attr.data-anchor]': 'appAnchor()',
    '(mouseenter)': 'ctx?.activeAnchor.set(appAnchor())',
    '(mouseleave)': 'ctx?.activeAnchor.set(null)',
    '(focusin)': 'ctx?.activeAnchor.set(appAnchor())',
    '(focusout)': 'ctx?.activeAnchor.set(null)',
  },
})
export class AnchorDirective {
  readonly appAnchor = input.required<string>();
  protected readonly ctx = inject(LessonContext, { optional: true });
}
