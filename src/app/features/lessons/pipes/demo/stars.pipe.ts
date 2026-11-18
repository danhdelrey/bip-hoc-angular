import { Pipe, PipeTransform } from '@angular/core';

// Pipe tự viết — mặc định là pure: chỉ chạy lại khi input đổi tham chiếu
@Pipe({ name: 'stars' })
export class StarsPipe implements PipeTransform {
  transform(value: string | null): string {
    return `★ ${value ?? ''} ★`;
  }
}
