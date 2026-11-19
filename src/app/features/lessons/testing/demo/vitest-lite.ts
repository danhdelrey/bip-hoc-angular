/**
 * Bộ chạy test siêu nhỏ, cùng API với Vitest (describe / it / expect / vi.fn),
 * để chạy spec THẬT ngay trong trình duyệt. Trong dự án thật bạn dùng Vitest qua `ng test`.
 */
type Fn = () => unknown | Promise<unknown>;
interface Suite { name: string; tests: { name: string; fn: Fn }[]; before: Fn[]; after: Fn[] }
export interface TestResult { suite: string; name: string; ok: boolean; ms: number; error?: string }

const suites: Suite[] = [];
let current: Suite | null = null;

export function describe(name: string, body: () => void): void {
  const suite: Suite = { name, tests: [], before: [], after: [] };
  suites.push(suite);
  const prev = current;
  current = suite;
  body();
  current = prev;
}
export const it = (name: string, fn: Fn) => current!.tests.push({ name, fn });
export const beforeEach = (fn: Fn) => current!.before.push(fn);
export const afterEach = (fn: Fn) => current!.after.push(fn);

export interface Mock<A extends unknown[] = any[], R = any> {
  (...args: A): R;
  mock: { calls: A[] };
  mockClear(): void;
}
export const vi = {
  fn<A extends unknown[] = any[], R = any>(impl?: (...args: A) => R): Mock<A, R> {
    const calls: A[] = [];
    const f = ((...args: A) => {
      calls.push(args);
      return impl?.(...args) as R;
    }) as Mock<A, R>;
    f.mock = { calls };
    f.mockClear = () => void (calls.length = 0);
    return f;
  },
};

const show = (v: unknown) => (typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v) ?? String(v));
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function expect(actual: any) {
  const check = (pass: boolean, msg: string, negate: boolean) => {
    if (pass === negate) throw new Error(negate ? `Không mong đợi: ${msg}` : msg);
  };
  const matchers = (negate: boolean) => ({
    toBe: (exp: unknown) => check(Object.is(actual, exp), `mong đợi ${show(exp)}, nhận ${show(actual)}`, negate),
    toEqual: (exp: unknown) => check(same(actual, exp), `mong đợi ${show(exp)}, nhận ${show(actual)}`, negate),
    toContain: (exp: unknown) => check(actual?.includes?.(exp), `mong đợi ${show(actual)} chứa ${show(exp)}`, negate),
    toBeTruthy: () => check(!!actual, `mong đợi giá trị truthy, nhận ${show(actual)}`, negate),
    toHaveBeenCalled: () => check(actual.mock.calls.length > 0, 'mong đợi hàm mock đã được gọi', negate),
    toHaveBeenCalledTimes: (n: number) => check(actual.mock.calls.length === n, `mong đợi gọi ${n} lần, thực tế ${actual.mock.calls.length}`, negate),
    toHaveBeenCalledWith: (...args: unknown[]) =>
      check(actual.mock.calls.some((c: unknown[]) => same(c, args)), `mong đợi được gọi với ${show(args)}`, negate),
  });
  return { ...matchers(false), not: matchers(true) };
}

/** Chạy toàn bộ suite đã đăng ký; `afterTest` để dọn môi trường (ví dụ TestBed.resetTestingModule) */
export async function runAll(afterTest: () => void, onResult: (r: TestResult) => void): Promise<void> {
  for (const s of suites) {
    for (const t of s.tests) {
      const t0 = performance.now();
      let error: string | undefined;
      try {
        for (const b of s.before) await b();
        await t.fn();
        for (const a of s.after) await a();
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      } finally {
        afterTest();
      }
      onResult({ suite: s.name, name: t.name, ok: !error, ms: Math.round(performance.now() - t0), error });
    }
  }
}
