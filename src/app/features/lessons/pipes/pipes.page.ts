import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { PipeDemo } from './demo/pipe-demo';
import { PIPES } from './pipes.content';
import { PipesVisualizer } from './pipes.visualizer';

@Component({
  selector: 'app-pipes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, PipesVisualizer, PipeDemo, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content">
      <app-pipes-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-pipe-demo /></div>
      <app-practice-cta slot="practice" slug="pipes" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep p { margin: 0 0 8px; }
    .live-plain ::ng-deep button { padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class PipesPage {
  protected readonly meta = lessonBySlug('pipes')!;
  protected readonly content = PIPES;
}
