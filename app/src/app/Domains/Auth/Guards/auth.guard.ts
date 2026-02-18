import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.checkAuthentication();
  const isLoginPage = state.url.includes('/autenticacao/login');

  if (isAuthenticated && isLoginPage) {
    router.navigate(['/']);
    return false;
  }

  if (!isAuthenticated && !isLoginPage) {
    router.navigate(['/autenticacao/login']);
    return false;
  }

  return true;
};
