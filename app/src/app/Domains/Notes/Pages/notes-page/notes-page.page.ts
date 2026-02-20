import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService, GlobalNote } from '@core/Services/app.service'; // Using alias

@Component({
  selector: 'page-notes-page',
  standalone: true, // Mark as standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-page.page.html',
})
export class NotesPagePage {
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
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")

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
