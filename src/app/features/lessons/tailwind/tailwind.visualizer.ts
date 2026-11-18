import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

/*
 * LƯU Ý: Tailwind quét file này để sinh CSS, nên mọi class phải được viết NGUYÊN VẸN
 * (không ghép chuỗi kiểu 'bg-' + màu). Class trang trí riêng của visualizer dùng tiền tố twl-.
 */

interface Group {
  id: string;
  label: string;
  options: string[];
}

const GROUPS: Group[] = [
  { id: 'layout', label: 'Bố cục', options: ['flex flex-col', 'flex flex-row', 'flex flex-col @md:flex-row'] },
  { id: 'align', label: 'Khoảng cách & căn', options: ['gap-2', 'gap-4 items-center'] },
  { id: 'padding', label: 'Đệm (padding)', options: ['p-2', 'p-4', 'p-8'] },
  { id: 'bg', label: 'Màu nền', options: ['bg-white', 'bg-sky-100', 'bg-amber-100', 'bg-linear-to-br from-pink-200 to-violet-200'] },
  { id: 'rounded', label: 'Bo góc', options: ['rounded-none', 'rounded-xl', 'rounded-3xl'] },
  { id: 'frame', label: 'Viền & bóng', options: ['border-2 border-slate-800', 'shadow-xl', 'border-2 border-slate-800 shadow-[6px_6px_0_#1e1b3a]'] },
  { id: 'text', label: 'Chữ', options: ['text-sm', 'text-lg font-bold'] },
  { id: 'hover', label: 'Trạng thái (hover)', options: ['transition hover:scale-105 hover:-rotate-1'] },
  { id: 'dark', label: 'Dark mode', options: ['dark:bg-slate-800 dark:text-white'] },
];

/** CSS (rút gọn) mà Tailwind sinh ra cho từng class */
const CSS: Record<string, string> = {
  flex: 'display: flex;',
  'flex-col': 'flex-direction: column;',
  'flex-row': 'flex-direction: row;',
  '@md:flex-row': '@container (width >= 28rem) { flex-direction: row; }',
  'gap-2': 'gap: calc(var(--spacing) * 2); /* 0.5rem */',
  'gap-4': 'gap: calc(var(--spacing) * 4); /* 1rem */',
  'items-center': 'align-items: center;',
  'p-2': 'padding: calc(var(--spacing) * 2); /* 0.5rem */',
  'p-4': 'padding: calc(var(--spacing) * 4); /* 1rem */',
  'p-8': 'padding: calc(var(--spacing) * 8); /* 2rem */',
  'bg-white': 'background-color: var(--color-white);',
  'bg-sky-100': 'background-color: var(--color-sky-100);',
  'bg-amber-100': 'background-color: var(--color-amber-100);',
  'bg-linear-to-br': 'background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));',
  'from-pink-200': '--tw-gradient-from: var(--color-pink-200);',
  'to-violet-200': '--tw-gradient-to: var(--color-violet-200);',
  'rounded-none': 'border-radius: 0;',
  'rounded-xl': 'border-radius: var(--radius-xl); /* 0.75rem */',
  'rounded-3xl': 'border-radius: var(--radius-3xl); /* 1.5rem */',
  'border-2': 'border-style: solid; border-width: 2px;',
  'border-slate-800': 'border-color: var(--color-slate-800);',
  'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
  'shadow-[6px_6px_0_#1e1b3a]': 'box-shadow: 6px 6px 0 #1e1b3a; /* giá trị tuỳ ý trong [ ] */',
  'text-sm': 'font-size: var(--text-sm); /* 0.875rem */',
  'text-lg': 'font-size: var(--text-lg); /* 1.125rem */',
  'font-bold': 'font-weight: 700;',
  transition: 'transition-property: color, background-color, …, scale, rotate; transition-duration: 150ms;',
  'hover:scale-105': '&:hover { scale: 105%; } /* chỉ khi thiết bị có hover */',
  'hover:-rotate-1': '&:hover { rotate: -1deg; }',
  'dark:bg-slate-800': '.twl-dark & { background-color: var(--color-slate-800); }',
  'dark:text-white': '.twl-dark & { color: var(--color-white); }',
};
const MD = 448; // @md = 28rem

@Component({
  selector: 'app-tailwind-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="twl-wrap">
      <div class="twl-palette">
        @for (g of groups; track g.id) {
          <div class="twl-group" [appAnchor]="g.id">
            <span class="twl-glabel">{{ g.label }}</span>
            <div class="twl-chips">
              @for (o of g.options; track o) {
                <button type="button" class="twl-chip" [class.twl-on]="picked()[g.id] === o" [attr.aria-pressed]="picked()[g.id] === o" (click)="toggle(g.id, o)">{{ o }}</button>
              }
            </div>
          </div>
        }
      </div>

      <div class="twl-right">
        <div class="twl-tools">
          <label class="twl-range">Bề ngang khung <b>{{ width() }}px</b> {{ width() >= md ? '≥ @md' : '< @md' }}
            <input type="range" min="260" max="640" step="10" [value]="width()" (input)="setWidth(+$any($event.target).value)" aria-label="Bề ngang container" />
          </label>
          <button type="button" class="twl-switch" role="switch" [attr.aria-checked]="dark()" (click)="toggleDark()" appAnchor="dark">
            <app-icon [name]="dark() ? 'moon' : 'sun'" [size]="16" /> {{ dark() ? 'Dark' : 'Light' }}
          </button>
        </div>

        <div class="twl-stage" [class.twl-dark]="dark()">
          <div class="twl-ruler" [style.width.px]="width()"></div>
          <div class="@container twl-box" [style.width.px]="width()">
            <article [class]="cardClass()" [class.twl-decoding]="f >= 0">
              <span class="grid size-12 shrink-0 place-items-center rounded-full bg-sky-300 text-2xl">🤖</span>
              <div class="flex-1">
                <strong>Bíp</strong>
                <div class="opacity-75">Robot hướng dẫn Angular</div>
              </div>
              <button type="button" class="rounded-full border-2 border-current px-3 py-1 font-bold">Theo dõi</button>
            </article>
          </div>
        </div>

        <div class="twl-out">
          <span class="eyebrow">class="…"</span>
          <code class="twl-classline">{{ cardClass() || '(chưa có class nào — bấm chọn bên trái)' }}</code>
          <ul class="twl-css" aria-label="CSS Tailwind sinh ra">
            @for (c of tokens(); track c; let i = $index) {
              <li [class.twl-hl]="f === i"><b>.{{ c }}</b> {{ '{' }} {{ css[c] }} {{ '}' }}</li>
            }
          </ul>
          <button type="button" class="btn btn-sm btn-primary" (click)="decode()" [disabled]="!tokens().length"><app-icon name="play" [size]="14" /> Giải mã từng class</button>
        </div>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .twl-wrap { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 18px; padding: 20px 22px 14px; }
    .twl-palette { display: grid; gap: 8px; align-content: start; }
    .twl-group { padding: 6px 8px; border-radius: 12px; }
    .twl-group.is-hl { background: color-mix(in srgb, var(--c-signal) 40%, transparent); }
    .twl-glabel { display: block; font-family: var(--font-display); font-weight: 800; font-size: var(--fs-sm); margin-bottom: 4px; }
    .twl-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .twl-chip { padding: 3px 9px; font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; text-align: left; background: var(--surface); border: 2px solid var(--line); border-radius: 9px; cursor: pointer; transition: transform var(--dur-fast) var(--ease-bounce); }
    .twl-chip:hover { transform: translateY(-2px); }
    .twl-chip.twl-on { background: var(--c-signal); color: var(--on-accent); box-shadow: var(--shadow-sm); }
    .twl-right { display: grid; gap: 12px; min-width: 0; align-content: start; }
    .twl-tools { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
    .twl-range { display: flex; gap: 8px; align-items: center; font-size: var(--fs-sm); font-weight: 700; }
    .twl-range input { width: 150px; }
    .twl-switch { display: inline-flex; gap: 6px; align-items: center; min-height: 36px; padding: 4px 12px; font-weight: 800; background: var(--surface); border: var(--border-thin); border-radius: var(--radius-pill); cursor: pointer; }
    .twl-switch[aria-checked='true'] { background: #1e293b; color: #fff; }
    .twl-stage { position: relative; min-height: 200px; padding: 22px 12px 18px; overflow-x: auto; color: #0f172a; font-family: system-ui, sans-serif; background: repeating-conic-gradient(#f1f5f9 0 25%, #fff 0 50%) 0 0 / 18px 18px; border: var(--border); border-radius: var(--radius-sm); }
    .twl-stage.twl-dark { background: #0b1120; }
    .twl-ruler { position: absolute; top: 6px; left: 12px; height: 8px; border: 2px solid #94a3b8; border-top: none; }
    .twl-box { transition: width var(--dur) var(--ease-out); }
    .twl-decoding { outline: 3px dashed #eab308; outline-offset: 4px; }
    .twl-out { display: grid; gap: 8px; padding: 12px; background: var(--surface-2); border: var(--border-thin); border-radius: var(--radius-sm); }
    .twl-classline { white-space: normal; word-break: break-word; font-size: 13px; }
    .twl-css { margin: 0; padding: 8px 10px; list-style: none; background: #10112b; color: #e6e3ff; border-radius: 10px; font-family: var(--font-mono); font-size: 12px; max-height: 220px; overflow: auto; }
    .twl-css li { padding: 2px 4px; border-radius: 6px; }
    .twl-css b { color: #7ee2ff; }
    .twl-css li.twl-hl { background: rgba(255, 212, 59, 0.28); }
    @media (max-width: 900px) { .twl-wrap { grid-template-columns: 1fr; } }
  `,
})
export class TailwindVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly groups = GROUPS;
  protected readonly css = CSS;
  protected readonly md = MD;
  protected readonly picked = signal<Record<string, string>>({ layout: 'flex flex-col', align: 'gap-2', text: 'text-sm' });
  protected readonly width = signal(320);
  protected readonly dark = signal(false);
  private crossed = { below: true, above: false };

  protected readonly cardClass = computed(() => GROUPS.map((g) => this.picked()[g.id]).filter(Boolean).join(' '));
  protected readonly tokens = computed(() => this.cardClass().split(' ').filter(Boolean));

  protected readonly tl = createTimeline<number>(-1, {
    onEnter: (s) => this.ctx.stepAnchor.set(s.anchor ?? null),
  });

  protected toggle(group: string, cls: string): void {
    this.picked.update((p) => ({ ...p, [group]: p[group] === cls ? '' : cls }));
    this.tl.reset(-1);
    this.check();
  }

  protected setWidth(w: number): void {
    this.width.set(w);
    if (w < MD) this.crossed.below = true;
    if (w >= MD && this.crossed.below) this.crossed.above = true;
    this.check();
  }

  protected toggleDark(): void {
    this.dark.update((d) => !d);
    this.check();
  }

  private check(): void {
    const p = this.picked();
    if (['padding', 'bg', 'rounded', 'frame'].every((g) => p[g])) this.ctx.completeChallenge('tw-card');
    if (p['layout']?.includes('@md:') && this.crossed.above && this.width() >= MD) this.ctx.completeChallenge('tw-responsive');
    if (p['dark'] && this.dark()) this.ctx.completeChallenge('tw-dark');
  }

  /** Step-player: đi qua từng class, cho thấy CSS mà Tailwind sinh ra */
  protected decode(): void {
    const groupOf = (c: string) => GROUPS.find((g) => g.options.some((o) => o.split(' ').includes(c)))?.id;
    const steps: Step<number>[] = this.tokens().map((c, i) => ({
      frame: i,
      caption: `.${c} → ${CSS[c] ?? '(utility)'}`,
      anchor: groupOf(c),
      duration: 1100,
      sound: 'pop' as const,
    }));
    steps.push({ frame: -1, caption: `Xong ${this.tokens().length} class. Tailwind chỉ sinh CSS cho đúng những class bạn dùng → file CSS nhỏ gọn.`, duration: 1200, sound: 'ting' });
    this.tl.load(steps);
  }
}
