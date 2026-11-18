import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Feedback } from '../../core/feedback/feedback';
import { Theme } from '../../core/theme/theme';
import { BADGES } from '../../content/badges';
import { SEMANTICS } from '../../layout/color-legend/color-legend';
import { Badge } from '../../shared/ui/badge/badge';
import { CodePanel } from '../../shared/ui/code-panel/code-panel';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot, type MascotMood } from '../../shared/ui/mascot/mascot';
import { AnimatedArrow, RoughShape } from '../../shared/ui/rough/rough';
import { MascotSays, SpeechBubble } from '../../shared/ui/speech-bubble/speech-bubble';
import { StepPlayer } from '../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../shared/ui/step-player/step-timeline';

interface BallFrame {
  x: number;
  y: number;
  land: boolean;
}

/** Trang demo phong cách: để duyệt design tokens, linh vật, nút, card, bong bóng, sơ đồ. */
@Component({
  selector: 'app-style-guide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Mascot, MascotSays, SpeechBubble, Icon, Badge, RoughShape, AnimatedArrow, StepPlayer, CodePanel],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.css',
})
export class StyleGuide {
  protected readonly theme = inject(Theme);
  private readonly feedback = inject(Feedback);

  protected readonly moods: { mood: MascotMood; label: string }[] = [
    { mood: 'happy', label: 'Vui' },
    { mood: 'thinking', label: 'Suy nghĩ' },
    { mood: 'surprised', label: 'Ngạc nhiên' },
    { mood: 'sad', label: 'Buồn (gãi đầu)' },
    { mood: 'celebrate', label: 'Ăn mừng' },
    { mood: 'wave', label: 'Vẫy chào' },
  ];
  protected readonly semantics = SEMANTICS;
  protected readonly badges = BADGES;
  protected readonly palette = [
    ['--pal-ink', 'Chữ chính'], ['--pal-cream', 'Nền sáng'], ['--pal-mint', 'Mint'], ['--pal-orange', 'Cam'],
    ['--pal-lavender', 'Lavender'], ['--pal-lemon', 'Vàng chanh'], ['--pal-red', 'Đỏ san hô'], ['--pal-sky', 'Xanh trời'],
    ['--pal-coral', 'Hồng'], ['--pal-navy', 'Navy (tối)'],
  ];
  protected readonly drawKey = signal(0);

  /** Demo step-player: viên bi rơi và bẹp khi chạm đất (squash & stretch) */
  protected readonly ball = createTimeline<BallFrame>({ x: 40, y: 30, land: false });

  protected readonly sample = [
    {
      name: 'hello.ts',
      lang: 'angular-ts' as const,
      code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: \`<button (click)="count.update(n => n + 1)">
    Bíp đã được bấm {{ count() }} lần
  </button>\`,
})
export class Hello {
  count = signal(0);
}`,
    },
  ];

  constructor() {
    this.dropBall();
  }

  protected dropBall(): void {
    const steps: Step<BallFrame>[] = [
      { frame: { x: 40, y: 30, land: false }, caption: 'Viên bi dữ liệu đứng trên mép bàn.', duration: 600 },
      { frame: { x: 160, y: 150, land: true }, caption: 'Rơi xuống và BẸP khi chạm đất (squash)…', duration: 700, sound: 'pop' },
      { frame: { x: 280, y: 60, land: false }, caption: '…rồi giãn ra khi bật lên (stretch).', duration: 700 },
      { frame: { x: 400, y: 150, land: true }, caption: 'Chạm đất lần nữa, bẹp nhẹ hơn.', duration: 700, sound: 'pop' },
      { frame: { x: 480, y: 150, land: false }, caption: 'Lăn tới đích. Bấm ⏮ ⏭ để xem từng bước!', duration: 600 },
    ];
    this.ball.load(steps, false);
  }

  protected redraw(): void {
    this.drawKey.update((k) => k + 1);
  }

  protected party(): void {
    this.feedback.toast('Đây là toast có Bíp! Pháo giấy bay nè!', 'celebrate');
    this.feedback.celebrate('small');
  }
}
