import { Service, signal } from '@angular/core';
import { safeStorage } from '../storage/safe-storage';

const KEY = 'bip.sound';
export type SoundName = 'pop' | 'ting' | 'boop' | 'fanfare';

/**
 * Hiệu ứng âm thanh nhỏ tạo bằng WebAudio (không cần file âm thanh).
 * MẶC ĐỊNH TẮT — chỉ phát khi người dùng bật.
 */
@Service()
export class Sound {
  readonly enabled = signal<boolean>(safeStorage.read(KEY, false));
  private ctx?: AudioContext;

  toggle(): void {
    this.enabled.update((v) => !v);
    safeStorage.write(KEY, this.enabled());
    if (this.enabled()) this.play('ting');
  }

  play(name: SoundName): void {
    if (!this.enabled()) return;
    try {
      this.ctx ??= new AudioContext();
      const notes: Record<SoundName, [number, number][]> = {
        pop: [[520, 0.06]],
        boop: [[260, 0.12]],
        ting: [[880, 0.08], [1320, 0.14]],
        fanfare: [[523, 0.1], [659, 0.1], [784, 0.1], [1046, 0.25]],
      };
      let t = this.ctx.currentTime;
      for (const [freq, dur] of notes[name]) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = name === 'boop' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
        t += dur * 0.85;
      }
    } catch {
      /* trình duyệt không hỗ trợ — im lặng */
    }
  }
}
