import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import { iLoginCredentials } from '../Interfaces/login-credentials.interface';
import { iApiResponse } from '@src/app/Core/Interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {

  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(request:iLoginCredentials): Observable<iApiResponse> {
    return this.http.post<iApiResponse>(`${this.baseUrl}/login`, request);
  }

}
