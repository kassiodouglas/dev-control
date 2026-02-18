import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {
  private messages: Record<string, (error: any) => string> = {
    required: () => 'Campo é obrigatório',
    email: () => 'Digite um e-mail válido',
    minlength: (error) => `Mínimo ${error.requiredLength} caracteres`,
    maxlength: (error) => `Máximo ${error.requiredLength} caracteres`,
    pattern: () => 'Formato inválido'
  };

  getErrorMessage(key: string, error: any): string {
    const handler = this.messages[key];
    return handler ? handler(error) : 'Campo inválido';
  }

  registerMessage(key: string, handler: (error: any) => string) {
    this.messages[key] = handler;
  }
}
