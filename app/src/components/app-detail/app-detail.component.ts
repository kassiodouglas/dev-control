import { Component, inject, signal, computed, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService, LocalApp } from '../../services/app.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (app(); as currentApp) {
      <div class="h-full flex flex-col bg-white dark:bg-zinc-900 transition-colors">
        
        <!-- Top Toolbar -->
        <div class="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0 transition-colors">
          <div>
            <h2 class="text-xl font-bold text-zinc-800 dark:text-white">{{ currentApp.name }}</h2>
            <div class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              <span class="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{{ currentApp.path }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
             <!-- Status Toggle -->
             @if (currentApp.status === 'running') {
                <button (click)="toggleStatus(currentApp.id, 'stopped')" class="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <i class="fa-solid fa-stop"></i> Stop
                </button>
             } @else {
                <button (click)="toggleStatus(currentApp.id, 'running')" class="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <i class="fa-solid fa-play"></i> Start
                </button>
             }
             
             <!-- Branch Selector -->
             <div class="relative">
                <select 
                  [ngModel]="currentApp.branch" 
                  (ngModelChange)="changeBranch(currentApp.id, $event)"
                  class="appearance-none pl-9 pr-8 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 font-medium focus:outline-none cursor-pointer border border-transparent focus:border-indigo-500"
                >
                  @for (branch of currentApp.availableBranches; track branch) {
                    <option [value]="branch">{{ branch }}</option>
                  }
                </select>
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                  <i class="fa-solid fa-code-branch"></i>
                </div>
                 <div class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-xs">
                  <i class="fa-solid fa-chevron-down"></i>
                </div>
             </div>
          </div>
        </div>

        <!-- Main Content (Tabs Layout) -->
        <div class="flex-1 overflow-hidden flex">
          
          <!-- Middle: Terminal & Tools -->
          <div class="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-800 min-w-0">
            
            <!-- Tab Navigation -->
            <div class="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 transition-colors">
              <button 
                (click)="activeTab.set('terminal')"
                [class.bg-white]="activeTab() === 'terminal'"
                [class.dark:bg-zinc-900]="activeTab() === 'terminal'"
                [class.border-b-2]="activeTab() === 'terminal'"
                [class.border-indigo-500]="activeTab() === 'terminal'"
                [class.text-indigo-600]="activeTab() === 'terminal'"
                [class.dark:text-indigo-400]="activeTab() === 'terminal'"
                [class.text-zinc-600]="activeTab() !== 'terminal'"
                [class.dark:text-zinc-400]="activeTab() !== 'terminal'"
                class="px-6 py-3 text-sm font-medium hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors border-b-2 border-transparent"
              >
                <i class="fa-solid fa-terminal mr-2"></i> Terminal
              </button>
               <button 
                (click)="activeTab.set('notes')"
                [class.bg-white]="activeTab() === 'notes'"
                [class.dark:bg-zinc-900]="activeTab() === 'notes'"
                [class.border-b-2]="activeTab() === 'notes'"
                [class.border-indigo-500]="activeTab() === 'notes'"
                [class.text-indigo-600]="activeTab() === 'notes'"
                [class.dark:text-indigo-400]="activeTab() === 'notes'"
                [class.text-zinc-600]="activeTab() !== 'notes'"
                [class.dark:text-zinc-400]="activeTab() !== 'notes'"
                class="px-6 py-3 text-sm font-medium hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors border-b-2 border-transparent"
              >
                <i class="fa-solid fa-note-sticky mr-2"></i> Notes
              </button>
            </div>

            <!-- Tab Content Area -->
            <div class="flex-1 relative overflow-hidden bg-zinc-900 dark:bg-black">
              
              <!-- TERMINAL -->
              @if (activeTab() === 'terminal') {
                <div class="absolute inset-0 flex flex-col p-4">
                  <!-- Terminal Output -->
                  <div class="flex-1 overflow-y-auto font-mono text-sm space-y-1 custom-scrollbar" #terminalOutput>
                    <div class="text-zinc-500">Welcome to Git Bash (Simulated)</div>
                    <div class="text-zinc-500 mb-4">Current directory: {{ currentApp.path }}</div>
                    
                    @for (log of currentApp.logs; track log) {
                      <div class="break-words">
                        <span class="text-zinc-500 text-xs mr-2">[{{ log.timestamp | date:'HH:mm:ss' }}]</span>
                        @if (log.type === 'command') {
                          <span class="text-yellow-400">$ {{ log.message }}</span>
                        } @else if (log.type === 'success') {
                          <span class="text-green-400">{{ log.message }}</span>
                        } @else if (log.type === 'error') {
                          <span class="text-red-400">{{ log.message }}</span>
                        } @else {
                          <span class="text-zinc-300">{{ log.message }}</span>
                        }
                      </div>
                    }
                  </div>
                  
                  <!-- Terminal Input -->
                  <div class="mt-4 flex items-center gap-2 border-t border-zinc-700 pt-3">
                    <span class="text-green-500 font-bold font-mono">$</span>
                    <input 
                      type="text" 
                      [(ngModel)]="terminalInput" 
                      (keydown.enter)="executeCommand(currentApp.id)"
                      placeholder="Type a command..."
                      class="flex-1 bg-transparent border-none text-white font-mono focus:ring-0 focus:outline-none placeholder-zinc-600"
                      autofocus
                    >
                  </div>
                </div>
              }

              <!-- NOTES -->
              @if (activeTab() === 'notes') {
                <div class="absolute inset-0 bg-white dark:bg-zinc-900 flex flex-col transition-colors">
                  <div class="flex-1 p-4">
                     <textarea 
                        [ngModel]="currentApp.notes"
                        (ngModelChange)="updateAppNotes(currentApp.id, $event)"
                        class="w-full h-full resize-none p-4 text-zinc-700 dark:text-zinc-200 focus:outline-none font-mono text-sm leading-relaxed border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-300 transition-colors"
                        placeholder="Write your project notes here using Markdown..."
                      ></textarea>
                  </div>
                  <div class="px-4 pb-2 text-xs text-zinc-400 flex justify-between">
                    <span>Markdown Supported</span>
                    <span>{{ currentApp.notes.length }} chars</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Right Sidebar: Commands & Actions -->
          <div class="w-72 bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 transition-colors">
             <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
               <span>Saved Commands</span>
               <button (click)="isAddingCommand.set(!isAddingCommand())" class="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-1 rounded">
                 <i class="fa-solid fa-plus"></i>
               </button>
             </div>

             <!-- Add Command Form -->
             @if (isAddingCommand()) {
                <div class="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
                  <input [(ngModel)]="newCmdName" placeholder="Label (e.g. Build)" class="w-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white text-sm p-2 border border-zinc-300 dark:border-zinc-700 rounded focus:outline-none focus:border-indigo-500">
                  <input [(ngModel)]="newCmdExec" placeholder="Command (e.g. npm run build)" class="w-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white text-sm p-2 border border-zinc-300 dark:border-zinc-700 rounded font-mono focus:outline-none focus:border-indigo-500">
                  <div class="flex justify-end gap-2">
                     <button (click)="isAddingCommand.set(false)" class="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Cancel</button>
                     <button (click)="saveCommand(currentApp.id)" class="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500">Save</button>
                  </div>
                </div>
             }

             <!-- Commands List -->
             <div class="flex-1 overflow-y-auto p-4 space-y-3">
               @for (cmd of currentApp.savedCommands; track cmd.id) {
                 <div 
                   (click)="runSavedCommand(currentApp.id, cmd)"
                   class="bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm cursor-pointer transition-all group relative overflow-hidden"
                 >
                    <div class="font-bold text-zinc-700 dark:text-zinc-200 text-sm mb-1">{{ cmd.name }}</div>
                    <div class="text-xs text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-950 p-1 rounded truncate">{{ cmd.command }}</div>
                    
                    <div class="absolute inset-y-0 right-0 w-8 bg-indigo-500 text-white flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform">
                      <i class="fa-solid fa-play text-xs"></i>
                    </div>
                 </div>
               }

               @if (currentApp.savedCommands.length === 0) {
                 <div class="text-center text-zinc-400 dark:text-zinc-600 text-sm py-8 italic">
                   No saved commands yet.
                 </div>
               }
             </div>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 3px; }
    :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
  `]
})
export class AppDetailComponent {
  appService = inject(AppService);
  app = this.appService.selectedApp;
  
  activeTab = signal<'terminal' | 'notes'>('terminal');
  
  // Terminal
  terminalInput = '';
  @ViewChild('terminalOutput') terminalContainer!: ElementRef;

  // Command Form
  isAddingCommand = signal(false);
  newCmdName = '';
  newCmdExec = '';

  constructor() {
    // Auto scroll terminal
    effect(() => {
      const logs = this.app()?.logs; // dependency
      if (logs && this.terminalContainer) {
        setTimeout(() => {
           this.terminalContainer.nativeElement.scrollTop = this.terminalContainer.nativeElement.scrollHeight;
        }, 50);
      }
    });
  }

  toggleStatus(id: string, status: 'running' | 'stopped') {
    this.appService.updateAppStatus(id, status);
    if (status === 'running') {
      this.appService.addLog(id, 'Starting application...', 'info');
      setTimeout(() => this.appService.addLog(id, 'Application started successfully on port 4200.', 'success'), 1500);
    } else {
      this.appService.addLog(id, 'Stopping application...', 'info');
      setTimeout(() => this.appService.addLog(id, 'Process terminated.', 'error'), 1000);
    }
  }

  changeBranch(id: string, branch: string) {
    this.appService.changeBranch(id, branch);
  }

  updateAppNotes(id: string, notes: string) {
    this.appService.updateAppNotes(id, notes);
  }

  saveCommand(id: string) {
    if (this.newCmdName && this.newCmdExec) {
      this.appService.addSavedCommand(id, this.newCmdName, this.newCmdExec);
      this.isAddingCommand.set(false);
      this.newCmdName = '';
      this.newCmdExec = '';
    }
  }

  executeCommand(id: string) {
    const cmd = this.terminalInput.trim();
    if (!cmd) return;

    this.appService.addLog(id, cmd, 'command');
    this.terminalInput = '';

    // Simulate response
    setTimeout(() => {
      this.processCommand(id, cmd);
    }, 400);
  }

  runSavedCommand(id: string, cmd: any) {
    this.appService.addLog(id, cmd.command, 'command');
    setTimeout(() => {
      this.processCommand(id, cmd.command);
    }, 400);
  }

  private processCommand(id: string, cmd: string) {
    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd.includes('npm install') || lowerCmd.includes('npm i')) {
      this.appService.addLog(id, 'added 156 packages, and audited 157 packages in 2s', 'success');
      this.appService.addLog(id, 'found 0 vulnerabilities', 'success');
    } else if (lowerCmd.includes('git status')) {
      this.appService.addLog(id, `On branch ${this.app()?.branch}`, 'info');
      this.appService.addLog(id, 'Your branch is up to date with \'origin/' + this.app()?.branch + '\'.', 'info');
      this.appService.addLog(id, 'nothing to commit, working tree clean', 'info');
    } else if (lowerCmd.includes('ls') || lowerCmd.includes('dir')) {
      this.appService.addLog(id, 'src  public  package.json  tsconfig.json  README.md', 'info');
    } else if (lowerCmd.includes('start') || lowerCmd.includes('run')) {
      this.appService.addLog(id, '> application@0.0.0 start', 'info');
      this.appService.addLog(id, '> ng serve', 'info');
      if (this.app()?.status !== 'running') {
          this.appService.updateAppStatus(id, 'running');
          this.appService.addLog(id, 'Server listening on localhost:4200', 'success');
      } else {
        this.appService.addLog(id, 'Port 4200 is already in use.', 'error');
      }
    } else if (lowerCmd === 'clear') {
       this.appService.clearLogs(id);
    } else {
      this.appService.addLog(id, `bash: ${cmd.split(' ')[0]}: command not found`, 'error');
    }
  }
}