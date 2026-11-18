import { simulate } from './rxjs-flattening.visualizer';

const search = [
  { t: 0, label: 'a', lat: 1700 },
  { t: 300, label: 'an', lat: 500 },
  { t: 600, label: 'ang', lat: 900 },
];
const finished = (op: Parameters<typeof simulate>[0]) =>
  simulate(op, search)
    .filter((r) => r.state === 'done')
    .sort((a, b) => a.end - b.end)
    .map((r) => r.label);

describe('simulate (flattening operators)', () => {
  it('mergeMap: request cũ về sau cùng → race condition', () => {
    expect(finished('mergeMap')).toEqual(['an', 'ang', 'a']);
  });
  it('switchMap: huỷ request cũ, chỉ còn kết quả cuối', () => {
    expect(finished('switchMap')).toEqual(['ang']);
    expect(simulate('switchMap', search).filter((r) => r.state === 'cancelled').length).toBe(2);
  });
  it('concatMap: xếp hàng, giữ đúng thứ tự', () => {
    const r = simulate('concatMap', search);
    expect(r.map((x) => x.start)).toEqual([0, 1700, 2200]);
    expect(finished('concatMap')).toEqual(['a', 'an', 'ang']);
  });
  it('exhaustMap: bỏ qua giá trị mới khi đang bận', () => {
    expect(simulate('exhaustMap', search).map((r) => r.state)).toEqual(['done', 'ignored', 'ignored']);
  });
});
