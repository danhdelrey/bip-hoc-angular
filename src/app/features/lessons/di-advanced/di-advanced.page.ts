import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { Checkout } from './demo/checkout';
import { DI_ADVANCED } from './di-advanced.content';
import { DiAdvancedVisualizer } from './di-advanced.visualizer';

@Component({
  selector: 'app-di-advanced-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, DiAdvancedVisualizer, Checkout, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/thanh-toan">
      <app-di-advanced-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-checkout /></div>
      <app-practice-cta slot="practice" slug="di-advanced" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep label { display: block; margin: 3px 0; }
    .live-plain ::ng-deep button { padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class DiAdvancedPage {
  protected readonly meta = lessonBySlug('di-advanced')!;
  protected readonly content = DI_ADVANCED;
}
