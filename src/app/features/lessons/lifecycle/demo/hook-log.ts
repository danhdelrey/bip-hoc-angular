import { Service, signal } from '@angular/core';

@Service()
export class HookLog {
  readonly lines = signal<string[]>([]);

  add(line: string) {
    // Ghi ở microtask kế tiếp: hook chạy GIỮA lúc Angular đang vẽ,
    // đổi state hiển thị ngay lúc đó sẽ gây lỗi ExpressionChanged.
    queueMicrotask(() => this.lines.update((l) => [...l, line].slice(-8)));
  }
}
