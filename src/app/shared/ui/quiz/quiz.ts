import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Sound } from '../../../core/sound/sound';
import type { QuizItem } from '../../../content/lesson.model';
import { Icon } from '../icon/icon';
import { Mascot, type MascotMood } from '../mascot/mascot';
import { SpeechBubble } from '../speech-bubble/speech-bubble';

/** Quiz 3 câu: giải thích ngay sau khi chọn, Bíp phản ứng đúng/sai. */
@Component({
  selector: 'app-quiz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Mascot, SpeechBubble, Icon],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  private readonly sound = inject(Sound);

  readonly items = input.required<QuizItem[]>();
  readonly finished = output<{ correct: number; total: number }>();

  protected readonly index = signal(0);
  protected readonly picked = signal<number | null>(null);
  protected readonly score = signal(0);
  protected readonly done = signal(false);

  protected readonly item = computed(() => this.items()[this.index()]);
  protected readonly isCorrect = computed(() => this.picked() === this.item().correct);

  protected readonly mood = computed<MascotMood>(() => {
    if (this.done()) return this.score() === this.items().length ? 'celebrate' : 'happy';
    if (this.picked() === null) return 'thinking';
    return this.isCorrect() ? 'celebrate' : 'sad';
  });

  protected readonly bubble = computed(() => {
    if (this.done()) {
      const s = this.score();
      const n = this.items().length;
      return s === n ? `Tuyệt đối ${s}/${n}! Bạn đỉnh quá!` : `Bạn đúng ${s}/${n} câu. Thử lại để đạt điểm tuyệt đối nhé!`;
    }
    if (this.picked() === null) return 'Hmm... câu này bạn nghĩ sao?';
    return this.isCorrect() ? 'Chính xác! Nhảy lên nào!' : 'Ui, chưa đúng rồi. Đọc giải thích bên dưới nhé.';
  });

  protected pick(i: number): void {
    if (this.picked() !== null) return;
    this.picked.set(i);
    if (i === this.item().correct) {
      this.score.update((s) => s + 1);
      this.sound.play('ting');
    } else {
      this.sound.play('boop');
    }
  }

  protected next(): void {
    if (this.index() < this.items().length - 1) {
      this.index.update((i) => i + 1);
      this.picked.set(null);
    } else {
      this.done.set(true);
      this.finished.emit({ correct: this.score(), total: this.items().length });
    }
  }

  protected retry(): void {
    this.index.set(0);
    this.picked.set(null);
    this.score.set(0);
    this.done.set(false);
  }

  protected letter(i: number): string {
    return 'ABCD'[i];
  }
}
