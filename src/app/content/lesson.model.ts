import type { MascotMood } from '../shared/ui/mascot/mascot';

export type CodeLang = 'angular-ts' | 'angular-html' | 'typescript' | 'css';

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
  /** Định nghĩa chuyên ngành ngắn gọn — Bíp nói ở đầu bài */
  definition: string;
  mascotMood?: MascotMood;
  /** Ẩn dụ chỉ dùng kèm ví dụ (visualizer): câu dẫn + bảng ánh xạ hình ảnh → thuật ngữ */
  analogy: { text: string; map: [string, string][] };
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
  /** core = lộ trình chính; advanced = bài trên đảo phụ nâng cao */
  tier?: 'core' | 'advanced';
  /** tên đảo phụ (chỉ với bài nâng cao) */
  island?: string;
}
