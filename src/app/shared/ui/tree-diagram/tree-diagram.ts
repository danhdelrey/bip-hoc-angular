import { ChangeDetectionStrategy, Component, TemplateRef, computed, contentChild, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RoughShape } from '../rough/rough';

export interface TreeNode {
  id: string;
  parent?: string | null;
}

export interface TreeLayoutOpts {
  nodeW: number;
  nodeH: number;
  gapX: number;
  gapY: number;
}

export interface PlacedNode<T extends TreeNode = TreeNode> {
  node: T;
  x: number; // tâm theo chiều ngang
  y: number; // mép trên
  depth: number;
}

/**
 * Bố cục cây gọn: lá xếp đều từ trái sang, cha nằm giữa các con.
 * Export riêng để visualizer tính được toạ độ (vd. đặt "thanh tra" lên đúng ngôi nhà).
 */
export function layoutTree<T extends TreeNode>(nodes: readonly T[], o: TreeLayoutOpts) {
  const kids = new Map<string, T[]>();
  const roots: T[] = [];
  for (const n of nodes) {
    if (n.parent) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n]);
    else roots.push(n);
  }
  const placed = new Map<string, PlacedNode<T>>();
  let cursor = 0;
  let maxDepth = 0;
  const walk = (n: T, depth: number): number => {
    maxDepth = Math.max(maxDepth, depth);
    const ch = kids.get(n.id) ?? [];
    let x: number;
    if (!ch.length) {
      x = cursor * (o.nodeW + o.gapX) + o.nodeW / 2;
      cursor++;
    } else {
      const xs = ch.map((c) => walk(c, depth + 1));
      x = (xs[0] + xs[xs.length - 1]) / 2;
    }
    placed.set(n.id, { node: n, x, y: depth * (o.nodeH + o.gapY), depth });
    return x;
  };
  roots.forEach((r) => walk(r, 0));
  const width = Math.max(cursor, 1) * (o.nodeW + o.gapX) - o.gapX;
  const height = (maxDepth + 1) * (o.nodeH + o.gapY) - o.gapY;
  const edges = nodes
    .filter((n) => n.parent && placed.has(n.parent))
    .map((n) => {
      const a = placed.get(n.parent!)!;
      const b = placed.get(n.id)!;
      return { id: `${n.parent}>${n.id}`, from: n.parent!, to: n.id, x1: a.x, y1: a.y + o.nodeH, x2: b.x, y2: b.y };
    });
  return { placed, list: nodes.map((n) => placed.get(n.id)!).filter(Boolean), edges, width, height };
}

/**
 * Cây tổng quát: dây nối vẽ tay (SVG), mỗi node là HTML tự do qua <ng-template let-node>.
 * Dùng cho khu phố component, cây DOM, cây FormGroup, khu phố của thanh tra change detection.
 */
@Component({
  selector: 'app-tree-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RoughShape],
  template: `
    @let l = layout();
    <div class="tree" [style.width.px]="l.width" [style.height.px]="l.height">
      <svg class="edges" [attr.viewBox]="'0 0 ' + l.width + ' ' + l.height" [attr.width]="l.width" [attr.height]="l.height" aria-hidden="true">
        @for (e of l.edges; track e.id) {
          <g appRough [spec]="{ kind: 'path', d: 'M' + e.x1 + ' ' + e.y1 + ' C' + e.x1 + ' ' + (e.y1 + 26) + ', ' + e.x2 + ' ' + (e.y2 - 26) + ', ' + e.x2 + ' ' + e.y2 }"
             [seed]="$index + 5" class="edge" [class.hot]="hotEdges().includes(e.id)" />
        }
      </svg>
      @for (p of l.list; track p.node.id) {
        <div class="node" [style.left.px]="p.x - opts().nodeW / 2" [style.top.px]="p.y"
             [style.width.px]="opts().nodeW" [style.height.px]="opts().nodeH">
          <ng-container [ngTemplateOutlet]="tpl() ?? null" [ngTemplateOutletContext]="{ $implicit: p.node, placed: p }" />
        </div>
      }
      <ng-content />
    </div>
  `,
  styles: `
    :host { display: block; overflow-x: auto; padding: 6px 4px 10px; }
    .tree { position: relative; margin: 0 auto; }
    .edges { position: absolute; inset: 0; overflow: visible; }
    .edge { --r-stroke: color-mix(in srgb, var(--line) 60%, transparent); --r-sw: 2.5; }
    .edge.hot { --r-stroke: var(--c-signal-strong); --r-sw: 4; }
    .node { position: absolute; display: flex; }
    :host ::ng-deep .node > * { flex: 1; min-width: 0; }
  `,
})
export class TreeDiagram<T extends TreeNode = TreeNode> {
  readonly nodes = input.required<readonly T[]>();
  readonly opts = input<TreeLayoutOpts>({ nodeW: 130, nodeH: 70, gapX: 18, gapY: 46 });
  readonly hotEdges = input<string[]>([]);
  protected readonly tpl = contentChild(TemplateRef);
  protected readonly layout = computed(() => layoutTree(this.nodes(), this.opts()));
}
