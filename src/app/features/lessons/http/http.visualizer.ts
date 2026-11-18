import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Station = 'client' | 'auth' | 'log' | 'error' | 'server';
const STATIONS: { id: Station; title: string; icon: string; stamp: string }[] = [
  { id: 'client', title: 'Component', icon: 'house', stamp: '' },
  { id: 'auth', title: 'authInterceptor', icon: 'di', stamp: '🔑 token' },
  { id: 'log', title: 'loggingInterceptor', icon: 'form', stamp: '📒 giờ đi' },
  { id: 'error', title: 'errorInterceptor', icon: 'error', stamp: '🛟 bảo hiểm' },
  { id: 'server', title: 'Server (mock)', icon: 'building', stamp: '' },
];

interface Frame {
  at: number;
  dir: 'out' | 'back' | 'idle';
  stamps: string[];
  kind: 'letter' | 'ok' | 'err';
  label: string;
  attempt: number;
}

@Component({
  selector: 'app-http-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="controls">
      <span class="eyebrow">Server trả về:</span>
      @for (s of statuses; track s) {
        <button type="button" class="chip" [class.chip-data]="status() === s && s === 200" [class.chip-error]="status() === s && s !== 200" [class.chip-plain]="status() !== s" (click)="status.set(s)" [attr.aria-pressed]="status() === s">{{ s }}</button>
      }
      <label class="lat">Độ trễ mạng <b>{{ latency() }}ms</b>
        <input type="range" min="200" max="2000" step="100" [value]="latency()" (input)="latency.set(+$any($event.target).value)" />
      </label>
      <button type="button" class="btn btn-primary" (click)="send()" appAnchor="client"><app-icon name="envelope" [size]="18" /> Gửi GET /api/me</button>
    </div>

    <div class="street" [style.--dur.ms]="tl.durationMs()">
      <div class="road" aria-hidden="true"></div>
      @for (s of stations; track s.id; let i = $index) {
        <div class="office" [class]="'office o-' + s.id" [class.here]="f.at === i" [appAnchor]="s.id" [style.left.%]="pos(i)">
          <span class="ic"><app-icon [name]="s.icon" [size]="22" /></span>
          <strong>{{ s.title }}</strong>
        </div>
      }
      @if (f.dir !== 'idle') {
        <div class="letter" [class]="'letter k-' + f.kind + ' d-' + f.dir" [style.left.%]="pos(f.at)" aria-hidden="true">
          <span class="env">{{ f.kind === 'ok' ? '📦' : f.kind === 'err' ? '📛' : '✉️' }}</span>
          <span class="legs"><i></i><i></i></span>
          <span class="lbl">{{ f.label }}</span>
        </div>
      }
    </div>
    <div class="stamps">
      <span class="eyebrow">Dấu trên phong bì:</span>
      @for (s of f.stamps; track $index) { <span class="stamp">{{ s }}</span> } @empty { <span class="muted">(chưa có)</span> }
      @if (f.attempt > 1) { <span class="chip chip-event">lần gửi thứ {{ f.attempt }}</span> }
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding: 18px 22px 0; }
    .controls .chip { cursor: pointer; font-family: var(--font-mono); }
    .lat { display: flex; gap: 8px; align-items: center; font-size: var(--fs-sm); font-weight: 700; }
    .lat input { width: 120px; }
    .street { position: relative; height: 200px; margin: 18px 70px 0; }
    .road { position: absolute; left: -40px; right: -40px; top: 130px; height: 22px; background: var(--surface-2); border: var(--border); border-radius: 12px; background-image: repeating-linear-gradient(90deg, transparent 0 18px, color-mix(in srgb, var(--line) 35%, transparent) 18px 30px); background-size: 100% 3px; background-repeat: repeat-x; background-position: center; }
    .office { position: absolute; top: 20px; transform: translateX(-50%); display: grid; justify-items: center; gap: 4px; width: 128px; text-align: center; }
    .ic { display: grid; place-items: center; width: 54px; height: 54px; background: var(--surface); border: var(--border); border-radius: 14px 14px 6px 6px; box-shadow: var(--shadow-sm); transition: transform var(--dur) var(--ease-bounce), background-color var(--dur) ease; }
    .o-auth .ic { background: color-mix(in srgb, var(--c-di) 40%, var(--surface)); }
    .o-log .ic { background: color-mix(in srgb, var(--c-brand) 40%, var(--surface)); }
    .o-error .ic { background: color-mix(in srgb, var(--c-error) 35%, var(--surface)); }
    .o-server .ic { background: color-mix(in srgb, var(--c-data) 40%, var(--surface)); }
    .office strong { font-family: var(--font-mono); font-size: 11.5px; }
    .office.here .ic, .office.is-hl .ic { transform: scale(1.15); box-shadow: 0 0 0 4px var(--c-signal); }
    .letter { position: absolute; top: 96px; transform: translateX(-50%); display: grid; justify-items: center; transition: left var(--dur) var(--ease-in-out); z-index: 2; }
    .env { font-size: 30px; line-height: 1; }
    .d-back .env { transform: scaleX(-1); }
    .legs { display: flex; gap: 6px; }
    .legs i { width: 3px; height: 12px; background: var(--line); border-radius: 2px; animation: step 300ms ease-in-out infinite alternate; }
    .legs i:last-child { animation-delay: 150ms; }
    @keyframes step { from { transform: rotate(-25deg); } to { transform: rotate(25deg); } }
    .lbl { position: absolute; top: -22px; white-space: nowrap; padding: 0 6px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; background: var(--surface); border: 2px solid var(--line); border-radius: 8px; }
    .k-err .lbl { background: var(--c-error); color: var(--pal-ink); }
    .k-ok .lbl { background: var(--c-data); color: var(--pal-ink); }
    .stamps { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 8px 22px 16px; }
    .stamp { padding: 2px 10px; font-weight: 800; font-size: 13px; border: 2.5px dashed var(--c-event-strong); color: var(--c-event-strong); border-radius: 8px; transform: rotate(-3deg); }
    @media (max-width: 760px) { .street { margin: 18px 40px 0; } .office { width: 70px; } .office strong { font-size: 9.5px; } }
  `,
})
export class HttpVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly stations = STATIONS;
  protected readonly statuses = [200, 401, 500] as const;
  protected readonly status = signal<200 | 401 | 500>(200);
  protected readonly latency = signal(800);

  protected readonly tl = createTimeline<Frame>({ at: 0, dir: 'idle', stamps: [], kind: 'letter', label: '', attempt: 0 }, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag === 'ok') this.ctx.completeChallenge('http-ok');
      if (s.tag === '401') this.ctx.completeChallenge('http-401');
      if (s.tag === 'retry') this.ctx.completeChallenge('http-retry');
    },
  });

  protected pos(i: number): number {
    return (i / (STATIONS.length - 1)) * 100;
  }

  protected send(): void {
    const status = this.status();
    const steps: Step<Frame>[] = [];
    const st = (f: Frame, caption: string, anchor: Station, duration = 900, tag?: string, sound?: 'pop' | 'ting' | 'boop') =>
      steps.push({ frame: { ...f, stamps: [...f.stamps] }, caption, anchor, duration, tag, sound });

    let stamps: string[] = [];
    st({ at: 0, dir: 'out', stamps, kind: 'letter', label: 'GET /api/me', attempt: 1 }, 'Component gọi http.get("/api/me").subscribe() — phong bì lên đường.', 'client', 900, undefined, 'pop');
    stamps = ['🔑 Authorization: Bearer …'];
    st({ at: 1, dir: 'out', stamps, kind: 'letter', label: 'GET /api/me', attempt: 1 }, 'authInterceptor: req.clone({ setHeaders }) — đóng dấu token.', 'auth', 1000, undefined, 'pop');
    stamps = [...stamps, '📒 giờ đi'];
    st({ at: 2, dir: 'out', stamps, kind: 'letter', label: 'GET /api/me', attempt: 1 }, 'loggingInterceptor: ghi sổ giờ đi rồi chuyển tiếp next(req).', 'log', 1000, undefined, 'pop');
    st({ at: 3, dir: 'out', stamps, kind: 'letter', label: 'GET /api/me', attempt: 1 }, 'errorInterceptor: chưa làm gì lúc đi — nó chờ lúc thư quay về.', 'error', 900);

    const toServer = (attempt: number) => {
      st({ at: 4, dir: 'out', stamps, kind: 'letter', label: `chờ ${this.latency()}ms…`, attempt }, `Tới server (mock). Mạng trễ ${this.latency()}ms…`, 'server', Math.max(700, this.latency()));
    };
    toServer(1);
    if (status === 200) {
      st({ at: 4, dir: 'back', stamps, kind: 'ok', label: '200 OK', attempt: 1 }, 'Server trả 200 kèm { name: "Bíp" } — phong bì thành gói hàng, quay về.', 'server', 900, undefined, 'ting');
      st({ at: 3, dir: 'back', stamps, kind: 'ok', label: '200 OK', attempt: 1 }, 'errorInterceptor: không có lỗi, cho qua.', 'error', 800);
      stamps = [...stamps, '📒 giờ về'];
      st({ at: 2, dir: 'back', stamps, kind: 'ok', label: '200 OK', attempt: 1 }, 'loggingInterceptor (finalize): ghi giờ về, tính thời gian.', 'log', 900, undefined, 'pop');
      st({ at: 1, dir: 'back', stamps, kind: 'ok', label: '200 OK', attempt: 1 }, 'authInterceptor: không xử lý gì thêm ở chiều về.', 'auth', 700);
      st({ at: 0, dir: 'back', stamps, kind: 'ok', label: '👋 Bíp', attempt: 1 }, 'Component nhận dữ liệu trong next(): user.set(u). Về nhà an toàn!', 'client', 1000, 'ok', 'ting');
    } else if (status === 401) {
      st({ at: 4, dir: 'back', stamps, kind: 'err', label: '401', attempt: 1 }, 'Server trả 401 Unauthorized — thư bị trả lại.', 'server', 900, undefined, 'boop');
      st({ at: 3, dir: 'back', stamps, kind: 'err', label: '401 → Bạn cần đăng nhập lại', attempt: 1 }, 'errorInterceptor: 401 không retry, dịch thành "Bạn cần đăng nhập lại".', 'error', 1300);
      stamps = [...stamps, '📒 giờ về (lỗi)'];
      st({ at: 2, dir: 'back', stamps, kind: 'err', label: '401', attempt: 1 }, 'loggingInterceptor: finalize vẫn chạy kể cả khi lỗi.', 'log', 900);
      st({ at: 0, dir: 'back', stamps, kind: 'err', label: '❌ đăng nhập lại', attempt: 1 }, 'Component nhận lỗi đã được dịch sẵn trong error(): hiện thông báo thân thiện.', 'client', 1100, '401', 'boop');
    } else {
      st({ at: 4, dir: 'back', stamps, kind: 'err', label: '500', attempt: 1 }, 'Server trả 500 — lỗi phía server.', 'server', 900, undefined, 'boop');
      st({ at: 3, dir: 'back', stamps, kind: 'err', label: '500 → thử lại', attempt: 1 }, 'errorInterceptor: retry({ count: 1 }) — đợi 300ms rồi gửi lại!', 'error', 1300);
      st({ at: 4, dir: 'out', stamps, kind: 'letter', label: 'GET /api/me (lần 2)', attempt: 2 }, 'Phong bì đi lại tới server lần thứ hai…', 'server', Math.max(700, this.latency()));
      st({ at: 4, dir: 'back', stamps, kind: 'err', label: '500', attempt: 2 }, 'Vẫn 500. Hết lượt thử lại.', 'server', 900, undefined, 'boop');
      st({ at: 3, dir: 'back', stamps, kind: 'err', label: '500 → Server đang lỗi', attempt: 2 }, 'errorInterceptor: dịch thành "Server đang lỗi".', 'error', 1100);
      stamps = [...stamps, '📒 giờ về (lỗi)'];
      st({ at: 0, dir: 'back', stamps, kind: 'err', label: '❌ server lỗi', attempt: 2 }, 'Component nhận lỗi sau khi đã thử lại một lần.', 'client', 1100, 'retry', 'boop');
    }
    this.tl.load(steps);
  }
}
