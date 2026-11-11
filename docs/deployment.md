# DevStation

Monorepo pnpm/Turborepo: `apps/web` (Next.js) e `apps/api` (Fastify/PostgreSQL).

## Ambiente

Use Node **24 LTS** (`.nvmrc` e `engines`) e pnpm **11.13.1** (`packageManager`).
Node 24 é a linha já usada no projeto, compatível com as dependências atuais.
Na hospedagem, selecione essa mesma linha e instale com `pnpm install --frozen-lockfile`.
Argon2 tem componente nativo: faça instalação/build no Linux de destino; não copie
`node_modules` do Windows. O workspace já permite os scripts de instalação necessários.
O ambiente Linux precisa de OpenSSL compatível com Prisma e certificados CA;
imagens mínimas, como Debian slim, podem exigir esses pacotes do sistema.

Copie os exemplos para arquivos locais ignorados pelo Git e preencha os valores:

- `.env.example` → `.env`: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, apenas para Docker local.
- `apps/api/.env.example` → `apps/api/.env`: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `CORS_ORIGIN`, `TRUST_PROXY`; `ADMIN_*` somente para seed manual.
- `apps/web/.env.example` → `apps/web/.env.local`: `API_BASE_URL`, somente no servidor.

Não sobrescreva arquivos de ambiente existentes. Para um volume Docker já criado,
preserve as credenciais atuais e faça a URL da API corresponder a elas. As variáveis
`POSTGRES_*` inicializam volumes novos; alterá-las não modifica usuários/senhas do
volume existente. Não é necessário recriar o banco para estes ajustes.

## Desenvolvimento

Ordem: PostgreSQL → schema preparado explicitamente → API/Web.
`docker compose up -d` inicia somente o banco de desenvolvimento. Nunca use esse
Compose como configuração de produção nem exponha a porta do banco na internet.

Antes da primeira execução da API: `pnpm --filter api prisma:generate`.
`pnpm dev` inicia API e Web. Para alterações deliberadas do schema em um banco de
desenvolvimento, há `pnpm --filter api migrate:dev`; esse comando modifica o banco
e não deve apontar para produção.

## Build e produção

`pnpm run build` compila os dois aplicativos. O build da API executa obrigatoriamente
`prisma generate --config prisma7.config.ts` antes de `tsc`. O client continua
ignorado pelo Git; os outputs do Turbo incluem o client para restaurá-lo em cache hits.

Configure as variáveis no serviço correspondente, sem publicar os arquivos `.env`.
`NODE_ENV=production`, um `JWT_SECRET` exclusivo e `CORS_ORIGIN` com a origem final
são necessários para a API. `PORT` aceita inteiros de 1 a 65535, com fallback 3333.
O host continua `0.0.0.0`. Configure `API_BASE_URL` no servidor Web.

Após backup e aprovação do banco de destino, uma etapa de release **separada do build**
deve executar `pnpm --filter api migrate:deploy`. Esse comando usa `migrate deploy`,
aplica migrations existentes e não gera migrations de desenvolvimento. O job precisa
ter a CLI Prisma instalada e acesso à configuração/schema/migrations da API.
Não é executado automaticamente pelo build ou start.

Inicie os dois processos separadamente:

- API: `pnpm --filter api start`.
- Web: `pnpm --filter web start`.

O seed é exclusivamente manual: `pnpm --filter api seed`. Ele cria tecnologias,
o projeto DevStation e o administrador ausente; não restaura toda a base, não troca
a senha de um administrador existente e não deve rodar a cada deploy. Exige client
gerado e `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Não há seed automático.

## Login, proxy e CORS

`POST /auth/login` aceita **10 requisições por IP em 15 minutos**, inclusive tentativas
inválidas, e depois responde **429**, com `Retry-After`. As demais rotas não recebem
esse limite. O armazenamento é em memória por instância e reinicia com o processo;
não há coordenação entre réplicas.

`TRUST_PROXY` é opcional e aceita somente IPs/CIDRs explícitos dos proxies reais.
Por padrão não há confiança em `X-Forwarded-For`; clientes não podem simplesmente
trocar esse header para ganhar outro limite. Configure a lista conforme o provedor
e impeça acesso direto que contorne o proxy. Não habilite confiança irrestrita.

O login atual passa pelo Next: a API normalmente vê o IP de saída do servidor Web,
portanto acessos pelo mesmo servidor compartilham o limite. Isso não é um limite
individual por visitante. Não encaminhamos IP informado pelo navegador como confiável.

`CORS_ORIGIN` permite uma única origem, sem wildcard. Em desenvolvimento, se omitida,
usa `http://localhost:3000`; em produção deve ser fornecida. `credentials` continua
desabilitado. CORS não protege endpoints de clientes fora do navegador. Next chama
a API server-to-server com Bearer; não precisa compartilhar domínio com ela.
O cookie fica no frontend e usa `secure` em produção, que requer HTTPS.

O Turbo declara os nomes das variáveis: build considera `API_BASE_URL`/`NODE_ENV`
no hash e repassa `DATABASE_URL` sem incluí-la no hash, pois geração não depende do
conteúdo do banco. Dev repassa as variáveis de runtime. Nenhum valor secreto é versionado.

## Verificação

```bash
pnpm lint
pnpm --filter web exec tsc --noEmit
pnpm --filter api exec tsc --noEmit
pnpm run build
pnpm --filter api exec prisma validate --config prisma7.config.ts
```

O lint disponível é o da Web. `/health` continua sendo liveness sem consulta ao banco;
readiness de banco fica como evolução futura. Nenhum comando de build/check acima
executa migrations ou seed. A preparação não cria serviços nem realiza deploy.


## Produção atual

Arquitetura:

Vercel
  → Next.js
  → https://devstation-lime.vercel.app

Render
  → Fastify API
  → https://devstation-api.onrender.com

Supabase
  → PostgreSQL
  → Session Pooler

### Frontend

Plataforma: Vercel

Root Directory:
apps/web

Variáveis:

API_BASE_URL=https://devstation-api.onrender.com

### API

Plataforma: Render

Build:
pnpm install --frozen-lockfile && pnpm --filter api build

Start:
pnpm --filter api start

Health Check:
GET /health

Variáveis obrigatórias:

DATABASE_URL
JWT_SECRET
NODE_ENV=production
CORS_ORIGIN=https://devstation-lime.vercel.app

TRUST_PROXY não está configurado atualmente.

### Banco de dados

Plataforma: Supabase PostgreSQL

A aplicação utiliza o Session Pooler.

O Prisma usa o certificado:

apps/api/certs/prod-ca-2021.crt

A conexão TLS é configurada em:

apps/api/src/lib/prisma.ts

A migration inicial aplicada em produção é:

20260827172841_init

### Admin

O usuário Admin é persistido no PostgreSQL.

Scripts administrativos:

pnpm --filter api admin:create
pnpm --filter api admin:reset-password

As variáveis ADMIN_EMAIL e ADMIN_PASSWORD devem ser fornecidas somente no momento da execução dos scripts.

Nunca versionar:

.env
.env.production.local
DATABASE_URL
JWT_SECRET
ADMIN_PASSWORD

### Validação de produção

API:

GET /health

Auth:

POST /auth/login
GET /auth/me

Fluxo:

Vercel
  → Render
  → Supabase


  ## Em caso de problema

Frontend não carrega dados:
- verificar API_BASE_URL no Vercel
- verificar se a API está online no Render
- testar /health

Erro de CORS:
- verificar CORS_ORIGIN no Render

Erro de banco:
- verificar DATABASE_URL
- verificar certificado prod-ca-2021.crt
- testar conexão com Supabase

Erro de login:
- testar /auth/login
- verificar ADMIN_EMAIL
- usar admin:reset-password se necessário