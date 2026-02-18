import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'comp-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Panel Component</h2>
    </div>
  `,
})
export class PanelComponent {}
