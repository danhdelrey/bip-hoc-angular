import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { SubjectLab } from './demo/subject-lab';
import { RXJS_SUBJECTS } from './rxjs-subjects.content';
import { RxjsSubjectsVisualizer } from './rxjs-subjects.visualizer';

@Component({
  selector: 'app-rxjs-subjects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, RxjsSubjectsVisualizer, SubjectLab, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/subject-lab">
      <app-rxjs-subjects-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-subject-lab /></div>
      <app-practice-cta slot="practice" slug="rxjs-subjects" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep select { padding: 3px 6px; margin-right: 6px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep button { margin: 2px 4px 2px 0; padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep ul { margin: 6px 0; padding-left: 20px; font-family: ui-monospace, monospace; font-size: 13px; }
  `,
})
export class RxjsSubjectsPage {
  protected readonly meta = lessonBySlug('rxjs-subjects')!;
  protected readonly content = RXJS_SUBJECTS;
}
