import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { type Lane, type Marble, MarbleDiagram } from '../../../shared/ui/marble-diagram/marble-diagram';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Op = 'map' | 'filter' | 'debounceTime' | 'switchMap';
const OPS: { id: Op; code: string; note: string }[] = [
  { id: 'map', code: 'map(x => x * 10)', note: 'Mỗi bi vào → một bi ra ngay, giá trị nhân 10.' },
  { id: 'filter', code: 'filter(x => x % 2 === 0)', note: 'Chỉ bi chẵn được đi tiếp.' },
  { id: 'debounceTime', code: 'debounceTime(1000)', note: 'Chờ 1 giây yên lặng rồi mới thả bi MỚI NHẤT.' },
  { id: 'switchMap', code: 'switchMap(x => request(x))', note: 'Mỗi bi gọi một request 1.5 giây; bi mới tới thì huỷ request cũ.' },
];
const DURATION = 10000;
const TICK = 250;

interface Ev {
  t: number;
  v: number;
}

@Component({
  selector: 'app-rxjs-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, MarbleDiagram],
  template: `
    <div class="ops" role="radiogroup" aria-label="Chọn operator">
      @for (o of ops; track o.id) {
        <button type="button" class="op" role="radio" [attr.aria-checked]="op() === o.id" [class.on]="op() === o.id" (click)="op.set(o.id)" [appAnchor]="o.id">
          <code>{{ o.code }}</code>
        </button>
      }
    </div>
    <p class="note"><app-icon name="hint" [size]="16" /> {{ current().note }}</p>
    <div class="belt-wrap" [appAnchor]="op()">
      <app-marble-diagram [lanes]="lanes()" [now]="now()" [duration]="duration" ariaLabel="Sơ đồ marble của operator đang chọn" />
    </div>
    <div class="controls">
      <button type="button" class="btn btn-event drop" (click)="drop()" [disabled]="now() >= duration" appAnchor="source">
        <app-icon name="data" [size]="18" /> Thả bi số {{ nextV() }}
      </button>
      <button type="button" class="btn btn-sm" (click)="restart()"><app-icon name="replay" [size]="16" /> Làm lại (xoá bi, về 0s)</button>
      <span class="muted small">Nguồn: {{ events().length }} bi · Kết quả: {{ outCount() }} bi</span>
    </div>
    <app-step-player [timeline]="tl" emptyText="Đồng hồ chưa chạy." />
  `,
  styles: `
    :host { display: block; }
    .ops { display: flex; flex-wrap: wrap; gap: 8px; padding: 18px 22px 0; }
    .op { padding: 6px 12px; background: var(--surface); border: var(--border); border-radius: 12px; box-shadow: var(--shadow-sm); cursor: pointer; transition: transform var(--dur-fast) var(--ease-bounce); }
    .op code { background: none; border: none; padding: 0; font-weight: 700; }
    .op:hover { transform: translateY(-2px); }
    .op.on, .op.is-hl { background: var(--c-signal); color: var(--on-accent); }
    .note { display: flex; gap: 6px; align-items: center; margin: 10px 22px 0; font-weight: 700; }
    .belt-wrap { margin: 6px 14px 0; overflow-x: auto; border-radius: var(--radius-sm); }
    .belt-wrap.is-hl { box-shadow: inset 0 0 0 3px var(--c-signal); }
    .controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 8px 22px 16px; }
    .drop { min-height: 50px; font-size: var(--fs-lg); }
    .small { font-size: var(--fs-sm); font-weight: 700; }
  `,
})
export class RxjsVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly ops = OPS;
  protected readonly duration = DURATION;
  protected readonly op = signal<Op>('map');
  protected readonly events = signal<Ev[]>([]);
  protected readonly current = computed(() => OPS.find((o) => o.id === this.op())!);

  protected readonly tl = createTimeline<number>(0, {
    onEnter: (s) => this.ctx.stepAnchor.set(s.anchor ?? null),
  });
  protected readonly now = computed(() => this.tl.frame());
  protected readonly nextV = computed(() => this.events().length + 1);

  /** Kết quả của operator: mô phỏng đúng ngữ nghĩa theo thời gian */
  private readonly sim = computed(() => {
    const ev = this.events();
    const out: Marble[] = [];
    const inner: Marble[] = [];
    switch (this.op()) {
      case 'map':
        ev.forEach((e) => out.push({ id: `o${e.v}`, t: e.t, label: String(e.v * 10) }));
        break;
      case 'filter':
        ev.forEach((e) => {
          if (e.v % 2 === 0) out.push({ id: `o${e.v}`, t: e.t, label: String(e.v) });
          else out.push({ id: `x${e.v}`, t: e.t, label: String(e.v), kind: 'cancel' });
        });
        break;
      case 'debounceTime':
        ev.forEach((e, i) => {
          const next = ev[i + 1];
          if (!next || next.t - e.t >= 1000) out.push({ id: `o${e.v}`, t: e.t + 1000, label: String(e.v) });
        });
        break;
      case 'switchMap':
        ev.forEach((e, i) => {
          const next = ev[i + 1];
          inner.push({ id: `r${e.v}`, t: e.t, label: `?${e.v}`, kind: 'muted' });
          if (!next || next.t - e.t >= 1500) out.push({ id: `o${e.v}`, t: e.t + 1500, label: `r${e.v}`, kind: 'signal' });
          else inner.push({ id: `c${e.v}`, t: next.t, label: '', kind: 'cancel' });
        });
        break;
    }
    return { out, inner };
  });

  protected readonly lanes = computed<Lane[]>(() => {
    const src: Lane = { id: 'src', label: 'nguồn$', marbles: this.events().map((e) => ({ id: `s${e.v}`, t: e.t, label: String(e.v), kind: 'event' })) };
    const s = this.sim();
    if (this.op() === 'filter') {
      return [src, { id: 'out', label: 'kết quả$', operator: this.current().code, marbles: s.out.filter((m) => m.kind !== 'cancel') }, { id: 'drop', label: 'bị chặn', marbles: s.out.filter((m) => m.kind === 'cancel') }];
    }
    if (this.op() === 'switchMap') {
      return [src, { id: 'inner', label: 'request', operator: this.current().code, marbles: s.inner }, { id: 'out', label: 'kết quả$', marbles: s.out }];
    }
    return [src, { id: 'out', label: 'kết quả$', operator: this.current().code, marbles: s.out }];
  });

  protected readonly outCount = computed(() => this.lanes().find((l) => l.id === 'out')!.marbles.filter((m) => m.t <= this.now()).length);

  constructor() {
    this.restart(false);
    // Phát hiện thử thách theo thời gian thực của đồng hồ
    effect(() => {
      const now = this.now();
      const ev = this.events();
      const op = this.op();
      const passed = ev.filter((e) => e.t <= now);
      if (op === 'filter' && passed.some((e) => e.v % 2 === 1)) this.ctx.completeChallenge('rx-filter');
      if (op === 'debounceTime' && passed.length >= 3) {
        const outs = this.sim().out.filter((m) => m.t <= now);
        if (outs.length >= 1 && outs.length < passed.length) this.ctx.completeChallenge('rx-debounce');
      }
      if (op === 'switchMap' && this.sim().inner.some((m) => m.kind === 'cancel' && m.t <= now)) this.ctx.completeChallenge('rx-switch');
    });
  }

  protected drop(): void {
    const t = this.now();
    if (t >= DURATION) return;
    this.events.update((e) => [...e, { t, v: e.length + 1 }]);
    if (!this.tl.playing()) this.tl.play();
  }

  protected restart(play = true): void {
    this.events.set([]);
    const steps: Step<number>[] = [];
    for (let t = 0; t <= DURATION; t += TICK) {
      steps.push({ frame: t, caption: `Đồng hồ: ${(t / 1000).toFixed(2)}s — ${t === 0 ? 'bấm "Thả bi" để phát giá trị vào stream nguồn.' : 'bi trôi trên băng chuyền theo thời gian.'}`, duration: TICK });
    }
    this.tl.load(steps, play);
  }
}
