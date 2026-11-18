import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { safeStorage } from '../../core/storage/safe-storage';
import { Icon } from '../../shared/ui/icon/icon';

export const SEMANTICS = [
  { key: 'data', label: 'Dữ liệu', icon: 'data' },
  { key: 'event', label: 'Sự kiện', icon: 'event' },
  { key: 'di', label: 'Service / DI', icon: 'di' },
  { key: 'signal', label: 'Signal', icon: 'signal' },
  { key: 'error', label: 'Lỗi', icon: 'error' },
] as const;

/** Chú giải màu cố định ở góc màn hình. Màu luôn đi kèm icon + nhãn. */
@Component({
  selector: 'app-color-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <button type="button" class="toggle" (click)="toggle()" [attr.aria-expanded]="open()" aria-controls="legend-list">
      <app-icon name="palette" [size]="18" /> <span>Chú giải màu</span>
    </button>
    @if (open()) {
      <ul id="legend-list" class="list">
        @for (s of items; track s.key) {
          <li class="chip" [class]="'chip chip-' + s.key"><app-icon [name]="s.icon" [size]="16" /> {{ s.label }}</li>
        }
      </ul>
    }
  `,
  styles: `
    /* Desktop: neo ở góc dưới-trái, nằm gọn trong chân sidebar => không che nội dung */
    :host { position: fixed; left: 0; bottom: 0; z-index: 50; width: var(--sidebar-w); padding: 10px 12px; display: flex; flex-direction: column-reverse; gap: 8px; background: var(--bg); border-top: var(--border); border-right: var(--border); }
    .toggle { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; min-height: 36px; font-weight: 800; font-size: var(--fs-sm); background: var(--surface); border: var(--border-thin); border-radius: var(--radius-pill); box-shadow: var(--shadow-sm); cursor: pointer; }
    .list { display: flex; flex-wrap: wrap; gap: 5px; margin: 0; padding: 0; list-style: none; }
    .chip { font-size: 12px; }
    /* Mobile/tablet: sidebar ẩn -> chú giải nổi ở góc dưới-phải */
    @media (max-width: 1000px) {
      :host { left: auto; right: 12px; bottom: 12px; width: auto; max-width: 260px; padding: 0; background: none; border: none; align-items: flex-end; }
      .toggle { align-self: flex-end; }
      .toggle span { display: none; }
      .list { justify-content: flex-end; padding: 8px; background: var(--surface); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
    }
  `,
})
export class ColorLegend {
  protected readonly items = SEMANTICS;
  protected readonly open = signal(safeStorage.read('bip.legend', (globalThis.innerWidth ?? 1440) > 1000));

  protected toggle(): void {
    this.open.update((v) => !v);
    safeStorage.write('bip.legend', this.open());
  }
}
