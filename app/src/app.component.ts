import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppDetailComponent } from './components/app-detail/app-detail.component';
import { NotesComponent } from './components/notes/notes.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AzureDevopsComponent } from './components/azure-devops/azure-devops.component';
import { SetupWizardComponent } from './components/setup-wizard/setup-wizard.component';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, DashboardComponent, AppDetailComponent, NotesComponent, SettingsComponent, AzureDevopsComponent, SetupWizardComponent],
  styles: [`
    @keyframes pageEnter {
      from { opacity: 0; transform: translateY(10px) scale(0.995); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .page-animate {
      animation: pageEnter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      will-change: transform, opacity;
    }
  `],
  template: `
    @if (!appService.isConfigured()) {
       <!-- Setup Wizard -->
       <app-setup-wizard class="page-animate"></app-setup-wizard>
    } @else {
      <!-- Main Application -->
      
      <!-- Lock Screen Overlay -->
      @if (appService.security().isLocked) {
        <div class="fixed inset-0 z-50 bg-zinc-900 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
          <div class="mb-8 flex flex-col items-center">
             <div class="w-24 h-24 rounded-full border-4 border-zinc-700 bg-zinc-800 flex items-center justify-center text-4xl mb-4 overflow-hidden">
               @if(appService.userProfile().avatarUrl) {
                 <img [src]="appService.userProfile().avatarUrl" class="w-full h-full object-cover">
               } @else {
                 <i class="fa-solid fa-user-lock text-zinc-500"></i>
               }
             </div>
             <h2 class="text-2xl font-bold">{{ appService.userProfile().name }}</h2>
             <p class="text-zinc-500">App Locked</p>
          </div>

          <div class="w-full max-w-xs space-y-4">
             <input 
               type="password" 
               [(ngModel)]="unlockPassword" 
               (keydown.enter)="tryUnlock()"
               placeholder="Enter Password" 
               class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-center text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
             >
             <button (click)="tryUnlock()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
               Unlock
             </button>
             @if (unlockError()) {
               <div class="text-red-500 text-sm text-center font-medium animate-pulse">{{ unlockError() }}</div>
             }
          </div>
        </div>
      }

      <!-- Main Layout -->
      <div class="flex h-screen w-screen bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden" [class.blur-sm]="appService.security().isLocked">
        <!-- Sidebar (Dynamic Width) -->
        <div 
          class="h-full shrink-0 shadow-xl z-20 transition-all duration-300 ease-in-out"
          [class.w-64]="!appService.sidebarCollapsed()"
          [class.w-20]="appService.sidebarCollapsed()"
        >
          <app-sidebar></app-sidebar>
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 h-full overflow-hidden relative">
          @switch (appService.activeView()) {
            @case ('app-detail') {
              <app-detail class="h-full w-full block page-animate"></app-detail>
            }
            @case ('notes') {
              <app-notes class="h-full w-full block page-animate"></app-notes>
            }
            @case ('settings') {
              <app-settings class="h-full w-full block page-animate"></app-settings>
            }
            @case ('azure-devops') {
              <app-azure-devops class="h-full w-full block page-animate"></app-azure-devops>
            }
            @default {
              <div class="h-full w-full overflow-y-auto page-animate">
                 <app-dashboard></app-dashboard>
              </div>
            }
          }
        </main>
      </div>
    }
  `
})
export class AppComponent {
  appService = inject(AppService);
  unlockPassword = '';
  unlockError = signal('');

  tryUnlock() {
    if (this.unlockPassword === this.appService.security().password) {
      this.appService.unlockApp();
      this.unlockPassword = '';
      this.unlockError.set('');
    } else {
      this.unlockError.set('Incorrect password');
      this.unlockPassword = '';
    }
  }
}