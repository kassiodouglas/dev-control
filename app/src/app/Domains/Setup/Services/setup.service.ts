import { Injectable, inject } from '@angular/core';
import { SecurityService } from '../../../Core/Services/security.service';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  private securityService = inject(SecurityService);

  constructor() { }

  async updateProfile(name: string, avatar: string, email: string): Promise<void> {
    console.log('Profile updated:', { name, avatar, email });
    await this.securityService.updateProfile({ name, avatar, email });
  }

  async updateIntegrations(integrations: { geminiApiKey: string, azureOrg: string, azureProject: string, azureToken: string }): Promise<void> {
    console.log('Integrations updated:', integrations);
    await this.securityService.updateIntegrations(integrations);
  }

  // enableSecurity(password: string): void {
  //   console.log('Security enabled with password:', password);
  //   // This is now handled directly by SecurityService in setup-wizard.page.ts
  // }

  async completeSetup(): Promise<void> {
    console.log('Setup completed!');
    await this.securityService.completeSetup();
  }
}
