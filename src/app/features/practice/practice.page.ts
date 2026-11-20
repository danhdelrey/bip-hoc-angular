import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lessonBySlug, nextLesson } from '../../content/lessons.registry';
import { practiceBySlug } from '../../content/practice.registry';
import { CodeLab } from '../../shared/lab/code-lab';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';

/**
 * Module luyện tập của một bài (#/luyen-tap/<slug>): trang riêng, rẽ nhánh từ bài học trên lộ trình.
 * Nội dung bài luyện được tải lười từ practice.registry.
 */
@Component({
  selector: 'app-practice-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeLab, RouterLink, Icon, Mascot],
  template: `
    @if (practice(); as p) {
      <nav class="crumbs" aria-label="Điều hướng">
        <a [routerLink]="['/bai', p.slug]"><app-icon name="arrowLeft" [size]="16" /> Bài {{ lesson()?.number }} · {{ lesson()?.title }}</a>
        <span class="chip chip-di"><app-icon name="flask" [size]="14" /> Module luyện tập</span>
      </nav>
      @for (key of [p.slug]; track key) {
        <app-code-lab [load]="p.load" [storageKey]="p.storageKey" [slug]="p.slug" />
      }
      <footer class="foot">
        <a class="btn" [routerLink]="['/bai', p.slug]"><app-icon name="arrowLeft" [size]="18" /> Xem lại lý thuyết</a>
        @if (next(); as n) {
          <a class="btn btn-primary" [routerLink]="['/bai', n.slug]">Bài tiếp: {{ n.title }} <app-icon name="arrowRight" [size]="18" /></a>
        }
      </footer>
    } @else {
      <div class="missing toon">
        <app-mascot mood="sad" [size]="80" />
        <p>Bài này chưa có module luyện tập.</p>
        <a class="btn btn-primary" routerLink="/">Về trang chủ</a>
      </div>
    }
  `,
  styles: `
    :host { display: block; max-width: var(--content-max); margin: 0 auto; padding: 22px 28px 80px; }
    .crumbs { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
    .crumbs a { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--c-primary-text); text-decoration: none; }
    .crumbs a:hover { text-decoration: underline; }
    .foot { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .missing { display: grid; justify-items: center; gap: 12px; padding: 40px; text-align: center; }
  `,
})
export class PracticePage {
  /** :slug của route (withComponentInputBinding) */
  readonly slug = input('');
  protected readonly practice = computed(() => practiceBySlug(this.slug()));
  protected readonly lesson = computed(() => lessonBySlug(this.slug()));
  protected readonly next = computed(() => nextLesson(this.slug()));
}
