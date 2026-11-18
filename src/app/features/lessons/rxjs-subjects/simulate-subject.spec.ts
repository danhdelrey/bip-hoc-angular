import { type Kind, simulateShare, simulateSubject } from './rxjs-subjects.visualizer';

/** giá trị mỗi subscriber nhận được (bỏ dấu complete) */
const got = (kind: Kind, sub: string) =>
  simulateSubject(kind)
    .filter((d) => d.sub === sub && d.v !== '|')
    .map((d) => d.v);

describe('simulateSubject — hành vi 4 loại Subject', () => {
  it('Subject: subscriber đến muộn không nhận giá trị cũ', () => {
    expect(got('Subject', 'A')).toEqual([3, 4]);
    expect(got('Subject', 'C')).toEqual([]);
  });
  it('BehaviorSubject: nhận ngay giá trị hiện tại, sau complete thì không', () => {
    expect(got('BehaviorSubject', 'B')).toEqual([3, 4]);
    expect(got('BehaviorSubject', 'C')).toEqual([]);
  });
  it('ReplaySubject(2): phát lại 2 giá trị cuối, kể cả sau complete', () => {
    expect(got('ReplaySubject', 'A')).toEqual([1, 2, 3, 4]);
    expect(got('ReplaySubject', 'C')).toEqual([3, 4]);
  });
  it('AsyncSubject: chỉ phát giá trị cuối khi complete', () => {
    expect(got('AsyncSubject', 'A')).toEqual([4]);
    expect(got('AsyncSubject', 'C')).toEqual([4]);
  });
});

describe('simulateShare', () => {
  it('share() không giúp khi subscriber đến sau lúc nguồn đã complete', () => {
    expect(simulateShare('share', 500).reqs.length).toBe(1);
    expect(simulateShare('share', 1500).reqs.length).toBe(2);
  });
  it('shareReplay(1) cache kết quả cho subscriber đến sau', () => {
    const r = simulateShare('shareReplay', 1500);
    expect(r.reqs.length).toBe(1);
    expect(r.bCached).toBe(true);
  });
});
