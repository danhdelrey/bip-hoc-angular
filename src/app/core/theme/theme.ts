import { DOCUMENT, Service, computed, effect, inject, signal } from '@angular/core';
import { safeStorage } from '../storage/safe-storage';

export type ThemeMode = 'light' | 'dark';
const KEY = 'bip.theme';

/** Sáng / tối. Mặc định theo hệ thống, người dùng chọn thì lưu lại. */
@Service()
export class Theme {
  private readonly doc = inject(DOCUMENT);
  private readonly systemDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  private readonly chosen = signal<ThemeMode | null>(safeStorage.read<ThemeMode | null>(KEY, null));

  readonly mode = computed<ThemeMode>(() => this.chosen() ?? (this.systemDark ? 'dark' : 'light'));
  readonly isDark = computed(() => this.mode() === 'dark');

  constructor() {
    effect(() => {
      this.doc.documentElement.dataset['theme'] = this.mode();
    });
  }

  toggle(): void {
    const next: ThemeMode = this.isDark() ? 'light' : 'dark';
    this.chosen.set(next);
    safeStorage.write(KEY, next);
  }
}
