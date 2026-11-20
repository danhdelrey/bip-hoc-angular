import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { Dashboard } from './demo/dashboard';
import { DYNAMIC_COMPONENTS } from './dynamic-components.content';
import { DynamicComponentsVisualizer } from './dynamic-components.visualizer';

@Component({
  selector: 'app-dynamic-components-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, DynamicComponentsVisualizer, Dashboard, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/dashboard">
      <app-dynamic-components-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-dashboard /></div>
      <app-practice-cta slot="practice" slug="dynamic-components" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep button { padding: 3px 10px; margin-right: 6px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class DynamicComponentsPage {
  protected readonly meta = lessonBySlug('dynamic-components')!;
  protected readonly content = DYNAMIC_COMPONENTS;
}
