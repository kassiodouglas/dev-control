import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../../../../Core/Services/security.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  router = inject(Router);
  securityService = inject(SecurityService);
  password = ''; // Changed from signal to string for easier ngModel binding

  async login() {
    const isPasswordValid = await this.securityService.verifySecurityPassword(this.password);
    if (isPasswordValid) {
      console.log('Login successful!');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Senha incorreta!');
      console.log('Login failed: Incorrect password');
    }
  }
}
