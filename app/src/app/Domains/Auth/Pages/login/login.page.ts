import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthLayout } from '../../../../Layout/Layouts/auth.layout';
import { LoginAction } from '../../Actions/login.action';
import { NotificationService } from '@src/app/Shared/Services/notification.service';
import { AuthService } from '../../Services/auth.service';
import { iApiErrorResponse, iApiResponse } from '@src/app/Core/Interfaces/api-response.interface';
import { iLoginSuccessResponse } from '../../Interfaces/login-success-response.interface';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginFormComponent } from "../../forms/login-form/login-form.component";
import { iLoginCredentials } from '../../Interfaces/login-credentials.interface';

@Component({
  selector: 'page-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule, // For the logo icon in the header (trending_up)
    AuthLayout,
    RouterModule,
    LoginFormComponent
],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private loginAction = inject(LoginAction);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  isLoading = false;
  isDevMode = environment.mode === 'development';

  onSubmit(credentials:iLoginCredentials) {
    this.isLoading = true;

    this.loginAction.execute(credentials).pipe(
      tap((r: iLoginSuccessResponse) => this.handleLoginSuccess(r)),
      catchError((e: iApiErrorResponse) => {this.handleLoginError(e);return of();}),
      finalize(() => this.finalizeLogin())
    ).subscribe();
  }

  private handleLoginSuccess(r: iLoginSuccessResponse): void {
    if (r.status === 'success' && r.data) {
      this.authService.login(r.data.access_token!);
      this.router.navigateByUrl('/');
    } else {
      this.notificationService.warning(r.message);
    }
  }

  private handleLoginError(e: iApiErrorResponse): void {
    this.notificationService.warning(e.error?.message || e.message);
  }

  private finalizeLogin(): void {
    this.isLoading = false;
  }

}
