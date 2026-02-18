import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthApi } from '../Apis/auth.api';
import { iLoginCredentials } from '../Interfaces/login-credentials.interface';
import { iApiResponse } from '@src/app/Core/Interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginAction {

  authApi = inject(AuthApi);

  execute(credentials: iLoginCredentials): Observable<iApiResponse> {
    return this.authApi.login(credentials);
  }
}
