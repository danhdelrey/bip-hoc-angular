import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

/**
 * Globals cho bài luyện Hiệu năng: virtual scroll của Angular CDK. Dùng từng directive standalone thay cho
 * ScrollingModule (bản production không giữ scope của NgModule AOT, xem labModule()).
 */
export function perfExtras(): Record<string, unknown> {
  return { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf };
}
