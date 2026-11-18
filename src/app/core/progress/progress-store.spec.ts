import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProgressStore } from './progress-store';

describe('ProgressStore', () => {
  beforeEach(() => localStorage.clear());

  it('mở huy hiệu "Bước chân đầu tiên" khi xong bài đầu và lưu vào localStorage', () => {
    const store = TestBed.inject(ProgressStore);
    expect(store.completeLesson('signals')).toEqual(['first-lesson']);
    expect(store.completeLesson('signals')).toEqual([]);
    expect(JSON.parse(localStorage.getItem('bip.progress.v1')!).completed).toEqual(['signals']);
  });

  it('quiz đúng 100% mở huy hiệu một lần duy nhất', () => {
    const store = TestBed.inject(ProgressStore);
    expect(store.recordQuiz('signals', 3, 3)).toEqual(['perfect-quiz']);
    expect(store.recordQuiz('di', 3, 3)).toEqual([]);
  });
});
