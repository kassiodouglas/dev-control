import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@src/app/Shared/Components/modal/modal.component';
import { ModalService } from '@src/app/Shared/Components/modal/Services/modal.service';
import { PageHeaderComponent } from '../../../../../Shared/Components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { NotificationService } from '../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, PageHeaderComponent],
  templateUrl: './modal.page.html',
})
export class ModalPage {
  private modalService = inject(ModalService);
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Components', url: '/docs/components' },
    { label: 'Modal' },
  ];

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  copyToClipboard(type: 'html' | 'ts') {
    let code = '';
    if (type === 'html') {
      code = `
<!-- Botão para acionar o modal -->
<button class="btn btn-primary" (click)="openModal('basic-modal')">Abrir Modal</button>

<!-- Estrutura do Modal -->
<app-modal id="basic-modal">
  <div title>Título do Modal</div>
  <div subtitle>Este é o subtítulo do modal.</div>

  <p>Corpo do modal...</p>

  <div actions>
    <button class="btn" (click)="closeModal('basic-modal')">Cancelar</button>
    <button class="btn btn-primary" (click)="closeModal('basic-modal')">Confirmar</button>
  </div>
</app-modal>
      `;
    } else if (type === 'ts') {
      code = `
import { Component, inject } from '@angular/core';
import { ModalService } from '@shared/Components/modal/Services/modal.service';

@Component({
  selector: 'app-sua-pagina',
  // ...
})
export class SuaPaginaComponent {
  private modalService = inject(ModalService);

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
      `;
    }
    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
