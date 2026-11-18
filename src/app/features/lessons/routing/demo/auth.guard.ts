import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from './auth';

// Nhân viên soát vé: chưa đăng nhập thì không cho tàu vào sân ga /admin
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  if (auth.loggedIn()) return true;
  auth.blockedAt.set(new Date().toLocaleTimeString('vi-VN'));
  return false;
};
