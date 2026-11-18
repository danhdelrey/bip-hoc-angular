import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { COMPONENT } from './component.content';
import { ComponentVisualizer } from './component.visualizer';
import { ProductCard } from './demo/product-card';

@Component({
  selector: 'app-component-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, ComponentVisualizer, ProductCard],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/san-pham">
      <app-component-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-product-card /><app-product-card /></div>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep h3 { margin: 0 0 4px; font-family: system-ui, sans-serif; font-size: 1rem; }
    .live-plain ::ng-deep p { margin: 0 0 8px; }
    .live-plain ::ng-deep button { padding: 4px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
  `,
})
export class ComponentPage {
  protected readonly meta = lessonBySlug('component')!;
  protected readonly content = COMPONENT;
}
