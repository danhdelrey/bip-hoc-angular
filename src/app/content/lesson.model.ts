import type { MascotMood } from '../shared/ui/mascot/mascot';

export type CodeLang = 'angular-ts' | 'angular-html' | 'typescript' | 'css' | 'tsx';

/** Một file code mẫu hiển thị cho người học. */
export interface CodeFile {
  name: string;
  lang: CodeLang;
  code: string;
  /** dòng (bắt đầu từ 1) -> id phần tử trong visualizer, dùng cho hover hai chiều */
  anchors?: Record<number, string>;
}

export interface Challenge {
  id: string;
  title: string;
  hint: string;
  /** Lời khen của Bíp khi hoàn thành */
  praise: string;
}

export interface Pitfall {
  title: string;
  wrong: { lang: CodeLang; code: string };
  right: { lang: CodeLang; code: string };
  explain: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  correct: number;
  explain: string;
}

/** Toàn bộ nội dung CHỮ của một bài — tách khỏi template để dễ sửa / thêm bài. */
export interface LessonContent {
  slug: string;
  metaphor: string;
  metaphorMood?: MascotMood;
  intro: string;
  visualizer: { title: string; hint: string };
  code: CodeFile[];
  /** Ghi chú ngắn đặt cạnh khung Kết quả */
  liveNote?: string;
  challenges: Challenge[];
  pitfalls: Pitfall[];
  quiz: QuizItem[];
  doneMessage: string;
  /** Các file bổ sung chỉ dùng khi mở StackBlitz (vd. main.ts riêng) */
  stackblitzExtra?: Record<string, string>;
}

export interface LessonMeta {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  icon: string;
  available: boolean;
}
