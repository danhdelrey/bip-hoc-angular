import { describe, expect, it } from 'vitest';
import { SignalGraph } from './signal-graph';

describe('SignalGraph (mô phỏng push-dirty / pull-value)', () => {
  it('tính lại computed và rung chuông khi signal đổi', () => {
    const g = new SignalGraph();
    const steps = g.set('qty', 3);
    expect(g.values.subtotal).toBe(240);
    expect(g.values.total).toBe(240);
    expect(steps.at(-1)!.frame.log[0]).toContain('240');
  });

  it('memo: freeShip tính lại nhưng giữ nguyên thì shipLabel không tính lại', () => {
    const g = new SignalGraph();
    g.set('qty', 3); // 240 -> freeShip true
    const before = g.counts.shipLabel;
    const steps = g.set('qty', 4); // 320 -> freeShip vẫn true
    expect(g.counts.shipLabel).toBe(before);
    expect(steps.at(-1)!.tag).toContain('memo');
  });

  it('lazy: không ai đọc thì computed không tính lại', () => {
    const g = new SignalGraph();
    g.toggleConsumer('screen');
    g.toggleConsumer('bell');
    const before = { ...g.counts };
    const steps = g.set('price', 120);
    expect(g.counts).toEqual(before);
    expect(steps.at(-1)!.tag).toContain('lazy-round');
  });

  it('set cùng giá trị thì không lan truyền', () => {
    const g = new SignalGraph();
    expect(g.set('price', 80)).toHaveLength(1);
  });
});
