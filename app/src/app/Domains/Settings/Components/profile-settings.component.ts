import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../Core/Services/app.service';

@Component({
  selector: 'comp-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
  `,
})
export class ProfileSettingsComponent {
  appService = inject(AppService);

  // Profile State
  displayName = '';
  avatarUrl = '';
  email = '';
  showProfileSuccess = signal(false);

  constructor() {
    effect(() => {
      const profile = this.appService.userProfile();
      this.displayName = profile.name;
      this.avatarUrl = profile.avatarUrl;
      this.email = profile.email;
    });
  }

  // Profile Methods
  saveProfile() {
    this.appService.updateProfile(this.displayName, this.avatarUrl, this.email);
    this.showProfileSuccess.set(true);
    setTimeout(() => this.showProfileSuccess.set(false), 3000);
  }
}
