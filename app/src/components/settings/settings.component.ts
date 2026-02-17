import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-8 overflow-y-auto h-full custom-scrollbar pb-20">
      <h1 class="text-3xl font-bold text-zinc-800 dark:text-white">Settings</h1>

      <!-- Profile Section -->
      <section class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 transition-colors">
        <h2 class="text-xl font-semibold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
          <i class="fa-solid fa-user-circle text-indigo-500"></i> Profile
        </h2>
        
        <div class="flex items-start gap-8 flex-col sm:flex-row">
          <div class="flex flex-col items-center gap-3">
             <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-sm relative group">
                <img [src]="avatarUrl" alt="Avatar" class="w-full h-full object-cover">
             </div>
          </div>

          <div class="flex-1 w-full space-y-4">
             <div class="space-y-1.5">
               <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Display Name</label>
               <input [(ngModel)]="displayName" type="text" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
             </div>
             <div class="space-y-1.5">
               <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
               <input [(ngModel)]="email" type="email" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
             </div>
             <div class="space-y-1.5">
               <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Avatar URL</label>
               <input [(ngModel)]="avatarUrl" type="text" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
             </div>
             <div class="pt-2">
               <button (click)="saveProfile()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm shadow-indigo-200 dark:shadow-none">
                 Save Profile
               </button>
               @if (showProfileSuccess()) {
                 <span class="ml-3 text-green-500 text-sm font-medium animate-in fade-in">Saved successfully!</span>
               }
             </div>
          </div>
        </div>
      </section>

      <!-- Integrations Section -->
      <section class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 transition-colors">
        <h2 class="text-xl font-semibold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
          <i class="fa-solid fa-plug text-indigo-500"></i> Integrations
        </h2>

        <div class="space-y-6">
          <!-- Gemini AI -->
          <div class="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
             <h3 class="font-bold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
               <i class="fa-solid fa-brain text-purple-500"></i> Google Gemini AI
             </h3>
             <div class="space-y-1.5">
               <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">API Key</label>
               <input [(ngModel)]="geminiApiKey" type="password" placeholder="AIzaSy..." class="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 font-mono transition-colors">
             </div>
          </div>

          <!-- Azure DevOps -->
          <div class="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
             <h3 class="font-bold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
               <i class="fa-brands fa-microsoft text-blue-500"></i> Azure DevOps
             </h3>
             <div class="space-y-4">
               <div class="space-y-1.5">
                 <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Personal Access Token (PAT)</label>
                 <input [(ngModel)]="azureToken" type="password" placeholder="Enter your Azure PAT..." class="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 font-mono transition-colors">
               </div>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Organization Name</label>
                    <input [(ngModel)]="azureOrg" type="text" placeholder="e.g. my-org" class="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors">
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Project Name</label>
                    <input [(ngModel)]="azureProject" type="text" placeholder="e.g. MyProject" class="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors">
                  </div>
               </div>
             </div>
          </div>
          
          <div class="pt-2">
            <button (click)="saveIntegrations()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
              Save Integrations
            </button>
            @if (showIntegrationSuccess()) {
               <span class="ml-3 text-green-500 text-sm font-medium animate-in fade-in">Saved successfully!</span>
            }
          </div>
        </div>
      </section>

      <!-- Security Section -->
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

      <!-- Data Management Section -->
      <section class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 transition-colors">
        <h2 class="text-xl font-semibold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
          <i class="fa-solid fa-database text-indigo-500"></i> Backup & Restore
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 text-xl">
                <i class="fa-solid fa-download"></i>
              </div>
              <h3 class="font-bold text-zinc-800 dark:text-white mb-1">Export Data</h3>
              <p class="text-sm text-zinc-500 mb-4 px-4">Download a JSON file containing all your apps, logs, and notes.</p>
              <button (click)="downloadBackup()" class="mt-auto w-full py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors">
                Download JSON
              </button>
           </div>

           <div class="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 text-xl">
                <i class="fa-solid fa-upload"></i>
              </div>
              <h3 class="font-bold text-zinc-800 dark:text-white mb-1">Import Data</h3>
              <p class="text-sm text-zinc-500 mb-4 px-4">Restore your data from a previously exported JSON file.</p>
              
              <input type="file" #fileInput class="hidden" (change)="onFileSelected($event)" accept=".json">
              
              <button (click)="fileInput.click()" class="mt-auto w-full py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors">
                Select File
              </button>
              @if (importStatus()) {
                <div class="mt-2 text-xs font-medium" [class.text-green-500]="importStatus()?.includes('Success')" [class.text-red-500]="importStatus()?.includes('Failed')">
                  {{ importStatus() }}
                </div>
              }
           </div>
        </div>
      </section>
      
      <!-- Danger Zone -->
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
    </div>
  `
})
export class SettingsComponent {
  appService = inject(AppService);
  
  // Profile State
  displayName = '';
  avatarUrl = '';
  email = '';
  showProfileSuccess = signal(false);

  // Integrations State
  geminiApiKey = '';
  azureToken = '';
  azureOrg = '';
  azureProject = '';
  showIntegrationSuccess = signal(false);

  // Security State
  isSettingUpPassword = signal(false);
  passwordInput = '';
  passwordConfirm = '';
  passwordError = signal('');
  showSecuritySuccess = signal(false);

  // Data State
  importStatus = signal<string | null>(null);

  constructor() {
    effect(() => {
      const profile = this.appService.userProfile();
      this.displayName = profile.name;
      this.avatarUrl = profile.avatarUrl;
      this.email = profile.email;

      const integrations = this.appService.integrations();
      this.geminiApiKey = integrations.geminiApiKey;
      this.azureToken = integrations.azureToken;
      this.azureOrg = integrations.azureOrg;
      this.azureProject = integrations.azureProject;
    });
  }

  // Profile Methods
  saveProfile() {
    this.appService.updateProfile(this.displayName, this.avatarUrl, this.email);
    this.showProfileSuccess.set(true);
    setTimeout(() => this.showProfileSuccess.set(false), 3000);
  }

  // Integration Methods
  saveIntegrations() {
    this.appService.updateIntegrations({
      geminiApiKey: this.geminiApiKey,
      azureToken: this.azureToken,
      azureOrg: this.azureOrg,
      azureProject: this.azureProject
    });
    this.showIntegrationSuccess.set(true);
    setTimeout(() => this.showIntegrationSuccess.set(false), 3000);
  }

  // Security Methods
  toggleSecurity() {
    if (this.appService.security().isEnabled) {
       // Disabled via Danger Zone
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

  // Backup Methods
  downloadBackup() {
    const json = this.appService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localdev-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const success = this.appService.importData(e.target.result);
        if (success) {
          this.importStatus.set('Import Success! Data restored.');
        } else {
          this.importStatus.set('Import Failed. Invalid JSON.');
        }
        setTimeout(() => this.importStatus.set(null), 5000);
      };
      reader.readAsText(file);
    }
  }
}