# Padronização de Módulos Electron

Este documento descreve o padrão de arquitetura para novos módulos na aplicação Electron e o uso das ferramentas CLI para automatizar sua criação.

## Padrão de Módulos

Cada novo módulo (ou entidade de dados) na aplicação Electron deve seguir esta estrutura:

1.  **Repositório (`electron/database/repositories/{{ModuleName}}.js`)**
    *   **Responsabilidade:** Gerenciamento de operações CRUD (Criar, Ler, Atualizar, Deletar) para uma tabela específica no banco de dados.
    *   **Convenção de Nome:** `PascalCase` para o nome do arquivo e da classe.
    *   **Exemplo:** `AppRepository` em `electron/database/repositories/App.js`.

2.  **Handler IPC (`electron/ipc/handlers/{{moduleName}}.js`)**
    *   **Responsabilidade:** Atuar como a ponte entre o processo de renderização (frontend) e o processo principal (backend). Ele escuta canais IPC, realiza validações de entrada básicas e **delega a lógica de negócio complexa para uma camada de Serviço/Domínio**, invocando os métodos apropriados.
    *   **Convenção de Nome:** `camelCase` para o nome do arquivo. A função de setup deve ser `setup{{ModuleName}}IpcHandlers`.
    *   **Canais IPC:** Devem seguir o padrão `kebab-case` (ex: `get-apps`, `add-app`).
    *   **Exemplo:** `app` em `electron/ipc/handlers/app.js` com a função `setupAppIpcHandlers`.

3.  **Migration do Banco de Dados (`electron/database/migrations/TIMESTAMP_create_{{tableName}}_table.js`)**
    *   **Responsabilidade:** Definir e evoluir o esquema da tabela do banco de dados para o módulo.
    *   **Convenção de Nome:** Padrão de timestamp do Knex.js (`YYYYMMDDHHmmss_create_tablename_table.js`). O nome da tabela deve ser `snake_case` e no plural.
    *   **Exemplo:** `20260217210421_initial_schema.js` com a tabela `settings`.

## Camadas de Lógica de Negócio

Para garantir uma arquitetura limpa e escalável, a lógica de negócio deve ser distribuída entre as seguintes camadas:

*   **Handlers IPC (`electron/ipc/handlers/`)**:
    *   **Responsabilidade Principal:** Atuar como **coordenador**. Recebe eventos do frontend, realiza validações de entrada básicas e **delega** a execução da lógica de negócio para uma camada de Serviço/Domínio.
    *   **Evitar:** Lógica de negócio complexa, manipulação direta de múltiplos repositórios ou regras de negócio intrincadas.

*   **Serviços / Domínios (Sugestão: `electron/domains/` ou `electron/services/`)**:
    *   **Responsabilidade Principal:** É aqui que a **lógica de negócio complexa** reside. Orquestra operações que podem envolver múltiplos repositórios, aplica regras de negócio, realiza validações mais sofisticadas e coordena fluxos de trabalho.
    *   **Comunicação:** Utiliza os Repositórios para acessar e persistir dados, e é invocado pelos Handlers IPC.

*   **Repositórios (`electron/database/repositories/`)**:
    *   **Responsabilidade Principal:** Lógica de **acesso a dados**. Interage diretamente com o banco de dados para operações CRUD (Criar, Ler, Atualizar, Deletar) de uma única entidade.
    *   **Evitar:** Conter lógica de negócio. Sua função é apenas mapear operações de objeto para operações de persistência e vice-versa.

**Fluxo Recomendado:**

Frontend (Renderer Process) --(IPC Event)--> Handler IPC --(Chama Método)--> Serviço/Domínio --(Chama Métodos)--> Repositório(s) --(Interage com)--> Banco de Dados

## Ferramentas CLI Individuais para Geração de Módulos

Para padronizar e agilizar a criação de novos componentes de módulos, utilize os seguintes comandos CLI individuais. Execute-os no diretório `electron/` ou no diretório raiz do projeto (se o `package.json` de `electron` estiver configurado corretamente).

### 1. Gerar Repositório (`generate:repository`)

**Uso:**

```bash
npm run generate:repository <NomeDoModulo>
```

*   Cria o arquivo de repositório em `electron/database/repositories/<NomeDoModulo>.js`.

### 2. Gerar Handler IPC (`generate:handler`)

**Uso:**

```bash
npm run generate:handler <NomeDoModulo>
```

*   Cria o arquivo de handler IPC em `electron/ipc/handlers/<nomeDoModuloEmCamelCase>.js`.
*   Este comando também exibirá as instruções necessárias para integrar o novo handler em `electron/ipc/index.js`.

### 3. Gerar Migration (`generate:migration`)

**Uso:**

```bash
npm run generate:migration <NomeDoModulo>
```

*   Cria um arquivo de migration no diretório `electron/database/migrations/TIMESTAMP_create_<nomeDaTabelaNoPluralEmSnakeCase>_table.js`.

## Integração Manual em `electron/ipc/index.js`

Após gerar um **Handler IPC** com o comando `generate:handler`, a CLI irá fornecer duas linhas que precisam ser adicionadas manualmente no arquivo `electron/ipc/index.js` para que o novo handler seja registrado e funcione corretamente:

1.  **Na seção de imports de handlers:**
    Adicione a linha para importar o handler do seu novo módulo, por exemplo:
    ```javascript
    const setupMeuModuloIpcHandlers = require('./handlers/meuModulo');
    ```
    (Substitua `MeuModulo` e `meuModulo` pelos nomes gerados pelo comando `generate:handler`.)

2.  **Dentro da função `setupIpcHandlers()`:**
    Adicione a chamada para a função de setup do handler do seu novo módulo, por exemplo:
    ```javascript
      setupMeuModuloIpcHandlers();
    ```
    (Substitua `MeuModulo` pelo nome gerado pelo comando `generate:handler`.)

Certifique-se de ajustar os caminhos e nomes de acordo com o módulo gerado.