import { ChangeDetectionStrategy, Component, computed, linkedSignal, resource, signal } from '@angular/core';
import { CodePanel } from '../../../shared/ui/code-panel/code-panel';
import { Icon } from '../../../shared/ui/icon/icon';
import { LINKED_TS, RESOURCE_TS } from './signals.content';

const SIZES = { ao: ['S', 'M', 'L'], giay: ['39', '40', '41'] };
const PRODUCTS: Record<number, { name: string; price: number }> = {
  1: { name: 'Áo thun Bíp', price: 120 },
  2: { name: 'Giày lò xo', price: 450 },
  3: { name: 'Mũ ăng-ten', price: 90 },
};

/** HTTP giả lập: trễ ~900ms, hỗ trợ huỷ qua AbortSignal */
function fakeFetch(id: number, abortSignal: AbortSignal, fail: boolean) {
  return new Promise<{ name: string; price: number }>((resolve, reject) => {
    const t = setTimeout(() => (fail ? reject(new Error('500 — server mock lỗi')) : resolve(PRODUCTS[id])), 900);
    abortSignal.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Đã huỷ', 'AbortError'));
    });
  });
}

/** Phần nâng cao: linkedSignal & resource — chạy bằng API thật của Angular. */
@Component({
  selector: 'app-signals-advanced',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodePanel, Icon],
  template: `
    <section class="adv toon toon-lg" aria-labelledby="sig-adv">
      <h2 id="sig-adv"><span class="chip chip-signal"><app-icon name="signal" [size]="16" /> Nâng cao</span> linkedSignal & resource</h2>
      <div class="cols">
        <div class="col">
          <h3>linkedSignal — đèn có công tắc "reset"</h3>
          <p class="muted">Ghi được như signal, nhưng khi nguồn đổi thì tự tính lại giá trị mặc định.</p>
          <app-code-panel [files]="[{ name: 'linked', lang: 'typescript', code: linkedCode }]" [compact]="true" />
          <div class="demo">
            <div class="row">
              <span class="lbl">product</span>
              <button type="button" class="btn btn-sm" [class.btn-signal]="product() === 'ao'" (click)="product.set('ao')">Áo</button>
              <button type="button" class="btn btn-sm" [class.btn-signal]="product() === 'giay'" (click)="product.set('giay')">Giày</button>
            </div>
            <div class="row">
              <span class="lbl">size</span>
              @for (s of sizes(); track s) {
                <button type="button" class="size" [class.on]="size() === s" (click)="size.set(s)" [attr.aria-pressed]="size() === s">{{ s }}</button>
              }
            </div>
            <p class="out">size() = <b>'{{ size() }}'</b> <span class="muted">— chọn size L rồi đổi sang Giày xem!</span></p>
          </div>
        </div>
        <div class="col">
          <h3>resource — đèn chờ dữ liệu bất đồng bộ</h3>
          <p class="muted">Gói việc tải dữ liệu thành signal: có sẵn status, value, error. params đổi thì tự tải lại (và huỷ lần tải cũ).</p>
          <app-code-panel [files]="[{ name: 'resource', lang: 'typescript', code: resourceCode }]" [compact]="true" />
          <div class="demo">
            <div class="row">
              <span class="lbl">productId</span>
              @for (id of [1, 2, 3]; track id) {
                <button type="button" class="btn btn-sm" [class.btn-signal]="productId() === id" (click)="productId.set(id)">{{ id }}</button>
              }
              <button type="button" class="btn btn-sm" (click)="item.reload()"><app-icon name="replay" [size]="14" /> reload()</button>
            </div>
            <label class="row fail"><input type="checkbox" [checked]="fail()" (change)="fail.set(!fail())" /> Giả lập lỗi server</label>
            <p class="out">
              status():
              <span class="chip" [class.chip-signal]="item.isLoading()" [class.chip-data]="item.status() === 'resolved'" [class.chip-error]="item.status() === 'error'">
                {{ item.status() }}
              </span>
              @if (item.isLoading()) {
                <span class="spinner" aria-hidden="true"></span>
              }
            </p>
            <p class="out">
              @if (item.error(); as e) {
                <span class="err"><app-icon name="error" [size]="16" /> {{ e.message }}</span>
              } @else if (item.hasValue()) {
                value(): <b>{{ item.value().name }} — {{ item.value().price }}k</b>
              } @else {
                <span class="muted">đang chờ…</span>
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; margin: 0 0 44px; }
    .adv { padding: 20px 22px 22px; }
    h2 { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: var(--fs-lg); }
    h3 { font-size: var(--fs-md); margin-bottom: 4px; }
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .col p { font-size: var(--fs-sm); }
    .demo { display: grid; gap: 8px; margin-top: 12px; padding: 12px; border: var(--border-thin); border-radius: var(--radius-sm); background: var(--surface-2); }
    .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .lbl { font-family: var(--font-mono); font-weight: 700; min-width: 76px; font-size: 13px; }
    .size { min-width: 40px; min-height: 36px; font-weight: 800; background: var(--surface); border: var(--border-thin); border-radius: 10px; cursor: pointer; }
    .size.on { background: var(--c-signal); color: var(--on-accent); }
    .out { margin: 0; font-size: var(--fs-sm); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .fail { font-size: var(--fs-sm); font-weight: 700; }
    .err { display: inline-flex; gap: 6px; align-items: center; color: var(--c-error-strong); font-weight: 800; }
    .spinner { width: 16px; height: 16px; border: 3px solid var(--line); border-top-color: transparent; border-radius: 50%; animation: spin 700ms linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) { .cols { grid-template-columns: 1fr; } }
  `,
})
export class SignalsAdvanced {
  protected readonly linkedCode = LINKED_TS;
  protected readonly resourceCode = RESOURCE_TS;

  // linkedSignal
  protected readonly product = signal<'ao' | 'giay'>('ao');
  protected readonly sizes = computed(() => SIZES[this.product()]);
  protected readonly size = linkedSignal(() => this.sizes()[0]);

  // resource
  protected readonly productId = signal(1);
  protected readonly fail = signal(false);
  protected readonly item = resource({
    params: () => ({ id: this.productId(), fail: this.fail() }),
    loader: ({ params, abortSignal }) => fakeFetch(params.id, abortSignal, params.fail),
  });
}
