import { Component, Injector, afterNextRender, computed, inject, signal } from '@angular/core';

interface Product {
  id: number;
  name: string;
}
const ALL: Product[] = Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `Sản phẩm ${i}` }));

@Component({
  selector: 'app-fast-list',
  template: `
    <input placeholder="Lọc, ví dụ 42" aria-label="Lọc sản phẩm" (input)="onFilter($any($event.target).value)" />
    <p>{{ visible().length }} kết quả hiển thị · cập nhật mất {{ lastMs() }} ms</p>
    <ul>
      @for (p of visible(); track p.id) {
        <li>{{ p.name }}</li>
      }
    </ul>
  `,
  styles: `ul { max-height: 150px; overflow: auto; }`,
})
export class FastList {
  private readonly injector = inject(Injector);
  private readonly query = signal('');

  // computed: chỉ lọc lại khi query đổi, không phải mỗi lần change detection
  visible = computed(() => ALL.filter((p) => p.name.includes(this.query())).slice(0, 200));
  lastMs = signal(0);

  onFilter(q: string) {
    const t0 = performance.now();
    this.query.set(q);
    afterNextRender(() => this.lastMs.set(Math.round(performance.now() - t0)), { injector: this.injector });
  }
}
