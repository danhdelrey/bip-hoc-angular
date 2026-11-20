import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { CHANGE_DETECTION } from './change-detection.content';
import { CdVisualizer } from './change-detection.visualizer';
import { ZonelessDemo } from './demo/zoneless-demo';

@Component({
  selector: 'app-change-detection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, CdVisualizer, ZonelessDemo, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content">
      <app-cd-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-zoneless-demo /></div>
      <app-practice-cta slot="practice" slug="change-detection" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep button { display: block; margin: 6px 0; padding: 4px 12px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class ChangeDetectionPage {
  protected readonly meta = lessonBySlug('change-detection')!;
  protected readonly content = CHANGE_DETECTION;
}
