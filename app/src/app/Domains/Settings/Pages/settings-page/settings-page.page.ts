import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingsComponent } from '../../Components/profile-settings.component';
import { SecuritySettingsComponent } from '../../Components/security-settings.component';
import { IntegrationSettingsComponent } from '../../Components/integration-settings.component';
import { DataManagementSettingsComponent } from '../../Components/data-management-settings.component';

@Component({
  selector: 'page-settings-page',
  standalone: true,
  imports:[CommonModule, ProfileSettingsComponent, SecuritySettingsComponent, IntegrationSettingsComponent, DataManagementSettingsComponent],
  templateUrl: './settings-page.page.html',
})
export class SettingsPagePage {
  constructor() {}
}
