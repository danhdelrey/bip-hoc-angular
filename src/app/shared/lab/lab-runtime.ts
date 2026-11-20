import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  KeyValuePipe,
  LowerCasePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgPlural,
  NgPluralCase,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
  PercentPipe,
  SlicePipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  type ComponentRef,
  type CreateSignalOptions,
  DestroyRef,
  Directive,
  ContentChild,
  ContentChildren,
  ElementRef,
  type EnvironmentInjector,
  ErrorHandler,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  Output,
  Pipe,
  Renderer2,
  Service,
  TemplateRef,
  type Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  createComponent,
  createEnvironmentInjector,
  effect,
  forwardRef,
  inject,
  input,
  isSignal,
  linkedSignal,
  model,
  numberAttribute,
  output,
  resource,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { provideLocationMocks } from '@angular/common/testing';
import { HttpBackend, HttpErrorResponse, HttpEventType, HttpHeaders, type HttpRequest, HttpResponse } from '@angular/common/http';
import { createApplication } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

/**
 * Runtime của Code Lab (dùng chung cho mọi bài học).
 *
 * - Signal, computed, effect, linkedSignal, toSignal, toObservable, rxResource… là API THẬT của Angular.
 *   Mỗi lần chạy có một EnvironmentInjector riêng: destroy injector = "component bị destroy"
 *   (effect, toSignal, takeUntilDestroyed được dọn đúng như trong app thật).
 * - RxJS chạy trong một iframe ẩn (bản UMD trong /labs). Mọi timer của RxJS và của code người học
 *   đều thuộc cửa sổ iframe, nên "Dừng" = gỡ iframe là huỷ sạch, không ảnh hưởng tới app.
 * - Component/Directive/Pipe/Service của người học được biên dịch JIT (@angular/compiler, tải lười)
 *   và render THẬT vào khung preview bằng mount(). Decorator class được đổi thành lời gọi hàm
 *   (transformDecorators) vì trình duyệt chưa chạy cú pháp decorator.
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

/** Bản production chỉ có mã lỗi NGxxxx — kèm giải thích ngắn cho các lỗi hay gặp. */
const NG_HINTS: Record<string, string> = {
  NG0100: 'giá trị trong template đổi ngay trong lúc kiểm tra thay đổi (ExpressionChanged)',
  NG0200: 'vòng lặp phụ thuộc DI (circular dependency)',
  NG0201: 'không tìm thấy provider cho dependency cần inject',
  NG0204: 'không tạo được dependency: class chưa có @Service()/@Injectable() và chưa được khai báo trong providers',
  NG0302: 'không tìm thấy pipe: pipe chưa được khai báo trong imports của component',
  NG0203: 'inject()/toSignal()/effect() được gọi ngoài injection context (chỉ gọi ở field hoặc constructor)',
  NG0600: 'không được set signal bên trong computed() hoặc template',
  NG0602: 'không được tạo effect() bên trong computed() hoặc effect khác',
  NG0950: 'input bắt buộc (input.required) chưa được truyền giá trị; kiểm tra component cha đã bind [tên]="…" chưa',
  NG0951: 'viewChild.required/contentChild.required không tìm thấy phần tử',
  NG0953: 'output đã bị huỷ (component đã destroy)',
  NG2100: 'pipe nhận sai kiểu dữ liệu (InvalidPipeArgument); kiểm tra thứ tự các pipe',
};
/** Lỗi biên dịch template không có mã NG: nhận theo nội dung. */
const TEXT_HINTS: [RegExp, string][] = [
  [/must have a placeholder block/, 'trigger on viewport / on interaction / on hover không chỉ định phần tử cần một khối @placeholder (đúng một phần tử gốc) để theo dõi.'],
];

export function explainNg(msg: string): string {
  const code = /NG0\d{3}/.exec(msg)?.[0];
  if (code && NG_HINTS[code] && !msg.includes(NG_HINTS[code])) return msg + ' — ' + NG_HINTS[code];
  const t = TEXT_HINTS.find(([re]) => re.test(msg));
  return t && !msg.includes(t[1]) ? msg + ' — ' + t[1] : msg;
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
  let code = transformDecorators(stripModules(src));
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

/* ---------- decorator class → lời gọi hàm (giữ nguyên số dòng) ---------- */
const PAIRS: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
function skipString(s: string, i: number): number {
  const q = s[i];
  for (i++; i < s.length; i++) {
    if (s[i] === '\\') i++;
    else if (s[i] === q || s[i] === '\n') return i + 1;
  }
  return s.length;
}
function skipTemplate(s: string, i: number): number {
  for (i++; i < s.length; i++) {
    if (s[i] === '\\') i++;
    else if (s[i] === '`') return i + 1;
    else if (s[i] === '$' && s[i + 1] === '{') {
      const e = findClose(s, i + 1);
      if (e < 0) return s.length;
      i = e;
    }
  }
  return s.length;
}
/** Vị trí dấu đóng khớp với dấu mở tại `open` (bỏ qua chuỗi, template literal, comment); -1 nếu không có. */
export function findClose(s: string, open: number): number {
  const stack = [PAIRS[s[open]]];
  let i = open + 1;
  while (i < s.length) {
    const c = s[i];
    if (c === '/' && s[i + 1] === '/') { const n = s.indexOf('\n', i); if (n < 0) return -1; i = n; continue; }
    if (c === '/' && s[i + 1] === '*') { const n = s.indexOf('*/', i + 2); if (n < 0) return -1; i = n + 2; continue; }
    if (c === '"' || c === "'") { i = skipString(s, i); continue; }
    if (c === '`') { i = skipTemplate(s, i); continue; }
    if (PAIRS[c]) stack.push(PAIRS[c]);
    else if (c === ')' || c === ']' || c === '}') {
      if (stack.pop() !== c) return -1;
      if (!stack.length) return i;
    }
    i++;
  }
  return -1;
}
const DECORATORS = 'Component|Directive|Pipe|Injectable|Service';
const skipWs = (s: string, i: number) => {
  for (;;) {
    const m = /^(\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/.exec(s.slice(i));
    if (!m) return i;
    i += m[0].length;
  }
};
/** Tách danh sách đối số ở cấp ngoài cùng: "a, {b: 1}, [c]" → ["a", "{b: 1}", "[c]"] */
function splitArgs(src: string): string[] {
  const out: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'") { i = skipString(src, i) - 1; continue; }
    if (c === '`') { i = skipTemplate(src, i) - 1; continue; }
    if (PAIRS[c]) depth++;
    else if (c === ')' || c === ']' || c === '}') depth--;
    else if (c === ',' && depth === 0) { out.push(src.slice(start, i).trim()); start = i + 1; }
  }
  if (src.slice(start).trim()) out.push(src.slice(start).trim());
  return out;
}

const MEMBER_RE =
  /(?:(?:readonly|protected|private|public|override)\s+)*([A-Za-z_$][\w$]*)\s*[!?]?\s*(?::[^=;\n]+)?=\s*(input|model|output|outputFromObservable|viewChild|viewChildren|contentChild|contentChildren)(\.required)?\s*(?:<[^()]*?>)?\s*\(/y;
const QUERY: Record<string, string> = { viewChild: 'ViewChild', viewChildren: 'ViewChildren', contentChild: 'ContentChild', contentChildren: 'ContentChildren' };

/**
 * Angular CLI (chế độ JIT) có một bước transform biến input()/output()/model()/viewChild()… thành metadata
 * để JIT compiler biết đó là input/output/query. Lab không có bước đó nên tự sinh lời gọi tương đương:
 *   label = input.required()  →  __ng.Input({ isSignal: true, alias: 'label', required: true })(Foo.prototype, 'label')
 */
function signalMemberMeta(body: string, cls: string): string {
  const out: string[] = [];
  let i = 1, atStart = true;
  while (i < body.length - 1) {
    const c = body[i];
    if (c === '"' || c === "'") { i = skipString(body, i); atStart = false; continue; }
    if (c === '`') { i = skipTemplate(body, i); atStart = false; continue; }
    if (c === '/' && body[i + 1] === '/') { const n = body.indexOf('\n', i); i = n < 0 ? body.length : n; continue; }
    if (c === '/' && body[i + 1] === '*') { const n = body.indexOf('*/', i + 2); i = n < 0 ? body.length : n + 2; continue; }
    if (PAIRS[c]) { const e = findClose(body, i); i = e < 0 ? body.length : e + 1; atStart = c === '{'; continue; }
    if (c === ';' || c === '\n') { atStart = true; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (atStart) {
      MEMBER_RE.lastIndex = i;
      const m = MEMBER_RE.exec(body);
      if (m) {
        const [, field, fn, req] = m;
        const open = MEMBER_RE.lastIndex - 1;
        const close = findClose(body, open);
        const args = close < 0 ? [] : splitArgs(body.slice(open + 1, close));
        const target = cls + '.prototype, ' + JSON.stringify(field);
        const optsArg = fn === 'input' || fn === 'model' ? (req ? args[0] : args[1]) : fn.startsWith('output') ? args[fn === 'output' ? 0 : 1] : args[1];
        const alias = /alias\s*:\s*(['"])([^'"]+)\1/.exec(optsArg ?? '')?.[2] ?? field;
        if (fn === 'input' || fn === 'model') {
          out.push('__ng.Input({ isSignal: true, alias: ' + JSON.stringify(alias) + ', required: ' + !!req + ', transform: undefined })(' + target + ');');
          if (fn === 'model') out.push('__ng.Output(' + JSON.stringify(alias + 'Change') + ')(' + target + ');');
        } else if (fn.startsWith('output')) {
          out.push('__ng.Output(' + JSON.stringify(alias) + ')(' + target + ');');
        } else if (args[0]) {
          out.push('__ng.' + QUERY[fn] + '(' + args[0] + ', { ...(' + (args[1] || '{}') + '), isSignal: true })(' + target + ');');
        }
        i = close < 0 ? body.length : close + 1;
        atStart = false;
        continue;
      }
    }
    atStart = false;
    i++;
  }
  return out.join('');
}

/**
 * `@Component({...}) class Foo {...}` → `const __d0_Foo = Component({...}); class Foo {...};__d0_Foo(Foo);`
 * Chỉ hỗ trợ decorator đặt trên class (Angular hiện đại dùng input()/output()/host thay decorator thành viên).
 */
export function transformDecorators(code: string): string {
  const re = new RegExp('@(' + DECORATORS + ')\\s*\\(', 'g');
  const edits: { at: number; end: number; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    const decs: { start: number; end: number; name: string; args: string }[] = [];
    let i = m.index;
    let mm: RegExpExecArray | null = m;
    while (mm) {
      const open = mm.index + mm[0].length - 1;
      const close = findClose(code, open);
      if (close < 0) break;
      decs.push({ start: mm.index, end: close + 1, name: mm[1], args: code.slice(open + 1, close) });
      i = skipWs(code, close + 1);
      const next = new RegExp('^@(' + DECORATORS + ')\\s*\\(').exec(code.slice(i));
      mm = next ? Object.assign(next, { index: i }) : null;
    }
    if (!decs.length) continue;
    const cls = /^(?:(?:export|default|abstract)\s+)*class\s+([A-Za-z_$][\w$]*)/.exec(code.slice(i));
    if (!cls) { re.lastIndex = decs[decs.length - 1].end; continue; }
    const name = cls[1];
    let b = i + cls[0].length;
    while (b < code.length && code[b] !== '{') b++; // bỏ qua extends/implements tới thân class
    const bodyEnd = findClose(code, b);
    if (bodyEnd < 0) break;
    decs.forEach((d, k) => edits.push({ at: d.start, end: d.end, text: 'const __d' + k + '_' + name + ' = ' + d.name + '(' + d.args + ');' }));
    const apply = decs.map((_, k) => '__d' + k + '_' + name + '(' + name + ');').reverse().join('');
    const meta = signalMemberMeta(code.slice(b, bodyEnd + 1), name);
    edits.push({ at: bodyEnd + 1, end: bodyEnd + 1, text: ';' + meta + apply });
    re.lastIndex = bodyEnd + 1;
  }
  let out = code;
  for (const e of edits.sort((x, y) => y.at - x.at)) out = out.slice(0, e.at) + e.text + out.slice(e.end);
  return out;
}

/**
 * Bản build production (ngJitMode = false) bỏ thông tin scope của các NgModule AOT như FormsModule, CommonModule,
 * nên component JIT import chúng sẽ không nhận được directive nào. labModule() dựng một NgModule JIT
 * export đúng các directive/pipe thật để người học vẫn viết imports: [FormsModule] như bình thường.
 */
export function labModule(name: string, exports: unknown[]): Type<unknown> {
  const cls = { [name]: class {} }[name];
  NgModule({ exports: exports as Type<unknown>[] })(cls);
  return cls;
}
let commonModule: Type<unknown> | null = null;
function labCommonModule(): Type<unknown> {
  commonModule ??= labModule('CommonModule', [
    NgClass, NgStyle, NgTemplateOutlet, NgIf, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgPlural, NgPluralCase,
    AsyncPipe, DatePipe, DecimalPipe, CurrencyPipe, PercentPipe, UpperCasePipe, LowerCasePipe, TitleCasePipe, JsonPipe, SlicePipe, KeyValuePipe,
  ]);
  return commonModule;
}

export const NEEDS_JIT = new RegExp('@(' + DECORATORS + ')\\s*\\(|\\b(mount|bootstrapApplication)\\s*\\(');
let jit: Promise<unknown> | null = null;
/** Nạp JIT compiler của Angular (đăng ký ng.ɵcompilerFacade) — chỉ khi code có component. */
export function loadJit(): Promise<unknown> {
  jit ??= import('@angular/compiler');
  return jit;
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
  /** đường dẫn hiện tại của Router trong ứng dụng của lab (hiện ở thanh địa chỉ khung preview) */
  readonly url = signal('');
  /** các ứng dụng tạo bằng bootstrapApplication(), bị huỷ khi destroy */
  readonly apps: ApplicationRef[] = [];

  frame: HTMLIFrameElement | null = null;
  win: Any = null;
  preview: HTMLElement | null = null;
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
    const msg = explainNg((err?.name ?? 'Error') + ': ' + (err?.message ?? String(e)));
    this.line('err', 'Lỗi chưa được xử lý' + (where ? ' trong ' + where : '') + ' — ' + msg + (ln ? ' (dòng ' + ln + ')' : ''));
  }

  /** Khung preview đang có phần tử tương tác được (đang chờ người dùng) */
  interactive(): boolean {
    return !!this.preview?.querySelector('button, input, select, textarea');
  }

  pending(): number {
    return this.timers.size + this.intervals.size + this.http.filter((h) => h.status === 'pending').length;
  }

  /** "Component bị destroy": huỷ injector của lần chạy (effect, toSignal, takeUntilDestroyed...). Timer vẫn sống. */
  destroyComponent(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.destroyedAt = this.now();
    for (const app of this.apps.splice(0)) {
      try { app.destroy(); } catch (e) { this.reportError(e); }
    }
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
  /** globals bổ sung của bài học (vd. FormsModule) */
  extras?: Record<string, unknown>;
  /** chạy trước khi biên dịch code (vd. sinh CSS Tailwind cho các class trong code) */
  prepare?: (code: string, preview: HTMLElement) => Promise<void>;
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

  run.preview = opts.preview;
  if (opts.prepare) {
    try {
      await opts.prepare(code, opts.preview);
    } catch (e) {
      run.line('err', 'Không chuẩn bị được môi trường cho bài (' + (e as Error).message + ').');
    }
  }
  // Link thường (<a href>) trong preview sẽ điều hướng cả trang học: chặn lại và nhắc dùng routerLink
  opts.preview.onclick = (ev: MouseEvent) => {
    const a = (ev.target as Element | null)?.closest?.('a[href]');
    if (a && !ev.defaultPrevented) {
      ev.preventDefault();
      run.line('sys', '⛔ Lab chặn chuyển trang thật tới "' + a.getAttribute('href') + '". Trong ứng dụng Angular hãy dùng routerLink.');
    }
  };
  // <form> submit không preventDefault sẽ tải lại cả trang học: chặn lại
  opts.preview.onsubmit = (ev: SubmitEvent) => {
    if (!ev.defaultPrevented) {
      ev.preventDefault();
      run.line('sys', '⛔ Lab chặn trình duyệt gửi form thật (sẽ tải lại trang). Trong handler (submit) hãy gọi $event.preventDefault().');
    }
  };
  const RX = createSandbox(run, src);
  const win = run.win;
  if (NEEDS_JIT.test(code)) {
    try {
      await loadJit();
    } catch (e) {
      run.line('err', 'Không tải được trình biên dịch component (' + (e as Error).message + ').');
    }
  }
  const injector = createEnvironmentInjector([], opts.parent, 'code-lab-run');
  // Lỗi trong listener/change detection của component người học đi vào ErrorHandler gốc của app:
  // trong lúc lab chạy, chuyển chúng về Console của lab (vẫn gọi handler gốc).
  const rootHandler = opts.parent.get(ErrorHandler) as ErrorHandler & { handleError: (e: unknown) => void };
  const original = rootHandler.handleError;
  const patched = function (this: ErrorHandler, e: unknown) {
    if (run.active) run.reportError(e);
    original.call(this, e);
  };
  rootHandler.handleError = patched;
  injector.get(DestroyRef).onDestroy(() => {
    if (rootHandler.handleError === patched) rootHandler.handleError = original;
  });
  run.injector = injector;
  const destroyRef = injector.get(DestroyRef);
  const setT = (fn: () => void, ms: number) => win.setTimeout(fn, ms) as number;

  /**
   * Injector cho effect/toSignal/…: trong injection context (constructor/field của component, service) thì dùng
   * injector của chính nó — để effect bị huỷ cùng component như Angular thật; ngoài đó (code top-level) dùng injector
   * của lần chạy.
   */
  const ctxInjector = (): Injector => {
    try {
      return inject(Injector);
    } catch {
      return injector;
    }
  };
  const ctxDestroyRef = (): DestroyRef => {
    try {
      return inject(DestroyRef);
    } catch {
      return destroyRef;
    }
  };

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
        { ...o, injector: o?.injector ?? ctxInjector() },
      ),
    untracked,
    isSignal,
    toSignal: (src$: Any, o?: Any) => {
      if (isSignal(src$)) throw new Error('toSignal() cần một Observable, không phải Signal');
      const s = (toSignal as Any)(src$, { ...o, injector: o?.injector ?? ctxInjector() });
      reg(o?.debugName, 'toSignal', s);
      return s;
    },
    toObservable: (sig: Any, o?: Any) => {
      if (!isSignal(sig)) throw new Error('toObservable() cần một Signal');
      return toObservable(sig, { ...o, injector: o?.injector ?? ctxInjector() });
    },
    takeUntilDestroyed: (ref?: DestroyRef) => takeUntilDestroyed(ref ?? ctxDestroyRef()),
    rxResource: (o: Any) => (rxResource as Any)({ ...o, injector: o?.injector ?? ctxInjector() }),
    resource: (o: Any) => (resource as Any)({ ...o, injector: o?.injector ?? ctxInjector() }),
    destroyRef,
    injector,
    DestroyRef,
    Injector,
  };
  const ngComponents = {
    Component, Directive, Pipe, Injectable, Service, InjectionToken,
    input, output, model, inject, viewChild, viewChildren, contentChild, contentChildren,
    booleanAttribute, numberAttribute, forwardRef,
    // Angular nhận dạng callback bằng `instanceof Function` (realm của trang); hàm do người học viết thuộc realm
    // iframe nên phải bọc lại bằng một hàm của trang, nếu không hook bị coi là object rỗng và không bao giờ chạy.
    afterNextRender: (cb: Any, o?: Any) => afterNextRender(typeof cb === 'function' ? (...a: unknown[]) => cb(...a) : cb, o),
    afterRenderEffect: (cb: Any, o?: Any) => afterRenderEffect(typeof cb === 'function' ? (...a: unknown[]) => cb(...a) : cb, o),
    ElementRef, TemplateRef, ViewContainerRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation,
    get CommonModule() { return labCommonModule(); },
    NgClass, NgStyle, NgTemplateOutlet, NgIf, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe, DecimalPipe, CurrencyPipe, PercentPipe,
    UpperCasePipe, LowerCasePipe, TitleCasePipe, JsonPipe, SlicePipe, KeyValuePipe,
    __ng: { Input, Output, ViewChild, ViewChildren, ContentChild, ContentChildren },
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

  /** Render một component THẬT vào khung preview (JIT). Dừng/destroy sẽ huỷ component. */
  const appRef = injector.get(ApplicationRef);
  const mountComponent = (cls: Type<unknown>, o: { inputs?: Record<string, unknown> } = {}): ComponentRef<unknown> | null => {
    if (typeof cls !== 'function') throw new Error('mount() cần một class component, ví dụ mount(AppComponent)');
    const host = mk('div', 'ng-host');
    mount(host);
    let ref: ComponentRef<unknown>;
    try {
      ref = createComponent(cls, { environmentInjector: injector, hostElement: host });
    } catch (e) {
      host.remove();
      throw e;
    }
    for (const [k, v] of Object.entries(o.inputs ?? {})) ref.setInput(k, v);
    appRef.attachView(ref.hostView);
    // Render lần đầu qua ApplicationRef.tick() (như bootstrap thật) để các hook afterNextRender/afterRenderEffect chạy.
    try {
      appRef.tick();
    } catch {
      ref.changeDetectorRef.markForCheck(); // đang ở trong một tick khác: để scheduler lo
    }
    destroyRef.onDestroy(() => {
      appRef.detachView(ref.hostView);
      ref.destroy();
    });
    return ref;
  };

  /* ---------- HTTP giả cho HttpClient (ứng dụng tạo bằng bootstrapApplication) ---------- */
  let todoId = 100;
  const route = (req: HttpRequest<unknown>): { status: number; body: unknown; delay: number } => {
    const url = req.urlWithParams.replace(/^https?:\/\/[^/]+/, '');
    const path = url.split('?')[0];
    const auth = req.headers.get('Authorization');
    let m: RegExpExecArray | null;
    if (req.method === 'GET' && path === '/api/users') return { status: 200, body: [{ id: 1, name: 'An' }, { id: 2, name: 'Bình' }, { id: 3, name: 'Chi' }], delay: 400 };
    if (req.method === 'GET' && (m = /^\/api\/users\/(\d+)$/.exec(path))) {
      const id = Number(m[1]);
      return id === 13 ? { status: 500, body: { message: 'Lỗi máy chủ' }, delay: 300 } : { status: 200, body: { id, name: 'User ' + id, email: 'user' + id + '@demo.dev' }, delay: 300 };
    }
    if (req.method === 'GET' && path === '/api/private')
      return auth === 'Bearer bip-token' ? { status: 200, body: { secret: 'Dữ liệu bí mật' }, delay: 300 } : { status: 401, body: { message: 'Chưa đăng nhập' }, delay: 200 };
    if (req.method === 'GET' && path === '/api/flaky')
      return ++run.counters.flaky <= 1 ? { status: 500, body: { message: 'Lỗi tạm thời' }, delay: 250 } : { status: 200, body: { message: 'Dữ liệu đã về' }, delay: 250 };
    if (req.method === 'POST' && path === '/api/todos') return { status: 201, body: { id: ++todoId, ...(req.body as object) }, delay: 300 };
    if (req.method === 'GET' && path === '/api/todos') return { status: 200, body: [], delay: 200 };
    return { status: 404, body: { message: 'Không có API ' + req.method + ' ' + path }, delay: 150 };
  };
  const fakeBackend = {
    handle: (req: HttpRequest<unknown>) =>
      new RX.Observable((sub: Any) => {
        const path = req.urlWithParams.replace(/^https?:\/\/[^/]+/, '');
        const entry: LabHttp = { method: req.method, path, arg: req.body ?? null, t: run.now(), tEnd: null, status: 'pending' };
        run.http.push(entry);
        run.line('net', '→ ' + req.method + ' ' + path + (req.headers.keys().length ? '   headers: ' + req.headers.keys().map((k) => k + '=' + req.headers.get(k)).join(', ') : '') + (req.body != null ? '   body: ' + fmt(req.body) : ''));
        sub.next({ type: HttpEventType.Sent });
        const res = route(req);
        const id = setT(() => {
          entry.tEnd = run.now();
          if (res.status < 400) {
            entry.status = 'done';
            run.line('net-ok', '← ' + res.status + ' ' + path + '   ' + fmt(res.body));
            sub.next(new HttpResponse({ status: res.status, body: res.body, url: path, headers: new HttpHeaders({ 'content-type': 'application/json' }) }));
            sub.complete();
          } else {
            entry.status = 'error';
            run.line('net-fail', '✖ ' + res.status + ' ' + path + '   ' + fmt(res.body));
            sub.error(new HttpErrorResponse({ status: res.status, statusText: res.status === 401 ? 'Unauthorized' : res.status === 404 ? 'Not Found' : 'Server Error', url: path, error: res.body }));
          }
        }, res.delay);
        return () => {
          win.clearTimeout(id);
          if (entry.status === 'pending') {
            entry.status = 'cancelled';
            entry.tEnd = run.now();
            run.line('net-cancel', '⊘ huỷ ' + req.method + ' ' + path);
          }
        };
      }),
  };

  /**
   * bootstrapApplication(App, { providers }) như trong main.ts: tạo một ứng dụng Angular RIÊNG (root injector riêng)
   * cho lần chạy, để Router/HttpClient của lab không đụng tới site. Router dùng location giả (không đổi URL thật),
   * HttpClient nói chuyện với backend giả ở trên.
   */
  const bootstrapApp = async (cls: Type<unknown>, config: { providers?: unknown[] } = {}) => {
    const host = mk('div', 'ng-host');
    mount(host);
    const app = await createApplication({
      providers: [
        ...((config.providers ?? []) as never[]),
        provideLocationMocks(),
        { provide: HttpBackend, useValue: fakeBackend },
        { provide: ErrorHandler, useValue: { handleError: (e: unknown) => run.reportError(e) } },
      ],
    });
    if (!run.active || run.destroyed) {
      app.destroy();
      return null;
    }
    run.apps.push(app);
    const router = app.injector.get(Router, null);
    if (router) {
      router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          run.url.set(e.urlAfterRedirects);
          run.line('sys', '🧭 điều hướng tới ' + e.urlAfterRedirects);
        }
      });
    }
    try {
      return app.bootstrap(cls, host);
    } catch (e) {
      run.reportError(e); // ví dụ thiếu provider (NG0201): báo ra bảng lỗi thay vì Promise bị reject âm thầm
      return null;
    }
  };

  /* ---------- globals cho code người học ---------- */
  const g: Record<string, unknown> = {};
  for (const k of Object.keys(RX)) if (/^[A-Za-z_$][\w$]*$/.test(k)) g[k] = RX[k];
  Object.assign(g, ngComponents, ng, {
    rxjs: RX,
    spy, watch, log, sleep, ui, fakeApi, mount: mountComponent, bootstrapApplication: bootstrapApp,
    setTimeout: win.setTimeout, clearTimeout: win.clearTimeout,
    setInterval: win.setInterval, clearInterval: win.clearInterval,
    console: { log, info: log, debug: log, table: log, warn: (...a: unknown[]) => log('⚠', ...a), error: (...a: unknown[]) => log('✖', ...a) },
  });
  for (const [k, v] of Object.entries(opts.extras ?? {})) if (!k.startsWith('__')) g[k] = v;
  const names = Object.keys(g);
  const vals = names.map((n) => g[n]);

  let start: () => Promise<unknown>;
  try {
    start = await compile(code, names, vals, win.Function);
  } catch (e) {
    const line = e instanceof LabSyntaxError ? e.line : null;
    run.errors.push(e);
    if (line) run.errorLine = line;
    const member = /^\s*@(Input|Output|ViewChild|ViewChildren|ContentChild|ContentChildren|HostListener|HostBinding)\b/m.exec(code);
    const tip = member
      ? ' — Lab chưa hỗ trợ decorator đặt trên field/method (@' + member[1] + '). Dùng API hiện đại: input(), output(), model(), viewChild(), contentChild() và host: { … } trong @Component.'
      : '';
    run.line('err', 'Lỗi cú pháp — ' + (e as Error).message + (line ? ' (dòng ' + line + ')' : '') + tip);
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
  /** chữ hiển thị (đã chuẩn hoá khoảng trắng) trong preview, hoặc của phần tử khớp selector đầu tiên */
  text(selector?: string): string;
  /** các phần tử trong preview khớp selector */
  query(selector: string): Element[];
  /** các dòng log(...) / console.log(...) đã in */
  logs: string[];
  /** phần tử gốc của khung preview (đọc dữ liệu do simulate().dom() đánh dấu) */
  root(): HTMLElement | null;
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
    text: (sel) => {
      const el = sel ? run.preview?.querySelector(sel) : run.preview;
      return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
    },
    query: (sel) => [...(run.preview?.querySelectorAll(sel) ?? [])],
    logs: run.logs,
    root: () => run.preview,
  };
}

export interface SimCtx {
  at(ms: number, fn: () => void): void;
  /** gõ vào ô nhập thứ `target` (đếm trong preview) hoặc ô khớp selector */
  type(target: number | string, text: string): void;
  /** bấm nút hoặc link trong preview có chữ chứa `label` */
  click(label: string): void;
  /** rời khỏi ô nhập (blur) — các form đánh dấu touched ở bước này */
  blur(target: number | string): void;
  /** bấm phần tử khớp selector (thứ `index`) */
  clickSel(selector: string, index?: number): void;
  /** chọn giá trị cho <select> khớp selector */
  choose(selector: string, value: string): void;
  /** tick/bỏ tick checkbox khớp selector */
  tick(selector: string, checked: boolean): void;
  /** nhấn phím (keydown + keyup) trên ô nhập thứ `target` hoặc phần tử khớp selector */
  press(target: number | string, key: string): void;
  /** rê chuột vào (mouseenter) hoặc ra (mouseleave) phần tử khớp selector */
  hover(selector: string, leave?: boolean): void;
  /** thao tác tuỳ ý trên khung preview (đánh dấu phần tử, đọc DOM…) */
  dom(fn: (root: HTMLElement) => void): void;
  destroy(): void;
}

export function simCtx(run: LabRun): SimCtx {
  const pulse = (el: Element) => {
    el.classList.add('pressed');
    setTimeout(() => el.classList.remove('pressed'), 180);
  };
  const q = (sel: string) => [...(run.preview?.querySelectorAll(sel) ?? [])] as HTMLElement[];
  return {
    at: (ms, fn) => { run.win?.setTimeout(fn, ms); },
    type(target, text) {
      const inp = (typeof target === 'number' ? q('input:not([type=checkbox]):not([type=radio]), textarea')[target] : q(target)[0]) as HTMLInputElement | undefined;
      if (!inp) { run.line('sim', '🤖 Không tìm thấy ô nhập ' + JSON.stringify(target)); return; }
      run.line('sim', '🤖 gõ "' + text + '"');
      inp.value = text;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      pulse(inp);
    },
    click(label) {
      const b = q('button, a').find((x) => (x.textContent ?? '').includes(label));
      if (!b) { run.line('sim', '🤖 Không tìm thấy nút "' + label + '"'); return; }
      run.line('sim', '🤖 bấm "' + (b.textContent ?? '').trim() + '"');
      b.click();
      pulse(b);
    },
    blur(target) {
      const el = (typeof target === 'number' ? q('input:not([type=checkbox]):not([type=radio]), textarea')[target] : q(target)[0]) as HTMLElement | undefined;
      if (!el) { run.line('sim', '🤖 Không tìm thấy ' + JSON.stringify(target)); return; }
      run.line('sim', '🤖 rời khỏi ô nhập');
      el.dispatchEvent(new FocusEvent('blur'));
      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    },
    clickSel(sel, index = 0) {
      const el = q(sel)[index];
      if (!el) { run.line('sim', '🤖 Không tìm thấy phần tử ' + sel); return; }
      run.line('sim', '🤖 bấm ' + sel + (index ? ' #' + index : ''));
      el.click();
      pulse(el);
    },
    choose(sel, value) {
      const el = q(sel)[0] as HTMLSelectElement | undefined;
      if (!el) { run.line('sim', '🤖 Không tìm thấy ' + sel); return; }
      run.line('sim', '🤖 chọn "' + value + '"');
      el.value = value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
      pulse(el);
    },
    tick(sel, checked) {
      const el = q(sel)[0] as HTMLInputElement | undefined;
      if (!el) { run.line('sim', '🤖 Không tìm thấy ' + sel); return; }
      run.line('sim', '🤖 ' + (checked ? 'tick' : 'bỏ tick') + ' ' + sel);
      if (el.checked !== checked) el.click();
      pulse(el);
    },
    press(target, key) {
      const el = (typeof target === 'number' ? q('input:not([type=checkbox]):not([type=radio]), textarea')[target] : q(target)[0]) as HTMLElement | undefined;
      if (!el) { run.line('sim', '🤖 Không tìm thấy ' + JSON.stringify(target)); return; }
      run.line('sim', '🤖 nhấn phím ' + key);
      for (const type of ['keydown', 'keyup']) el.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
      pulse(el);
    },
    hover(sel, leave = false) {
      const el = q(sel)[0];
      if (!el) { run.line('sim', '🤖 Không tìm thấy ' + sel); return; }
      run.line('sim', '🤖 ' + (leave ? 'rời chuột khỏi ' : 'rê chuột vào ') + sel);
      el.dispatchEvent(new MouseEvent(leave ? 'mouseleave' : 'mouseenter'));
    },
    dom(fn) {
      if (run.preview) fn(run.preview);
    },
    destroy() {
      run.line('sim', '💥 Component bị destroy');
      run.destroyComponent();
    },
  };
}
