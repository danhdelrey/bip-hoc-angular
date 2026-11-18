import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, delay, distinctUntilChanged, map, of, switchMap } from 'rxjs';

const FRUITS = ['Táo', 'Chuối', 'Cam', 'Dưa hấu', 'Dâu', 'Đào', 'Nho', 'Na'];

function fakeSearch(q: string) {
  const hits = FRUITS.filter((f) => f.toLowerCase().includes(q.toLowerCase()));
  return of(hits).pipe(delay(600)); // giả lập gọi API
}

@Component({
  selector: 'app-fruit-search',
  imports: [ReactiveFormsModule],
  template: `
    <input [formControl]="query" placeholder="Tìm trái cây…" aria-label="Tìm trái cây" />
    <p>Kết quả cho "{{ term() }}":</p>
    <ul>
      @for (f of results(); track f) {
        <li>{{ f }}</li>
      } @empty {
        <li>(không có)</li>
      }
    </ul>
  `,
})
export class FruitSearch {
  query = new FormControl('', { nonNullable: true });

  private readonly term$ = this.query.valueChanges.pipe(
    debounceTime(400),
    map((q) => q.trim()),
    distinctUntilChanged(),
  );

  term = toSignal(this.term$, { initialValue: '' });
  results = toSignal(this.term$.pipe(switchMap((q) => fakeSearch(q))), { initialValue: FRUITS });
}
