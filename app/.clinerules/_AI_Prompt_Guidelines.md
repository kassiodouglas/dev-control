Você é um engenheiro de software experiente e irá auxiliar no desenvolvimento de um projeto Angular que segue uma arquitetura Domain-Driven Design (DDD).

**Uso do CLI:**

Este projeto utiliza um CLI customizado para agilizar o desenvolvimento. Sempre que precisar criar novas funcionalidades, módulos ou arquivos, utilize os seguintes comandos via `npm run` no diretório `app/`:

*   **Menu de Ajuda:** `npm run cli` (Exibe todos os comandos disponíveis).
*   **Criar Domínio Completo:** `npm run make:domain <nome-do-dominio>` ou `npm run md <nome-do-dominio>`. Este comando gera uma estrutura completa para um novo domínio, incluindo pastas como Actions, Services, Apis, Pages, Components, Dtos e Enums. Você pode adicionar pastas customizadas com `--with <folders...>` ou um `README.md` com `--with-readme`.
    *   Exemplo: `npm run md Users --with Modals Panels --with-readme`
*   **Criar Arquivo em Domínio:** `npm run make:domain:file <dominio> <tipo-do-arquivo> <nome-do-arquivo>` ou `npm run mdf <dominio> <tipo-do-arquivo> <nome-do-arquivo>`. Os tipos disponíveis são: `Page`, `Modal`, `Panel`, `Component`, `Service`, `Api`, `Action`, `Dto`, `Enum`, `Interface`, `Form`, `Layout`.
    *   Domínios especiais: `Shared` (para `src/app/Shared/`), `Layout` (para `src/app/Layout/`). Outros domínios serão criados em `src/app/Domains/<NomeDoDominio>/`.
    *   Exemplo: `npm run mdf Products Page list` (cria `list.page.ts` e `list.page.html` no domínio `Products`). Subpastas podem ser especificadas: `npm run mdf Users Page admin/list`.
*   **Build e Deploy:** Para builds versionados, use `npm run build:deploy [opções]`. O CLI gerencia o versionamento no formato `MAJOR.MINOR.PATCH.BUILD`.
    *   Exemplo: `npm run build:deploy -- --target prod`
*   **Desenvolvimento:** Para iniciar o servidor de desenvolvimento, use `npm run serve:dev`.

**Arquitetura e Estrutura de Desenvolvimento (Domain Doc):**

O projeto segue uma arquitetura Domain-Driven Design (DDD), organizada da seguinte forma:

*   **`src/app/Domains/`**: Contém os módulos principais da aplicação, agrupados por domínio de negócio (ex: `Admin`, `Auth`, `Doc`). Cada domínio é um módulo autocontido, com suas próprias rotas, páginas, componentes, serviços e modelos de dados (DTOs, Enums).
*   **`src/app/Core/Services/`**: Abriga serviços globais e funcionalidades cross-cutting que são essenciais para o funcionamento da aplicação como um todo, como serviços de tema e monitoramento de token.
*   **`src/app/Shared/`**: Inclui componentes de UI reutilizáveis (ex: `breadcumb`, `buttons`, `card`) e serviços genéricos (ex: `modal.service`, `notification.service`) que podem ser utilizados por qualquer domínio ou parte da aplicação, promovendo a reusabilidade e a consistência visual e funcional.
*   **`src/stubs/domain/`**: Este diretório contém os modelos (stubs) utilizados pelo CLI para gerar novos arquivos e estruturas de domínio, garantindo padronização no código.
*   **Aplicação Angular:** A base do projeto é uma aplicação Angular, utilizando TypeScript, componentes, serviços e roteamento padrão do framework.

**Instruções para a IA:**

Ao desenvolver ou modificar funcionalidades, siga as seguintes diretrizes:

1.  **Priorize o uso do CLI:** Sempre utilize os comandos `npm run make:domain` e `npm run make:domain:file` para criar novos arquivos e estruturas, a menos que seja estritamente necessário criar algo manualmente. Isso garante a padronização do projeto.
2.  **Respeite a arquitetura DDD:** Mantenha as funcionalidades dentro de seus respectivos domínios em `src/app/Domains/`. Componentes e serviços genéricos devem residir em `src/app/Shared/` ou `src/app/Core/Services/`.
3.  **Mantenha a consistência:** Ao criar novos arquivos ou modificar existentes, siga os padrões de nomenclatura e estrutura já estabelecidos nos stubs e nos domínios existentes.
4.  **Escreva código limpo e testável:** Aplique as melhores práticas de desenvolvimento Angular, incluindo modularização, injeção de dependências e responsabilidade única.
5.  **Documentação:** Sempre que criar um novo domínio, considere a opção `--with-readme` para gerar um arquivo `README.md` descrevendo o propósito e uso do domínio.

Seja proativo em identificar oportunidades de refatoração, melhorias de desempenho ou otimizações de código, sempre alinhado com a arquitetura e as ferramentas existentes.
