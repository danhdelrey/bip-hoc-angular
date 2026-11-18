import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { CORE_LESSONS, ISLAND_BRANCHES, LESSONS, lessonBySlug } from '../../content/lessons.registry';
import type { LessonMeta } from '../../content/lesson.model';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';

const W = 244;
const TOP = 22;
const STEP = 50; // khoảng cách giữa hai bài liên tiếp trên trục chính
const MAIN_X = 18; // trục chính: đường thẳng sát trái
const BRANCH_X = 48; // nhánh nâng cao: thụt vào một bậc
const FORK_GAP = 62; // từ ngã rẽ tới bài nâng cao đầu tiên (chừa chỗ cho tên nhánh)
const BRANCH_STEP = 44;
const AFTER_BRANCH = 52; // từ bài nâng cao cuối tới bài chính tiếp theo

interface Point {
  lesson: LessonMeta;
  x: number;
  y: number;
  branch: string | null; // tên đảo phụ, null nếu là đường chính
}
interface BranchDraw {
  island: string;
  requires: string[];
  road: string;
  sign: { x: number; y: number };
}

/**
 * Lộ trình ở sidebar (dạng timeline): trục chính đi qua 15 bài theo thứ tự,
 * ngay sau bài nền tảng của mỗi đảo phụ có một nhánh rẽ phải sang các bài nâng cao.
 */
function layout() {
  const points: Point[] = [];
  const branches: BranchDraw[] = [];
  let y = TOP;
  CORE_LESSONS.forEach((lesson) => {
    const x = MAIN_X;
    const p: Point = { lesson, x, y, branch: null };
    points.push(p);

    const br = ISLAND_BRANCHES.find((b) => b.after === lesson.slug);
    if (br) {
      const y1 = y + FORK_GAP;
      const ys = br.lessons.map((_, k) => y1 + k * BRANCH_STEP);
      br.lessons.forEach((slug, k) => points.push({ lesson: lessonBySlug(slug)!, x: BRANCH_X, y: ys[k], branch: br.island }));
      const last = ys[ys.length - 1];
      branches.push({
        island: br.island,
        requires: br.requires,
        road: `M${x} ${y + 12} C${x} ${y + 30}, ${BRANCH_X} ${y + 26}, ${BRANCH_X} ${y + 44} L${BRANCH_X} ${last}`,
        sign: { x: BRANCH_X + 16, y: y + 32 },
      });
      y = last + AFTER_BRANCH;
    } else {
      y += STEP;
    }
  });
  const end = y - STEP;
  const main = `M${MAIN_X} ${TOP} L${MAIN_X} ${end}`;
  return { points, branches, main, height: end + TOP + 6 };
}

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
  protected readonly W = W;
  protected readonly w = W;
  protected readonly map = layout();

  protected readonly branchState = computed(() => {
    const done = this.progress.completed();
    return this.map.branches.map((b) => ({ ...b, open: b.requires.every((s) => done.has(s)) }));
  });

  protected readonly current = computed(() => this.map.points.find((p) => p.lesson.slug === this.currentSlug()) ?? null);
}
