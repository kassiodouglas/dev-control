import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseField } from '../base-field.directive';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'comp-slide-toggle-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    ErrorMessageComponent
  ],
  templateUrl: './slide-toggle-field.component.html',
  styleUrls: ['./slide-toggle-field.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class SlideToggleFieldComponent extends BaseField {
}
