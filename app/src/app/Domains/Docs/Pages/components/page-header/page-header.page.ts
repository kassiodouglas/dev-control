import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../../Shared/Components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { NotificationService } from '../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-page-header',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './page-header.page.html',
})
export class PageHeaderPage {
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Components', url: '/docs/components' },
    { label: 'Page Header' },
  ];

  exampleBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Configurações' },
  ];

  copyToClipboard(type: 'html' | 'ts') {
    let code = '';
    if (type === 'html') {
      code = `
<comp-page-header
  title="Configurações"
  subtitle="Gerencie as configurações da sua conta"
  [breadcrumbs]="exampleBreadcrumbs"
></comp-page-header>
      `;
    } else if (type === 'ts') {
      code = `
import { Component } from '@angular/core';
import { BreadcrumbItem } from '...'; // Importe a interface

@Component({
  selector: 'app-sua-pagina',
  // ...
})
export class SuaPaginaComponent {
  exampleBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Configurações' },
  ];
}
      `;
    }
    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
