import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './forms.samples';

export const REACTIVE_CODE = `import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export class SignupReactive {
  private readonly fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    age: [null as number | null, Validators.min(13)],
  });
}
// template: <form [formGroup]="form"> <input formControlName="email" /> …`;

export const TEMPLATE_DRIVEN_CODE = `import { FormsModule } from '@angular/forms';

export class SignupTemplate {
  model = { email: '', password: '', age: null as number | null };
}
// template:
// <form #f="ngForm">
//   <input name="email" [(ngModel)]="model.email" required email />
//   <input name="password" [(ngModel)]="model.password" required minlength="6" />
// </form>`;

export const FORMS_COMPARE = [
  { name: 'Template-driven', icon: 'house', pros: 'Nhanh cho form nhỏ, ít code TS.', cons: 'Logic nằm rải trong HTML, khó test, khó form động.' },
  { name: 'Reactive (FormGroup)', icon: 'code', pros: 'Mô hình rõ ràng trong TS, mạnh với form động, nhiều tài liệu.', cons: 'Nhiều code, Observable valueChanges, type phải khai báo kỹ.' },
  { name: 'Signal forms', icon: 'signal', pros: 'Model là signal, validation dạng schema, type tự suy ra. Stable từ Angular 22.', cons: 'Mới nhất — hệ sinh thái/thư viện đi kèm còn đang bắt kịp.' },
];

export const FORMS: LessonContent = {
  slug: 'forms',
  metaphor:
    'Một form giống một gia đình: FormGroup là bố mẹ, mỗi ô nhập là một đứa con. Con nào gặp lỗi thì nhăn mặt, và chỉ cần một đứa nhăn mặt là cả nhà chưa vui (invalid)!',
  intro:
    'Angular theo dõi trạng thái từng ô nhập: value, valid, dirty (đã sửa), touched (đã chạm) và errors. Trạng thái của form cha được gộp từ các con. Có 3 cách viết: template-driven, reactive và signal forms (mới, stable từ Angular 22).',
  visualizer: {
    title: 'Cây trạng thái biết cười',
    hint: 'Gõ vào form bên trái. Cây bên phải cập nhật trực tiếp: mỗi node có biểu cảm theo trạng thái. Step-player phát lại từng bước kiểm tra của lần gõ gần nhất.',
  },
  code: [
    { name: 'signup-form.ts', lang: 'angular-ts', code: SAMPLES['signup-form.ts'], anchors: { 14: 'email', 15: 'password', 16: 'age', 17: 'form', 18: 'email', 19: 'email', 20: 'email', 24: 'form', 26: 'form', 27: 'email', 28: 'email', 29: 'password', 30: 'password', 31: 'age' } },
    { name: 'reactive.ts', lang: 'angular-ts', code: REACTIVE_CODE, anchors: { 5: 'form', 6: 'email', 7: 'password', 8: 'age' } },
    { name: 'template-driven.ts', lang: 'angular-ts', code: TEMPLATE_DRIVEN_CODE, anchors: { 7: 'form', 8: 'email', 9: 'password' } },
  ],
  liveNote: 'Kết quả live dùng Signal forms thật (Angular 22). Visualizer bên trên dùng Reactive forms — cùng một mô hình trạng thái.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { SignupForm } from './app/signup-form';

bootstrapApplication(SignupForm).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Forms</title></head>\n<body><app-signup-form></app-signup-form></body>\n</html>\n`,
  },
  challenges: [
    { id: 'fm-touched', title: 'Làm cho ô email "nhăn mặt": đã chạm (touched) nhưng không hợp lệ.', hint: 'Bấm vào ô email, gõ "abc" rồi bấm ra ngoài.', praise: 'Đúng! Thường chỉ nên hiện lỗi khi ô đã touched, để không mắng người dùng quá sớm.' },
    { id: 'fm-valid', title: 'Làm cho cả gia đình FormGroup cùng cười: form hợp lệ.', hint: 'Email đúng định dạng, mật khẩu ≥ 6 ký tự, tuổi để trống hoặc ≥ 13.', praise: 'Cả nhà cùng vui! valid của cha = mọi con đều valid.' },
    { id: 'fm-reset', title: 'Sửa vài ô rồi bấm Reset: xem dirty và touched quay về false.', hint: 'Nút Reset nằm dưới form.', praise: 'Chuẩn! reset() đưa form về trạng thái pristine/untouched.' },
  ],
  pitfalls: [
    {
      title: 'Hiện lỗi ngay khi trang vừa mở',
      explain: 'Ô trống ban đầu đã invalid (required), nên hiện lỗi ngay sẽ "mắng" người dùng khi họ chưa làm gì. Chỉ hiện khi touched (hoặc sau submit).',
      wrong: { lang: 'angular-html', code: `@if (form.controls.email.invalid) {\n  <small>Email sai!</small>\n}` },
      right: { lang: 'angular-html', code: `@if (form.controls.email.invalid && form.controls.email.touched) {\n  <small>Email sai!</small>\n}` },
    },
    {
      title: 'Trộn [(ngModel)] với formControlName',
      explain: 'Dùng cả template-driven lẫn reactive trên cùng một input gây hai nguồn sự thật. Chọn một cách cho mỗi form.',
      wrong: { lang: 'angular-html', code: `<input formControlName="email" [(ngModel)]="email" />` },
      right: { lang: 'angular-html', code: `<input formControlName="email" />` },
    },
    {
      title: 'Quên import module/directive form',
      explain: 'Reactive cần ReactiveFormsModule, template-driven cần FormsModule, signal forms cần FormField. Thiếu là binding không chạy.',
      wrong: { lang: 'angular-ts', code: `@Component({ imports: [], template: \`<input [formField]="f.email" />\` })` },
      right: { lang: 'angular-ts', code: `@Component({ imports: [FormField], template: \`<input [formField]="f.email" />\` })` },
    },
  ],
  quiz: [
    { question: 'Người dùng bấm vào ô rồi bấm ra ngoài mà không gõ gì. Ô đó là…', options: ['dirty và touched', 'touched nhưng không dirty', 'dirty nhưng không touched', 'không đổi gì'], correct: 1, explain: 'touched = đã rời khỏi ô (blur). dirty = giá trị đã bị người dùng sửa.' },
    { question: 'FormGroup có 3 control, 1 control invalid. FormGroup là…', options: ['valid', 'invalid', 'pending', 'tuỳ control đầu tiên'], correct: 1, explain: 'Trạng thái của cha được gộp từ các con: một con invalid thì cha invalid.' },
    { question: 'Với signal forms, đọc trạng thái hợp lệ của ô email thế nào?', options: ['f.email.valid', 'f.email().valid()', 'f.controls.email.valid', 'email.isValid'], correct: 1, explain: 'f.email là FieldTree; gọi f.email() lấy FieldState, trong đó valid là một signal.' },
  ],
  doneMessage: 'Cả gia đình form đều đang cười với bạn!',
};
