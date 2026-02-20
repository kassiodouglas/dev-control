import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../Core/Services/app.service';

@Component({
  selector: 'comp-data-management-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
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
  `,
})
export class DataManagementSettingsComponent {
  appService = inject(AppService);

  // Data State
  importStatus = signal<string | null>(null);

  // Backup Methods
  downloadBackup() {
    const json = this.appService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-control-backup-${new Date().toISOString().slice(0,10)}.json`;
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
