import type { Step } from '../../../shared/ui/step-player/step-timeline';

/**
 * Mô phỏng thuật toán reactive "push dirty — pull value" của Angular signals
 * để sinh ra các bước cho visualizer. (Component live bên cạnh dùng signal THẬT.)
 */
export type SrcId = 'price' | 'qty' | 'vip';
export type CompId = 'subtotal' | 'freeShip' | 'shipLabel' | 'total';
export type NodeId = SrcId | CompId;
export type ConsumerId = 'screen' | 'bell';
export type NState = 'clean' | 'set' | 'stale' | 'changed' | 'same' | 'skipped' | 'sleep' | 'off';
type Val = number | boolean | string;

export interface SigFrame {
  values: Record<NodeId, Val>;
  counts: Record<CompId, number>;
  state: Record<NodeId | ConsumerId, NState>;
  hot: string[];
  screen: { ship: string; total: number };
  log: string[];
  screenOn: boolean;
  bellOn: boolean;
  /** tăng mỗi bước, dùng để kích hoạt lại animation nháy */
  tick: number;
  /** node là "nhân vật chính" của bước này (nháy vòng sáng) */
  focus: string | null;
}

export const DEPS: Record<CompId, NodeId[]> = {
  subtotal: ['price', 'qty'],
  freeShip: ['subtotal'],
  shipLabel: ['freeShip'],
  total: ['subtotal', 'vip', 'freeShip'],
};
export const READS: Record<ConsumerId, NodeId[]> = { screen: ['shipLabel', 'total'], bell: ['total'] };
const COMPS: CompId[] = ['subtotal', 'freeShip', 'shipLabel', 'total'];
const FORMULA: Record<CompId, string> = {
  subtotal: 'price × qty',
  freeShip: 'subtotal ≥ 200',
  shipLabel: "freeShip ? 'Miễn phí ship' : 'Ship 15k'",
  total: 'subtotal × (vip ? 0.9 : 1) + (freeShip ? 0 : 15)',
};

export const edgeId = (a: string, b: string) => `${a}>${b}`;

const fmt = (v: Val) => (typeof v === 'string' ? `'${v}'` : String(v));

export class SignalGraph {
  values: Record<NodeId, Val> = { price: 80, qty: 2, vip: false, subtotal: 0, freeShip: false, shipLabel: '', total: 0 };
  private version: Record<NodeId, number> = { price: 1, qty: 1, vip: 1, subtotal: 0, freeShip: 0, shipLabel: 0, total: 0 };
  private seen: Record<CompId, Partial<Record<NodeId, number>>> = { subtotal: {}, freeShip: {}, shipLabel: {}, total: {} };
  private stale = new Set<CompId>();
  counts: Record<CompId, number> = { subtotal: 0, freeShip: 0, shipLabel: 0, total: 0 };
  screenOn = true;
  bellOn = true;
  private screenSeen: Partial<Record<NodeId, number>> = {};
  private bellSeen = 0;
  screen = { ship: '', total: 0 };
  log: string[] = [];
  private state = {} as Record<NodeId | ConsumerId, NState>;
  private tick = 0;
  private steps: Step<SigFrame>[] = [];
  private tags = new Set<string>();

  constructor() {
    // Lần chạy đầu: tính mọi thứ, màn hình & effect đọc giá trị
    for (const c of COMPS) this.recompute(c);
    this.screenSeen = { shipLabel: this.version.shipLabel, total: this.version.total };
    this.screen = { ship: String(this.values.shipLabel), total: Number(this.values.total) };
    this.bellSeen = this.version.total;
    this.log = [`🔔 Tổng: ${this.values.total}k`];
    this.resetStates();
  }

  snapshot(hot: string[] = [], focus: string | null = null): SigFrame {
    return {
      values: { ...this.values },
      counts: { ...this.counts },
      state: { ...this.state },
      hot,
      screen: { ...this.screen },
      log: [...this.log],
      screenOn: this.screenOn,
      bellOn: this.bellOn,
      tick: ++this.tick,
      focus,
    };
  }

  // ---------------- API sinh bước ----------------

  set(src: SrcId, v: Val): Step<SigFrame>[] {
    this.begin();
    if (this.values[src] === v) {
      this.push(`${src}.set(${fmt(v)}): giá trị không đổi → signal im lặng, không báo ai cả.`, src);
      return this.end();
    }
    this.values[src] = v;
    this.version[src]++;
    this.state[src] = 'set';
    this.push(`${src}.set(${fmt(v)}) — công tắc bật, signal có giá trị mới.`, src, [], 'pop', 900);

    // PUSH: lan truyền dấu "có thể đã cũ" — chưa tính gì cả
    const hot: string[] = [];
    const visit = (n: NodeId) => {
      for (const c of COMPS) {
        if (DEPS[c].includes(n)) {
          hot.push(edgeId(n, c));
          if (!this.stale.has(c)) this.stale.add(c);
          this.state[c] = 'stale';
          visit(c);
        }
      }
      for (const k of ['screen', 'bell'] as ConsumerId[]) {
        if (READS[k].includes(n)) {
          hot.push(edgeId(n, k));
          if (this.isOn(k)) this.state[k] = 'stale';
        }
      }
    };
    visit(src);
    this.push('Dòng điện chạy đi báo: "giá trị của bạn CÓ THỂ đã cũ". Chỉ đánh dấu, CHƯA tính lại gì cả!', src, [...new Set(hot)], undefined, 1300);

    this.runConsumers(src);
    return this.end();
  }

  toggleConsumer(k: ConsumerId): Step<SigFrame>[] {
    this.begin();
    if (k === 'screen') this.screenOn = !this.screenOn;
    else this.bellOn = !this.bellOn;
    const on = this.isOn(k);
    this.state[k] = on ? 'stale' : 'off';
    const name = k === 'screen' ? 'Màn hình (template)' : 'Chuông effect';
    if (!on) {
      this.push(`${name} tắt: không còn ai đọc qua đường này nữa.`, k === 'bell' ? 'bell' : 'screen');
      this.markSleepers();
      return this.end();
    }
    this.push(`${name} bật lại → bắt đầu đọc giá trị.`, k === 'bell' ? 'bell' : 'screen', [], 'pop');
    this.runConsumer(k, undefined, true);
    return this.end();
  }

  // ---------------- nội bộ ----------------

  private runConsumers(src: SrcId): void {
    if (this.screenOn) this.runConsumer('screen', src);
    if (this.bellOn) this.runConsumer('bell', src);
    this.markSleepers();
    if (!this.screenOn && !this.bellOn) this.tags.add('lazy-round');
  }

  private runConsumer(k: ConsumerId, src?: SrcId, force = false): void {
    const reads = READS[k];
    this.push(
      k === 'screen'
        ? 'Màn hình (template) cần kiểm tra → đọc shipLabel() và total(). Giờ mới là lúc "kéo" giá trị.'
        : 'Effect được lên lịch → đọc total(). Computed nào cũ sẽ được tính lại khi bị đọc.',
      k === 'screen' ? 'screen' : 'bell',
      reads.map((r) => edgeId(r, k)),
      undefined,
      1000,
    );
    for (const r of reads) this.pull(r);

    if (k === 'screen') {
      const changed = force || reads.some((r) => this.screenSeen[r] !== this.version[r]);
      this.screenSeen = { shipLabel: this.version.shipLabel, total: this.version.total };
      if (changed) {
        this.screen = { ship: String(this.values.shipLabel), total: Number(this.values.total) };
        this.state.screen = 'changed';
        this.push(`Màn hình cập nhật DOM: "${this.screen.ship} · Tổng: ${this.screen.total}k".`, 'screen', [], 'pop');
      } else {
        this.state.screen = 'same';
        this.push('Giá trị màn hình đọc không đổi → không cần cập nhật DOM.', 'screen');
      }
    } else {
      const changed = force || this.bellSeen !== this.version.total;
      this.bellSeen = this.version.total;
      if (changed) {
        this.log = [`🔔 Tổng: ${this.values.total}k`, ...this.log].slice(0, 3);
        this.state.bell = 'changed';
        if (src === 'vip') this.tags.add('vip-bell');
        this.push(`🔔 Reng! Effect chạy: log "Tổng: ${this.values.total}k".`, 'bell', [], 'ting', 1100);
      } else {
        this.state.bell = 'same';
        this.push('total không đổi → effect KHÔNG chạy lại. Chuông im.', 'bell');
      }
    }
  }

  private pull(n: NodeId): void {
    if (!this.isComp(n) || !this.stale.has(n)) return;
    for (const d of DEPS[n]) this.pull(d);
    const changedDeps = DEPS[n].filter((d) => this.seen[n][d] !== this.version[d]);
    this.stale.delete(n);
    if (!changedDeps.length) {
      this.state[n] = 'skipped';
      if (n === 'shipLabel') this.tags.add('skip-shipLabel');
      this.push(`${n}: các đèn nó phụ thuộc đều không đổi → giữ giá trị cũ, KHÔNG tính lại (memo).`, n, [], undefined, 1100);
      return;
    }
    const old = this.values[n];
    this.recompute(n);
    const hot = changedDeps.map((d) => edgeId(d, n));
    if (this.values[n] === old) {
      this.state[n] = 'same';
      if (n === 'freeShip') this.tags.add('same-freeShip');
      this.push(`${n} tính lại (${FORMULA[n]}) → vẫn ra ${fmt(old)}. Giống cũ nên KHÔNG báo đổi cho ai (memo).`, n, hot, undefined, 1200);
    } else {
      this.state[n] = 'changed';
      this.push(`${n} tính lại: ${FORMULA[n]} = ${fmt(this.values[n])}.`, n, hot, undefined, 1000);
    }
  }

  private markSleepers(): void {
    const sleepers = COMPS.filter((c) => this.stale.has(c));
    if (!sleepers.length) return;
    for (const c of sleepers) this.state[c] = 'sleep';
    this.tags.add('sleep');
    this.push(
      `${sleepers.join(', ')} vẫn đang "ngủ" (lazy): chưa ai đọc nên chưa tính. Bộ đếm lần tính không tăng!`,
      sleepers[0],
      [],
      undefined,
      1300,
    );
  }

  private recompute(n: CompId): void {
    const v = this.values;
    let nv: Val;
    switch (n) {
      case 'subtotal':
        nv = Number(v.price) * Number(v.qty);
        break;
      case 'freeShip':
        nv = Number(v.subtotal) >= 200;
        break;
      case 'shipLabel':
        nv = v.freeShip ? 'Miễn phí ship' : 'Ship 15k';
        break;
      default:
        nv = Math.round(Number(v.subtotal) * (v.vip ? 0.9 : 1) + (v.freeShip ? 0 : 15));
    }
    this.counts[n]++;
    for (const d of DEPS[n]) this.seen[n][d] = this.version[d];
    if (nv !== v[n]) {
      v[n] = nv;
      this.version[n]++;
    }
  }

  private begin(): void {
    this.steps = [];
    this.tags.clear();
    this.resetStates();
  }

  private end(): Step<SigFrame>[] {
    const last = this.steps[this.steps.length - 1];
    if (this.tags.has('same-freeShip') && this.tags.has('skip-shipLabel')) this.tags.add('memo');
    last.tag = [...this.tags].join(',');
    return this.steps;
  }

  private resetStates(): void {
    const s = {} as Record<NodeId | ConsumerId, NState>;
    for (const n of ['price', 'qty', 'vip', ...COMPS] as NodeId[]) {
      s[n] = this.isComp(n) && this.stale.has(n) ? 'sleep' : 'clean';
    }
    s.screen = this.screenOn ? 'clean' : 'off';
    s.bell = this.bellOn ? 'clean' : 'off';
    this.state = s;
  }

  private push(caption: string, anchor: string, hot: string[] = [], sound?: 'pop' | 'ting', duration = 950): void {
    this.steps.push({ frame: this.snapshot(hot, anchor), caption, anchor, sound, duration });
  }

  private isComp(n: NodeId): n is CompId {
    return (COMPS as NodeId[]).includes(n);
  }

  private isOn(k: ConsumerId): boolean {
    return k === 'screen' ? this.screenOn : this.bellOn;
  }
}
