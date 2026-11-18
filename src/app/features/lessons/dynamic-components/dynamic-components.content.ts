import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './dynamic-components.samples';

export const VCR_CODE = `import { Component, ComponentRef, ViewContainerRef, viewChild } from '@angular/core';

export class WidgetHost {
  private readonly slot = viewChild.required('slot', { read: ViewContainerRef });
  private refs: ComponentRef<unknown>[] = [];

  addWeather() {
    const ref = this.slot().createComponent(WeatherCard); // tạo + chèn
    ref.setInput('title', 'Thời tiết');                    // gán input
    this.refs.push(ref);
  }

  removeLast() {
    this.refs.pop()?.destroy();                           // huỷ đúng cái đó
  }
}
// template: <ng-container #slot />`;

export const DYNAMIC_COMPONENTS: LessonContent = {
  slug: 'dynamic-components',
  metaphor:
    'Component động giống nhà lắp ghép: bạn chưa biết trước khách cần căn nào, nên giữ sẵn một bãi đất trống (ViewContainerRef). Khi khách chọn, xe cẩu mang module tới đặt xuống (createComponent), lắp điện nước (setInput), và khi không cần thì nhấc đi (destroy). hostDirectives là phụ kiện được hàn sẵn vào từng module!',
  intro:
    'Đôi khi bạn chỉ biết component nào cần hiển thị lúc chạy: dashboard cho người dùng tự thêm widget, hộp thoại, plugin. Angular cho hai cách: khai báo bằng *ngComponentOutlet, hoặc điều khiển bằng code qua ViewContainerRef.createComponent. hostDirectives giúp ghép hành vi có sẵn vào component mà không cần kế thừa.',
  visualizer: {
    title: 'Bãi đất lắp ghép',
    hint: 'Chọn loại module rồi bấm "Cẩu xuống". Mỗi widget bên dưới là component THẬT được tạo bằng createComponent. Đổi màu bằng setInput, nhấc đi bằng destroy.',
  },
  code: [
    { name: 'widget-host.ts', lang: 'angular-ts', code: VCR_CODE, anchors: { 4: 'vcr', 8: 'create', 9: 'input', 14: 'destroy', 17: 'vcr' } },
    { name: 'dashboard.ts', lang: 'angular-ts', code: SAMPLES['dashboard.ts'], anchors: { 13: 'outlet', 22: 'create', 23: 'create' } },
    { name: 'widgets.ts', lang: 'angular-ts', code: SAMPLES['widgets.ts'], anchors: { 3: 'host', 4: 'host', 5: 'host', 17: 'host', 30: 'host' } },
  ],
  liveNote: 'Dashboard thật dùng *ngComponentOutlet kèm inputs. Rê chuột lên widget: hiệu ứng đến từ directive Hoverable gắn qua hostDirectives.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { Dashboard } from './app/dashboard';\n\nbootstrapApplication(Dashboard).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>Component động</title></head>\n<body><app-dashboard></app-dashboard></body>\n</html>\n`,
  },
  challenges: [
    { id: 'dc-create', title: 'Cẩu xuống 3 widget lên bãi đất.', hint: 'Chọn loại module rồi bấm "Cẩu xuống" ba lần (loại nào cũng được).', praise: 'Chuẩn! createComponent vừa tạo instance vừa chèn view vào đúng ViewContainer.' },
    { id: 'dc-input', title: 'Đổi màu một widget đang có bằng setInput.', hint: 'Bấm nút "setInput(\'accent\')" trên một widget.', praise: 'Đúng! setInput gán input và đánh dấu component cần cập nhật — như binding [accent] trong template.' },
    { id: 'dc-destroy', title: 'Nhấc một widget đi bằng destroy().', hint: 'Bấm nút "destroy()" trên một widget.', praise: 'Gọn gàng! destroy() gỡ view và chạy ngOnDestroy của component đó.' },
  ],
  pitfalls: [
    {
      title: 'Tạo component động mà không bao giờ destroy',
      explain: 'Component tạo bằng code không tự biến mất nếu bạn chỉ xoá khỏi mảng. Giữ ComponentRef và gọi destroy(), hoặc vcr.clear() khi không dùng nữa.',
      wrong: { lang: 'typescript', code: `this.slot().createComponent(Popup); // quên giữ ref → rò rỉ` },
      right: { lang: 'typescript', code: `const ref = this.slot().createComponent(Popup);\n// …\nref.destroy();` },
    },
    {
      title: 'Gán thẳng ref.instance.title thay vì setInput',
      explain: 'Gán trực tiếp không đi qua cơ chế input: input() là signal chỉ đọc nên gán bị lỗi, còn component OnPush không được đánh dấu cập nhật.',
      wrong: { lang: 'typescript', code: `ref.instance.title = 'Mới'; // lỗi với input() signal` },
      right: { lang: 'typescript', code: `ref.setInput('title', 'Mới');` },
    },
    {
      title: 'Dùng kế thừa class để chia sẻ hành vi host',
      explain: 'Kế thừa component dễ rối và chỉ được một lớp cha. hostDirectives ghép nhiều directive độc lập vào component, mỗi cái lo một việc.',
      wrong: { lang: 'typescript', code: `export class WeatherCard extends HoverableBase { … }` },
      right: { lang: 'typescript', code: `@Component({ hostDirectives: [Hoverable, Tooltip] })\nexport class WeatherCard { … }` },
    },
  ],
  quiz: [
    { question: 'Hàm nào vừa tạo instance component vừa chèn view của nó vào DOM?', options: ['new WeatherCard()', 'viewContainerRef.createComponent(WeatherCard)', 'inject(WeatherCard)', 'document.createElement'], correct: 1, explain: 'createComponent tạo component với injector đúng chỗ và chèn view vào ViewContainer.' },
    { question: 'Cách KHAI BÁO (không viết code điều khiển) để render một component chọn lúc chạy?', options: ['*ngComponentOutlet', '@switch với mọi component', 'innerHTML', 'Router'], correct: 0, explain: '*ngComponentOutlet="Cmp; inputs: {...}" render component theo biến, kèm inputs.' },
    { question: 'hostDirectives dùng để làm gì?', options: ['Khai báo route con', 'Gắn sẵn directive vào component, như thể chúng nằm trên thẻ host', 'Tăng tốc build', 'Thay thế services'], correct: 1, explain: 'Directive trong hostDirectives được áp lên phần tử host mỗi khi component được dùng.' },
  ],
  doneMessage: 'Xe cẩu đã vào tay bạn! Component động không còn bí ẩn.',
};
