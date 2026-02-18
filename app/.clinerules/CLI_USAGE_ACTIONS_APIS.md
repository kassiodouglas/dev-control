# Guia de Uso de Actions e APIs

Este guia detalha a estrutura e o fluxo de trabalho recomendado para o desenvolvimento de novas funcionalidades, utilizando Actions e APIs (services de API) de acordo com a arquitetura Domain-Driven Design (DDD) e as diretrizes de injeção de dependências do Angular.

## Estrutura de Actions e APIs

*   **Actions:** Encapsulam uma lógica de negócio específica. Elas orquestram a interação com uma ou mais APIs e implementam o tratamento de erros. As Actions são classes `@Injectable` com um método `execute()` que define a operação.
*   **APIs (Services de API):** São responsáveis por fazer as chamadas HTTP para o backend, interagindo diretamente com os endpoints da API. As APIs são classes `@Injectable` que utilizam `HttpClient`.

## Fluxo de Trabalho para Novas Funcionalidades

Para criar uma nova funcionalidade, siga os passos abaixo para garantir a padronização e a separação de responsabilidades:

### 1. Crie a API para a Nova Funcionalidade

Utilize o CLI para gerar a estrutura inicial da API. O domínio pode ser `Shared`, `Layout` ou um domínio específico em `src/app/Domains/<NomeDoDominio>/`. Por exemplo, para um domínio `Products`:

```bash
npm run mdf Products Api product
```

**Edição do Arquivo:**

*   Edite `src/app/Domains/Products/Apis/product.api.ts` (substitua `Products` pelo seu domínio e `product` pelo nome da sua API).
*   A classe gerada será `ProductApi` (ou o nome que você definiu).
*   Defina os métodos HTTP (GET, POST, PUT, DELETE) para as operações relacionadas à sua funcionalidade.
*   **Injeção de Dependências:** Você pode usar o método `inject` do `@angular/core` ou a injeção via construtor para `HttpClient`.

**Exemplo de Implementação de API (`product.api.ts`):**

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductApi {
  private http = inject(HttpClient); // Ou constructor(private http: HttpClient) { }
  private apiUrl = `${environment.apiUrl}/products`;

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }
}
```

### 2. Crie as Actions para a Nova Funcionalidade

Utilize o CLI para gerar as Actions necessárias. Por exemplo, para um domínio `Products`:

```bash
npm run mdf Products Action create-product
npm run mdf Products Action get-products
```

**Edição dos Arquivos:**

*   Edite os arquivos gerados em `src/app/Domains/Products/Actions/`.
*   As classes geradas terão o nome que você definiu (ex: `CreateProductAction`).
*   Implemente a lógica de negócio específica de cada ação.
*   **Injeção de Dependências:** Injete a API correspondente (ex: `ProductApi`) usando `inject` ou via construtor e chame os métodos apropriados da API.

**Exemplo de Implementação de Action (`create-product.action.ts`):**

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductApi } from '../Apis/product.api';

@Injectable({
  providedIn: 'root'
})
export class CreateProductAction {
  private productApi = inject(ProductApi); // Ou constructor(private productApi: ProductApi) { }

  execute(productData: any): Observable<any> {
    return this.productApi.create(productData).pipe(
      catchError(error => {
        console.error('Erro ao criar produto:', error);
        return throwError(() => new Error('Falha ao criar produto.'));
      })
    );
  }
}
```

### 3. Crie as Páginas/Componentes/Modals/Panels

Utilize o CLI para gerar as interfaces de usuário que irão interagir com as Actions. Por exemplo, para um domínio `Products`:

```bash
npm run mdf Products Page product-list
npm run mdf Products Component product-form
```

**Edição dos Arquivos:**

*   Edite os arquivos gerados em `src/app/Domains/Products/Pages/` (ou `Components`, `Modals`, `Panels`).
*   Crie a interface do usuário (templates HTML e lógica do componente).
*   **Injeção de Dependências:** Injete as Actions necessárias (ex: `CreateProductAction`) usando `inject` ou via construtor e chame seus métodos `execute()` para realizar as operações. 

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CreateProductAction } from '../Actions/create-product.action';
// ... outros imports

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  private createProductAction = inject(CreateProductAction);

  ngOnInit() {
    // ... inicialização
  }

  onSubmit(formData: any) {
    this.createProductAction.execute(formData).subscribe({
      next: (response) => {
        console.log('Produto criado com sucesso:', response);
        // ... lidar com sucesso
      },
      error: (error) => {
        console.error('Erro ao submeter formulário:', error);
        // ... lidar com erro
      }
    });
  }
}
```

Este guia visa padronizar o desenvolvimento, garantindo que as novas funcionalidades sigam a arquitetura e as boas práticas estabelecidas no projeto.
