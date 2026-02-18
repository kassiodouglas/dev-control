import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../../Shared/Components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { LoadingService } from '../../../../../Shared/Services/loading.service';
import { NotificationService } from '../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-loading',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './loading.page.html',
})
export class LoadingPage {
  private loadingService = inject(LoadingService);
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Services', url: '/docs/services' },
    { label: 'Loading' },
  ];

  showLoading() {
    this.loadingService.show('Carregando dados...');
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }

  copyToClipboard() {
    const code = `
import { Component, inject } from '@angular/core';
import { LoadingService } from 'src/app/Shared/Services/loading.service';

@Component({
  selector: 'app-sua-pagina',
  template: \`<button class="btn btn-primary" (click)="showLoading()">Exibir Loading (2s)</button>\`
})
export class SuaPaginaComponent {
  private loadingService = inject(LoadingService);

  showLoading() {
    // Exibe o loading com uma mensagem
    this.loadingService.show('Carregando dados...');

    // Esconde o loading após 2 segundos
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }
}
    `;
    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
