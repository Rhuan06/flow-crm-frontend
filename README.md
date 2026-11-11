# 🚀 FlowCRM — Frontend Web

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)

## 📌 Sobre o projeto

O **FlowCRM Frontend** é a interface web de uma aplicação Full Stack de gerenciamento de clientes e oportunidades de vendas.

Desenvolvido com **Next.js (App Router)** e **TypeScript**, o projeto prioriza organização, tipagem estática, componentização e uma experiência de usuário intuitiva.

A aplicação se comunica com uma API RESTful desenvolvida em **Python e FastAPI**, utilizando autenticação baseada em tokens JWT, tratamento de erros e recursos voltados à produtividade de equipes comerciais.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| **Next.js (App Router)** | Framework React para construção da aplicação e gerenciamento de rotas. |
| **React** | Construção de interfaces por componentes. |
| **TypeScript** | Tipagem estática e maior segurança no desenvolvimento. |
| **Tailwind CSS** | Estilização responsiva e padronização visual. |
| **Context API** | Gerenciamento global de autenticação e notificações. |
| **Fetch API** | Comunicação HTTP com o backend RESTful. |

## ✨ Funcionalidades

### 🔐 Autenticação e segurança

- Sistema de login integrado à API REST.
- Autenticação baseada em tokens JWT.
- Armazenamento do token de acesso no `localStorage`.
- Tratamento automático de respostas HTTP `401 Unauthorized`, com redirecionamento para a página de login.

### 📊 Dashboard dinâmico

- Visualização de indicadores comerciais.
- Acompanhamento da quantidade de clientes cadastrados.
- Monitoramento de oportunidades em aberto.
- Exibição do valor total das oportunidades.

### 👥 Gestão de clientes

- Listagem da carteira de clientes.
- Pesquisa por nome ou e-mail.
- Cadastro e edição por meio de modais.
- Exclusão com confirmação antes da operação.
- Exportação de dados para CSV, com compatibilidade com o Excel.

### 📈 Pipeline de vendas (Kanban)

- Organização visual das oportunidades por etapas do funil comercial.
- Acompanhamento do progresso das negociações.
- Atualização do status das oportunidades.
- Visualização dos valores associados às oportunidades.

### 🎨 Experiência do usuário (UX/UI)

- **Skeleton Loaders:** indicadores visuais durante o carregamento dos dados.
- **Toast Notifications:** notificações flutuantes para operações de sucesso, erro e informação.
- **ConfirmModal:** modal de confirmação para operações sensíveis.
- **Error Boundary:** tratamento de erros inesperados por meio da página global `error.tsx`.
- **Página 404 personalizada:** interface própria para rotas inexistentes (`not-found.tsx`).
- **Interface responsiva:** adaptação para diferentes tamanhos de tela.

## 🏗️ Arquitetura do projeto

```text
flowcrm-frontend/
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   ├── opportunities/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ConfirmModal.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── clients.ts
│   │   └── opportunities.ts
│   │
│   └── types/
│       └── index.ts
│
├── public/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior.
- npm ou yarn.
- Backend do FlowCRM em execução.

### 1. Clone o repositório

```bash
git clone <url-do-repositorio-frontend>

cd flowcrm-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Observação:** certifique-se de que a API FastAPI esteja em execução e acessível pelo endereço configurado.

### 4. Execute a aplicação

```bash
npm run dev
```

Acesse a aplicação pelo navegador:

```text
http://localhost:3000
```

## 📦 Build para produção

Para gerar a versão otimizada da aplicação:

```bash
npm run build
```

Após a conclusão do processo, execute:

```bash
npm run start
```

## 🔗 Backend

O FlowCRM utiliza uma arquitetura com repositórios separados para frontend e backend.

- **Frontend:** Next.js, React, TypeScript e Tailwind CSS.
- **Backend:** Python, FastAPI, SQLAlchemy e PostgreSQL.

**Repositório:** `flowcrm-backend`

## 👨‍💻 Autor

**Rhuan Silva de Oliveira**

Desenvolvedor Full Stack em formação | Análise e Desenvolvimento de Sistemas.