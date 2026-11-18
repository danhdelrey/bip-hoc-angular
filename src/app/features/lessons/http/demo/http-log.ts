import { Service, signal } from '@angular/core';

@Service()
export class HttpLog {
  readonly lines = signal<string[]>([]);

  add(line: string) {
    this.lines.update((l) => [...l, line].slice(-6));
  }
}
