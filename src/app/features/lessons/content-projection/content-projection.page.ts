import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { CONTENT_PROJECTION } from './content-projection.content';
import { ContentProjectionVisualizer } from './content-projection.visualizer';
import { ProjectionDemo } from './demo/projection-demo';

@Component({
  selector: 'app-content-projection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, ContentProjectionVisualizer, ProjectionDemo],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content">
      <app-content-projection-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-projection-demo /></div>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep h3 { margin: 0; font-family: system-ui, sans-serif; font-size: 1.05rem; }
    .live-plain ::ng-deep p { margin: 4px 0; }
    .live-plain ::ng-deep button { padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class ContentProjectionPage {
  protected readonly meta = lessonBySlug('content-projection')!;
  protected readonly content = CONTENT_PROJECTION;
}
