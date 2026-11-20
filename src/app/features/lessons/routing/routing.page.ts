import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { ShopShell } from './demo/shop-shell';
import { ROUTING } from './routing.content';
import { RoutingVisualizer } from './routing.visualizer';

@Component({
  selector: 'app-routing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, RoutingVisualizer, ShopShell, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="(xem thanh địa chỉ thật ↑)">
      <app-routing-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-shop-shell /></div>
      <app-practice-cta slot="practice" slug="routing" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep nav { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
    .live-plain ::ng-deep nav a { color: #1a55c4; }
    .live-plain ::ng-deep nav a.on { font-weight: 700; text-decoration: none; color: #111; }
    .live-plain ::ng-deep button { padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep h3 { margin: 12px 0 4px; font-family: system-ui, sans-serif; font-size: 1.05rem; }
    .live-plain ::ng-deep p { margin: 4px 0; }
  `,
})
export class RoutingPage {
  protected readonly meta = lessonBySlug('routing')!;
  protected readonly content = ROUTING;
}
