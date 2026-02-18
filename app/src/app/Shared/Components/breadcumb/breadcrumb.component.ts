import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'comp-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="breadcrumb">
      <ol class="flex items-center space-x-2 text-sm text-gray-500">
        @for (item of items; track item.label; let last = $last) {
          <li>
            <div class="flex items-center">
              @if (!last && item.url) {
                <a [routerLink]="item.url" class="hover:underline">{{ item.label }}</a>
              }
              @if (last || !item.url) {
                <span>{{ item.label }}</span>
              }
              @if (!last) {
                <svg class="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
              }
            </div>
          </li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
