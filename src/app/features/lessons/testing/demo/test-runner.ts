import { Component, PlatformRef, inject, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { type TestResult, runAll } from './vitest-lite';
import './product-card.lesson-spec';
import './cart.service.lesson-spec';

let envReady = false;

/** Chạy các file spec thật bằng TestBed ngay trong trình duyệt */
@Component({
  selector: 'app-test-runner',
  template: `
    <button type="button" (click)="run()" [disabled]="running()">{{ running() ? 'Đang chạy…' : '▶ Chạy test' }}</button>
    @if (results().length) {
      <p><b>{{ passed() }}/{{ results().length }} passed</b> · {{ total() }} ms</p>
    }
    <ul>
      @for (r of results(); track $index) {
        <li [class.fail]="!r.ok">{{ r.ok ? '✓' : '✗' }} {{ r.suite }} › {{ r.name }} <small>{{ r.ms }} ms</small>
          @if (r.error) { <div class="err">{{ r.error }}</div> }
        </li>
      }
    </ul>
  `,
  styles: `
    ul { margin: 6px 0; padding-left: 0; list-style: none; font-family: ui-monospace, monospace; font-size: 13px; }
    li { padding: 2px 0; color: #15803d; }
    li.fail { color: #b91c1c; }
    small { color: #64748b; }
    .err { margin-left: 18px; color: #b91c1c; }
  `,
})
export class TestRunner {
  private readonly platform = inject(PlatformRef);
  readonly results = signal<TestResult[]>([]);
  readonly running = signal(false);
  readonly passed = () => this.results().filter((r) => r.ok).length;
  readonly total = () => this.results().reduce((s, r) => s + r.ms, 0);

  async run() {
    if (!envReady) {
      // Dùng lại platform của chính trang này làm môi trường test
      TestBed.initTestEnvironment(BrowserTestingModule, this.platform, { teardown: { destroyAfterEach: true } });
      envReady = true;
    }
    this.running.set(true);
    this.results.set([]);
    await runAll(
      () => TestBed.resetTestingModule(),
      (r) => this.results.update((list) => [...list, r]),
    );
    this.running.set(false);
  }
}
