import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseField } from '../base-field.directive';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'comp-select-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ErrorMessageComponent
  ],
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class SelectFieldComponent extends BaseField {
  @Input() options: any[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';
  @Input() multiple = false;
}
