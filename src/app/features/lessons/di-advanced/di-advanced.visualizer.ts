import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Mode = 'multi' | 'lookup';
type Node = 'button' | 'checkout' | 'root' | 'null';
type Mod = 'none' | 'self' | 'skipSelf';
interface Plugin {
  id: string;
  label: string;
}
const PLUGINS: Plugin[] = [
  { id: 'card', label: 'Thẻ ngân hàng' },
  { id: 'wallet', label: 'Ví điện tử' },
  { id: 'cod', label: 'Trả khi nhận hàng' },
];
const NODES: { id: Node; label: string; kind: string; value?: string }[] = [
  { id: 'null', label: 'NullInjector', kind: 'hết đường' },
  { id: 'root', label: 'Root', kind: 'EnvironmentInjector', value: 'hồng' },
  { id: 'checkout', label: 'Checkout', kind: 'element injector', value: 'sáng' },
  { id: 'button', label: 'PayButton', kind: 'element injector · người gọi', value: 'tối' },
];

interface Frame {
  arr: Plugin[];
  incoming: string | null;
  replaced: boolean;
  at: Node | null;
  visited: Node[];
  result: { kind: 'found'; from: Node; value: string } | { kind: 'null' } | { kind: 'error' } | null;
}
const EMPTY: Frame = { arr: [], incoming: null, replaced: false, at: null, visited: [], result: null };

@Component({
  selector: 'app-di-advanced-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="modes" role="group" aria-label="Chế độ">
      <button type="button" class="chip" [class.chip-di]="mode() === 'multi'" [class.chip-plain]="mode() !== 'multi'" (click)="switch('multi')">Multi provider</button>
      <button type="button" class="chip" [class.chip-di]="mode() === 'lookup'" [class.chip-plain]="mode() !== 'lookup'" (click)="switch('lookup')">Đường tìm provider</button>
    </div>

    @if (mode() === 'multi') {
      <div class="multi">
        <div class="plugins">
          @for (p of plugins; track p.id) {
            <label class="plugin" [class.incoming]="f.incoming === p.id">
              <input type="checkbox" [checked]="regs().has(p.id)" (change)="togglePlugin(p.id)" />
              <span class="tok">PAYMENT_METHODS</span> ← {{ p.label }}
            </label>
          }
          <label class="switch" appAnchor="multi">
            <input type="checkbox" [checked]="multi()" (change)="multi.set(!multi())" /> <code>multi: true</code>
          </label>
          <button type="button" class="btn btn-sm btn-primary" (click)="runMulti()"><app-icon name="play" [size]="14" /> Khởi động app</button>
        </div>
        <div class="box" appAnchor="multi">
          <p class="eyebrow">inject(PAYMENT_METHODS) =</p>
          <div class="arr" [class.single]="!multi()">
            <span class="br">{{ multi() ? '[' : '' }}</span>
            @for (p of f.arr; track p.id) {
              <span class="item" [class.replaced]="f.replaced && $last">{{ p.label }}</span>
            } @empty {
              <span class="muted">— chưa có —</span>
            }
            <span class="br">{{ multi() ? ']' : '' }}</span>
          </div>
          <div class="checkout">
            <strong>Chọn cách thanh toán</strong>
            @for (p of f.arr; track p.id) {
              <span class="radio">◯ {{ p.label }}</span>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="lookup">
        <div class="tower">
          @for (n of nodes; track n.id) {
            <div class="node" [class.at]="f.at === n.id" [class.visited]="f.visited.includes(n.id)" [class.nul]="n.id === 'null'"
                 [class.found]="f.result?.kind === 'found' && $any(f.result).from === n.id">
              <div class="nhead"><strong>{{ n.label }}</strong> <small>{{ n.kind }}</small></div>
              @if (n.value) {
                <label class="prov" appAnchor="provide">
                  <input type="checkbox" [checked]="provided().has(n.id)" (change)="toggleProv(n.id)" />
                  provide THEME = '{{ n.value }}'
                </label>
              }
              @if (f.at === n.id) { <span class="ball" aria-hidden="true">THEME</span> }
            </div>
            @if (!$last) { <div class="up" aria-hidden="true">▲</div> }
          }
        </div>
        <div class="side">
          <p class="eyebrow">PayButton gọi</p>
          <code class="call" [appAnchor]="mod() === 'skipSelf' ? 'skipSelf' : optional() ? 'optional' : 'lookup'">inject(THEME{{ optsText() }})</code>
          <div class="mods">
            @for (m of mods; track m) {
              <label><input type="radio" name="mod" [checked]="mod() === m" (change)="mod.set(m)" /> {{ m === 'none' ? 'mặc định' : m }}</label>
            }
            <label appAnchor="optional"><input type="checkbox" [checked]="optional()" (change)="optional.set(!optional())" /> optional</label>
          </div>
          <button type="button" class="btn btn-sm btn-primary" (click)="runLookup()"><app-icon name="play" [size]="14" /> Gọi inject()</button>
          @if (f.result; as r) {
            <div class="result" [class.ok]="r.kind !== 'error'" [class.err]="r.kind === 'error'">
              @switch (r.kind) {
                @case ('found') { ✓ Nhận '{{ $any(r).value }}' từ {{ label($any(r).from) }} }
                @case ('null') { ✓ Nhận null (optional) — component vẫn chạy }
                @case ('error') { ✗ NullInjectorError: No provider for THEME! }
              }
            </div>
          }
        </div>
      </div>
    }
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .modes { display: flex; gap: 8px; padding: 16px 22px 0; }
    .modes .chip { cursor: pointer; }
    .multi, .lookup { display: grid; grid-template-columns: minmax(0, 320px) 1fr; gap: 20px; padding: 14px 22px; }
    .plugins { display: grid; gap: 8px; align-content: start; }
    .plugins .btn { justify-self: start; }
    .plugin, .switch { display: flex; gap: 8px; align-items: center; padding: 8px 10px; border: var(--border-thin); border-radius: var(--radius); background: var(--surface); font-weight: 700; font-size: var(--fs-sm); cursor: pointer; transition: transform var(--dur) var(--ease-bounce); }
    .plugin.incoming { transform: translateX(10px); background: color-mix(in srgb, var(--c-di) 30%, var(--surface)); }
    .switch { border-style: dashed; }
    .switch.is-hl, .box.is-hl { outline: 3px solid var(--c-signal-strong); }
    .tok { font-family: var(--font-mono); font-size: 11px; padding: 1px 6px; border-radius: 6px; background: var(--c-di); color: var(--on-accent); }
    .box { padding: 14px; border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); background: var(--surface); min-width: 0; }
    .arr { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-height: 40px; font-family: var(--font-mono); }
    .br { font-size: 24px; font-weight: 600; color: var(--c-di-strong); }
    .item { padding: 4px 10px; border: var(--border-thin); border-radius: 10px; background: var(--c-di); color: var(--on-accent); font-family: var(--font-body); font-weight: 700; animation: pop var(--dur) var(--ease-bounce); }
    .item.replaced { background: var(--c-event); color: var(--pal-ink); }
    .checkout { display: grid; gap: 4px; margin-top: 12px; padding: 10px; background: #fff; color: #111; border-radius: 10px; border: 1px solid #ccc; }
    .tower { display: grid; justify-items: center; gap: 2px; }
    .node { position: relative; width: min(100%, 320px); padding: 8px 12px; border: var(--border); border-radius: var(--radius); background: var(--surface); transition: transform var(--dur) var(--ease-bounce); }
    .node.nul { border-style: dashed; opacity: 0.85; }
    .node.visited { background: color-mix(in srgb, var(--c-di) 14%, var(--surface)); }
    .node.at { transform: scale(1.04); box-shadow: var(--shadow); }
    .node.found { background: var(--c-data); color: var(--on-accent); }
    .nhead small { margin-left: 6px; color: var(--text-muted); font-size: 11px; }
    .node.found .nhead small { color: inherit; }
    .prov { display: flex; gap: 6px; align-items: center; font-size: var(--fs-sm); font-family: var(--font-mono); margin-top: 4px; cursor: pointer; }
    .ball { position: absolute; right: -12px; top: -12px; padding: 3px 9px; border: var(--border-thin); border-radius: var(--radius-pill); background: var(--c-di); color: var(--on-accent); font-size: 11px; font-weight: 600; animation: pop var(--dur) var(--ease-bounce); }
    .up { color: var(--c-di-strong); font-size: 12px; }
    .side { display: grid; gap: 10px; align-content: start; justify-items: start; min-width: 0; }
    .side .call, .side .result { justify-self: stretch; }
    .call { display: block; padding: 8px 12px; border: var(--border-thin); border-radius: 10px; background: var(--code-bg, var(--surface)); font-family: var(--font-mono); }
    .call.is-hl { outline: 3px solid var(--c-signal-strong); }
    .mods { display: flex; flex-wrap: wrap; gap: 6px 14px; font-weight: 700; font-size: var(--fs-sm); }
    .mods label { display: flex; gap: 5px; align-items: center; cursor: pointer; }
    .result { padding: 10px 12px; border: var(--border); border-radius: var(--radius); font-weight: 600; animation: pop var(--dur) var(--ease-bounce); }
    .result.ok { background: var(--c-data); color: var(--on-accent); }
    .result.err { background: var(--c-error); color: var(--on-accent); }
    .muted { color: var(--text-muted); font-family: var(--font-body); }
    @keyframes pop { from { transform: scale(0.6); opacity: 0; } }
    @media (max-width: 760px) { .multi, .lookup { grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce) { .item, .ball, .result { animation: none; } }
  `,
})
export class DiAdvancedVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly plugins = PLUGINS;
  protected readonly nodes = NODES;
  protected readonly mods: Mod[] = ['none', 'self', 'skipSelf'];
  protected readonly mode = signal<Mode>('multi');
  protected readonly regs = signal(new Set(['card', 'wallet', 'cod']));
  protected readonly multi = signal(false);
  protected readonly provided = signal(new Set<Node>(['button', 'checkout']));
  protected readonly mod = signal<Mod>('none');
  protected readonly optional = signal(false);

  protected readonly tl = createTimeline<Frame>(EMPTY, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag) this.ctx.completeChallenge(s.tag);
    },
  });

  protected label(n: Node): string {
    return NODES.find((x) => x.id === n)!.label;
  }
  protected optsText(): string {
    const parts: string[] = [];
    if (this.mod() !== 'none') parts.push(`${this.mod()}: true`);
    if (this.optional()) parts.push('optional: true');
    return parts.length ? `, { ${parts.join(', ')} }` : '';
  }

  protected switch(m: Mode): void {
    this.mode.set(m);
    this.tl.load([{ frame: EMPTY, caption: m === 'multi' ? 'Bấm "Khởi động app" để xem các provider đăng ký.' : 'Bấm "Gọi inject()" để xem Angular tìm THEME.' }], false);
  }
  private flip<T>(s: Set<T>, v: T): Set<T> {
    const n = new Set(s);
    n.has(v) ? n.delete(v) : n.add(v);
    return n;
  }
  protected togglePlugin(id: string): void {
    this.regs.update((s) => this.flip(s, id));
  }
  protected toggleProv(n: Node): void {
    this.provided.update((s) => this.flip(s, n));
  }

  protected runMulti(): void {
    const list = PLUGINS.filter((p) => this.regs().has(p.id));
    const multi = this.multi();
    const steps: Step<Frame>[] = [{ frame: EMPTY, caption: `App khởi động, Angular đọc ${list.length} provider của PAYMENT_METHODS theo thứ tự.`, anchor: 'multi', duration: 900 }];
    let arr: Plugin[] = [];
    for (const p of list) {
      const replaced = !multi && arr.length > 0;
      arr = multi ? [...arr, p] : [p];
      steps.push({
        frame: { ...EMPTY, arr, incoming: p.id, replaced },
        caption: multi ? `multi: true → "${p.label}" được GÓP thêm vào mảng (${arr.length} phần tử).` : replaced ? `Không có multi → "${p.label}" GHI ĐÈ giá trị trước đó!` : `"${p.label}" trở thành giá trị của token.`,
        anchor: 'multi',
        sound: replaced ? 'boop' : 'pop',
        duration: 1200,
      });
    }
    const ok = multi && arr.length === 3;
    steps.push({
      frame: { ...EMPTY, arr },
      caption: ok ? 'Trang thanh toán nhận mảng đủ 3 phương thức!' : multi ? `Trang thanh toán có ${arr.length} phương thức.` : 'Chỉ còn một phương thức sống sót — các provider kia mất tích mà không báo lỗi.',
      tag: ok ? 'di-multi' : undefined,
      sound: ok ? 'ting' : 'boop',
      duration: 1000,
    });
    this.tl.load(steps);
  }

  protected runLookup(): void {
    const mod = this.mod();
    const optional = this.optional();
    const prov = this.provided();
    const chain: Node[] = ['button', 'checkout', 'root'];
    const steps: Step<Frame>[] = [];
    const visited: Node[] = [];
    let start = 0;
    const anchor = mod === 'skipSelf' ? 'skipSelf' : 'lookup';
    if (mod === 'skipSelf') {
      steps.push({ frame: { ...EMPTY, at: 'button', visited: [] }, caption: 'skipSelf: bỏ qua injector của chính PayButton, nhảy lên cha.', anchor: 'skipSelf', duration: 1100 });
      start = 1;
    }
    let result: Frame['result'] = null;
    for (let i = start; i < chain.length; i++) {
      const n = chain[i];
      visited.push(n);
      const has = prov.has(n);
      const value = NODES.find((x) => x.id === n)!.value!;
      if (has) {
        result = { kind: 'found', from: n, value };
        steps.push({ frame: { ...EMPTY, at: n, visited: [...visited] }, caption: `${this.label(n)} có provider THEME → dừng tìm, dùng '${value}'.`, anchor: 'provide', sound: 'pop', duration: 1200 });
        break;
      }
      steps.push({ frame: { ...EMPTY, at: n, visited: [...visited] }, caption: `${this.label(n)}: không có THEME${mod === 'self' ? '.' : ' → hỏi tầng trên.'}`, anchor, duration: 1100 });
      if (mod === 'self') {
        steps.push({ frame: { ...EMPTY, at: 'null', visited: [...visited, 'null'] }, caption: 'self: chỉ được tìm ở chính nó, không được hỏi tầng trên.', anchor, duration: 1100 });
        break;
      }
    }
    if (!result) {
      if (mod !== 'self') steps.push({ frame: { ...EMPTY, at: 'null', visited: [...visited, 'null'] }, caption: 'Đến NullInjector: không ai cung cấp THEME.', duration: 1100 });
      result = optional ? { kind: 'null' } : { kind: 'error' };
    }
    const end: Frame = { ...EMPTY, at: result.kind === 'found' ? result.from : 'null', visited: [...visited], result };
    let tag: string | undefined;
    if (result.kind === 'found' && mod === 'skipSelf' && prov.has('button') && result.from === 'checkout') tag = 'di-skipself';
    if (result.kind === 'null' && prov.size === 0) tag = 'di-optional';
    steps.push({
      frame: end,
      caption: result.kind === 'found' ? `PayButton nhận THEME = '${result.value}' từ ${this.label(result.from)}.` : result.kind === 'null' ? 'optional: true → nhận null thay vì lỗi.' : 'NullInjectorError! Thêm provider hoặc dùng optional nếu thật sự tuỳ chọn.',
      anchor: result.kind === 'null' ? 'optional' : undefined,
      sound: result.kind === 'error' ? 'boop' : 'ting',
      tag,
      duration: 1000,
    });
    this.tl.load(steps);
  }
}
