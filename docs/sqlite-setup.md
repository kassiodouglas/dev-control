# Configuração do SQLite com Knex.js no Electron

Este documento detalha como o SQLite foi configurado em seu projeto Electron, utilizando o Knex.js como query builder e sistema de migrações.

## 1. Visão Geral

O SQLite é um banco de dados leve e baseado em arquivo, ideal para aplicações desktop como o Electron, pois não requer um servidor de banco de dados separado. O Knex.js é uma ferramenta poderosa que facilita a interação com bancos de dados relacionais e, mais importante, oferece um sistema robusto para gerenciar alterações no esquema do banco de dados (migrações).

## 2. Dependências Instaladas

As seguintes dependências foram adicionadas ao `electron/package.json`:

-   `sqlite3`: O driver Node.js para interagir com o banco de dados SQLite.
-   `knex`: O "query builder" SQL que oferece abstração e o sistema de migrações.

Você pode verificar estas dependências no arquivo `electron/package.json`.

## 3. Estrutura de Arquivos Criada

Para organizar a lógica do banco de dados, a seguinte estrutura de diretórios e arquivos foi criada dentro da pasta `electron`:

```
electron/
├── database/
│   ├── migrations/ # Contém os arquivos de migração que definem o esquema do banco.
│   └── connection.js # Configura a conexão com o banco de dados usando o Knex.
├── knexfile.js # Define as configurações do Knex para diferentes ambientes (desenvolvimento/produção).
└── main.js # Inicializa o aplicativo Electron e executa as migrações na inicialização.
```

### `electron/knexfile.js`

Este arquivo configura o Knex. Ele define onde o arquivo do banco de dados (`database.sqlite`) será armazenado e onde os arquivos de migração estão localizados para os ambientes de `development` e `production`. Para o ambiente de produção, ele utiliza o caminho de dados do usuário (`app.getPath('userData')`) do Electron para garantir que os dados do usuário sejam persistentes e não sejam sobrescritos em atualizações do aplicativo.

### `electron/database/connection.js`

Este arquivo é responsável por inicializar a conexão do Knex com base nas configurações definidas no `knexfile.js`. Ele detecta automaticamente se o aplicativo está rodando em ambiente de `development` ou `production`.

### `electron/database/migrations/YYYYMMDDHHMMSS_initial_schema.js`

Este é um exemplo de arquivo de migração. Cada arquivo de migração tem duas funções principais:

-   `exports.up`: Define as alterações a serem aplicadas ao esquema do banco de dados (ex: criar tabelas).
-   `exports.down`: Define as ações para reverter as alterações feitas por `up` (ex: dropar tabelas). No exemplo, ele cria tabelas `settings` e `notes`.

## 4. Como Criar Novas Migrações

Para criar uma nova migração, você pode usar o script `migrate:make` que foi adicionado ao `electron/package.json`. No terminal, na raiz da pasta `electron`, execute:

```bash
npm run migrate:make nome_da_sua_migration
```

Isso criará um novo arquivo na pasta `electron/database/migrations/` com um timestamp e o nome que você forneceu. Você então edita este arquivo para definir as alterações do seu banco de dados.

## 5. Como Executar as Migrações

### Durante o Desenvolvimento (Manual)

Você pode executar as migrações manualmente usando os scripts Knex CLI:

-   **Para aplicar as migrações pendentes**: Na pasta `electron`, execute:
    ```bash
    npm run migrate:latest
    ```
-   **Para reverter a última migração aplicada**: Na pasta `electron`, execute:
    ```bash
    npm run migrate:rollback
    ```

### Automaticamente com o Electron

O `electron/main.js` foi modificado para executar `db.migrate.latest()` automaticamente quando o aplicativo Electron é iniciado. Isso garante que o banco de dados esteja sempre com o esquema mais recente ao iniciar a aplicação.

## 6. Como Inspecionar o Banco de Dados

Para inspecionar o conteúdo do seu banco de dados SQLite, você pode usar uma ferramenta como o **DB Browser for SQLite** (disponível em [sqlitebrowser.org](https://sqlitebrowser.org/)).

-   **Localização do arquivo `database.sqlite` em Desenvolvimento**: `electron/database/database.sqlite`
-   **Localização do arquivo `database.sqlite` em Produção**: O caminho será dinâmico e pode ser encontrado no diretório de dados do usuário do seu sistema operacional. Por exemplo, no Windows, geralmente é algo como `C:\Users\<SeuUsuario>\AppData\Roaming\<SeuAppElectron>\database.sqlite`.