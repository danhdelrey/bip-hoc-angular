import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

const KW = new Set(
  'const let var function return if else for while do break continue new class extends import from export default async await try catch finally throw typeof instanceof in of this null undefined true false switch case void yield delete static get set interface type implements private public protected readonly as enum super'.split(' '),
);
const API = new Set(['signal', 'computed', 'effect', 'untracked', 'linkedSignal', 'isSignal', 'toSignal', 'toObservable', 'takeUntilDestroyed', 'rxResource', 'destroyRef', 'spy', 'watch', 'log', 'sleep', 'ui', 'fakeApi']);
const esc = (s: string) => s.replace(/[&<>]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'));

/** Highlight đồng bộ, đủ nhanh để chạy mỗi lần gõ phím. Màu bám theo theme GitHub mà Shiki của site đang dùng. */
export function highlight(src: string, rxNames: ReadonlySet<string>): string {
  let out = '';
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|(`(?:\\[\s\S]|[^`\\])*`?|'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?)|(\b\d[\d_]*(?:\.\d+)?\b)|(#?[A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const tok = m[0];
    let cls = '';
    if (m[1]) cls = 'c';
    else if (m[2]) cls = 's';
    else if (m[3]) cls = 'n';
    else if (m[4]) {
      if (KW.has(tok)) cls = 'k';
      else if (API.has(tok)) cls = 'g';
      else if (rxNames.has(tok)) cls = 'o';
      else if (tok.endsWith('$')) cls = 'v';
      else if (/^\s*\(/.test(src.slice(re.lastIndex, re.lastIndex + 4))) cls = 'f';
      else if (/^[A-Z]/.test(tok)) cls = 't';
    }
    out += cls ? '<span class="' + cls + '">' + esc(tok) + '</span>' : esc(tok);
  }
  return out;
}

/**
 * Trình soạn code nhẹ: textarea trong suốt đè lên lớp <pre> đã tô màu.
 * Tab/Shift+Tab thụt lề, Enter giữ thụt lề, Ctrl+/ comment, Ctrl+Enter chạy.
 * Esc rồi Tab để rời khỏi editor bằng bàn phím.
 */
@Component({
  selector: 'app-lab-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="rxed-gutter" #gutter aria-hidden="true">
      @for (n of lineNumbers(); track n) {
        <div [class.err]="n === errorLine()">{{ n }}</div>
      }
    </div>
    <div class="rxed-wrap">
      <pre class="rxed-hl" #hl aria-hidden="true" [innerHTML]="html()"></pre>
      <textarea
        #ta
        class="rxed-ta"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        wrap="off"
        aria-label="Trình soạn code (Ctrl+Enter để chạy, Esc rồi Tab để thoát)"
        (input)="onInput()"
        (scroll)="sync()"
        (keydown)="onKey($event)"
      ></textarea>
    </div>
  `,
  styles: `
    app-lab-editor { display: flex; min-height: 0; background: var(--code-bg); font: 13px/20px var(--font-mono); }
    .rxed-gutter { width: 44px; flex: none; overflow: hidden; padding: 12px 0; text-align: right; color: var(--code-gutter); user-select: none; border-right: var(--border-thin); }
    .rxed-gutter div { padding-right: 10px; height: 20px; }
    .rxed-gutter div.err { background: color-mix(in srgb, var(--c-error) 30%, transparent); color: var(--text); font-weight: 600; }
    .rxed-wrap { position: relative; flex: 1; min-width: 0; }
    .rxed-hl, .rxed-ta { position: absolute; inset: 0; margin: 0; padding: 12px 14px; border: 0; font: inherit; font-variant-ligatures: none; letter-spacing: 0; white-space: pre; tab-size: 2; overflow: auto; }
    .rxed-hl { pointer-events: none; overflow: hidden; color: #1f2328; }
    .rxed-ta { background: transparent; color: transparent; caret-color: var(--text); resize: none; outline: none; z-index: 1; }
    .rxed-ta::selection { background: color-mix(in srgb, var(--c-primary) 30%, transparent); color: transparent; }
    .rxed-ta:focus-visible { box-shadow: inset 0 0 0 2px var(--focus-ring); }
    .rxed-hl .c { color: #6e7781; font-style: italic; } .rxed-hl .s { color: #0a3069; } .rxed-hl .n { color: #0550ae; }
    .rxed-hl .k { color: #cf222e; } .rxed-hl .g { color: #8250df; font-weight: 600; } .rxed-hl .o { color: #0550ae; }
    .rxed-hl .f { color: #6639ba; } .rxed-hl .t { color: #953800; } .rxed-hl .v { color: #116329; }
    :root[data-theme='dark'] .rxed-hl { color: #e6edf3; }
    :root[data-theme='dark'] .rxed-hl .c { color: #8b949e; } :root[data-theme='dark'] .rxed-hl .s { color: #a5d6ff; }
    :root[data-theme='dark'] .rxed-hl .n, :root[data-theme='dark'] .rxed-hl .o { color: #79c0ff; } :root[data-theme='dark'] .rxed-hl .k { color: #ff7b72; }
    :root[data-theme='dark'] .rxed-hl .g { color: #d2a8ff; } :root[data-theme='dark'] .rxed-hl .f { color: #d2a8ff; }
    :root[data-theme='dark'] .rxed-hl .t { color: #ffa657; } :root[data-theme='dark'] .rxed-hl .v { color: #7ee787; }
  `,
})
export class LabEditor {
  readonly value = model('');
  readonly errorLine = input<number | null>(null);
  /** Tên các export của RxJS để tô màu operator */
  readonly rxNames = input<ReadonlySet<string>>(new Set());
  readonly run = output<void>();

  private readonly ta = viewChild.required<ElementRef<HTMLTextAreaElement>>('ta');
  private readonly hl = viewChild.required<ElementRef<HTMLElement>>('hl');
  private readonly gutter = viewChild.required<ElementRef<HTMLElement>>('gutter');

  protected readonly html = computed(() => highlight(this.value(), this.rxNames()) + '\n ');
  protected readonly lineNumbers = computed(() => Array.from({ length: this.value().split('\n').length }, (_, i) => i + 1));
  private escPressed = false;

  constructor() {
    // Giá trị đổi từ bên ngoài (chọn bài, reset…) → ghi vào textarea, giữ nguyên nếu trùng để không mất con trỏ
    effect(() => {
      const v = this.value();
      const el = this.ta().nativeElement;
      if (el.value !== v) {
        el.value = v;
        el.scrollTop = 0;
      }
      queueMicrotask(() => this.sync());
    });
  }

  focus(): void {
    this.ta().nativeElement.focus();
  }

  protected onInput(): void {
    this.value.set(this.ta().nativeElement.value);
  }

  protected sync(): void {
    const el = this.ta().nativeElement;
    this.hl().nativeElement.scrollTop = el.scrollTop;
    this.hl().nativeElement.scrollLeft = el.scrollLeft;
    this.gutter().nativeElement.scrollTop = el.scrollTop;
  }

  private insert(text: string): void {
    const el = this.ta().nativeElement;
    el.focus();
    let ok = false;
    try {
      ok = document.execCommand('insertText', false, text); // giữ được Ctrl+Z
    } catch {
      ok = false;
    }
    if (!ok) {
      el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
      this.onInput();
    }
  }

  private replaceLines(fn: (lines: string[]) => string[]): void {
    const el = this.ta().nativeElement;
    const v = el.value, s = el.selectionStart, e = el.selectionEnd;
    const ls = v.lastIndexOf('\n', s - 1) + 1;
    let le = v.indexOf('\n', e > s && v[e - 1] === '\n' ? e - 1 : e);
    if (le === -1) le = v.length;
    const out = fn(v.slice(ls, le).split('\n')).join('\n');
    el.setSelectionRange(ls, le);
    this.insert(out);
    el.setSelectionRange(ls, ls + out.length);
  }

  protected onKey(e: KeyboardEvent): void {
    const el = this.ta().nativeElement;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === 'Enter') {
      e.preventDefault();
      this.run.emit();
      return;
    }
    if (mod && e.key === '/') {
      e.preventDefault();
      this.replaceLines((lines) => {
        const all = lines.filter((l) => l.trim()).every((l) => /^\s*\/\//.test(l));
        return lines.map((l) => (all ? l.replace(/^(\s*)\/\/ ?/, '$1') : l.trim() ? l.replace(/^(\s*)/, '$1// ') : l));
      });
      return;
    }
    if (e.key === 'Escape') {
      this.escPressed = true;
      return;
    }
    if (e.key === 'Tab') {
      if (this.escPressed) {
        this.escPressed = false;
        return; // để trình duyệt chuyển focus
      }
      e.preventDefault();
      const multi = el.value.slice(el.selectionStart, el.selectionEnd).includes('\n');
      if (e.shiftKey || multi) this.replaceLines((lines) => lines.map((l) => (e.shiftKey ? l.replace(/^ {1,2}/, '') : '  ' + l)));
      else this.insert('  ');
      return;
    }
    this.escPressed = false;
    if (e.key === 'Enter' && !e.shiftKey && !mod && !e.altKey) {
      e.preventDefault();
      const v = el.value, s = el.selectionStart;
      const line = v.slice(v.lastIndexOf('\n', s - 1) + 1, s);
      let ind = line.match(/^\s*/)?.[0] ?? '';
      if (/[{([]$/.test(line.trimEnd())) {
        if (/[})\]]/.test(v.slice(s, s + 1))) {
          this.insert('\n' + ind + '  \n' + ind);
          const pos = s + ind.length + 3;
          el.setSelectionRange(pos, pos);
          return;
        }
        ind += '  ';
      }
      this.insert('\n' + ind);
      return;
    }
    if ((e.key === '}' || e.key === ')' || e.key === ']') && !mod) {
      const v = el.value, s = el.selectionStart;
      const line = v.slice(v.lastIndexOf('\n', s - 1) + 1, s);
      if (/^\s+$/.test(line) && line.length >= 2 && s === el.selectionEnd) {
        e.preventDefault();
        el.setSelectionRange(s - 2, s);
        this.insert(e.key);
      }
    }
  }
}
