import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Khung "cửa sổ trình duyệt" cartoon bao quanh kết quả live. */
@Component({
  selector: 'app-browser-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
      <span class="url">{{ url() }}</span>
    </div>
    <div class="body"><ng-content /></div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-width: 0; background: var(--surface); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    .top { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: var(--surface-2); border-bottom: var(--border); }
    .dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--line); }
    .r { background: var(--c-error); } .y { background: var(--c-signal); } .g { background: var(--c-data); }
    .url { margin-left: 8px; flex: 1; padding: 2px 10px; font-family: var(--font-mono); font-size: 12px; background: var(--surface); border: 2px solid var(--line); border-radius: var(--radius-pill); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .body { padding: 18px; flex: 1; }
  `,
})
export class BrowserFrame {
  readonly url = input('localhost:4200');
}
