import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { LifeHost } from './demo/life-host';
import { LIFECYCLE } from './lifecycle.content';
import { LifecycleVisualizer } from './lifecycle.visualizer';

@Component({
  selector: 'app-lifecycle-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, LifecycleVisualizer, LifeHost],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content">
      <app-lifecycle-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-life-host /></div>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep button { padding: 3px 10px; margin-right: 6px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep ol { margin: 10px 0 0; padding-left: 22px; font-family: ui-monospace, monospace; font-size: 13px; }
  `,
})
export class LifecyclePage {
  protected readonly meta = lessonBySlug('lifecycle')!;
  protected readonly content = LIFECYCLE;
}
