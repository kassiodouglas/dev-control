import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../Core/Services/theme.service';

@Component({
  selector: 'comp-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6" [ngClass]="customClass" [class.dark]="themeService.theme() === 'dark'">
      <div *ngIf="header" class="mb-4">
        <ng-content select="[header]"></ng-content>
      </div>
      <div>
        <ng-content select="[body]"></ng-content>
      </div>
      <div *ngIf="footer" class="mt-4">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host .dark {
      background-color: #1f2937;
      color: #d1d5db;
    }
  `]
})
export class CardComponent {
  @Input() header = true;
  @Input() footer = true;
  @Input() customClass = '';

  themeService = inject(ThemeService);
}
