import type { LessonContent } from '../../../content/lesson.model';

const AVATAR_CAT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#ffd43b" stroke="#1e1b3a" stroke-width="3"/><circle cx="24" cy="30" r="3.5"/><circle cx="40" cy="30" r="3.5"/><path d="M28 39q4 4 8 0" fill="none" stroke="#1e1b3a" stroke-width="3"/></svg>`;

export const PROFILE_CARD_TS = `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-card',
  imports: [FormsModule],
  templateUrl: './profile-card.html',
})
export class ProfileCard {
  name = signal('Mai');
  avatarUrl = signal('avatars/cat.svg');
  likes = signal(0);
  nickname = signal('Mai Mít');

  like() {
    this.likes.update((n) => n + 1);
  }
}`;

export const PROFILE_CARD_HTML = `<h2>{{ name() }} · ❤ {{ likes() }}</h2>
<img [src]="avatarUrl()" alt="Ảnh đại diện" width="64" />
<button (click)="like()">❤ Thích</button>
<input [(ngModel)]="nickname" aria-label="Biệt danh" />
<p>Biệt danh: {{ nickname() }}</p>`;

export const DATA_BINDING: LessonContent = {
  slug: 'data-binding',
  definition:
    'Data binding là cơ chế tự động đồng bộ dữ liệu giữa component class và DOM.',
  analogy: {
    text: 'Ví dụ vẽ mỗi loại binding thành một đường ống nối Class với DOM; viên bi lăn theo chiều dữ liệu đi.',
    map: [
      ['Bể chứa', 'component class'],
      ['Vòi ngoài sân', 'DOM'],
      ['Ống chảy xuống', '{{ }} và [property]'],
      ['Ống bơm lên', '(event)'],
      ['Ống hai chiều', '[(ngModel)]'],
      ['Viên bi', 'giá trị hoặc sự kiện'],
    ],
  },
  mascotMood: 'wave',
  intro:
    'Angular có 4 dạng binding: interpolation {{ }} và property binding [ ] đưa dữ liệu từ class xuống DOM, event binding ( ) đưa sự kiện từ DOM về class, two-way binding [( )] kết hợp cả hai chiều. Sau mỗi sự kiện, các binding được đánh giá lại để DOM khớp với state.',
  visualizer: {
    title: 'Ống nối Class ↔ DOM',
    hint: 'Bấm các nút điều khiển, bấm nút ❤ hoặc gõ vào ô input bên DOM. Bấm vào một ống để đọc giải thích.',
  },
  code: [
    {
      name: 'profile-card.ts',
      lang: 'angular-ts',
      code: PROFILE_CARD_TS,
      anchors: { 10: 'interp', 11: 'prop', 12: 'event', 13: 'twoway', 15: 'event', 16: 'event' },
    },
    {
      name: 'profile-card.html',
      lang: 'angular-html',
      code: PROFILE_CARD_HTML,
      anchors: { 1: 'interp', 2: 'prop', 3: 'event', 4: 'twoway', 5: 'twoway' },
    },
  ],
  liveNote: 'Đây là component thật đang chạy, đúng code bên trái. Bấm ❤ và gõ biệt danh thử xem.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { ProfileCard } from './app/profile-card';

bootstrapApplication(ProfileCard).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>Data binding</title></head>
<body><app-profile-card></app-profile-card></body>
</html>
`,
    'public/avatars/cat.svg': AVATAR_CAT,
  },
  challenges: [
    {
      id: 'db-twoway',
      title: 'Gõ một biệt danh mới vào ô input bên DOM và xem bi chạy cả hai chiều trên ống [(ngModel)].',
      hint: 'Ô input nằm ở hàng cuối cột DOM. Gõ xong dừng tay chút xíu là bi lăn ngay.',
      praise: 'Chuẩn! Two-way = sự kiện đi lên + dữ liệu đi xuống.',
    },
    {
      id: 'db-likes3',
      title: 'Bấm nút ❤ Thích cho tới khi likes đạt 3. Để ý: sau mỗi sự kiện, ống {{ }} cũng chạy lại!',
      hint: 'Nút ❤ nằm trong cột DOM. Mỗi lần bấm, bi cam bay về Class, rồi bi xanh chạy lại xuống <h2>.',
      praise: 'Đỉnh! Sự kiện đổi dữ liệu, dữ liệu đổi thì DOM tự cập nhật.',
    },
    {
      id: 'db-pick-event',
      title: 'Bấm chọn ống chỉ chảy MỘT CHIỀU từ DOM về Class.',
      hint: 'Ống màu cam, tên có dấu ngoặc tròn ( ). Ngoặc tròn = sự kiện đi ra khỏi phần tử.',
      praise: 'Đúng rồi: (event) binding chỉ đưa sự kiện từ DOM về Class.',
    },
  ],
  pitfalls: [
    {
      title: 'Quên dấu () khi đọc signal trong template',
      explain: 'Signal là một hàm getter. Viết {{ name }} sẽ in ra cả cái hàm thay vì giá trị, và Angular không theo dõi thay đổi.',
      wrong: { lang: 'angular-html', code: `<h2>{{ name }}</h2>` },
      right: { lang: 'angular-html', code: `<h2>{{ name() }}</h2>` },
    },
    {
      title: 'Dùng [(ngModel)] mà quên import FormsModule',
      explain: 'ngModel là directive nằm trong FormsModule. Thiếu import, template báo lỗi "Can\'t bind to \'ngModel\'".',
      wrong: { lang: 'angular-ts', code: `@Component({\n  selector: 'app-profile-card',\n  templateUrl: './profile-card.html',\n})` },
      right: { lang: 'angular-ts', code: `@Component({\n  selector: 'app-profile-card',\n  imports: [FormsModule],\n  templateUrl: './profile-card.html',\n})` },
    },
    {
      title: 'Viết ngược "hộp chuối": ([ngModel])',
      explain: 'Two-way luôn là [( )]: hộp vuông bên ngoài, quả chuối tròn bên trong (banana in a box). Viết ngược Angular sẽ không hiểu.',
      wrong: { lang: 'angular-html', code: `<input ([ngModel])="nickname" />` },
      right: { lang: 'angular-html', code: `<input [(ngModel)]="nickname" />` },
    },
    {
      title: 'Dùng interpolation cho thuộc tính không phải chuỗi',
      explain: '{{ }} luôn biến giá trị thành chuỗi. Với thuộc tính boolean như disabled, chuỗi "false" vẫn làm nút bị khoá. Hãy dùng [prop].',
      wrong: { lang: 'angular-html', code: `<button disabled="{{ isLocked() }}">Gửi</button>` },
      right: { lang: 'angular-html', code: `<button [disabled]="isLocked()">Gửi</button>` },
    },
  ],
  quiz: [
    {
      question: 'Binding nào đưa dữ liệu theo chiều DOM → Class?',
      options: ['{{ value }}', '[value]="x"', '(input)="onInput($event)"', 'Không có loại nào'],
      correct: 2,
      explain: 'Ngoặc tròn ( ) là event binding: sự kiện từ phần tử DOM đi về Class để gọi method.',
    },
    {
      question: '[(ngModel)]="nickname" thực chất là cách viết gọn của gì?',
      options: [
        '[ngModel]="nickname" (ngModelChange)="nickname.set($event)"',
        '{{ nickname }} + (click)',
        'Chỉ là [ngModel]="nickname"',
        'Một lệnh gọi HTTP',
      ],
      correct: 0,
      explain: 'Two-way = property binding [ngModel] (đi xuống) + event binding (ngModelChange) (đi lên). Với signal, Angular tự gọi .set().',
    },
    {
      question: 'Muốn khoá nút theo một signal boolean isLocked, viết thế nào đúng nhất?',
      options: ['disabled="{{ isLocked() }}"', '[disabled]="isLocked()"', '(disabled)="isLocked()"', '[disabled]="isLocked"'],
      correct: 1,
      explain: '[prop] gán đúng kiểu boolean vào thuộc tính. Interpolation biến thành chuỗi; còn thiếu () thì truyền cả hàm signal.',
    },
  ],
  doneMessage: 'Bạn đã hiểu 4 loại ống binding! Bi lăn đúng chiều rồi đó.',
};
