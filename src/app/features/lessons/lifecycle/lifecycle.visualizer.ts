import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { Mascot, type MascotMood } from '../../../shared/ui/mascot/mascot';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Hook = 'constructor' | 'ngOnChanges' | 'ngOnInit' | 'ngAfterViewInit' | 'ngOnDestroy';
interface Station {
  hook: Hook;
  title: string;
  icon: string;
}
const STATIONS: Station[] = [
  { hook: 'constructor', title: 'Sinh ra', icon: 'star' },
  { hook: 'ngOnChanges', title: 'Nhận quà (input)', icon: 'gift' },
  { hook: 'ngOnInit', title: 'Lớn lên', icon: 'bulb' },
  { hook: 'ngAfterViewInit', title: 'Ra mắt (view xong)', icon: 'house' },
  { hook: 'ngOnChanges', title: 'Thay đổi', icon: 'cycle' },
  { hook: 'ngOnDestroy', title: 'Tạm biệt', icon: 'close' },
];

interface Frame {
  at: number | null; // index trạm
  lit: number[];
  alive: boolean;
  log: string[];
  name: string;
  life: number;
}

@Component({
  selector: 'app-lifecycle-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective, Mascot],
  template: `
    @let f = tl.frame();
    <div class="stage" [style.--dur.ms]="tl.durationMs()">
      <div class="road">
        <div class="track" aria-hidden="true"></div>
        @for (s of stations; track $index; let i = $index) {
          <div class="station" [class.lit]="f.lit.includes(i)" [class.here]="f.at === i" [appAnchor]="s.hook"
               [style.left.%]="pos(i)">
            <span class="flag"><app-icon [name]="s.icon" [size]="20" /></span>
            <strong>{{ s.title }}</strong>
            <code>{{ s.hook }}</code>
          </div>
        }
        @if (f.at !== null) {
          <div class="walker" [style.left.%]="pos(f.at)" aria-hidden="true">
            <app-mascot [mood]="mood()" [size]="52" />
          </div>
        }
      </div>
      <div class="bottom">
        <div class="console" aria-live="polite">
          <span class="console-title"><app-icon name="code" [size]="14" /> console (đời thứ {{ f.life || '—' }})</span>
          @for (l of f.log; track $index) {
            <code [class.new]="$index === f.log.length - 1">{{ l }}</code>
          } @empty {
            <code class="muted-c">(chưa có component nào)</code>
          }
        </div>
        <div class="controls">
          <span class="state chip" [class.chip-data]="f.alive" [class.chip-plain]="!f.alive">
            {{ f.alive ? 'Đang sống · name = ' + f.name : 'Chưa có / đã huỷ' }}
          </span>
          <button type="button" class="btn btn-sm btn-data" (click)="create()" [disabled]="alive"><app-icon name="plus" [size]="16" /> Tạo</button>
          <button type="button" class="btn btn-sm btn-signal" (click)="change()" [disabled]="!alive"><app-icon name="cycle" [size]="16" /> Đổi input name</button>
          <button type="button" class="btn btn-sm btn-danger" (click)="destroy()" [disabled]="!alive"><app-icon name="close" [size]="16" /> Huỷ</button>
        </div>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .stage { padding: 26px 22px 12px; }
    .road { position: relative; height: 200px; margin: 0 40px; }
    .track { position: absolute; left: 0; right: 0; top: 118px; height: 18px; background: var(--surface-2); border: var(--border); border-radius: 12px; }
    .station { position: absolute; top: 74px; transform: translateX(-50%); display: grid; justify-items: center; gap: 2px; width: 120px; text-align: center; }
    .flag { display: grid; place-items: center; width: 46px; height: 46px; margin-bottom: 26px; background: var(--surface); border: var(--border); border-radius: 50%; box-shadow: var(--shadow-sm); transition: background-color var(--dur) ease, transform var(--dur) var(--ease-bounce); }
    .station strong { font-family: var(--font-display); font-size: 13.5px; line-height: 1.1; }
    .station code { background: none; border: none; padding: 0; font-size: 11.5px; color: var(--text-muted); }
    .station.lit .flag { background: var(--c-signal); color: var(--on-accent); }
    .station.here .flag { transform: scale(1.2); box-shadow: 0 0 0 5px color-mix(in srgb, var(--c-signal) 60%, transparent); }
    .station.is-hl .flag { box-shadow: 0 0 0 5px var(--c-signal); }
    .walker { position: absolute; top: -6px; transform: translateX(-50%); transition: left var(--dur) var(--ease-in-out); }
    .bottom { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: start; margin-top: 6px; }
    .console { display: grid; gap: 2px; min-height: 120px; padding: 10px 12px; background: #10112b; color: #e6e3ff; border: var(--border); border-radius: var(--radius-sm); }
    .console-title { display: flex; gap: 6px; align-items: center; font-size: 11px; font-weight: 800; color: #b9fbff; }
    .console code { background: none; border: none; padding: 0; color: inherit; font-size: 12.5px; }
    .console code.new { color: var(--pal-lemon); }
    .muted-c { opacity: 0.6; }
    .controls { display: flex; flex-direction: column; gap: 10px; align-items: stretch; min-width: 220px; }
    .state { justify-content: center; }
    @media (max-width: 760px) { .bottom { grid-template-columns: 1fr; } .road { margin: 0 30px; } .station { width: 70px; } .station strong { font-size: 11px; } .station code { display: none; } }
  `,
})
export class LifecycleVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly stations = STATIONS;
  private state: Frame = { at: null, lit: [], alive: false, log: [], name: 'Bíp', life: 0 };
  private changesThisLife = 0;
  private sawFull = { create: false, change: false };
  private destroyedOnce = false;

  protected readonly tl = createTimeline<Frame>(this.state, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag === 'destroyed' && this.sawFull.create && this.sawFull.change) this.ctx.completeChallenge('lc-full');
      if (s.tag === 'changed' && this.changesThisLife >= 2) this.ctx.completeChallenge('lc-twice');
      if (s.tag === 'created' && this.destroyedOnce) this.ctx.completeChallenge('lc-reborn');
    },
  });

  protected get alive() {
    return this.state.alive;
  }

  protected readonly mood = computed<MascotMood>(() => {
    const at = this.tl.frame().at;
    return at === 5 ? 'sad' : at === 0 ? 'surprised' : at === 3 ? 'celebrate' : 'happy';
  });

  protected pos(i: number): number {
    return (i / (STATIONS.length - 1)) * 100;
  }

  private step(f: Partial<Frame>, caption: string, anchor: Hook, tag?: string, sound?: 'pop' | 'ting'): Step<Frame> {
    this.state = { ...this.state, ...f, lit: f.lit ?? this.state.lit, log: f.log ?? this.state.log };
    return { frame: { ...this.state }, caption, anchor, duration: 1100, tag, sound };
  }

  protected create(): void {
    const life = this.state.life + 1;
    this.changesThisLife = 0;
    this.sawFull = { create: true, change: false };
    const n = this.state.name;
    const steps = [
      this.step({ at: 0, lit: [0], alive: true, life, log: ['constructor'] }, 'constructor: Angular gọi new LifeBuddy(). Input CHƯA có giá trị!', 'constructor', undefined, 'pop'),
      this.step({ at: 1, lit: [0, 1], log: [...this.state.log, `ngOnChanges: name = ${n}`] }, `ngOnChanges lần đầu: nhận input name = '${n}' từ cha.`, 'ngOnChanges'),
      this.step({ at: 2, lit: [0, 1, 2], log: [...this.state.log, 'ngOnInit'] }, 'ngOnInit: input đã sẵn sàng — nơi khởi tạo (chỉ chạy MỘT lần).', 'ngOnInit'),
      this.step({ at: 3, lit: [0, 1, 2, 3], log: [...this.state.log, 'ngAfterViewInit'] }, 'ngAfterViewInit: view đã vẽ xong, có thể đụng vào DOM/viewChild.', 'ngAfterViewInit', 'created', 'ting'),
    ];
    this.tl.load(steps);
  }

  protected change(): void {
    const name = this.state.name === 'Bíp' ? 'Bốp' : 'Bíp';
    this.changesThisLife++;
    this.sawFull.change = true;
    const steps = [
      this.step({ at: 4, lit: [...new Set([...this.state.lit, 4])], name, log: [...this.state.log, `ngOnChanges: name = ${name}`] }, `Cha đổi [name] → ngOnChanges chạy lại (name = '${name}'). ngOnInit KHÔNG chạy lại.`, 'ngOnChanges', 'changed', 'pop'),
    ];
    this.tl.load(steps, false);
  }

  protected destroy(): void {
    this.destroyedOnce = true;
    const steps = [
      this.step({ at: 5, lit: [...new Set([...this.state.lit, 5])], log: [...this.state.log, 'ngOnDestroy'] }, 'ngOnDestroy: @if tắt → component bị gỡ khỏi DOM. Dọn dẹp timer, subscription ở đây!', 'ngOnDestroy'),
      this.step({ at: null, alive: false }, 'Tạm biệt! Instance này đã biến mất. Tạo lại sẽ là một instance mới hoàn toàn.', 'ngOnDestroy', 'destroyed'),
    ];
    this.tl.load(steps);
  }
}
