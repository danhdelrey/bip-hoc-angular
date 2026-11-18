import { Component, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, Subject, concatMap, delay, exhaustMap, finalize, mergeMap, of, switchMap, tap } from 'rxjs';

const OPERATORS = { mergeMap, concatMap, switchMap, exhaustMap };
type OpName = keyof typeof OPERATORS;

// API giả: từ khoá càng ngắn trả lời càng CHẬM → dễ sinh race condition
function fakeSearch(q: string): Observable<string> {
  return of(`Kết quả cho "${q}"`).pipe(delay(1400 - Math.min(q.length, 6) * 200));
}

@Component({
  selector: 'app-race-search',
  template: `
    <select aria-label="Operator" (change)="op.set($any($event.target).value)">
      @for (o of names; track o) { <option [selected]="o === op()">{{ o }}</option> }
    </select>
    <input placeholder="Gõ thật nhanh: angular" aria-label="Tìm kiếm" (input)="terms.next($any($event.target).value)" />
    <p>Màn hình hiển thị: <b>{{ shown() }}</b></p>
    <ol>@for (line of log(); track $index) { <li>{{ line }}</li> }</ol>
  `,
})
export class RaceSearch {
  readonly names = Object.keys(OPERATORS) as OpName[];
  readonly op = signal<OpName>('mergeMap');
  readonly shown = signal('—');
  readonly log = signal<string[]>([]);
  protected readonly terms = new Subject<string>();

  constructor() {
    toObservable(this.op)
      .pipe(
        // đổi operator → dựng lại pipeline với operator mới
        switchMap((name) => {
          const flatten = OPERATORS[name] as typeof mergeMap;
          return this.terms.pipe(flatten((q) => this.request(q)));
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => this.shown.set(result));
  }

  private request(q: string): Observable<string> {
    let done = false;
    this.note(`→ gửi "${q}"`);
    return fakeSearch(q).pipe(
      tap(() => ((done = true), this.note(`✓ về "${q}"`))),
      finalize(() => done || this.note(`✗ huỷ "${q}"`)),
    );
  }

  private note(line: string) {
    this.log.update((l) => [line, ...l].slice(0, 8));
  }
}
