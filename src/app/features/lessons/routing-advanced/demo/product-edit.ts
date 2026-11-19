import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Product } from './product-api';
import type { CanLeave } from './route-fns';

@Component({
  selector: 'app-product-edit',
  imports: [RouterLink],
  template: `
    <label>Tên: <input [value]="name()" (input)="name.set($any($event.target).value)" /></label>
    <button type="button" (click)="save()">Lưu</button> <a routerLink="..">Huỷ</a>
    @if (dirty()) { <small>● chưa lưu</small> }
    @if (asking()) {
      <p class="ask">Có thay đổi chưa lưu. Rời trang?
        <button type="button" (click)="answer(true)">Rời đi</button>
        <button type="button" (click)="answer(false)">Ở lại</button>
      </p>
    }
  `,
})
export class ProductEdit implements CanLeave {
  readonly product = input.required<Product>();
  readonly name = linkedSignal(() => this.product().name);
  readonly saved = signal(false);
  readonly dirty = computed(() => !this.saved() && this.name() !== this.product().name);
  readonly asking = signal(false);
  private resolveAsk?: (ok: boolean) => void;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  save() {
    this.product().name = this.name(); // demo: "lưu" vào dữ liệu giả
    this.saved.set(true);
    this.router.navigate(['..'], { relativeTo: this.route }); // điều hướng bằng code: /sp/:id/sua → /sp/:id
  }

  canLeave(): boolean | Promise<boolean> {
    if (!this.dirty()) return true;
    this.asking.set(true);
    return new Promise((resolve) => (this.resolveAsk = resolve));
  }

  answer(ok: boolean) {
    this.asking.set(false);
    this.resolveAsk?.(ok);
  }
}
