import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { PageHeaderComponent } from '../../../../../Shared/Components/page-header/page-header.component';
import { NotificationService } from '../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, PageHeaderComponent],
  templateUrl: './breadcrumb.page.html',
})
export class BreadcrumbPage {
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Components', url: '/docs/components' },
    { label: 'Breadcrumb' },
  ];

  exampleBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Products', url: '/products' },
    { label: 'Category', url: '/products/category' },
    { label: 'Product' },
  ];

  copyToClipboard(type: 'html' | 'ts') {
    let code = '';
    if (type === 'html') {
      code = `<comp-breadcrumb [items]="exampleBreadcrumbs"></comp-breadcrumb>`;
    } else if (type === 'ts') {
      code = `
import { Component } from '@angular/core';
import { BreadcrumbItem } from '...'; // Importe a interface

@Component({
  selector: 'app-sua-pagina',
  templateUrl: './sua-pagina.component.html',
})
export class SuaPaginaComponent {
  exampleBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Produtos', url: '/produtos' },
    { label: 'Categoria', url: '/produtos/categoria' },
    { label: 'Produto' },
  ];
}
      `;
    }

    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
