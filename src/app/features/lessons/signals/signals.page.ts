import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { CartSummary } from './demo/cart-summary';
import { SignalsAdvanced } from './signals-advanced';
import { SIGNALS } from './signals.content';
import { SignalsVisualizer } from './signals.visualizer';

@Component({
  selector: 'app-signals-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, SignalsVisualizer, CartSummary, SignalsAdvanced, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/gio-hang">
      <app-signals-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-cart-summary /></div>
      <app-signals-advanced slot="advanced" />
      <app-practice-cta slot="practice" slug="signals" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep p { margin: 0 0 8px; }
    .live-plain ::ng-deep button { padding: 4px 12px; margin-right: 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep ul { margin: 8px 0 0; padding-left: 20px; font-family: ui-monospace, monospace; font-size: 13px; }
  `,
})
export class SignalsPage {
  protected readonly meta = lessonBySlug('signals')!;
  protected readonly content = SIGNALS;
}
