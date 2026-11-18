import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { AnchorDirective, LessonContext } from '../../../shared/ui/anchor/lesson-context';
import { Icon } from '../../../shared/ui/icon/icon';
import { StepPlayer } from '../../../shared/ui/step-player/step-player';
import { type Step, createTimeline } from '../../../shared/ui/step-player/step-timeline';

type Row = 0 | 1 | 2 | 3;
type Kind = 'interp' | 'prop' | 'event' | 'twoway';

interface Model {
  name: string;
  avatar: number;
  likes: number;
  nickname: string;
  /** những gì DOM đang hiển thị */
  h2: string;
  img: number;
  input: string;
  nickText: string;
}

interface Marble {
  row: Row;
  pos: 0 | 1; // 0 = phía Class, 1 = phía DOM
  kind: 'data' | 'event';
  label: string;
  land?: boolean;
}

interface Frame {
  m: Model;
  marble: Marble | null;
  flashCls: Row | null;
  flashDom: Row | null;
}

const NAMES = ['Mai', 'Long', 'Hà', 'Tú', 'Khoa'];
const AVATARS = ['cat', 'fox', 'owl'];

export const PIPES: { kind: Kind; label: string; dir: 'right' | 'left' | 'both'; title: string; info: string }[] = [
  { kind: 'interp', label: '{{ }}', dir: 'right', title: 'Interpolation', info: 'Một chiều Class → DOM. Lấy giá trị, biến thành chữ và chèn vào nội dung phần tử.' },
  { kind: 'prop', label: '[src]', dir: 'right', title: 'Property binding', info: 'Một chiều Class → DOM. Gán giá trị (giữ nguyên kiểu) vào một thuộc tính của phần tử, ở đây là src của <img>.' },
  { kind: 'event', label: '(click)', dir: 'left', title: 'Event binding', info: 'Một chiều DOM → Class. Khi sự kiện xảy ra trên phần tử, Angular gọi method trong class.' },
  { kind: 'twoway', label: '[(ngModel)]', dir: 'both', title: 'Two-way binding', info: 'Hai chiều: [ ] đưa dữ liệu xuống, ( ) đưa sự kiện lên. Nhớ mẹo "hộp chuối": hộp vuông bọc quả chuối tròn.' },
];

const fmtH2 = (m: Pick<Model, 'name' | 'likes'>) => `${m.name} · ❤ ${m.likes}`;

/** Visualizer: 4 ống binding giữa khối Class và khối DOM, bi mặt cười lăn đúng chiều. */
@Component({
  selector: 'app-data-binding-visualizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepPlayer, Icon, AnchorDirective],
  templateUrl: './data-binding.visualizer.html',
  styleUrl: './data-binding.visualizer.css',
})
export class DataBindingVisualizer {
  private readonly ctx = inject(LessonContext);
  protected readonly pipes = PIPES;
  protected readonly avatars = AVATARS;

  private model: Model = {
    name: 'Mai', avatar: 0, likes: 0, nickname: 'Mai Mít',
    h2: 'Mai · ❤ 0', img: 0, input: 'Mai Mít', nickText: 'Mai Mít',
  };

  protected readonly tl = createTimeline<Frame>(
    { m: this.model, marble: null, flashCls: null, flashDom: null },
    {
      onEnter: (s) => {
        this.ctx.stepAnchor.set(s.anchor ?? null);
        if (s.tag === 'twoway-done') this.ctx.completeChallenge('db-twoway');
        if (s.tag === 'like-done' && s.frame.m.likes >= 3) this.ctx.completeChallenge('db-likes3');
      },
    },
  );

  protected readonly selected = signal<Kind | null>(null);
  private typingTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.typingTimer));
  }

  protected pipeInfo(kind: Kind) {
    return PIPES.find((p) => p.kind === kind)!;
  }

  protected select(kind: Kind): void {
    this.selected.set(this.selected() === kind ? null : kind);
    if (kind === 'event') this.ctx.completeChallenge('db-pick-event');
  }

  // ---------- Các thao tác của người học -> chuỗi bước ----------

  protected renameInClass(): void {
    const start = this.model;
    const name = NAMES[(NAMES.indexOf(start.name) + 1) % NAMES.length];
    const after = { ...start, name };
    const done = { ...after, h2: fmtH2(after) };
    this.load([
      this.f(after, { row: 0, pos: 0, kind: 'data', label: `'${name}'` }, 0, null, `Trong class: name.set('${name}'). Signal name vừa đổi giá trị.`, 'interp', 900),
      this.f(after, { row: 0, pos: 1, kind: 'data', label: `'${name}'` }, null, null, 'Bi dữ liệu lăn qua ống {{ }} — một chiều, từ Class sang DOM.', 'interp', 1200),
      this.f(done, { row: 0, pos: 1, kind: 'data', label: `'${name}'`, land: true }, null, 0, `DOM cập nhật thẻ <h2> thành "${done.h2}". Xong!`, 'interp', 900, 'pop'),
    ]);
  }

  protected changeAvatar(): void {
    const start = this.model;
    const avatar = (start.avatar + 1) % AVATARS.length;
    const after = { ...start, avatar };
    const label = `'${AVATARS[avatar]}.svg'`;
    this.load([
      this.f(after, { row: 1, pos: 0, kind: 'data', label }, 1, null, `Trong class: avatarUrl.set(${label}).`, 'prop', 900),
      this.f(after, { row: 1, pos: 1, kind: 'data', label }, null, null, 'Bi lăn qua ống [src] — property binding gán thẳng vào thuộc tính src của <img>.', 'prop', 1200),
      this.f({ ...after, img: avatar }, { row: 1, pos: 1, kind: 'data', label, land: true }, null, 1, 'Ảnh trong DOM đổi ngay. Không cần đụng vào document.querySelector!', 'prop', 900, 'pop'),
    ]);
  }

  protected clickLike(): void {
    const start = this.model;
    const after = { ...start, likes: start.likes + 1 };
    const done = { ...after, h2: fmtH2(after) };
    this.load([
      this.f(start, { row: 2, pos: 1, kind: 'event', label: 'click' }, null, 2, 'Bạn bấm nút trong DOM → trình duyệt phát sự kiện click.', 'event', 800, 'pop'),
      this.f(start, { row: 2, pos: 0, kind: 'event', label: 'click' }, null, null, 'Bi sự kiện bay ngược qua ống (click) — từ DOM về Class.', 'event', 1100),
      this.f(after, { row: 2, pos: 0, kind: 'event', label: 'click', land: true }, 2, null, `Class chạy like(): likes.update(n => n + 1) → likes = ${after.likes}.`, 'event', 900),
      this.f(after, { row: 0, pos: 0, kind: 'data', label: String(after.likes) }, null, null, 'likes là signal mà template đang đọc → Angular biết phải cập nhật {{ }}.', 'interp', 900),
      this.f(after, { row: 0, pos: 1, kind: 'data', label: String(after.likes) }, null, null, 'Bi dữ liệu lăn qua ống {{ }} xuống DOM.', 'interp', 1100),
      { ...this.f(done, { row: 0, pos: 1, kind: 'data', label: String(after.likes), land: true }, null, 0, `<h2> hiện "${done.h2}". Sự kiện → dữ liệu → giao diện!`, 'interp', 900, 'pop'), tag: 'like-done' },
    ]);
  }

  protected onType(value: string): void {
    // Ô input thật hiển thị ngay chữ bạn gõ; bi lăn sau khi bạn dừng tay một chút
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => this.typed(value), 380);
  }

  private typed(value: string): void {
    const start = { ...this.model, input: value };
    const after = { ...start, nickname: value };
    const done = { ...after, nickText: value };
    const label = `'${value.length > 10 ? value.slice(0, 10) + '…' : value}'`;
    this.load([
      this.f(start, { row: 3, pos: 1, kind: 'event', label }, null, 3, 'Bạn gõ vào <input> → ngModel phát sự kiện ngModelChange.', 'twoway', 800),
      this.f(start, { row: 3, pos: 0, kind: 'event', label }, null, null, 'Nửa "( )" của hộp chuối: bi sự kiện bay lên Class.', 'twoway', 1100),
      this.f(after, { row: 3, pos: 0, kind: 'event', label, land: true }, 3, null, `Class: nickname.set(${label}). Với signal, Angular tự gọi .set() cho bạn.`, 'twoway', 900),
      this.f(after, { row: 3, pos: 0, kind: 'data', label }, null, null, 'Nửa "[ ]" của hộp chuối: giá trị mới chảy ngược xuống DOM.', 'twoway', 800),
      this.f(after, { row: 3, pos: 1, kind: 'data', label }, null, null, 'Bi dữ liệu lăn xuống: input và dòng "Biệt danh" luôn đồng bộ với class.', 'twoway', 1100),
      { ...this.f(done, { row: 3, pos: 1, kind: 'data', label, land: true }, null, 3, 'Hai chiều trọn vẹn: DOM → Class → DOM.', 'twoway', 900, 'pop'), tag: 'twoway-done' },
    ]);
  }

  protected setNickFromClass(): void {
    const start = this.model;
    const value = start.nickname === 'Bíp Bíp' ? 'Mai Mít' : 'Bíp Bíp';
    const after = { ...start, nickname: value };
    const done = { ...after, input: value, nickText: value };
    this.load([
      this.f(after, { row: 3, pos: 0, kind: 'data', label: `'${value}'` }, 3, null, `Lần này Class tự đổi: nickname.set('${value}').`, 'twoway', 900),
      this.f(after, { row: 3, pos: 1, kind: 'data', label: `'${value}'` }, null, null, 'Ống [(ngModel)] cũng chảy chiều Class → DOM.', 'twoway', 1200),
      this.f(done, { row: 3, pos: 1, kind: 'data', label: `'${value}'`, land: true }, null, 3, 'Ô input tự hiện giá trị mới, bạn không phải gõ.', 'twoway', 900, 'pop'),
    ]);
  }

  protected reset(): void {
    this.model = { name: 'Mai', avatar: 0, likes: 0, nickname: 'Mai Mít', h2: 'Mai · ❤ 0', img: 0, input: 'Mai Mít', nickText: 'Mai Mít' };
    this.tl.reset({ m: this.model, marble: null, flashCls: null, flashDom: null });
    this.ctx.stepAnchor.set(null);
  }

  private f(
    m: Model, marble: Marble | null, flashCls: Row | null, flashDom: Row | null,
    caption: string, anchor: Kind, duration: number, sound?: 'pop',
  ): Step<Frame> {
    return { frame: { m, marble, flashCls, flashDom }, caption, anchor, duration, sound };
  }

  private load(steps: Step<Frame>[]): void {
    this.model = steps[steps.length - 1].frame.m;
    this.tl.load(steps);
  }
}
