import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ProgressStore } from '../../core/progress/progress-store';
import { Sound } from '../../core/sound/sound';
import { Theme } from '../../core/theme/theme';
import { BADGES } from '../../content/badges';
import { Badge } from '../../shared/ui/badge/badge';
import { Confetti } from '../../shared/ui/confetti/confetti';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';
import { ColorLegend } from '../color-legend/color-legend';
import { LevelMap } from '../level-map/level-map';
import { Toasts } from '../toasts/toasts';
import { GrandFinale } from '../grand-finale/grand-finale';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Mascot, Badge, LevelMap, ColorLegend, Toasts, Confetti, GrandFinale],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  protected readonly theme = inject(Theme);
  protected readonly sound = inject(Sound);
  protected readonly progress = inject(ProgressStore);
  private readonly router = inject(Router);

  protected readonly badges = BADGES;
  protected readonly drawerOpen = signal(false);
  protected readonly badgesOpen = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly currentSlug = computed(() => /\/bai\/([\w-]+)/.exec(this.url())?.[1] ?? null);
  protected readonly currentPractice = computed(() => /\/luyen-tap\/([\w-]+)/.exec(this.url())?.[1] ?? null);

  constructor() {
    // Chỉ cuộn lên đầu khi đổi trang/bài, không phải khi đổi route con bên trong một bài
    let lastKey = '';
    effect(() => {
      const key = this.url().split(/[?#]/)[0].split('/').slice(0, 3).join('/');
      untracked(() => {
        if (key !== lastKey && lastKey) globalThis.scrollTo?.({ top: 0 });
        lastKey = key;
      });
    });
  }
}
