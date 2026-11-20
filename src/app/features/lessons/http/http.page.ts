import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { HttpLog } from './demo/http-log';
import { MockServer } from './demo/mock-server';
import { ProfileLoader } from './demo/profile-loader';
import { HTTP } from './http.content';
import { HttpVisualizer } from './http.visualizer';

@Component({
  selector: 'app-http-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, HttpVisualizer, ProfileLoader, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/ho-so">
      <app-http-visualizer slot="visualizer" />
      <div slot="live" class="live-plain">
        <p class="srv">Server giả lập trả:
          @for (s of [200, 401, 500]; track s) {
            <label><input type="radio" name="srv" [checked]="server.status() === s" (change)="server.status.set($any(s))" /> {{ s }}</label>
          }
        </p>
        <app-profile-loader />
        <ol class="log">
          @for (l of log.lines(); track $index) { <li>{{ l }}</li> }
        </ol>
      </div>
      <app-practice-cta slot="practice" slug="http" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .srv { display: flex; gap: 10px; margin: 0 0 10px; font-size: 14px; }
    .live-plain ::ng-deep button { padding: 4px 12px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .log { margin: 10px 0 0; padding-left: 20px; font-family: ui-monospace, monospace; font-size: 12.5px; }
  `,
})
export class HttpPage {
  protected readonly meta = lessonBySlug('http')!;
  protected readonly content = HTTP;
  protected readonly server = inject(MockServer);
  protected readonly log = inject(HttpLog);
}
