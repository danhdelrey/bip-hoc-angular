import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Feedback } from '../../../core/feedback/feedback';
import { ProgressStore } from '../../../core/progress/progress-store';
import type { LessonContent, LessonMeta } from '../../../content/lesson.model';
import { nextLesson } from '../../../content/lessons.registry';
import { LessonContext } from '../anchor/lesson-context';
import { BrowserFrame } from '../browser-frame/browser-frame';
import { CodePanel } from '../code-panel/code-panel';
import { Icon } from '../icon/icon';
import { Mascot } from '../mascot/mascot';
import { MascotSays, SpeechBubble } from '../speech-bubble/speech-bubble';
import { Quiz } from '../quiz/quiz';

/**
 * Khung 7 phần thống nhất cho MỌI bài học:
 * ① Định nghĩa ② Visualizer (kèm "Hình dung") ③ Code ↔ Kết quả ④ Tự thử ⑤ Lỗi thường gặp ⑥ Quiz ⑦ Đánh dấu đã hiểu
 * Visualizer và kết quả live được chiếu vào qua slot.
 */
@Component({
  selector: 'app-lesson-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MascotSays, Mascot, SpeechBubble, CodePanel, BrowserFrame, Quiz, Icon],
  templateUrl: './lesson-layout.html',
  styleUrl: './lesson-layout.css',
})
export class LessonLayout {
  readonly meta = input.required<LessonMeta>();
  readonly content = input.required<LessonContent>();
  readonly liveUrl = input('localhost:4200');

  protected readonly ctx = inject(LessonContext);
  private readonly progress = inject(ProgressStore);
  private readonly feedback = inject(Feedback);

  protected readonly done = computed(() => this.progress.isDone(this.meta().slug));
  protected readonly next = computed(() => nextLesson(this.meta().slug));
  protected readonly openHint = signal<string | null>(null);
  protected readonly challengeCount = computed(() => this.ctx.doneChallenges().size);

  constructor() {
    effect(() => this.ctx.content.set(this.content()));
  }

  protected toggleHint(id: string): void {
    this.openHint.update((h) => (h === id ? null : id));
  }

  protected onQuiz(r: { correct: number; total: number }): void {
    this.feedback.announceBadges(this.progress.recordQuiz(this.meta().slug, r.correct, r.total));
  }

  protected markDone(): void {
    const badges = this.progress.completeLesson(this.meta().slug);
    this.feedback.toast(this.content().doneMessage, 'celebrate');
    this.feedback.celebrate(badges.includes('all-done') ? 'big' : 'small');
    this.feedback.announceBadges(badges);
  }
}
