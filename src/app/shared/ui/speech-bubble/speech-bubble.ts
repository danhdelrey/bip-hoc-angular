import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Mascot, type MascotMood } from '../mascot/mascot';

/** Bong bóng thoại. Đuôi chỉ về phía người nói. */
@Component({
  selector: 'app-speech-bubble',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"tail-" + tail()', role: 'note' },
  template: `<div class="bubble"><ng-content /></div>`,
  styles: `
    :host { display: block; position: relative; min-width: 0; }
    .bubble {
      position: relative;
      overflow-wrap: anywhere;
      padding: 14px 18px;
      background: var(--surface);
      border: var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
      font-weight: 500;
      font-size: var(--fs-md);
    }
    .bubble::before, .bubble::after {
      content: '';
      position: absolute;
      width: 0; height: 0;
      border-style: solid;
    }
    /* Đuôi bên trái (người nói ở bên trái) */
    :host(.tail-left) .bubble::before {
      left: -9px; top: 20px;
      border-width: 7px 9px 7px 0;
      border-color: transparent var(--line) transparent transparent;
    }
    :host(.tail-left) .bubble::after {
      left: -7.6px; top: 20px;
      border-width: 7px 9px 7px 0;
      border-color: transparent var(--surface) transparent transparent;
    }
    :host(.tail-bottom) .bubble::before {
      left: 30px; bottom: -9px;
      border-width: 9px 9px 0 0;
      border-color: var(--line) transparent transparent transparent;
    }
    :host(.tail-bottom) .bubble::after {
      left: 31px; bottom: -7.4px;
      border-width: 9px 9px 0 0;
      border-color: var(--surface) transparent transparent transparent;
    }
    @media (prefers-reduced-motion: no-preference) {
      .bubble { animation: pop 240ms var(--ease-out) both; transform-origin: 0 50%; }
    }
    @keyframes pop {
      from { transform: translateY(4px); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
})
export class SpeechBubble {
  readonly tail = input<'left' | 'bottom' | 'none'>('left');
}

/** Bíp + bong bóng thoại — dùng cho định nghĩa, gợi ý, phản ứng quiz, ăn mừng. */
@Component({
  selector: 'app-mascot-says',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Mascot, SpeechBubble],
  template: `
    <app-mascot [mood]="mood()" [size]="size()" />
    <app-speech-bubble tail="left">
      <ng-content />
    </app-speech-bubble>
  `,
  styles: `
    :host { display: flex; align-items: center; gap: 22px; }
    app-speech-bubble { flex: 1; }
    @media (max-width: 560px) { :host { gap: 16px; } }
  `,
})
export class MascotSays {
  readonly mood = input<MascotMood>('happy');
  readonly size = input(96);
}
