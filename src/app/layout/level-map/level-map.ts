import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { ADVANCED_LESSONS, CORE_LESSONS, LESSONS } from '../../content/lessons.registry';
import type { LessonMeta } from '../../content/lesson.model';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';

const STEP_Y = 78;
const TOP = 46;
const XS = [30, 66, 98, 66];

/** Thanh tiến độ dạng bản đồ màn chơi: con đường uốn lượn với các trạm dừng (mỗi bài một trạm). */
@Component({
  selector: 'app-level-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Mascot],
  templateUrl: './level-map.html',
  styleUrl: './level-map.css',
})
export class LevelMap {
  readonly currentSlug = input<string | null>(null);
  readonly navigate = output<void>();

  protected readonly progress = inject(ProgressStore);
  protected readonly lessons = LESSONS;

  /** Hai đoạn đường: lộ trình chính và đảo phụ nâng cao */
  protected readonly sections = [
    { id: 'core', title: 'Lộ trình chính', ...this.build(CORE_LESSONS) },
    { id: 'advanced', title: 'Đảo phụ nâng cao', ...this.build(ADVANCED_LESSONS) },
  ];

  private build(list: readonly LessonMeta[]) {
    const height = TOP * 2 + STEP_Y * (list.length - 1);
    const points = list.map((l, i) => ({ lesson: l, x: XS[i % XS.length], y: TOP + i * STEP_Y, labelLeft: false }));
    let d = `M${points[0].x} ${points[0].y - 30}  L${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    d += ` L${points[points.length - 1].x} ${points[points.length - 1].y + 30}`;
    return { height, points, road: d };
  }

  protected readonly current = computed(() => {
    for (const sec of this.sections) {
      const p = sec.points.find((x) => x.lesson.slug === this.currentSlug());
      if (p) return { ...p, section: sec.id };
    }
    return null;
  });
}
