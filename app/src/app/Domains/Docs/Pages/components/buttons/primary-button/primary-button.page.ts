import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from 'src/app/Shared/Components/buttons/primary-button.component';

@Component({
  selector: 'page-primary-button',
  standalone: true,
  imports:[CommonModule, PrimaryButtonComponent],
  templateUrl: './primary-button.page.html',
})
export class PrimaryButtonPage {
  constructor() {}
}
