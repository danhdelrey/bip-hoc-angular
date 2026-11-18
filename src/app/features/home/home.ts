import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { LESSONS } from '../../content/lessons.registry';
import { Icon } from '../../shared/ui/icon/icon';
import { MascotSays } from '../../shared/ui/speech-bubble/speech-bubble';

/**
 * Trang chủ (bản Giai đoạn 1): lời chào của Bíp + lưới lộ trình.
 * Giai đoạn 2 sẽ thay bằng bản đồ khái niệm dạng đảo.
 */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, MascotSays],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly progress = inject(ProgressStore);
  protected readonly lessons = LESSONS;
  protected readonly firstVisit = !this.progress.greeted();
  protected readonly greeting = computed(() =>
    this.firstVisit
      ? 'Xin chào! Mình là Bíp, robot hướng dẫn của bạn. Mình sẽ mở nắp Angular ra cho bạn xem từng bánh răng bên trong!'
      : this.progress.completedCount()
        ? `Chào mừng trở lại! Bạn đã xong ${this.progress.completedCount()} bài rồi đó. Đi tiếp nào!`
        : 'Chào mừng trở lại! Chọn một trạm trên bản đồ để bắt đầu nhé.',
  );

  constructor() {
    if (this.firstVisit) this.progress.markGreeted();
  }
}
