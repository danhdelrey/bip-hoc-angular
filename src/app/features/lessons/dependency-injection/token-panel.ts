import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { AnimatedArrow } from '../../../shared/ui/rough/rough';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

interface TokFrame {
  override: boolean;
  at: 'consumer' | 'route' | 'root' | null;
  value: string | null;
}

const ROOT_URL = 'https://api.bip.vn';
const STAGING_URL = 'https://staging.bip.vn';

/** Phần nâng cao: InjectionToken cho giá trị không phải class. */
@Component({
  selector: 'app-di-token-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, AnchorDirective, AnimatedArrow, StepPlayer],
  template: `
    @let f = tl.frame();
    <section class="adv toon toon-lg" aria-labelledby="adv-title">
      <h2 id="adv-title"><span class="chip chip-di"><app-icon name="di" [size]="16" /> Nâng cao</span> InjectionToken — quầy phát "giá trị"</h2>
      <p class="muted">Class tự làm "chìa khoá" DI được. Còn chuỗi URL hay object cấu hình thì cần một <code>InjectionToken</code> làm chìa khoá.</p>
      <div class="scene">
        <div class="tier" [class.on]="f.at === 'root'" appAnchor="token">
          <strong>Root</strong>
          <span class="chip chip-di">factory: {{ rootUrl }}</span>
        </div>
        <div class="tier" [class.on]="f.at === 'route'" appAnchor="route-provider">
          <strong>Route 'cua-hang'</strong>
          @if (f.override) {
            <span class="chip chip-di">useValue: {{ stagingUrl }}</span>
          } @else {
            <span class="chip chip-plain">không ghi đè</span>
          }
        </div>
        <div class="tier consumer" [class.on]="f.at === 'consumer'">
          <strong>ApiClient trong ShopPage</strong>
          <code>inject(API_URL)</code>
          <span class="chip" [class.chip-data]="f.value" [class.chip-plain]="!f.value">
            <app-icon name="data" [size]="14" /> {{ f.value ?? '…' }}
          </span>
        </div>
        <svg class="arrows" viewBox="0 0 120 200" preserveAspectRatio="none" aria-hidden="true">
          @if (f.value) {
            <g appArrow [from]="f.at === 'root' || f.override === false ? [30, 32] : [30, 96]" [to]="[30, 160]" [bend]="-40" [draw]="true" class="tok-arrow" />
          }
        </svg>
      </div>
      <div class="row">
        <button type="button" class="btn btn-sm btn-di" (click)="toggleOverride()">
          <app-icon [name]="override() ? 'minus' : 'plus'" [size]="16" /> {{ override() ? 'Bỏ ghi đè ở Route' : 'Route ghi đè API_URL' }}
        </button>
      </div>
      <app-step-player [timeline]="tl" />
    </section>
  `,
  styles: `
    :host { display: block; margin: 0 0 44px; }
    .adv { overflow: hidden; }
    h2 { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 20px 22px 0; font-size: var(--fs-lg); }
    p { padding: 0 22px; }
    .scene { position: relative; display: grid; gap: 12px; padding: 6px 22px 6px 22px; max-width: 640px; }
    .tier { min-height: 52px; box-sizing: border-box; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 10px 14px; margin-right: 110px; border: var(--border); border-radius: var(--radius-sm); background: var(--surface); box-shadow: var(--shadow-sm); transition: background-color var(--dur) ease; }
    .tier.on { background: color-mix(in srgb, var(--c-signal) 40%, var(--surface)); }
    .tier.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .tier code { background: none; border: none; }
    .consumer { background: color-mix(in srgb, var(--c-brand) 14%, var(--surface)); }
    .arrows { position: absolute; right: 0; top: 0; width: 120px; height: 100%; }
    .tok-arrow { --r-stroke: var(--c-di-strong); --r-sw: 3.5; --r-ve: non-scaling-stroke; }
    .row { padding: 12px 22px 16px; }
  `,
})
export class DiTokenPanel {
  private readonly ctx = inject(LessonContext);
  protected readonly rootUrl = ROOT_URL;
  protected readonly stagingUrl = STAGING_URL;
  protected readonly override = signal(true);
  /** Chỉ đồng bộ highlight code khi người học thao tác (không phải lúc khởi tạo) */
  private userDriven = false;

  protected readonly tl = createTimeline<TokFrame>(
    { override: true, at: null, value: null },
    { onEnter: (s) => this.userDriven && this.ctx.stepAnchor.set(s.anchor ?? null) },
  );

  constructor() {
    this.run(true, false);
    this.userDriven = true;
  }

  protected toggleOverride(): void {
    this.override.update((v) => !v);
    this.run(this.override(), true);
  }

  private run(override: boolean, autoplay: boolean): void {
    const steps: Step<TokFrame>[] = [
      { frame: { override, at: 'consumer', value: null }, caption: 'ApiClient gọi inject(API_URL) — chìa khoá là token, không phải class.', duration: 900 },
      override
        ? { frame: { override, at: 'route', value: STAGING_URL }, caption: `Route có provider ghi đè → nhận "${STAGING_URL}". Dừng tìm!`, anchor: 'route-provider', duration: 1100, sound: 'ting' }
        : { frame: { override, at: 'route', value: null }, caption: 'Route không có provider cho API_URL → đi tiếp lên trên.', anchor: 'route-provider', duration: 900 },
    ];
    if (!override) {
      steps.push({ frame: { override, at: 'root', value: ROOT_URL }, caption: `Tới Root: dùng factory mặc định của token → "${ROOT_URL}".`, anchor: 'token', duration: 1100, sound: 'ting' });
    }
    this.tl.load(steps, autoplay);
    if (!autoplay) while (!this.tl.atEnd()) this.tl.next();
  }
}
