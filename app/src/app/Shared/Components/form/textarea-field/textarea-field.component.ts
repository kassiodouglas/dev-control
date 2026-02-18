import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseField } from '../base-field.directive';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'comp-textarea-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ErrorMessageComponent
  ],
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class TextareaFieldComponent extends BaseField {
  @Input() rows = 3;
}
