import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type BoxId = 'viewport' | 'interaction' | 'idle' | 'timer';
type BoxState = 'placeholder' | 'loading' | 'done';
const BOXES: { id: BoxId; trigger: string; gift: string; chunk: string }[] = [
  { id: 'viewport', trigger: 'on viewport', gift: '🖼️ Thư viện ảnh', chunk: 'chunk-gallery.js' },
  { id: 'interaction', trigger: 'on interaction', gift: '📈 Biểu đồ', chunk: 'chunk-chart.js' },
  { id: 'idle', trigger: 'on idle', gift: '💬 Khung chat', chunk: 'chunk-chat.js' },
  { id: 'timer', trigger: 'on timer(2s)', gift: '🎉 Banner khuyến mãi', chunk: 'chunk-banner.js' },
];
type Frame = Record<BoxId, BoxState>;
const ALL_CLOSED: Frame = { viewport: 'placeholder', interaction: 'placeholder', idle: 'placeholder', timer: 'placeholder' };

@Component({
  selector: 'app-defer-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, NgTemplateOutlet],
  template: `
    @let f = tl.frame();
    <ng-template #gift let-b>
      <div class="box" [class]="'box s-' + st(f, b.id)" [appAnchor]="st(f, b.id) === 'done' ? 'content' : st(f, b.id) === 'loading' ? 'loading' : 'placeholder'">
        @switch (st(f, b.id)) {
          @case ('placeholder') { <span class="lid" aria-hidden="true"></span><span class="emoji">🎁</span><span class="state">&#64;placeholder</span> }
          @case ('loading') { <span class="emoji shake">🎁</span><span class="state">&#64;loading · tải {{ b.chunk }}</span> }
          @case ('done') { <span class="emoji pop">{{ b.gift }}</span><span class="state">nội dung đã bung ra!</span> }
        }
      </div>
    </ng-template>

    <div class="grid">
      @for (b of boxes; track b.id) {
        <div class="cell" [appAnchor]="b.id">
          <code class="trig">{{ '@' }}defer ({{ b.trigger }})</code>
          @switch (b.id) {
            @case ('viewport') {
              <div class="scroller" (scroll)="onScroll($event)" tabindex="0" aria-label="Khung cuộn — cuộn xuống để thấy hộp">
                <p class="hint-scroll">⬇️ Cuộn xuống…</p>
                <div class="spacer"></div>
                <ng-container [ngTemplateOutlet]="gift" [ngTemplateOutletContext]="{ $implicit: b }" />
              </div>
            }
            @case ('interaction') {
              <button type="button" class="as-btn" (click)="open('interaction')" [disabled]="f.interaction !== 'placeholder'" aria-label="Chạm vào hộp quà">
                <ng-container [ngTemplateOutlet]="gift" [ngTemplateOutletContext]="{ $implicit: b }" />
              </button>
            }
            @case ('idle') {
              <ng-container [ngTemplateOutlet]="gift" [ngTemplateOutletContext]="{ $implicit: b }" />
              <button type="button" class="btn btn-sm" (click)="open('idle')" [disabled]="f.idle !== 'placeholder'"><app-icon name="pause" [size]="14" /> Trình duyệt rảnh</button>
            }
            @case ('timer') {
              <ng-container [ngTemplateOutlet]="gift" [ngTemplateOutletContext]="{ $implicit: b }" />
              <button type="button" class="btn btn-sm" (click)="startTimer()" [disabled]="f.timer !== 'placeholder' || counting()">
                <app-icon name="cycle" [size]="14" /> {{ counting() ? 'Đang đếm…' : 'Đếm 2 giây' }}
              </button>
            }
          }
        </div>
      }
    </div>
    <div class="controls">
      <span class="muted small">Bundle ban đầu chỉ chứa các hộp đóng. Mỗi món quà là một chunk riêng, tải khi trigger xảy ra.</span>
      <button type="button" class="btn btn-sm" (click)="reset()"><app-icon name="replay" [size]="14" /> Đóng hết hộp</button>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; padding: 20px 22px 6px; }
    .cell { display: grid; gap: 8px; align-content: start; justify-items: center; padding: 10px; background: var(--surface-2); border: var(--border-thin); border-radius: var(--radius); }
    .cell.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .trig { font-size: 12px; font-weight: 700; }
    .box { position: relative; display: grid; justify-items: center; gap: 4px; width: 150px; min-height: 120px; padding: 12px 8px; text-align: center; background: var(--surface); border: var(--border); border-radius: 14px; box-shadow: var(--shadow-sm); }
    .box.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .s-placeholder { background: color-mix(in srgb, var(--c-accent) 25%, var(--surface)); }
    .s-loading { background: color-mix(in srgb, var(--c-signal) 35%, var(--surface)); }
    .s-done { background: color-mix(in srgb, var(--c-data) 30%, var(--surface)); }
    .emoji { font-size: 40px; line-height: 1.1; }
    .s-done .emoji { font-size: 18px; font-weight: 600; padding-top: 14px; }
    .state { font-family: var(--font-mono); font-size: 11px; font-weight: 700; }
    .shake { animation: shake 260ms linear infinite; }
    .pop { animation: deco-pop-in 520ms var(--ease-bounce); }
    @keyframes shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
    .scroller { width: 100%; height: 150px; overflow-y: auto; padding: 6px; background: var(--surface); border: var(--border-thin); border-radius: 10px; display: grid; justify-items: center; }
    .spacer { height: 220px; }
    .hint-scroll { margin: 0; font-weight: 700; font-size: var(--fs-sm); }
    .as-btn { padding: 0; background: none; border: none; cursor: pointer; }
    .as-btn:disabled { cursor: default; }
    .controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; padding: 8px 22px 16px; }
    .small { font-size: var(--fs-sm); font-weight: 600; }
    @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  `,
})
export class DeferVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly boxes = BOXES;
  protected readonly counting = signal(false);
  private state: Frame = { ...ALL_CLOSED };
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly tl = createTimeline<Frame>(ALL_CLOSED, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag === 'done:interaction') this.ctx.completeChallenge('df-interaction');
      if (s.tag === 'done:viewport') this.ctx.completeChallenge('df-viewport');
      if (s.tag?.startsWith('done:') && Object.values(s.frame).every((v) => v === 'done')) this.ctx.completeChallenge('df-all');
    },
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected st(f: Frame, id: string): BoxState {
    return f[id as BoxId];
  }

  protected onScroll(e: Event): void {
    const el = e.target as HTMLElement;
    if (this.state.viewport === 'placeholder' && el.scrollTop + el.clientHeight > el.scrollHeight - 90) this.open('viewport');
  }

  protected startTimer(): void {
    this.counting.set(true);
    this.timer = setTimeout(() => {
      this.counting.set(false);
      this.open('timer');
    }, 2000);
  }

  protected open(id: BoxId): void {
    if (this.state[id] !== 'placeholder') return;
    const b = BOXES.find((x) => x.id === id)!;
    const why: Record<BoxId, string> = {
      viewport: 'IntersectionObserver báo: placeholder đã lọt vào màn hình.',
      interaction: 'Bạn vừa chạm vào placeholder (click/keydown).',
      idle: 'requestIdleCallback: trình duyệt đang rảnh tay.',
      timer: 'Đã đủ 2 giây kể từ khi render.',
    };
    const before = { ...this.state };
    const loading = { ...this.state, [id]: 'loading' as const };
    const done = { ...this.state, [id]: 'done' as const };
    this.state = done;
    const steps: Step<Frame>[] = [
      { frame: before, caption: `Trigger ${b.trigger}: ${why[id]}`, anchor: id, duration: 1100 },
      { frame: loading, caption: `Hộp rung lắc: hiển thị @loading và tải ${b.chunk} từ server.`, anchor: 'loading', duration: 1500, sound: 'pop' },
      { frame: done, caption: `Chunk tải xong → hộp bung ra: ${b.gift} được render thay cho placeholder.`, anchor: 'content', duration: 1100, sound: 'ting', tag: `done:${id}` },
    ];
    this.tl.load(steps);
  }

  protected reset(): void {
    clearTimeout(this.timer);
    this.counting.set(false);
    this.state = { ...ALL_CLOSED };
    this.tl.reset(this.state);
  }
}
