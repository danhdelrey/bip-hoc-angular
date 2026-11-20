import { getPlatform, type PlatformRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { explainNg, fmt } from './lab-runtime';

/**
 * Bài luyện Testing: TestBed thật + một bộ chạy test nhỏ kiểu Jasmine/Vitest (describe, it, beforeEach, expect, fn).
 * Test môi trường dùng chính platform của trang (platformBrowserTesting() không tạo được khi trang đã có platform),
 * TestBed ở chế độ zoneless như mặc định của Angular. Kết quả in ra Console: "✓ tên" / "✗ tên — lý do",
 * dòng cuối "Kết quả: đạt/tổng test đạt".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type Fn = (...a: unknown[]) => unknown;

let envReady = false;
function ensureEnv(): void {
  if (envReady) return;
  TestBed.initTestEnvironment(BrowserTestingModule, getPlatform() as PlatformRef, { teardown: { destroyAfterEach: true } });
  envReady = true;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => deepEqual((a as Any)[k], (b as Any)[k]));
}

interface Suite { name: string; befores: Fn[]; afters: Fn[] }
interface TestCase { name: string; fn: Fn; suites: Suite[] }

function makeRunner(g: Record<string, Any>): Record<string, unknown> {
  const log = g['log'] as (...a: unknown[]) => void;
  const root: Suite = { name: '', befores: [], afters: [] };
  const stack: Suite[] = [root];
  const tests: TestCase[] = [];
  let scheduled = false;
  let expects = 0;
  const summary = g['signal']('chưa chạy');
  g['ui'].text('Kết quả test', summary);

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    g['setTimeout'](runAll, 0);
  };

  async function runAll() {
    try {
      ensureEnv();
    } catch (e) {
      log('✗ Không khởi tạo được TestBed — ' + (e as Error).message);
      return;
    }
    let pass = 0;
    for (const t of tests) {
      const full = [...t.suites.map((s) => s.name).filter(Boolean), t.name].join(' › ');
      expects = 0;
      try {
        TestBed.resetTestingModule();
        for (const s of t.suites) for (const b of s.befores) await b();
        await t.fn();
        for (const s of [...t.suites].reverse()) for (const a of s.afters) await a();
        if (expects === 0) throw new Error('test không có expect nào nên không kiểm tra được gì');
        pass++;
        log('✓ ' + full);
      } catch (e) {
        log('✗ ' + full + ' — ' + explainNg((e as Error)?.message ?? String(e)));
      }
    }
    try { TestBed.resetTestingModule(); } catch { /* bỏ qua */ }
    summary.set(pass + '/' + tests.length + ' đạt' + (pass === tests.length ? ' ✓' : ''));
    log('Kết quả: ' + pass + '/' + tests.length + ' test đạt');
  }
  g['destroyRef']?.onDestroy?.(() => { try { TestBed.resetTestingModule(); } catch { /* bỏ qua */ } });

  const describe = (name: string, body: () => void) => {
    const suite: Suite = { name: String(name), befores: [], afters: [] };
    stack.push(suite);
    try { body(); } finally { stack.pop(); }
    schedule();
  };
  const it = (name: string, fn: Fn) => {
    tests.push({ name: String(name), fn, suites: [...stack] });
    schedule();
  };
  const beforeEach = (fn: Fn) => stack[stack.length - 1].befores.push(fn);
  const afterEach = (fn: Fn) => stack[stack.length - 1].afters.push(fn);

  const fn = (impl?: Fn) => {
    const mock: Any = (...a: unknown[]) => {
      mock.calls.push(a);
      return impl ? impl(...a) : mock.ret;
    };
    mock.calls = [] as unknown[][];
    mock.isMock = true;
    mock.mockReturnValue = (v: unknown) => { mock.ret = v; return mock; };
    return mock;
  };

  const expect = (actual: unknown) => {
    const make = (neg: boolean) => {
      const assert = (ok: boolean, msg: string) => {
        expects++;
        if (ok === neg) throw new Error((neg ? 'mong đợi KHÔNG: ' : 'mong đợi: ') + msg);
      };
      const calls = () => {
        if (!(actual as Any)?.isMock) throw new Error('toHaveBeenCalled… chỉ dùng với hàm tạo bằng fn()');
        return (actual as Any).calls as unknown[][];
      };
      return {
        toBe: (v: unknown) => assert(Object.is(actual, v), fmt(actual) + ' toBe ' + fmt(v)),
        toEqual: (v: unknown) => assert(deepEqual(actual, v), fmt(actual) + ' toEqual ' + fmt(v)),
        toBeTruthy: () => assert(!!actual, fmt(actual) + ' là truthy'),
        toBeFalsy: () => assert(!actual, fmt(actual) + ' là falsy'),
        toBeNull: () => assert(actual === null, fmt(actual) + ' là null'),
        toBeDefined: () => assert(actual !== undefined, fmt(actual) + ' khác undefined'),
        toContain: (v: unknown) => assert(typeof actual === 'string' ? actual.includes(String(v)) : Array.isArray(actual) && actual.some((x) => deepEqual(x, v)), fmt(actual) + ' chứa ' + fmt(v)),
        toHaveLength: (n: number) => assert((actual as Any)?.length === n, 'độ dài ' + (actual as Any)?.length + ' là ' + n),
        toBeGreaterThan: (n: number) => assert((actual as number) > n, fmt(actual) + ' > ' + n),
        toHaveBeenCalled: () => assert(calls().length > 0, 'hàm đã được gọi (đang: ' + calls().length + ' lần)'),
        toHaveBeenCalledTimes: (n: number) => assert(calls().length === n, 'hàm được gọi ' + n + ' lần (đang: ' + calls().length + ')'),
        toHaveBeenCalledWith: (...args: unknown[]) => assert(calls().some((c) => deepEqual(c, args)), 'hàm được gọi với ' + fmt(args) + ' (các lần gọi: ' + fmt(calls()) + ')'),
      };
    };
    return { ...make(false), not: make(true) };
  };

  return { describe, it, test: it, beforeEach, afterEach, expect, fn };
}

export function testingExtras(): Record<string, unknown> {
  return {
    TestBed,
    HttpClient,
    provideHttpClient,
    provideHttpClientTesting,
    HttpTestingController,
    __globals: (g: Record<string, unknown>) => makeRunner(g),
  };
}
