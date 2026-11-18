import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'on() ? appHighlight() : null',
    '(mouseenter)': 'on.set(true)',
    '(mouseleave)': 'on.set(false)',
  },
})
export class Highlight {
  appHighlight = input('yellow');
  protected on = signal(false);
}
