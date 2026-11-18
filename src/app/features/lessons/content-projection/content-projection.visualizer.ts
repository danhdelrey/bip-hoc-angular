import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Slot = 'title' | 'default' | 'action';
interface Piece {
  id: string;
  html: string;
  attr: 'card-title' | 'card-action' | null;
  preview: string;
}
const PIECES: Piece[] = [
  { id: 'h3', html: '<h3 card-title>', attr: 'card-title', preview: 'Robot Bíp' },
  { id: 'p', html: '<p>', attr: null, preview: 'Một đoạn mô tả' },
  { id: 'img', html: '<img>', attr: null, preview: '🖼️ ảnh' },
  { id: 'btn', html: '<button card-action>', attr: 'card-action', preview: '❤ Thích' },
  { id: 'small', html: '<small card-title>', attr: 'card-title', preview: 'phụ đề' },
];
const SLOTS: { id: Slot; sel: string; anchor: string }[] = [
  { id: 'title', sel: 'select="[card-title]"', anchor: 'slot-title' },
  { id: 'default', sel: '(không select — ô mặc định)', anchor: 'slot-default' },
  { id: 'action', sel: 'select="[card-action]"', anchor: 'slot-action' },
];
const slotOf = (p: Piece): Slot => (p.attr === 'card-title' ? 'title' : p.attr === 'card-action' ? 'action' : 'default');

interface Frame {
  placed: Record<string, Slot | 'flying'>;
  checking: Slot | null;
  stamp: number; // số item đã in ở phần template
}

@Component({
  selector: 'app-content-projection-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="stage">
      <div class="parent">
        <p class="eyebrow">Template của nhà cha</p>
        <code class="tag">&lt;app-info-card&gt;</code>
        @for (p of pieces; track p.id) {
          <button type="button" class="piece" [class.on]="on().includes(p.id)" [class.fly]="f.placed[p.id] === 'flying'" (click)="toggle(p.id)" [attr.aria-pressed]="on().includes(p.id)">
            <app-icon [name]="on().includes(p.id) ? 'check' : 'plus'" [size]="14" /> <code>{{ p.html }}</code>
          </button>
        }
        <code class="tag">&lt;/app-info-card&gt;</code>
      </div>

      <div class="frame-card">
        <p class="eyebrow">InfoCard — khung tranh 3 ô</p>
        @for (s of slots; track s.id) {
          <div class="slot" [class]="'slot s-' + s.id" [class.checking]="f.checking === s.id" [appAnchor]="s.anchor">
            <span class="sel"><code>&lt;ng-content {{ s.sel }}&gt;</code></span>
            <div class="content">
              @for (p of inSlot(f, s.id); track p.id) {
                <span class="painting">{{ p.preview }}</span>
              } @empty {
                <span class="empty">{{ s.id === 'action' ? '(chưa có nút nào) ← nội dung dự phòng' : 'trống' }}</span>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <div class="tpl">
      <div class="tpl-head">
        <p class="eyebrow">ngTemplateOutlet — in bản vẽ cho từng item</p>
        <button type="button" class="btn btn-sm btn-di" (click)="switchTpl()" appAnchor="outlet"><app-icon name="shuffle" [size]="14" /> Đổi sang bản vẽ {{ fancy() ? 'đơn giản' : 'cầu kỳ' }}</button>
      </div>
      <div class="tpl-body">
        <div class="blueprint" [appAnchor]="fancy() ? 'tpl-fancy' : 'tpl-plain'">
          <code>&lt;ng-template #{{ fancy() ? 'fancyTpl' : 'plainTpl' }} let-fruit{{ fancy() ? ' let-i="index"' : '' }}&gt;</code>
          <span>{{ fancy() ? fancyBody : plainBody }}</span>
        </div>
        <ul class="printed">
          @for (fr of fruits; track fr; let i = $index) {
            <li [class.done]="i < f.stamp" [class.now]="i === f.stamp - 1">
              @if (i < f.stamp) {
                @if (fancy()) { 🍓 {{ i + 1 }}. <b>{{ fr }}</b> } @else { {{ fr }} }
                <small>context: {{ '{' }} $implicit: '{{ fr }}', index: {{ i }} {{ '}' }}</small>
              } @else { <span class="ghost">…chưa in</span> }
            </li>
          }
        </ul>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .stage { display: grid; grid-template-columns: 280px 1fr; gap: 20px; padding: 20px 22px 8px; }
    .parent { display: grid; gap: 6px; align-content: start; padding: 12px; background: var(--surface-2); border: var(--border-thin); border-radius: var(--radius); }
    .tag { font-size: 12.5px; font-weight: 700; color: var(--text-muted); }
    .piece { display: flex; align-items: center; gap: 6px; margin-left: 16px; padding: 5px 10px; text-align: left; background: var(--surface); border: 2px dashed var(--line); border-radius: 10px; cursor: pointer; transition: transform var(--dur) var(--ease-bounce); }
    .piece code { background: none; border: none; padding: 0; font-weight: 700; }
    .piece.on { border-style: solid; background: color-mix(in srgb, var(--c-data) 30%, var(--surface)); }
    .piece.fly { transform: translateX(30px) rotate(-3deg); box-shadow: 0 0 0 3px var(--c-signal); }
    .frame-card { display: grid; gap: 10px; padding: 14px; background: color-mix(in srgb, #a16207 22%, var(--surface)); border: 6px double var(--line); border-radius: var(--radius); }
    .slot { padding: 8px 10px; background: var(--surface); border: var(--border-thin); border-radius: 12px; transition: box-shadow var(--dur-fast) ease; }
    .slot.checking, .slot.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .sel code { font-size: 12px; background: none; border: none; padding: 0; color: var(--c-di-strong); font-weight: 700; }
    .content { display: flex; flex-wrap: wrap; gap: 6px; min-height: 36px; align-items: center; margin-top: 4px; }
    .painting { padding: 4px 10px; font-weight: 600; background: var(--c-signal); color: var(--on-accent); border: var(--border-thin); border-radius: 8px; box-shadow: var(--shadow-sm); animation: deco-pop-in 420ms var(--ease-bounce); }
    .empty { font-size: 12.5px; color: var(--text-muted); font-style: italic; }
    .tpl { margin: 10px 22px 16px; padding: 12px 14px; background: var(--surface-2); border: var(--border-thin); border-radius: var(--radius); }
    .tpl-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
    .tpl-head .eyebrow { margin: 0; }
    .tpl-body { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 10px; }
    .blueprint { display: grid; gap: 6px; padding: 10px; background: #1e3a8a; color: #dbeafe; border: var(--border-thin); border-radius: 10px; background-image: linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px); background-size: 14px 14px; }
    .blueprint code { background: none; border: none; color: #fde68a; font-size: 12px; }
    .blueprint.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .printed { margin: 0; padding-left: 22px; display: grid; gap: 4px; }
    .printed li.now { background: color-mix(in srgb, var(--c-signal) 40%, transparent); border-radius: 6px; }
    .printed small { display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
    .ghost { color: var(--text-muted); }
    @media (max-width: 820px) { .stage, .tpl-body { grid-template-columns: 1fr; } }
  `,
})
export class ContentProjectionVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly pieces = PIECES;
  protected readonly slots = SLOTS;
  protected readonly fruits = ['Táo', 'Chuối', 'Cam'];
  protected readonly on = signal<string[]>(['h3', 'p', 'btn']);
  protected readonly fancy = signal(false);
  protected readonly fancyBody = '🍓 {{ i + 1 }}. <b>{{ fruit }}</b>';
  protected readonly plainBody = '{{ fruit }}';
  private placed: Record<string, Slot> = { h3: 'title', p: 'default', btn: 'action' };

  protected readonly tl = createTimeline<Frame>(
    { placed: { ...this.placed }, checking: null, stamp: 3 },
    { onEnter: (s) => this.ctx.stepAnchor.set(s.anchor ?? null) },
  );

  protected inSlot(f: Frame, s: Slot): Piece[] {
    return PIECES.filter((p) => f.placed[p.id] === s);
  }

  protected toggle(id: string): void {
    const turnOn = !this.on().includes(id);
    this.on.update((o) => (turnOn ? [...o, id] : o.filter((x) => x !== id)));
    const p = PIECES.find((x) => x.id === id)!;
    const stamp = this.tl.frame().stamp;
    const steps: Step<Frame>[] = [];
    if (turnOn) {
      const target = slotOf(p);
      steps.push({ frame: { placed: { ...this.placed, [id]: 'flying' }, checking: null, stamp }, caption: `Nhà cha thêm ${p.html} vào giữa <app-info-card>…</app-info-card>.`, duration: 900, sound: 'pop' });
      for (const s of SLOTS.filter((x) => x.id !== 'default')) {
        const hit = s.id === target;
        steps.push({ frame: { placed: { ...this.placed, [id]: 'flying' }, checking: s.id, stamp }, caption: `So với ô ${s.sel}: ${hit ? 'KHỚP!' : 'không khớp'}.`, anchor: s.anchor, duration: 900 });
        if (hit) break;
      }
      this.placed = { ...this.placed, [id]: target };
      steps.push({ frame: { placed: { ...this.placed }, checking: target, stamp }, caption: target === 'default' ? `Không khớp ô nào có select → ${p.html} rơi vào ô mặc định.` : `${p.html} được chiếu vào ô ${SLOTS.find((x) => x.id === target)!.sel}.`, anchor: SLOTS.find((x) => x.id === target)!.anchor, duration: 1000, sound: 'ting' });
    } else {
      const rest = { ...this.placed };
      delete rest[id];
      this.placed = rest;
      const emptyAction = !Object.values(rest).includes('action');
      steps.push({ frame: { placed: { ...rest }, checking: emptyAction ? 'action' : null, stamp }, caption: `Bỏ ${p.html} khỏi template cha.${emptyAction ? ' Ô nút trống → hiện nội dung dự phòng bên trong <ng-content>.' : ''}`, anchor: emptyAction ? 'slot-action' : undefined, duration: 1100 });
    }
    this.tl.load(steps);
    const used = new Set(Object.values(this.placed));
    if (used.has('title') && used.has('default') && used.has('action')) this.ctx.completeChallenge('cp-slots');
    if (!used.has('action')) this.ctx.completeChallenge('cp-fallback');
  }

  protected switchTpl(): void {
    this.fancy.update((v) => !v);
    this.ctx.completeChallenge('cp-template');
    const placed = { ...this.placed };
    const steps: Step<Frame>[] = [{ frame: { placed, checking: null, stamp: 0 }, caption: `Nhà cha truyền [itemTemplate]="${this.fancy() ? 'fancyTpl' : 'plainTpl'}" — một bản vẽ chưa in.`, anchor: this.fancy() ? 'tpl-fancy' : 'tpl-plain', duration: 1000 }];
    this.fruits.forEach((fr, i) =>
      steps.push({ frame: { placed, checking: null, stamp: i + 1 }, caption: `ngTemplateOutlet in bản vẽ cho item ${i}: context = { $implicit: '${fr}', index: ${i} }.`, anchor: 'outlet', duration: 900, sound: 'pop' }),
    );
    this.tl.load(steps);
  }
}
