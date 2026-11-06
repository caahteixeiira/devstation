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

## Scripts

- `pnpm dev`: servidor de desenvolvimento.
- `pnpm build` e `pnpm start`: build e servidor de produção.
- `pnpm lint`: ESLint.
- `pnpm exec tsc --noEmit`: verificação de tipos.
