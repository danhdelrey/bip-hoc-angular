import { Component, input } from '@angular/core';

@Component({ selector: 'app-home-stop', template: `<h3>🏠 Ga chính</h3><p>Chọn một chuyến tàu ở trên.</p>` })
export class HomeStop {}

@Component({ selector: 'app-product-stop', template: `<h3>📦 Sản phẩm #{{ id() }}</h3><p>id lấy từ URL qua input().</p>` })
export class ProductStop {
  id = input<string>(); // nhờ withComponentInputBinding()
}

@Component({ selector: 'app-admin-stop', template: `<h3>🔐 Phòng quản trị</h3><p>Bạn đã qua cửa soát vé!</p>` })
export class AdminStop {}

@Component({ selector: 'app-lost-stop', template: `<h3>🌫️ Ga ma</h3><p>Không có chuyến tàu nào tới đây (route **).</p>` })
export class LostStop {}
