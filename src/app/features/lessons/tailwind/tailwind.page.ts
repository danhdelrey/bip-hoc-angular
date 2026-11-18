import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { PricingCard } from './demo/pricing-card';
import { TAILWIND } from './tailwind.content';
import { TailwindVisualizer } from './tailwind.visualizer';

/**
 * Nạp CSS Tailwind (tailwind.css) cho bài này. ViewEncapsulation.None để class Tailwind áp dụng
 * được cho visualizer và component demo con. CSS chỉ chứa utilities được dùng trong thư mục bài.
 */
@Component({
  selector: 'app-tailwind-scope',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './tailwind.css',
})
export class TailwindScope {}

@Component({
  selector: 'app-tailwind-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, TailwindVisualizer, PricingCard, TailwindScope],
  providers: [LessonContext],
  template: `
    <app-tailwind-scope>
      <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/bang-gia">
        <app-tailwind-visualizer slot="visualizer" />
        <div slot="live" class="live-tw"><app-pricing-card /></div>
      </app-lesson-layout>
    </app-tailwind-scope>
  `,
  styles: `
    .live-tw { padding: 16px; font-family: system-ui, sans-serif; color: #0f172a; background: #f1f5f9; border-radius: 10px; }
    .live-tw ::ng-deep h3 { font-family: system-ui, sans-serif; margin: 0; }
    .live-tw ::ng-deep p { margin: 0; }
  `,
})
export class TailwindPage {
  protected readonly meta = lessonBySlug('tailwind')!;
  protected readonly content = TAILWIND;
}
