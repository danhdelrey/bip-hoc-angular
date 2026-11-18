import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LESSONS, lessonBySlug } from '../../content/lessons.registry';
import { Icon } from '../../shared/ui/icon/icon';
import { MascotSays } from '../../shared/ui/speech-bubble/speech-bubble';

@Component({
  selector: 'app-coming-soon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MascotSays, Icon],
  template: `
    <div class="box toon toon-lg">
      @if (lesson(); as l) {
        <p class="eyebrow">Bài {{ l.number }} · {{ l.tagline }}</p>
        <h1>{{ l.title }}</h1>
        <app-mascot-says mood="thinking" [size]="120">
          Trạm này đang được xây! Bíp đang vẽ visualizer "{{ l.tagline }}". Trong lúc chờ, thử một bài đã mở nhé.
        </app-mascot-says>
      } @else {
        <app-mascot-says mood="surprised" [size]="120">Ơ, không có bài nào tên như vậy.</app-mascot-says>
      }
      <div class="links">
        @for (a of available; track a.slug) {
          <a class="btn btn-primary" [routerLink]="['/bai', a.slug]"><app-icon [name]="a.icon" /> {{ a.title }}</a>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; max-width: 820px; margin: 0 auto; padding: 40px 24px; }
    .box { padding: 30px; }
    h1 { font-size: var(--fs-3xl); }
    .links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
  `,
})
export class ComingSoon {
  readonly slug = input('');
  protected readonly lesson = computed(() => lessonBySlug(this.slug()));
  protected readonly available = LESSONS.filter((l) => l.available);
}
