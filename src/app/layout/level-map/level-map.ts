import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { CORE_LESSONS, ISLAND_BRANCHES, LESSONS, lessonBySlug } from '../../content/lessons.registry';
import type { LessonMeta } from '../../content/lesson.model';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';

const W = 244;
const TOP = 40;
const STEP = 70; // khoảng cách giữa hai bài liên tiếp trên đường chính
const MAIN_XS = [36, 60, 80, 60]; // đường chính uốn nhẹ bên trái
const BRANCH_X = 206; // cột đảo phụ sát mép phải
const FORK_GAP = 92; // từ ngã rẽ tới bài nâng cao đầu tiên
const BRANCH_STEP = 64;
const AFTER_BRANCH = 70; // từ bài nâng cao cuối tới bài chính tiếp theo

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
 * Bản đồ màn chơi ở sidebar: đường chính đi qua 15 bài theo thứ tự,
 * sau bài cuối của mỗi đảo có một nhánh rẽ phải sang hai bài nâng cao.
 */
function layout() {
  const points: Point[] = [];
  const branches: BranchDraw[] = [];
  let y = TOP;
  let main = `M${MAIN_XS[0]} ${y - 30} L${MAIN_XS[0]} ${y}`;
  let prev: Point | null = null;
  let afterBranch = false;
  CORE_LESSONS.forEach((lesson, i) => {
    const x = afterBranch ? MAIN_XS[0] : MAIN_XS[i % MAIN_XS.length];
    const p: Point = { lesson, x, y, branch: null };
    if (prev) {
      const my = (prev.y + y) / 2;
      main += ` C${prev.x} ${my}, ${x} ${my}, ${x} ${y}`;
    }
    points.push(p);
    prev = p;
    afterBranch = false;

    const br = ISLAND_BRANCHES.find((b) => b.after === lesson.slug);
    if (br) {
      const y1 = y + FORK_GAP;
      const ys = br.lessons.map((_, k) => y1 + k * BRANCH_STEP);
      br.lessons.forEach((slug, k) => points.push({ lesson: lessonBySlug(slug)!, x: BRANCH_X, y: ys[k], branch: br.island }));
      const last = ys[ys.length - 1];
      branches.push({
        island: br.island,
        requires: br.requires,
        road: `M${x} ${y} C${x} ${y + 46}, ${BRANCH_X} ${y1 - 52}, ${BRANCH_X} ${y1} L${BRANCH_X} ${last + 22}`,
        sign: { x: x + 78, y: y + 30 },
      });
      y = last + AFTER_BRANCH;
      afterBranch = true;
    } else {
      y += STEP;
    }
  });
  const end = y - STEP;
  main += ` L${prev!.x} ${end + 30}`;
  return { points, branches, main, height: end + TOP };
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
  protected readonly map = layout();

  protected readonly branchState = computed(() => {
    const done = this.progress.completed();
    return this.map.branches.map((b) => ({ ...b, open: b.requires.every((s) => done.has(s)) }));
  });

  protected readonly current = computed(() => this.map.points.find((p) => p.lesson.slug === this.currentSlug()) ?? null);
}
