import {
  type CreateSignalOptions,
  DestroyRef,
  type EnvironmentInjector,
  computed,
  createEnvironmentInjector,
  effect,
  isSignal,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

/**
 * Runtime của RxJS + Signal Lab.
 *
 * - Signal, computed, effect, linkedSignal, toSignal, toObservable, rxResource… là API THẬT của Angular.
 *   Mỗi lần chạy có một EnvironmentInjector riêng: destroy injector = "component bị destroy"
 *   (effect, toSignal, takeUntilDestroyed được dọn đúng như trong app thật).
 * - RxJS chạy trong một iframe ẩn (bản UMD trong /labs). Mọi timer của RxJS và của code người học
 *   đều thuộc cửa sổ iframe, nên "Dừng" = gỡ iframe là huỷ sạch, không ảnh hưởng tới app.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export type EvType = 'next' | 'error' | 'complete';
export interface LabEvent { label: string; type: EvType; value?: unknown; t: number }
export interface LabHttp { method: string; path: string; arg: unknown; t: number; tEnd: number | null; status: 'pending' | 'done' | 'cancelled' | 'error' }
export type LineKind = 'evt' | 'log' | 'sys' | 'err' | 'net' | 'net-ok' | 'net-cancel' | 'net-fail' | 'sim';
export interface LabLine { id: number; t: number; kind: LineKind; text: string; label?: string; ev?: EvType; color?: number }
export interface InspectEntry { name: string; kind: string; read: () => unknown }

/** Số màu phân biệt các lane (xem LANE_COLORS trong component). */
export const LANE_COLOR_COUNT = 5;

/* ------------------------------------------------------------------ */
/* Định dạng giá trị                                                    */
/* ------------------------------------------------------------------ */
const isObs = (v: Any) => !!v && typeof v.subscribe === 'function' && typeof v.pipe === 'function';
const isErr = (v: Any) => v instanceof Error || (!!v && typeof v === 'object' && typeof v.message === 'string' && typeof v.stack === 'string');

export function fmt(v: unknown, depth = 0, top = false): string {
  try {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    const t = typeof v;
    if (t === 'string') return top ? (v as string) : JSON.stringify(v);
    if (t === 'number' || t === 'boolean' || t === 'bigint') return String(v);
    if (t === 'symbol') return String(v);
    if (t === 'function') {
      if (isSignal(v)) {
        let inner: string;
        try { inner = fmt(untracked(v as () => unknown), depth + 1); } catch (e) { inner = '⚠ ' + (e as Error).message; }
        return 'Signal(' + inner + ')';
      }
      return 'ƒ ' + ((v as { name?: string }).name || 'anonymous') + '()';
    }
    const o = v as Any;
    if (isErr(o)) return (o.name || 'Error') + ': ' + o.message;
    if (isObs(o)) return typeof o.next === 'function' ? 'Subject' : 'Observable';
    if (typeof Event !== 'undefined' && o instanceof Event) return o.type + ' event';
    if (typeof Node !== 'undefined' && o instanceof Node) return '<' + o.nodeName.toLowerCase() + '>';
    if (depth > 3) return Array.isArray(o) ? '[…]' : '{…}';
    if (Array.isArray(o)) {
      const items = o.slice(0, 20).map((x) => fmt(x, depth + 1));
      if (o.length > 20) items.push('… +' + (o.length - 20));
      return '[' + items.join(', ') + ']';
    }
    if (o instanceof Map) return 'Map(' + o.size + ') {' + [...o].slice(0, 10).map(([k, x]) => fmt(k, depth + 1) + ' => ' + fmt(x, depth + 1)).join(', ') + '}';
    if (o instanceof Set) return 'Set(' + o.size + ') {' + [...o].slice(0, 10).map((x) => fmt(x, depth + 1)).join(', ') + '}';
    if (o instanceof Date) return o.toISOString();
    const keys = Object.keys(o);
    if (!keys.length) return '{}';
    const parts = keys.slice(0, 12).map((k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ': ' + fmt(o[k], depth + 1));
    if (keys.length > 12) parts.push('…');
    return '{ ' + parts.join(', ') + ' }';
  } catch {
    return String(v);
  }
}

/* ------------------------------------------------------------------ */
/* Biên dịch code người học                                             */
/* ------------------------------------------------------------------ */
/**
 * Globals là tham số của hàm ngoài, code nằm trong hàm async bên trong → khai báo trùng tên (const count…) vẫn hợp lệ.
 * `Fn` là constructor Function của realm sẽ chạy code: dùng Function của iframe để object/array do người học tạo
 * cùng realm với RxJS trong sandbox (RxJS so Object.prototype khi nhận dạng forkJoin({...}), combineLatest({...})).
 */
const wrap = (names: string[], body: string, Fn: FunctionConstructor = Function) =>
  new Fn(...names, 'return async function () { "use strict";\n' + body + '\n};') as (...a: unknown[]) => () => Promise<unknown>;

let lineOffset = 3;
try {
  wrap([], 'throw new Error("x")')()().catch((e: Error) => {
    const m = String(e.stack).match(/(?:<anonymous>|> (?:Async)?Function):(\d+):(\d+)/);
    if (m) lineOffset = Number(m[1]) - 1;
  });
} catch {
  /* môi trường không cho new Function */
}

export function errLine(e: unknown): number | null {
  const m = String((e as Error)?.stack ?? '').match(/(?:<anonymous>|> (?:Async)?Function):(\d+):(\d+)/);
  if (!m) return null;
  const n = Number(m[1]) - lineOffset;
  return n > 0 ? n : null;
}

export const TS_RE =
  /\b(interface|type)\s+[A-Z]\w*\s*[={<]|\)\s*:\s*[\w<>[\]|' ]+\s*(=>|\{)|[\w\])?]\s*:\s*(string|number|boolean|any|unknown|void|never|Observable|Signal|WritableSignal|[A-Z]\w*)(<[^>]*>)?(\[\])?\s*[=,;)]|\b[a-zA-Z]\w*<[\w[\]|,{}: ]+>\s*\(|\bas\s+(const|string|number|any|unknown|[A-Z]\w*)\b|\b(private|public|protected|readonly)\s+\w/;

/** Bỏ import/export (mọi API đã có sẵn) mà vẫn giữ nguyên số dòng. */
export function stripModules(code: string): string {
  return code
    .replace(/^[ \t]*import\s[\s\S]*?from\s*['"][^'"\n]+['"];?[ \t]*$/gm, (m) => m.replace(/[^\n]/g, ''))
    .replace(/^[ \t]*import\s*['"][^'"\n]+['"];?[ \t]*$/gm, '')
    .replace(/^([ \t]*)export\s+(default\s+)?/gm, '$1');
}

let sucrase: Promise<typeof import('sucrase')> | null = null;
async function stripTypes(code: string): Promise<string> {
  sucrase ??= import('sucrase');
  const { transform } = await sucrase;
  return transform(code, { transforms: ['typescript'], disableESTransforms: true }).code;
}

class LabSyntaxError extends Error {
  constructor(message: string, readonly line: number | null) {
    super(message);
    this.name = 'SyntaxError';
  }
}

async function compile(src: string, names: string[], vals: unknown[], Fn: FunctionConstructor): Promise<() => Promise<unknown>> {
  let code = stripModules(src);
  const make = () => wrap(names, code, Fn)(...vals);
  const viaTs = async () => {
    try {
      code = await stripTypes(code);
    } catch (e) {
      const loc = (e as { loc?: { line: number } }).loc;
      throw new LabSyntaxError(String((e as Error).message).split('\n')[0], loc?.line ?? null);
    }
    return make();
  };
  if (TS_RE.test(code)) return viaTs();
  try {
    return make();
  } catch (e) {
    if ((e as Error)?.name !== 'SyntaxError') throw e; // SyntaxError của realm iframe
    return viaTs(); // có thể là TS mà regex không nhận ra; sucrase báo lỗi kèm số dòng
  }
}

/* ------------------------------------------------------------------ */
/* RxJS cho sandbox                                                     */
/* ------------------------------------------------------------------ */
let rxSource: Promise<string> | null = null;
export function loadRxSource(): Promise<string> {
  rxSource ??= fetch(new URL('labs/rxjs.umd.min.js', document.baseURI).href)
    .then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .catch((e) => {
      rxSource = null;
      throw e;
    });
  return rxSource;
}

/* ------------------------------------------------------------------ */
/* Một lần chạy                                                         */
/* ------------------------------------------------------------------ */
export class LabRun {
  private static seq = 0;
  readonly id = ++LabRun.seq;
  active = true;
  destroyed = false;
  destroyedAt: number | null = null;
  t0 = performance.now();

  readonly events: LabEvent[] = [];
  readonly http: LabHttp[] = [];
  readonly logs: string[] = [];
  readonly errors: unknown[] = [];
  readonly lines: LabLine[] = [];
  readonly inspect: InspectEntry[] = [];
  readonly ui = { inputs: [] as HTMLInputElement[], buttons: [] as { el: HTMLButtonElement; label: string }[] };
  readonly counters = { flaky: 0, job: 0 };
  readonly timers = new Set<number>();
  readonly intervals = new Set<number>();
  errorLine: number | null = null;

  /** Tăng mỗi khi dữ liệu đổi → UI vẽ lại. Cập nhật trong microtask (không bao giờ trong computed). */
  readonly version = signal(0);

  frame: HTMLIFrameElement | null = null;
  win: Any = null;
  injector: EnvironmentInjector | null = null;

  private lineSeq = 0;
  private touchQueued = false;
  private readonly colors = new Map<string, number>();

  now(): number {
    return Math.round(performance.now() - this.t0);
  }

  touch(): void {
    if (this.touchQueued) return;
    this.touchQueued = true;
    queueMicrotask(() => {
      this.touchQueued = false;
      this.version.update((v) => v + 1);
    });
  }

  colorOf(label: string): number {
    if (!this.colors.has(label)) this.colors.set(label, this.colors.size % LANE_COLOR_COUNT);
    return this.colors.get(label)!;
  }

  line(kind: LineKind, text: string, extra: Partial<LabLine> = {}): void {
    if (!this.active) return;
    this.lines.push({ id: ++this.lineSeq, t: this.now(), kind, text, ...extra });
    if (this.lines.length > 2000) this.lines.splice(0, this.lines.length - 2000);
    this.touch();
  }

  record(label: string, type: EvType, value?: unknown): void {
    if (!this.active) return;
    label = String(label);
    this.events.push({ label, type, value, t: this.now() });
    const text = type === 'complete' ? '' : type === 'error' ? fmt(value, 0, true) : fmt(value);
    this.line('evt', text, { label, ev: type, color: this.colorOf(label) });
  }

  reportError(e: unknown, where?: string): void {
    if (!this.active) return;
    this.errors.push(e);
    const ln = errLine(e);
    if (ln) this.errorLine = ln;
    const err = e as Error;
    const msg = (err?.name ?? 'Error') + ': ' + (err?.message ?? String(e));
    this.line('err', 'Lỗi chưa được xử lý' + (where ? ' trong ' + where : '') + ' — ' + msg + (ln ? ' (dòng ' + ln + ')' : ''));
  }

  pending(): number {
    return this.timers.size + this.intervals.size + this.http.filter((h) => h.status === 'pending').length;
  }

  /** "Component bị destroy": huỷ injector của lần chạy (effect, toSignal, takeUntilDestroyed...). Timer vẫn sống. */
  destroyComponent(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.destroyedAt = this.now();
    try {
      this.injector?.destroy();
    } catch (e) {
      this.reportError(e);
    }
    this.touch();
  }

  /** Dừng hẳn: destroy + gỡ sandbox (mọi timer RxJS biến mất). */
  stop(manual = false): void {
    if (!this.active) return;
    this.destroyComponent();
    if (manual) this.line('sys', '■ Đã dừng — injector đã bị destroy, mọi timer trong sandbox đã bị huỷ.');
    this.active = false;
    this.frame?.remove();
    this.frame = null;
    this.touch();
  }
}

/* ------------------------------------------------------------------ */
/* Khởi chạy                                                            */
/* ------------------------------------------------------------------ */
const FRUITS = ['apple', 'apricot', 'avocado', 'banana', 'blackberry', 'blueberry', 'cherry', 'coconut', 'dragon fruit', 'durian', 'grape', 'guava', 'jackfruit', 'kiwi', 'lemon', 'lime', 'longan', 'lychee', 'mango', 'melon', 'orange', 'papaya', 'peach', 'pear', 'pineapple', 'plum', 'pomegranate', 'rambutan', 'strawberry', 'watermelon'];

export interface StartOptions {
  parent: EnvironmentInjector;
  preview: HTMLElement;
}

function createSandbox(run: LabRun, src: string): Any {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  frame.title = 'rxjs-lab-sandbox';
  frame.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;';
  document.body.appendChild(frame);
  const win = frame.contentWindow as Any;
  run.frame = frame;
  run.win = win;

  // Timer của sandbox: đếm được (thanh trạng thái), bọc try/catch để báo lỗi ra Console của lab
  const st = win.setTimeout.bind(win), ct = win.clearTimeout.bind(win);
  const si = win.setInterval.bind(win), ci = win.clearInterval.bind(win);
  win.setTimeout = (fn: Any, ms?: number, ...a: unknown[]) => {
    if (typeof fn !== 'function') return 0;
    const id: number = st(() => {
      run.timers.delete(id);
      if (!run.active) return;
      try { fn(...a); } catch (e) { run.reportError(e); }
    }, ms);
    run.timers.add(id);
    return id;
  };
  win.clearTimeout = (id: number) => { run.timers.delete(id); ct(id); };
  win.setInterval = (fn: Any, ms?: number, ...a: unknown[]) => {
    if (typeof fn !== 'function') return 0;
    const id: number = si(() => {
      if (!run.active) return;
      try { fn(...a); } catch (e) { run.reportError(e); }
    }, ms);
    run.intervals.add(id);
    return id;
  };
  win.clearInterval = (id: number) => { run.intervals.delete(id); ci(id); };
  win.addEventListener('error', (ev: ErrorEvent) => { run.reportError(ev.error ?? new Error(ev.message)); ev.preventDefault(); });
  win.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => { run.reportError(ev.reason); ev.preventDefault(); });

  const script = win.document.createElement('script');
  script.textContent = src;
  win.document.head.appendChild(script);
  if (!win.rxjs) throw new Error('Không khởi tạo được RxJS trong sandbox');
  return win.rxjs;
}

export async function startRun(code: string, opts: StartOptions): Promise<LabRun> {
  const run = new LabRun();
  let src: string;
  try {
    src = await loadRxSource();
  } catch (e) {
    run.line('err', 'Không tải được RxJS cho sandbox (' + (e as Error).message + '). Kiểm tra kết nối rồi chạy lại.');
    run.errors.push(e);
    run.active = false;
    return run;
  }

  const RX = createSandbox(run, src);
  const win = run.win;
  const injector = createEnvironmentInjector([], opts.parent, 'rxjs-lab-run');
  run.injector = injector;
  const destroyRef = injector.get(DestroyRef);
  const setT = (fn: () => void, ms: number) => win.setTimeout(fn, ms) as number;

  /* ---------- signals (Angular thật) + đăng ký vào tab Signals ---------- */
  const reg = (name: unknown, kind: string, read: () => unknown) => {
    if (typeof name === 'string' && name) {
      run.inspect.push({ name, kind, read });
      run.touch();
    }
  };
  const ng = {
    signal: <T>(v: T, o?: CreateSignalOptions<T>) => {
      const s = signal(v, o);
      reg(o?.debugName, 'signal', s);
      return s;
    },
    computed: <T>(fn: () => T, o?: Any) => {
      const c = computed(fn, o);
      reg(o?.debugName, 'computed', c);
      return c;
    },
    linkedSignal: (a: Any, o?: Any) => {
      const l = (linkedSignal as Any)(a, o);
      reg((o ?? a)?.debugName, 'linkedSignal', l);
      return l;
    },
    effect: (fn: (onCleanup: (cb: () => void) => void) => void, o?: Any) =>
      effect(
        (onCleanup) => {
          try { fn(onCleanup); } catch (e) { run.reportError(e, 'effect'); }
        },
        { ...o, injector },
      ),
    untracked,
    isSignal,
    toSignal: (src$: Any, o?: Any) => {
      if (isSignal(src$)) throw new Error('toSignal() cần một Observable, không phải Signal');
      const s = (toSignal as Any)(src$, { ...o, injector });
      reg(o?.debugName, 'toSignal', s);
      return s;
    },
    toObservable: (sig: Any, o?: Any) => {
      if (!isSignal(sig)) throw new Error('toObservable() cần một Signal');
      return toObservable(sig, { ...o, injector });
    },
    takeUntilDestroyed: (ref?: DestroyRef) => takeUntilDestroyed(ref ?? destroyRef),
    rxResource: (o: Any) => (rxResource as Any)({ ...o, injector }),
    destroyRef,
    injector,
  };

  /* ---------- helper ---------- */
  const spy = (label: unknown = 'spy') => ({
    next: (v: unknown) => run.record(String(label), 'next', v),
    error: (e: unknown) => run.record(String(label), 'error', e),
    complete: () => run.record(String(label), 'complete'),
  });
  const watch = (label: unknown, srcFn: Any) => {
    const fn = typeof srcFn === 'function' ? srcFn : () => srcFn;
    return effect(
      () => {
        let v: unknown;
        try { v = fn(); } catch (e) { run.reportError(e, "watch('" + String(label) + "')"); return; }
        untracked(() => run.record(String(label), 'next', v));
      },
      { injector },
    );
  };
  const log = (...args: unknown[]) => {
    if (!run.active) return;
    const text = args.map((a) => fmt(a, 0, true)).join(' ');
    run.logs.push(text);
    run.line('log', text);
  };
  const sleep = (ms: number) => new Promise<void>((r) => setT(r, ms));

  /* ---------- fake API ---------- */
  const request = (method: string, path: string, arg: unknown, produce: () => unknown, delay: number, fail: boolean | (() => boolean)) =>
    new RX.Observable((sub: Any) => {
      if (!run.active) { sub.complete(); return undefined; }
      const entry: LabHttp = { method, path, arg, t: run.now(), tEnd: null, status: 'pending' };
      run.http.push(entry);
      run.line('net', '→ ' + method + ' ' + path);
      const id = setT(() => {
        entry.tEnd = run.now();
        const failed = typeof fail === 'function' ? fail() : fail;
        if (failed) {
          entry.status = 'error';
          run.line('net-fail', '✖ 500 ' + method + ' ' + path);
          sub.error(new Error('HTTP 500 — ' + method + ' ' + path));
        } else {
          const data = produce();
          entry.status = 'done';
          run.line('net-ok', '← 200 ' + path + '   ' + fmt(data));
          sub.next(data);
          sub.complete();
        }
      }, delay);
      return () => {
        win.clearTimeout(id);
        if (entry.status === 'pending') {
          entry.status = 'cancelled';
          entry.tEnd = run.now();
          run.line('net-cancel', '⊘ huỷ ' + method + ' ' + path);
        }
      };
    });
  const d = (v: number | undefined, def: number) => (v == null ? def : v);
  const fakeApi = {
    search: (q: unknown, delay?: number) => {
      const s = String(q ?? '');
      return request('GET', '/search?q=' + s, s, () => FRUITS.filter((f) => f.includes(s.toLowerCase())), d(delay, 500), false);
    },
    user: (id: unknown, delay?: number) =>
      request('GET', '/users/' + id, id, () => ({ id, name: 'User ' + id, email: 'user' + id + '@demo.dev' }), d(delay, 400), Number(id) === 13),
    posts: (userId: number, delay?: number) =>
      request('GET', '/users/' + userId + '/posts', userId, () => [1, 2, 3].map((i) => ({ id: userId * 10 + i, title: 'Bài viết ' + i + ' của user ' + userId })), d(delay, 500), false),
    save: (data: unknown, delay?: number) => request('POST', '/save', data, () => ({ ok: true, data }), d(delay, 600), false),
    flaky: (delay?: number) => {
      let n = 0;
      return request('GET', '/flaky', null, () => 'OK (lần ' + n + ')', d(delay, 300), () => (n = ++run.counters.flaky) <= 2);
    },
    config: (delay?: number) => request('GET', '/config', null, () => ({ theme: 'dark', lang: 'vi' }), d(delay, 400), false),
    job: (id: unknown, delay?: number) =>
      request('GET', '/jobs/' + id, id, () => {
        const p = Math.min(100, ++run.counters.job * 25);
        return { id, progress: p, status: p >= 100 ? 'done' : 'running' };
      }, d(delay, 150), false),
    page: (n: number, delay?: number) =>
      request('GET', '/items?page=' + n, n, () => [1, 2, 3, 4, 5].map((k) => 'Item ' + ((n - 1) * 5 + k)), d(delay, 400), false),
    get: (path: string, o: { delay?: number; data?: unknown; fail?: boolean } = {}) =>
      request('GET', path, null, () => (o.data === undefined ? null : o.data), d(o.delay, 400), !!o.fail),
  };

  /* ---------- UI preview (DOM thật trong khung "trình duyệt") ---------- */
  const root = opts.preview;
  const mount = (el: HTMLElement) => {
    root.querySelector('.rxlab-empty')?.remove();
    root.appendChild(el);
  };
  const mk = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  };
  const render = (v: unknown) => (typeof v === 'string' ? v : fmt(v));
  const ui = {
    input: (placeholder = '', initial = '') => {
      const s = signal(String(initial));
      const row = mk('div', 'ui-row');
      const inp = mk('input', 'ui-input');
      inp.placeholder = String(placeholder);
      inp.value = s();
      inp.setAttribute('aria-label', String(placeholder) || 'Ô nhập');
      inp.addEventListener('input', () => { if (run.active) s.set(inp.value); });
      effect(() => { const v = s(); if (inp.value !== v) inp.value = v; }, { injector });
      row.appendChild(inp);
      mount(row);
      run.ui.inputs.push(inp);
      return s;
    },
    checkbox: (label = '', initial = false) => {
      const s = signal(!!initial);
      const lab = mk('label', 'ui-check');
      const cb = mk('input');
      cb.type = 'checkbox';
      cb.checked = s();
      cb.addEventListener('change', () => { if (run.active) s.set(cb.checked); });
      effect(() => { cb.checked = s(); }, { injector });
      lab.append(cb, document.createTextNode(String(label)));
      mount(lab);
      return s;
    },
    button: (label: unknown, handler?: (ev: Event) => void) => {
      let row = root.lastElementChild as HTMLElement | null;
      if (!row || !row.classList.contains('ui-btns')) { row = mk('div', 'ui-btns'); mount(row); }
      const b = mk('button', 'ui-btn', String(label));
      b.type = 'button';
      row.appendChild(b);
      if (typeof handler === 'function') {
        b.addEventListener('click', (ev) => {
          if (!run.active) return;
          try { handler(ev); } catch (e) { run.reportError(e); }
        });
      }
      run.ui.buttons.push({ el: b, label: String(label) });
      return RX.fromEvent(b, 'click');
    },
    text: (a: unknown, b?: unknown) => {
      const label = b === undefined ? null : a;
      const src = b === undefined ? a : b;
      const row = mk('div', 'ui-row');
      if (label != null) row.appendChild(mk('span', 'ui-label', String(label)));
      const val = mk('span', 'ui-value');
      row.appendChild(val);
      mount(row);
      effect(() => {
        let v: unknown;
        try { v = typeof src === 'function' ? (src as () => unknown)() : src; } catch (e) { v = '⚠ ' + (e as Error).message; }
        val.textContent = render(v);
      }, { injector });
    },
    list: (src: unknown, renderItem?: (x: unknown, i: number) => string) => {
      const ul = mk('ul', 'ui-list');
      mount(ul);
      effect(() => {
        let arr: unknown;
        try { arr = typeof src === 'function' ? (src as () => unknown)() : src; } catch (e) { arr = ['⚠ ' + (e as Error).message]; }
        const items = arr == null ? [] : Array.isArray(arr) ? arr : [arr];
        ul.replaceChildren();
        if (!items.length) { ul.appendChild(mk('li', 'muted', '(trống)')); return; }
        items.forEach((x, i) => ul.appendChild(mk('li', undefined, renderItem ? String(renderItem(x, i)) : render(x))));
      }, { injector });
    },
  };

  /* ---------- globals cho code người học ---------- */
  const g: Record<string, unknown> = {};
  for (const k of Object.keys(RX)) if (/^[A-Za-z_$][\w$]*$/.test(k)) g[k] = RX[k];
  Object.assign(g, ng, {
    rxjs: RX,
    spy, watch, log, sleep, ui, fakeApi,
    setTimeout: win.setTimeout, clearTimeout: win.clearTimeout,
    setInterval: win.setInterval, clearInterval: win.clearInterval,
    console: { log, info: log, debug: log, table: log, warn: (...a: unknown[]) => log('⚠', ...a), error: (...a: unknown[]) => log('✖', ...a) },
  });
  const names = Object.keys(g);
  const vals = names.map((n) => g[n]);

  let start: () => Promise<unknown>;
  try {
    start = await compile(code, names, vals, win.Function);
  } catch (e) {
    const line = e instanceof LabSyntaxError ? e.line : null;
    run.errors.push(e);
    if (line) run.errorLine = line;
    run.line('err', 'Lỗi cú pháp — ' + (e as Error).message + (line ? ' (dòng ' + line + ')' : ''));
    run.stop();
    return run;
  }
  run.t0 = performance.now();
  try {
    start().catch((e) => run.reportError(e));
  } catch (e) {
    run.reportError(e);
  }
  return run;
}

/* ------------------------------------------------------------------ */
/* Chấm bài + mô phỏng thao tác                                         */
/* ------------------------------------------------------------------ */
export interface CheckApi {
  events(label: string): LabEvent[];
  values(label: string): unknown[];
  last(label: string): Partial<LabEvent>;
  lanes(): string[];
  http(prefix?: string): LabHttp[];
  errors: unknown[];
  errMsg(): string;
  destroyedAt: number | null;
}

export function checkApi(run: LabRun): CheckApi {
  const evs = (l: string) => run.events.filter((e) => e.label === l);
  return {
    events: evs,
    values: (l) => evs(l).filter((e) => e.type === 'next').map((e) => e.value),
    last: (l) => evs(l).at(-1) ?? {},
    lanes: () => [...new Set(run.events.map((e) => e.label))],
    http: (prefix) => run.http.filter((h) => !prefix || h.path.startsWith(prefix)),
    errors: run.errors,
    errMsg: () => run.errors.map((e) => (e as Error)?.message ?? String(e))[0] ?? '',
    destroyedAt: run.destroyedAt,
  };
}

export interface SimCtx {
  at(ms: number, fn: () => void): void;
  type(index: number, text: string): void;
  click(label: string): void;
  destroy(): void;
}

export function simCtx(run: LabRun): SimCtx {
  const pulse = (el: HTMLElement) => {
    el.classList.add('pressed');
    setTimeout(() => el.classList.remove('pressed'), 180);
  };
  return {
    at: (ms, fn) => { run.win?.setTimeout(fn, ms); },
    type(i, text) {
      const inp = run.ui.inputs[i];
      if (!inp) { run.line('sim', '🤖 Không tìm thấy ô input #' + i); return; }
      run.line('sim', '🤖 gõ "' + text + '"');
      inp.value = text;
      inp.dispatchEvent(new Event('input'));
      pulse(inp);
    },
    click(label) {
      const b = run.ui.buttons.find((x) => x.label.includes(label));
      if (!b) { run.line('sim', '🤖 Không tìm thấy nút "' + label + '"'); return; }
      run.line('sim', '🤖 bấm "' + b.label + '"');
      b.el.click();
      pulse(b.el);
    },
    destroy() {
      run.line('sim', '💥 Component bị destroy');
      run.destroyComponent();
    },
  };
}
