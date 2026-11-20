import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { ACCESSIBILITY } from './accessibility.content';
import { AccessibilityVisualizer } from './accessibility.visualizer';
import { A11yTabs } from './demo/a11y-tabs';

@Component({
  selector: 'app-accessibility-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, AccessibilityVisualizer, A11yTabs, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/ao-mua">
      <app-accessibility-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-a11y-tabs /></div>
      <app-practice-cta slot="practice" slug="accessibility" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep button { padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class AccessibilityPage {
  protected readonly meta = lessonBySlug('accessibility')!;
  protected readonly content = ACCESSIBILITY;
}
