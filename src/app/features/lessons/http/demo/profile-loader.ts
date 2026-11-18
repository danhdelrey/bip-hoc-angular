import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

interface User {
  name: string;
  role: string;
}

@Component({
  selector: 'app-profile-loader',
  template: `
    <button (click)="load()">GET /api/me</button>
    @if (loading()) {
      <p>⏳ Đang gửi thư…</p>
    }
    @if (user(); as u) {
      <p>👋 {{ u.name }} ({{ u.role }})</p>
    }
    @if (error(); as e) {
      <p>❌ {{ e }}</p>
    }
  `,
})
export class ProfileLoader {
  private readonly http = inject(HttpClient);
  user = signal<User | null>(null);
  error = signal<string | null>(null);
  loading = signal(false);

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<User>('/api/me').subscribe({
      next: (u) => {
        this.user.set(u);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
