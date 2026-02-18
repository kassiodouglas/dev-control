import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from '../../../../../Shared/Components/panel/panel.component';
import { PanelService } from '../../../../../Shared/Services/panel.service';

@Component({
  selector: 'app-panel-page',
  standalone: true,
  imports: [CommonModule, PanelComponent],
  templateUrl: './panel.page.html',
})
export class PanelPage {
  private panelService = inject(PanelService);

  openPanel(id: string) {
    this.panelService.open(id);
  }
}
