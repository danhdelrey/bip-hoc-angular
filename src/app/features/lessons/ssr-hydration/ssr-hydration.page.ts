import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { SafeWidget } from './demo/safe-widget';
import { SSR_HYDRATION } from './ssr-hydration.content';
import { SsrHydrationVisualizer } from './ssr-hydration.visualizer';

@Component({
  selector: 'app-ssr-hydration-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, SsrHydrationVisualizer, SafeWidget],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/ao-mua">
      <app-ssr-hydration-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-safe-widget /></div>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep p { margin: 4px 0; }
    .live-plain ::ng-deep button { padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class SsrHydrationPage {
  protected readonly meta = lessonBySlug('ssr-hydration')!;
  protected readonly content = SSR_HYDRATION;
}
