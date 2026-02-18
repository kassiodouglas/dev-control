import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.checkToken());

  public isAuthenticated$ = this.isAuthenticated.asObservable();

  private checkToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  login(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      this.isAuthenticated.next(true);
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      this.isAuthenticated.next(false);
    }
  }

  checkAuthentication(): boolean {
    const isLoggedIn = this.checkToken();
    if (this.isAuthenticated.getValue() !== isLoggedIn) {
      this.isAuthenticated.next(isLoggedIn);
    }
    return isLoggedIn;
  }
}
