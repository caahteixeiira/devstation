# DevStation — web

Interface pública e painel administrativo do DevStation, construídos com Next.js (App Router), React, TypeScript e Tailwind CSS.

## Como rodar

```bash
pnpm install
pnpm dev
```

A aplicação sobe em `http://localhost:3000` e consome a API definida em `API_BASE_URL` (arquivo `.env.local`). A API fica em `apps/api`.

## Organização

- `src/app/(public)`: páginas públicas (Início, Projetos, Artigos, Engenharia, Laboratório, Planejamento, Sobre, Contato).
- `src/app/admin`: login e painel administrativo, protegidos por sessão.
- `src/app/features`: componentes e carregadores de dados por área.
- `src/components/ui`: primitivos visuais (Card, Badge, Button, SectionHeader, EmptyState, ErrorState, Skeleton, ícones).
- `src/components/layout`: shell público (sidebar, header mobile, footer, PageIntro).
- `src/services`: chamadas à API, cada resposta validada com schemas Zod de `src/types`.
- `src/config/site.ts`: dados públicos do site (nome, links, slugs de destaque).
- `src/app/globals.css`: design tokens (cores, raios, sombra) nos temas claro e escuro.

## Contato público

Preencha `links.email` (endereço sem `mailto:`) e `links.linkedin` (URL pública
completa) em `src/config/site.ts`. Os valores `null` são placeholders explícitos:
as ações de contato ficam desabilitadas até o preenchimento. O LinkedIn também
aparece automaticamente no footer quando configurado. O GitHub atual é preservado.

## Certificações

A coleção `/certificacoes`, a seção Sobre (até quatro itens) e a Home (até três
destaques) consomem a API real. Lista vazia usa EmptyState, falha real usa ErrorState
e o carregamento usa os skeletons existentes. A fonte local foi removida.

Cadastre em `/admin/certificacoes`; após salvar, envie a imagem na edição. As
competências usam o catálogo de tecnologias. Imagens de projetos são gerenciadas
na edição do projeto, separadamente do conteúdo editorial. O envio passa pelo
servidor Next/API autenticada e persiste no Supabase Storage, sem arquivos em `public/`.

Preencha `SUPABASE_STORAGE_PUBLIC_URL` no ambiente Web com a URL pública do bucket
(sem chaves, com `/` final) para permitir o host/caminho exatos em `next/image`.
O modal público de certificados mantém fechamento por botão/Esc e retorno do foco.
Veja [configuração, migration, rotas, testes e recuperação de falhas](../../docs/storage.md).

## Scripts

- `pnpm dev`: servidor de desenvolvimento.
- `pnpm build` e `pnpm start`: build e servidor de produção.
- `pnpm lint`: ESLint.
- `pnpm exec tsc --noEmit`: verificação de tipos.
