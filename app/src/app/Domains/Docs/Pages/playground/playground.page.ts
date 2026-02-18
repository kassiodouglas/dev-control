import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'page-playground',
  imports: [CommonModule, RouterModule],
  templateUrl: './playground.page.html',
})
export class PlaygroundPage {
  constructor() {}
}
