import { Service, computed, signal } from '@angular/core';
import { LESSONS } from '../../content/lessons.registry';
import type { BadgeId } from '../../content/badges';
import { safeStorage } from '../storage/safe-storage';

const KEY = 'bip.progress.v1';

interface ProgressState {
  completed: string[];
  quizBest: Record<string, number>;
  challenges: Record<string, string[]>;
  badges: BadgeId[];
  greeted: boolean;
}

const EMPTY: ProgressState = { completed: [], quizBest: {}, challenges: {}, badges: [], greeted: false };

/**
 * Tiến độ học + huy hiệu. State là signal, tự lưu vào localStorage (an toàn với lỗi).
 * Nếu localStorage không dùng được, app vẫn chạy với state trong bộ nhớ.
 */
@Service()
export class ProgressStore {
  private readonly state = signal<ProgressState>({ ...EMPTY, ...safeStorage.read<Partial<ProgressState>>(KEY, {}) });

  readonly completed = computed(() => new Set(this.state().completed));
  readonly badges = computed(() => new Set(this.state().badges));
  readonly greeted = computed(() => this.state().greeted);
  readonly percent = computed(() => Math.round((this.state().completed.length / LESSONS.length) * 100));
  readonly completedCount = computed(() => this.state().completed.length);

  isDone = (slug: string) => this.completed().has(slug);
  challengesDone = (slug: string) => new Set(this.state().challenges[slug] ?? []);
  quizBest = (slug: string) => this.state().quizBest[slug];

  markGreeted(): void {
    this.patch({ greeted: true });
  }

  /** Đánh dấu đã hiểu bài. Trả về các huy hiệu MỚI mở khoá. */
  completeLesson(slug: string): BadgeId[] {
    if (this.isDone(slug)) return [];
    this.patch({ completed: [...this.state().completed, slug] });
    const n = this.state().completed.length;
    const earned: BadgeId[] = [];
    if (n >= 1) earned.push('first-lesson');
    if (n >= 5) earned.push('five-lessons');
    if (n >= LESSONS.length) earned.push('all-done');
    return this.grant(earned);
  }

  recordQuiz(slug: string, correct: number, total: number): BadgeId[] {
    const best = Math.max(this.state().quizBest[slug] ?? 0, correct);
    this.patch({ quizBest: { ...this.state().quizBest, [slug]: best } });
    return correct === total ? this.grant(['perfect-quiz']) : [];
  }

  /** Ghi nhận thử thách; trả về true nếu là lần đầu hoàn thành. */
  completeChallenge(slug: string, id: string): boolean {
    const done = this.state().challenges[slug] ?? [];
    if (done.includes(id)) return false;
    this.patch({ challenges: { ...this.state().challenges, [slug]: [...done, id] } });
    return true;
  }

  grantChallenger(): BadgeId[] {
    return this.grant(['challenger']);
  }

  reset(): void {
    this.state.set({ ...EMPTY, greeted: true });
    safeStorage.write(KEY, this.state());
  }

  private grant(ids: BadgeId[]): BadgeId[] {
    const have = this.badges();
    const fresh = ids.filter((id) => !have.has(id));
    if (fresh.length) this.patch({ badges: [...this.state().badges, ...fresh] });
    return fresh;
  }

  private patch(p: Partial<ProgressState>): void {
    this.state.update((s) => ({ ...s, ...p }));
    safeStorage.write(KEY, this.state());
  }
}
