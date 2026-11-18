import { Service, inject, signal } from '@angular/core';
import type { MascotMood } from '../../shared/ui/mascot/mascot';
import { type BadgeId, badgeById } from '../../content/badges';
import { Motion } from '../motion/motion';
import { Sound } from '../sound/sound';

export interface Toast {
  id: number;
  mood: MascotMood;
  text: string;
  badge?: BadgeId;
}

export type ConfettiSize = 'small' | 'big';

/** Điểm tập trung mọi phản hồi vui: toast có Bíp, confetti, âm thanh. */
@Service()
export class Feedback {
  private readonly motion = inject(Motion);
  private readonly sound = inject(Sound);
  private seq = 0;

  readonly toasts = signal<Toast[]>([]);
  readonly confetti = signal<{ id: number; size: ConfettiSize } | null>(null);
  /** Màn ăn mừng lớn khi xong cả lộ trình */
  readonly finale = signal(false);

  toast(text: string, mood: MascotMood = 'happy', badge?: BadgeId, ms = 4200): void {
    const id = ++this.seq;
    this.toasts.update((t) => [...t.slice(-2), { id, mood, text, badge }]);
    setTimeout(() => this.dismiss(id), ms);
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }

  celebrate(size: ConfettiSize = 'small'): void {
    this.sound.play(size === 'big' ? 'fanfare' : 'ting');
    // Confetti là trang trí -> tắt khi prefers-reduced-motion
    if (!this.motion.reduced()) this.confetti.set({ id: ++this.seq, size });
  }

  announceBadges(ids: BadgeId[]): void {
    ids.forEach((id, i) =>
      setTimeout(() => {
        const b = badgeById(id);
        this.toast(`Mở khoá huy hiệu "${b.title}"!`, 'celebrate', id, 5200);
        this.celebrate(id === 'all-done' ? 'big' : 'small');
        if (id === 'all-done') setTimeout(() => this.finale.set(true), 900);
      }, 600 + i * 900),
    );
  }
}
