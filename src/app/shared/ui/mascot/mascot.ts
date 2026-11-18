import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type MascotMood = 'happy' | 'thinking' | 'surprised' | 'sad' | 'celebrate' | 'wave';

const MOOD_LABEL: Record<MascotMood, string> = {
  happy: 'đang vui',
  thinking: 'đang suy nghĩ',
  surprised: 'đang ngạc nhiên',
  sad: 'đang buồn, gãi đầu',
  celebrate: 'đang ăn mừng',
  wave: 'đang vẫy chào',
};

/**
 * Bíp — linh vật nguyên bản: robot viên nang xanh da trời, mặt là màn hình.
 * Biểu cảm vẽ trên màn hình nên đổi nhanh và rõ ở cả kích thước nhỏ.
 */
@Component({
  selector: 'app-mascot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mascot',
    '[class]': '"mood-" + mood()',
    '[style.--size.px]': 'size()',
  },
  template: `
    <svg viewBox="0 0 120 150" role="img" [attr.aria-label]="label()">
      <ellipse class="ground" cx="60" cy="145" rx="30" ry="4.5" />
      <g class="figure">
        <!-- Chân lò xo -->
        <g class="legs">
          <path class="spring" d="M46 117 l-5 3 l10 3 l-10 3 l10 3 l-5 3" />
          <path class="spring" d="M74 117 l-5 3 l10 3 l-10 3 l10 3 l-5 3" />
          <rect class="foot" x="35" y="133" width="22" height="9" rx="4.5" />
          <rect class="foot" x="63" y="133" width="22" height="9" rx="4.5" />
        </g>

        <!-- Tay trái -->
        <g class="arm arm-l">
          <path class="arm-out" [attr.d]="arms().l" />
          <path class="arm-in" [attr.d]="arms().l" />
          <circle class="hand" [attr.cx]="arms().lh[0]" [attr.cy]="arms().lh[1]" r="5.5" />
        </g>
        <!-- Tay phải -->
        <g class="arm arm-r">
          <path class="arm-out" [attr.d]="arms().r" />
          <path class="arm-in" [attr.d]="arms().r" />
          <circle class="hand" [attr.cx]="arms().rh[0]" [attr.cy]="arms().rh[1]" r="5.5" />
        </g>

        <!-- Ăng-ten -->
        <g class="antenna">
          <line x1="60" y1="25" x2="60" y2="11" />
          <circle class="bulb" cx="60" cy="8" r="5.5" />
        </g>

        <!-- Thân viên nang -->
        <rect class="body" x="24" y="23" width="72" height="97" rx="34" />
        <circle class="bolt" cx="24" cy="54" r="4" />
        <circle class="bolt" cx="96" cy="54" r="4" />

        <!-- Màn hình mặt -->
        <rect class="screen" x="33" y="34" width="54" height="38" rx="13" />
        <path class="glare" d="M39 42 q2 -4 7 -4" />

        <g class="face">
          @switch (mood()) {
            @case ('thinking') {
              <g class="face-pop">
                <path class="stroke" d="M64 42 l10 -2" />
                <circle class="fill" cx="49" cy="50" r="3.6" />
                <circle class="fill" cx="73" cy="49" r="3.6" />
                <path class="stroke" d="M53 63 q3.5 -3 7 0 t7 0" />
              </g>
            }
            @case ('surprised') {
              <g class="face-pop">
                <circle class="fill" cx="47" cy="51" r="6.2" />
                <circle class="fill" cx="73" cy="51" r="6.2" />
                <circle class="pupil" cx="49" cy="49" r="1.8" />
                <circle class="pupil" cx="75" cy="49" r="1.8" />
                <ellipse class="stroke" cx="60" cy="64" rx="3.6" ry="4.4" />
              </g>
            }
            @case ('sad') {
              <g class="face-pop">
                <path class="stroke" d="M42 47 l10 3" />
                <path class="stroke" d="M78 47 l-10 3" />
                <circle class="fill" cx="48" cy="55" r="2.8" />
                <circle class="fill" cx="72" cy="55" r="2.8" />
                <path class="stroke" d="M52 67 q8 -6 16 0" />
                <path class="tear" d="M80 57 q3 4 0 6 q-3 -2 0 -6z" />
              </g>
            }
            @case ('celebrate') {
              <g class="face-pop">
                <path class="fill" d="M48 45 l1.9 4.1 4.4 .5 -3.3 3 1 4.4 -4 -2.3 -4 2.3 1 -4.4 -3.3 -3 4.4 -.5z" />
                <path class="fill" d="M72 45 l1.9 4.1 4.4 .5 -3.3 3 1 4.4 -4 -2.3 -4 2.3 1 -4.4 -3.3 -3 4.4 -.5z" />
                <path class="fill" d="M51 60 h18 q0 9 -9 9 q-9 0 -9 -9z" />
              </g>
            }
            @default {
              <!-- happy + wave -->
              <g class="face-pop">
                <path class="stroke" d="M42 54 q6 -8 12 0" />
                <path class="stroke" d="M66 54 q6 -8 12 0" />
                <path class="stroke" d="M52 61 q8 7 16 0" />
              </g>
            }
          }
        </g>

        <circle class="cheek" cx="35" cy="78" r="3.6" />
        <circle class="cheek" cx="85" cy="78" r="3.6" />

        <!-- Bụng có hình </> -->
        <rect class="belly" x="42" y="82" width="36" height="25" rx="9" />
        <path class="belly-icon" d="M52 89 l-5 5.5 5 5.5 M68 89 l5 5.5 -5 5.5 M63 87.5 l-6 14" />
      </g>
    </svg>
  `,
  styleUrl: './mascot.css',
})
export class Mascot {
  readonly mood = input<MascotMood>('happy');
  readonly size = input(120);
  readonly name = input('Bíp');

  protected readonly label = computed(() => `${this.name()} ${MOOD_LABEL[this.mood()]}`);

  /** Đường cong tay + toạ độ bàn tay theo từng biểu cảm */
  protected readonly arms = computed(() => {
    switch (this.mood()) {
      case 'wave':
        return { l: 'M25 80 Q14 90 13 102', lh: [13, 102], r: 'M95 78 Q110 66 108 48', rh: [108, 48] };
      case 'thinking':
        return { l: 'M25 80 Q14 90 13 102', lh: [13, 102], r: 'M95 82 Q100 96 80 82', rh: [80, 80] };
      case 'surprised':
        return { l: 'M25 80 Q11 76 6 64', lh: [6, 64], r: 'M95 80 Q109 76 114 64', rh: [114, 64] };
      case 'sad':
        return { l: 'M25 80 Q4 60 30 28', lh: [31, 28], r: 'M95 80 Q106 92 106 104', rh: [106, 104] };
      case 'celebrate':
        return { l: 'M25 78 Q12 62 13 44', lh: [13, 44], r: 'M95 78 Q108 62 107 44', rh: [107, 44] };
      default:
        return { l: 'M25 80 Q14 90 13 102', lh: [13, 102], r: 'M95 80 Q106 90 107 102', rh: [107, 102] };
    }
  });
}
