import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'page-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.page.html',
})
export class IndexPage {}
