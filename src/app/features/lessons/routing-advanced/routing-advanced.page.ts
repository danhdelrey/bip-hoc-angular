import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { CatalogShell } from './demo/catalog-shell';
import { ROUTING_ADVANCED } from './routing-advanced.content';
import { RoutingAdvancedVisualizer } from './routing-advanced.visualizer';

@Component({
  selector: 'app-routing-advanced-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, RoutingAdvancedVisualizer, CatalogShell, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/cua-hang">
      <app-routing-advanced-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-catalog-shell /></div>
      <app-practice-cta slot="practice" slug="routing-advanced" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep .bar { margin: 0 0 8px; padding: 4px 8px; background: #f1f5f9; border-radius: 6px; font-family: ui-monospace, monospace; font-size: 12px; }
    .live-plain ::ng-deep a { color: #1d4ed8; }
    .live-plain ::ng-deep a.on { font-weight: 700; text-decoration: none; }
    .live-plain ::ng-deep h3 { margin: 4px 0; font-size: 1.05rem; }
    .live-plain ::ng-deep input { padding: 4px 8px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep button { margin-left: 4px; padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep .ask { padding: 6px 8px; background: #fef3c7; border-radius: 6px; }
  `,
})
export class RoutingAdvancedPage {
  protected readonly meta = lessonBySlug('routing-advanced')!;
  protected readonly content = ROUTING_ADVANCED;
}
