import { Routes } from "@angular/router";
import { authGuard } from "./Domains/Auth/Guards/auth.guard";
import { SetupWizardPage } from "./Domains/Setup/Pages/setup-wizard/setup-wizard.page";
import { initialLoadGuard } from "./Core/Guards/initial-load.guard";
import { LoginPage } from "./Domains/Auth/Pages/login/login.page"; // Import LoginPage
import { MainLayoutLayout } from "./Layout/Layouts/main-layout.layout";

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
    path: "", // This route uses the MainLayoutLayout
    component: MainLayoutLayout,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./Domains/Home/home.routing").then((m) => m.homeRoutes),
        canActivate: [authGuard],
        data: { animation: 'HomePage', title: 'Home', subtitle: 'Visão geral do ambiente' }
      },
      {
        path: "docs",
        loadChildren: () =>
          import("./Domains/Docs/docs.routing").then((m) => m.docsRoutes),
        canActivate: [],
        data: { animation: 'DocsPage', title: 'Documentação', subtitle: 'Guias e referências do projeto' }
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./Domains/Dashboard/dashboard.routing").then((m) => m.dashboardRoutes),
        canActivate: [authGuard],
        data: { animation: 'DashboardPage', title: 'Dashboard', subtitle: 'Painel de controle principal' }
      },
      {
        path: "azure-boards",
        loadChildren: () =>
          import("./Domains/AzureBoards/azure-boards.routing").then((m) => m.azureBoardsRoutes),
        canActivate: [authGuard],
        data: { animation: 'AzureBoardsPage', title: 'Azure Boards', subtitle: 'Gerenciamento de itens de trabalho do Azure' }
      },
      {
        path: "notes",
        loadChildren: () =>
          import("./Domains/Notes/notes.routing").then((m) => m.notesRoutes),
        canActivate: [authGuard],
        data: { animation: 'NotesPage', title: 'Notas Globais', subtitle: 'Anote suas ideias e informações importantes' }
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./Domains/Settings/settings.routing").then((m) => m.settingsRoutes),
        canActivate: [authGuard],
        data: { animation: 'SettingsPage', title: 'Configurações', subtitle: 'Ajuste as preferências da aplicação' }
      },
    ],
  },
  {
    path: "setup",
    component: SetupWizardPage,
    canActivate: [initialLoadGuard],
  },
  { path: "**", redirectTo: "error/404" },
];
