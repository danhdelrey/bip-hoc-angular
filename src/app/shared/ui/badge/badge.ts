import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type BadgeId, badgeById } from '../../../content/badges';

const ICON_PATHS: Record<string, string> = {
  footprint: 'M43 36c-4 0-6 5-6 10s2 8 6 8 6-3 6-8-2-10-6-10zm-3-9a2.5 2.5 0 1 0 0 .1M45 25a2.5 2.5 0 1 0 0 .1M50 28a2.2 2.2 0 1 0 0 .1M54 33a2 2 0 1 0 0 .1',
  compass: 'M50 30a18 18 0 1 0 .1 0zM57 43l-10 6-3 10 10-6z',
  star: 'M50 30l5.6 11.5 12.6 1.7-9.2 8.8 2.3 12.5L50 58.6l-11.3 5.9 2.3-12.5-9.2-8.8 12.6-1.7z',
  bolt: 'M53 28 38 50h10l-3 20 16-24H51z',
  crown: 'M33 60h34l3-24-11 9-9-14-9 14-11-9z',
};

/** Huy hiệu kiểu cartoon: hình răng cưa + ruy-băng. Khi khoá thì xám và có ổ khoá. */
@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.locked]': '!unlocked()', '[style.--size.px]': 'size()' },
  template: `
    <svg viewBox="0 0 100 112" role="img" [attr.aria-label]="def().title + (unlocked() ? ' (đã mở khoá)' : ' (chưa mở khoá)')">
      <path class="ribbon" d="M34 72 26 108l14-8 8 12 6-38zM66 72l8 36-14-8-8 12-6-38z" />
      <path class="burst" [attr.d]="burst" [style.fill]="unlocked() ? def().color : null" />
      <circle class="inner" cx="50" cy="47" r="26" />
      @if (unlocked()) {
        <path class="icon" [attr.d]="icon()" />
      } @else {
        <g class="lock">
          <rect x="39" y="45" width="22" height="16" rx="4" />
          <path d="M43 45v-5a7 7 0 0 1 14 0v5" />
        </g>
      }
    </svg>
    @if (showLabel()) {
      <span class="label">{{ def().title }}</span>
    }
  `,
  styles: `
    :host { display: inline-flex; flex-direction: column; align-items: center; gap: 6px; width: var(--size); }
    svg { width: 100%; overflow: visible; }
    .ribbon { fill: var(--c-accent); stroke: var(--pal-ink); stroke-width: 3; stroke-linejoin: round; }
    .burst { stroke: var(--pal-ink); stroke-width: 3; stroke-linejoin: round; }
    .inner { fill: var(--pal-cream); stroke: var(--pal-ink); stroke-width: 3; }
    .icon { fill: none; stroke: var(--pal-ink); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; }
    .lock rect, .lock path { fill: none; stroke: #6b6890; stroke-width: 3.2; stroke-linecap: round; }
    :host(.locked) .burst { fill: #d9d4e8; }
    :host(.locked) .ribbon { fill: #c4bfd6; }
    .label { font-family: var(--font-display); font-weight: 800; font-size: var(--fs-sm); text-align: center; line-height: 1.2; }
    @media (prefers-reduced-motion: no-preference) {
      :host(:not(.locked)):hover svg { animation: spin 700ms var(--ease-bounce); }
    }
    @keyframes spin { 0% { transform: rotate(0) scale(1); } 50% { transform: rotate(-10deg) scale(1.1); } 100% { transform: rotate(0) scale(1); } }
  `,
})
export class Badge {
  readonly id = input.required<BadgeId>();
  readonly unlocked = input(false);
  readonly size = input(96);
  readonly showLabel = input(true);

  protected readonly def = computed(() => badgeById(this.id()));
  protected readonly icon = computed(() => ICON_PATHS[this.def().icon]);

  /** Hình răng cưa 16 cánh */
  protected readonly burst = (() => {
    const pts: string[] = [];
    for (let i = 0; i < 32; i++) {
      const r = i % 2 === 0 ? 38 : 32;
      const a = (Math.PI * 2 * i) / 32 - Math.PI / 2;
      pts.push(`${(50 + r * Math.cos(a)).toFixed(1)} ${(47 + r * Math.sin(a)).toFixed(1)}`);
    }
    return `M${pts.join(' L')}Z`;
  })();
}
