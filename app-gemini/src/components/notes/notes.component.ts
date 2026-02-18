import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService, GlobalNote } from '../../services/app.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex bg-zinc-100 dark:bg-zinc-950 transition-colors">
      <!-- Notes Sidebar -->
      <div class="w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full transition-colors">
        <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 class="font-bold text-zinc-700 dark:text-zinc-200">My Notes</h2>
          <button (click)="createNote()" class="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-1.5 rounded-md transition-colors">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          @for (note of appService.globalNotes(); track note.id) {
            <div 
              (click)="selectNote(note.id)"
              class="p-3 rounded-lg cursor-pointer transition-all border group"
              [class.bg-indigo-50]="selectedNoteId() === note.id"
              [class.dark:bg-indigo-900]="selectedNoteId() === note.id"
              [class.bg-opacity-30]="selectedNoteId() === note.id"
              [class.border-indigo-200]="selectedNoteId() === note.id"
              [class.dark:border-indigo-800]="selectedNoteId() === note.id"
              [class.border-transparent]="selectedNoteId() !== note.id"
              [class.hover:bg-zinc-50]="selectedNoteId() !== note.id"
              [class.dark:hover:bg-zinc-800]="selectedNoteId() !== note.id"
            >
              <div class="font-semibold text-sm text-zinc-800 dark:text-zinc-200 truncate">{{ note.title || 'Untitled' }}</div>
              <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex justify-between items-center">
                <span>{{ note.updatedAt | date:'MMM d, HH:mm' }}</span>
                <button (click)="deleteNote($event, note.id)" class="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-colors p-1">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Editor Area -->
      <div class="flex-1 flex flex-col bg-white dark:bg-zinc-900 h-full overflow-hidden transition-colors">
        @if (activeNote(); as note) {
          <div class="p-6 h-full flex flex-col max-w-4xl mx-auto w-full">
            <input 
              [ngModel]="note.title"
              (ngModelChange)="updateTitle(note.id, $event)"
              placeholder="Note Title" 
              class="text-3xl font-bold text-zinc-800 dark:text-white bg-white dark:bg-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-600 border-none focus:ring-0 w-full mb-4 px-0 transition-colors"
            >
            
            <!-- Editor/Preview Toggle Container -->
            <div class="flex-1 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm flex flex-col bg-white dark:bg-zinc-900 transition-colors relative">
              
              <!-- Toolbar -->
              <div class="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2 flex justify-between items-center transition-colors">
                <span class="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wider">
                  {{ isPreview() ? 'PREVIEW MODE' : 'MARKDOWN EDITOR' }}
                </span>
                
                <button 
                  (click)="togglePreview()" 
                  class="text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex items-center gap-2"
                  [class.bg-indigo-100]="isPreview()"
                  [class.text-indigo-700]="isPreview()"
                  [class.dark:bg-indigo-900]="isPreview()"
                  [class.dark:text-indigo-300]="isPreview()"
                  [class.bg-white]="!isPreview()"
                  [class.text-zinc-600]="!isPreview()"
                  [class.dark:bg-zinc-700]="!isPreview()"
                  [class.dark:text-zinc-300]="!isPreview()"
                  [class.border]="!isPreview()"
                  [class.border-zinc-300]="!isPreview()"
                  [class.dark:border-zinc-600]="!isPreview()"
                >
                  @if (isPreview()) {
                    <i class="fa-solid fa-pen"></i> Edit
                  } @else {
                    <i class="fa-solid fa-eye"></i> Preview
                  }
                </button>
              </div>

              <!-- Content Area -->
              <div class="flex-1 relative overflow-hidden">
                @if (isPreview()) {
                  <div 
                    class="absolute inset-0 p-6 overflow-y-auto prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed"
                    [innerHTML]="parsedContent()"
                  ></div>
                } @else {
                  <textarea 
                    [ngModel]="note.content"
                    (ngModelChange)="updateContent(note.id, $event)"
                    class="w-full h-full p-6 resize-none focus:outline-none text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 leading-relaxed font-mono text-sm transition-colors"
                    placeholder="Start typing your note here... Markdown is supported (# for titles, **bold**, - lists)"
                  ></textarea>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="flex-1 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-600">
            <i class="fa-regular fa-note-sticky text-6xl mb-4"></i>
            <p class="text-lg">Select a note or create a new one.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class NotesComponent {
  appService = inject(AppService);
  selectedNoteId = signal<string | null>(null);
  isPreview = signal<boolean>(true); // Default to Preview mode

  activeNote = computed(() => 
    this.appService.globalNotes().find(n => n.id === this.selectedNoteId()) || null
  );

  parsedContent = computed(() => {
    const content = this.activeNote()?.content || '';
    return this.parseMarkdown(content);
  });

  selectNote(id: string) {
    this.selectedNoteId.set(id);
    this.isPreview.set(true); // Always switch to preview when selecting a note
  }

  createNote() {
    const id = this.appService.createGlobalNote();
    this.selectedNoteId.set(id);
    this.isPreview.set(false); // Switch to edit for new notes
  }

  updateTitle(id: string, title: string) {
    this.appService.updateGlobalNote(id, { title });
  }

  updateContent(id: string, content: string) {
    this.appService.updateGlobalNote(id, { content });
  }

  deleteNote(event: Event, id: string) {
    event.stopPropagation();
    if(confirm('Are you sure you want to delete this note?')) {
      this.appService.deleteGlobalNote(id);
      if (this.selectedNoteId() === id) {
        this.selectedNoteId.set(null);
      }
    }
  }

  togglePreview() {
    this.isPreview.update(v => !v);
  }

  // Simple Markdown Parser (No external libraries)
  private parseMarkdown(markdown: string): string {
    if (!markdown) return '<span class="text-zinc-400 italic">No content</span>';

    let html = markdown
      // Escape HTML characters to prevent injection (basic)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      
      // Headers
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-2 border-b border-zinc-200 dark:border-zinc-700 pb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-4">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 mt-3">$1</h3>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-indigo-600 dark:text-indigo-400">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/__(.*?)__/gim, '<u>$1</u>')
      
      // Lists (Unordered)
      .replace(/^\s*-\s+(.*$)/gim, '<div class="flex gap-2 mb-1"><span class="text-zinc-400">•</span> <span>$1</span></div>')
      
      // Code blocks (inline)
      .replace(/`(.*?)`/gim, '<code class="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-sm text-pink-600 dark:text-pink-400">$1</code>')
      
      // Line breaks
      .replace(/\n/gim, '<br>');

    return html;
  }
}