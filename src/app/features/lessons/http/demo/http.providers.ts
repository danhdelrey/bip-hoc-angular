import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, errorInterceptor, loggingInterceptor, mockBackend } from './interceptors';

// Thứ tự = thứ tự các trạm bưu điện mà phong bì đi qua (lượt về thì ngược lại)
export const HTTP_PROVIDERS = [
  provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor, errorInterceptor, mockBackend])),
];
