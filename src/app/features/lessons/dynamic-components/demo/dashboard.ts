import { NgComponentOutlet } from '@angular/common';
import { Component, Type, signal } from '@angular/core';
import { NoteCard, WeatherCard } from './widgets';

@Component({
  selector: 'app-dashboard',
  imports: [NgComponentOutlet],
  template: `
    <button (click)="add(WeatherCard)">+ Thời tiết</button>
    <button (click)="add(NoteCard)">+ Ghi chú</button>
    <button (click)="widgets.set([])">Xoá hết</button>
    @for (w of widgets(); track $index) {
      <ng-container *ngComponentOutlet="w; inputs: { title: 'Widget ' + ($index + 1) }" />
    }
  `,
})
export class Dashboard {
  protected readonly WeatherCard = WeatherCard;
  protected readonly NoteCard = NoteCard;
  widgets = signal<Type<unknown>[]>([]);

  add(component: Type<unknown>) {
    this.widgets.update((w) => [...w, component]);
  }
}
