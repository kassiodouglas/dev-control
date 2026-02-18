import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../../Shared/Components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { NotificationService } from '../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-notification',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './notification.page.html',
})
export class NotificationPage {
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Services', url: '/docs/services' },
    { label: 'Notification' },
  ];

  showSuccess() {
    this.notificationService.success('Esta é uma mensagem de sucesso!');
  }

  showFailure() {
    this.notificationService.failure('Esta é uma mensagem de falha.');
  }

  showWarning() {
    this.notificationService.warning('Esta é uma mensagem de aviso.');
  }

  showInfo() {
    this.notificationService.info('Esta é uma mensagem de informação.');
  }

  copyToClipboard() {
    const code = `
import { Component, inject } from '@angular/core';
import { NotificationService } from 'src/app/Shared/Services/notification.service';

@Component({
  selector: 'app-sua-pagina',
  templateUrl: './sua-pagina.component.html',
})
export class SuaPaginaComponent {
  private notificationService = inject(NotificationService);

  showSuccess() {
    this.notificationService.success('Esta é uma mensagem de sucesso!');
  }

  showFailure() {
    this.notificationService.failure('Esta é uma mensagem de falha.');
  }

  showWarning() {
    this.notificationService.warning('Esta é uma mensagem de aviso.');
  }

  showInfo() {
    this.notificationService.info('Esta é uma mensagem de informação.');
  }
}
    `;
    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
