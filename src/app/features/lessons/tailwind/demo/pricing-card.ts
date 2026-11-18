import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-pricing-card',
  template: `
    <article class="@container max-w-sm rounded-2xl border-2 border-slate-800 bg-white p-5 shadow-[5px_5px_0_#1e1b3a]">
      <div class="flex flex-col gap-3 @xs:flex-row @xs:items-center">
        <span class="grid size-14 place-items-center rounded-full bg-sky-300 text-2xl">🤖</span>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-slate-900">Gói Bíp Pro</h3>
          <p class="text-sm text-slate-600">{{ yearly() ? '990k / năm' : '99k / tháng' }}</p>
        </div>
      </div>
      <button
        class="mt-4 w-full rounded-xl border-2 border-slate-800 px-4 py-2 font-bold text-slate-900 transition hover:-translate-y-0.5"
        [class.bg-amber-300]="!subscribed()"
        [class.bg-emerald-300]="subscribed()"
        (click)="subscribed.set(!subscribed())"
      >
        {{ subscribed() ? '✓ Đã đăng ký' : 'Đăng ký ngay' }}
      </button>
      <label class="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" class="size-4 accent-sky-500" [checked]="yearly()" (change)="yearly.set(!yearly())" />
        Thanh toán theo năm
      </label>
    </article>
  `,
})
export class PricingCard {
  subscribed = signal(false);
  yearly = signal(false);
}
