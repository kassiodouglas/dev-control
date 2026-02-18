import { Routes } from "@angular/router";
import { authGuard } from "./Domains/Auth/Guards/auth.guard";

export const routes: Routes = [
  {
    path: "autenticacao",
    loadChildren: () =>
      import("./Domains/Auth/auth.routing").then((m) => m.authRoutes),
    canActivate: [authGuard],
  },
  {
    path: "",
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

  { path: "", redirectTo: "autenticacao/login", pathMatch: "full" },
  { path: "**", redirectTo: "error/404" },
];
