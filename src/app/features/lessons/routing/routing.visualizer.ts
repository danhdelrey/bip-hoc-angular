import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

interface Row {
  id: string;
  path: string;
  comp: string;
  guard?: boolean;
  lazy?: boolean;
}
const ROWS: Row[] = [
  { id: 'r-home', path: "''", comp: 'HomeStop' },
  { id: 'r-product', path: "'san-pham/:id'", comp: 'ProductStop' },
  { id: 'r-admin', path: "'admin'", comp: 'AdminStop', guard: true },
  { id: 'r-lazy', path: "'bao-cao'", comp: 'ReportStop', lazy: true },
  { id: 'r-wild', path: "'**'", comp: 'LostStop' },
];
const TICKETS = ['/', '/san-pham/42', '/san-pham/7', '/admin', '/bao-cao', '/ga-ma'];

function match(row: Row, url: string): Record<string, string> | null {
  const segs = url.split('/').filter(Boolean);
  if (row.id === 'r-wild') return {};
  const pat = row.path.replace(/'/g, '').split('/').filter(Boolean);
  if (pat.length !== segs.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pat.length; i++) {
    if (pat[i].startsWith(':')) params[pat[i].slice(1)] = segs[i];
    else if (pat[i] !== segs[i]) return null;
  }
  return params;
}

interface Frame {
  ticket: string;
  trying: string | null;
  tried: string[];
  matched: string | null;
  guard: 'idle' | 'check' | 'pass' | 'block';
  cargo: 'none' | 'loading' | 'cached';
  platform: { comp: string; params: string } | null;
  train: 'depot' | 'moving' | 'arrived' | 'stopped';
}
const IDLE: Frame = { ticket: '/', trying: null, tried: [], matched: null, guard: 'idle', cargo: 'none', platform: { comp: 'HomeStop', params: '' }, train: 'arrived' };

@Component({
  selector: 'app-routing-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  template: `
    @let f = tl.frame();
    <div class="top">
      <div class="tickets" role="radiogroup" aria-label="Chọn vé (URL)">
        @for (t of tickets; track t) {
          <button type="button" class="ticket" role="radio" [attr.aria-checked]="ticket() === t" [class.on]="ticket() === t" (click)="ticket.set(t)">🎫 {{ t }}</button>
        }
      </div>
      <div class="go">
        <button type="button" class="switch" role="switch" [attr.aria-checked]="loggedIn()" (click)="loggedIn.set(!loggedIn())" appAnchor="guard">
          <span class="knob"></span> Đăng nhập
        </button>
        <button type="button" class="btn btn-primary" (click)="depart()"><app-icon name="train" [size]="18" /> Khởi hành</button>
      </div>
    </div>

    <div class="station">
      <div class="board" aria-label="Bảng giờ tàu (routes)">
        <p class="eyebrow">Bảng giờ tàu — routes</p>
        @for (r of rows; track r.id) {
          <div class="row" [appAnchor]="r.id" [class.trying]="f.trying === r.id" [class.miss]="f.tried.includes(r.id) && f.matched !== r.id" [class.hit]="f.matched === r.id">
            <code>{{ r.path }}</code><span>→ {{ r.comp }}</span>
            @if (r.guard) { <span class="tag g">🛂 guard</span> }
            @if (r.lazy) { <span class="tag l">📦 lazy</span> }
          </div>
        }
      </div>

      <div class="yard">
        <div class="url-bar"><span class="dots"><i></i><i></i><i></i></span> localhost:4200{{ f.ticket }}</div>
        <div class="rails">
          <div class="gate" [class]="'gate g-' + f.guard" appAnchor="guard">
            <span class="officer">{{ f.guard === 'block' ? '🙅' : f.guard === 'pass' ? '🙆' : '🧍' }}</span>
            <small>{{ f.guard === 'block' ? 'Chặn!' : f.guard === 'pass' ? 'Mời qua' : f.guard === 'check' ? 'Soát vé…' : 'Soát vé' }}</small>
          </div>
          <div class="train" [class]="'train t-' + f.train">
            <span class="loco">🚂</span>
            @if (f.cargo !== 'none') { <span class="cargo" [class.loading]="f.cargo === 'loading'">📦<small>{{ f.cargo === 'loading' ? 'tải chunk…' : 'đã có' }}</small></span> }
          </div>
        </div>
        <div class="platform" appAnchor="outlet">
          <span class="eyebrow">Sân ga &lt;router-outlet&gt;</span>
          @if (f.platform; as p) {
            <div class="car"><strong>{{ p.comp }}</strong>@if (p.params) { <code>{{ p.params }}</code> }</div>
          } @else {
            <div class="car empty">(trống)</div>
          }
        </div>
      </div>
    </div>
    <app-step-player [timeline]="tl" />
  `,
  styles: `
    :host { display: block; }
    .top { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; padding: 18px 22px 6px; }
    .tickets { display: flex; flex-wrap: wrap; gap: 6px; }
    .ticket { padding: 6px 12px; font-family: var(--font-mono); font-weight: 700; font-size: 13px; background: var(--surface); border: var(--border-thin); border-radius: 8px; border-style: dashed; cursor: pointer; transform: rotate(-1deg); }
    .ticket.on { background: var(--c-signal); color: var(--on-accent); border-style: solid; transform: rotate(1deg) scale(1.05); }
    .go { display: flex; gap: 10px; align-items: center; }
    .switch { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 4px 14px 4px 6px; font-weight: 600; background: var(--surface); border: var(--border); border-radius: var(--radius-pill); box-shadow: var(--shadow-sm); cursor: pointer; }
    .knob { position: relative; width: 44px; height: 26px; background: var(--surface-sunken); border: var(--border-thin); border-radius: var(--radius-pill); }
    .knob::after { content: ''; position: absolute; top: 2px; left: 2px; width: 17px; height: 17px; background: var(--surface); border: 2px solid var(--line); border-radius: 50%; transition: transform var(--dur) var(--ease-bounce); }
    .switch[aria-checked='true'] .knob { background: var(--c-data); }
    .switch[aria-checked='true'] .knob::after { transform: translateX(18px); }
    .station { display: grid; grid-template-columns: 300px 1fr; gap: 18px; padding: 10px 22px 18px; }
    .board { padding: 10px; background: #10112b; color: #e6e3ff; border: var(--border); border-radius: var(--radius-sm); }
    .board .eyebrow { color: #b9fbff; margin: 0 0 6px; }
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 8px; margin-bottom: 4px; font-size: 13px; border: 2px solid transparent; border-radius: 8px; transition: background-color var(--dur-fast) ease; }
    .row code { background: none; border: none; padding: 0; color: var(--pal-lemon); font-weight: 700; }
    .row.trying { border-color: var(--pal-lemon); }
    .row.miss { opacity: 0.45; text-decoration: line-through; }
    .row.hit { background: var(--c-data); color: var(--pal-ink); }
    .row.hit code { color: var(--pal-ink); }
    .row.is-hl { border-color: var(--pal-lemon); }
    .tag { font-size: 11px; font-weight: 600; padding: 0 6px; border-radius: var(--radius-pill); background: rgba(255,255,255,.12); }
    .yard { display: grid; gap: 10px; min-width: 0; }
    .url-bar { display: flex; align-items: center; gap: 8px; padding: 6px 12px; font-family: var(--font-mono); font-weight: 700; background: var(--surface); border: var(--border); border-radius: var(--radius-pill); }
    .dots { display: inline-flex; gap: 4px; }
    .dots i { width: 9px; height: 9px; border-radius: 50%; border: 2px solid var(--line); background: var(--c-data); }
    .rails { position: relative; height: 90px; background: repeating-linear-gradient(90deg, transparent 0 22px, color-mix(in srgb, var(--line) 30%, transparent) 22px 26px) bottom / 100% 14px no-repeat, linear-gradient(var(--line), var(--line)) bottom 12px left 0 / 100% 3px no-repeat; }
    .gate { position: absolute; left: 55%; bottom: 14px; display: grid; justify-items: center; padding: 2px 8px; background: var(--surface); border: var(--border-thin); border-radius: 10px; }
    .gate .officer { font-size: 26px; }
    .gate small { font-size: 11px; font-weight: 600; }
    .g-block { background: var(--c-error); animation: blink-err 500ms ease 2; }
    .g-pass { background: var(--c-data); }
    .g-check { box-shadow: 0 0 0 4px var(--c-signal); }
    .gate.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .train { position: absolute; bottom: 16px; display: flex; align-items: flex-end; gap: 4px; transition: left var(--dur) var(--ease-in-out); }
    .t-depot { left: 0; }
    .t-moving { left: 30%; }
    .t-stopped { left: 38%; }
    .t-arrived { left: 78%; }
    .loco { font-size: 40px; transform: scaleX(-1); }
    .cargo { display: grid; justify-items: center; font-size: 26px; }
    .cargo small { font-size: 10px; font-weight: 600; }
    .cargo.loading { animation: shake 300ms linear infinite; }
    @keyframes shake { 50% { transform: translateY(-3px); } }
    .platform { padding: 10px 12px; background: var(--surface-2); border: var(--border); border-radius: var(--radius-sm); }
    .platform.is-hl { box-shadow: 0 0 0 4px var(--c-signal); }
    .car { display: flex; gap: 10px; align-items: center; margin-top: 6px; padding: 10px 14px; background: var(--c-brand); color: var(--on-accent); border: var(--border); border-radius: 12px; box-shadow: var(--shadow-sm); animation: deco-pop-in 420ms var(--ease-bounce); }
    .car code { background: rgba(255,255,255,.6); border: none; color: var(--pal-ink); }
    .car.empty { background: transparent; color: var(--text-muted); border-style: dashed; box-shadow: none; }
    @media (max-width: 820px) { .station { grid-template-columns: 1fr; } }
  `,
})
export class RoutingVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly rows = ROWS;
  protected readonly tickets = TICKETS;
  protected readonly ticket = signal('/san-pham/42');
  protected readonly loggedIn = signal(false);
  private chunkLoaded = false;
  private lazyVisits = 0;

  protected readonly tl = createTimeline<Frame>(IDLE, {
    onEnter: (s) => {
      this.ctx.stepAnchor.set(s.anchor ?? null);
      if (s.tag === 'blocked') this.ctx.completeChallenge('rt-blocked');
      if (s.tag === 'passed') this.ctx.completeChallenge('rt-pass');
      if (s.tag === 'cached' && this.lazyVisits >= 2) this.ctx.completeChallenge('rt-lazy');
    },
  });

  protected depart(): void {
    const url = this.ticket();
    const base: Frame = { ticket: url, trying: null, tried: [], matched: null, guard: 'idle', cargo: 'none', platform: this.tl.frame().platform, train: 'depot' };
    const steps: Step<Frame>[] = [{ frame: base, caption: `Vé ${url}: router đọc URL và bắt đầu dò bảng giờ tàu từ trên xuống.`, duration: 1000 }];
    const tried: string[] = [];
    let hit: Row | null = null;
    let params: Record<string, string> = {};
    for (const r of ROWS) {
      const m = match(r, url);
      tried.push(r.id);
      steps.push({ frame: { ...base, trying: r.id, tried: [...tried], matched: m ? r.id : null, train: 'moving' }, caption: m ? `${r.path} khớp!${Object.keys(m).length ? ' Tham số: ' + JSON.stringify(m) : ''}` : `${r.path} không khớp → dò dòng tiếp theo.`, anchor: r.id, duration: m ? 1100 : 650 });
      if (m) {
        hit = r;
        params = m;
        break;
      }
    }
    const at = { ...base, tried, matched: hit!.id, train: 'moving' as const };
    if (hit!.guard) {
      steps.push({ frame: { ...at, guard: 'check' }, caption: 'Route có canActivate: nhân viên soát vé chạy authGuard()…', anchor: 'guard', duration: 1100 });
      if (!this.loggedIn()) {
        steps.push({ frame: { ...at, guard: 'block', train: 'stopped' }, caption: '⛔ authGuard trả về false: chưa đăng nhập → huỷ điều hướng, sân ga giữ nguyên.', anchor: 'guard', duration: 1400, sound: 'boop', tag: 'blocked' });
        this.tl.load(steps);
        return;
      }
      steps.push({ frame: { ...at, guard: 'pass' }, caption: '✅ authGuard trả về true: mời tàu vào ga.', anchor: 'guard', duration: 1000, sound: 'ting' });
    }
    let cargo: Frame['cargo'] = 'none';
    let tag: string | undefined = hit!.guard ? 'passed' : undefined;
    if (hit!.lazy) {
      this.lazyVisits++;
      if (!this.chunkLoaded) {
        steps.push({ frame: { ...at, cargo: 'loading' }, caption: 'Route lazy: loadComponent() kéo toa hàng chunk JS từ server (lần đầu).', anchor: 'r-lazy', duration: 1500 });
        this.chunkLoaded = true;
        tag = 'loaded';
      } else {
        tag = 'cached';
      }
      cargo = 'cached';
    }
    const p = Object.entries(params).map(([k, v]) => `${k} = '${v}'`).join(', ');
    steps.push({ frame: { ...at, cargo, guard: hit!.guard ? 'pass' : 'idle', train: 'arrived', platform: { comp: hit!.comp, params: p ? `input ${p}` : '' } }, caption: `Tàu cập sân ga: <router-outlet> hiển thị ${hit!.comp}${p ? ' với ' + p : ''}${tag === 'cached' ? ' (chunk đã có sẵn, không tải lại)' : ''}.`, anchor: 'outlet', duration: 1100, sound: 'ting', tag });
    this.tl.load(steps);
  }
}
