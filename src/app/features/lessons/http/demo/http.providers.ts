import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, errorInterceptor, loggingInterceptor, mockBackend } from './interceptors';

// Request đi qua theo thứ tự khai báo, response đi theo thứ tự ngược lại
export const HTTP_PROVIDERS = [
  provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor, errorInterceptor, mockBackend])),
];
