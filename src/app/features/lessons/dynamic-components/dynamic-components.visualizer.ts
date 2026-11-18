import { ChangeDetectionStrategy, Component, ComponentRef, DestroyRef, ViewContainerRef, inject, input, output, signal, viewChild } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

const ACCENTS = ['var(--pal-sky)', 'var(--pal-coral)', 'var(--pal-mint)', 'var(--pal-lemon)', 'var(--pal-lavender)'];

/** Các "module lắp ghép" — component THẬT được tạo bằng createComponent */
@Component({
  selector: 'app-dc-module',
  template: `
    <span class="roof" aria-hidden="true"></span>
    <div class="box" [style.background]="accent()">
      <span class="emoji">{{ emoji() }}</span>
      <strong>{{ label() }} #{{ uid() }}</strong>
      <span class="tools">
        <button type="button" class="t" (click)="recolor.emit()">setInput('accent')</button>
        <button type="button" class="t" (click)="remove.emit()">destroy()</button>
      </span>
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; width: 150px; animation: drop 520ms var(--ease-bounce); }
    @keyframes drop { from { transform: translateY(-60px) rotate(-6deg); opacity: 0; } }
    .roof { height: 18px; background: var(--line); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .box { display: grid; justify-items: center; gap: 4px; padding: 10px 6px; color: var(--pal-ink); border: var(--border); border-top: none; border-radius: 0 0 12px 12px; transition: background-color var(--dur) ease; }
    .emoji { font-size: 26px; }
    strong { font-size: 13px; }
    .tools { display: grid; gap: 4px; width: 100%; }
    .t { padding: 2px 4px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; background: var(--pal-cream); color: var(--pal-ink); border: 2px solid var(--pal-ink); border-radius: 8px; cursor: pointer; }
  `,
})
export class DcModule {
  readonly label = input('Module');
  readonly emoji = input('📦');
  readonly accent = input(ACCENTS[0]);
  readonly uid = input(0);
  readonly recolor = output<void>();
  readonly remove = output<void>();
}

const KINDS: { id: string; label: string; emoji: string }[] = [
  { id: 'weather', label: 'Thời tiết', emoji: '☀️' },
  { id: 'note', label: 'Ghi chú', emoji: '📝' },
  { id: 'chart', label: 'Biểu đồ', emoji: '📈' },
];

interface Frame {
  crane: 'idle' | 'lift' | 'drop';
  stage: string;
}

@Component({
  selector: 'app-dynamic-components-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="top">
      <div class="kinds" role="radiogroup" aria-label="Loại module">
        @for (k of kinds; track k.id) {
          <button type="button" class="kind" role="radio" [attr.aria-checked]="kind() === k.id" [class.on]="kind() === k.id" (click)="kind.set(k.id)">{{ k.emoji }} {{ k.label }}</button>
        }
      </div>
      <button type="button" class="btn btn-primary" (click)="create()" appAnchor="create"><app-icon name="plus" [size]="16" /> Cẩu xuống (createComponent)</button>
      <button type="button" class="btn btn-sm" (click)="clear()" appAnchor="vcr">vcr.clear()</button>
    </div>

    <div class="site" appAnchor="vcr">
      <div class="crane" [class]="'crane c-' + f.crane" aria-hidden="true">
        <span class="arm"></span><span class="hook">🪝</span>
      </div>
      <span class="sign"><code>&lt;ng-container #slot /&gt;</code> — ViewContainerRef · {{ count() }} view</span>
      <div class="lot">
        <ng-container #slot />
        @if (!count()) { <p class="empty">Bãi đất trống. Chọn module rồi cẩu xuống!</p> }
      </div>
    </div>
    <p class="stage-cap" aria-live="polite"><app-icon name="hint" [size]="16" /> {{ f.stage }}</p>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .top { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding: 18px 22px 6px; }
    .kinds { display: inline-flex; gap: 6px; }
    .kind { padding: 6px 12px; font-weight: 800; background: var(--surface); border: var(--border-thin); border-radius: 12px; cursor: pointer; }
    .kind.on { background: var(--c-signal); color: var(--on-accent); }
    .site { position: relative; margin: 10px 22px 0; padding: 70px 14px 14px; min-height: 260px; background: repeating-linear-gradient(45deg, color-mix(in srgb, #a16207 14%, var(--surface)) 0 16px, color-mix(in srgb, #a16207 8%, var(--surface)) 16px 32px); border: var(--border); border-radius: var(--radius); }
    .site.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .sign { position: absolute; left: 14px; top: 10px; padding: 2px 10px; font-size: 12.5px; font-weight: 700; background: var(--surface); border: var(--border-thin); border-radius: 8px; }
    .sign code { background: none; border: none; padding: 0; }
    .lot { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
    .empty { margin: 0; font-weight: 700; color: var(--text-muted); }
    .crane { position: absolute; right: 20px; top: 8px; display: grid; justify-items: center; transition: transform var(--dur) var(--ease-in-out); }
    .arm { width: 4px; height: 30px; background: var(--line); transition: height var(--dur) var(--ease-in-out); }
    .hook { font-size: 22px; }
    .c-lift .arm { height: 50px; }
    .c-drop .arm { height: 80px; }
    .c-drop { transform: translateX(-40px); }
    .stage-cap { display: flex; gap: 6px; align-items: center; margin: 10px 22px 6px; font-weight: 700; }
  `,
})
export class DynamicComponentsVisualizer {
  private readonly ctx = inject(LessonContext);
  private readonly slot = viewChild.required('slot', { read: ViewContainerRef });
  protected readonly kinds = KINDS;
  protected readonly kind = signal('weather');
  protected readonly count = signal(0);
  private refs: ComponentRef<DcModule>[] = [];
  private uid = 0;
  private created = 0;

  protected readonly tl = createTimeline<Frame>({ crane: 'idle', stage: 'Chưa có module nào.' }, {
    onEnter: (s) => this.ctx.stepAnchor.set(s.anchor ?? null),
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.refs.forEach((r) => r.destroy()));
  }

  protected create(): void {
    const k = KINDS.find((x) => x.id === this.kind())!;
    const id = ++this.uid;
    const steps: Step<Frame>[] = [
      { frame: { crane: 'lift', stage: `Chọn class component lúc chạy: ${k.label}.` }, caption: `Bạn chọn module "${k.label}" — Angular chưa biết trước component này lúc viết template.`, duration: 900 },
      { frame: { crane: 'drop', stage: 'createComponent(DcModule): tạo instance, injector và view.' }, caption: 'vcr.createComponent(DcModule): Angular tạo instance (chạy constructor, inject()), dựng view của nó…', anchor: 'create', duration: 1100, sound: 'pop' },
      { frame: { crane: 'drop', stage: 'Chèn view vào ViewContainerRef (sau #slot).' }, caption: '…và CHÈN view đó vào ViewContainer — ngay sau <ng-container #slot>. Module hạ xuống bãi đất!', anchor: 'vcr', duration: 1000 },
      { frame: { crane: 'idle', stage: `ref.setInput('label', '${k.label}') — gán input như binding.` }, caption: `ref.setInput('label', '${k.label}'), setInput('emoji', '${k.emoji}'): gán input và đánh dấu cần cập nhật.`, anchor: 'input', duration: 1100, sound: 'ting' },
    ];
    // Thao tác THẬT: tạo component ngay bây giờ
    const ref = this.slot().createComponent(DcModule);
    ref.setInput('label', k.label);
    ref.setInput('emoji', k.emoji);
    ref.setInput('uid', id);
    ref.setInput('accent', ACCENTS[id % ACCENTS.length]);
    ref.instance.recolor.subscribe(() => this.recolor(ref));
    ref.instance.remove.subscribe(() => this.remove(ref));
    this.refs.push(ref);
    this.count.set(this.refs.length);
    this.created++;
    if (this.created >= 3 && this.refs.length >= 3) this.ctx.completeChallenge('dc-create');
    this.tl.load(steps);
  }

  private recolor(ref: ComponentRef<DcModule>): void {
    const next = ACCENTS[(ACCENTS.indexOf(ref.instance.accent()) + 1) % ACCENTS.length];
    ref.setInput('accent', next);
    this.ctx.completeChallenge('dc-input');
    this.tl.load([{ frame: { crane: 'idle', stage: `ref.setInput('accent', …) trên module #${ref.instance.uid()}.` }, caption: `setInput('accent'): input đổi → component được đánh dấu → màu mới hiện ra. Không cần tạo lại module!`, anchor: 'input', duration: 1000, sound: 'pop' }], false);
  }

  private remove(ref: ComponentRef<DcModule>): void {
    const uid = ref.instance.uid();
    ref.destroy();
    this.refs = this.refs.filter((r) => r !== ref);
    this.count.set(this.refs.length);
    this.ctx.completeChallenge('dc-destroy');
    this.tl.load([
      { frame: { crane: 'lift', stage: `ref.destroy() — module #${uid}.` }, caption: `ref.destroy(): Angular gọi ngOnDestroy, gỡ view khỏi ViewContainer và giải phóng instance #${uid}.`, anchor: 'destroy', duration: 1100, sound: 'boop' },
      { frame: { crane: 'idle', stage: `Còn ${this.refs.length} view trong ViewContainer.` }, caption: 'Các module khác không bị ảnh hưởng — mỗi ComponentRef quản lý đúng một component.', anchor: 'vcr', duration: 900 },
    ]);
  }

  protected clear(): void {
    this.slot().clear();
    this.refs = [];
    this.count.set(0);
    this.tl.load([{ frame: { crane: 'idle', stage: 'vcr.clear() — dọn sạch bãi đất.' }, caption: 'vcr.clear(): huỷ MỌI view trong ViewContainer cùng lúc.', anchor: 'vcr', duration: 1000 }], false);
  }

}
