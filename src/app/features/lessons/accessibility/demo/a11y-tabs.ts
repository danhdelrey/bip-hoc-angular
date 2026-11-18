import { Component, signal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

@Component({
  selector: 'app-a11y-tabs',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: `
    <div ngTabs>
      <ul ngTabList [(selectedTab)]="tab" aria-label="Thông tin sản phẩm">
        <li ngTab value="mo-ta">Mô tả</li>
        <li ngTab value="thong-so">Thông số</li>
        <li ngTab value="danh-gia">Đánh giá</li>
      </ul>
      <div ngTabPanel value="mo-ta"><ng-template ngTabContent>Áo mưa siêu nhẹ, gấp gọn.</ng-template></div>
      <div ngTabPanel value="thong-so"><ng-template ngTabContent>Nặng 180g · Chống nước 5000mm.</ng-template></div>
      <div ngTabPanel value="danh-gia"><ng-template ngTabContent>4,8 / 5 từ 120 lượt.</ng-template></div>
    </div>

    <!-- Nút chỉ có icon: phải có tên cho trình đọc màn hình -->
    <button type="button" aria-label="Thêm vào yêu thích" (click)="like()">♥</button>
    <!-- Vùng live: trình đọc màn hình tự đọc khi nội dung đổi -->
    <p aria-live="polite">{{ message() }}</p>
  `,
  styles: `
    [ngTabList] { display: flex; gap: 4px; padding: 0; margin: 0 0 8px; list-style: none; }
    [ngTab] { padding: 4px 12px; border: 1px solid #888; border-radius: 6px; cursor: pointer; }
    [ngTab][aria-selected='true'] { background: #1a56db; color: #fff; }
    [ngTab]:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
    [ngTabPanel] { padding: 8px; border: 1px dashed #888; border-radius: 6px; margin-bottom: 8px; }
  `,
})
export class A11yTabs {
  readonly tab = signal<string | undefined>('mo-ta');
  readonly message = signal('');
  like() {
    this.message.set('Đã thêm vào danh sách yêu thích');
  }
}
