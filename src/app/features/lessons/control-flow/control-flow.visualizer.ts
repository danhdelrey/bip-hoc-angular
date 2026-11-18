import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type TrackMode = 'id' | 'object';
interface Item {
  id: number;
  name: string;
  obj: number; // "địa chỉ" object — đổi khi tải lại từ server
}
interface DomLi {
  dom: number; // số hiệu node DOM
  item: Item;
  status: 'kept' | 'moved' | 'new' | 'gone';
}
interface Frame {
  showTip: boolean;
  tipStatus: 'kept' | 'new' | 'gone';
  items: Item[];
  lis: DomLi[];
  created: number;
  phase: 'data' | 'diff' | 'dom';
}

const NAMES = ['Táo', 'Chuối', 'Cam', 'Dưa', 'Nho', 'Lê', 'Mận', 'Ổi'];

@Component({
  selector: 'app-control-flow-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="toolbar">
      <button type="button" class="switch" role="switch" [attr.aria-checked]="tip" (click)="toggleIf()" appAnchor="if">
        <span class="knob"></span> &#64;if (showTip())
      </button>
      <span class="sep"></span>
      <button type="button" class="btn btn-sm btn-data" (click)="add()" appAnchor="for"><app-icon name="plus" [size]="14" /> Thêm</button>
      <button type="button" class="btn btn-sm" (click)="remove()" appAnchor="for"><app-icon name="minus" [size]="14" /> Xoá đầu</button>
      <button type="button" class="btn btn-sm" (click)="shuffle()" appAnchor="for"><app-icon name="shuffle" [size]="14" /> Xáo trộn</button>
      <button type="button" class="btn btn-sm btn-di" (click)="reload()"><app-icon name="replay" [size]="14" /> Tải lại từ server</button>
      <span class="sep"></span>
      <span class="track-pick" role="radiogroup" aria-label="Biểu thức track" appAnchor="track">
        <button type="button" class="chip" [class.chip-signal]="mode === 'id'" [class.chip-plain]="mode !== 'id'" role="radio" [attr.aria-checked]="mode === 'id'" (click)="setMode('id')">track item.id</button>
        <button type="button" class="chip" [class.chip-signal]="mode === 'object'" [class.chip-plain]="mode !== 'object'" role="radio" [attr.aria-checked]="mode === 'object'" (click)="setMode('object')">track item</button>
      </span>
    </div>

    <div class="stage">
      <div class="pane ui">
        <p class="eyebrow">Màn hình</p>
        <div class="screen">
          @if (f.showTip) { <p class="tip">💡 Mẹo: track giúp giữ DOM cũ!</p> } @else { <p class="tip off">(mẹo đang ẩn)</p> }
          <ul class="fruits">
            @for (li of f.lis; track li.dom) {
              @if (li.status !== 'gone') { <li>{{ li.item.name }}</li> }
            } @empty {
              <li class="muted">Giỏ trống</li>
            }
          </ul>
        </div>
        <p class="eyebrow">Dữ liệu fruits()</p>
        <div class="data" [class.hl]="f.phase === 'data'">
          @for (it of f.items; track it.obj) {
            <span class="chip chip-data">{{ '{' }}id:{{ it.id }}, '{{ it.name }}'{{ '}' }}<small>obj@{{ it.obj }}</small></span>
          }
        </div>
      </div>

      <div class="pane dom">
        <p class="eyebrow">Cây DOM thật <span class="counter-chip">tạo mới: <b>{{ f.created }}</b></span></p>
        <div class="tree">
          <div class="node root">&lt;app-fruit-list&gt;</div>
          <div class="branch">
            <div class="node" appAnchor="if" [class]="'node st-' + f.tipStatus">&lt;p&gt; {{ f.showTip ? 'Mẹo…' : '(mẹo đang ẩn)' }}</div>
            <div class="node" appAnchor="for">&lt;ul&gt;</div>
            <div class="branch">
              @for (li of f.lis; track li.dom) {
                <div class="node li" [class]="'node li st-' + li.status" appAnchor="track">
                  <span class="dom-id">#{{ li.dom }}</span> &lt;li&gt; {{ li.item.name }}
                  <span class="badge">{{ label(li.status) }}</span>
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
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 18px 22px 4px; }
    .sep { width: 2px; height: 26px; background: var(--line); opacity: 0.25; }
    .track-pick { display: inline-flex; gap: 6px; }
    .track-pick .chip { cursor: pointer; font-family: var(--font-mono); }
    .switch { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 4px 14px 4px 6px; font-family: var(--font-mono); font-weight: 700; background: var(--surface); border: var(--border); border-radius: var(--radius-pill); box-shadow: var(--shadow-sm); cursor: pointer; }
    .knob { position: relative; width: 44px; height: 26px; background: var(--surface-sunken); border: var(--border-thin); border-radius: var(--radius-pill); }
    .knob::after { content: ''; position: absolute; top: 2px; left: 2px; width: 17px; height: 17px; background: var(--surface); border: 2px solid var(--line); border-radius: 50%; transition: transform var(--dur) var(--ease-bounce); }
    .switch[aria-checked='true'] .knob { background: var(--c-signal); }
    .switch[aria-checked='true'] .knob::after { transform: translateX(18px); }
    .stage { display: grid; grid-template-columns: 1fr 1.1fr; gap: 20px; padding: 14px 22px 18px; }
    .pane { min-width: 0; }
    .screen { padding: 12px 16px; background: var(--surface); border: var(--border); border-radius: var(--radius-sm); box-shadow: var(--shadow-sm); min-height: 170px; }
    .tip { margin: 0 0 8px; font-weight: 700; }
    .tip.off { color: var(--text-muted); font-weight: 600; }
    .fruits { margin: 0; padding-left: 20px; }
    .data { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; border: 2px dashed transparent; border-radius: 12px; }
    .data.hl { border-color: var(--c-signal-strong); }
    .data .chip { font-family: var(--font-mono); font-size: 11.5px; }
    .data small { margin-left: 4px; opacity: 0.7; }
    .counter-chip { margin-left: 8px; padding: 0 8px; border: 2px solid var(--line); border-radius: var(--radius-pill); text-transform: none; letter-spacing: 0; color: var(--text); background: var(--surface); }
    .tree { padding: 8px 4px; }
    .branch { margin-left: 22px; padding-left: 14px; border-left: 3px dotted color-mix(in srgb, var(--line) 50%, transparent); display: grid; gap: 6px; margin-top: 6px; }
    .node { display: flex; align-items: center; gap: 8px; padding: 5px 10px; font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; background: var(--surface); border: var(--border-thin); border-radius: 10px; width: fit-content; transition: transform var(--dur) var(--ease-bounce), opacity var(--dur) ease, background-color var(--dur) ease; }
    .node.root { background: var(--c-brand); color: var(--on-accent); }
    .dom-id { padding: 0 6px; background: var(--surface-2); border: 2px solid var(--line); border-radius: 8px; }
    .badge { font-family: var(--font-body); font-size: 11px; padding: 0 6px; border-radius: var(--radius-pill); border: 2px solid var(--line); background: var(--surface); }
    .st-new { background: color-mix(in srgb, var(--c-error) 35%, var(--surface)); animation: grow 600ms var(--ease-bounce), blink-err 500ms ease 2; }
    .st-moved { background: color-mix(in srgb, var(--c-di) 35%, var(--surface)); }
    .st-kept { background: color-mix(in srgb, var(--c-data) 25%, var(--surface)); }
    .st-gone { opacity: 0.35; transform: translateX(60px) rotate(8deg); text-decoration: line-through; }
    .node.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    @keyframes grow { from { transform: scale(0.3); opacity: 0; } }
    @media (max-width: 820px) { .stage { grid-template-columns: 1fr; } }
  `,
})
export class ControlFlowVisualizer {
  private readonly ctx = inject(LessonContext);
  protected mode: TrackMode = 'id';
  protected tip = true;
  private seqId = 4;
  private seqObj = 4;
  private seqDom = 4;
  private items: Item[] = [
    { id: 1, name: 'Táo', obj: 1 },
    { id: 2, name: 'Chuối', obj: 2 },
    { id: 3, name: 'Cam', obj: 3 },
  ];
  private lis: DomLi[] = this.items.map((it, i) => ({ dom: i + 1, item: it, status: 'kept' }));
  private created = 0;

  protected readonly tl = createTimeline<Frame>(
    { showTip: true, tipStatus: 'kept', items: this.items, lis: this.lis, created: 0, phase: 'dom' },
    {
      onEnter: (s) => {
        this.ctx.stepAnchor.set(s.anchor ?? null);
        const [tag, n] = (s.tag ?? '').split(':');
        if (tag === 'if-off') this.ctx.completeChallenge('cf-if');
        if (tag === 'shuffle' && this.mode === 'id' && n === '0') this.ctx.completeChallenge('cf-keep');
        if (tag === 'reload' && this.mode === 'object' && Number(n) >= this.items.length && this.items.length > 0) this.ctx.completeChallenge('cf-recreate');
      },
    },
  );

  protected label(s: DomLi['status']): string {
    return { kept: 'giữ nguyên', moved: 'dời chỗ', new: 'tạo mới', gone: 'bị gỡ' }[s];
  }

  protected setMode(m: TrackMode): void {
    this.mode = m;
    this.tl.load([{ frame: this.frame('dom'), caption: m === 'id' ? 'track item.id: key là id — ổn định qua mọi lần tải lại.' : 'track item: key là CHÍNH object. Object mới (dù giống hệt) = key mới!', anchor: 'track', duration: 900 }], false);
  }

  protected toggleIf(): void {
    this.tip = !this.tip;
    const on = this.tip;
    this.tl.load(
      [
        { frame: { ...this.frame('data'), showTip: !on, tipStatus: 'kept' }, caption: `showTip.set(${on}) — điều kiện của @if đổi.`, anchor: 'if', duration: 900 },
        { frame: { ...this.frame('dom'), showTip: on, tipStatus: on ? 'new' : 'gone' }, caption: on ? '@if đúng: Angular TẠO node <p> mẹo (nhánh @else bị gỡ).' : '@if sai: node <p> mẹo bị GỠ khỏi DOM, nhánh @else được tạo.', anchor: 'if', duration: 1200, tag: on ? 'if-on' : 'if-off', sound: 'pop' },
      ],
    );
  }

  protected add(): void {
    const name = NAMES[(this.seqId - 1) % NAMES.length];
    this.apply([...this.items, { id: this.seqId++, name, obj: this.seqObj++ }], 'add', `fruits.update(list => [...list, {id: ${this.seqId - 1}, '${name}'}])`);
  }
  protected remove(): void {
    if (!this.items.length) return;
    this.apply(this.items.slice(1), 'remove', 'fruits.update(list => list.slice(1)) — bỏ item đầu.');
  }
  protected shuffle(): void {
    const next = [...this.items];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    if (next.length > 1 && next.every((x, i) => x === this.items[i])) next.push(next.shift()!);
    this.apply(next, 'shuffle', 'Xáo trộn: cùng các object cũ, chỉ đổi thứ tự.');
  }
  protected reload(): void {
    this.apply(this.items.map((it) => ({ ...it, obj: this.seqObj++ })), 'reload', 'Tải lại từ server: dữ liệu giống hệt nhưng là các object MỚI (obj@ đổi).');
  }

  /** Mô phỏng thuật toán so khớp của @for theo key track */
  private apply(next: Item[], tag: string, caption: string): void {
    const key = (it: Item) => (this.mode === 'id' ? `id:${it.id}` : `obj:${it.obj}`);
    const old = new Map(this.lis.filter((l) => l.status !== 'gone').map((l, i) => [key(l.item), { l, i }]));
    let made = 0;
    const lis: DomLi[] = next.map((it, i) => {
      const hit = old.get(key(it));
      if (hit) {
        old.delete(key(it));
        return { dom: hit.l.dom, item: it, status: hit.i === i ? 'kept' : 'moved' };
      }
      made++;
      return { dom: this.seqDom++, item: it, status: 'new' };
    });
    const gone: DomLi[] = [...old.values()].map(({ l }) => ({ ...l, status: 'gone' }));
    this.items = next;
    const before = this.frame('data');
    this.lis = [...lis, ...gone];
    this.created += made;
    const after = this.frame('dom');
    this.lis = lis;
    const kept = lis.length - made;
    this.tl.load([
      { frame: { ...before, items: next }, caption, anchor: 'for', duration: 1000 },
      { frame: { ...after, phase: 'diff' }, caption: `@for so key (${this.mode === 'id' ? 'item.id' : 'item'}): ${kept} node dùng lại, ${made} node phải tạo mới, ${gone.length} node bị gỡ.`, anchor: 'track', duration: 1400, sound: made ? 'boop' : 'pop' },
      { frame: this.frame('dom'), caption: made === 0 ? 'Xong — không tạo mới node nào. DOM nhẹ nhàng!' : `Xong — đã tạo mới ${made} node (tốn công hơn).`, anchor: 'for', duration: 900, tag: `${tag}:${made}` },
    ]);
  }

  private frame(phase: Frame['phase']): Frame {
    return { showTip: this.tip, tipStatus: 'kept', items: [...this.items], lis: this.lis.map((l) => ({ ...l })), created: this.created, phase };
  }
}
