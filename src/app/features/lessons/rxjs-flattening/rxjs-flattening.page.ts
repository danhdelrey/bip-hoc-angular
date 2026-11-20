import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { RaceSearch } from './demo/race-search';
import { RXJS_FLATTENING } from './rxjs-flattening.content';
import { RxjsFlatteningVisualizer } from './rxjs-flattening.visualizer';

@Component({
  selector: 'app-rxjs-flattening-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, RxjsFlatteningVisualizer, RaceSearch, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/tim-kiem">
      <app-rxjs-flattening-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-race-search /></div>
      <app-practice-cta slot="practice" slug="rxjs-flattening" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep select, .live-plain ::ng-deep input { padding: 4px 8px; margin-right: 6px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep ol { margin: 4px 0; padding-left: 20px; font-family: ui-monospace, monospace; font-size: 13px; }
  `,
})
export class RxjsFlatteningPage {
  protected readonly meta = lessonBySlug('rxjs-flattening')!;
  protected readonly content = RXJS_FLATTENING;
}
