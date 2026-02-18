import { Directive, Input, OnInit, inject } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';

@Directive()
export abstract class BaseField implements OnInit {
  @Input() label = '';
  @Input() controlName = '';
  @Input() disabled = false;
  @Input() placeholder = '';

  control!: FormControl;

  protected parentContainer = inject(ControlContainer, { optional: true });

  ngOnInit() {
    if (this.parentContainer && this.controlName) {
      this.control = this.parentContainer.control?.get(this.controlName) as FormControl;
      if (!this.control) {
        console.warn(`Form control '${this.controlName}' not found in parent form container.`);
      }
    }
  }
}
