import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { FastList } from './demo/fast-list';
import { PERFORMANCE } from './performance.content';
import { PerformanceVisualizer } from './performance.visualizer';

@Component({
  selector: 'app-performance-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, PerformanceVisualizer, FastList],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/san-pham">
      <app-performance-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-fast-list /></div>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep input { padding: 5px 8px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep p { margin: 6px 0; }
  `,
})
export class PerformancePage {
  protected readonly meta = lessonBySlug('performance')!;
  protected readonly content = PERFORMANCE;
}
