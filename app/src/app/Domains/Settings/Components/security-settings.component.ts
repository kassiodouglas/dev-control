import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../Core/Services/app.service';

@Component({
  selector: 'comp-security-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 transition-colors">
      <h2 class="text-xl font-semibold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
        <i class="fa-solid fa-lock text-indigo-500"></i> App Lock
      </h2>

      <div class="flex items-center justify-between mb-6 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div>
          <div class="font-medium text-zinc-800 dark:text-white">Enable Password Protection</div>
          <div class="text-sm text-zinc-500">Require a password to access the dashboard on startup.</div>
        </div>
        <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer"
             [class.bg-green-500]="appService.security().isEnabled"
             [class.bg-zinc-300]="!appService.security().isEnabled"
             [class.dark:bg-zinc-700]="!appService.security().isEnabled"
             (click)="toggleSecurity()">
           <span class="inline-block w-4 h-4 ml-1 mt-1 bg-white rounded-full transform transition-transform duration-200"
            [class.translate-x-6]="appService.security().isEnabled"></span>
        </div>
      </div>

      @if (appService.security().isEnabled || isSettingUpPassword()) {
        <div class="space-y-4 max-w-md animate-in slide-in-from-top-2 fade-in">
           <div class="space-y-1.5">
             <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">New Password</label>
             <input [(ngModel)]="passwordInput" type="password" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors">
           </div>

           <div class="space-y-1.5">
             <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Confirm Password</label>
             <input [(ngModel)]="passwordConfirm" type="password" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors">
           </div>

           @if (passwordError()) {
             <div class="text-red-500 text-sm flex items-center gap-1">
               <i class="fa-solid fa-circle-exclamation"></i> {{ passwordError() }}
             </div>
           }

           <div class="pt-2">
             <button (click)="savePassword()" class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-medium rounded-lg text-sm transition-colors">
               {{ appService.security().isEnabled ? 'Update Password' : 'Set Password' }}
             </button>
             @if (showSecuritySuccess()) {
               <span class="ml-3 text-green-500 text-sm font-medium animate-in fade-in">Password updated!</span>
             }
           </div>
        </div>
      }
    </section>

    @if (appService.security().isEnabled) {
        <section class="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 p-6 transition-colors">
          <h2 class="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
          <div class="flex items-center justify-between">
            <p class="text-sm text-red-600/70 dark:text-red-400/70">Disable password protection (App will be accessible to anyone).</p>
            <button (click)="disableSecurity()" class="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 text-sm font-bold rounded-lg transition-colors">
              Disable Security
            </button>
          </div>
        </section>
    }
  `,
})
export class SecuritySettingsComponent {
  appService = inject(AppService);

  // Security State
  isSettingUpPassword = signal(false);
  passwordInput = '';
  passwordConfirm = '';
  passwordError = signal('');
  showSecuritySuccess = signal(false);

  // Security Methods
  toggleSecurity() {
    if (this.appService.security().isEnabled) {
       // Disabled via Danger Zone, handled by disableSecurity()
       // No explicit action here, as the danger zone button handles the actual disabling.
    } else {
      this.isSettingUpPassword.set(true);
    }
  }

  savePassword() {
    this.passwordError.set('');

    if (!this.passwordInput) {
      this.passwordError.set('Password cannot be empty.');
      return;
    }
    if (this.passwordInput !== this.passwordConfirm) {
      this.passwordError.set('Passwords do not match.');
      return;
    }

    this.appService.enableSecurity(this.passwordInput);
    this.passwordInput = '';
    this.passwordConfirm = '';
    this.isSettingUpPassword.set(false);
    this.showSecuritySuccess.set(true);
    setTimeout(() => this.showSecuritySuccess.set(false), 3000);
  }

  disableSecurity() {
    if(confirm('Are you sure you want to disable password protection?')) {
        this.appService.disableSecurity();
        this.isSettingUpPassword.set(false);
    }
  }
}
