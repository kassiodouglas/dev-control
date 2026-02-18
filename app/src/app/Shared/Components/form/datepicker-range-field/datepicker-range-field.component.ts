import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BaseField } from '../base-field.directive';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'comp-datepicker-range-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ErrorMessageComponent
  ],
  templateUrl: './datepicker-range-field.component.html',
  styleUrls: ['./datepicker-range-field.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class DatepickerRangeFieldComponent extends BaseField {
  get rangeGroup(): FormGroup {
    return this.control as unknown as FormGroup;
  }
}
