import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from 'src/app/Shared/Components/sidebar/sidebar.component'; // Corrected path
import { routerAnimations } from '../../Core/Animations/router.animations'; // Import animations
import { PageHeaderComponent } from 'src/app/Shared/Components/page-header/page-header.component'; // Import PageHeaderComponent

@Component({
  selector: 'layout-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, PageHeaderComponent], // Add PageHeaderComponent
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar></app-sidebar>
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950 z-0">
        <comp-page-header></comp-page-header>
        <div>
          <router-outlet #o="outlet"></router-outlet>
        </div>
      </main>
    </div>
  `,
  animations: [routerAnimations] // Add animations property
})
export class MainLayoutLayout {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
