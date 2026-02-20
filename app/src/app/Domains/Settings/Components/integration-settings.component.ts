import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../Core/Services/app.service';

@Component({
  selector: 'comp-integration-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
  `,
})
export class IntegrationSettingsComponent {
  appService = inject(AppService);

  // Integrations State
  geminiApiKey = '';
  azureToken = '';
  azureOrg = '';
  azureProject = '';
  showIntegrationSuccess = signal(false);

  constructor() {
    effect(() => {
      const integrations = this.appService.integrations();
      this.geminiApiKey = integrations.geminiApiKey;
      this.azureToken = integrations.azureToken;
      this.azureOrg = integrations.azureOrg;
      this.azureProject = integrations.azureProject;
    });
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
}
