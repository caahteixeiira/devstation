# Certificações e imagens no Supabase Storage

## Arquitetura e arquivos

A API mantém `routes → controller → service → repository`, respostas `{ data }`,
Zod e o `requireAdmin` existente. O Web mantém a sessão JWT HttpOnly em `/admin`.
Os uploads passam por um Route Handler do Next que encaminha o JWT **no servidor**;
o navegador não recebe JWT nem chave administrativa do Supabase.

- `apps/api/src/config/storage.ts`: configuração e limite de 5 MiB.
- `apps/api/src/lib/supabase.ts`: cliente REST único, sem SDK adicional.
- `apps/api/src/modules/media/`: validação, upload compartilhado e limpeza persistente.
- `apps/api/src/modules/certifications/`: CRUD, relação com tecnologias e imagem.
- `apps/api/src/modules/projects/project-image.*`: operações sobre `ProjectImage`.
- `apps/api/prisma/schema.prisma`: `Certification`, `StorageCleanup` e metadata em `ProjectImage`.
- `apps/api/prisma/migrations/20261111170000_certifications_storage/migration.sql`: SQL aditivo, sem seeds.
- `apps/api/src/server.ts`: multipart e registro das novas rotas.
- `apps/api/tests/media.test.mjs`: testes isolados com Node Test Runner.
- `apps/web/src/services/certifications.service.ts` e `src/types/certification.ts`: API e validação das respostas.
- `apps/web/src/app/admin/(protected)/certificacoes/`: listagem, cadastro, edição, exclusão, ações e estados.
- `apps/web/src/app/admin/(protected)/media/[...segments]/route.ts`: encaminhamento restrito, sessão e verificação de origem.
- `apps/web/src/components/admin/ImageUpload.tsx`, `ImageManager.tsx`, `StorageCleanupButton.tsx`, `prepare-image.ts`: UI reutilizável.
- As páginas públicas, a Home, os componentes de certificação e os formulários de projeto foram conectados aos novos serviços.
- Os exemplos de ambiente, a navegação **administrativa**, o README Web e `next.config.ts` foram atualizados.
- `package.json` da API e o lockfile acrescentam `@fastify/multipart` e `sharp`.

A fonte local `src/config/certifications.ts` foi removida. Não há dados fictícios
nem importação automática de certificados. O modal público continua sendo reutilizado.

## Modelos e compatibilidade

`Certification` contém título, instituição, emissão/validade, ID/URL oficial,
alt, path, MIME, tamanho, dimensões, destaque, ordem e timestamps. Competências
usam a relação N:N com `Technology`, sem outra tabela de skills.

`ProjectImage` é a entidade existente. Recebe `imagePath`, `contentType`,
`sizeBytes`, `width` e `height`; `imageUrl` passa a nullable. Os registros antigos
mantêm suas URLs e alt/ordem. Novos uploads salvam apenas o path e metadata; a
API calcula a URL pública sem duplicá-la no banco. Pastas usam IDs estáveis:

```text
portfolio/certifications/<id>/<uuid>.webp
portfolio/projects/<id>/<uuid>.webp
```

Salvar os campos editoriais do projeto não reenvia nem apaga a coleção de imagens.
Os endpoints legados de projeto continuam aceitando referências antigas; nunca
permitem inserir um `imagePath` gerenciado arbitrário.

## Variáveis

Cadastre **apenas no Render / API**:

| Variável | Conteúdo |
| --- | --- |
| `SUPABASE_URL` | Origem HTTPS do projeto, sem `/storage/...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave privada `service_role` do projeto |
| `SUPABASE_STORAGE_BUCKET` | `portfolio` |

Mantenha `DATABASE_URL`, `JWT_SECRET`, CORS e demais configurações existentes.
Não coloque a service role no Web, em `NEXT_PUBLIC_*`, no banco, no Git ou em logs.

Cadastre **na Vercel / Web**, além do `API_BASE_URL` existente:

```text
SUPABASE_STORAGE_PUBLIC_URL=https://SEU_PROJETO.supabase.co/storage/v1/object/public/portfolio/
```

Esse endereço é público e termina com `/`. É usado na configuração de `next/image`
para permitir somente o host e o caminho desse bucket, sem wildcard de domínio
nem query string. Configurá-lo exige um novo build do Web; não há chave nele.

## Bucket (configuração manual)

1. No projeto Supabase correto, abra Storage e crie o bucket `portfolio`.
2. Configure-o como **público**: os certificados e imagens do portfólio têm URLs públicas.
3. Defina limite de arquivo de `5242880` bytes (5 MiB).
4. Restrinja MIME a `image/webp`. A API aceita JPEG/PNG/WebP e converte todos para WebP.
   Se o bucket já contém imagens JPEG/PNG legítimas, mantenha esses tipos permitidos também.
5. Não crie policies de escrita para `anon` ou acesso público. As operações de escrita
   passam pela API autenticada; a service role fica exclusivamente no backend.
6. Preserve os objetos existentes; não renomeie bucket nem pastas depois de cadastrar paths.

Bucket público permite leitura, mas não torna uploads/exclusões públicos.
A service role contorna RLS e exige proteção no servidor.
Fontes: [criação e limites](https://supabase.com/docs/guides/storage/buckets/creating-buckets),
[acesso público](https://supabase.com/docs/guides/storage/buckets/fundamentals),
[controle de acesso](https://supabase.com/docs/guides/storage/security/access-control).

## Migration: revisão e aplicação posterior

A migration foi **gerada sem conectar ao banco**, comparando o schema anterior
ao novo. Nenhuma migration foi aplicada durante a implementação.

1. Revise o SQL e faça backup do banco de destino.
2. Teste primeiro em um banco separado de desenvolvimento/homologação, com as
   mesmas migrations já aplicadas que produção e a configuração TLS exigida pela API.
3. Confira cuidadosamente o destino de `DATABASE_URL` no ambiente escolhido,
   sem imprimir senha ou URL completa nos logs.
4. Execute manualmente nesse ambiente:

```bash
pnpm --filter api exec prisma migrate status --config prisma7.config.ts
pnpm --filter api migrate:deploy
pnpm --filter api prisma:generate
```

`migrate:deploy` aplica **todas** as migrations pendentes. Se `status` mostrar
divergência, pare e reconcilie o histórico antes de continuar. Não use `db push`,
`migrate reset` nem seed em produção. A migration deve preceder o código novo.
O schema novo mantém os campos de imagens usados pelo código anterior.

Depois de validar em homologação, repita a revisão/backup e o comando de deploy
na produção, manualmente. A implementação não muda deploy/start nem executa release.

## Rotas

Públicas:

| Método | Rota | Resultado |
| --- | --- | --- |
| GET | `/certifications` | Coleção; `[]` é sucesso |
| GET | `/certifications/:id` | Certificação ou 404 |

Administrativas, todas com o `requireAdmin` existente:

| Método | Rota | Operação |
| --- | --- | --- |
| GET | `/admin/certifications` | Inclui exclusões pendentes |
| GET | `/admin/certifications/:id` | Detalhe administrativo |
| POST | `/certifications` | Cadastro |
| PATCH | `/certifications/:id` | Edição de dados e tecnologias |
| DELETE | `/certifications/:id` | Exclusão com tratamento do Storage |
| POST | `/certifications/:id/image` | Upload/substituição |
| DELETE | `/certifications/:id/image` | Remover somente a imagem |
| POST | `/projects/:slug/images` | Adicionar imagem |
| POST | `/projects/:slug/images/:imageId` | Substituir imagem |
| PATCH | `/projects/:slug/images/:imageId` | Alterar alt/ordem |
| DELETE | `/projects/:slug/images/:imageId` | Excluir somente essa imagem |
| POST | `/storage/cleanup` | Processar um lote de até três limpezas pendentes |

Upload usa multipart, com um arquivo `file`, `altText` obrigatório (2–500 caracteres)
e `order` opcional. Não aceita bucket, path nem URL de destino enviados pelo cliente.
Arquivos são mantidos apenas em memória, com limite, sem filesystem/base64 no banco.

No Web, as mutações de mídia usam `/admin/media/...`, com caminhos permitidos
explicitamente, verificação de `Origin` e JWT encaminhado somente no servidor.
O CRUD usa Server Actions, como os demais conteúdos do Admin.

## Segurança e limites

A API valida tamanho, MIME, extensão, nome, formato decodificado e integridade.
Rejeita animações, imagens acima de 25 milhões de pixels e formatos não permitidos.
Reprocessa para WebP, remove metadata e limita dimensões a 4096 px, mantendo proporção.
O nome original não participa do path; arquivos novos usam UUID e não sobrescrevem objetos.

O Next não tem permissão administrativa no Supabase e não grava arquivos.
A [Vercel limita o payload de funções a 4,5 MB](https://vercel.com/docs/functions/limitations).
Por isso, a UI aceita entrada de até 5 MiB, mas prepara arquivos acima de 4 MiB
em WebP no navegador para que o multipart caiba no encaminhamento seguro. Se não
for possível reduzir, mostra erro e solicita uma imagem menor; a API continua
validando tudo independentemente. Isso pode reduzir resolução/qualidade de entradas grandes.

## Consistência e recuperação

Banco e Storage não têm transação distribuída. A estratégia mantém referências
válidas e registra tarefas duráveis de compensação em `StorageCleanup`:

- **Upload:** cria uma reserva antes de enviar bytes. Só associa o novo path após
  o Storage confirmar o upload. A associação e a remoção da reserva são uma única
  transação. Falha/timeout deixa a reserva para uma limpeza posterior, mesmo se
  o Storage tiver aceitado bytes antes de interromper a resposta.
- **Substituição:** grava a referência nova e enfileira a antiga na mesma transação.
  Só depois tenta excluir o objeto antigo. Falha de limpeza retorna `warning` para
  o Admin e incrementa tentativas, sem desfazer uma imagem nova já persistida.
- **Remoção de imagem:** retira a referência e registra a limpeza atomicamente.
  O site para de referenciar a imagem imediatamente; falhas de exclusão física
  ficam registradas e são informadas. Excluir uma imagem de projeto não exclui o projeto.
- **Exclusão de certificação:** verifica a entidade, marca `deleting`, desassocia
  o path e registra a limpeza; remove o objeto e depois o registro. Falha deixa
  uma exclusão pendente, visível no Admin e omitida do site público. A nova tentativa
  é segura mesmo se o Storage já removeu o objeto. Cadastro/edição/upload ficam
  bloqueados enquanto a exclusão está pendente.
- **Exclusão completa de projeto:** enfileira os paths e remove o projeto numa
  transação, antes de processar o Storage. Assim o cascade existente não perde
  os paths necessários à limpeza. Falhas ficam na fila e nos logs.

Locks de linha serializam mutações sobre a mesma entidade e sobre as reservas.
Antes de excluir um objeto, o processador verifica se ainda está referenciado.
Reservas de upload interrompido aguardam uma hora para evitar remover um upload
em andamento. Erros são registrados por ID/path, sem credenciais ou erros privados
do provedor. A fila não tem worker/cron nesta entrega: use **Tentar limpeza de
arquivos pendentes** na listagem de Certificações ou no gerenciador de imagens.
Repita até não haver tarefas vencidas; os contadores mostram as pendências.

## Uso e testes locais

Use um projeto/banco/bucket de homologação, não produção. Preencha os `.env`
locais existentes sem sobrescrevê-los. Aplique explicitamente a migration no banco
de teste e configure a URL pública no Web. Inicie os serviços com os comandos atuais.

1. Entre no Admin e abra Certificações → Nova certificação.
2. Salve título, emissor, emissão, campos opcionais, destaque/ordem e tecnologias.
3. Na edição, selecione uma imagem, confira a prévia e o alt e envie.
4. Confira o objeto em `portfolio/certifications/<id>/`, a referência no banco e
   a prévia persistida. Substitua e remova a imagem; confira também a limpeza.
5. Abra Sobre, Home e `/certificacoes`; confira modal, Esc, teclado, temas e mobile.
6. Em Projetos, salve/crie o conteúdo, abra a edição e faça upload pelo gerenciador.
   Salve alt/ordem, substitua e remova uma imagem. Salve o editorial e confirme que
   as imagens permanecem; confira o site público.
7. Teste arquivo inválido, MIME incompatível e >5 MiB. Sem login, as mutações
   devem falhar. Não compartilhe tokens de teste nem os salve no repositório.
8. Simule indisponibilidade do Storage apenas em homologação: confirme erro ou
   aviso e tente novamente a limpeza/exclusão quando o serviço voltar.

Verificações automatizadas (não acessam banco/bucket reais):

```bash
pnpm --filter api exec tsc --noEmit
pnpm --filter api build
pnpm --filter api test:media
pnpm --filter web exec tsc --noEmit
pnpm --filter web lint
pnpm --filter web build
```

O teste usa mock de módulos do Node 24 (recurso experimental do runner), banco
simulado com rollback e um servidor HTTP local para Storage. Cobre arquivos reais
JPEG/PNG/WebP, MIME/extensão/nome inválidos, corrupção, limite multipart, autenticação,
upload/substituição/exclusão, coleção vazia e falhas de Storage/commit. Isso não
substitui validar migrations, concorrência e TLS num PostgreSQL/Supabase de homologação.

## Validação após release manual

Confirme variáveis e bucket, aplicação da migration e logs da API. Faça um fluxo
com um certificado real autorizado, verifique a URL pública, a otimização do Next
e o modal. Teste uma imagem de projeto, sua ordem e remoção. Confira no navegador
que nenhum segredo nem JWT aparece no JavaScript/JSON do upload. Confira também
que o upload direto ao bucket sem credencial administrativa é recusado.

Riscos operacionais: até processar tarefas pendentes, objetos antigos podem ocupar
Storage; interrupções podem exigir nova tentativa. Arquivos são públicos e podem
ter cópias em caches (cache configurado por uma hora). O novo código exige a migration
antes do uso e configuração de Storage para servir/enviar imagens gerenciadas.
Nenhuma operação real de Supabase, migration, commit ou deploy foi executada nesta entrega.

## Commits sugeridos

- `feat(api): persistir certificacoes e uploads no Supabase Storage`
- `feat(web): gerenciar certificacoes e imagens no Admin`
- `feat(web): consumir certificacoes e imagens da API publica`
- `test(api): cobrir uploads autorizacao e compensacao de falhas`
- `docs: documentar storage migration e validacao de producao`

## Inventário de arquivos da entrega

Criados (inclui a área de certificações iniciada na etapa anterior):

```text
apps/api/prisma/migrations/20261111170000_certifications_storage/migration.sql
apps/api/src/config/storage.ts
apps/api/src/lib/supabase.ts
apps/api/src/modules/certifications/certification.controller.ts
apps/api/src/modules/certifications/certification.repository.ts
apps/api/src/modules/certifications/certification.routes.ts
apps/api/src/modules/certifications/certification.schema.ts
apps/api/src/modules/certifications/certification.service.ts
apps/api/src/modules/media/image.validation.ts
apps/api/src/modules/media/media.routes.ts
apps/api/src/modules/media/storage.repository.ts
apps/api/src/modules/media/storage.service.ts
apps/api/src/modules/projects/project-image.controller.ts
apps/api/src/modules/projects/project-image.repository.ts
apps/api/src/modules/projects/project-image.serializer.ts
apps/api/src/modules/projects/project-image.service.ts
apps/api/tests/media.test.mjs
apps/web/src/app/(public)/certificacoes/error.tsx
apps/web/src/app/(public)/certificacoes/loading.tsx
apps/web/src/app/(public)/certificacoes/page.tsx
apps/web/src/app/admin/(protected)/certificacoes/CertificationForm.tsx
apps/web/src/app/admin/(protected)/certificacoes/[id]/editar/page.tsx
apps/web/src/app/admin/(protected)/certificacoes/[id]/excluir/page.tsx
apps/web/src/app/admin/(protected)/certificacoes/actions.ts
apps/web/src/app/admin/(protected)/certificacoes/error.tsx
apps/web/src/app/admin/(protected)/certificacoes/loading.tsx
apps/web/src/app/admin/(protected)/certificacoes/novo/page.tsx
apps/web/src/app/admin/(protected)/certificacoes/page.tsx
apps/web/src/app/admin/(protected)/media/[...segments]/route.ts
apps/web/src/app/features/certifications/CertificatePreview.tsx
apps/web/src/app/features/certifications/CertificationCard.tsx
apps/web/src/app/features/certifications/CertificationGrid.tsx
apps/web/src/app/features/certifications/CertificationGridSkeleton.tsx
apps/web/src/app/features/certifications/CertificationLoadError.tsx
apps/web/src/app/features/certifications/CertificationsSection.tsx
apps/web/src/app/features/certifications/certifications.ts
apps/web/src/app/features/home/FeaturedCertifications.tsx
apps/web/src/components/admin/ImageManager.tsx
apps/web/src/components/admin/ImageUpload.tsx
apps/web/src/components/admin/StorageCleanupButton.tsx
apps/web/src/components/admin/prepare-image.ts
apps/web/src/services/certifications.service.ts
apps/web/src/types/certification.ts
docs/storage.md
```

Alterados:

```text
apps/api/.env.example
apps/api/package.json
apps/api/prisma/schema.prisma
apps/api/src/modules/projects/project.repository.ts
apps/api/src/modules/projects/project.service.ts
apps/api/src/server.ts
apps/web/.env.example
apps/web/README.md
apps/web/next.config.ts
apps/web/src/app/(public)/page.tsx
apps/web/src/app/(public)/sobre/page.tsx
apps/web/src/app/admin/(protected)/projetos/[slug]/editar/actions.ts
apps/web/src/app/admin/(protected)/projetos/[slug]/editar/page.tsx
apps/web/src/app/admin/(protected)/projetos/novo/CreateProjectForm.tsx
apps/web/src/app/admin/(protected)/projetos/novo/actions.ts
apps/web/src/components/admin/admin-navigation.ts
docs/deployment.md
pnpm-lock.yaml
```
