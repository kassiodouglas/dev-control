import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto pb-20">
      <h1 class="text-3xl font-bold text-zinc-800 dark:text-white mb-2">Dashboard</h1>
      <p class="text-zinc-500 dark:text-zinc-400 mb-8">System overview and active processes.</p>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Stat Card 1: Total Projects -->
        <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 transition-colors">
          <div class="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div>
            <div class="text-2xl font-bold text-zinc-800 dark:text-white">{{ appService.apps().length }}</div>
            <div class="text-sm text-zinc-500 dark:text-zinc-400">Total Projects</div>
          </div>
        </div>

        <!-- Stat Card 2: Running Apps -->
        <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 transition-colors">
          <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid fa-play"></i>
          </div>
          <div>
            <div class="text-2xl font-bold text-zinc-800 dark:text-white">{{ appService.runningAppsCount() }}</div>
            <div class="text-sm text-zinc-500 dark:text-zinc-400">Running Apps</div>
          </div>
        </div>

        <!-- Stat Card 3: Active Stories + Breakdown (Spans 2 cols on LG) -->
        <div class="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
              <i class="fa-brands fa-microsoft"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-zinc-800 dark:text-white">{{ appService.azureWorkItems().length }}</div>
              <div class="text-sm text-zinc-500 dark:text-zinc-400">Active Stories</div>
            </div>
          </div>
          
          <!-- Status Breakdown -->
          <div class="flex flex-wrap gap-2 justify-start sm:justify-end flex-1">
             @for (stat of usStats(); track stat.state) {
                <div class="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-colors" [ngClass]="getStatColorClass(stat.state)">
                   <span>{{ stat.state }}</span>
                   <span class="bg-white/40 dark:bg-black/20 px-1.5 py-0.5 rounded text-[10px] min-w-[20px] text-center">{{ stat.count }}</span>
                </div>
             }
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Active Apps List -->
        <div>
           <h2 class="text-xl font-bold text-zinc-800 dark:text-white mb-4">Active Applications</h2>
           <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors min-h-[200px]">
             @if (appService.runningAppsCount() > 0) {
               <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
                 @for (app of appService.apps(); track app.id) {
                   @if (app.status === 'running') {
                     <div class="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <div class="flex items-center gap-3 min-w-0">
                           <div class="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <i class="fa-brands fa-js"></i>
                           </div>
                           <div class="min-w-0">
                              <div class="font-medium text-zinc-700 dark:text-zinc-200 truncate">{{ app.name }}</div>
                              <div class="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                <i class="fa-solid fa-code-branch mr-1 text-zinc-400"></i>{{ app.branch }} :{{ app.port }}
                              </div>
                           </div>
                        </div>
                        <div class="flex items-center gap-2">
                           <button (click)="openApp(app.id)" class="w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-indigo-500 transition-colors">
                             <i class="fa-solid fa-arrow-right-to-bracket"></i>
                           </button>
                           <button (click)="stopApp(app.id)" class="w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors">
                             <i class="fa-solid fa-power-off"></i>
                           </button>
                        </div>
                     </div>
                   }
                 }
               </div>
             } @else {
               <div class="p-8 text-center text-zinc-400 dark:text-zinc-500 flex flex-col items-center justify-center h-full">
                 <i class="fa-solid fa-ghost text-4xl mb-3 opacity-50"></i>
                 <p>No applications running currently.</p>
               </div>
             }
           </div>
        </div>

        <!-- Active User Stories List -->
        <div>
           <div class="flex items-center justify-between mb-4">
             <h2 class="text-xl font-bold text-zinc-800 dark:text-white">Recent Stories</h2>
             <button (click)="goToAzure()" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View Board</button>
           </div>
           
           <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors min-h-[200px]">
             @if (appService.azureWorkItems().length > 0) {
               <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
                 @for (item of appService.azureWorkItems().slice(0, 5); track item.id) {
                    <div (click)="goToAzure()" class="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors group">
                       <div class="flex items-center gap-3 min-w-0">
                          <span class="shrink-0 text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">#{{ item.id }}</span>
                          <div class="min-w-0">
                            <div class="text-sm font-medium text-zinc-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ item.title }}</div>
                            <div class="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                               @if(getLinkedAppId(item.id); as appId) {
                                  <span class="text-indigo-500 flex items-center gap-1">
                                    <i class="fa-solid fa-link"></i> Linked
                                  </span>
                                  <span class="text-zinc-300 dark:text-zinc-600">|</span>
                               }
                               <span>{{ item.assignedTo }}</span>
                            </div>
                          </div>
                       </div>
                       <div class="shrink-0 pl-2">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold capitalize whitespace-nowrap" 
                            [ngClass]="getStatusClass(item.state)">
                            {{ item.state }}
                          </span>
                       </div>
                    </div>
                 }
               </div>
             } @else {
                <div class="p-8 text-center text-zinc-400 dark:text-zinc-500 flex flex-col items-center justify-center h-full">
                    <i class="fa-brands fa-microsoft text-4xl mb-3 opacity-50"></i>
                    <p>No active stories found.</p>
                </div>
             }
           </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  appService = inject(AppService);

  usStats = computed(() => {
    const items = this.appService.azureWorkItems();
    const counts: Record<string, number> = {};
    
    for (const item of items) {
      const s = item.state;
      counts[s] = (counts[s] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);
  });

  ngOnInit() {
    // Force load if not present
    if (this.appService.azureWorkItems().length === 0) {
      this.appService.fetchAzureUserStories();
    }
  }

  stopApp(id: string) {
    this.appService.updateAppStatus(id, 'stopped');
  }

  openApp(id: string) {
    this.appService.selectApp(id);
  }

  goToAzure() {
    this.appService.setView('azure-devops');
  }

  getLinkedAppId(id: number) {
    return this.appService.linkedWorkItems()[id];
  }

  getStatusClass(state: string) {
    const s = state?.toLowerCase().trim() || '';
    
    if (['em desenvolvimento', 'active', 'doing'].includes(s)) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    if (['revisao', 'review'].includes(s)) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    if (['novo', 'new'].includes(s)) {
      return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
    return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
  }

  getStatColorClass(state: string) {
    const s = state?.toLowerCase().trim() || '';
    
    if (['em desenvolvimento', 'active', 'doing'].includes(s)) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30';
    }
    if (['revisao', 'review'].includes(s)) {
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30';
    }
    if (['novo', 'new'].includes(s)) {
      return 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
    }
    if (['para fazer', 'to do'].includes(s)) {
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30';
    }
    if (['fechado', 'closed', 'done'].includes(s)) {
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30';
    }
    return 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
  }
}