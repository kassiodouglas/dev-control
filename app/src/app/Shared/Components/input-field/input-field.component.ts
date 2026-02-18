import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'comp-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
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
export class InputFieldComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() icon = '';
  @Input() controlName = '';
  @Input() disabled = false;

  private parentContainer = inject(ControlContainer);

  control!: FormControl;
  hidePassword = true;

  get isPassword(): boolean {
    return this.type === 'password';
  }

  get currentType(): string {
    if (!this.isPassword) return this.type;
    return this.hidePassword ? 'password' : 'text';
  }

  ngOnInit() {
    if (this.parentContainer && this.controlName) {
      this.control = this.parentContainer.control?.get(this.controlName) as FormControl;
      if (!this.control) {
        console.warn(`Form control '${this.controlName}' not found in parent form container.`);
      }
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
}
