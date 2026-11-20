import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/progress/progress-store';
import { CORE_LESSONS, ISLAND_BRANCHES, LESSONS, lessonBySlug } from '../../content/lessons.registry';
import { practiceBySlug } from '../../content/practice.registry';
import { PracticeProgress } from '../../core/progress/practice-progress';
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
const PRACTICE_DX = 30; // module luyện tập: rẽ nhánh ngắn sang phải, ngay dưới bài của nó
const PRACTICE_GAP = 40;

interface Point {
  lesson: LessonMeta;
  x: number;
  y: number;
  branch: string | null; // tên đảo phụ, null nếu là đường chính
}
interface PracticePoint {
  slug: string;
  title: string;
  count: number;
  x: number;
  y: number;
  road: string;
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
 * Bài nào có module luyện tập thì có thêm một nhánh ngắn "Luyện tập" ngay bên dưới.
 */
function layout() {
  const points: Point[] = [];
  const branches: BranchDraw[] = [];
  const practices: PracticePoint[] = [];
  /** thêm nhánh luyện tập dưới bài ở (x, y) nếu có; trả về y thấp nhất đã dùng */
  const addPractice = (lesson: LessonMeta, x: number, y: number) => {
    const p = practiceBySlug(lesson.slug);
    if (!p) return y;
    const px = x + PRACTICE_DX, py = y + PRACTICE_GAP;
    practices.push({ slug: p.slug, title: lesson.title, count: p.count, x: px, y: py, road: `M${x} ${y + 12} C${x} ${y + 28}, ${px} ${y + 20}, ${px} ${py - 11}` });
    return py;
  };
  let y = TOP;
  let lastCoreY = TOP;
  CORE_LESSONS.forEach((lesson) => {
    const x = MAIN_X;
    points.push({ lesson, x, y, branch: null });
    lastCoreY = y;
    const base = addPractice(lesson, x, y);

    const br = ISLAND_BRANCHES.find((b) => b.after === lesson.slug);
    if (br) {
      let yy = base + FORK_GAP;
      let last = yy;
      br.lessons.forEach((slug) => {
        const l = lessonBySlug(slug)!;
        points.push({ lesson: l, x: BRANCH_X, y: yy, branch: br.island });
        last = yy;
        yy = addPractice(l, BRANCH_X, yy) + BRANCH_STEP;
      });
      branches.push({
        island: br.island,
        requires: br.requires,
        road: `M${x} ${base + 12} C${x} ${base + 30}, ${BRANCH_X} ${base + 26}, ${BRANCH_X} ${base + 44} L${BRANCH_X} ${last}`,
        sign: { x: BRANCH_X + 16, y: base + 32 },
      });
      y = yy - BRANCH_STEP + AFTER_BRANCH;
    } else {
      y = base + STEP;
    }
  });
  const main = `M${MAIN_X} ${TOP} L${MAIN_X} ${lastCoreY}`;
  const bottom = Math.max(lastCoreY, ...points.map((p) => p.y), ...practices.map((p) => p.y));
  return { points, branches, practices, main, height: bottom + TOP + 6 };
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
  readonly currentPractice = input<string | null>(null);
  readonly navigate = output<void>();

  protected readonly progress = inject(ProgressStore);
  protected readonly practiceProgress = inject(PracticeProgress);
  protected readonly lessons = LESSONS;
  protected readonly W = W;
  protected readonly w = W;
  protected readonly map = layout();

  protected readonly branchState = computed(() => {
    const done = this.progress.completed();
    return this.map.branches.map((b) => ({ ...b, open: b.requires.every((s) => done.has(s)) }));
  });

  protected readonly current = computed(
    () => this.map.points.find((p) => p.lesson.slug === this.currentSlug()) ?? this.map.practices.find((p) => p.slug === this.currentPractice()) ?? null,
  );
}
