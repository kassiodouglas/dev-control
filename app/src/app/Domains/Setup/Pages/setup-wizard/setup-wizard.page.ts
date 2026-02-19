import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { SecurityService } from '../../../../Core/Services/security.service';
import { SetupService } from '../../Services/setup.service';

@Component({
  selector: 'app-setup-wizard-page',
  standalone: true, // Mark as standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './setup-wizard.page.html',
  styleUrls: ['./setup-wizard.page.scss'],
})
export class SetupWizardPage {
  router = inject(Router);
  setupService = inject(SetupService);
  securityService = inject(SecurityService);
  step = signal(1);

  // Form Data
  profileName = 'Dev User';
  profileAvatar = 'https://i.pravatar.cc/150?img=11';
  profileEmail = '';

  geminiKey = '';
  azureOrg = '';
  azureProject = '';
  azureToken = '';

  enableSecurity = signal(false);
  password = '';
  passwordConfirm = '';

  canProceed(): boolean {
     if (this.step() === 1) return !!this.profileName;
     if (this.step() === 3 && this.enableSecurity()) {
        return !!this.password && this.password === this.passwordConfirm;
     }
     return true;
  }

  next() {
     if (this.step() < 3) {
        this.step.update(s => s + 1);
     } else {
        this.finish();
     }
  }

  async finish() {
     await this.setupService.updateProfile(this.profileName, this.profileAvatar, this.profileEmail);
     await this.setupService.updateIntegrations({
        geminiApiKey: this.geminiKey,
        azureOrg: this.azureOrg,
        azureProject: this.azureProject,
        azureToken: this.azureToken
     });
     if (this.enableSecurity()) {
        // this.setupService.enableSecurity(this.password); // Removed, handled by SecurityService
        await this.securityService.setSecurityPassword(this.password);
     }
     await this.setupService.completeSetup();
     if (this.enableSecurity()) {
      console.log('go login')

        this.router.navigate(['/autenticacao/login']);
     } else {
      console.log('go dash')
        this.router.navigate(['/dashboard']);
     }
  }
}
