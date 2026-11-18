import type { LessonContent } from '../../../content/lesson.model';

export const CART_SERVICE_TS = `import { Service, signal } from '@angular/core';

let nextId = 1;

@Service() // tự đặt "quầy" ở tầng Root
export class CartService {
  readonly id = nextId++;
  readonly count = signal(0);

  add() {
    this.count.update((n) => n + 1);
  }
}`;

export const CART_BADGE_TS = `import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-badge',
  template: \`
    <span>🛒 Giỏ #{{ cart.id }}: {{ cart.count() }} món</span>
    <button (click)="cart.add()">+1</button>
  \`,
})
export class CartBadge {
  protected readonly cart = inject(CartService);
}`;

export const CART_PANEL_TS = `import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-panel',
  providers: [CartService], // quầy riêng trong phòng C
  template: \`
    <h3>CartPanel — Giỏ #{{ cart.id }}</h3>
    <button (click)="cart.add()">+1 món ({{ cart.count() }})</button>
  \`,
})
export class CartPanel {
  protected readonly cart = inject(CartService);
}`;

export const SHOP_PAGE_TS = `import { Component } from '@angular/core';
import { CartBadge } from './cart-badge';
import { CartPanel } from './cart-panel';

@Component({
  selector: 'app-shop-page',
  imports: [CartBadge, CartPanel],
  template: \`
    <app-cart-badge />
    <app-cart-panel />
  \`,
})
export class ShopPage {}`;

const ROUTES_TS = `import { Routes } from '@angular/router';
import { ShopPage } from './shop-page';
import { API_URL } from './api-url.token';

export const routes: Routes = [
  {
    path: 'cua-hang',
    component: ShopPage,
    providers: [
      // CartService, // bỏ comment = đặt quầy ở tầng route
      { provide: API_URL, useValue: 'https://staging.bip.vn' },
    ],
  },
];`;

export const API_TOKEN_TS = `import { InjectionToken } from '@angular/core';

// Token cho giá trị KHÔNG phải class (chuỗi, số, object cấu hình…)
export const API_URL = new InjectionToken<string>('API_URL', {
  factory: () => 'https://api.bip.vn', // giá trị mặc định ở Root
});

// Dùng: private readonly apiUrl = inject(API_URL);`;

export const DEPENDENCY_INJECTION: LessonContent = {
  slug: 'dependency-injection',
  metaphor:
    'DI giống một toà nhà có các quầy phát đồ. Component cần gì thì đi ngược lên cầu thang, gặp quầy nào gần nhất thì lấy đồ ở quầy đó!',
  metaphorMood: 'wave',
  intro:
    'Component không tự new CartService() mà xin qua inject(). Angular tìm provider từ chính component, lên component cha, lên route, rồi tới Root. Quầy đặt ở tầng nào quyết định ai dùng chung một instance.',
  visualizer: {
    title: 'Toà nhà Injector',
    hint: 'Bấm "Đặt quầy" ở các tầng khác nhau. Mỗi quầy tạo một instance có màu và số riêng. Component nhận instance nào thì được tô cùng màu.',
  },
  code: [
    { name: 'cart.service.ts', lang: 'angular-ts', code: CART_SERVICE_TS, anchors: { 5: 'service', 6: 'service', 7: 'service' } },
    { name: 'cart-panel.ts', lang: 'angular-ts', code: CART_PANEL_TS, anchors: { 6: 'provider-panel', 13: 'inject-panel' } },
    { name: 'cart-badge.ts', lang: 'angular-ts', code: CART_BADGE_TS, anchors: { 12: 'inject-badge' } },
    { name: 'shop-page.ts', lang: 'angular-ts', code: SHOP_PAGE_TS, anchors: { 9: 'inject-badge', 10: 'inject-panel' } },
    { name: 'app.routes.ts', lang: 'angular-ts', code: ROUTES_TS, anchors: { 10: 'route-provider' } },
    { name: 'api-url.token.ts', lang: 'angular-ts', code: API_TOKEN_TS, anchors: { 4: 'token', 5: 'token' } },
  ],
  liveNote: 'Component thật: CartBadge lấy instance ở Root, CartPanel có quầy riêng nên nhận instance khác. Bấm +1 ở mỗi bên xem số có chung không.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { ShopPage } from './app/shop-page';

bootstrapApplication(ShopPage).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>Dependency Injection</title></head>
<body><app-shop-page></app-shop-page></body>
</html>
`,
  },
  challenges: [
    {
      id: 'di-diff',
      title: 'Làm cho CartPanel (C) nhận instance service KHÁC với CartBadge (B).',
      hint: 'Một trong hai phòng ở tầng trệt cần có quầy riêng. Quầy trong phòng là gần nhất nên được ưu tiên.',
      praise: 'Chuẩn! providers trong component tạo instance riêng cho component đó và con của nó.',
    },
    {
      id: 'di-shared-no-root',
      title: 'Cho CartBadge (B) và CartPanel (C) dùng CHUNG một instance nhưng KHÔNG dùng quầy ở Root.',
      hint: 'Dỡ quầy Root (autoProvided: false), dỡ quầy trong các phòng, rồi đặt một quầy ở tầng route hoặc ShopPage.',
      praise: 'Hay lắm! Instance đó chỉ sống trong phạm vi route/trang, không phải toàn app.',
    },
    {
      id: 'di-error-fix',
      title: 'Gây ra lỗi NullInjectorError, sau đó sửa cho hết lỗi.',
      hint: 'Dỡ hết mọi quầy (kể cả Root) để thấy lỗi đỏ, rồi đặt lại một quầy ở tầng đủ cao để cả B và C đều tới được.',
      praise: 'Giờ bạn đã biết NullInjectorError nghĩa là: đi hết cầu thang mà không thấy quầy nào.',
    },
  ],
  pitfalls: [
    {
      title: 'Tự new service thay vì inject()',
      explain: 'new CartService() tạo một object lẻ loi: không ai khác dùng chung, không thay được khi test, và service đó không inject được gì.',
      wrong: { lang: 'angular-ts', code: `export class CartBadge {\n  cart = new CartService();\n}` },
      right: { lang: 'angular-ts', code: `export class CartBadge {\n  protected readonly cart = inject(CartService);\n}` },
    },
    {
      title: 'Lỡ thêm providers ở component nên state không còn chia sẻ',
      explain: 'Thêm providers: [CartService] vào component nghĩa là đặt quầy riêng. Component đó (và con của nó) nhận instance mới, nên state không còn chung với nơi khác.',
      wrong: { lang: 'angular-ts', code: `@Component({\n  selector: 'app-cart-badge',\n  providers: [CartService], // vô tình tạo giỏ riêng\n})` },
      right: { lang: 'angular-ts', code: `@Component({\n  selector: 'app-cart-badge',\n  // không khai báo -> dùng quầy ở Root\n})` },
    },
    {
      title: 'Gọi inject() ngoài injection context',
      explain: 'inject() chỉ chạy khi Angular đang tạo object: trong field initializer, constructor hoặc factory. Gọi trong method hay setTimeout sẽ lỗi NG0203.',
      wrong: { lang: 'angular-ts', code: `export class CartBadge {\n  onClick() {\n    const cart = inject(CartService); // lỗi NG0203\n  }\n}` },
      right: { lang: 'angular-ts', code: `export class CartBadge {\n  private readonly cart = inject(CartService);\n  onClick() {\n    this.cart.add();\n  }\n}` },
    },
    {
      title: 'Dùng chuỗi trần làm khoá DI cho giá trị cấu hình',
      explain: 'Chuỗi hay object không phải class thì không làm khoá được. Hãy tạo InjectionToken có kiểu rõ ràng.',
      wrong: { lang: 'angular-ts', code: `providers: [{ provide: 'apiUrl', useValue: 'https://...' }]` },
      right: { lang: 'angular-ts', code: `export const API_URL = new InjectionToken<string>('API_URL');\n\nproviders: [{ provide: API_URL, useValue: 'https://...' }]` },
    },
  ],
  quiz: [
    {
      question: 'CartPanel có providers: [CartService], CartBadge thì không. Cả hai đều inject(CartService). Điều gì xảy ra?',
      options: [
        'Cả hai dùng chung một instance',
        'CartPanel nhận instance riêng, CartBadge nhận instance ở Root',
        'CartBadge bị lỗi NullInjectorError',
        'Angular tạo instance mới mỗi lần gọi inject()',
      ],
      correct: 1,
      explain: 'Mỗi component tìm quầy gần nhất. Phòng của CartPanel có quầy riêng; CartBadge đi ngược lên tới Root.',
    },
    {
      question: 'Thứ tự Angular tìm provider khi một component gọi inject() là gì?',
      options: [
        'Root → route → component cha → chính nó',
        'Chính nó → component cha… → route → Root',
        'Chỉ tìm ở Root',
        'Ngẫu nhiên, tuỳ thứ tự import',
      ],
      correct: 1,
      explain: 'Angular đi từ dưới lên: element injector của chính component, lên các cha, rồi tới environment injector của route và Root.',
    },
    {
      question: 'Khi nào nên dùng InjectionToken?',
      options: [
        'Khi muốn inject một class service bình thường',
        'Khi giá trị cần inject không phải class, ví dụ chuỗi URL hay object cấu hình',
        'Khi muốn tắt DI',
        'Khi gọi HTTP',
      ],
      correct: 1,
      explain: 'Class tự làm khoá DI được. Với chuỗi, số hay interface (không tồn tại lúc chạy), cần InjectionToken làm khoá.',
    },
  ],
  doneMessage: 'Bạn đã làm chủ toà nhà Injector! Quầy nào gần nhất thì lấy ở đó.',
};
