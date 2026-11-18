// FILE SINH TỰ ĐỘNG bởi scripts/gen-samples.mjs — đừng sửa tay. Sửa file trong demo/ rồi chạy npm run gen:samples.
export const SAMPLES: Record<string, string> = {
  "product-card.ts": "import { Component, signal } from '@angular/core';\n\n@Component({\n  selector: 'app-product-card',\n  templateUrl: './product-card.html',\n  styleUrl: './product-card.css',\n})\nexport class ProductCard {\n  name = signal('Robot Bíp mini');\n  price = signal(199);\n  inCart = signal(false);\n\n  toggleCart() {\n    this.inCart.update((v) => !v);\n  }\n}",
  "product-card.html": "<article class=\"card\">\n  <h3>{{ name() }}</h3>\n  <p class=\"price\">{{ price() }}k</p>\n  <button (click)=\"toggleCart()\">\n    {{ inCart() ? '✓ Đã thêm' : 'Thêm vào giỏ' }}\n  </button>\n</article>",
  "product-card.css": ".card {\n  padding: 12px;\n  border: 2px solid #333;\n  border-radius: 12px;\n}\n.price {\n  color: crimson;\n  font-weight: bold;\n}",
};
