import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { LESSONS } from '../../content/lessons.registry';
import { Icon } from '../../shared/ui/icon/icon';
import { MascotSays } from '../../shared/ui/speech-bubble/speech-bubble';
import { ConceptMap } from './concept-map';

/** Trang chủ: lời chào của Bíp, bản đồ khái niệm dạng đảo và danh sách bài. */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, MascotSays, ConceptMap],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly progress = inject(ProgressStore);
  protected readonly lessons = LESSONS;
  protected readonly next = computed(() => LESSONS.find((l) => !this.progress.completed().has(l.slug)));
  protected readonly firstVisit = !this.progress.greeted();
  protected readonly greeting = computed(() =>
    this.firstVisit
      ? 'Xin chào! Mình là Bíp, robot hướng dẫn của bạn. Cùng mình đi khắp bản đồ Angular, mở nắp từng khái niệm ra xem bánh răng bên trong nhé!'
      : this.progress.completedCount()
        ? `Chào mừng trở lại! Bạn đã xong ${this.progress.completedCount()} bài rồi đó. Đi tiếp nào!`
        : 'Chào mừng trở lại! Chọn một trạm trên bản đồ để bắt đầu nhé.',
  );

  constructor() {
    if (this.firstVisit) this.progress.markGreeted();
  }
}
