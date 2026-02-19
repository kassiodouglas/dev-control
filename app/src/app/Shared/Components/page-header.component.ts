import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'comp-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>PageHeader Component</h2>
    </div>
  `,
})
export class PageHeaderComponent {}
