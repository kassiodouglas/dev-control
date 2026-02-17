# 🚀 DevControl

**DevControl** é um dashboard "tudo-em-um" projetado para desenvolvedores gerenciarem seus projetos locais, tarefas do Azure DevOps, notas e automações em uma interface moderna e centralizada.

Construído com **Angular 20** (Zoneless + Signals) e **Tailwind CSS**.

---

## ✨ Funcionalidades Principais

### 🖥️ Dashboard Central
- Visão geral de projetos importados.
- Status em tempo real de aplicações rodando (simulado).
- Resumo de User Stories ativas do Azure DevOps.
- Atalhos rápidos para ações frequentes.

### 📂 Gerenciamento de Projetos Locais
- **Terminal Simulado**: Visualize logs, execute comandos salvos e simule operações de git.
- **Controle de Estado**: Iniciar/Parar aplicações e trocar de branch.
- **Comandos Salvos**: Crie atalhos para scripts frequentes (`npm start`, `docker-compose up`, etc.).
- **Notas de Projeto**: Bloco de notas específico para cada projeto (suporte a Markdown).

### ☁️ Integração Azure DevOps
- **Visualização Kanban/Grid**: Veja suas User Stories, Bugs e Tasks.
- **Edição Rápida**: Altere status, títulos e descrições sem sair do app.
- **Hierarquia**: Navegue entre User Stories e seus filhos (Tasks/Bugs).
- **Linkagem**: Associe uma User Story a um Projeto Local específico para acesso rápido.

### 🧠 Inteligência Artificial (Gemini AI)
- **Resumo Automático**: Gere resumos técnicos de User Stories complexas.
- **Sugestão de Tarefas**: A IA analisa a descrição da história e sugere Tasks e Bugs técnicos para criar automaticamente.

### 📝 Notas Globais
- Editor Markdown com modo de visualização e edição.
- Gerenciamento de notas pessoais não vinculadas a projetos específicos.

### 🔐 Segurança & Dados
- **App Lock**: Proteja o dashboard com uma senha de inicialização.
- **Backup/Restore**: Exporte todas as suas configurações, projetos e notas para um arquivo JSON e restaure quando quiser.
- **Modo Escuro**: Suporte nativo a Dark Mode.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: Angular 20 (Standalone Components, Signals, Zoneless Detection).
- **Estilização**: Tailwind CSS.
- **Ícones**: FontAwesome 6.
- **AI**: Google GenAI SDK (Gemini 2.5 Flash).
- **Armazenamento**: LocalStorage (Persistência local).

---

## 🚀 Como Executar

Este projeto foi gerado com Angular CLI.

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

3. **Acesse no navegador:**
   Abra `http://localhost:4200/`.

---

## 🚀 Como Executar (Electron)

Para buildar o aplicativo Angular para o Electron e tentar iniciar o aplicativo Electron:

1.  **Navegue para o diretório `app` e execute o build do Angular para Electron:**
    ```bash
    cd app
    npm run build -- --configuration=electron
    ```

2.  **Tente iniciar o aplicativo Electron (após a instalação bem-sucedida das dependências do Electron):**
    ```bash
    cd app
    npm run electron:start
    ```
    *   **Nota sobre o erro de certificado SSL:** Se você encontrar erros relacionados a "self-signed certificate in certificate chain" durante a instalação das dependências do Electron (`npm install` dentro do diretório `electron`), isso geralmente indica um problema com seu ambiente de rede (proxy corporativo ou inspeção SSL). Este ambiente automatizado não pode resolver diretamente essa questão. Você precisará configurar seu ambiente local para permitir o download seguro das dependências do Electron (por exemplo, configurando proxies npm, adicionando certificados raiz de confiança ou desabilitando temporariamente a verificação SSL em seu sistema, o que não é recomendado para ambientes de produção).

---

## ⚙️ Configuração Inicial (Setup Wizard)

Ao abrir o app pela primeira vez, um assistente guiará você por 3 etapas:

1. **Perfil**: Defina seu nome e avatar.
2. **Integrações**:
   - **Gemini API Key**: Necessário para funcionalidades de IA. (Obtenha no Google AI Studio).
   - **Azure DevOps**: Insira seu Token de Acesso Pessoal (PAT), Organização e Projeto.
     - *Nota: Se não configurar, o app entrará em "Demo Mode" com dados fictícios.* 
3. **Segurança**: (Opcional) Defina uma senha para bloquear o app.

---

## ⚠️ Nota sobre Simulação

Como este é um aplicativo web rodando no navegador:
- A execução de comandos de terminal (ex: `npm start` real) e acesso direto ao sistema de arquivos do SO são **simulados** para fins de demonstração da interface.
- Para funcionalidade real de sistema operacional (abrir pastas reais, rodar terminais reais), este projeto deve ser encapsulado em **Electron** ou **Tauri**.

---

## 🎨 Estrutura do Projeto

- `src/services/app.service.ts`: O "cérebro" da aplicação. Gerencia estado global (Signals), persistência e comunicação com APIs.
- `src/components/`:
  - `dashboard`: Visão geral.
  - `azure-devops`: Integração completa com Azure Boards.
  - `app-detail`: Detalhes do projeto, terminal e comandos.
  - `setup-wizard`: Fluxo de boas-vindas.
  - `settings`: Configurações de API e Backup.

---

Desenvolvido com ❤️ para agilizar o fluxo de trabalho local.
