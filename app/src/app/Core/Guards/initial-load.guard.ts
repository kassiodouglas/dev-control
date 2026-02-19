import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../Services/security.service';

export const initialLoadGuard: CanActivateFn = async (route, state) => {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  const isSetupComplete = await securityService.isSetupComplete();

  if (!isSetupComplete) {
    router.navigate(['/setup']);
    return false;
  }

  return true;
};
