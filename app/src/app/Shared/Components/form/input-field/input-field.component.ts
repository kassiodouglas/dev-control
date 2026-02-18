import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BaseField } from '../base-field.directive';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'comp-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ErrorMessageComponent
  ],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class InputFieldComponent extends BaseField {
  @Input() type = 'text';
  @Input() icon = '';

  hidePassword = true;

  get isPassword(): boolean {
    return this.type === 'password';
  }

  get currentType(): string {
    if (!this.isPassword) return this.type;
    return this.hidePassword ? 'password' : 'text';
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
}
