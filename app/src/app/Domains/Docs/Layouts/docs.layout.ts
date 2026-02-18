import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../Components/docs/sidebar.component';

@Component({
  selector: 'app-docs-layout',
  templateUrl: './docs.layout.html',
  standalone: true,
  imports: [RouterModule, SidebarComponent]
})
export class DocsLayout {}
