import type { LabModule } from '../shared/lab/lab-model';

/**
 * Các module luyện tập (Code Lab). Mỗi module là một trang riêng (#/luyen-tap/<slug>)
 * rẽ nhánh từ bài học cùng slug trên lộ trình ở sidebar.
 * Thêm module: viết features/lessons/<slug>/<slug>.lab.ts rồi thêm một dòng ở đây
 * (`count` = số bài có chấm, được unit test đối chiếu với file .lab.ts).
 */
export interface PracticeMeta {
  slug: string;
  count: number;
  storageKey: string;
  load: () => Promise<LabModule>;
}

export const PRACTICES: readonly PracticeMeta[] = [
  { slug: 'component', count: 6, storageKey: 'bip-lab.component', load: () => import('../features/lessons/component/component.lab').then((m) => m.LAB) },
  { slug: 'data-binding', count: 7, storageKey: 'bip-lab.data-binding', load: () => import('../features/lessons/data-binding/data-binding.lab').then((m) => m.LAB) },
  { slug: 'input-output', count: 7, storageKey: 'bip-lab.input-output', load: () => import('../features/lessons/input-output/input-output.lab').then((m) => m.LAB) },
  { slug: 'lifecycle', count: 6, storageKey: 'bip-lab.lifecycle', load: () => import('../features/lessons/lifecycle/lifecycle.lab').then((m) => m.LAB) },
  { slug: 'control-flow', count: 7, storageKey: 'bip-lab.control-flow', load: () => import('../features/lessons/control-flow/control-flow.lab').then((m) => m.LAB) },
  { slug: 'pipes', count: 6, storageKey: 'bip-lab.pipes', load: () => import('../features/lessons/pipes/pipes.lab').then((m) => m.LAB) },
  { slug: 'dependency-injection', count: 6, storageKey: 'bip-lab.dependency-injection', load: () => import('../features/lessons/dependency-injection/dependency-injection.lab').then((m) => m.LAB) },
  { slug: 'signals', count: 6, storageKey: 'bip-lab.signals', load: () => import('../features/lessons/signals/signals.lab').then((m) => m.LAB) },
  { slug: 'change-detection', count: 5, storageKey: 'bip-lab.change-detection', load: () => import('../features/lessons/change-detection/change-detection.lab').then((m) => m.LAB) },
  { slug: 'routing', count: 6, storageKey: 'bip-lab.routing', load: () => import('../features/lessons/routing/routing.lab').then((m) => m.LAB) },
  { slug: 'forms', count: 6, storageKey: 'bip-lab.forms', load: () => import('../features/lessons/forms/forms.lab').then((m) => m.LAB) },
  { slug: 'http', count: 6, storageKey: 'bip-lab.http', load: () => import('../features/lessons/http/http.lab').then((m) => m.LAB) },
  { slug: 'defer', count: 5, storageKey: 'bip-lab.defer', load: () => import('../features/lessons/defer/defer.lab').then((m) => m.LAB) },
  { slug: 'tailwind', count: 5, storageKey: 'bip-lab.tailwind', load: () => import('../features/lessons/tailwind/tailwind.lab').then((m) => m.LAB) },
  { slug: 'content-projection', count: 6, storageKey: 'bip-lab.content-projection', load: () => import('../features/lessons/content-projection/content-projection.lab').then((m) => m.LAB) },
  { slug: 'dynamic-components', count: 6, storageKey: 'bip-lab.dynamic-components', load: () => import('../features/lessons/dynamic-components/dynamic-components.lab').then((m) => m.LAB) },
  { slug: 'accessibility', count: 6, storageKey: 'bip-lab.accessibility', load: () => import('../features/lessons/accessibility/accessibility.lab').then((m) => m.LAB) },
  { slug: 'di-advanced', count: 6, storageKey: 'bip-lab.di-advanced', load: () => import('../features/lessons/di-advanced/di-advanced.lab').then((m) => m.LAB) },
  { slug: 'rxjs-subjects', count: 5, storageKey: 'bip-lab.rxjs-subjects', load: () => import('../features/lessons/rxjs-subjects/rxjs-subjects.lab').then((m) => m.LAB) },
  { slug: 'rxjs-flattening', count: 6, storageKey: 'bip-lab.rxjs-flattening', load: () => import('../features/lessons/rxjs-flattening/rxjs-flattening.lab').then((m) => m.LAB) },
  // giữ khoá cũ để không mất tiến độ của lab RxJS đã phát hành
  { slug: 'rxjs', count: 20, storageKey: 'bip-rxjs-lab', load: () => import('../features/lessons/rxjs/rxjs.lab').then((m) => m.LAB) },
];

export const practiceBySlug = (slug: string | null | undefined) => PRACTICES.find((p) => p.slug === slug);
