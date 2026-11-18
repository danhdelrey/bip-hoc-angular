/**
 * localStorage có thể ném lỗi (chế độ riêng tư, iframe sandbox, hết quota...).
 * Mọi truy cập đều đi qua đây và được bọc try/catch.
 */
export const safeStorage = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = globalThis.localStorage?.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key: string, value: unknown): boolean {
    try {
      globalThis.localStorage?.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): void {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      /* bỏ qua */
    }
  },
};
