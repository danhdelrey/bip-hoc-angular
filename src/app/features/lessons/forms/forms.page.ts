import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { SignupForm } from './demo/signup-form';
import { FORMS, FORMS_COMPARE } from './forms.content';
import { FormsVisualizer } from './forms.visualizer';

@Component({
  selector: 'app-forms-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, FormsVisualizer, SignupForm, Icon],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/dang-ky">
      <app-forms-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-signup-form /></div>
      <section slot="advanced" class="adv toon toon-lg" aria-labelledby="fm-adv">
        <h2 id="fm-adv"><span class="chip chip-data"><app-icon name="form" [size]="16" /> So sánh</span> 3 cách viết form</h2>
        <p class="muted">Xem code của từng cách trong các tab ở phần 3. Tóm tắt nhanh:</p>
        <div class="cards">
          @for (c of compare; track c.name) {
            <article class="card toon deco-tilt">
              <h3><app-icon [name]="c.icon" [size]="20" /> {{ c.name }}</h3>
              <p><strong class="ok">Mạnh:</strong> {{ c.pros }}</p>
              <p><strong class="ko">Lưu ý:</strong> {{ c.cons }}</p>
            </article>
          }
        </div>
      </section>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep label { display: block; margin-bottom: 8px; }
    .live-plain ::ng-deep input { display: block; margin-top: 2px; padding: 5px 8px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep input[aria-invalid='true'] { border-color: crimson; }
    .adv { display: block; margin: 0 0 44px; padding: 20px 22px 22px; }
    h2 { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: var(--fs-lg); }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .card { padding: 14px 16px; }
    .card h3 { display: flex; gap: 8px; align-items: center; font-size: var(--fs-md); }
    .card p { font-size: var(--fs-sm); margin: 4px 0; }
    .ok { color: var(--c-data-strong); } .ko { color: var(--c-event-strong); }
  `,
})
export class FormsPage {
  protected readonly meta = lessonBySlug('forms')!;
  protected readonly content = FORMS;
  protected readonly compare = FORMS_COMPARE;
}
