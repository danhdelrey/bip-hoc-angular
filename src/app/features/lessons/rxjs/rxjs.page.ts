import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { CodePanel } from '../../../shared/ui/code-panel/code-panel';
import { Icon } from '../../../shared/ui/icon/icon';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { FruitSearch } from './demo/fruit-search';
import { RXJS, RXJS_INTEROP, RXJS_SIGNAL_TABLE } from './rxjs.content';
import { RxjsVisualizer } from './rxjs.visualizer';

@Component({
  selector: 'app-rxjs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, RxjsVisualizer, FruitSearch, CodePanel, Icon],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content" liveUrl="localhost:4200/tim-kiem">
      <app-rxjs-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-fruit-search /></div>
      <section slot="advanced" class="adv toon toon-lg" aria-labelledby="rx-adv">
        <h2 id="rx-adv"><span class="chip chip-signal"><app-icon name="signal" [size]="16" /> Nâng cao</span> Signal hay Observable?</h2>
        <div class="tbl" role="table" aria-label="So sánh Signal và Observable">
          <div class="row head" role="row"><span role="columnheader"></span><span role="columnheader"><app-icon name="signal" [size]="16" /> Signal</span><span role="columnheader"><app-icon name="marble" [size]="16" /> Observable</span></div>
          @for (r of table; track r[0]) {
            <div class="row" role="row"><strong role="rowheader">{{ r[0] }}</strong><span role="cell">{{ r[1] }}</span><span role="cell">{{ r[2] }}</span></div>
          }
        </div>
        <h3>Cầu nối: toSignal / toObservable</h3>
        <app-code-panel [files]="[{ name: 'interop.ts', lang: 'typescript', code: interop }]" [compact]="true" />
      </section>
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep input { padding: 6px 10px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #fff; color: #111; }
    .live-plain ::ng-deep p { margin: 8px 0 4px; }
    .adv { display: block; margin: 0 0 44px; padding: 20px 22px 22px; }
    h2 { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: var(--fs-lg); }
    h3 { font-size: var(--fs-md); margin-top: 16px; }
    .tbl { display: grid; border: var(--border); border-radius: var(--radius-sm); overflow: hidden; }
    .row { display: grid; grid-template-columns: 140px 1fr 1fr; }
    .row > * { padding: 8px 12px; border-bottom: var(--border-thin); }
    .row:last-child > * { border-bottom: none; }
    .row > *:not(:last-child) { border-right: var(--border-thin); }
    .head { font-family: var(--font-display); font-weight: 600; background: var(--surface-2); }
    .head span { display: flex; gap: 6px; align-items: center; }
    @media (max-width: 640px) { .row { grid-template-columns: 1fr; } .row > *:not(:last-child) { border-right: none; } }
  `,
})
export class RxjsPage {
  protected readonly meta = lessonBySlug('rxjs')!;
  protected readonly content = RXJS;
  protected readonly table = RXJS_SIGNAL_TABLE;
  protected readonly interop = RXJS_INTEROP;
}
