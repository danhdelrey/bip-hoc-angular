import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { OrderForm } from './demo/order-form';
import { REACTIVE_FORMS } from './reactive-forms.content';
import { ReactiveFormsVisualizer } from './reactive-forms.visualizer';

@Component({
  selector: 'app-reactive-forms-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, ReactiveFormsVisualizer, OrderForm],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/dat-hang">
      <app-reactive-forms-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-order-form /></div>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep input { margin: 3px 4px 3px 0; padding: 4px 8px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep input[type='number'] { width: 70px; }
    .live-plain ::ng-deep button { margin: 3px 4px 3px 0; padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep small { margin-left: 4px; color: #555; }
    .live-plain ::ng-deep .err { color: #b91c1c; }
    .live-plain ::ng-deep pre { margin: 6px 0 0; padding: 6px 8px; max-height: 160px; overflow: auto; background: #f6f8fa; border-radius: 6px; font-size: 12px; }
  `,
})
export class ReactiveFormsPage {
  protected readonly meta = lessonBySlug('reactive-forms')!;
  protected readonly content = REACTIVE_FORMS;
}
