import { Component } from '@angular/core';

@Component({
  selector: 'app-info-card',
  template: `
    <article class="card">
      <header><ng-content select="[card-title]" /></header>
      <section><ng-content /></section>
      <footer><ng-content select="[card-action]">(chưa có nút nào)</ng-content></footer>
    </article>
  `,
  styles: `
    .card { padding: 10px 12px; border: 2px solid #333; border-radius: 12px; }
    header { font-weight: bold; }
    footer { margin-top: 8px; color: #555; }
  `,
})
export class InfoCard {}
