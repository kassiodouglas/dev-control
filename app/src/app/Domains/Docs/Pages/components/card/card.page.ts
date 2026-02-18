import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@src/app/Shared/Components/card/card.component';
import { PageHeaderComponent } from '../../../../../Shared/Components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { NotificationService } from '../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-card',
  standalone: true,
  imports: [CommonModule, CardComponent, PageHeaderComponent],
  templateUrl: './card.page.html',
})
export class CardPage {
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Components', url: '/docs/components' },
    { label: 'Card' },
  ];

  copyToClipboard() {
    const code = `
<comp-card>
  <div header>
    <h3 class="text-lg font-semibold">Título do Card</h3>
  </div>
  <div body>
    <p>Este é o conteúdo principal do card. Você pode colocar qualquer HTML aqui.</p>
  </div>
  <div footer>
    <button class="btn btn-primary">Ação do Rodapé</button>
  </div>
</comp-card>
    `;
    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
