import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Feedback } from '../../../core/feedback/feedback';

interface Piece {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; w: number; h: number;
  color: string; round: boolean; life: number;
}

const COLORS = ['#3ddc97', '#ff9f43', '#a78bfa', '#ffd43b', '#4cc9f0', '#ff8fab'];

/** Pháo giấy canvas — nhẹ, tự dừng khi hết hạt. Feedback đã tự tắt khi prefers-reduced-motion. */
@Component({
  selector: 'app-confetti',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #cv aria-hidden="true"></canvas>`,
  styles: `canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 1000; }`,
})
export class Confetti {
  private readonly feedback = inject(Feedback);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private pieces: Piece[] = [];
  private raf = 0;

  constructor() {
    effect(() => {
      const burst = this.feedback.confetti();
      if (burst) this.fire(burst.size === 'big' ? 320 : 110, burst.size === 'big');
    });
  }

  private fire(count: number, big: boolean): void {
    const cv = this.canvas().nativeElement;
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const origins = big ? [innerWidth * 0.2, innerWidth * 0.5, innerWidth * 0.8] : [innerWidth * 0.5];
    for (let i = 0; i < count; i++) {
      const ox = origins[i % origins.length];
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const sp = 7 + Math.random() * (big ? 11 : 8);
      this.pieces.push({
        x: ox, y: innerHeight * (big ? 0.85 : 0.7),
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        w: 7 + Math.random() * 7, h: 5 + Math.random() * 6,
        color: COLORS[i % COLORS.length], round: Math.random() < 0.3,
        life: 160 + Math.random() * 80,
      });
    }
    if (!this.raf) this.loop(ctx);
  }

  private loop(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of this.pieces) {
      p.vy += 0.22;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#1e1b3a';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.beginPath();
      if (p.round) ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      else ctx.rect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    this.pieces = this.pieces.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    if (this.pieces.length) {
      this.raf = requestAnimationFrame(() => this.loop(ctx));
    } else {
      this.raf = 0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }
}
