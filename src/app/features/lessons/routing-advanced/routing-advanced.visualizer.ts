import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Scenario = 'open' | 'tab' | 'leave';
type Stage = 'start' | 'recognize' | 'guard' | 'resolve' | 'activate' | 'end' | 'cancel';
const STAGES: { id: Stage; label: string; anchor: string }[] = [
  { id: 'start', label: 'NavigationStart', anchor: 'navigate' },
  { id: 'recognize', label: 'Recognize', anchor: 'recognize' },
  { id: 'guard', label: 'Guards', anchor: 'guard' },
  { id: 'resolve', label: 'Resolve', anchor: 'resolve' },
  { id: 'activate', label: 'Activate', anchor: 'activate' },
  { id: 'end', label: 'NavigationEnd', anchor: 'activate' },
];

interface Screen {
  page: 'list' | 'detail' | 'edit';
  child: 'mo-ta' | 'danh-gia' | null;
  data: 'none' | 'loading' | 'ready';
  dirty: boolean;
}
interface Frame {
  stage: Stage | null;
  url: string;
  params: [string, string][];
  screen: Screen;
  prompt: boolean;
}

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: 'open', label: 'Mở sản phẩm 3 (tab đánh giá) từ danh sách' },
  { id: 'tab', label: 'Đổi tab sang Mô tả (route con)' },
  { id: 'leave', label: 'Rời trang Sửa khi chưa lưu' },
];

@Component({
  selector: 'app-routing-advanced-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="top">
      <div class="group" role="group" aria-label="Tình huống">
        @for (s of scenarios; track s.id) {
          <button type="button" class="chip" [class.chip-event]="scenario() === s.id" [class.chip-plain]="scenario() !== s.id" (click)="scenario.set(s.id); run()">{{ s.label }}</button>
        }
      </div>
      <div class="group opts">
        <label appAnchor="resolve"><input type="checkbox" [checked]="useResolver()" (change)="useResolver.set(!useResolver())" /> resolve: productResolver</label>
        <label appAnchor="guard"><input type="checkbox" [checked]="useGuard()" (change)="useGuard.set(!useGuard())" /> canDeactivate: unsavedChangesGuard</label>
        <button type="button" class="btn btn-sm btn-primary" (click)="run()"><app-icon name="play" [size]="14" /> Điều hướng</button>
      </div>
    </div>

    <ol class="pipe" aria-label="Các giai đoạn điều hướng">
      @for (s of stages; track s.id; let i = $index) {
        <li [class.cur]="f.stage === s.id" [class.past]="passed(f.stage, s.id)" [class.cancel]="f.stage === 'cancel' && s.id === 'guard'" [appAnchor]="s.anchor">{{ s.label }}</li>
      }
    </ol>

    <div class="stage">
      <div class="left">
        <div class="urlbar" appAnchor="params"><app-icon name="link" [size]="14" /> <code>{{ f.url }}</code></div>
        @if (f.params.length) {
          <table class="params" aria-label="Tham số đã tách">
            @for (p of f.params; track p[0]) { <tr><th>{{ p[0] }}</th><td><code>{{ p[1] }}</code></td></tr> }
          </table>
        }
        @if (f.stage === 'cancel') {
          <p class="cancel-msg"><app-icon name="error" [size]="16" /> NavigationCancel — URL và trang giữ nguyên</p>
        }
      </div>

      <div class="screen" aria-label="Màn hình ứng dụng">
        <div class="outlet o1" appAnchor="activate">
          <span class="tag">&lt;router-outlet&gt;</span>
          @switch (f.screen.page) {
            @case ('list') { <p class="pg">CatalogList: Áo mưa · Ô gấp · Ủng</p> }
            @case ('edit') {
              <p class="pg">ProductEdit — Tên: "Ủng đi mưa<b>!!!</b>" @if (f.screen.dirty) { <span class="dirty">● chưa lưu</span> }</p>
              @if (f.prompt) { <p class="ask">Có thay đổi chưa lưu. Rời trang? [Rời đi] [<b>Ở lại</b>]</p> }
            }
            @case ('detail') {
              @if (f.screen.data === 'ready') {
                <p class="pg">ProductDetail: <b>Ủng đi mưa</b> · 259.000đ</p>
              } @else if (f.screen.data === 'loading') {
                <p class="pg loading">ProductDetail: đang tải… (trang trống)</p>
              } @else {
                <p class="pg">ProductDetail</p>
              }
              <div class="outlet o2" appAnchor="nested">
                <span class="tag">&lt;router-outlet&gt; con</span>
                @if (f.screen.child === 'danh-gia') { <p class="pg">ProductReviews: Chưa có đánh giá</p> }
                @if (f.screen.child === 'mo-ta') { <p class="pg">ProductInfo: Giá 259.000đ</p> }
              </div>
            }
          }
        </div>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .top { display: grid; gap: 10px; padding: 16px 22px 6px; }
    .group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .group .chip { cursor: pointer; }
    .opts { gap: 8px 16px; font-size: var(--fs-sm); font-weight: 500; }
    .opts label { display: flex; gap: 6px; align-items: center; cursor: pointer; padding: 2px 6px; border-radius: 6px; font-family: var(--font-mono); font-size: 12.5px; }
    .opts label.is-hl { background: color-mix(in srgb, var(--c-signal) 30%, transparent); }
    .pipe { display: flex; flex-wrap: wrap; gap: 0; margin: 8px 22px; padding: 0; list-style: none; }
    .pipe li { position: relative; flex: 1 1 110px; padding: 7px 10px 7px 18px; font-size: 12px; font-weight: 600; text-align: center; color: var(--text-muted); background: var(--surface-sunken); clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%); transition: background-color var(--dur); }
    .pipe li:first-child { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%); padding-left: 10px; }
    .pipe li.past { background: color-mix(in srgb, var(--c-data) 30%, var(--surface)); color: var(--text); }
    .pipe li.cur { background: var(--c-primary); color: var(--on-primary); }
    .pipe li.cancel { background: var(--c-error); color: var(--on-accent); }
    .pipe li.is-hl { outline: 2px solid var(--c-signal-strong); outline-offset: -2px; }
    .stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 16px; padding: 6px 22px 12px; }
    .left { display: grid; gap: 10px; align-content: start; }
    .urlbar { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border: var(--border); border-radius: var(--radius-pill); background: var(--surface); overflow-wrap: anywhere; }
    .urlbar code { border: 0; background: none; padding: 0; }
    .urlbar.is-hl { outline: 2px solid var(--c-signal-strong); }
    .params { border-collapse: collapse; font-size: var(--fs-sm); }
    .params th, .params td { padding: 4px 10px; border: 1px solid var(--line); text-align: left; }
    .params th { font-weight: 600; background: var(--surface-sunken); }
    .cancel-msg { display: flex; gap: 6px; align-items: center; margin: 0; padding: 8px 10px; border-radius: var(--radius-sm); background: color-mix(in srgb, var(--c-error) 15%, var(--surface)); color: var(--c-error-strong); font-weight: 600; font-size: var(--fs-sm); }
    .screen { padding: 10px; border: var(--border); border-radius: var(--radius); background: #fff; color: #111; }
    .outlet { position: relative; padding: 18px 10px 8px; border: 1.5px dashed #94a3b8; border-radius: 8px; }
    .outlet.o2 { margin-top: 6px; border-color: #a78bfa; }
    .outlet.is-hl { border-color: #eab308; background: #fefce8; }
    .tag { position: absolute; top: 2px; left: 8px; font-family: ui-monospace, monospace; font-size: 11px; color: #64748b; }
    .pg { margin: 2px 0; font-size: 13px; }
    .loading { color: #94a3b8; font-style: italic; }
    .dirty { color: #b45309; font-size: 12px; }
    .ask { margin: 6px 0 0; padding: 4px 8px; background: #fef3c7; border-radius: 6px; font-size: 13px; }
    @media (max-width: 820px) { .stage { grid-template-columns: minmax(0, 1fr); } }
  `,
})
export class RoutingAdvancedVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly scenarios = SCENARIOS;
  protected readonly stages = STAGES;
  protected readonly scenario = signal<Scenario>('open');
  protected readonly useResolver = signal(false);
  protected readonly useGuard = signal(false);

  protected readonly tl = createTimeline<Frame>(
    { stage: null, url: '/', params: [], screen: { page: 'list', child: null, data: 'none', dirty: false }, prompt: false },
    {
      onEnter: (s) => {
        this.ctx.stepAnchor.set(s.anchor ?? null);
        for (const tag of (s.tag ?? '').split(' ').filter(Boolean)) this.ctx.completeChallenge(tag);
      },
    },
  );

  protected passed(cur: Stage | null, s: Stage): boolean {
    if (!cur) return false;
    const order = STAGES.map((x) => x.id);
    if (cur === 'cancel') return order.indexOf(s) < order.indexOf('guard');
    return order.indexOf(s) < order.indexOf(cur);
  }

  protected run(): void {
    const steps: Step<Frame>[] = [];
    const sc = this.scenario();
    const resolver = this.useResolver();
    const guard = this.useGuard();
    let f: Frame;
    const push = (patch: Partial<Omit<Frame, 'screen'>> & { screen?: Partial<Screen> }, caption: string, extra: Partial<Step<Frame>> = {}) => {
      f = { ...f, ...patch, screen: { ...f.screen, ...(patch.screen ?? {}) } };
      steps.push({ frame: f, caption, anchor: STAGES.find((x) => x.id === f.stage)?.anchor, duration: 1200, ...extra });
    };

    if (sc === 'open') {
      f = { stage: null, url: '/', params: [], screen: { page: 'list', child: null, data: 'none', dirty: false }, prompt: false };
      push({ stage: 'start', url: '/sp/3/danh-gia?tab=danh-gia' }, 'Bấm link: Router phát NavigationStart với URL mới.');
      push({ stage: 'recognize', params: [[':id', '3'], ['?tab', 'danh-gia'], ['route', 'sp/:id → danh-gia']] }, 'Recognize: khớp "sp/:id" rồi route con "danh-gia"; tách id = 3 và query tab = danh-gia.', { tag: 'ra-param' });
      push({ stage: 'guard' }, 'Guards: trang danh sách không có canDeactivate, route mới không có canActivate → cho qua.');
      if (resolver) {
        push({ stage: 'resolve' }, 'Resolve: productResolver tải sản phẩm 3 (0,5 giây). Trang cũ vẫn hiện trong lúc chờ.', { duration: 1500 });
        push({ stage: 'activate', screen: { page: 'detail', child: 'danh-gia', data: 'ready' } }, 'Activate: ProductDetail được tạo với input product ĐÃ có dữ liệu; outlet con hiện ProductReviews.', { sound: 'pop', tag: 'ra-resolve' });
      } else {
        push({ stage: 'activate', screen: { page: 'detail', child: 'danh-gia', data: 'loading' } }, 'Không có resolver: component hiện ngay nhưng chưa có dữ liệu → trang trống, phải tự tải trong component.', { sound: 'boop' });
        push({ screen: { data: 'ready' } }, '0,5 giây sau dữ liệu mới về và trang "nhảy" nội dung.');
      }
      push({ stage: 'end' }, 'NavigationEnd: URL đã cập nhật, :id và ?tab được gán vào input() nhờ withComponentInputBinding.', { sound: 'ting' });
    } else if (sc === 'tab') {
      f = { stage: null, url: '/sp/3/danh-gia', params: [[':id', '3']], screen: { page: 'detail', child: 'danh-gia', data: 'ready', dirty: false }, prompt: false };
      push({ stage: 'start', url: '/sp/3/mo-ta' }, 'Bấm tab "Mô tả": NavigationStart tới /sp/3/mo-ta.');
      push({ stage: 'recognize', params: [[':id', '3'], ['route', 'sp/:id → mo-ta']] }, 'Recognize: route cha sp/:id KHÔNG đổi (cùng id), chỉ route con đổi từ danh-gia sang mo-ta.');
      push({ stage: 'guard' }, 'Guards: không có guard nào chặn.');
      if (resolver) push({ stage: 'resolve' }, 'Resolve: params của route cha không đổi nên resolver mặc định KHÔNG chạy lại.');
      push({ stage: 'activate', screen: { child: 'mo-ta' } }, 'Activate: ProductDetail được giữ nguyên; chỉ outlet con thay ProductReviews bằng ProductInfo.', { sound: 'pop' });
      push({ stage: 'end' }, 'NavigationEnd: route lồng nhau giúp chỉ một phần màn hình thay đổi.', { sound: 'ting' });
    } else {
      f = { stage: null, url: '/sp/3/sua', params: [[':id', '3']], screen: { page: 'edit', child: null, data: 'ready', dirty: true }, prompt: false };
      push({ stage: 'start', url: '/' }, 'Đang sửa dở (chưa lưu) thì bấm "← Danh sách": NavigationStart tới /.');
      push({ stage: 'recognize', params: [['route', '(trang danh sách)']] }, 'Recognize: khớp route danh sách.');
      if (guard) {
        push({ stage: 'guard', prompt: true }, 'Guards: unsavedChangesGuard gọi component.canLeave(). Có thay đổi chưa lưu → hiện câu hỏi, Router chờ Promise.', { duration: 1600 });
        push({ stage: 'cancel', prompt: false, url: '/sp/3/sua' }, 'Người dùng chọn "Ở lại" → Promise trả false → NavigationCancel. Thay đổi vẫn còn nguyên.', { sound: 'ting', tag: 'ra-guard', anchor: 'guard' });
      } else {
        push({ stage: 'guard' }, 'Guards: route Sửa không có canDeactivate → cho qua ngay.');
        push({ stage: 'activate', screen: { page: 'list', dirty: false } }, 'Activate: ProductEdit bị huỷ, dòng "!!!" vừa gõ biến mất mà không hỏi một câu.', { sound: 'boop' });
        push({ stage: 'end' }, 'NavigationEnd: người dùng mất thay đổi chưa lưu.', { sound: 'boop' });
      }
    }
    this.tl.load(steps);
  }
}
