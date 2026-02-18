import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../../../../Shared/Components/page-header/page-header.component';
import { InputFieldComponent } from '../../../../../../Shared/Components/form/input-field/input-field.component';
import { TextareaFieldComponent } from '../../../../../../Shared/Components/form/textarea-field/textarea-field.component';
import { SelectFieldComponent } from '../../../../../../Shared/Components/form/select-field/select-field.component';
import { CheckboxFieldComponent } from '../../../../../../Shared/Components/form/checkbox-field/checkbox-field.component';
import { RadioGroupFieldComponent } from '../../../../../../Shared/Components/form/radio-group-field/radio-group-field.component';
import { SlideToggleFieldComponent } from '../../../../../../Shared/Components/form/slide-toggle-field/slide-toggle-field.component';
import { DatepickerFieldComponent } from '../../../../../../Shared/Components/form/datepicker-field/datepicker-field.component';
import { DatepickerRangeFieldComponent } from '../../../../../../Shared/Components/form/datepicker-range-field/datepicker-range-field.component';
import { DatetimeFieldComponent } from '../../../../../../Shared/Components/form/datetime-field/datetime-field.component';
import { PrimaryButtonComponent } from '../../../../../../Shared/Components/buttons/primary-button.component';

@Component({
  selector: 'page-all-fields',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    InputFieldComponent,
    TextareaFieldComponent,
    SelectFieldComponent,
    CheckboxFieldComponent,
    RadioGroupFieldComponent,
    SlideToggleFieldComponent,
    DatepickerFieldComponent,
    DatepickerRangeFieldComponent,
    DatetimeFieldComponent,
    PrimaryButtonComponent
  ],
  templateUrl: './all-fields.page.html',
})
export class AllFieldsPage {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    tags: [[], [Validators.required]],
    agree: [false, [Validators.requiredTrue]],
    gender: ['', [Validators.required]],
    notifications: [true],
    birthDate: ['', [Validators.required]],
    dateRange: this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    }),
    appointment: ['', Validators.required]
  });

  categories = [
    { label: 'Category A', value: 'a' },
    { label: 'Category B', value: 'b' },
    { label: 'Category C', value: 'c' },
  ];

  tags = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Vue' },
  ];

  genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      alert('Form Submitted! Check console.');
    } else {
      this.form.markAllAsTouched();
    }
  }
}
