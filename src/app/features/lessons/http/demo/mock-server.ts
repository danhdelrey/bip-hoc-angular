import { Service, signal } from '@angular/core';

// "Server" giả lập — đổi status/latency để thử các tình huống
@Service()
export class MockServer {
  readonly status = signal<200 | 401 | 500>(200);
  readonly latency = signal(600);
}
