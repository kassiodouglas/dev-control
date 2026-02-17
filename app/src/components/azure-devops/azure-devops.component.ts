import { Component, inject, OnInit, signal, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService, AzureWorkItem, AISuggestion } from '../../services/app.service';

@Component({
  selector: 'app-azure-devops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors p-6 overflow-hidden relative">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4">
        <div>
           <h1 class="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
             <i class="fa-brands fa-microsoft text-blue-500"></i> Azure DevOps
           </h1>
           <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
             @if (!appService.integrations().azureToken) {
               <span class="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold mr-2">DEMO MODE</span>
             }
             Active User Stories
           </p>
        </div>
        <div class="flex gap-2 items-center">
           <!-- View Toggle -->
           <div class="flex bg-zinc-200 dark:bg-zinc-800 rounded-lg p-1 gap-1 mr-2">
              <button 
                (click)="viewMode.set('grid')" 
                class="w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all" 
                [class.bg-white]="viewMode() === 'grid'" 
                [class.shadow-sm]="viewMode() === 'grid'" 
                [class.text-zinc-800]="viewMode() === 'grid'" 
                [class.text-zinc-500]="viewMode() !== 'grid'" 
                [class.dark:bg-zinc-700]="viewMode() === 'grid'" 
                [class.dark:text-white]="viewMode() === 'grid'"
                title="Grid View"
              >
                 <i class="fa-solid fa-grip"></i>
              </button>
              <button 
                (click)="viewMode.set('list')" 
                class="w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all" 
                [class.bg-white]="viewMode() === 'list'" 
                [class.shadow-sm]="viewMode() === 'list'" 
                [class.text-zinc-800]="viewMode() === 'list'" 
                [class.text-zinc-500]="viewMode() !== 'list'" 
                [class.dark:bg-zinc-700]="viewMode() === 'list'" 
                [class.dark:text-white]="viewMode() === 'list'"
                title="List View"
              >
                 <i class="fa-solid fa-list"></i>
              </button>
           </div>

           <button (click)="refresh()" class="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg shadow-sm transition-colors flex items-center gap-2">
             <i class="fa-solid fa-sync" [class.fa-spin]="appService.isLoadingAzure()"></i> <span class="hidden sm:inline">Refresh</span>
           </button>
           <button (click)="appService.setView('settings')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors text-sm font-bold">
             <i class="fa-solid fa-gear mr-1"></i> <span class="hidden sm:inline">Config</span>
           </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 shrink-0">
          <!-- Search Input -->
          <div class="relative flex-1">
            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>
            <input 
              [(ngModel)]="searchTerm" 
              type="text" 
              placeholder="Search by ID or Title..." 
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
            >
          </div>
          
          <!-- Status Filter -->
          <div class="relative w-full sm:w-48">
            <i class="fa-solid fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>
            <select 
              [(ngModel)]="statusFilter"
              class="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer shadow-sm transition-colors"
            >
              @for (state of availableStates(); track state) {
                <option [value]="state">{{ state }}</option>
              }
            </select>
            <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs pointer-events-none"></i>
          </div>
        </div>

      <!-- Content -->
      @if (appService.azureError()) {
        <div class="p-4 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/30 flex items-start gap-3">
            <i class="fa-solid fa-circle-exclamation mt-1"></i>
            <div>
              <div class="font-bold">Error Fetching Data</div>
              <div class="text-sm">{{ appService.azureError() }}</div>
            </div>
        </div>
      }

      <div class="flex-1 overflow-y-auto custom-scrollbar">
          @if (filteredWorkItems().length === 0 && !appService.isLoadingAzure() && !appService.azureError()) {
            <div class="text-center py-20 text-zinc-400">
              <i class="fa-solid fa-clipboard-list text-4xl mb-3 opacity-50"></i>
              <p>No User Stories found matching your filters.</p>
            </div>
          }

          @if (viewMode() === 'grid') {
            <!-- GRID VIEW -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
              @for (item of filteredWorkItems(); track item.id) {
                  <div (click)="openModal(item)" class="cursor-pointer bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all group relative">
                    
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-2">
                           <span class="text-xs font-mono font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                             #{{ item.id }}
                           </span>
                           <!-- Linked App Indicator (Moved here to avoid overlap) -->
                           @if (getLinkedAppId(item.id)) {
                               <span class="text-indigo-500" title="Linked to Project">
                                   <i class="fa-solid fa-link"></i>
                               </span>
                           }
                        </div>
                        
                        <span class="px-2.5 py-1 rounded-full text-xs font-bold capitalize"
                          [ngClass]="getStatusClass(item.state, item.type)"
                        >
                          {{ item.state }}
                        </span>
                    </div>
                    
                    <h3 class="font-bold text-zinc-800 dark:text-zinc-200 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {{ item.title }}
                    </h3>

                    <div class="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-auto">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-[10px] text-zinc-500">
                              @if (item.avatarUrl) {
                                <img [src]="item.avatarUrl" class="w-full h-full object-cover">
                              } @else {
                                <i class="fa-solid fa-user"></i>
                              }
                          </div>
                          <span class="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[120px]">{{ item.assignedTo }}</span>
                        </div>
                        <div class="text-xs text-zinc-400">
                          <i class="fa-solid fa-book-open"></i> Story
                        </div>
                    </div>
                  </div>
              }
            </div>
          } @else {
            <!-- LIST VIEW -->
            <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm mb-10">
               <table class="w-full text-left border-collapse">
                  <thead class="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase text-zinc-500 font-bold tracking-wider">
                     <tr>
                        <th class="px-6 py-4 w-20">ID</th>
                        <th class="px-6 py-4">Title</th>
                        <th class="px-6 py-4 w-32 hidden sm:table-cell">Status</th>
                        <th class="px-6 py-4 w-48 hidden md:table-cell">Assigned To</th>
                        <th class="px-6 py-4 w-20 text-center">Link</th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
                     @for (item of filteredWorkItems(); track item.id) {
                        <tr (click)="openModal(item)" class="hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors group">
                           <td class="px-6 py-4 font-mono text-xs text-zinc-500">#{{ item.id }}</td>
                           <td class="px-6 py-4">
                              <div class="font-medium text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{{ item.title }}</div>
                              <div class="sm:hidden mt-1">
                                 <span class="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize inline-block" [ngClass]="getStatusClass(item.state, item.type)">
                                    {{ item.state }}
                                 </span>
                              </div>
                           </td>
                           <td class="px-6 py-4 hidden sm:table-cell">
                              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize whitespace-nowrap" [ngClass]="getStatusClass(item.state, item.type)">
                                 {{ item.state }}
                              </span>
                           </td>
                           <td class="px-6 py-4 hidden md:table-cell">
                              <div class="flex items-center gap-2">
                                 <div class="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-[10px] text-zinc-500 shrink-0">
                                    @if (item.avatarUrl) {
                                      <img [src]="item.avatarUrl" class="w-full h-full object-cover">
                                    } @else {
                                      <i class="fa-solid fa-user"></i>
                                    }
                                 </div>
                                 <span class="text-xs text-zinc-600 dark:text-zinc-400 truncate">{{ item.assignedTo }}</span>
                              </div>
                           </td>
                           <td class="px-6 py-4 text-center">
                              @if (getLinkedAppId(item.id)) {
                                 <span class="text-indigo-500" title="Linked to Project">
                                    <i class="fa-solid fa-link"></i>
                                 </span>
                              }
                           </td>
                        </tr>
                     }
                  </tbody>
               </table>
            </div>
          }
      </div>
    </div>

    <!-- Full Screen Modal -->
    @if (currentWorkItem()) {
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        [class.az-overlay-enter]="!isClosing()"
        [class.az-overlay-exit]="isClosing()"
      >
        <div 
          class="bg-white dark:bg-zinc-900 w-full h-full md:w-[95%] md:h-[95%] md:rounded-xl shadow-2xl flex flex-col overflow-hidden"
          [class.az-box-enter]="!isClosing()"
          [class.az-box-exit]="isClosing()"
        >
           <!-- We use this @for loop to track ID changes and force DOM recreation for navigation animations -->
           @for (activeItem of [currentWorkItem()]; track activeItem?.id) {
             <div 
               class="flex flex-col h-full w-full bg-white dark:bg-zinc-900"
               [ngClass]="getNavigationAnimationClass()"
             >
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 shrink-0">
                    <div class="flex items-center gap-3">
                        @if (workItemStack().length > 1) {
                            <button 
                                (click)="popModal()" 
                                class="text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mr-2 flex items-center gap-2 group px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
                            >
                                <i class="fa-solid fa-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i>
                                <span class="text-sm font-bold">Back to US</span>
                            </button>
                        }

                        <span class="text-sm font-mono font-bold text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">#{{ activeItem?.id }}</span>
                        
                        <!-- AI Actions (Only for User Story) -->
                        @if (activeItem?.type === 'User Story') {
                           <div class="flex items-center gap-1">
                             <button (click)="generateSummary(activeItem!)" class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg shadow text-xs font-bold transition-all hover:shadow-md" title="AI Summary">
                               <i class="fa-solid fa-wand-magic-sparkles"></i>
                             </button>
                             <button (click)="generateSuggestions(activeItem!)" class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-lg shadow text-xs font-bold transition-all hover:shadow-md" title="AI Suggestions">
                               <i class="fa-solid fa-lightbulb"></i>
                             </button>
                           </div>
                        }

                        <!-- Project Linker (New Feature) -->
                        <div class="relative ml-2 flex items-center gap-1">
                            <div class="relative">
                                <select 
                                    [ngModel]="getLinkedAppId(activeItem!.id)" 
                                    (ngModelChange)="linkProject(activeItem!.id, $event)"
                                    class="appearance-none pl-7 pr-8 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors w-40 truncate"
                                >
                                    <option [ngValue]="null">Link Project...</option>
                                    @for (app of appService.apps(); track app.id) {
                                        <option [value]="app.id">{{ app.name }}</option>
                                    }
                                </select>
                                <div class="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs pointer-events-none">
                                    <i class="fa-solid fa-link"></i>
                                </div>
                                <div class="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px] pointer-events-none">
                                    <i class="fa-solid fa-chevron-down"></i>
                                </div>
                            </div>
                            
                            @if (getLinkedAppId(activeItem!.id)) {
                                <button (click)="navigateToApp(getLinkedAppId(activeItem!.id))" class="w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors" title="Open Project Dashboard">
                                    <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                </button>
                            }
                        </div>

                        <!-- Branch Copy Button -->
                        <button 
                          (click)="copyBranchName(activeItem!)" 
                          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 ml-2"
                          [class.text-green-600]="copiedBranchId() === activeItem?.id"
                          [class.dark:text-green-400]="copiedBranchId() === activeItem?.id"
                          [class.text-zinc-500]="copiedBranchId() !== activeItem?.id"
                          title="Copy Branch Name"
                        >
                          @if (copiedBranchId() === activeItem?.id) {
                             <i class="fa-solid fa-check text-sm"></i>
                          } @else {
                             <i class="fa-solid fa-code-branch text-sm"></i>
                          }
                        </button>

                        <!-- Editable Status Badge -->
                        <div class="relative group">
                             <select 
                                [ngModel]="activeItem?.state" 
                                (ngModelChange)="updateStatus(activeItem!, $event)"
                                class="appearance-none pl-3 pr-6 py-1 rounded-full text-xs font-bold capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                                [ngClass]="getStatusClass(activeItem?.state || '', activeItem?.type || '')"
                            >
                                @for (status of getPossibleStatuses(activeItem?.type); track status) {
                                    <option [value]="status" class="bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">{{ status }}</option>
                                }
                            </select>
                             <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-zinc-600 dark:text-zinc-400">
                                <i class="fa-solid fa-chevron-down"></i>
                             </div>
                        </div>

                        <div class="hidden sm:flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-[10px] text-zinc-500">
                                @if (activeItem?.avatarUrl) {
                                <img [src]="activeItem?.avatarUrl" class="w-full h-full object-cover">
                                } @else {
                                <i class="fa-solid fa-user"></i>
                                }
                            </div>
                            <span class="text-sm text-zinc-600 dark:text-zinc-400">{{ activeItem?.assignedTo }}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <!-- Delete Button (Only for Task/Bug) -->
                        @if (activeItem?.type !== 'User Story') {
                           <button (click)="requestDelete(activeItem!)" class="text-zinc-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete Item">
                               <i class="fa-solid fa-trash-can text-lg"></i>
                           </button>
                        }

                        <button (click)="closeModal()" class="text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
                            <i class="fa-solid fa-xmark text-2xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    <!-- Left: Description (Editable) -->
                    <div class="flex-1 p-6 overflow-y-auto custom-scrollbar border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div class="mb-4 flex items-center gap-2">
                            @if (activeItem?.type === 'User Story') {
                            <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold uppercase"><i class="fa-solid fa-book-open mr-1"></i> User Story</span>
                            } @else if (activeItem?.type === 'Task') {
                            <span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-bold uppercase"><i class="fa-solid fa-check-square mr-1"></i> Task</span>
                            } @else if (activeItem?.type === 'Bug') {
                            <span class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-bold uppercase"><i class="fa-solid fa-bug mr-1"></i> Bug</span>
                            } @else {
                            <span class="bg-zinc-100 text-zinc-700 text-xs px-2 py-0.5 rounded font-bold uppercase">{{ activeItem?.type }}</span>
                            }
                        </div>

                        <!-- Editable Title -->
                        @if(isEditingTitle()) {
                            <div class="flex items-center gap-2 mb-6">
                                <input 
                                    [(ngModel)]="tempTitle" 
                                    class="text-2xl font-bold text-zinc-800 dark:text-white bg-transparent border-b-2 border-indigo-500 focus:outline-none w-full"
                                    (keydown.enter)="saveTitle(activeItem!)"
                                    autoFocus
                                >
                                <button (click)="saveTitle(activeItem!)" class="text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 p-2 rounded">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                                <button (click)="isEditingTitle.set(false)" class="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        } @else {
                            <h2 class="text-2xl font-bold text-zinc-800 dark:text-white mb-6 leading-tight group/title flex items-start gap-2">
                                {{ activeItem?.title }}
                                <button (click)="startEditTitle(activeItem!)" class="opacity-0 group-hover/title:opacity-100 text-sm text-zinc-400 hover:text-indigo-500 mt-1 transition-opacity">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                            </h2>
                        }
                        
                        <div class="prose dark:prose-invert max-w-none relative group/desc">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500">Description</h3>
                                @if(!isEditingDesc()) {
                                    <button (click)="startEditDesc(activeItem!)" class="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline opacity-0 group-hover/desc:opacity-100 transition-opacity">
                                        Edit Description
                                    </button>
                                }
                            </div>

                            @if(isEditingDesc()) {
                                <div class="flex flex-col gap-2">
                                    <textarea 
                                        [(ngModel)]="tempDesc" 
                                        class="w-full h-64 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                                        placeholder="Description (HTML supported)..."
                                    ></textarea>
                                    <div class="flex justify-end gap-2">
                                        <button (click)="isEditingDesc.set(false)" class="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">Cancel</button>
                                        <button (click)="saveDesc(activeItem!)" class="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded">Save</button>
                                    </div>
                                </div>
                            } @else {
                                <div [innerHTML]="activeItem?.description" class="text-zinc-700 dark:text-zinc-300"></div>
                            }
                        </div>
                    </div>

                    <!-- Right: Tasks & Bugs -->
                    <div class="w-full md:w-96 bg-zinc-50 dark:bg-zinc-950 flex flex-col border-l border-zinc-200 dark:border-zinc-800">
                        <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-700 dark:text-zinc-300 flex justify-between items-center">
                            <span>Related Items / Children</span>
                            
                            <!-- Add Child Button (Only if US) -->
                            @if (activeItem?.type === 'User Story') {
                                <button (click)="isCreatingChild.set(true)" class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded transition-colors shadow-sm">
                                    <i class="fa-solid fa-plus mr-1"></i> Add Item
                                </button>
                            } @else {
                                <a [href]="activeItem?.url" target="_blank" class="text-xs text-indigo-600 hover:underline">
                                    Open in Azure <i class="fa-solid fa-external-link-alt ml-1"></i>
                                </a>
                            }
                        </div>

                        <!-- Add Item Form -->
                        @if (isCreatingChild()) {
                            <div class="p-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-2">
                                <div class="flex gap-2 mb-2">
                                    <select [(ngModel)]="newChildType" class="text-xs border border-zinc-300 dark:border-zinc-700 rounded p-1.5 bg-zinc-50 dark:bg-zinc-800 dark:text-white focus:outline-none">
                                        <option value="Task">Task</option>
                                        <option value="Bug">Bug</option>
                                    </select>
                                    <input 
                                        [(ngModel)]="newChildTitle" 
                                        placeholder="Title..." 
                                        class="flex-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded p-1.5 bg-zinc-50 dark:bg-zinc-800 dark:text-white focus:outline-none focus:border-indigo-500"
                                        (keydown.enter)="createChild(activeItem!.id)"
                                    >
                                </div>
                                <div class="flex justify-end gap-2">
                                    <button (click)="isCreatingChild.set(false)" class="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">Cancel</button>
                                    <button 
                                        (click)="createChild(activeItem!.id)" 
                                        [disabled]="!newChildTitle"
                                        class="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded disabled:opacity-50"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        }

                        <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            @if (appService.isLoadingChildren()) {
                            <div class="flex items-center justify-center py-10 text-zinc-400">
                                <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
                            </div>
                            } @else if (appService.azureChildrenItems().length === 0) {
                            <div class="text-center py-10 text-zinc-400 italic text-sm">
                                No children linked to this item.
                            </div>
                            } @else {
                            @for (child of appService.azureChildrenItems(); track child.id) {
                                <div (click)="navigateToChild(child.id)" 
                                    class="cursor-pointer p-3 bg-white dark:bg-zinc-900 rounded-lg border shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
                                    [class.border-l-4]="true"
                                    [class.border-l-yellow-400]="child.type === 'Task'"
                                    [class.border-l-red-500]="child.type === 'Bug'"
                                    [class.border-zinc-200]="true"
                                    [class.dark:border-zinc-800]="true"
                                >
                                    <div class="flex justify-between items-start mb-1">
                                    <div class="flex items-center gap-2">
                                        @if (child.type === 'Bug') {
                                            <i class="fa-solid fa-bug text-red-500 text-xs"></i>
                                        } @else {
                                            <i class="fa-solid fa-check-square text-yellow-500 text-xs"></i>
                                        }
                                        <span class="text-xs font-mono text-zinc-500">#{{ child.id }}</span>
                                    </div>
                                    <span class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase"
                                        [ngClass]="getStatusClass(child.state, child.type)"
                                    >
                                        {{ child.state }}
                                    </span>
                                    </div>
                                    <div class="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                    {{ child.title }}
                                    </div>
                                    <div class="flex items-center justify-between mt-2">
                                        <div class="flex items-center gap-2">
                                            <div class="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-[8px] text-zinc-500">
                                                @if (child.avatarUrl) {
                                                    <img [src]="child.avatarUrl" class="w-full h-full object-cover">
                                                } @else {
                                                    <i class="fa-solid fa-user"></i>
                                                }
                                            </div>
                                            <span class="text-xs text-zinc-500">{{ child.assignedTo }}</span>
                                        </div>
                                        @if (child.completedWork) {
                                            <span class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                                                <i class="fa-regular fa-clock"></i> {{ child.completedWork }}h
                                            </span>
                                        }
                                    </div>
                                </div>
                            }
                            }
                        </div>
                    </div>
                </div>
             </div>
           }
        </div>
      </div>
    }

    <!-- AI Summary Modal -->
    @if (activeAIModal() === 'summary') {
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
         <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 max-w-lg w-full border border-purple-200 dark:border-purple-900/50 scale-100 animate-in zoom-in-95 relative overflow-hidden">
            <!-- Decorative BG -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg shadow-lg shadow-purple-500/30">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h3 class="text-xl font-bold text-zinc-800 dark:text-white">AI Summary</h3>
              <button (click)="closeAIModal()" class="ml-auto text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <i class="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            @if (isLoadingAI()) {
               <div class="py-8 flex flex-col items-center text-zinc-500 animate-pulse">
                  <i class="fa-solid fa-circle-notch fa-spin text-3xl mb-3 text-purple-500"></i>
                  <p>Analyzing User Story...</p>
               </div>
            } @else {
               <div class="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
                 {{ aiResultText() }}
               </div>
               <div class="mt-4 flex justify-end">
                 <button (click)="closeAIModal()" class="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 rounded-lg text-sm font-bold transition-colors">
                   Close
                 </button>
               </div>
            }
         </div>
      </div>
    }

    <!-- AI Suggestions Modal -->
    @if (activeAIModal() === 'suggestions') {
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
         <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full border border-orange-200 dark:border-orange-900/50 scale-100 animate-in zoom-in-95 relative overflow-hidden max-h-[80vh] flex flex-col">
            <!-- Decorative BG -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="flex items-center gap-3 mb-4 shrink-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg shadow-lg shadow-orange-500/30">
                <i class="fa-solid fa-lightbulb"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-zinc-800 dark:text-white">AI Task Suggestions</h3>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">Based on the User Story description</p>
              </div>
              <button (click)="closeAIModal()" class="ml-auto text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <i class="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            @if (isLoadingAI()) {
               <div class="flex-1 flex flex-col items-center justify-center py-12 text-zinc-500 animate-pulse">
                  <i class="fa-solid fa-gear fa-spin text-3xl mb-3 text-orange-500"></i>
                  <p>Generating tasks & bugs...</p>
               </div>
            } @else {
               <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                 @for (sug of aiSuggestions(); track sug.title) {
                   <div class="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                     <div class="mt-0.5">
                       @if(sug.type === 'Bug') {
                         <i class="fa-solid fa-bug text-red-500"></i>
                       } @else {
                         <i class="fa-solid fa-check-square text-yellow-500"></i>
                       }
                     </div>
                     <div class="flex-1">
                        <div class="text-sm font-bold text-zinc-800 dark:text-white">{{ sug.title }}</div>
                        <div class="text-xs text-zinc-500 uppercase font-bold mt-0.5">{{ sug.type }}</div>
                     </div>
                     <button (click)="acceptSuggestion(sug)" class="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded hover:opacity-80 transition-opacity opacity-0 group-hover:opacity-100">
                       <i class="fa-solid fa-plus mr-1"></i> Create
                     </button>
                   </div>
                 }
                 @if (aiSuggestions().length === 0) {
                   <div class="text-center py-8 text-zinc-400">
                     <i class="fa-solid fa-check-circle text-2xl mb-2 text-green-500"></i>
                     <p>All suggestions created!</p>
                   </div>
                 }
               </div>
               
               <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end shrink-0">
                 <button (click)="closeAIModal()" class="px-4 py-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-sm font-medium">
                   Done
                 </button>
               </div>
            }
         </div>
      </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (itemToDelete()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
        <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 scale-100 animate-in zoom-in-95">
          <h3 class="text-lg font-bold text-zinc-800 dark:text-white mb-2">Confirm Deletion</h3>
          <p class="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
            Are you sure you want to delete <span class="font-bold">{{ itemToDelete()?.type }} #{{ itemToDelete()?.id }}</span>? 
            This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button 
              (click)="cancelDelete()" 
              class="px-4 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
              [disabled]="isDeleting()"
            >
              Cancel
            </button>
            <button 
              (click)="performDelete()" 
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              [disabled]="isDeleting()"
            >
              @if (isDeleting()) {
                <i class="fa-solid fa-circle-notch fa-spin"></i>
              } @else {
                <i class="fa-solid fa-trash-can"></i>
              }
              Delete
            </button>
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

    /* Modal Overlay Animations */
    .az-overlay-enter { animation: azureFadeIn 0.25s ease-out forwards; }
    .az-overlay-exit { animation: azureFadeOut 0.2s ease-in forwards; }

    /* Modal Box Animations */
    .az-box-enter { animation: azureZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .az-box-exit { animation: azureZoomOut 0.2s ease-in forwards; }

    @keyframes azureFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes azureFadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes azureZoomIn { from { transform: scale(0.96) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
    @keyframes azureZoomOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.96) translateY(10px); opacity: 0; } }

    /* Navigation Slide Animations */
    .az-slide-enter-right { animation: azureSlideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .az-slide-enter-left { animation: azureSlideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @keyframes azureSlideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes azureSlideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class AzureDevopsComponent implements OnInit {
  appService = inject(AppService);
  
  viewMode = signal<'grid' | 'list'>('grid');

  // Navigation Stack for Modal
  workItemStack = signal<AzureWorkItem[]>([]);
  isClosing = signal(false);
  navDirection = signal<'forward' | 'backward' | 'none'>('none');
  
  // Branch Copy Feedback
  copiedBranchId = signal<number | null>(null);

  // Child Creation State
  isCreatingChild = signal(false);
  newChildType: 'Task' | 'Bug' = 'Task';
  newChildTitle = '';

  // Edit State
  isEditingTitle = signal(false);
  isEditingDesc = signal(false);
  tempTitle = '';
  tempDesc = '';

  // Deletion State
  itemToDelete = signal<AzureWorkItem | null>(null);
  isDeleting = signal(false);

  // AI State
  activeAIModal = signal<'none' | 'summary' | 'suggestions'>('none');
  isLoadingAI = signal(false);
  aiResultText = signal('');
  aiSuggestions = signal<AISuggestion[]>([]);

  currentWorkItem = computed(() => {
    const stack = this.workItemStack();
    return stack.length > 0 ? stack[stack.length - 1] : null;
  });

  // Filters
  searchTerm = signal('');
  statusFilter = signal('All');

  // Computed Filters
  availableStates = computed(() => {
    const items = this.appService.azureWorkItems();
    const states = new Set(items.map(i => i.state));
    return ['All', ...Array.from(states).sort()];
  });

  filteredWorkItems = computed(() => {
    const items = this.appService.azureWorkItems();
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();

    return items.filter(item => {
      const matchesSearch = !term || 
        item.title.toLowerCase().includes(term) || 
        item.id.toString().includes(term);
      
      const matchesStatus = status === 'All' || item.state === status;

      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit() {
    // Attempt to load items on init (will load Mock if no token)
    if (this.appService.azureWorkItems().length === 0) {
      this.refresh();
    }
  }

  refresh() {
    this.appService.fetchAzureUserStories();
  }

  openModal(item: AzureWorkItem) {
    this.isClosing.set(false);
    this.resetEditState();
    this.navDirection.set('none');
    this.workItemStack.set([item]);
    this.appService.fetchWorkItemChildren(item.id);
  }

  closeModal() {
    // Clear AI Cache for this item when closing, per instructions ("until US closes")
    const item = this.currentWorkItem();
    if (item) {
      this.appService.clearAICache(item.id);
    }

    this.isClosing.set(true);
    // Wait for animation duration before removing from DOM
    setTimeout(() => {
        this.workItemStack.set([]);
        this.appService.azureChildrenItems.set([]); 
        this.isClosing.set(false);
        this.resetEditState();
    }, 200);
  }

  // Go back up the stack
  popModal() {
    this.navDirection.set('backward');
    this.resetEditState();
    this.workItemStack.update(stack => {
       const newStack = stack.slice(0, -1);
       if (newStack.length > 0) {
          const topItem = newStack[newStack.length - 1];
          // After popping, fetch children for the NEW top item (the parent US)
          this.appService.fetchWorkItemChildren(topItem.id);
       }
       return newStack;
    });
  }

  // Drill down into child
  async navigateToChild(id: number) {
     this.navDirection.set('forward');
     this.resetEditState();
     this.appService.isLoadingChildren.set(true);
     const fullItem = await this.appService.fetchWorkItemDetails(id);
     if (fullItem) {
        this.workItemStack.update(stack => [...stack, fullItem]);
        this.appService.fetchWorkItemChildren(fullItem.id);
     }
  }

  resetEditState() {
      this.isEditingTitle.set(false);
      this.isEditingDesc.set(false);
      this.tempTitle = '';
      this.tempDesc = '';
  }

  // --- EDITING ---

  startEditTitle(item: AzureWorkItem) {
      this.tempTitle = item.title;
      this.isEditingTitle.set(true);
  }

  saveTitle(item: AzureWorkItem) {
      if (!this.tempTitle.trim()) return;
      this.appService.updateWorkItemDetails(item.id, this.tempTitle, item.description).then(success => {
          if (success) {
              // Update local stack item immediately for UI response
              this.workItemStack.update(stack => stack.map(i => i.id === item.id ? { ...i, title: this.tempTitle } : i));
              this.isEditingTitle.set(false);
          }
      });
  }

  startEditDesc(item: AzureWorkItem) {
      this.tempDesc = item.description;
      this.isEditingDesc.set(true);
  }

  saveDesc(item: AzureWorkItem) {
      this.appService.updateWorkItemDetails(item.id, item.title, this.tempDesc).then(success => {
          if (success) {
             // Update local stack item immediately for UI response
             this.workItemStack.update(stack => stack.map(i => i.id === item.id ? { ...i, description: this.tempDesc } : i));
             this.isEditingDesc.set(false);
          }
      });
  }


  copyBranchName(item: AzureWorkItem) {
    const id = item.id;
    let title = item.title.toLowerCase();

    // Remove accents
    title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Replace spaces and special chars with hyphens
    title = title.replace(/[^a-z0-9]+/g, "-");
    
    // Remove leading/trailing hyphens
    title = title.replace(/^-+|-+$/g, "");

    const branchName = `feature/${id}-${title}`;
    
    navigator.clipboard.writeText(branchName).then(() => {
      this.copiedBranchId.set(id);
      setTimeout(() => this.copiedBranchId.set(null), 2000);
    }).catch(err => console.error('Failed to copy', err));
  }

  // Status Management
  getPossibleStatuses(type: string | undefined): string[] {
    if (!type) return [];
    if (type === 'User Story') return ['Novo', 'Para Fazer', 'Em Desenvolvimento', 'Revisao', 'Validar PR', 'Fechado', 'Removido'];
    if (type === 'Bug') return ['Novo', 'Em Desenvolvimento', 'Revisao', 'Fechado', 'Removido'];
    return ['Novo', 'Em Desenvolvimento', 'Fechado', 'Removido'];
  }

  updateStatus(item: AzureWorkItem, newStatus: string) {
      if (item.state === newStatus) return;
      this.appService.updateWorkItemStatus(item.id, newStatus);
      
      // Update local stack reference to reflect change immediately in UI (Header)
      this.workItemStack.update(stack => stack.map(i => i.id === item.id ? { ...i, state: newStatus } : i));
  }

  // Child Management
  createChild(parentId: number) {
      if (!this.newChildTitle) return;

      this.appService.createChildWorkItem(parentId, this.newChildTitle, this.newChildType).then(success => {
          if (success) {
              this.newChildTitle = '';
              this.isCreatingChild.set(false);
          }
      });
  }

  // Deletion Flow
  requestDelete(item: AzureWorkItem) {
      this.itemToDelete.set(item);
  }

  cancelDelete() {
      this.itemToDelete.set(null);
  }

  performDelete() {
      const item = this.itemToDelete();
      if (!item) return;

      this.isDeleting.set(true);
      this.appService.deleteWorkItem(item.id).then(success => {
          this.isDeleting.set(false);
          this.itemToDelete.set(null);
          
          if (success) {
              // If we deleted the item we are currently looking at (deep inside stack), go back
              if (this.currentWorkItem()?.id === item.id) {
                  this.popModal();
              }
              // If we are looking at a parent, the children list is automatically updated via appService signals
          }
      });
  }

  // --- PROJECT LINKING ---
  
  getLinkedAppId(workItemId: number) {
      return this.appService.linkedWorkItems()[workItemId] || null;
  }

  linkProject(workItemId: number, appId: any) {
      // appId comes as event from select, can be string or null
      this.appService.linkWorkItemToApp(workItemId, appId);
  }

  navigateToApp(appId: string) {
      if (!appId) return;
      this.appService.selectApp(appId);
      // No need to close modal explicitly as ViewMode change handles UI switch
  }


  // --- AI FEATURES ---

  closeAIModal() {
    this.activeAIModal.set('none');
  }

  async generateSummary(item: AzureWorkItem) {
    this.activeAIModal.set('summary');
    this.isLoadingAI.set(true);
    this.aiResultText.set('');

    try {
      const summary = await this.appService.generateSummary(item);
      this.aiResultText.set(summary);
    } catch (e) {
      this.aiResultText.set('Error generating summary. Please check your API Key in Settings.');
    } finally {
      this.isLoadingAI.set(false);
    }
  }

  async generateSuggestions(item: AzureWorkItem) {
    this.activeAIModal.set('suggestions');
    this.isLoadingAI.set(true);
    this.aiSuggestions.set([]);

    try {
      const suggestions = await this.appService.generateSuggestions(item);
      this.aiSuggestions.set(suggestions);
    } catch (e) {
      // Just show empty if error for now, or could handle error state in UI
      console.error(e);
    } finally {
      this.isLoadingAI.set(false);
    }
  }

  async acceptSuggestion(suggestion: AISuggestion) {
    const parent = this.currentWorkItem();
    if (!parent) return;

    // Optimistically remove from list to show progress
    this.aiSuggestions.update(list => list.filter(s => s !== suggestion));

    await this.appService.createChildWorkItem(parent.id, suggestion.title, suggestion.type);
    
    // Update Cache to reflect this item is handled (optional, but good practice if we were tracking 'handled' state in cache)
    // For now, we just removed it from the temp UI list.
  }

  // Helper to determine animation class based on direction
  getNavigationAnimationClass() {
    const dir = this.navDirection();
    if (dir === 'forward') return 'az-slide-enter-right';
    if (dir === 'backward') return 'az-slide-enter-left';
    return '';
  }

  getStatusClass(state: string, type: string) {
    const s = state?.toLowerCase().trim() || '';
    const t = type?.toLowerCase().trim() || '';

    // "Nas tasks... novo -> branco"
    if ((t === 'task' || t === 'bug') && (s === 'novo' || s === 'new')) {
      return 'bg-white text-zinc-600 border border-zinc-200';
    }

    // "Em desenvolvimento -> amarelo"
    if (['em desenvolvimento', 'active', 'committed', 'doing', 'processing'].includes(s)) {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }

    // "Revisao -> vermelho"
    if (['revisao', 'review', 'code review', 'under review'].includes(s)) {
      return 'bg-red-100 text-red-800 border border-red-200';
    }

    // "Validar PR -> roxo"
    if (['validar pr', 'pull request', 'pr'].includes(s)) {
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    }

    // "Para fazer -> verde" AND "Fechado -> verde"
    if (['para fazer', 'to do', 'fechado', 'closed', 'done', 'resolved', 'completed', 'resolved'].includes(s)) {
      return 'bg-green-100 text-green-800 border border-green-200';
    }

    // Default
    return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
  }
}