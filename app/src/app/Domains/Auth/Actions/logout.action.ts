import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class LogoutAction {
  private router = inject(Router);

  execute(): void {
    localStorage.clear();
    this.router.navigate(["/autenticacao/login"]);
  }
}
