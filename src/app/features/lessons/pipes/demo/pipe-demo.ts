import { DatePipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { StarsPipe } from './stars.pipe';

@Component({
  selector: 'app-pipe-demo',
  imports: [DatePipe, UpperCasePipe, SlicePipe, StarsPipe],
  template: `
    <p>{{ today() | date: 'fullDate' }}</p>
    <p>{{ today() | date: 'fullDate' | uppercase }}</p>
    <p>{{ today() | date: 'fullDate' | uppercase | slice: 0 : 9 | stars }}</p>
    <button (click)="nextDay()">Ngày mai</button>
  `,
})
export class PipeDemo {
  today = signal(new Date(2026, 10, 18));

  nextDay() {
    this.today.update((d) => new Date(d.getTime() + 86_400_000));
  }
}
