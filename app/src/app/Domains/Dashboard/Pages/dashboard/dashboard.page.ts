import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  // appService = inject(AppService);

  // usStats = computed(() => {
  //   const items = this.appService.azureWorkItems();
  //   const counts: Record<string, number> = {};

  //   for (const item of items) {
  //     const s = item.state;
  //     counts[s] = (counts[s] || 0) + 1;
  //   }

  //   return Object.entries(counts)
  //     .map(([state, count]) => ({ state, count }))
  //     .sort((a, b) => b.count - a.count);
  // });

  ngOnInit() {
    // Force load if not present
    // if (this.appService.azureWorkItems().length === 0) {
    //   this.appService.fetchAzureUserStories();
    // }
  }

  // stopApp(id: string) {
  //   this.appService.updateAppStatus(id, 'stopped');
  // }

  // openApp(id: string) {
  //   this.appService.selectApp(id);
  // }

  // goToAzure() {
  //   this.appService.setView('azure-devops');
  // }

  // getLinkedAppId(id: number) {
  //   return this.appService.linkedWorkItems()[id];
  // }

  // getStatusClass(state: string) {
  //   const s = state?.toLowerCase().trim() || '';

  //   if (['em desenvolvimento', 'active', 'doing'].includes(s)) {
  //     return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  //   }
  //   if (['revisao', 'review'].includes(s)) {
  //     return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  //   }
  //   if (['novo', 'new'].includes(s)) {
  //     return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
  //   }
  //   return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
  // }

  // getStatColorClass(state: string) {
  //   const s = state?.toLowerCase().trim() || '';

  //   if (['em desenvolvimento', 'active', 'doing'].includes(s)) {
  //     return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30';
  //   }
  //   if (['revisao', 'review'].includes(s)) {
  //     return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30';
  //   }
  //   if (['novo', 'new'].includes(s)) {
  //     return 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
  //   }
  //   if (['para fazer', 'to do'].includes(s)) {
  //     return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30';
  //   }
  //   if (['fechado', 'closed', 'done'].includes(s)) {
  //       return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30';
  //   }
  //   return 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
  // }
}
