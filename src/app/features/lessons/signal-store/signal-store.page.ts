import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { CartView } from './demo/cart-view';
import { SIGNAL_STORE } from './signal-store.content';
import { SignalStoreVisualizer } from './signal-store.visualizer';

@Component({
  selector: 'app-signal-store-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, SignalStoreVisualizer, CartView],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/gio-hang">
      <app-signal-store-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-cart-view /></div>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep button { margin: 2px 4px 2px 0; padding: 3px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep input { padding: 4px 8px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep ul { margin: 6px 0; padding-left: 20px; }
  `,
})
export class SignalStorePage {
  protected readonly meta = lessonBySlug('signal-store')!;
  protected readonly content = SIGNAL_STORE;
}
