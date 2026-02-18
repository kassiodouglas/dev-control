import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { ValidationMessageService } from '@src/app/Shared/Services/validation-message.service';

@Component({
  selector: 'comp-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  @Input() control: AbstractControl | null = null;
  @Input() label: string = '';

  private validationService = inject(ValidationMessageService);

  get errors(): string[] {
    if (!this.control || !this.control.errors) return [];
    return Object.keys(this.control.errors).map(key =>
      this.validationService.getErrorMessage(key, this.control!.errors![key])
    );
  }
}
