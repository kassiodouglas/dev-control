# Gestor Cotações B2B

Gestor de Cotações B2B desenvolvido em Angular.

## 🚀 Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run serve:dev
   ```
   A aplicação estará disponível em `http://localhost:8001`.

## 📂 Estrutura de Pastas

O projeto segue uma arquitetura baseada em **Domain-Driven Design (DDD)**:

- **`src/app/Domains/`**: Contém os módulos principais da aplicação, agrupados por domínio de negócio.
- **`src/app/Core/`**: Serviços globais e funcionalidades essenciais (ex: autenticação, interceptors).
- **`src/app/Shared/`**: Componentes de UI reutilizáveis e serviços genéricos.
- **`src/stubs/`**: Modelos utilizados pelo CLI para geração de arquivos.
- **`cli/`**: Scripts e utilitários de linha de comando customizados.

## 🛠️ CLI e Ferramentas

Este projeto inclui uma CLI customizada para agilizar o desenvolvimento.

> Para documentação detalhada da CLI, consulte [cli/README.md](cli/README.md).

### Comandos Rápidos

- **Menu de Ajuda:**
  ```bash
  npm run cli
  ```

- **Criar Domínio:**
  ```bash
  npm run md <NomeDoDominio>
  # Exemplo: npm run md Products
  ```

- **Criar Arquivo em Domínio:**
  ```bash
  npm run mdf <Dominio> <Tipo> <Nome>
  # Exemplo: npm run mdf Products Page list
  ```
  Tipos disponíveis: `Page`, `Modal`, `Panel`, `Component`, `Service`, `Api`, `Action`, `Dto`, `Enum`, `Interface`, `Form`, `Layout`.

- **Build e Deploy:**
  ```bash
  npm run build:deploy
  ```

## 📜 Scripts Disponíveis

Consulte o `package.json` para ver todos os scripts disponíveis, incluindo:
- `npm run build:test`: Build para ambiente de teste.
- `npm run build:prod`: Build para produção.
- `npm run build:all`: Executa builds de teste e produção.
