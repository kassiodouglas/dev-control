import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { SecurityService } from '../../../Core/Services/security.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const securityService = inject(SecurityService);

  const isSetupComplete = await securityService.isSetupComplete();
  const hasSecurityPassword = await securityService.hasSecurityPassword();
  const isAuthenticated = authService.checkAuthentication();
  const isLoginPage = state.url.includes('/autenticacao/login');

  if (!isSetupComplete) {
    router.navigate(['/setup']);
    return false;
  }

  if (hasSecurityPassword) {
    if (!isAuthenticated && !isLoginPage) {
      router.navigate(['/autenticacao/login']);
      return false;
    }
    if (isAuthenticated && isLoginPage) {
      router.navigate(['/dashboard']);
      return false;
    }
  }

  // If setup is complete and no security password, allow access to dashboard without authentication
  if (isSetupComplete && !hasSecurityPassword && state.url.includes('/dashboard')) {
    return true;
  }

  // If no security password, or if security password is set and user is authenticated or on login page
  // Handle regular authentication logic
  if (isAuthenticated && isLoginPage) {
    router.navigate(['/dashboard']); // Redirect to dashboard if already authenticated and on login page
    return false;
  }

  if (!isAuthenticated && !isLoginPage) {
    // Original logic for unauthenticated non-login pages with no security password
    if (!hasSecurityPassword) {
        // If no password, and not authenticated, and not on login, something is wrong. Redirect to dashboard.
        router.navigate(['/dashboard']); // Should now correctly allow entry if the above check passes
        return false; // Still prevent navigation if authentication is somehow required despite no password
    }
  }

  return true;
};
