import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Core/Services/theme.service';
import { PrimaryButtonComponent } from '../../../../Shared/Components/buttons/primary-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'page-services',
  imports: [CommonModule, PrimaryButtonComponent, RouterModule],
  templateUrl: './services.page.html',
})
export class ServicesPage {
  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
