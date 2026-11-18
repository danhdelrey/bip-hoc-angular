export type BadgeId = 'first-lesson' | 'five-lessons' | 'perfect-quiz' | 'challenger' | 'all-done';

export interface BadgeDef {
  id: BadgeId;
  title: string;
  description: string;
  /** màu nền huy hiệu (token) */
  color: string;
  icon: 'footprint' | 'compass' | 'star' | 'bolt' | 'crown';
}

export const BADGES: readonly BadgeDef[] = [
  { id: 'first-lesson', title: 'Bước chân đầu tiên', description: 'Hoàn thành bài học đầu tiên', color: 'var(--c-data)', icon: 'footprint' },
  { id: 'five-lessons', title: 'Nhà thám hiểm', description: 'Hoàn thành 5 bài học', color: 'var(--c-brand)', icon: 'compass' },
  { id: 'perfect-quiz', title: 'Thần đồng quiz', description: 'Đúng 100% một bài quiz', color: 'var(--c-signal)', icon: 'star' },
  { id: 'challenger', title: 'Chiến binh thử thách', description: 'Hoàn thành mọi thử thách của một bài', color: 'var(--c-event)', icon: 'bolt' },
  { id: 'all-done', title: 'Bậc thầy Angular', description: 'Hoàn thành toàn bộ lộ trình', color: 'var(--c-di)', icon: 'crown' },
];

export const badgeById = (id: BadgeId) => BADGES.find((b) => b.id === id)!;
