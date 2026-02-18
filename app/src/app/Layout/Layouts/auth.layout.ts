import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'layout-auth',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './auth.layout.html',
  styleUrls: ['./auth.layout.scss']
})
export class AuthLayout {
}
