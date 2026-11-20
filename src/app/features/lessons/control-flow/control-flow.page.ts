import { ChangeDetectionStrategy, Component } from '@angular/core';
import { lessonBySlug } from '../../../content/lessons.registry';
import { PracticeCta } from '../../../shared/lab/practice-cta';
import { LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { CodePanel } from '../../../shared/ui/code-panel/code-panel';
import { Icon } from '../../../shared/ui/icon/icon';
import { LessonLayout } from '../../../shared/ui/lesson-layout/lesson-layout';
import { BrowserFrame } from '../../../shared/ui/browser-frame/browser-frame';
import { CF_SAMPLES, CONTROL_FLOW } from './control-flow.content';
import { ControlFlowVisualizer } from './control-flow.visualizer';
import { DirectiveDemo } from './demo/directive-demo';
import { FruitList } from './demo/fruit-list';

@Component({
  selector: 'app-control-flow-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LessonLayout, ControlFlowVisualizer, FruitList, DirectiveDemo, CodePanel, Icon, BrowserFrame, PracticeCta],
  providers: [LessonContext],
  template: `
    <app-lesson-layout [meta]="meta" [content]="content">
      <app-control-flow-visualizer slot="visualizer" />
      <div slot="live" class="live-plain"><app-fruit-list /></div>
      <section slot="advanced" class="adv toon toon-lg" aria-labelledby="dir-title">
        <h2 id="dir-title"><span class="chip chip-event"><app-icon name="code" [size]="16" /> Nâng cao</span> Tự viết directive</h2>
        <p class="muted">Attribute directive đổi hành vi/giao diện của phần tử có sẵn. Structural directive (dấu *) quyết định template có được tạo ra hay không — giống cách &#64;if làm.</p>
        <div class="grid">
          <app-code-panel [files]="dirFiles" title="Directive" [stackblitz]="true" [stackblitzExtra]="dirExtra" />
          <app-browser-frame url="localhost:4200/directive">
            <div class="live-plain"><app-directive-demo /></div>
          </app-browser-frame>
        </div>
      </section>
      <app-practice-cta slot="practice" slug="control-flow" />
    </app-lesson-layout>
  `,
  styles: `
    .live-plain { font-family: system-ui, sans-serif; }
    .live-plain ::ng-deep button { padding: 3px 10px; margin-right: 6px; font: inherit; border: 1px solid #888; border-radius: 6px; background: #f3f3f3; color: #111; cursor: pointer; }
    .live-plain ::ng-deep p { padding: 4px 6px; border-radius: 6px; }
    .adv { display: block; margin: 0 0 44px; padding: 20px 22px 22px; }
    h2 { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: var(--fs-lg); }
    .grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 18px; align-items: start; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class ControlFlowPage {
  protected readonly meta = lessonBySlug('control-flow')!;
  protected readonly content = CONTROL_FLOW;
  protected readonly dirFiles = [
    { name: 'highlight.ts', lang: 'angular-ts' as const, code: CF_SAMPLES['highlight.ts'] },
    { name: 'unless.ts', lang: 'angular-ts' as const, code: CF_SAMPLES['unless.ts'] },
    { name: 'directive-demo.ts', lang: 'angular-ts' as const, code: CF_SAMPLES['directive-demo.ts'] },
  ];
  protected readonly dirExtra = {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { DirectiveDemo } from './app/directive-demo';\n\nbootstrapApplication(DirectiveDemo).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Directive</title></head>\n<body><app-directive-demo></app-directive-demo></body>\n</html>\n`,
  };
}
