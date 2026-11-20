import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lessonBySlug } from '../../content/lessons.registry';
import { practiceBySlug } from '../../content/practice.registry';
import { PracticeProgress } from '../../core/progress/practice-progress';
import { Icon } from '../ui/icon/icon';

/** Thẻ ở cuối trang bài học, dẫn sang module luyện tập riêng của bài (#/luyen-tap/<slug>). */
@Component({
  selector: 'app-practice-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    @if (practice(); as p) {
      <section class="cta toon toon-lg" [attr.aria-labelledby]="'cta-' + p.slug">
        <span class="ic" aria-hidden="true"><app-icon name="flask" [size]="28" /></span>
        <div class="body">
          <p class="eyebrow">Module luyện tập · rẽ nhánh từ bài này</p>
          <h2 [id]="'cta-' + p.slug">Luyện tập: {{ title() }}</h2>
          <p class="desc">{{ p.count }} bài viết code thật, chạy ngay trong trình duyệt và được chấm tự động.</p>
          <div class="prog" role="img" [attr.aria-label]="'Đã làm ' + done() + ' trên ' + p.count + ' bài'">
            <span class="bar"><i [style.width.%]="(100 * done()) / p.count"></i></span>
            <span>{{ done() }}/{{ p.count }} bài</span>
          </div>
        </div>
        <a class="btn btn-primary go" [routerLink]="['/luyen-tap', p.slug]">
          {{ done() ? 'Làm tiếp' : 'Vào luyện tập' }} <app-icon name="arrowRight" [size]="18" />
        </a>
      </section>
    }
  `,
  styles: `
    :host { display: block; }
    .cta { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; margin: 0 0 44px; padding: 20px 22px; border-left: 5px solid var(--c-di); }
    .ic { display: grid; place-items: center; width: 56px; height: 56px; flex: none; border-radius: var(--radius); background: color-mix(in srgb, var(--c-di) 22%, var(--surface)); color: var(--c-di-strong); }
    .body { flex: 1; min-width: 220px; }
    .eyebrow { margin: 0 0 2px; }
    h2 { margin: 0 0 4px; font-size: var(--fs-lg); }
    .desc { margin: 0 0 8px; color: var(--text-muted); }
    .prog { display: flex; align-items: center; gap: 10px; font-size: var(--fs-sm); font-weight: 600; color: var(--text-muted); }
    .bar { display: block; width: 140px; height: 8px; border-radius: var(--radius-pill); background: var(--surface-sunken); overflow: hidden; }
    .bar i { display: block; height: 100%; background: var(--c-di); }
    .go { flex: none; }
  `,
})
export class PracticeCta {
  readonly slug = input.required<string>();
  private readonly progress = inject(PracticeProgress);
  protected readonly practice = computed(() => practiceBySlug(this.slug()));
  protected readonly title = computed(() => lessonBySlug(this.slug())?.title ?? '');
  protected readonly done = computed(() => this.progress.done(this.slug()));
}
