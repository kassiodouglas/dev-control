import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@src/app/Shared/Components/sidebar/sidebar.component';

@Component({
  selector: 'layout-main-layout',
  standalone: true, // Layouts are usually standalone too
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar></app-sidebar>
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutLayout {
}
