import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative h-full flex flex-col transition-colors duration-300 bg-white border-r border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
      <!-- Header -->
      <div 
        class="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center shrink-0 h-[89px]"
        [class.justify-between]="!appService.sidebarCollapsed()"
        [class.justify-center]="appService.sidebarCollapsed()"
      >
        @if (!appService.sidebarCollapsed()) {
          <div class="flex items-center gap-3 cursor-pointer overflow-hidden" (click)="goToDashboard()">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none shrink-0">
              <i class="fa-solid fa-code"></i>
            </div>
            <span class="font-bold text-lg text-zinc-800 dark:text-white tracking-tight whitespace-nowrap">LocalDev Hub</span>
          </div>
        } @else {
           <div (click)="goToDashboard()" class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:bg-indigo-700 transition-colors">
              <i class="fa-solid fa-code"></i>
           </div>
        }
        
        @if (!appService.sidebarCollapsed()) {
          <button (click)="appService.toggleSidebar()" class="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <i class="fa-solid fa-angles-left"></i>
          </button>
        }
      </div>

      <!-- Add New Button -->
      <div class="p-4 shrink-0 flex justify-center">
        <button 
          (click)="isModalOpen.set(true)" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center justify-center font-medium shadow-lg shadow-indigo-600/20"
          [class.w-full]="!appService.sidebarCollapsed()"
          [class.py-2]="!appService.sidebarCollapsed()"
          [class.px-4]="!appService.sidebarCollapsed()"
          [class.gap-2]="!appService.sidebarCollapsed()"
          [class.w-10]="appService.sidebarCollapsed()"
          [class.h-10]="appService.sidebarCollapsed()"
          [class.rounded-lg]="appService.sidebarCollapsed()"
          title="New Project"
        >
          <i class="fa-solid fa-plus"></i>
          @if (!appService.sidebarCollapsed()) {
            <span>New Project</span>
          }
        </button>
      </div>

      <!-- Main Navigation -->
      <div class="px-2 space-y-1 mb-4 shrink-0">
         <div 
            (click)="goToDashboard()" 
            class="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors"
            [class.justify-center]="appService.sidebarCollapsed()"
            [class.bg-zinc-100]="appService.activeView() === 'dashboard'"
            [class.dark:bg-zinc-800]="appService.activeView() === 'dashboard'"
            [class.text-indigo-600]="appService.activeView() === 'dashboard'"
            [class.dark:text-indigo-400]="appService.activeView() === 'dashboard'"
            [class.text-zinc-600]="appService.activeView() !== 'dashboard'"
            [class.dark:text-zinc-400]="appService.activeView() !== 'dashboard'"
            [class.hover:bg-zinc-50]="appService.activeView() !== 'dashboard'"
            [class.dark:hover:bg-zinc-800]="appService.activeView() !== 'dashboard'"
            title="Dashboard"
         >
           <i class="fa-solid fa-chart-pie w-5 text-center"></i>
           @if (!appService.sidebarCollapsed()) {
             <span class="text-sm font-medium whitespace-nowrap">Dashboard</span>
           }
         </div>
         <div 
            (click)="goToAzure()" 
            class="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors"
            [class.justify-center]="appService.sidebarCollapsed()"
            [class.bg-zinc-100]="appService.activeView() === 'azure-devops'"
            [class.dark:bg-zinc-800]="appService.activeView() === 'azure-devops'"
            [class.text-indigo-600]="appService.activeView() === 'azure-devops'"
            [class.dark:text-indigo-400]="appService.activeView() === 'azure-devops'"
            [class.text-zinc-600]="appService.activeView() !== 'azure-devops'"
            [class.dark:text-zinc-400]="appService.activeView() !== 'azure-devops'"
            [class.hover:bg-zinc-50]="appService.activeView() !== 'azure-devops'"
            [class.dark:hover:bg-zinc-800]="appService.activeView() !== 'azure-devops'"
            title="Azure Boards"
         >
           <i class="fa-brands fa-microsoft w-5 text-center"></i>
           @if (!appService.sidebarCollapsed()) {
             <span class="text-sm font-medium whitespace-nowrap">Azure Boards</span>
           }
         </div>
         <div 
            (click)="goToNotes()" 
            class="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors"
            [class.justify-center]="appService.sidebarCollapsed()"
            [class.bg-zinc-100]="appService.activeView() === 'notes'"
            [class.dark:bg-zinc-800]="appService.activeView() === 'notes'"
            [class.text-indigo-600]="appService.activeView() === 'notes'"
            [class.dark:text-indigo-400]="appService.activeView() === 'notes'"
            [class.text-zinc-600]="appService.activeView() !== 'notes'"
            [class.dark:text-zinc-400]="appService.activeView() !== 'notes'"
            [class.hover:bg-zinc-50]="appService.activeView() !== 'notes'"
            [class.dark:hover:bg-zinc-800]="appService.activeView() !== 'notes'"
            title="Global Notes"
         >
           <i class="fa-solid fa-note-sticky w-5 text-center"></i>
           @if (!appService.sidebarCollapsed()) {
             <span class="text-sm font-medium whitespace-nowrap">Global Notes</span>
           }
         </div>
         <div 
            (click)="goToSettings()" 
            class="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors"
            [class.justify-center]="appService.sidebarCollapsed()"
            [class.bg-zinc-100]="appService.activeView() === 'settings'"
            [class.dark:bg-zinc-800]="appService.activeView() === 'settings'"
            [class.text-indigo-600]="appService.activeView() === 'settings'"
            [class.dark:text-indigo-400]="appService.activeView() === 'settings'"
            [class.text-zinc-600]="appService.activeView() !== 'settings'"
            [class.dark:text-zinc-400]="appService.activeView() !== 'settings'"
            [class.hover:bg-zinc-50]="appService.activeView() !== 'settings'"
            [class.dark:hover:bg-zinc-800]="appService.activeView() !== 'settings'"
            title="Settings"
         >
           <i class="fa-solid fa-gear w-5 text-center"></i>
           @if (!appService.sidebarCollapsed()) {
             <span class="text-sm font-medium whitespace-nowrap">Settings</span>
           }
         </div>
      </div>

      <!-- App List -->
      <div class="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar border-t border-zinc-200 dark:border-zinc-800">
        @if (!appService.sidebarCollapsed()) {
          <div class="px-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 mt-4 whitespace-nowrap">Repositories</div>
        } @else {
           <div class="h-4 mt-4"></div>
        }
        
        @for (app of appService.apps(); track app.id) {
          <div 
            (click)="selectApp(app.id)"
            class="group flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200"
            [class.justify-center]="appService.sidebarCollapsed()"
            [class.bg-zinc-100]="appService.selectedAppId() === app.id"
            [class.dark:bg-zinc-800]="appService.selectedAppId() === app.id"
            [class.text-indigo-600]="appService.selectedAppId() === app.id"
            [class.dark:text-indigo-400]="appService.selectedAppId() === app.id"
            [class.text-zinc-600]="appService.selectedAppId() !== app.id"
            [class.dark:text-zinc-400]="appService.selectedAppId() !== app.id"
            [class.hover:bg-zinc-50]="appService.selectedAppId() !== app.id"
            [class.dark:hover:bg-zinc-800]="appService.selectedAppId() !== app.id"
            [attr.title]="app.name"
          >
            <div class="w-2.5 h-2.5 rounded-full shrink-0" 
              [class.bg-green-500]="app.status === 'running'"
              [class.bg-zinc-400]="app.status !== 'running'"
              [class.ring-2]="appService.sidebarCollapsed() && app.status === 'running'"
              [class.ring-green-500]="appService.sidebarCollapsed() && app.status === 'running'"
              [class.ring-opacity-30]="appService.sidebarCollapsed() && app.status === 'running'"
            ></div>
            
            @if (!appService.sidebarCollapsed()) {
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{{ app.name }}</div>
                <div class="text-[10px] text-zinc-400 dark:text-zinc-500 truncate group-hover:text-zinc-500 dark:group-hover:text-zinc-400 font-mono">{{ app.host }}:{{ app.port }}</div>
              </div>
              @if (app.status === 'running') {
                <i class="fa-solid fa-bolt text-xs text-yellow-500 animate-pulse"></i>
              }
            }
          </div>
        }
      </div>

      <!-- Footer User -->
      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0 flex flex-col gap-3 relative">
        @if (!appService.sidebarCollapsed()) {
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Theme</span>
            <button (click)="appService.toggleTheme()" class="text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">
              @if(appService.darkMode()) {
                <i class="fa-solid fa-sun"></i>
              } @else {
                <i class="fa-solid fa-moon"></i>
              }
            </button>
          </div>
        }

        <div class="flex items-center gap-3" [class.justify-center]="appService.sidebarCollapsed()">
          <img [src]="appService.userProfile().avatarUrl" class="w-8 h-8 rounded-full object-cover bg-zinc-200 dark:bg-zinc-700 shrink-0">
          
          @if (!appService.sidebarCollapsed()) {
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{{ appService.userProfile().name }}</div>
              <div class="text-[10px] text-zinc-500 dark:text-zinc-500 truncate">Local Environment</div>
            </div>
            @if (appService.security().isEnabled) {
              <button (click)="appService.lockApp()" class="text-zinc-400 hover:text-red-500 transition-colors" title="Lock App">
                <i class="fa-solid fa-lock"></i>
              </button>
            }
          } @else {
             <!-- Collapsed Actions -->
             @if (appService.sidebarCollapsed()) {
                <button (click)="appService.toggleSidebar()" class="absolute bottom-20 left-1/2 -translate-x-1/2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10 transition-colors">
                   <i class="fa-solid fa-angles-right"></i>
                </button>
             }
          }
        </div>
      </div>
    </div>

    <!-- Create App Modal -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-700">
          
          <!-- Modal Header -->
          <div class="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center">
             <h3 class="text-lg font-bold text-zinc-800 dark:text-white">New Local Project</h3>
             <button (click)="isModalOpen.set(false)" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
               <i class="fa-solid fa-xmark text-lg"></i>
             </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Project Name</label>
              <input type="text" [(ngModel)]="newAppName" placeholder="e.g. My Awesome App" class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            </div>
            
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Local Path</label>
              <div class="flex gap-2">
                 <input type="text" [(ngModel)]="newAppPath" placeholder="C:\\Projects\\MyApp" class="flex-1 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                 <button class="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <i class="fa-solid fa-folder-open"></i>
                 </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Host</label>
                <input type="text" [(ngModel)]="newAppHost" placeholder="localhost" class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Port</label>
                <input type="number" [(ngModel)]="newAppPort" placeholder="4200" class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Start Command</label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-zinc-500 dark:text-zinc-400 text-sm font-mono">$</span>
                <input type="text" [(ngModel)]="newAppStartCmd" placeholder="npm start" class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-6 pr-3 py-2 text-sm font-mono text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-end gap-3">
             <button (click)="isModalOpen.set(false)" class="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors">Cancel</button>
             <button (click)="createApp()" [disabled]="!newAppName || !newAppPath" class="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
               <i class="fa-solid fa-plus mr-1"></i> Create Project
             </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 2px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
    
    :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
    :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
  `]
})
export class SidebarComponent {
  appService = inject(AppService);
  isModalOpen = signal(false);
  
  // Form Models
  newAppName = '';
  newAppPath = '';
  newAppHost = 'localhost';
  newAppPort: number | null = 3000;
  newAppStartCmd = 'npm start';

  selectApp(id: string) {
    this.appService.selectApp(id);
  }

  goToDashboard() {
    this.appService.setView('dashboard');
  }

  goToAzure() {
    this.appService.setView('azure-devops');
  }

  goToNotes() {
    this.appService.setView('notes');
  }

  goToSettings() {
    this.appService.setView('settings');
  }

  createApp() {
    if (this.newAppName && this.newAppPath) {
      this.appService.addApp({
        name: this.newAppName,
        path: this.newAppPath,
        host: this.newAppHost || 'localhost',
        port: this.newAppPort || 3000,
        startCommand: this.newAppStartCmd || 'npm start'
      });
      
      this.isModalOpen.set(false);
      this.resetForm();
    }
  }

  resetForm() {
    this.newAppName = '';
    this.newAppPath = '';
    this.newAppHost = 'localhost';
    this.newAppPort = 3000;
    this.newAppStartCmd = 'npm start';
  }
}