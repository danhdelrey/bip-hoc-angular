import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { DATA_BINDING } from './data-binding.content';
import { DataBindingVisualizer } from './data-binding.visualizer';
import { ProfileCard } from './demo/profile-card';

@Component({
  selector: 'app-data-binding-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, DataBindingVisualizer, ProfileCard],
  // LessonContext riêng cho mỗi trang bài học — chính là DI ở cấp component!
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/profile">
      <app-data-binding-visualizer slot="visualizer" />
      <app-profile-card slot="live" />
    </app-lesson-layout>
  `,
})
export class DataBindingPage {
  protected readonly meta = lessonBySlug('data-binding')!;
  protected readonly content = DATA_BINDING;
}
