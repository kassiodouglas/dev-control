import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { BaseField } from '../base-field.directive';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'comp-radio-group-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    ErrorMessageComponent
  ],
  templateUrl: './radio-group-field.component.html',
  styleUrls: ['./radio-group-field.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class RadioGroupFieldComponent extends BaseField {
  @Input() options: any[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';
  @Input() layout: 'row' | 'column' = 'column';
}
