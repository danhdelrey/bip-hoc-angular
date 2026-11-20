import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { OrderPage } from './demo/order-page';
import { INPUT_OUTPUT } from './input-output.content';
import { IoVisualizer } from './input-output.visualizer';

@Component({
  selector: 'app-input-output-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, IoVisualizer, OrderPage, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/don-hang">
      <app-io-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-order-page /></div>
      <app-practice-cta slot="practice" slug="input-output" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep p { margin: 6px 0; }
    .live-plain ::ng-deep app-product-box { display: block; margin-top: 10px; padding: 10px; border: 1px dashed #999; border-radius: 8px; }
    .live-plain ::ng-deep button { padding: 3px 10px; margin-right: 4px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class InputOutputPage {
  protected readonly meta = lessonBySlug('input-output')!;
  protected readonly content = INPUT_OUTPUT;
}
