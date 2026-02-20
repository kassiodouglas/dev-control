import { Component, inject, OnInit, signal, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService, AzureWorkItem, AISuggestion } from '@core/Services/app.service';

@Component({
  selector: 'page-azure-boards-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './azure-boards-page.page.html',
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
export class AzureBoardsPagePage implements OnInit {
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
