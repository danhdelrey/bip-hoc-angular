import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl } from '@angular/forms';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';
import { TreeDiagram, type TreeNode } from '../../../shared/ui/tree-diagram/tree-diagram';

type Key = 'form' | 'email' | 'password' | 'age';
interface Snap {
  value: string;
  valid: boolean;
  dirty: boolean;
  touched: boolean;
  errors: string[];
}
interface Frame {
  nodes: Record<Key, Snap>;
  focus: Key | null;
  stage: 'idle' | 'value' | 'validate' | 'self' | 'parent' | 'ui';
}
const NODES: (TreeNode & { label: string })[] = [
  { id: 'form', label: 'FormGroup' },
  { id: 'email', parent: 'form', label: 'email' },
  { id: 'password', parent: 'form', label: 'password' },
  { id: 'age', parent: 'form', label: 'age' },
];
const ERR_VI: Record<string, string> = { required: 'bắt buộc', email: 'sai email', minlength: 'ngắn quá', min: 'nhỏ quá' };

@Component({
  selector: 'app-forms-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, StepPlayer, Icon, AnchorDirective, TreeDiagram],
  template: `
    @let f = tl.frame();
    <div class="stage">
      <form class="demo-form" [formGroup]="form" (ngSubmit)="$event.preventDefault()" appAnchor="form">
        <label appAnchor="email">Email
          <input class="field" type="email" formControlName="email" placeholder="bip@angular.vn" />
        </label>
        <label appAnchor="password">Mật khẩu (≥ 6 ký tự)
          <input class="field" type="password" formControlName="password" />
        </label>
        <label appAnchor="age">Tuổi (≥ 13, có thể để trống)
          <input class="field" type="number" formControlName="age" />
        </label>
        <div class="row">
          <button type="button" class="btn btn-sm" (click)="reset()"><app-icon name="replay" [size]="14" /> Reset</button>
          <button type="button" class="btn btn-sm btn-data" (click)="fill()"><app-icon name="check" [size]="14" /> Điền mẫu hợp lệ</button>
        </div>
      </form>

      <div class="tree-side">
        <app-tree-diagram [nodes]="nodes" [opts]="{ nodeW: 150, nodeH: 132, gapX: 12, gapY: 40 }">
          <ng-template let-n>
            @let s = snapOf(f, n.id);
            <div class="node" [class.focus]="f.focus === n.id || (n.id === 'form' && f.stage === 'parent')" [class.bad]="!s.valid && (s.touched || n.id === 'form')" [appAnchor]="n.id">
              <span class="face" [class]="'face ' + mood(s, n.id)" aria-hidden="true"><i></i><i></i><b></b></span>
              <strong>{{ $any(n).label }}</strong>
              <code class="val">{{ s.value }}</code>
              <span class="flags">
                <span [class.on]="s.valid">valid</span>
                <span [class.on]="s.dirty">dirty</span>
                <span [class.on]="s.touched">touched</span>
              </span>
              @if (s.errors.length) { <span class="errs"><app-icon name="error" [size]="12" /> {{ s.errors.join(', ') }}</span> }
            </div>
          </ng-template>
        </app-tree-diagram>
      </div>
    </div>
    <app-step-player [timeline]="tl" emptyText="Gõ thử vào một ô — step-player sẽ phát lại quá trình kiểm tra." />
  `,
  styles: `
    :host { display: block; }
    .stage { display: grid; grid-template-columns: 280px 1fr; gap: 18px; padding: 20px 22px 14px; align-items: start; }
    .demo-form { display: grid; gap: 12px; padding: 14px; background: var(--surface-2); border: var(--border); border-radius: var(--radius); }
    .demo-form label { display: grid; gap: 4px; font-weight: 800; font-size: var(--fs-sm); padding: 4px; border-radius: 10px; }
    .demo-form label.is-hl { background: color-mix(in srgb, var(--c-signal) 40%, transparent); }
    .row { display: flex; gap: 8px; flex-wrap: wrap; }
    .tree-side { min-width: 0; }
    .node { display: grid; justify-items: center; align-content: start; gap: 3px; padding: 8px 6px; text-align: center; background: var(--surface); border: var(--border); border-radius: var(--radius-sm); box-shadow: var(--shadow-sm); transition: transform var(--dur) var(--ease-bounce), background-color var(--dur) ease; }
    .node.focus { transform: scale(1.06); box-shadow: 0 0 0 4px var(--c-signal); }
    .node.bad { background: color-mix(in srgb, var(--c-error) 18%, var(--surface)); }
    .node.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .node strong { font-family: var(--font-mono); font-size: 13px; }
    .val { max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; background: none; border: none; color: var(--text-muted); }
    .flags { display: flex; flex-wrap: wrap; justify-content: center; gap: 3px; }
    .flags span { font-size: 10.5px; font-weight: 800; padding: 0 5px; border: 1.5px solid var(--line); border-radius: var(--radius-pill); opacity: 0.4; }
    .flags span.on { opacity: 1; background: var(--c-data); color: var(--on-accent); }
    .errs { display: inline-flex; gap: 3px; align-items: center; font-size: 10.5px; font-weight: 800; color: var(--c-error-strong); }
    .face { position: relative; width: 34px; height: 34px; border: var(--border-thin); border-radius: 50%; background: var(--surface-2); }
    .face i { position: absolute; top: 10px; width: 5px; height: 5px; border-radius: 50%; background: var(--pal-ink); }
    .face i:first-child { left: 9px; } .face i:nth-child(2) { right: 9px; }
    .face b { position: absolute; left: 9px; right: 9px; top: 19px; height: 6px; border: 2.5px solid var(--pal-ink); border-top: none; border-radius: 0 0 10px 10px; }
    .face.happy { background: var(--c-data); }
    .face.sad { background: var(--c-error); }
    .face.sad b { top: 21px; border: 2.5px solid var(--pal-ink); border-bottom: none; border-radius: 10px 10px 0 0; }
    .face.neutral b { height: 0; border-radius: 0; border-top: none; }
    @media (prefers-reduced-motion: no-preference) { .face.sad { animation: deco-wiggle 420ms var(--ease-bounce); } }
    @media (max-width: 820px) { .stage { grid-template-columns: 1fr; } }
  `,
})
export class FormsVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly nodes = NODES;
  protected readonly form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    age: [null as number | null, Validators.min(13)],
  });
  private last: Record<Key, Snap> = this.snapAll();
  private sawDirty = false;
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly tl = createTimeline<Frame>({ nodes: this.last, focus: null, stage: 'idle' }, {
    onEnter: (s) => this.ctx.stepAnchor.set(s.anchor ?? null),
  });

  constructor() {
    const sub = this.form.events.subscribe(() => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.onChange(), 350);
    });
    inject(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      clearTimeout(this.timer);
    });
  }

  protected snapOf(f: Frame, id: string): Snap {
    return f.nodes[id as Key];
  }

  protected mood(s: Snap, id: string): 'happy' | 'sad' | 'neutral' {
    if (s.valid) return 'happy';
    return s.touched || (id === 'form' && s.dirty) ? 'sad' : 'neutral';
  }

  protected reset(): void {
    this.form.reset();
  }
  protected fill(): void {
    this.form.setValue({ email: 'bip@angular.vn', password: 'signal123', age: 20 });
    this.form.markAllAsTouched();
  }

  private snap(c: AbstractControl, key: Key): Snap {
    const v = key === 'form' ? JSON.stringify(c.value).replace(/"/g, "'") : c.value === null || c.value === '' ? '(trống)' : key === 'password' ? '•'.repeat(String(c.value).length) : String(c.value);
    return { value: v, valid: c.valid, dirty: c.dirty, touched: c.touched, errors: Object.keys(c.errors ?? {}).map((e) => ERR_VI[e] ?? e) };
  }
  private snapAll(): Record<Key, Snap> {
    const c = this.form.controls;
    return { form: this.snap(this.form, 'form'), email: this.snap(c.email, 'email'), password: this.snap(c.password, 'password'), age: this.snap(c.age, 'age') };
  }

  /** Sinh các bước: con nhận giá trị → chạy validator → trạng thái con → cha gộp lại → UI */
  private onChange(): void {
    const prev = this.last;
    const now = this.snapAll();
    this.last = now;
    const changed = (['email', 'password', 'age'] as Key[]).find((k) => JSON.stringify(prev[k]) !== JSON.stringify(now[k]));
    // Thử thách
    if (now.email.touched && !now.email.valid) this.ctx.completeChallenge('fm-touched');
    if (now.form.valid) this.ctx.completeChallenge('fm-valid');
    if (now.form.dirty) this.sawDirty = true;
    else if (this.sawDirty && !now.form.touched) this.ctx.completeChallenge('fm-reset');

    if (!changed) {
      this.tl.load([{ frame: { nodes: now, focus: 'form', stage: 'ui' }, caption: now.form.dirty ? 'Trạng thái form cập nhật.' : 'reset(): mọi ô về pristine & untouched.', anchor: 'form', duration: 900 }], false);
      return;
    }
    const k = changed;
    const mix = (part: Partial<Snap>): Record<Key, Snap> => ({ ...prev, [k]: { ...prev[k], ...part } });
    const valueOnly = mix({ value: now[k].value, dirty: now[k].dirty, touched: now[k].touched });
    const withErr = mix({ value: now[k].value, dirty: now[k].dirty, touched: now[k].touched, errors: now[k].errors });
    const selfDone = { ...prev, [k]: now[k] };
    const steps: Step<Frame>[] = [
      { frame: { nodes: valueOnly, focus: k, stage: 'value' }, caption: `Ô ${k} nhận giá trị mới: ${now[k].value}${now[k].dirty ? ' → dirty = true' : ''}${now[k].touched ? ', touched = true' : ''}.`, anchor: k, duration: 1000 },
      { frame: { nodes: withErr, focus: k, stage: 'validate' }, caption: now[k].errors.length ? `Chạy validator: lỗi ${now[k].errors.join(', ')}.` : 'Chạy validator: không có lỗi nào!', anchor: k, duration: 1100, sound: now[k].errors.length ? 'boop' : 'pop' },
      { frame: { nodes: selfDone, focus: k, stage: 'self' }, caption: `${k}: ${now[k].valid ? 'valid → mặt cười 😊' : 'invalid → ' + (now[k].touched ? 'nhăn mặt (đã touched)' : 'mặt lặng (chưa touched nên chưa báo lỗi)')}.`, anchor: k, duration: 1000 },
      { frame: { nodes: now, focus: 'form', stage: 'parent' }, caption: `FormGroup gộp trạng thái các con → ${now.form.valid ? 'valid: cả nhà cùng vui!' : 'invalid: còn con chưa ổn.'}`, anchor: 'form', duration: 1200, sound: now.form.valid ? 'ting' : undefined },
    ];
    this.tl.load(steps);
  }
}
