import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from '../../../../Shared/Components/panel/panel.component';
import { PanelService } from '../../../../Shared/Services/panel.service';

@Component({
  selector: 'page-panel',
  standalone: true,
  imports: [CommonModule, PanelComponent],
  templateUrl: './panel.page.html',
})
export class PanelPage {
  private panelService = inject(PanelService);

  openPanel() {
    this.panelService.open('meu-painel');
  }
}
