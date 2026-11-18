import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Mascot, type MascotMood } from '../mascot/mascot';

/** Bong bóng thoại viền cartoon. Đuôi chỉ về phía người nói. */
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
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
      font-weight: 600;
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
      left: -17px; top: 22px;
      border-width: 10px 17px 10px 0;
      border-color: transparent var(--line) transparent transparent;
    }
    :host(.tail-left) .bubble::after {
      left: -11px; top: 25px;
      border-width: 7px 12px 7px 0;
      border-color: transparent var(--surface) transparent transparent;
    }
    :host(.tail-bottom) .bubble::before {
      left: 34px; bottom: -17px;
      border-width: 17px 12px 0 0;
      border-color: var(--line) transparent transparent transparent;
    }
    :host(.tail-bottom) .bubble::after {
      left: 37.5px; bottom: -11px;
      border-width: 11px 7px 0 0;
      border-color: var(--surface) transparent transparent transparent;
    }
    @media (prefers-reduced-motion: no-preference) {
      .bubble { animation: pop 420ms var(--ease-bounce) both; transform-origin: 0 50%; }
    }
    @keyframes pop {
      from { transform: scale(0.7); opacity: 0; }
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
