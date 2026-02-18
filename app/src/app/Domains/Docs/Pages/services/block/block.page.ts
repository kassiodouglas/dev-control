import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../../Shared/Components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { BlockService } from '../../../../../Shared/Services/block.service';
import { NotificationService } from '../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-block',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './block.page.html',
})
export class BlockPage {
  private blockService = inject(BlockService);
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Services', url: '/docs/services' },
    { label: 'Block' },
  ];

  blockElement() {
    this.blockService.show('#block-element', 'Carregando...');
    setTimeout(() => {
      this.blockService.hide('#block-element');
    }, 2000);
  }

  copyToClipboard() {
    const code = `
import { Component, inject } from '@angular/core';
import { BlockService } from 'src/app/Shared/Services/block.service';

@Component({
  selector: 'app-sua-pagina',
  template: \`
    <div id="block-element" class="relative p-4 border rounded-lg">
      <p>Este elemento pode ser bloqueado.</p>
    </div>
    <button class="mt-2 btn btn-primary" (click)="blockElement()">Bloquear Elemento</button>
  \`
})
export class SuaPaginaComponent {
  private blockService = inject(BlockService);

  blockElement() {
    // Bloqueia o elemento com o seletor '#block-element' e exibe a mensagem 'Carregando...'
    this.blockService.show('#block-element', 'Carregando...');

    // Desbloqueia o elemento após 2 segundos
    setTimeout(() => {
      this.blockService.hide('#block-element');
    }, 2000);
  }
}
    `;
    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
