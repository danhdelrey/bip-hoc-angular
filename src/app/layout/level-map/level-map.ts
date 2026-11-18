import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { LESSONS } from '../../content/lessons.registry';
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
  protected readonly height = TOP * 2 + STEP_Y * (LESSONS.length - 1);

  protected readonly points = LESSONS.map((l, i) => ({
    lesson: l,
    x: XS[i % XS.length],
    y: TOP + i * STEP_Y,
    labelLeft: false,
  }));

  /** Đường cong mượt đi qua các trạm */
  protected readonly road = (() => {
    const p = this.points;
    let d = `M${p[0].x} ${p[0].y - 30}  L${p[0].x} ${p[0].y}`;
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1];
      const b = p[i];
      const my = (a.y + b.y) / 2;
      d += ` C${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d + ` L${p[p.length - 1].x} ${p[p.length - 1].y + 30}`;
  })();

  protected readonly current = computed(() => this.points.find((p) => p.lesson.slug === this.currentSlug()));
}
