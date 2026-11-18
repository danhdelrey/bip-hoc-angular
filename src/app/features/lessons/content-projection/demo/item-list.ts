import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, input } from '@angular/core';

@Component({
  selector: 'app-item-list',
  imports: [NgTemplateOutlet],
  template: `
    <ul>
      @for (item of items(); track item; let i = $index) {
        <li>
          <ng-container [ngTemplateOutlet]="itemTemplate()" [ngTemplateOutletContext]="{ $implicit: item, index: i }" />
        </li>
      }
    </ul>
  `,
})
export class ItemList {
  items = input.required<string[]>();
  itemTemplate = input.required<TemplateRef<{ $implicit: string; index: number }>>();
}
