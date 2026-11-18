import { Component, Directive, input, signal } from '@angular/core';

// Directive "phụ kiện" gắn sẵn vào component qua hostDirectives
@Directive({
  host: {
    '[class.hovered]': 'hovered()',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class Hoverable {
  hovered = signal(false);
}

@Component({
  selector: 'app-weather-card',
  hostDirectives: [Hoverable],
  template: `<b>{{ title() }}</b> · ☀️ 31°C Sài Gòn`,
  styles: `
    :host { display: block; margin-top: 6px; padding: 8px; border: 1px solid #999; border-radius: 8px; }
    :host(.hovered) { background: #fff3c4; }
  `,
})
export class WeatherCard {
  title = input('');
}

@Component({
  selector: 'app-note-card',
  hostDirectives: [Hoverable],
  template: `<b>{{ title() }}</b> · 📝 Nhớ học bài Component động`,
  styles: `
    :host { display: block; margin-top: 6px; padding: 8px; border: 1px solid #999; border-radius: 8px; }
    :host(.hovered) { background: #dff7ea; }
  `,
})
export class NoteCard {
  title = input('');
}
