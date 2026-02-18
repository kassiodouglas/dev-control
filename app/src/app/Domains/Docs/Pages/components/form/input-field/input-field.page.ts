import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '@src/app/Shared/Components/form/input-field/input-field.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../../../../Shared/Components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../../../Shared/Components/breadcumb/breadcrumb.component';
import { NotificationService } from '../../../../../../Shared/Services/notification.service';

@Component({
  selector: 'page-input-field',
  standalone: true,
  imports: [CommonModule, InputFieldComponent, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './input-field.page.html',
})
export class InputFieldPage {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Docs', url: '/docs' },
    { label: 'Components', url: '/docs/components' },
    { label: 'Form' },
    { label: 'Input Field' },
  ];

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  copyToClipboard(type: 'html' | 'ts') {
    let code = '';
    if (type === 'html') {
      code = `
<form [formGroup]="myForm" class="space-y-4">
  <!-- Campo de Texto Simples com Ícone -->
  <comp-input-field
    label="Nome"
    controlName="name"
    placeholder="Digite seu nome completo"
    icon="person"
  ></comp-input-field>

  <!-- Campo de Email com Validação -->
  <comp-input-field
    label="Email"
    controlName="email"
    type="email"
    placeholder="ex: seuemail@dominio.com"
    icon="email"
  ></comp-input-field>

  <!-- Campo de Senha -->
  <comp-input-field
    label="Senha"
    controlName="password"
    type="password"
    placeholder="Digite uma senha segura"
    icon="lock"
  ></comp-input-field>
</form>
      `;
    } else if (type === 'ts') {
      code = `
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sua-pagina',
  // ...
})
export class SuaPaginaComponent {
  private fb = inject(FormBuilder);

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
}
      `;
    }
    navigator.clipboard.writeText(code);
    this.notificationService.success('Código copiado para a área de transferência!');
  }
}
