import { Service, signal } from '@angular/core';

@Service()
export class Auth {
  readonly loggedIn = signal(false);
  readonly blockedAt = signal<string | null>(null);

  toggle() {
    this.loggedIn.update((v) => !v);
  }
}
