import type { CheckApi, SimCtx } from './lab-runtime';
import { fmt } from './lab-runtime';

/**
 * Mô hình dữ liệu của khu luyện code (Code Lab) dùng chung cho mọi bài học.
 * Mỗi bài học khai báo một `LabModule` trong `features/lessons/<slug>/<slug>.lab.ts`
 * và gắn vào trang bằng `<app-lesson-lab slot="practice" ... [load]="...">`.
 */
export interface CheckResult {
  ok: boolean;
  msg: string;
}

export interface LabExercise {
  id: string;
  group: string;
  title: string;
  level: string;
  /** 0 = tự do, 1 = dễ, 2 = trung bình, 3 = khó */
  lv: 0 | 1 | 2 | 3;
  noCheck?: boolean;
  /** HTML do site viết (không chứa dữ liệu người dùng) */
  desc: string;
  /** Chuỗi code KHÔNG dùng backtick hay ${} để giữ nguyên khi đặt trong template literal */
  starter: string;
  solution?: string;
  hint?: string;
  explain?: string;
  /** thời gian chờ (ms) trước khi chấm */
  waitMs?: number;
  simulate?(s: SimCtx): void;
  check?(a: CheckApi, code: string): CheckResult;
}

export interface LabModule {
  title: string;
  /** Một câu mô tả phạm vi các bài luyện */
  subtitle: string;
  exercises: LabExercise[];
  /** Cheat sheet "tình huống → dùng gì" riêng của bài (HTML được phép trong cả hai cột) */
  cheatsheet?: [string, string][];
  /**
   * Globals bổ sung cho bài (vd. FormsModule) — tải lười cùng bài luyện.
   * Khoá bắt đầu bằng "__" không thành global: `__prepare(code, preview)` chạy trước mỗi lần chạy (vd. sinh CSS Tailwind).
   */
  extras?: () => Promise<Record<string, unknown>>;
}

/* ---------- helper viết check() gọn ---------- */
export const OK = (msg = ''): CheckResult => ({ ok: true, msg });
export const NO = (msg: string): CheckResult => ({ ok: false, msg });
export const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export const show = (v: unknown) => fmt(v);
/** Chuẩn hoá khoảng trắng để so sánh chữ hiển thị */
export const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
