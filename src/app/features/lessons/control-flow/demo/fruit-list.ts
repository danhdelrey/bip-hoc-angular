import { Component, signal } from '@angular/core';

interface Fruit {
  id: number;
  name: string;
}

@Component({
  selector: 'app-fruit-list',
  template: `
    <button (click)="showTip.set(!showTip())">Bật/tắt mẹo</button>
    <button (click)="shuffle()">Xáo trộn</button>
    @if (showTip()) {
      <p>Mẹo: track giúp Angular giữ lại DOM cũ!</p>
    } @else {
      <p>(mẹo đang ẩn)</p>
    }
    <ul>
      @for (fruit of fruits(); track fruit.id) {
        <li>{{ fruit.name }}</li>
      } @empty {
        <li>Giỏ trống</li>
      }
    </ul>
  `,
})
export class FruitList {
  showTip = signal(true);
  fruits = signal<Fruit[]>([
    { id: 1, name: 'Táo' },
    { id: 2, name: 'Chuối' },
    { id: 3, name: 'Cam' },
  ]);

  shuffle() {
    this.fruits.update((list) => [...list].sort(() => Math.random() - 0.5));
  }
}
