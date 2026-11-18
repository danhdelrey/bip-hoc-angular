import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { AnimatedArrow } from '../../../shared/ui/rough/rough';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { createTimeline } from '../../../shared/ui/step-player/step-timeline';
import { type CompId, type ConsumerId, type NodeId, type SigFrame, SignalGraph, edgeId } from './signal-graph';

interface NodeView {
  id: NodeId;
  kind: 'signal' | 'computed';
  x: number;
  y: number;
}

const NODES: NodeView[] = [
  { id: 'price', kind: 'signal', x: 90, y: 78 },
  { id: 'qty', kind: 'signal', x: 90, y: 222 },
  { id: 'vip', kind: 'signal', x: 90, y: 366 },
  { id: 'subtotal', kind: 'computed', x: 300, y: 150 },
  { id: 'freeShip', kind: 'computed', x: 510, y: 78 },
  { id: 'total', kind: 'computed', x: 510, y: 300 },
  { id: 'shipLabel', kind: 'computed', x: 720, y: 78 },
];
const SCREEN = { x: 800, y: 214 };
const BELL = { x: 760, y: 366 };
const POS: Record<string, { x: number; y: number }> = Object.fromEntries([
  ...NODES.map((n) => [n.id, { x: n.x, y: n.y }]),
  ['screen', SCREEN],
  ['bell', BELL],
]);

const EDGES: { from: string; to: string; bend: number }[] = [
  { from: 'price', to: 'subtotal', bend: -10 },
  { from: 'qty', to: 'subtotal', bend: 10 },
  { from: 'subtotal', to: 'freeShip', bend: -14 },
  { from: 'subtotal', to: 'total', bend: 14 },
  { from: 'vip', to: 'total', bend: 16 },
  { from: 'freeShip', to: 'total', bend: 30 },
  { from: 'freeShip', to: 'shipLabel', bend: 0 },
  { from: 'shipLabel', to: 'screen', bend: -16 },
  { from: 'total', to: 'screen', bend: 14 },
  { from: 'total', to: 'bell', bend: 10 },
];

/** Điểm bắt đầu/kết thúc dây ở mép node */
function endpoint(id: string, toward: { x: number; y: number }, out: boolean): [number, number] {
  const p = POS[id];
  const dx = toward.x - p.x;
  const dy = toward.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  const r = id === 'screen' ? 70 : id === 'bell' ? 34 : 44;
  const yOff = id === 'screen' || id === 'bell' ? 0 : -6;
  return [Math.round(p.x + (dx / len) * r), Math.round(p.y + yOff + (dy / len) * r * (out ? 1 : 0.9))];
}

/** Visualizer: bóng đèn signal/computed nối dây; effect là cái chuông; template là màn hình. */
@Component({
  selector: 'app-signals-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, AnimatedArrow],
  templateUrl: './signals.visualizer.html',
  styleUrl: './signals.visualizer.css',
})
export class SignalsVisualizer {
  private readonly ctx = inject(LessonContext);
  private graph = new SignalGraph();

  protected readonly nodes = NODES;
  protected readonly screenPos = SCREEN;
  protected readonly bellPos = BELL;
  protected readonly edges = EDGES.map((e) => ({
    id: edgeId(e.from, e.to),
    from: endpoint(e.from, POS[e.to], true),
    to: endpoint(e.to, POS[e.from], false),
    bend: e.bend,
    consumer: e.to === 'screen' ? 'screen' : e.to === 'bell' ? 'bell' : null,
  }));

  protected readonly tl = createTimeline<SigFrame>(this.graph.snapshot(), {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      const tags = s.tag ?? '';
      if (tags.includes('memo')) this.ctx.completeChallenge('sig-memo');
      if (tags.includes('lazy-round') && tags.includes('sleep')) this.ctx.completeChallenge('sig-lazy');
      if (tags.includes('vip-bell')) this.ctx.completeChallenge('sig-vip-bell');
    },
  });

  /** giá đang kéo (hiển thị ngay khi kéo, chỉ "set" khi thả tay) */
  protected readonly priceDraft = signal(80);

  protected val(f: SigFrame, id: NodeId): string {
    const v = f.values[id];
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (id === 'shipLabel') return v === 'Miễn phí ship' ? 'Free' : '15k';
    return String(v);
  }

  protected count(f: SigFrame, id: NodeId): number {
    return f.counts[id as CompId];
  }

  protected isLit(f: SigFrame, id: NodeId): boolean {
    const v = f.values[id];
    return v !== false;
  }

  // ---------- Thao tác ----------
  protected setPrice(v: number): void {
    this.tl.load(this.graph.set('price', v));
  }
  protected changeQty(d: number): void {
    const q = Math.max(1, Math.min(9, Number(this.graph.values.qty) + d));
    this.tl.load(this.graph.set('qty', q));
  }
  protected toggleVip(): void {
    this.tl.load(this.graph.set('vip', !this.graph.values.vip));
  }
  protected toggleConsumer(k: ConsumerId): void {
    this.tl.load(this.graph.toggleConsumer(k));
  }
  protected reset(): void {
    this.graph = new SignalGraph();
    this.priceDraft.set(80);
    this.tl.reset(this.graph.snapshot());
    this.ctx.stepAnchor.set(null);
  }
  protected get model() {
    return this.graph;
  }
}
