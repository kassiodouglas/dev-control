import { Routes } from "@angular/router";
import { authGuard } from "./Domains/Auth/Guards/auth.guard";
import { SetupWizardPage } from "./Domains/Setup/Pages/setup-wizard/setup-wizard.page";
import { initialLoadGuard } from "./Core/Guards/initial-load.guard";
import { LoginPage } from "./Domains/Auth/Pages/login/login.page"; // Import LoginPage

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard", // Redireciona a rota raiz para o dashboard
    pathMatch: "full",
  },
  {
    path: "autenticacao",
    loadChildren: () =>
      import("./Domains/Auth/auth.routing").then((m) => m.authRoutes),
    canActivate: [authGuard],
  },
  {
    path: "autenticacao/login", // Explicit login route for the guard
    component: LoginPage,
  },
  {
    path: "home",
    loadChildren: () =>
      import("./Domains/Home/home.routing").then((m) => m.homeRoutes),
    canActivate: [authGuard],
  },
  {
    path: "docs",
    loadChildren: () =>
      import("./Domains/Docs/docs.routing").then((m) => m.docsRoutes),
    canActivate: [],
  },
  {
    path: "setup",
    component: SetupWizardPage,
    canActivate: [initialLoadGuard], // Moved initialLoadGuard here
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./Domains/Dashboard/dashboard.routing").then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  { path: "**", redirectTo: "error/404" },
];
