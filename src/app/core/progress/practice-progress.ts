import { Service, signal } from '@angular/core';
import { PRACTICES } from '../../content/practice.registry';
import { safeStorage } from '../storage/safe-storage';

/** Số bài đã làm đúng của từng module luyện tập (đọc từ localStorage, CodeLab cập nhật khi chấm đạt). */
@Service()
export class PracticeProgress {
  private readonly state = signal<Record<string, number>>(
    Object.fromEntries(PRACTICES.map((p) => [p.slug, safeStorage.read<string[]>(p.storageKey + '.done', []).length])),
  );

  done(slug: string): number {
    return this.state()[slug] ?? 0;
  }

  record(slug: string, count: number): void {
    if (this.state()[slug] === count) return;
    this.state.update((s) => ({ ...s, [slug]: count }));
  }
}
