import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './reactive-forms.samples';

export const RF_EXTRAS = `// Lắng nghe thay đổi của một control (kết hợp RxJS)
this.form.controls.username.valueChanges
  .pipe(debounceTime(300), takeUntilDestroyed())
  .subscribe((name) => this.suggest(name));

// Bật/tắt control theo điều kiện
const shipping = this.form.controls.shipping;
isPickup ? shipping.disable() : shipping.enable();

// Điền dữ liệu có sẵn (ví dụ khi sửa đơn)
this.form.patchValue({ username: 'danh' });       // một phần
this.form.reset();                                // về giá trị khởi tạo (nhờ NonNullable)

// Kiểu dữ liệu được suy ra tự động:
// this.form.getRawValue(): { username: string; account: {...}; items: { name: string; qty: number }[] }`;

export const REACTIVE_FORMS: LessonContent = {
  slug: 'reactive-forms',
  definition:
    'Reactive Forms là cách xây form bằng code: cấu trúc form (FormGroup, FormControl, FormArray), giá trị khởi tạo và validator được khai báo trong class, còn template chỉ gắn các control vào input.',
  analogy: {
    text: 'Ví dụ vẽ form thành một cây: mỗi lần một ô thay đổi, kết quả kiểm tra lan dần từ lá lên gốc.',
    map: [
      ['Gốc cây', 'FormGroup gốc (form)'],
      ['Cành', 'FormGroup con (account) / FormArray (items)'],
      ['Lá', 'FormControl'],
      ['Cành mọc thêm lá', 'FormArray.push()'],
      ['Lá đang chờ kết quả', 'trạng thái PENDING (async validator)'],
      ['Lan lên gốc', 'status và valueChanges cập nhật từ control lên cha'],
    ],
  },
  intro:
    'Mỗi control có value, status (VALID, INVALID, PENDING, DISABLED) và errors. FormGroup gom các control theo tên, FormArray giữ một danh sách control có thể thêm bớt lúc chạy. Validator có ba loại: đồng bộ trên một control (Validators.required, tự viết), cấp nhóm để so sánh nhiều control (mật khẩu khớp), và bất đồng bộ trả về Observable (kiểm tra trùng tên qua API). Khi một control đổi, Angular chạy validator của nó rồi tính lại trạng thái của mọi cấp cha. NonNullableFormBuilder cho kiểu dữ liệu chặt chẽ và reset() về đúng giá trị khởi tạo.',
  visualizer: {
    title: 'Cây form và đường lan trạng thái',
    hint: 'Bấm các thao tác ở hàng trên. Mỗi nút trong cây hiện trạng thái và lỗi của nó. Step-player cho thấy validator nào chạy và trạng thái lan dần lên các cấp cha ra sao.',
  },
  code: [
    { name: 'order-form.ts', lang: 'angular-ts', code: SAMPLES['order-form.ts'], anchors: { 13: 'async', 14: 'async', 16: 'group', 20: 'crossfield', 22: 'array', 24: 'array', 27: 'array', 39: 'builder', 41: 'builder', 42: 'async', 43: 'group', 44: 'group', 45: 'crossfield', 47: 'array', 51: 'status', 52: 'status', 59: 'array', 63: 'array' } },
    { name: 'validators.ts', lang: 'typescript', code: SAMPLES['validators.ts'], anchors: { 5: 'crossfield', 6: 'crossfield', 7: 'crossfield', 12: 'async', 13: 'async' } },
    { name: 'thao-tac.ts', lang: 'typescript', code: RF_EXTRAS, anchors: { 2: 'status', 3: 'status', 4: 'status', 8: 'group', 11: 'builder', 12: 'builder', 15: 'builder' } },
  ],
  liveNote: 'Form thật dùng @angular/forms. Thử gõ "bip" vào tên đăng nhập để thấy validator bất đồng bộ, nhập hai mật khẩu khác nhau, thêm/xoá món. Giá trị JSON bên dưới cập nhật theo từng phím.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { OrderForm } from './app/order-form';\n\nbootstrapApplication(OrderForm).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Reactive Forms</title></head>\n<body><app-order-form></app-order-form></body>\n</html>\n`,
  },
  challenges: [
    { id: 'fa-array', title: 'Cho FormArray items có đúng 3 món.', hint: 'Dùng thao tác thêm món; mỗi lần là một FormGroup mới được push vào mảng.', praise: 'Đúng! FormArray cho phép số lượng control thay đổi lúc chạy.' },
    { id: 'fa-cross', title: 'Làm xuất hiện lỗi mismatch ở cấp nhóm account (không phải ở từng ô).', hint: 'Hai ô mật khẩu đều hợp lệ riêng lẻ, nhưng không giống nhau.', praise: 'Chuẩn! Validator cấp nhóm thấy được cả hai control cùng lúc.' },
    { id: 'fa-async', title: 'Cho tên đăng nhập đi qua trạng thái PENDING rồi bị báo trùng.', hint: 'Thử một tên đã có người dùng.', praise: 'Hay! Async validator chạy sau khi các validator đồng bộ đã qua.' },
  ],
  pitfalls: [
    {
      title: 'Đặt validator so sánh lên một control con',
      explain: 'Validator trên ô confirm chỉ chạy khi confirm đổi; sửa ô password thì lỗi không cập nhật. Validator so sánh phải đặt ở FormGroup cha.',
      wrong: { lang: 'typescript', code: `confirm: ['', matchPassword] // không chạy lại khi password đổi` },
      right: { lang: 'typescript', code: `this.fb.group({ password: [''], confirm: [''] }, { validators: passwordsMatch })` },
    },
    {
      title: 'Async validator gọi API mỗi phím',
      explain: 'Async validator chạy lại ở mỗi lần đổi giá trị. Đặt updateOn: \'blur\' hoặc debounce bên trong validator để tránh dội API.',
      wrong: { lang: 'typescript', code: `username: ['', [], [checkApi]] // gọi API mỗi ký tự` },
      right: { lang: 'typescript', code: `username: this.fb.control('', { asyncValidators: [checkApi], updateOn: 'blur' })` },
    },
    {
      title: 'Đọc form.value khi có control bị disable',
      explain: 'form.value bỏ qua control đang disabled. Muốn lấy đủ mọi trường để gửi lên server, dùng getRawValue().',
      wrong: { lang: 'typescript', code: `api.save(this.form.value); // thiếu các ô disabled` },
      right: { lang: 'typescript', code: `api.save(this.form.getRawValue());` },
    },
  ],
  quiz: [
    { question: 'Muốn người dùng thêm bớt số dòng sản phẩm tuỳ ý, dùng gì?', options: ['FormControl', 'FormArray', 'Nhiều FormGroup đặt tên item1, item2…', 'ngModel'], correct: 1, explain: 'FormArray giữ một danh sách control, có push, removeAt, at(i).' },
    { question: 'Async validator đang chờ kết quả thì status của control là gì?', options: ['VALID', 'INVALID', 'PENDING', 'DISABLED'], correct: 2, explain: 'Trong lúc chờ, control và mọi cấp cha có status PENDING.' },
    { question: 'Validator "mật khẩu nhập lại phải khớp" nên đặt ở đâu?', options: ['Ô password', 'Ô confirm', 'FormGroup chứa cả hai ô', 'Trong template'], correct: 2, explain: 'Chỉ cấp nhóm mới thấy cả hai giá trị và chạy lại khi bất kỳ ô nào đổi.' },
  ],
  doneMessage: 'Form phức tạp cỡ nào bạn cũng dựng được: nhóm, mảng động, validator chéo và bất đồng bộ!',
};
