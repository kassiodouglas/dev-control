import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setup-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 font-sans">
      <div class="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row min-h-[500px]">
        
        <!-- Sidebar / Progress -->
        <div class="bg-indigo-600 p-8 text-white md:w-1/3 flex flex-col justify-between relative overflow-hidden">
          <div class="relative z-10">
             <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-6 backdrop-blur-sm">
               <i class="fa-solid fa-code"></i>
             </div>
             <h1 class="text-2xl font-bold mb-2">DevControl</h1>
             <p class="text-indigo-100 text-sm opacity-90">Your all-in-one local development dashboard.</p>
          </div>

          <div class="relative z-10 space-y-6 mt-8">
            <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-50]="step() !== 1" [class.font-bold]="step() === 1">
              <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs" [class.bg-white]="step() >= 1" [class.text-indigo-600]="step() >= 1">
                @if(step() > 1) { <i class="fa-solid fa-check"></i> } @else { 1 }
              </div>
              <span>Profile</span>
            </div>
            <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-50]="step() !== 2" [class.font-bold]="step() === 2">
              <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs" [class.bg-white]="step() >= 2" [class.text-indigo-600]="step() >= 2">
                 @if(step() > 2) { <i class="fa-solid fa-check"></i> } @else { 2 }
              </div>
              <span>Integrations</span>
            </div>
            <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-50]="step() !== 3" [class.font-bold]="step() === 3">
              <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs" [class.bg-white]="step() >= 3" [class.text-indigo-600]="step() >= 3">
                 @if(step() > 3) { <i class="fa-solid fa-check"></i> } @else { 3 }
              </div>
              <span>Security</span>
            </div>
          </div>

          <!-- Decorative Circles -->
          <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
          <div class="absolute top-10 -left-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl opacity-30"></div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 p-8 md:p-10 flex flex-col bg-white dark:bg-zinc-900 transition-colors">
          
          <div class="flex-1">
             @switch (step()) {
               @case (1) {
                  <div class="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 class="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Welcome! 👋</h2>
                    <p class="text-zinc-500 dark:text-zinc-400 mb-8">Let's start by setting up your developer profile.</p>
                    
                    <div class="space-y-4">
                       <div class="space-y-1.5">
                         <label class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Display Name</label>
                         <input [(ngModel)]="profileName" type="text" placeholder="e.g. Jane Dev" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
                       </div>
                       <div class="space-y-1.5">
                         <label class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Avatar URL</label>
                         <div class="flex gap-3">
                           <div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                              <img [src]="profileAvatar" class="w-full h-full object-cover">
                           </div>
                           <input [(ngModel)]="profileAvatar" type="text" placeholder="https://..." class="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
                         </div>
                       </div>
                       <div class="space-y-1.5">
                         <label class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email (Optional)</label>
                         <input [(ngModel)]="profileEmail" type="email" placeholder="dev@company.com" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
                       </div>
                    </div>
                  </div>
               }
               @case (2) {
                  <div class="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 class="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Power Up ⚡</h2>
                    <p class="text-zinc-500 dark:text-zinc-400 mb-6">Connect external services to boost productivity.</p>
                    
                    <div class="space-y-6">
                       <!-- Gemini -->
                       <div class="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950">
                          <div class="flex items-center gap-2 mb-3">
                             <i class="fa-solid fa-brain text-purple-500"></i>
                             <h3 class="font-bold text-zinc-800 dark:text-white">Google Gemini AI</h3>
                             <span class="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase ml-auto">Recommended</span>
                          </div>
                          <input [(ngModel)]="geminiKey" type="password" placeholder="API Key (AIzaSy...)" class="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500">
                       </div>

                       <!-- Azure -->
                       <div class="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 opacity-90 hover:opacity-100 transition-opacity">
                          <div class="flex items-center gap-2 mb-3">
                             <i class="fa-brands fa-microsoft text-blue-500"></i>
                             <h3 class="font-bold text-zinc-800 dark:text-white">Azure DevOps</h3>
                          </div>
                          <div class="grid grid-cols-2 gap-3 mb-3">
                             <input [(ngModel)]="azureOrg" placeholder="Organization" class="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500">
                             <input [(ngModel)]="azureProject" placeholder="Project" class="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500">
                          </div>
                          <input [(ngModel)]="azureToken" type="password" placeholder="Personal Access Token (PAT)" class="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500">
                       </div>
                    </div>
                  </div>
               }
               @case (3) {
                  <div class="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 class="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Stay Safe 🔒</h2>
                    <p class="text-zinc-500 dark:text-zinc-400 mb-8">Protect your dashboard with a password (optional).</p>
                    
                    <div class="space-y-6">
                       <div class="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 cursor-pointer" (click)="enableSecurity.set(!enableSecurity())">
                          <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors" [class.bg-green-100]="enableSecurity()" [class.text-green-600]="enableSecurity()" [class.bg-zinc-200]="!enableSecurity()" [class.text-zinc-400]="!enableSecurity()">
                             <i class="fa-solid fa-shield-halved text-xl"></i>
                          </div>
                          <div class="flex-1">
                             <div class="font-bold text-zinc-800 dark:text-white">Enable App Lock</div>
                             <div class="text-xs text-zinc-500">Require password on startup</div>
                          </div>
                          <div class="relative w-12 h-6 rounded-full transition-colors duration-200" [class.bg-green-500]="enableSecurity()" [class.bg-zinc-300]="!enableSecurity()">
                             <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200" [class.translate-x-6]="enableSecurity()"></div>
                          </div>
                       </div>

                       @if (enableSecurity()) {
                         <div class="space-y-3 animate-in slide-in-from-top-2">
                            <input [(ngModel)]="password" type="password" placeholder="Enter Password" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                            <input [(ngModel)]="passwordConfirm" type="password" placeholder="Confirm Password" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                         </div>
                       }
                    </div>
                  </div>
               }
             }
          </div>

          <!-- Navigation Footer -->
          <div class="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
             @if (step() > 1) {
                <button (click)="step.set(step() - 1)" class="text-zinc-500 hover:text-zinc-800 dark:hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  Back
                </button>
             } @else {
                <div></div> <!-- Spacer -->
             }

             <button (click)="next()" [disabled]="!canProceed()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
               {{ step() === 3 ? 'Finish Setup' : 'Next Step' }}
             </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class SetupWizardComponent {
  appService = inject(AppService);
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

  finish() {
     // Save Profile
     this.appService.updateProfile(this.profileName, this.profileAvatar, this.profileEmail);

     // Save Integrations
     this.appService.updateIntegrations({
        geminiApiKey: this.geminiKey,
        azureOrg: this.azureOrg,
        azureProject: this.azureProject,
        azureToken: this.azureToken
     });

     // Save Security
     if (this.enableSecurity()) {
        this.appService.enableSecurity(this.password);
     }

     // Complete
     this.appService.completeSetup();
  }
}