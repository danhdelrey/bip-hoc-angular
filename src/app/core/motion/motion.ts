import { DestroyRef, Service, inject, signal } from '@angular/core';

/** Theo dõi `prefers-reduced-motion` dưới dạng signal. */
@Service()
export class Motion {
  private readonly query = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  readonly reduced = signal(this.query?.matches ?? false);

  constructor() {
    const onChange = (e: MediaQueryListEvent) => this.reduced.set(e.matches);
    this.query?.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.query?.removeEventListener('change', onChange));
  }
}
