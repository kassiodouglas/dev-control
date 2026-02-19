import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Added Location
import { AppService } from '@core/Services/app.service'; // Using path alias
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Added Router

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  appService = inject(AppService);
  router = inject(Router); // Injected Router
  isModalOpen = signal(false);

  // Form Models
  newAppName = '';
  newAppPath = '';
  newAppHost = 'localhost';
  newAppPort: number | null = 3000;
  newAppStartCmd = 'npm start';

  selectApp(id: string) {
    this.appService.selectApp(id);
  }

  goToDashboard() {
    this.appService.setView('dashboard');
    this.router.navigate(['/dashboard']); // Added navigation
  }

  goToAzure() {
    this.appService.setView('azure-boards'); // Updated to match route path and ViewMode
    this.router.navigate(['/azure-boards']); // Added navigation
  }

  goToNotes() {
    console.log('goto notes')
    this.appService.setView('notes');
    this.router.navigate(['/notes']); // Added navigation
  }

  goToSettings() {
    this.appService.setView('settings');
    this.router.navigate(['/settings']); // Added navigation
  }

  // Added goToHome and goToDocs to match sidebar links if they exist
  goToHome() {
    this.appService.setView('home');
    this.router.navigate(['/home']);
  }

  goToDocs() {
    this.appService.setView('docs');
    this.router.navigate(['/docs']);
  }

  createApp() {
    if (this.newAppName && this.newAppPath) {
      this.appService.addApp({
        name: this.newAppName,
        path: this.newAppPath,
        host: this.newAppHost || 'localhost',
        port: this.newAppPort || 3000,
        startCommand: 'npm start'
      });

      this.isModalOpen.set(false);
      this.resetForm();
    }
  }

  resetForm() {
    this.newAppName = '';
    this.newAppPath = '';
    this.newAppHost = 'localhost';
    this.newAppPort = 3000;
    this.newAppStartCmd = 'npm start';
  }
}
