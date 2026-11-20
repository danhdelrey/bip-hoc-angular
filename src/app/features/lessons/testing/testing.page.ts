import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { TestRunner } from './demo/test-runner';
import { TESTING } from './testing.content';
import { TestingVisualizer } from './testing.visualizer';

@Component({
  selector: 'app-testing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, TestingVisualizer, TestRunner, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="terminal: ng test">
      <app-testing-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-test-runner /></div>
      <app-practice-cta slot="practice" slug="testing" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep button { padding: 4px 12px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep p { margin: 6px 0; }
  `,
})
export class TestingPage {
  protected readonly meta = lessonBySlug('testing')!;
  protected readonly content = TESTING;
}
