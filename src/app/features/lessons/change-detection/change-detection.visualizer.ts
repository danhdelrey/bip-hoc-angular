import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';
import { TreeDiagram, type TreeNode, layoutTree } from '../../../shared/ui/tree-diagram/tree-diagram';

type Mode = 'eager' | 'onpush' | 'zoneless';
type Act = 'event' | 'timer' | 'signal';
interface House extends TreeNode {
  label: string;
}
const HOUSES: House[] = [
  { id: 'app', label: 'App' },
  { id: 'header', parent: 'app', label: 'Header' },
  { id: 'list', parent: 'app', label: 'ProductList' },
  { id: 'cardA', parent: 'list', label: 'Card A' },
  { id: 'cardB', parent: 'list', label: 'Card B' },
  { id: 'badge', parent: 'app', label: 'CartBadge' },
  { id: 'footer', parent: 'app', label: 'Footer' },
];
const ORDER = ['app', 'header', 'list', 'cardA', 'cardB', 'badge', 'footer'];
const OPTS = { nodeW: 96, nodeH: 66, gapX: 14, gapY: 44 };
const LAYOUT = layoutTree(HOUSES, OPTS);

const MODES: { id: Mode; label: string }[] = [
  { id: 'eager', label: 'Eager + zone.js' },
  { id: 'onpush', label: 'OnPush + zone.js' },
  { id: 'zoneless', label: 'Zoneless + signals' },
];
const ACTS: { id: Act; label: string; icon: string }[] = [
  { id: 'event', label: 'Bấm ❤ trong Card B', icon: 'event' },
  { id: 'timer', label: 'setTimeout chạy (không đổi gì)', icon: 'cycle' },
  { id: 'signal', label: 'Signal cartCount đổi', icon: 'signal' },
];
const NAME: Record<string, string> = Object.fromEntries(HOUSES.map((h) => [h.id, h.label]));

interface Frame {
  at: string | null;
  checked: string[];
  skipped: string[];
  flags: string[];
  counts: Record<string, number>;
}

@Component({
  selector: 'app-cd-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, TreeDiagram],
  template: `
    @let f = tl.frame();
    <div class="pickers">
      <div class="seg" role="radiogroup" aria-label="Chế độ change detection">
        @for (m of modes; track m.id) {
          <button type="button" role="radio" [attr.aria-checked]="mode() === m.id" [class.on]="mode() === m.id" (click)="mode.set(m.id)" [appAnchor]="m.id">{{ m.label }}</button>
        }
      </div>
      <div class="acts">
        @for (a of acts; track a.id) {
          <button type="button" class="btn btn-sm" [class.btn-event]="a.id === 'event'" [class.btn-signal]="a.id === 'signal'" (click)="run(a.id)" [appAnchor]="a.id">
            <app-icon [name]="a.icon" [size]="14" /> {{ a.label }}
          </button>
        }
      </div>
    </div>

    <div class="town">
      <app-tree-diagram [nodes]="houses" [opts]="opts">
        <ng-template let-n>
          <div class="house" [class.checked]="f.checked.includes(n.id)" [class.skipped]="f.skipped.includes(n.id)" [class.here]="f.at === n.id">
            @if (f.flags.includes(n.id)) { <span class="flag" title="có thay đổi">🚩</span> }
            <span class="roof" aria-hidden="true"></span>
            <span class="body">{{ $any(n).label }}<small>✓ {{ f.counts[n.id] ?? 0 }}</small></span>
          </div>
        </ng-template>
        @if (inspector(); as p) {
          <div class="inspector" [style.left.px]="p.x" [style.top.px]="p.y" aria-hidden="true">
            <app-icon name="magnifier" [size]="30" />
          </div>
        }
      </app-tree-diagram>
    </div>

    <div class="score">
      <table>
        <caption class="eyebrow">Bảng điểm: số ngôi nhà được kiểm tra</caption>
        <thead><tr><th scope="col">Thao tác</th>@for (m of modes; track m.id) { <th scope="col">{{ m.label }}</th> }</tr></thead>
        <tbody>
          @for (a of acts; track a.id) {
            <tr><th scope="row">{{ a.label }}</th>
              @for (m of modes; track m.id) {
                @let r = board()[a.id + ':' + m.id];
                <td [class.best]="r && r.checks <= 1">{{ r ? r.checks + '/7' + (r.tick ? '' : ' · không tick') : '—' }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .pickers { display: grid; gap: 10px; padding: 18px 22px 0; }
    .seg { display: inline-flex; flex-wrap: wrap; border: var(--border); border-radius: var(--radius-pill); overflow: hidden; width: fit-content; box-shadow: var(--shadow-sm); }
    .seg button { padding: 8px 14px; font-weight: 600; background: var(--surface); border: none; border-right: var(--border-thin); cursor: pointer; }
    .seg button:last-child { border-right: none; }
    .seg button.on, .seg button.is-hl { background: var(--c-signal); color: var(--on-accent); }
    .acts { display: flex; flex-wrap: wrap; gap: 8px; }
    .town { padding: 16px 12px 4px; }
    .house { position: relative; display: flex; flex-direction: column; transition: opacity var(--dur) ease, transform var(--dur) var(--ease-bounce); }
    .roof { height: 20px; background: var(--pal-lavender); border: var(--border-thin); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .body { flex: 1; display: grid; place-items: center; align-content: center; font-size: 12px; font-weight: 600; background: var(--surface); border: var(--border-thin); border-top: none; border-radius: 0 0 8px 8px; }
    .body small { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
    .house.checked .body { background: var(--c-signal); color: var(--on-accent); }
    .house.checked .body small { color: var(--pal-ink); }
    .house.here { transform: scale(1.12); }
    .house.checked.here .body { animation: blink 500ms ease 2; }
    .house.skipped { opacity: 0.35; }
    .flag { position: absolute; top: -18px; right: -4px; font-size: 18px; }
    @keyframes blink { 50% { background: var(--surface); } }
    .inspector { position: absolute; z-index: 3; transform: translate(-50%, -100%); color: var(--text); filter: drop-shadow(2px 2px 0 var(--shadow-color)); transition: left var(--dur) var(--ease-in-out), top var(--dur) var(--ease-in-out); }
    .score { padding: 4px 22px 16px; overflow-x: auto; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; border: var(--border); border-radius: var(--radius-sm); overflow: hidden; font-size: var(--fs-sm); }
    caption { text-align: left; padding: 0 0 6px; }
    th, td { padding: 7px 10px; border-bottom: var(--border-thin); text-align: left; }
    tr:last-child th, tr:last-child td { border-bottom: none; }
    thead th { background: var(--surface-2); font-family: var(--font-display); }
    td { font-family: var(--font-mono); font-weight: 700; }
    td.best { background: color-mix(in srgb, var(--c-data) 30%, var(--surface)); }
  `,
})
export class CdVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly houses = HOUSES;
  protected readonly opts = OPTS;
  protected readonly modes = MODES;
  protected readonly acts = ACTS;
  protected readonly mode = signal<Mode>('eager');
  protected readonly board = signal<Record<string, { checks: number; tick: boolean }>>({});
  private counts: Record<string, number> = {};

  protected readonly tl = createTimeline<Frame>(
    { at: null, checked: [], skipped: [], flags: [], counts: {} },
    {
      onEnter: (s) => {
        this.ctx.stepAnchor.set(s.anchor ?? null);
        if (!s.tag) return;
        const [act, mode, checks, tick] = s.tag.split(':');
        this.board.update((b) => ({ ...b, [`${act}:${mode}`]: { checks: +checks, tick: tick === '1' } }));
        const b = this.board();
        if (MODES.every((m) => b[`${act}:${m.id}`])) this.ctx.completeChallenge('cd-compare');
        if (+checks === 0 && tick === '0') this.ctx.completeChallenge('cd-zero');
        if (+checks === 1) this.ctx.completeChallenge('cd-signal');
      },
    },
  );

  protected readonly inspector = computed(() => {
    const at = this.tl.frame().at;
    if (!at) return null;
    const p = LAYOUT.placed.get(at)!;
    return { x: p.x - 30, y: p.y + 10 };
  });

  /** Quy tắc: nhà nào được kiểm tra với từng chế độ & thao tác */
  private plan(act: Act, mode: Mode): { tick: boolean; flags: string[]; checks: Set<string>; why: string } {
    if (mode === 'eager') {
      return { tick: true, flags: act === 'timer' ? [] : act === 'event' ? ['cardB'] : ['badge'], checks: new Set(ORDER), why: 'zone.js thấy tác vụ async xong → ApplicationRef.tick() → Eager kiểm tra MỌI nhà.' };
    }
    if (act === 'event') {
      return { tick: true, flags: ['cardB', 'list', 'app'], checks: new Set(['app', 'list', 'cardB']), why: 'Sự kiện trong template đánh dấu Card B và mọi tổ tiên (markViewDirty) → chỉ kiểm tra nhánh đó.' };
    }
    if (act === 'signal') {
      return { tick: true, flags: ['badge'], checks: new Set(['badge']), why: 'Signal cartCount chỉ được CartBadge đọc → chỉ CartBadge bị đánh dấu cần làm mới; tổ tiên chỉ "đi ngang qua".' };
    }
    return mode === 'onpush'
      ? { tick: true, flags: [], checks: new Set(), why: 'zone.js vẫn gọi tick() sau setTimeout, nhưng không nhà OnPush nào treo cờ → thanh tra đi một vòng tay không.' }
      : { tick: false, flags: [], checks: new Set(), why: 'Zoneless: setTimeout không đổi signal nào → KHÔNG lên lịch change detection. Thanh tra ngồi yên!' };
  }

  protected run(act: Act): void {
    const mode = this.mode();
    const p = this.plan(act, mode);
    const actLabel = ACTS.find((a) => a.id === act)!.label;
    const base = { checked: [] as string[], skipped: [] as string[], counts: { ...this.counts } };
    const steps: Step<Frame>[] = [
      { frame: { ...base, at: null, flags: p.flags }, caption: `${actLabel}${p.flags.length ? ' — cờ "có thay đổi" được treo lên: ' + p.flags.map((x) => NAME[x]).join(', ') : ''}.`, anchor: act, duration: 1100, sound: 'pop' },
      { frame: { ...base, at: null, flags: p.flags }, caption: p.why, anchor: mode, duration: 1500 },
    ];
    if (p.tick) {
      const checked: string[] = [];
      const skipped: string[] = [];
      for (const id of ORDER) {
        const ok = p.checks.has(id);
        if (ok) {
          checked.push(id);
          this.counts[id] = (this.counts[id] ?? 0) + 1;
        } else skipped.push(id);
        steps.push({
          frame: { at: id, checked: [...checked], skipped: [...skipped], flags: p.flags, counts: { ...this.counts } },
          caption: ok ? `🔍 Kiểm tra ${NAME[id]}: so sánh binding, cập nhật DOM nếu cần.` : `Bỏ qua ${NAME[id]} (không có cờ thay đổi).`,
          duration: ok ? 650 : 380,
        });
      }
    }
    const n = p.checks.size;
    steps.push({
      frame: { at: null, checked: [...p.checks], skipped: ORDER.filter((x) => !p.checks.has(x)), flags: [], counts: { ...this.counts } },
      caption: `Xong: ${n}/7 ngôi nhà được kiểm tra${p.tick ? '' : ' — thậm chí không có lượt tick nào'}.`,
      duration: 1000,
      sound: n <= 1 ? 'ting' : undefined,
      tag: `${act}:${mode}:${n}:${p.tick ? 1 : 0}`,
    });
    this.tl.load(steps);
  }
}
