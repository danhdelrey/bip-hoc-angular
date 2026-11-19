import { afterEach, beforeEach, describe, expect, it } from './vitest-lite';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()], // HTTP giả, không gọi mạng
    });
    service = TestBed.inject(CartService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // không được bỏ sót request nào

  it('load() gọi GET /api/cart và lưu kết quả', () => {
    service.load().subscribe();
    const req = http.expectOne('/api/cart');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Áo mưa Bíp', price: 199000 }]); // trả dữ liệu giả
    expect(service.items().length).toBe(1);
  });

  it('add() thêm sản phẩm vào giỏ', () => {
    service.add({ id: 2, name: 'Ô gấp', price: 89000 });
    expect(service.items()).toEqual([{ id: 2, name: 'Ô gấp', price: 89000 }]);
  });
});
