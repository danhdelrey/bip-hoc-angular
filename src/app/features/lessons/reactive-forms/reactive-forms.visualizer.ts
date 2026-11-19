import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Status = 'VALID' | 'INVALID' | 'PENDING';
interface Item {
  name: string;
  qty: number;
}
export interface FormState {
  username: string;
  usernameAsync: 'idle' | 'pending' | 'taken' | 'ok';
  password: string;
  confirm: string;
  items: Item[];
}
interface NodeView {
  status: Status;
  errors: string[];
}
type Tree = Record<string, NodeView>;
interface Frame {
  st: FormState;
  tree: Tree;
  hl: string[];
}

const TAKEN = ['admin', 'bip'];

/** Tính trạng thái mọi nút giống cách Angular làm: control trước, rồi gộp lên cha */
export function evaluate(st: FormState): Tree {
  const t: Tree = {};
  const node = (errors: string[], pending = false): NodeView => ({ status: errors.length ? 'INVALID' : pending ? 'PENDING' : 'VALID', errors });
  const uErr: string[] = [];
  if (!st.username) uErr.push('required');
  else if (st.username.length < 3) uErr.push('minlength');
  if (!uErr.length && st.usernameAsync === 'taken') uErr.push('taken');
  t['username'] = node(uErr, !uErr.length && st.usernameAsync === 'pending');
  const pErr: string[] = [];
  if (!st.password) pErr.push('required');
  else if (st.password.length < 6) pErr.push('minlength');
  t['password'] = node(pErr);
  t['confirm'] = node([]);
  const childBad = t['password'].status === 'INVALID';
  t['account'] = node(st.password !== st.confirm ? ['mismatch'] : []);
  if (childBad) t['account'] = { status: 'INVALID', errors: t['account'].errors };
  st.items.forEach((it, i) => {
    t[`item-${i}-name`] = node(it.name ? [] : ['required']);
    t[`item-${i}-qty`] = node(it.qty >= 1 ? [] : ['min']);
    const bad = !it.name || it.qty < 1;
    t[`item-${i}`] = { status: bad ? 'INVALID' : 'VALID', errors: [] };
  });
  t['items'] = { status: st.items.some((_, i) => t[`item-${i}`].status === 'INVALID') ? 'INVALID' : 'VALID', errors: [] };
  const kids = [t['username'], t['account'], t['items']];
  t['form'] = { status: kids.some((k) => k.status === 'INVALID') ? 'INVALID' : kids.some((k) => k.status === 'PENDING') ? 'PENDING' : 'VALID', errors: [] };
  return t;
}

const INITIAL: FormState = { username: '', usernameAsync: 'idle', password: '', confirm: '', items: [{ name: '', qty: 1 }] };

@Component({
  selector: 'app-reactive-forms-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="actions">
      <button type="button" class="btn btn-sm" (click)="setUsername('bip')" appAnchor="async">username = "bip"</button>
      <button type="button" class="btn btn-sm" (click)="setUsername('danh')" appAnchor="async">username = "danh"</button>
      <button type="button" class="btn btn-sm" (click)="setPasswords('123456', '12345')" appAnchor="crossfield">mật khẩu khác nhau</button>
      <button type="button" class="btn btn-sm" (click)="setPasswords('123456', '123456')" appAnchor="crossfield">mật khẩu khớp</button>
      <button type="button" class="btn btn-sm" (click)="addItem()" appAnchor="array">items.push()</button>
      <button type="button" class="btn btn-sm" (click)="removeLast()" appAnchor="array">items.removeAt(cuối)</button>
      <button type="button" class="btn btn-sm" (click)="fillItems()">điền tên mọi món</button>
      <button type="button" class="btn btn-sm" (click)="reset()">form.reset()</button>
    </div>

    <div class="tree" role="tree" aria-label="Cây form">
      <div class="node root" role="treeitem" [class.hl]="f.hl.includes('form')" [attr.data-s]="f.tree['form'].status" appAnchor="builder">
        <div class="head"><code>form</code> <small>FormGroup</small><span class="st">{{ f.tree['form'].status }}</span></div>
        <div class="kids">
          <div class="node" [class.hl]="f.hl.includes('username')" [attr.data-s]="f.tree['username'].status">
            <div class="head"><code>username</code> <small>FormControl</small><span class="st">{{ f.tree['username'].status }}</span></div>
            <div class="val">"{{ f.st.username }}"</div>
            @for (e of f.tree['username'].errors; track e) { <span class="err">{{ e }}</span> }
          </div>

          <div class="node" [class.hl]="f.hl.includes('account')" [attr.data-s]="f.tree['account'].status" appAnchor="group">
            <div class="head"><code>account</code> <small>FormGroup · validators: passwordsMatch</small><span class="st">{{ f.tree['account'].status }}</span></div>
            @for (e of f.tree['account'].errors; track e) { <span class="err group">{{ e }} (cấp nhóm)</span> }
            <div class="kids">
              @for (k of ['password', 'confirm']; track k) {
                <div class="node leaf" [class.hl]="f.hl.includes(k)" [attr.data-s]="f.tree[k].status">
                  <div class="head"><code>{{ k }}</code><span class="st">{{ f.tree[k].status }}</span></div>
                  <div class="val">"{{ k === 'password' ? f.st.password : f.st.confirm }}"</div>
                  @for (e of f.tree[k].errors; track e) { <span class="err">{{ e }}</span> }
                </div>
              }
            </div>
          </div>

          <div class="node" [class.hl]="f.hl.includes('items')" [attr.data-s]="f.tree['items'].status" appAnchor="array">
            <div class="head"><code>items</code> <small>FormArray · {{ f.st.items.length }} phần tử</small><span class="st">{{ f.tree['items'].status }}</span></div>
            <div class="kids row">
              @for (it of f.st.items; track $index; let i = $index) {
                <div class="node leaf" [class.hl]="f.hl.includes('item-' + i)" [attr.data-s]="f.tree['item-' + i].status">
                  <div class="head"><code>[{{ i }}]</code><span class="st">{{ f.tree['item-' + i].status }}</span></div>
                  <div class="val">name: "{{ it.name }}" · qty: {{ it.qty }}</div>
                  @for (e of f.tree['item-' + i + '-name'].errors; track e) { <span class="err">name {{ e }}</span> }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .actions { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 22px 8px; }
    .actions .btn { font-family: var(--font-mono); font-size: 12.5px; }
    .tree { padding: 6px 22px 14px; overflow-x: auto; }
    .node { --s: var(--c-data); padding: 8px 10px; border: 1px solid var(--line); border-left: 4px solid var(--s); border-radius: var(--radius-sm); background: var(--surface); transition: box-shadow var(--dur), border-color var(--dur); min-width: 0; }
    .node[data-s='INVALID'] { --s: var(--c-error); }
    .node[data-s='PENDING'] { --s: var(--c-signal); }
    .node.hl { box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-primary) 35%, transparent); }
    .node.is-hl { box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-signal) 60%, transparent); }
    .head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .head small { color: var(--text-muted); font-size: 11.5px; }
    .st { margin-left: auto; padding: 0 8px; border-radius: var(--radius-pill); font-size: 11px; font-weight: 600; letter-spacing: 0.04em; background: color-mix(in srgb, var(--s) 22%, var(--surface)); color: var(--text); }
    .kids { display: grid; gap: 8px; margin-top: 8px; padding-left: 12px; border-left: 1px dashed var(--line); }
    .kids.row { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
    .val { margin-top: 2px; font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); overflow-wrap: anywhere; }
    .err { display: inline-block; margin: 4px 4px 0 0; padding: 0 6px; border-radius: 4px; font-size: 11px; font-weight: 600; font-family: var(--font-mono); background: color-mix(in srgb, var(--c-error) 18%, var(--surface)); color: var(--c-error-strong); }
    .err.group { outline: 1px dashed var(--c-error); }
  `,
})
export class ReactiveFormsVisualizer {
  private readonly ctx = inject(LessonContext);
  private st: FormState = structuredClone(INITIAL);

  protected readonly tl = createTimeline<Frame>({ st: structuredClone(INITIAL), tree: evaluate(INITIAL), hl: [] }, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      for (const tag of (s.tag ?? '').split(' ').filter(Boolean)) this.ctx.completeChallenge(tag);
    },
  });

  private frame(hl: string[]): Frame {
    return { st: structuredClone(this.st), tree: evaluate(this.st), hl };
  }

  /** Chuỗi bước chung: đổi control → validator của nó → lan lên các cấp cha */
  private propagate(steps: Step<Frame>[], parents: string[], tag?: string): void {
    const tree = evaluate(this.st);
    steps.push({ frame: this.frame(parents), caption: `Lan lên ${parents.join(' → ')}: các cấp cha tính lại trạng thái (${parents.map((p) => `${p} ${tree[p].status}`).join(', ')}) và phát valueChanges.`, anchor: 'status', duration: 1300, tag });
  }

  protected setUsername(v: string): void {
    const steps: Step<Frame>[] = [];
    this.st.username = v;
    this.st.usernameAsync = 'pending';
    steps.push({ frame: this.frame(['username']), caption: `setValue("${v}"): validator đồng bộ required, minLength(3) đều qua → bắt đầu async validator, status PENDING.`, anchor: 'async', sound: 'pop', duration: 1400 });
    this.propagate(steps, ['form']);
    this.st.usernameAsync = TAKEN.includes(v) ? 'taken' : 'ok';
    const taken = this.st.usernameAsync === 'taken';
    steps.push({ frame: this.frame(['username']), caption: taken ? `600ms sau "API" trả lời: "${v}" đã có người dùng → lỗi { taken: true }, status INVALID.` : `600ms sau "API" trả lời: "${v}" chưa ai dùng → VALID.`, anchor: 'async', sound: taken ? 'boop' : 'ting', duration: 1400 });
    this.propagate(steps, ['form'], taken ? 'fa-async' : undefined);
    this.tl.load(steps);
  }

  protected setPasswords(p: string, c: string): void {
    const steps: Step<Frame>[] = [];
    this.st.password = p;
    steps.push({ frame: this.frame(['password']), caption: `password = "${p}": required và minLength(6) đều qua → VALID.`, anchor: 'group', sound: 'pop', duration: 1200 });
    this.st.confirm = c;
    steps.push({ frame: this.frame(['confirm']), caption: `confirm = "${c}": ô này không có validator riêng → VALID.`, anchor: 'group', duration: 1200 });
    const mismatch = p !== c;
    steps.push({ frame: this.frame(['account']), caption: mismatch ? 'Validator cấp nhóm passwordsMatch của account thấy hai giá trị khác nhau → lỗi { mismatch: true } nằm ở account, không ở ô nào.' : 'passwordsMatch: hai giá trị giống nhau → account VALID.', anchor: 'crossfield', sound: mismatch ? 'boop' : 'ting', duration: 1500, tag: mismatch ? 'fa-cross' : undefined });
    this.propagate(steps, ['form']);
    this.tl.load(steps);
  }

  protected addItem(): void {
    const steps: Step<Frame>[] = [];
    this.st.items.push({ name: '', qty: 1 });
    const i = this.st.items.length - 1;
    steps.push({ frame: this.frame([`item-${i}`]), caption: `items.push(newItem()): thêm FormGroup [${i}] với name rỗng → required lỗi.`, anchor: 'array', sound: 'pop', duration: 1300 });
    this.propagate(steps, ['items', 'form'], this.st.items.length === 3 ? 'fa-array' : undefined);
    this.tl.load(steps);
  }

  protected removeLast(): void {
    if (!this.st.items.length) return;
    const steps: Step<Frame>[] = [];
    const i = this.st.items.length - 1;
    steps.push({ frame: this.frame([`item-${i}`]), caption: `items.removeAt(${i}): gỡ phần tử cuối khỏi mảng.`, anchor: 'array', duration: 1100 });
    this.st.items.pop();
    this.propagate(steps, ['items', 'form'], this.st.items.length === 3 ? 'fa-array' : undefined);
    this.tl.load(steps);
  }

  protected fillItems(): void {
    const steps: Step<Frame>[] = [];
    const names = ['Áo mưa', 'Ô gấp', 'Ủng', 'Mũ', 'Găng tay'];
    this.st.items.forEach((it, i) => (it.name ||= names[i % names.length]));
    steps.push({ frame: this.frame(this.st.items.map((_, i) => `item-${i}`)), caption: 'Điền tên cho mọi món: required ở từng FormGroup con đều qua.', anchor: 'array', sound: 'pop', duration: 1200 });
    this.propagate(steps, ['items', 'form']);
    this.tl.load(steps);
  }

  protected reset(): void {
    this.st = structuredClone(INITIAL);
    this.tl.load([{ frame: this.frame(['form']), caption: 'form.reset(): nhờ NonNullableFormBuilder, mọi control về đúng giá trị khởi tạo (không thành null). (Trong demo này form được dựng lại với 1 món như lúc đầu.)', anchor: 'builder' }], false);
  }
}
