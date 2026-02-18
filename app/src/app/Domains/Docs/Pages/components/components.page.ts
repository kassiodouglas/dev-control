import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../../../Shared/Components/buttons/primary-button.component';
import { InputFieldComponent } from '../../../../Shared/Components/form/input-field/input-field.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '@src/app/Shared/Components/modal/modal.component';
import { ModalService } from '@src/app/Shared/Components/modal/Services/modal.service';
import { CardComponent } from '@src/app/Shared/Components/card/card.component';
import { PanelComponent } from '../../../../Shared/Components/panel/panel.component';
import { PanelService } from '../../../../Shared/Services/panel.service';

@Component({
  selector: 'page-components',
  standalone: true,
  imports: [
    CommonModule,
    PrimaryButtonComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    RouterModule,
    ModalComponent,
    CardComponent,
    PanelComponent,
  ],
  templateUrl: './components.page.html',
})
export class ComponentsPage {
  private modalService = inject(ModalService);
  private panelService = inject(PanelService);
  private fb = inject(FormBuilder);

  myForm = this.fb.group({
    email: ['you@example.com', Validators.email],
    password: ['••••••••', Validators.required],
    disabled: [{ value: "Can't touch this", disabled: true }],
  });

  openModal(id: string) {
    this.modalService.open(id);
  }

  openPanel(id: string) {
    this.panelService.open(id);
  }
}
