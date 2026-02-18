import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { InputFieldComponent } from '../../../../Shared/Components/form/input-field/input-field.component';
import { PrimaryButtonComponent } from '../../../../Shared/Components/buttons/primary-button.component';
import { RouterModule } from '@angular/router';
import { iLoginCredentials } from '../../Interfaces/login-credentials.interface';

@Component({
  selector: 'form-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    InputFieldComponent,
    PrimaryButtonComponent,
    RouterModule
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() formSubmit = new EventEmitter<iLoginCredentials>();

  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
    password: ['', { validators: [Validators.required, Validators.minLength(5)], updateOn: 'blur' }]
  });

  constructor() { }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.formSubmit.emit(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
