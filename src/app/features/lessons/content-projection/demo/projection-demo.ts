import { Component, signal } from '@angular/core';
import { InfoCard } from './info-card';
import { ItemList } from './item-list';

@Component({
  selector: 'app-projection-demo',
  imports: [InfoCard, ItemList],
  template: `
    <app-info-card>
      <h3 card-title>Robot Bíp</h3>
      <p>Đoạn này không có selector nên rơi vào ô mặc định.</p>
      <button card-action (click)="likes.update((n) => n + 1)">❤ {{ likes() }}</button>
    </app-info-card>

    <app-item-list [items]="fruits" [itemTemplate]="fancy() ? fancyTpl : plainTpl" />
    <button (click)="fancy.set(!fancy())">Đổi template</button>

    <ng-template #plainTpl let-fruit>{{ fruit }}</ng-template>
    <ng-template #fancyTpl let-fruit let-i="index">🍓 {{ i + 1 }}. <b>{{ fruit }}</b></ng-template>
  `,
})
export class ProjectionDemo {
  likes = signal(0);
  fancy = signal(false);
  fruits = ['Táo', 'Chuối', 'Cam'];
}
