import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcumb/breadcrumb.component';

@Component({
  selector: 'comp-page-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md mb-4">
      <comp-breadcrumb [items]="breadcrumbs"></comp-breadcrumb>
      <h1 class="text-2xl font-bold text-gray-800 mt-2">{{ title }}</h1>
      <p *ngIf="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() breadcrumbs: BreadcrumbItem[] = [];
}
