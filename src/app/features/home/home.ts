import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { ADVANCED_LESSONS, CORE_LESSONS, LESSONS } from '../../content/lessons.registry';
import { Icon } from '../../shared/ui/icon/icon';
import { MascotSays } from '../../shared/ui/speech-bubble/speech-bubble';

/** Trang chủ: lời chào của Bíp và danh sách bài (lộ trình chính + nhánh nâng cao). */
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
  protected readonly sections = [
    { title: 'Lộ trình chính', icon: 'star', list: CORE_LESSONS, note: '' },
    { title: 'Nhánh nâng cao', icon: 'bridge', list: ADVANCED_LESSONS, note: 'Mỗi nhánh rẽ ra ngay sau bài nền tảng của nó (xem lộ trình ở sidebar). Nhánh sáng lên khi bạn học xong các bài tiên quyết, nhưng muốn ghé trước cũng được.' },
  ];
  protected readonly next = computed(() => LESSONS.find((l) => !this.progress.completed().has(l.slug)));
  protected readonly firstVisit = !this.progress.greeted();
  protected readonly greeting = computed(() =>
    this.firstVisit
      ? 'Xin chào! Mình là Bíp, robot hướng dẫn của bạn. Cùng mình đi hết lộ trình Angular, mở nắp từng khái niệm ra xem bánh răng bên trong nhé!'
      : this.progress.completedCount()
        ? `Chào mừng trở lại! Bạn đã xong ${this.progress.completedCount()} bài rồi đó. Đi tiếp nào!`
        : 'Chào mừng trở lại! Chọn một bài ở lộ trình bên trái hoặc danh sách bên dưới để học tiếp nhé.',
  );

  constructor() {
    if (this.firstVisit) this.progress.markGreeted();
  }
}
