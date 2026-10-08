# Active Community 🏙️🌱

> **MVP Acadêmico** — Aplicativo mobile para registro e acompanhamento colaborativo de problemas urbanos na comunidade.

---

## 📌 1. Visão Geral do Projeto

O **Active Community** é uma solução móvel simples, moderna e funcional criada para que cidadãos e moradores possam registrar e consultar ocorrências urbanas do seu bairro ou cidade, tais como:
- 🕳️ **Buraco:** buracos em ruas e avenidas;
- 🗑️ **Lixo:** descarte irregular ou lixo acumulado;
- 💡 **Iluminação:** postes apagados ou oscilando à noite;
- 🚶 **Calçada:** calçadas danificadas ou intransitáveis;
- 🌳 **Praça:** bancos quebrados, brinquedos danificados;
- 🧱 **Entulho:** restos de obras abandonados em via pública;
- ❓ **Outro:** demais problemas de zeladoria urbana.

O aplicativo segue estritamente a arquitetura desacoplada recomendada para sistemas modernos:
```
React Native (Expo) ──[HTTP REST]──> API Serverless (Vercel) ──[Prisma ORM]──> PostgreSQL
```
> ⚠️ **Atenção:** O aplicativo mobile nunca acessa o banco PostgreSQL diretamente. Toda a comunicação ocorre exclusivamente através da API REST com validação de dados.

---

## 🛠️ 2. Tecnologias Utilizadas

### Aplicativo Mobile
- **React Native** com **Expo** (TypeScript)
- **React Navigation** (Native Stack Navigator)
- **Safe Area Context** & **Expo Vector Icons** (Ionicons)
- **Fetch API** com controle de timeout e tratamento de erros

### Backend & API
- **TypeScript** & **Node.js**
- **Vercel Serverless Functions** (endpoints serverless nativos)
- **Express** (com CORS e middlewares para execução e testes locais)
- **Prisma ORM** (modelagem, migrações tipadas e seed de dados)
- **Jest** & **ts-jest** (preparado para testes automatizados e TDD)

### Banco de Dados
- **PostgreSQL** (com suporte a conexões locais ou serviços em nuvem como Neon, Supabase, Railway, Vercel Postgres)

---

## 📂 3. Estrutura de Pastas

```text
Active-Community-/
├── backend/
│   ├── api/                              # Endpoints para Vercel Serverless Functions
│   │   └── ocorrencias/
│   │       ├── [id].ts                   # GET /api/ocorrencias/:id
│   │       └── index.ts                  # GET /api/ocorrencias & POST /api/ocorrencias
│   ├── prisma/
│   │   ├── schema.prisma                 # Definição do schema e modelo Ocorrencia
│   │   └── seed.ts                       # Script com os 3 registros iniciais de exemplo
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts                 # Singleton do PrismaClient
│   │   ├── controllers/
│   │   │   └── ocorrencia.controller.ts  # Controladores HTTP
│   │   ├── routes/
│   │   │   └── ocorrencia.routes.ts      # Rotas Express
│   │   ├── services/
│   │   │   ├── ocorrencia.service.ts     # Regras de negócio e acesso ao Prisma
│   │   │   └── ocorrencia.service.test.ts # Testes unitários com Jest
│   │   ├── types/
│   │   │   └── ocorrencia.ts             # Interfaces e tipos TypeScript
│   │   ├── app.ts                        # Configuração do Express
│   │   └── server.ts                     # Ponto de entrada do servidor local
│   ├── .env.example                      # Exemplo de variáveis de ambiente
│   ├── jest.config.js                    # Configuração dos testes
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json                       # Configuração de build e rotas na Vercel
│
├── mobile/
│   ├── src/
│   │   ├── components/                   # Componentes reutilizáveis
│   │   │   ├── CategoryPicker.tsx        # Seletor de categorias em chips
│   │   │   ├── EmptyState.tsx            # Estado de lista vazia
│   │   │   ├── ErrorState.tsx            # Estado e botão de retry de erro
│   │   │   ├── LoadingState.tsx          # Indicador de carregamento
│   │   │   ├── OcorrenciaCard.tsx        # Card da ocorrência
│   │   │   └── StatusBadge.tsx           # Badge com cores de cada status
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx          # Configuração de navegação nativa
│   │   ├── screens/                      # As 4 telas principais do MVP
│   │   │   ├── HomeScreen.tsx            # Tela 1: Início com resumo recente
│   │   │   ├── NewOcorrenciaScreen.tsx   # Tela 2: Registro de novo problema
│   │   │   ├── OcorrenciasListScreen.tsx # Tela 3: Lista completa
│   │   │   └── OcorrenciaDetailScreen.tsx # Tela 4: Detalhes com botão voltar
│   │   ├── services/
│   │   │   └── api.ts                    # Integração com a API REST
│   │   ├── theme/
│   │   │   └── colors.ts                 # Paleta de cores oficial do projeto
│   │   ├── types/
│   │   │   ├── navigation.ts             # Tipagem das rotas
│   │   │   └── ocorrencia.ts             # Tipos de dados da ocorrência
│   │   └── utils/
│   │       ├── date.ts                   # Formatação de datas em padrão brasileiro
│   │       └── validation.ts             # Validação de campos obrigatórios
│   ├── .env.example                      # Exemplo de configuração de URL da API
│   ├── App.tsx                           # Ponto de entrada do aplicativo React Native
│   ├── app.json                          # Configuração do Expo
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml                    # PostgreSQL local pronto para uso (opcional)
└── README.md                             # Documentação acadêmica completa
```

---

## 🎯 4. Escopo do MVP (As 4 Telas)

| Tela | Objetivo | Elementos Principais |
|---|---|---|
| **Tela 1 — Início** | Apresentar o aplicativo e oferecer acesso rápido | Nome "Active Community", slogan "Ajude a melhorar sua comunidade.", botão "Registrar problema", botão "Ver ocorrências", atalho de "Acesso ADM" e listagem das ocorrências mais recentes. |
| **Tela 2 — Registrar Problema** | Cadastrar uma nova ocorrência urbana | Formulário com Título, Categoria (Buraco, Lixo, Iluminação, Calçada, Praça, Entulho, Outro), Descrição e Local. Validação de campos obrigatórios e retorno à lista após sucesso. |
| **Tela 3 — Ocorrências** | Listar todos os problemas registrados | Cards contendo Título, Categoria, Local, Status colorido e Data formatada. Suporte a carregamento, tela vazia e pull-to-refresh. |
| **Tela 4 — Detalhes** | Exibir todas as informações de um item | Exibição completa de Título, Categoria, Descrição, Local, Status, Data e controles diretos de alteração de status para administradores logados. |
| **Tela 5 — Login ADM** | Autenticar gestores da comunidade | Formulário seguro com e-mail e senha, validação visual e persistência de sessão JWT. |
| **Tela 6 — Painel ADM** | Gestão centralizada de ocorrências | Visão geral de métricas, filtros por status e botões de ação rápida para alternar entre *Registrado*, *Em Análise* e *Resolvido*. |

### Status das Ocorrências
- `REGISTRADO` (Azul): Estado inicial padrão de toda nova ocorrência reportada pelo cidadão.
- `EM_ANALISE` (Âmbar/Laranja): Ocorrência em análise ou equipe em deslocamento.
- `RESOLVIDO` (Verde): Problema solucionado com confirmação da administração.

### 🔐 Acesso Administrativo Padrão
Para testes locais e demonstrações, o usuário administrador pré-configurado no banco (seed) é:
- **E-mail:** `admin@activecommunity.com`
- **Senha:** `admin123`

---

## 🚀 5. Como Executar Localmente

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **npm** (ou yarn/pnpm)
- **PostgreSQL** instalado e em execução (ou Docker)

---

### Passo 1: Configurar o PostgreSQL

Se você já possui o PostgreSQL rodando em sua máquina, crie a base de dados:
```bash
# Via terminal psql
psql -U postgres -c "CREATE DATABASE active_community_db;"
```

*(Opcional com Docker)*: Caso prefira rodar um PostgreSQL em container:
```bash
docker compose up -d
```

---

### Passo 2: Configurar e Iniciar o Backend

1. Acesse a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo `.env` a partir do modelo:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com a sua string de conexão:
```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/active_community_db?schema=public"
PORT=3001
```

4. Execute as migrations do Prisma:
```bash
npm run prisma:migrate
```

5. Popule o banco com os 3 registros iniciais de exemplo (Seed):
```bash
npm run prisma:seed
```

6. Inicie o servidor local:
```bash
npm run dev
```
O servidor estará ativo em `http://localhost:3001`. Você pode testar os endpoints:
- `GET http://localhost:3001/api/health`
- `GET http://localhost:3001/api/ocorrencias`
- `GET http://localhost:3001/api/ocorrencias/1`

7. *(Opcional)* Rodar testes automatizados:
```bash
npm test
```

---

### Passo 3: Configurar e Iniciar o Aplicativo Mobile

1. Abra outro terminal e acesse a pasta do mobile:
```bash
cd mobile
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```bash
cp .env.example .env
```

Defina a URL da API no arquivo `.env`:
- **No Emulador Android:**
  ```env
  EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
  ```
- **No Dispositivo Físico (Expo Go no mesmo Wi-Fi):**
  ```env
  EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3001
  # Exemplo: EXPO_PUBLIC_API_URL=http://192.168.1.15:3001
  ```
- **No Navegador Web:**
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:3001
  ```
- **Com Backend em Produção (Vercel):**
  ```env
  EXPO_PUBLIC_API_URL=https://seu-projeto.vercel.app
  ```

4. Inicie o Expo:
```bash
npm run start
```

Pressione:
- `a` para abrir no Emulador Android;
- `w` para abrir no Navegador Web;
- Ou escaneie o QR Code no aplicativo **Expo Go** do seu celular Android.

---

## 🌐 6. Deploy do Backend na Vercel

O backend foi especialmente estruturado para **Vercel Serverless Functions**, utilizando endpoints em `backend/api/ocorrencias`.

### Passo a passo para publicação:

1. **Hospedar o PostgreSQL em nuvem:**
   Crie uma base de dados gratuita em plataformas como:
   - [Neon.tech](https://neon.tech) (PostgreSQL Serverless)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

2. **Fazer o deploy na Vercel:**
   - Faça o push do projeto para o GitHub.
   - Acesse o painel da Vercel (`vercel.com`) e clique em **Add New Project**.
   - Selecione o repositório do projeto.
   - Defina o **Root Directory** como `backend`.
   - Adicione a Variável de Ambiente:
     - `DATABASE_URL`: `postgresql://usuario:senha@host/banco?sslmode=require`
   - Clique em **Deploy**.

3. **Executar as migrações no banco de produção:**
   Você pode rodar no terminal local apontando para a base remota:
   ```bash
   DATABASE_URL="sua_url_remota" npx prisma migrate deploy
   DATABASE_URL="sua_url_remota" npm run prisma:seed
   ```

4. **Atualizar a URL no Mobile:**
   No arquivo `mobile/.env`, informe a URL gerada pela Vercel:
   ```env
   EXPO_PUBLIC_API_URL=https://active-community-api.vercel.app
   ```

---

## 🧪 7. Estrutura de Testes Automatizados (35 Testes Implementados)

O projeto conta com suítes de testes automatizados com **Jest** tanto no **Backend** quanto no **Mobile**, totalizando **35 testes** passando com sucesso:

### Testes do Backend (27 testes)
- **Regras de Negócio e Serviços (`ocorrencia.service.test.ts`):**
  - Criação de ocorrências com validações de campos obrigatórios;
  - Atribuição automática do status `REGISTRADO` e data de criação;
  - Listagem com ordenação decrescente por data;
  - Busca unitária por ID com mock do Prisma;
  - Atualização de status (`atualizarStatus`) com validação de enum e tratamento de erro quando não encontrada.
- **Autenticação e Painel Administrativo (`admin.test.ts`):**
  - `POST /api/admin/login`: login com credenciais válidas e retorno de token JWT (200);
  - `POST /api/admin/login`: bloqueio com campos vazios (400) e credenciais inválidas (401);
  - `GET /api/admin/me`: validação de sessão protegida com token Bearer (200 e 401);
  - `PATCH /api/ocorrencias/:id/status`: proteção de rota (bloqueio 401 sem token);
  - `PATCH /api/ocorrencias/:id/status`: alteração de status por administradores autorizados (200).
- **Endpoints da API REST (`app.test.ts` via Supertest):**
  - `GET /api/health`: retorno de integridade e timestamp (200);
  - `GET /api/ocorrencias`: listagem de todas as ocorrências (200);
  - `GET /api/ocorrencias/:id`: busca de ocorrência existente (200);
  - `GET /api/ocorrencias/:id`: validação de ID inválido (400) e não encontrado (404);
  - `POST /api/ocorrencias`: criação com sucesso (201);
  - `POST /api/ocorrencias`: bloqueio de envio com campos vazios (400);
  - Tratamento de erro 500 e rotas inexistentes (404).

**Como executar os testes do backend:**
```bash
cd backend
npm test
```

### Testes do Mobile (8 testes)
- **Validação do Formulário (`validation.test.ts`):**
  - Confirmação de dados válidos para envio;
  - Bloqueio com campos vazios (título, categoria, descrição ou local);
  - Bloqueio com preenchimento contendo apenas espaços em branco;
  - Mensagem de erro obrigatória: *"Preencha todos os campos obrigatórios."*.
- **Formatação de Datas (`date.test.ts`):**
  - Conversão de string ISO para padrão legível brasileiro (`DD/MM/AAAA às HH:mm`);
  - Tratamento resiliente de valores nulos, vazios ou datas inválidas.

**Como executar os testes do mobile:**
```bash
cd mobile
npm test
```

---

## 👥 8. Informações Acadêmicas

- **Projeto:** Active Community
- **Finalidade:** Trabalho de Conclusão / Avaliação Acadêmica de Desenvolvimento Mobile e Web
- **Padrão:** MVP (Minimum Viable Product) focado em usabilidade, estabilidade e simplicidade.
