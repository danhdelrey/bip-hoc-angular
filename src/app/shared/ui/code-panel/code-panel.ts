import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import type { CodeFile } from '../../../content/lesson.model';
import { LessonContext } from '../anchor/lesson-context';
import { Icon } from '../icon/icon';
import { type Tok, plain, tokenize } from './highlighter';
import { openInStackblitz } from './stackblitz';

/**
 * Khung code: tab nhiều file, syntax highlight (Shiki), highlight dòng.
 * Hover một dòng có anchor -> phần tương ứng trong visualizer sáng lên (và ngược lại).
 */
@Component({
  selector: 'app-code-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './code-panel.html',
  styleUrl: './code-panel.css',
})
export class CodePanel {
  readonly files = input.required<CodeFile[]>();
  readonly title = input('');
  /** Hiện nút "Mở trên StackBlitz" */
  readonly stackblitz = input(false);
  readonly stackblitzExtra = input<Record<string, string>>({});
  /** Khung code nhỏ gọn (dùng trong thẻ lỗi thường gặp) */
  readonly compact = input(false);

  protected readonly ctx = inject(LessonContext, { optional: true });
  protected readonly active = signal(0);
  protected readonly file = computed(() => this.files()[Math.min(this.active(), this.files().length - 1)]);
  protected readonly lines = signal<Tok[][]>([]);
  protected readonly copied = signal(false);

  constructor() {
    effect(async () => {
      const f = this.file();
      if (!f) return;
      this.lines.set(plain(f.code));
      try {
        const toks = await tokenize(f.code, f.lang);
        if (this.file() === f) this.lines.set(toks);
      } catch {
        /* giữ bản plain nếu highlight lỗi */
      }
    });
    // Visualizer đang chiếu anchor thuộc file khác -> tự chuyển tab
    effect(() => {
      const a = this.ctx?.highlighted();
      if (!a || this.compact()) return;
      const files = this.files();
      if (this.anchorAt(this.file(), a)) return;
      const idx = files.findIndex((f) => this.anchorAt(f, a));
      if (idx >= 0 && this.ctx?.stepAnchor() === a) this.active.set(idx);
    });
  }

  protected anchorOf(line: number): string | null {
    return this.file()?.anchors?.[line + 1] ?? null;
  }

  protected isHl(line: number): boolean {
    const a = this.anchorOf(line);
    return !!a && a === this.ctx?.highlighted();
  }

  protected enter(line: number): void {
    const a = this.anchorOf(line);
    if (a) this.ctx?.activeAnchor.set(a);
  }

  protected leave(): void {
    this.ctx?.activeAnchor.set(null);
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.file().code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    } catch {
      /* clipboard bị chặn */
    }
  }

  protected openBlitz(): void {
    void openInStackblitz(this.title(), this.files(), this.stackblitzExtra());
  }

  private anchorAt(f: CodeFile | undefined, a: string): boolean {
    return !!f?.anchors && Object.values(f.anchors).includes(a);
  }
}
