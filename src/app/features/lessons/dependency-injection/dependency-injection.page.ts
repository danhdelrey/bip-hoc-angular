import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { DEPENDENCY_INJECTION } from './dependency-injection.content';
import { DiVisualizer } from './dependency-injection.visualizer';
import { ShopPage } from './demo/shop-page';
import { DiTokenPanel } from './token-panel';

@Component({
  selector: 'app-dependency-injection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, DiVisualizer, ShopPage, DiTokenPanel],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/cua-hang">
      <app-di-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-shop-page /></div>
      <app-di-token-panel slot="advanced" />
    </app-lesson-layout>
  `,
  styles: `
    /* Style "trình duyệt thường" cho kết quả live — không cartoon */
    .live-plain { display: grid; gap: 10px; font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep app-cart-badge, .live-plain ::ng-deep app-cart-panel { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding: 10px; border: 1px solid #bbb; border-radius: 6px; }
    .live-plain ::ng-deep h3 { margin: 0; font-family: system-ui, sans-serif; font-size: 1.05rem; }
    .live-plain ::ng-deep button { padding: 4px 12px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class DependencyInjectionPage {
  protected readonly meta = lessonBySlug('dependency-injection')!;
  protected readonly content = DEPENDENCY_INJECTION;
}
