import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { DEFER } from './defer.content';
import { DeferVisualizer } from './defer.visualizer';
import { DeferDemo } from './demo/defer-demo';

@Component({
  selector: 'app-defer-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, DeferVisualizer, DeferDemo, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/qua-tang">
      <app-defer-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-defer-demo /></div>
      <app-practice-cta slot="practice" slug="defer" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; display: grid; gap: 12px; }
    .live-plain ::ng-deep button { padding: 6px 14px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep p { margin: 4px 0; }
  `,
})
export class DeferPage {
  protected readonly meta = lessonBySlug('defer')!;
  protected readonly content = DEFER;
}
