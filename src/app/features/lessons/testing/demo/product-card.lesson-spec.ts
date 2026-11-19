// Dự án thật: import { describe, it, expect, beforeEach, vi } from 'vitest';
import { beforeEach, describe, expect, it, vi } from './vitest-lite';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;
  const cart = { add: vi.fn() }; // mock thay cho CartService thật
  const product = { id: 1, name: 'Áo mưa Bíp', price: 199000 };

  beforeEach(async () => {
    cart.add.mockClear();
    TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [{ provide: CartService, useValue: cart }],
    });
    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable(); // chờ render xong
  });

  it('hiển thị tên sản phẩm', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Áo mưa Bíp');
  });

  it('bấm nút thì gọi cart.add với đúng sản phẩm', () => {
    fixture.nativeElement.querySelector('button').click();
    expect(cart.add).toHaveBeenCalledWith(product);
  });

  it('hiện thông báo sau khi thêm', async () => {
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable(); // signal đổi → chờ Angular cập nhật DOM
    expect(fixture.nativeElement.textContent).toContain('Đã thêm!');
  });
});
