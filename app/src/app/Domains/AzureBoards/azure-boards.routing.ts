import { Routes } from '@angular/router';
import { AzureBoardsPagePage } from './Pages/azure-boards-page/azure-boards-page.page'; // Correct import

export const azureBoardsRoutes: Routes = [
  {
    path: '',
    component: AzureBoardsPagePage, // Correct component
  },
];
