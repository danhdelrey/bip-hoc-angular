import { Component, signal } from '@angular/core';
import { Highlight } from './highlight';
import { Unless } from './unless';

@Component({
  selector: 'app-directive-demo',
  imports: [Highlight, Unless],
  template: `
    <p appHighlight="#ffd43b">Rê chuột vào dòng này (attribute directive)</p>
    <label>
      <input type="checkbox" [checked]="hidden()" (change)="hidden.set(!hidden())" /> Ẩn hộp
    </label>
    <p *appUnless="hidden()">📦 Hộp hiện vì hidden = false (structural directive)</p>
  `,
})
export class DirectiveDemo {
  hidden = signal(false);
}
