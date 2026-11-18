import { DestroyRef, computed, inject, signal } from '@angular/core';
import { Sound, type SoundName } from '../../../core/sound/sound';

/**
 * Một bước của animation giải thích. Mỗi bước mang một "khung hình" (frame) đầy đủ,
 * nhờ vậy tua lui / tua tới chỉ là đổi index — visualizer chỉ việc vẽ frame hiện tại.
 */
export interface Step<F> {
  frame: F;
  caption: string;
  /** id phần tử cần highlight (đồng bộ với code-panel) */
  anchor?: string;
  /** thời lượng gốc ở tốc độ 1× (ms) */
  duration?: number;
  sound?: SoundName;
  /** nhãn để visualizer nhận biết (vd. phát hiện thử thách đã xong) */
  tag?: string;
}

export interface TimelineOptions<F> {
  onEnter?: (step: Step<F>, index: number) => void;
}

export class StepTimeline<F> {
  readonly steps = signal<Step<F>[]>([]);
  readonly index = signal(0);
  readonly playing = signal(false);
  readonly speed = signal(1);

  readonly current = computed<Step<F> | undefined>(() => this.steps()[this.index()]);
  readonly frame = computed<F>(() => this.current()?.frame ?? this.initial);
  readonly total = computed(() => this.steps().length);
  readonly atEnd = computed(() => this.index() >= this.total() - 1);
  /** thời lượng bước hiện tại đã chia tốc độ — visualizer dùng cho CSS transition */
  readonly durationMs = computed(() => Math.round((this.current()?.duration ?? 900) / this.speed()));

  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private initial: F,
    private readonly opts: TimelineOptions<F> = {},
    private readonly sound?: Sound,
  ) {}

  /** Nạp chuỗi bước mới (thường do người học vừa thao tác) và tự phát. */
  load(steps: Step<F>[], autoplay = true): void {
    this.stopTimer();
    this.steps.set(steps);
    this.goTo(0);
    if (autoplay && steps.length > 1) this.play();
    else this.playing.set(false);
  }

  play(): void {
    if (!this.total()) return;
    if (this.atEnd()) this.goTo(0);
    this.playing.set(true);
    this.schedule();
  }

  pause(): void {
    this.playing.set(false);
    this.stopTimer();
  }

  toggle(): void {
    this.playing() ? this.pause() : this.play();
  }

  next(): void {
    this.pause();
    if (!this.atEnd()) this.goTo(this.index() + 1);
  }

  prev(): void {
    this.pause();
    if (this.index() > 0) this.goTo(this.index() - 1);
  }

  restart(): void {
    this.goTo(0);
    this.play();
  }

  /** Về trạng thái ban đầu, xoá các bước */
  reset(frame?: F): void {
    this.pause();
    if (frame !== undefined) this.initial = frame;
    this.steps.set([]);
    this.index.set(0);
  }

  destroy(): void {
    this.stopTimer();
  }

  private goTo(i: number): void {
    this.index.set(i);
    const step = this.steps()[i];
    if (step) {
      if (step.sound) this.sound?.play(step.sound);
      this.opts.onEnter?.(step, i);
    }
  }

  private schedule(): void {
    this.stopTimer();
    if (!this.playing()) return;
    if (this.atEnd()) {
      this.playing.set(false);
      return;
    }
    this.timer = setTimeout(() => {
      this.goTo(this.index() + 1);
      this.schedule();
    }, this.durationMs());
  }

  private stopTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
}

/** Tạo timeline trong injection context — tự dọn timer khi component bị huỷ. */
export function createTimeline<F>(initial: F, opts: TimelineOptions<F> = {}): StepTimeline<F> {
  const t = new StepTimeline<F>(initial, opts, inject(Sound));
  inject(DestroyRef).onDestroy(() => t.destroy());
  return t;
}
