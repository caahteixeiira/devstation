# Investigação de `/admin/projetos` — 07/11/2026

## Conclusão

**A ocorrência original com API normal não foi reproduzida nos 90 acessos de Projetos. O sintoma visual reapareceu uma vez com atraso artificial de 2,5 s em `/projects`: shell visível e `main` vazio até o limite de observação de 90 s.** Portanto, não seria correto classificar toda a investigação como “ocorrência não reproduzida”, nem afirmar que existe um bug determinístico de Projetos.

Nessa observação, `/auth/me` terminou em 36,4 ms, `/projects` respondeu 200 e terminou em 2.533,7 ms, e a resposta RSC do Next terminou com HTTP 200 em 2.579,0 ms. O servidor deixou de aguardar a API, mas o navegador não apresentou tabela, loading ou erro. Não houve `pageerror` nessa amostra. [Captura do estado vazio](2026-11-07-admin-projects-slow-api-blank.png).

Há uma limitação material: essa amostra usava observação por preload, e um processo auxiliar de gerenciamento dos testes estava em loop nesse momento. Ele foi encerrado antes das repetições. **Não está demonstrado que o sintoma seja independente da ferramenta/ambiente.** Nas 40 repetições direcionadas posteriores, incluindo 20 sem o preload no Next, todas as tabelas apareceram. Não houve alteração na aplicação.

Classificação: **sintoma observado de forma intermitente em condição artificial; causa não isolada**. A ocorrência original em condições normais permanece **ocorrência não reproduzida**. Não aplicar timeout, cache, retry, mudança de arquitetura ou dependências com base nesse resultado.

## Ambiente e método

- Produção local: `pnpm --filter web start --port 3104`, build existente `wU5l8L8dZVn65zQB2cTqv`; Next 16.2.12, React 19.2.4, Node 24.19.0. Não foi usado `next dev` para medir estas navegações.
- Chrome instalado, headless, 1440 × 1000, sem redução artificial de CPU/rede. Não é um teste de hospedagem remota nem de inicialização fria do sistema operacional.
- API real Fastify em `localhost:3333`, com a base local existente. Nenhum cadastro, alteração ou exclusão de conteúdo. Login real somente para obter sessão de teste em memória.
- Série normal usa diretamente a API real. Falhas usam um proxy temporário em `127.0.0.1:3344`, mantendo o backend em execução. O proxy atrasa, fecha a conexão, devolve 500, interrompe o corpo ou substitui uma resposta por JSON incompatível somente no processo de teste.
- A sessão expirada foi um JWT assinado com expiração passada; `/auth/me` real confirmou 401. O cookie continuava presente no navegador, exercitando expiração no servidor. Tokens, cookies, senhas e parâmetros SQL não foram incluídos nos artefatos.
- Preload temporário registrou HTTP recebido pelo Next e diagnósticos Undici, correlacionados por requisição. Não substituiu `fetch`, cache, autenticação ou componentes. Foi retirado na série final de controle.
- Tempo visual: início da navegação/clique até tabela sem skeleton, login ou erro identificado, com verificação do DOM. Inclui custo da automação e amostragem; não equivale a Web Vitals. Aberturas diretas incluem o documento; cliques incluem RSC. Preparações do dashboard e navegações de apoio ficam fora das amostras.
- A espera de 90 s indica **navegação não concluída dentro da observação**, e não uma navegação concluída em 90 s. Não combinar esse limite censurado com latências normais para obter uma mediana enganosa.
- As séries foram sequenciais. Os servidores originais do usuário em 3000 e 3333 foram preservados.

## Quantidade e tempos normais

**242 ensaios finais de navegador**: 150 normais, 49 cenários de falha/sessão, 3 recuperações manuais e 40 repetições com atraso. Por rota: Projetos 144, Artigos 49 e Tecnologias 49. Esses números não incluem navegações de preparação.

Também houve 38 observações exploratórias descartadas da estatística final. O detector inicial não reconhecia o texto da tela de erro padrão do Next e esperava 90 s apesar de já haver uma tela de erro visível e HTTP 500 concluído. O detector foi corrigido e os ensaios repetidos. Esse falso timeout é diferente da captura com `main` vazio. Três observações iniciais do botão de recuperação também foram substituídas: reconheciam o erro anterior antes da nova resposta. A série válida aguardou explicitamente a tabela após o clique.

Todas as **150 amostras normais** apresentaram tabela, sem `pageerror`, erro de página ou vazio persistente.

| Rota | Modo | Execuções | Mediana | Máximo | Conteúdo final |
|---|---|---:|---:|---:|---|
| `/admin/projetos` | Direto | 30 | 420 ms | 783 ms | Tabela, 6 linhas |
| `/admin/projetos` | Dashboard → link | 30 | 359 ms | 385 ms | Tabela, 6 linhas |
| `/admin/projetos` | Voltar no browser | 30 | 55 ms | 67 ms | Tabela restaurada |
| `/admin/artigos` | Direto | 10 | 174 ms | 474 ms | Tabela |
| `/admin/artigos` | Dashboard → link | 10 | 359 ms | 367 ms | Tabela |
| `/admin/artigos` | Voltar no browser | 10 | 38 ms | 54 ms | Tabela restaurada |
| `/admin/tecnologias` | Direto | 10 | 309 ms | 450 ms | Tabela |
| `/admin/tecnologias` | Dashboard → link | 10 | 357 ms | 361 ms | Tabela |
| `/admin/tecnologias` | Voltar no browser | 10 | 32 ms | 77 ms | Tabela restaurada |

Nas 100 requisições principais normais que chegaram ao Next, houve exatamente **1 `/auth/me` + 1 endpoint da listagem por requisição**, sem duplicação interna: 60 requisições em Projetos, 20 em Artigos e 20 em Tecnologias. HTTP 200 em todas. Os 50 retornos de histórico não fizeram nova requisição principal/API.

Prefetch de links, inclusive detalhes públicos de projetos, é tráfego de outras requisições e foi separado. Requisições marcadas `net::ERR_ABORTED` também aparecem em navegações normais bem-sucedidas; esse sinal isolado não estabelece a causa do vazio.

## Fluxo real

```text
/admin/projetos
  → app/layout.tsx
  → admin/layout.tsx [escopo visual, fonte e bootstrap de tema]
  → admin/(protected)/layout.tsx → requireAdmin()
      ├─ cookie ausente → redirect /admin/login
      └─ cache() por renderização do servidor
          → getAuthenticatedUser(token)
          → GET /auth/me com Bearer
          → response.json() → authMeResponseSchema.safeParse()
          → usuário ADMIN, ou redirect /admin/login
  → projetos/page.tsx → requireAdmin() [mesma Promise memoizada]
  → listProjects()
  → GET /projects [sem Bearer: listagem pública existente]
  → response.json() → projectsResponseSchema.safeParse()
  → tabela com projects.map(), ou EmptyState
```

No backend:

```text
/auth/me → middleware JWT → validação do sub → findUserById()
         → Prisma/PostgreSQL → usuário → JSON

/projects → listProjectsController() → listProjects()
          → findAllProjects() → prisma.project.findMany()
          → projetos + tecnologias, ordenados por createdAt desc → JSON
```

O repository da listagem seleciona campos resumidos e tecnologias. Não carrega decisões, artigos, experimentos e imagens do detalhe. No adapter instalado, essa função executou duas consultas SQL por chamada: projetos e relação de tecnologias. A busca do usuário executou uma consulta.

Arquivos centrais:

- [Layout protegido](../../apps/web/src/app/admin/(protected)/layout.tsx), [página](../../apps/web/src/app/admin/(protected)/projetos/page.tsx), [requireAdmin](../../apps/web/src/lib/auth/require-admin.ts).
- [Cliente HTTP](../../apps/web/src/lib/api/client.ts), [auth service](../../apps/web/src/services/auth.service.ts), [projects service](../../apps/web/src/services/projects.service.ts), [schema da resposta](../../apps/web/src/types/project.ts).
- [Loading](../../apps/web/src/app/admin/(protected)/projetos/loading.tsx), [error boundary](../../apps/web/src/app/admin/(protected)/projetos/error.tsx), [retry manual](../../apps/web/src/components/ui/use-retry.ts).
- [Rotas da API](../../apps/api/src/modules/projects/project.routes.ts), [controller](../../apps/api/src/modules/projects/project.controller.ts), [service](../../apps/api/src/modules/projects/project.service.ts), [repository](../../apps/api/src/modules/projects/project.repository.ts), [Prisma](../../apps/api/src/lib/prisma.ts).

## Espera infinita, validação e tratamento de erros

| Ponto | Implementação e evidência |
|---|---|
| Fetch pendente | Todas as chamadas desse fluxo usam `AbortSignal.timeout(10_000)` já existente. Espera sem cabeçalhos encerrou em aproximadamente 10 s. |
| Corpo que não termina | O mesmo sinal interrompeu a leitura de `response.json()`: cabeçalho 200 + corpo parcial também resultou em erro visível em aproximadamente 10 s. Não houve espera infinita nesse caminho. |
| Promises sem limite | Não foi encontrado outro I/O assíncrono sem limite explícito no fluxo frontend. Cookie, auth e listagem são os awaits relevantes. O sinal não é garantia de prazo absoluto se o processo/event loop estiver bloqueado. |
| Serialização | Auth → listagem é sequencial. Um cenário hipotético com ambas próximas de 10 s pode somar perto de 20 s, mais renderização. Não existe timeout total de 10 s da página. |
| Duplicação | Layout e página chamam `requireAdmin`, mas `cache()` compartilha o resultado na renderização. Instrumentação confirmou apenas uma chamada `/auth/me` por requisição principal normal. |
| `Promise.all` | Não existe na página de Projetos nem nas duas listagens comparadas. Não há grupo de Promises aguardando uma Promise esquecida nesse fluxo. |
| Cache | React `cache()` em auth é memoização da renderização, não cache global permanente da sessão. `fetch` usa `no-store`; o Router Cache/histórico do navegador é uma camada diferente, observada nos retornos sem rede. |
| Redirect | Cookie ausente, usuário inválido/não ADMIN ou auth 401 levam ao login. O login é irmão do layout protegido e não chama `requireAdmin`; não há ciclo de redirects nesse caminho. Sessão expirada terminou no login nas requisições novas. |
| Zod/JSON | JSON e `safeParse` são finitos e síncronos após o corpo completo. Schema de resumo não é recursivo e não possui validação assíncrona. Resposta 200 com schema inválido produziu `ApiError(INVALID_RESPONSE)` e erro visível. Não existe evidência de bloqueio por validação com os dados locais. |
| `ApiError` | Falha/timeout no `fetch` vira `NETWORK`; status não OK vira `HTTP`; JSON ilegível ou schema inválido vira `INVALID_RESPONSE`. Corpo interrompido durante JSON cai em `INVALID_RESPONSE`, embora a causa simulada seja temporal. Nenhuma dessas exceções é transformada em Promise pendente. |
| Auth 401 | `getAuthenticatedUser` retorna `null` e `requireAdmin` redireciona. Outros erros de auth são relançados. |
| Suspense/loading | `loading.tsx` cria a fronteira de carregamento do segmento: título, mensagem `role=status` e skeleton. Não há Suspense manual ou condição que retorne `null` na página. A proteção do layout acontece acima da fronteira da página. |
| Error boundaries | Erro da listagem alcança `projetos/error.tsx` e mostra mensagem/ação. Em acesso direto, erro do layout protegido não é capturado pelo boundary filho; sem boundary administrativo ancestral, aparece a tela padrão do Next. Nos cliques com shell preservado, foi exibido erro local. O padrão se repetiu nas rotas comparadas. |
| Retry/loops | Não há retry automático, polling ou loop assíncrono na listagem. `Tentar novamente` usa `router.refresh()` + `reset()` somente ao clicar. Recuperação após restaurar a API foi validada nas três rotas. Maps de registros/tecnologias são finitos. |
| Banco | `SHOW statement_timeout` retornou `0` no pool da medição; não há limite de consulta configurado explicitamente em `prisma.ts`. Uma consulta bloqueada poderia continuar no backend mesmo após o abort do frontend. Isso é uma possibilidade distinta, não reproduzida: nenhuma consulta ficou pendente nesta investigação. |

**Resultado:** não foi encontrado um caminho de espera de rede indefinida no frontend desses services. Isso não explica nem exclui uma falha na apresentação/aplicação do stream no navegador. O único vazio observado ocorreu depois do término do HTTP, não enquanto o endpoint permanecia pendente.

A separação entre layout e boundary filho é o comportamento documentado do [tratamento de erros do Next](https://nextjs.org/docs/app/getting-started/error-handling). O mecanismo de sinal temporizado é descrito na [documentação do Node](https://nodejs.org/api/globals.html#static-method-abortsignaltimeoutdelay); os testes acima verificaram seu efeito real neste build.

## Falhas controladas e sessão

Projetos recebeu 11 cenários × 3 modos (direto, dashboard, histórico) = 33 ensaios. Artigos e Tecnologias receberam 8 cenários diretos cada = 16. A contagem de chamadas considera a requisição principal, sem prefetch ou preparação. Nos retornos de histórico de Projetos, todos os 11 cenários restauraram a tabela sem nova requisição: **não exercitaram novamente a API defeituosa nem validaram de novo o JWT**.

| Cenário em Projetos | Direto | Dashboard | Chamadas API por requisição nova |
|---|---|---|---:|
| `/projects` +2,5 s | Tabela, 2,63 s | **Main vazio ≥90 s**, HTTP terminou em 2,58 s | 2 |
| `/projects` sem cabeçalhos | Erro, 10,11 s | Erro, 10,19 s | 2 |
| `/projects` conexão fechada | Erro, 327 ms | Erro, 159 ms | 2 |
| `/projects` HTTP 500 | Erro, 326 ms | Erro, 195 ms | 2 |
| API inteira indisponível | Erro padrão, 239 ms | Erro local, 89 ms | 1 |
| JWT expirado, auth 401 real | Login, 217 ms | Login, 366 ms | 1 |
| `/auth/me` +2,5 s | Tabela, 2,76 s | Tabela, 2,61 s | 2 |
| `/auth/me` sem cabeçalhos | Erro padrão, 10,19 s | Erro local, 10,06 s | 1 |
| `/auth/me` HTTP 500 | Erro padrão, 220 ms | Erro local, 76 ms | 1 |
| `/projects` 200 + corpo interrompido | Erro, 10,07 s | Erro, 10,08 s | 2 |
| `/projects` 200 + schema inválido | Erro, 257 ms | Erro, 89 ms | 2 |

Em erro de dados, o HTTP do Next foi 200 porque o stream já tinha começado; o endpoint simulado de dados retornou 500, perdeu conexão ou teve timeout conforme o cenário. Erros de auth em documento direto deram HTTP 500. Sessão expirada em documento direto deu 307 seguido de login 200; no clique houve RSC 200 com redirecionamento aplicado para login. Status HTTP isolado não substitui a inspeção do conteúdo.

As duas rotas de comparação apresentaram os mesmos resultados esperados em dados lentos, timeout, indisponibilidade, 500, corpo parcial, auth 500 e sessão expirada. Não houve vazio nesses ensaios.

Após restaurar a API, `Tentar novamente` apresentou tabela em Projetos (941 ms), Artigos (902 ms) e Tecnologias (893 ms), com duas chamadas API em cada recuperação. Não foi adicionado retry novo.

## Repetição do cenário com vazio

Depois de encerrar o processo auxiliar em loop, foram criados contextos novos para repetir dashboard → listagem com atraso de 2,5 s:

| Rota | Repetições | Com preload / sem preload | Mediana | Máximo | Resultado |
|---|---:|---:|---:|---:|---|
| Projetos | 20 | 10 / 10 | 2.618 ms | 3.334 ms | 20 tabelas |
| Artigos | 10 | 5 / 5 | 2.612 ms | 3.201 ms | 10 tabelas |
| Tecnologias | 10 | 5 / 5 | 2.610 ms | 2.620 ms | 10 tabelas |

Essas repetições também capturaram resumo/hash dos corpos RSC, erros de console e mudanças de DOM. O detector aguardava até 15 s por tabela, em vez de classificar apenas a URL como sucesso. Nenhuma atingiu esse limite. Não há evidência para afirmar que apenas Projetos possua um defeito específico de implementação, apesar de ser a única rota em que o sintoma foi observado.

## Banco e API, separadamente

Foram feitas 20 chamadas medidas por endpoint e 20 execuções por repository, após uma rodada de aquecimento descartada. Os repositories originais foram importados em um processo de teste, com pool separado e a mesma configuração de banco. O observer temporário de `pg` mediu a ida e volta das consultas sem registrar SQL completo ou parâmetros. São medidas do caminho real de consulta, **não** tempo puro do executor PostgreSQL nem decomposição da mesma requisição do processo Fastify.

| Medição isolada | Amostras | Mediana | Máximo |
|---|---:|---:|---:|
| Repository de usuário completo | 20 | 1,27 ms | 1,78 ms |
| SQL de usuário, ida e volta | 20 | 0,85 ms | 1,13 ms |
| Repository de projetos completo | 20 | 2,39 ms | 3,00 ms |
| Soma das duas consultas de projetos, ida e volta | 20 | 1,70 ms | 2,21 ms |
| HTTP completo `/auth/me`, até corpo completo | 20 | 13,39 ms | 15,92 ms |
| HTTP completo `/projects`, até corpo completo | 20 | 16,02 ms | 18,76 ms |

No navegador, as medianas dos endpoints nas requisições normais principais foram: `/auth/me` 6,76 ms (100 chamadas), `/projects` 11,58 ms (60), `/admin/articles` 14,28 ms (20) e `/technologies` 10,02 ms (20). As séries foram executadas em momentos/processos distintos; não subtrair suas medianas para inferir overhead exato.

**Endpoint mais lento por mediana entre as listagens comparadas: `/admin/articles` (14,28 ms).** Na medição HTTP isolada auth versus projetos, `/projects` foi o mais lento (16,02 ms). O maior valor individual normal dos endpoints monitorados foi `/auth/me` (102,50 ms), sem vazio. Nos cenários artificiais, os atrasos/limites foram impostos pelo teste e não representam lentidão do banco.

## Diferenças entre as páginas

- Projetos e Tecnologias: mesmo layout protegido, mesmo padrão `requireAdmin → listagem`, endpoints de leitura públicos (`/projects` e `/technologies`), schema síncrono, tabela/empty, loading e error local.
- Artigos: lê o cookie novamente (sem novo HTTP), chama `/admin/articles` com Bearer e trata também o 401 da listagem com redirect. Isso não cria outra chamada `/auth/me`. O endpoint administrativo inclui rascunhos/arquivados.
- Projetos possui relação de tecnologias, mais células/ações e links para detalhes públicos. Isso aumenta algum trabalho e prefetch de outros destinos, mas não introduz Promise sem limite, loop ou dependência do detalhe para renderizar a listagem. Os cliques normais das três rotas tiveram medianas praticamente iguais, de 357 a 359 ms.

## Causa provável, recomendação e limite da conclusão

Na única nova observação de vazio, o ponto de falha aparente está **entre a entrega do stream RSC e sua apresentação no navegador**, pois API e Next terminaram enquanto o `main` permaneceu vazio. Essa localização é uma inferência dos tempos/DOM; não prova se a origem é Next/React, navegação/prefetch, instrumentação ou pressão do ambiente. A presença do processo auxiliar em loop impede atribuir com segurança um bug à aplicação. A igualdade de código entre Projetos e Tecnologias também não prova ausência de bug.

Não há evidência de consulta presa, endpoint de projetos pendente, auth duplicada ou Zod aguardando indefinidamente. O timeout de 90 s original era da ferramenta; os fetches da aplicação já têm limite de 10 s. Não transformar essa observação em justificativa para cache, mudança de arquitetura ou outro timeout.

**Proposta antes de qualquer correção:** manter o código atual. Se for retomada a investigação, capturar um trace de navegador e o RSC integral da navegação que falhar, com o servidor de produção sem preload e sem processos auxiliares de gerenciamento concorrentes. Só depois de reproduzir nessa condição, montar um caso mínimo do segmento/loading e comparar o comportamento padrão de navegação/prefetch em uma cópia isolada. Qualquer correção deve ser localizada nesse caminho se a falha for confirmada e validada pela mesma bateria. Não há hoje evidência suficiente para propor um patch concreto responsável.

Não foi corrigido nenhum comportamento. Esta investigação parou na evidência e na proposta de diagnóstico, conforme solicitado.

## Artefatos e integridade

- [Medições e eventos correlacionados em JSON](2026-11-07-admin-projects-investigation.json): 242 casos finais, tempos, status, erros, contagem de chamadas, resumos RSC/DOM e medição de banco/API.
- [Captura do vazio com atraso controlado](2026-11-07-admin-projects-slow-api-blank.png).
- Comparação SHA-256 de **363 arquivos preexistentes em `apps`**: nenhum alterado durante a investigação. Backend, frontend, autenticação, cache, services, schemas e dependências preservados.
- Apenas estes três arquivos de documentação/evidência foram adicionados. Servidores e scripts temporários da investigação foram encerrados/removidos; servidores originais preservados.
- Lint, TypeScript e build não foram repetidos: não houve alteração de código. Foi executado o build de produção existente, sem tratar isso como uma nova validação de compilação.
