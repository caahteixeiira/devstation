# Auditoria de navegação do DevStation — 07/11/2026

**Conclusão**

A demora de vários segundos na primeira abertura é predominantemente de desenvolvimento. Na série final, o primeiro acesso a /admin/artigos levou 11,56 s; o log do Next atribuiu 9,9 s à etapa interna do framework e 1,35 s a application-code. Em uma série exploratória anterior, a mesma abertura fria chegou a 24,47 s, com 21,1 s na etapa interna. Não se deve tratar uma única medida fria como constante.

Em produção local, as medianas de abertura completa ficaram entre 0,40 e 0,50 s. Os cliques internos repetidos ficaram entre 0,34 e 0,37 s e o retorno pelo histórico entre 22 e 33 ms. O problema de vários segundos não se manteve de forma recorrente na série final. Não há evidência para mudar autenticação, cache, Server Components ou arquitetura para resolver a compilação inicial.

Houve, contudo, uma ocorrência exploratória de navegação para /admin/projetos com o conteúdo principal vazio e timeout de 90 s da ferramenta. Não foi uma navegação concluída em 90 s. Ela não se repetiu nas 54 amostras finais de produção; a causa permanece indeterminada. Essa ocorrência precisa ser reproduzida antes de classificar toda espera em produção como normal. [Captura da ocorrência](2026-11-07-admin-projetos-anomalia.png).

**Ambiente e método**

- Windows; Intel Core i5-9400F, 6 processadores lógicos; 16 GB RAM; Node 24.19.0; Next 16.2.12; React 19.2.4.
- Chrome instalado, em modo headless, viewport 1440 × 1000, sem simulação de CPU ou rede. Utilizada a automação já disponível no ambiente; nenhuma dependência foi instalada no projeto.
- API real em localhost:3333: processo tsx executando apps/api/src/server.ts. As consultas usam os repositories Prisma e responderam com dados da base local. Nenhuma API falsa ou resposta mockada foi usada. Dados locais observados: 6 projetos, 1 artigo público, 4 tecnologias e roadmap vazio; há registros de teste preexistentes.
- O servidor do usuário na porta 3000 e a API foram preservados. Para medir a primeira compilação, usei cópias temporárias idênticas do pacote web, com as dependências existentes e .next próprio. Script existente: pnpm --dir .perf-audit-web-final dev --port 3102, equivalente ao pnpm dev do pacote web. Não rodei um segundo turbo dev na raiz porque isso tentaria iniciar também outra API na porta já ocupada.
- Produção: pnpm run build na raiz, concluído com sucesso em 1 min 19 s; depois pnpm --filter web start --port 3103, utilizando o script start existente. O build executou Web e reutilizou o build válido da API pelo cache do Turbo.
- 54 amostras finais por modo, 108 no total. Por rota: 1 abertura de documento em contexto novo, 3 recarregamentos, 1 clique interno inicial, 3 cliques internos repetidos preservando o documento/Router Cache e 1 retorno pelo histórico. As séries finais foram executadas sem outro ensaio de navegador concorrente. As navegações de apoio não entram nas medianas.
- A primeira visita dev é fria para o processo/rota e para .next da cópia; o sistema operacional não foi reiniciado. A primeira visita produção da série final é em contexto novo do navegador, com o processo de produção já aquecido pelas verificações exploratórias. Portanto, esses valores não são um benchmark de inicialização fria do sistema operacional ou de hospedagem.
- Captura local de HTTP e diagnósticos Undici em um preload temporário, observando endpoint, contagem e duração sem registrar cookies, senhas ou corpos de resposta. Observadores temporários no navegador registraram DOM e frames. Nenhuma mudança em fetch, cache, auth, Suspense, componentes ou backend.
- Abertura completa: maior tempo entre o primeiro frame com título esperado e sem skeleton de carregamento e o fim da resposta principal HTML/RSC. Em cliques, o relógio começa no evento de clique do navegador. Prefetch de fundo foi excluído da conclusão visual. Título/shell inicial é uma métrica separada.
- Medianas de repetições usam 3 amostras; primeira e segunda visitas são amostras individuais. Os valores são aproximações locais, não percentis de produção. Pequenas diferenças entre visitas não provam ganho ou regressão de cache.

**Comparação principal**

Auth = mediana de /auth/me em produção, seguida da quantidade por requisição que realmente chega ao servidor. Chamadas API = apenas as chamadas necessárias à página, incluindo auth, excluindo prefetch de outros destinos. Produção = mediana dos 3 recarregamentos.

| Rota | Auth | Chamadas API | Paralelo/serial | 1ª visita dev | 2ª visita dev | Produção | Principal gargalo |
|---|---:|---:|---|---:|---:|---:|---|
| `/admin/artigos` | 12 ms / 1× | 2 | auth → artigos | 11,56 s | 0,72 s | 0,44 s | Primeira compilação; depois custo de renderização |
| `/admin/projetos` | 17 ms / 1× | 2 | auth → projetos | 1,96 s | 0,75 s | 0,50 s | Compilação fria; depois custo de renderização |
| `/admin/experimentos/novo` | 9 ms / 1× | 3 | auth → (projetos ∥ tecnologias) | 2,33 s | 0,73 s | 0,40 s | Compilação fria; consultas já paralelas |
| `/engenharia` | — | 3 | 3 consultas paralelas | 3,24 s | 1,02 s | 0,42 s | Compilação + seções/SSR; detalhe é a API mais longa da rota |
| `/artigos` | — | 1 | 1 consulta | 1,87 s | 0,65 s | 0,41 s | Compilação fria; API curta |
| `/projetos` | — | 2 | listagem → detalhe do destaque | 2,81 s | 1,30 s | 0,41 s | Compilação + duas etapas dependentes |

**Repetição, navegação interna e retorno**

Primeiro/segundo documento em produção não são cliques de SPA. A coluna de clique repetido é a mediana de 3 cliques internos. Retorno é uma amostra por rota; não houve nova requisição da rota ao servidor nesses retornos, nos dois modos.

| Rota | Dev quente, mediana | 1º documento prod | 2º documento prod | Prod quente, mediana | 1º clique dev / prod | Clique repetido dev / prod | Histórico dev / prod |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/admin/artigos` | 0,75 s | 0,29 s | 0,50 s | 0,44 s | 0,30 s / 0,35 s | 0,46 s / 0,35 s | 44 ms / 33 ms |
| `/admin/projetos` | 0,69 s | 0,29 s | 0,55 s | 0,50 s | 0,50 s / 0,10 s | 0,68 s / 0,34 s | 62 ms / 22 ms |
| `/admin/experimentos/novo` | 0,73 s | 0,30 s | 0,41 s | 0,40 s | 0,53 s / 0,35 s | 0,55 s / 0,34 s | 85 ms / 33 ms |
| `/engenharia` | 0,84 s | 0,57 s | 0,58 s | 0,42 s | 1,31 s / 0,42 s | 0,41 s / 0,37 s | 40 ms / 31 ms |
| `/artigos` | 0,64 s | 0,24 s | 0,48 s | 0,41 s | 0,24 s / 0,13 s | 0,51 s / 0,34 s | 35 ms / 27 ms |
| `/projetos` | 0,92 s | 0,59 s | 0,41 s | 0,41 s | 0,74 s / 0,38 s | 0,53 s / 0,35 s | 42 ms / 29 ms |

**Endpoints e quantidade de chamadas**

Medianas das mesmas 3 aberturas completas em cada modo. Uma contagem de 1 significa uma única chamada daquele endpoint por requisição principal da rota.

| Rota | Endpoint | Chamadas por requisição | Dev quente | Produção |
|---|---|---:|---:|---:|
| `/admin/artigos` | `/auth/me` | 1 | 11 ms | 12 ms |
| `/admin/artigos` | `/admin/articles` | 1 | 67 ms | 27 ms |
| `/admin/projetos` | `/auth/me` | 1 | 9 ms | 17 ms |
| `/admin/projetos` | `/projects` | 1 | 34 ms | 30 ms |
| `/admin/experimentos/novo` | `/auth/me` | 1 | 7 ms | 9 ms |
| `/admin/experimentos/novo` | `/technologies` | 1 | 69 ms | 8 ms |
| `/admin/experimentos/novo` | `/projects` | 1 | 58 ms | 12 ms |
| `/engenharia` | `/roadmap` | 1 | 68 ms | 16 ms |
| `/engenharia` | `/articles` | 1 | 81 ms | 25 ms |
| `/engenharia` | `/projects/devstation` | 1 | 120 ms | 80 ms |
| `/artigos` | `/articles` | 1 | 39 ms | 24 ms |
| `/projetos` | `/projects` | 1 | 36 ms | 24 ms |
| `/projetos` | `/projects/api-test-project-3` | 1 | 52 ms | 39 ms |

Em todas as 24 requisições principais das três rotas Admin por modo, /auth/me ocorreu uma vez. Layout e página chamam requireAdmin(), mas compartilham a função memoizada. Ler getSessionToken() novamente em Artigos não faz outra chamada HTTP. Não houve duplicação de endpoint dentro das requisições principais das seis rotas.

**Fluxos reais**

~~~text
/admin/artigos
  layout protegido + página → requireAdmin() compartilhado
  → /auth/me (1×)
  → getSessionToken() [leitura de cookie; sem HTTP]
  → listArticlesForAdmin() → /admin/articles (1×)
  → renderização/stream

/admin/projetos
  layout protegido + página → requireAdmin() compartilhado
  → /auth/me (1×)
  → listProjects() → /projects (1×)
  → renderização/stream

/admin/experimentos/novo
  layout protegido + página → requireAdmin() compartilhado
  → /auth/me (1×)
  → Promise.all([ /projects, /technologies ])
  → renderização do formulário

/engenharia
  connection() → conteúdo estático/shell
  → seções irmãs em Suspense, executadas em paralelo:
      /projects/devstation → decisões técnicas
      /roadmap             → evolução
      /articles            → artigos relacionados
  → cada seção é enviada quando está pronta

/artigos
  Suspense/skeleton → connection()
  → /articles (1×) → ordenação/apresentação → renderização

/projetos
  Suspense/skeleton → connection()
  → /projects (1×) → seleção do destaque
  → listagem e skeleton do destaque podem aparecer
  → /projects/{slug-do-destaque} (1×) → detalhe do destaque
~~~

O slug do destaque observado foi api-test-project-3, selecionado pelos dados e regras já existentes. A segunda consulta depende dessa escolha; não é um par de chamadas independentes colocado em série por engano. Em Novo Experimento e Engenharia, a sobreposição temporal das consultas confirmou o paralelismo, além da leitura do código.

**Espera por dados e renderização**

Os tempos abaixo são medianas das 3 aberturas de documento em produção. API ativa é a união dos intervalos de chamadas à API, evitando somar consultas paralelas. O residual é calculado por amostra antes da mediana; não se devem somar medianas independentes esperando igualdade exata.

| Rota | TTFB no navegador | Título/shell no navegador | HTTP no servidor | API ativa | Residual do servidor | Abertura completa |
|---|---:|---:|---:|---:|---:|---:|
| `/admin/artigos` | 58 ms | 110 ms | 121 ms | 40 ms | 82 ms | 436 ms |
| `/admin/projetos` | 92 ms | 175 ms | 319 ms | 49 ms | 275 ms | 502 ms |
| `/admin/experimentos/novo` | 25 ms | 389 ms | 110 ms | 22 ms | 95 ms | 399 ms |
| `/engenharia` | 19 ms | 99 ms | 88 ms | 80 ms | 29 ms | 421 ms |
| `/artigos` | 43 ms | 86 ms | 141 ms | 26 ms | 114 ms | 414 ms |
| `/projetos` | 23 ms | 93 ms | 258 ms | 82 ms | 102 ms | 406 ms |

O residual contém framework, agendamento, validação/parsing, execução dos componentes, serialização e streaming. Ele não é uma medida isolada de CPU do React. O tempo de hidratação puro também não foi isolado: DOMContentLoaded, fim do HTML e título visível não equivalem a hidratação completa. Foram registrados separadamente no JSON os tempos de documento, pintura/conteúdo e navegação interna. As interações de tema usadas para confirmar prontidão ocorreram fora das amostras de clique.

O log desta versão do Next usa next.js e application-code. Pela implementação instalada, next.js é o intervalo interno do framework antes da etapa da aplicação; inclui compilação quando necessária, além de trabalho de roteamento/framework. application-code inclui espera de API e renderização. Não são um profiler de compilação pura nem um profiler puro de Server Components.

| Primeira rota dev | HTTP relatado pelo Next | next.js | application-code |
|---|---:|---:|---:|
| /admin/artigos | 11,3 s | 9,9 s | 1,35 s |
| /admin/projetos | 1,48 s | 1,03 s | 0,45 s |
| /admin/experimentos/novo | 2,2 s | 1,70 s | 0,51 s |
| /engenharia | 2,7 s | 1,31 s | 1,43 s |
| /artigos | 1,47 s | 1,03 s | 0,45 s |
| /projetos | 2,3 s | 1,27 s | 1,00 s |

A primeira rota também paga a inicialização de partes compartilhadas do Admin. Os valores dependem da ordem de visita; não representam um problema exclusivo de Artigos. A série exploratória mais fria registrou 23,7 s de HTTP em /admin/artigos, dos quais 21,1 s em next.js, reforçando a variabilidade do primeiro acesso.

**API e banco**

Depois das séries de navegação, medi os endpoints diretamente, sem compilação ou outra série de navegador concorrente: uma rodada de aquecimento descartada e 5 amostras por endpoint. A medição inclui recebimento do corpo. Nenhuma consulta apresentou latência persistentemente elevada nesta base local pequena.

| Endpoint | Mediana direta | Máximo observado | Status |
|---|---:|---:|---|
| `/auth/me` | 10 ms | 14 ms | 200 em todas |
| `/admin/articles` | 16 ms | 20 ms | 200 em todas |
| `/projects` | 16 ms | 25 ms | 200 em todas |
| `/technologies` | 15 ms | 24 ms | 200 em todas |
| `/projects/devstation` | 23 ms | 34 ms | 200 em todas |
| `/roadmap` | 9 ms | 15 ms | 200 em todas |
| `/articles` | 17 ms | 22 ms | 200 em todas |
| `/projects/api-test-project-3` | 19 ms | 64 ms | 200 em todas |

Em Engenharia, o detalhe do projeto foi mais longo que as outras consultas na rota (mediana de 80 ms no ensaio de página), mas a mediana direta foi cerca de 23 ms. Isso não demonstra um gargalo persistente de banco. Não foi adicionado profiler SQL; os tempos da API incluem banco, aplicação, rede local e agendamento do processo. Não é possível atribuir cada milissegundo ao PostgreSQL com estes dados.

**Cache, connection e consultas evitáveis**

- no-store está centralizado em apps/web/src/lib/api/client.ts, em apiRequest(). Afeta os serviços que usam apiGet/apiPost/apiPatch/apiDelete. Para as leituras medidas, há busca de dados atualizados quando uma nova requisição é executada no servidor; não foi alterado.
- cache() do React em requireAdmin() deduplicou a validação entre layout e página dentro da mesma requisição. Isso não cria uma sessão de dados reutilizável entre navegações diferentes. Essa distinção corresponde à [documentação do React](https://react.dev/reference/react/cache).
- getEngineeringProject, getEngineeringRoadmap e getEngineeringArticles são memoizados em engineering-data.ts. Há um consumidor de cada um na composição atual de Engenharia; portanto, uma chamada por endpoint foi observada, mas não forcei um segundo consumidor só para testar o cache.
- home-data.ts possui getHomeProjects, getHomeArticles e getHomeExperiences memoizados. A Home não fez parte das seis rotas medidas; não extrapolei resultado de deduplicação para ela.
- loadProject e loadArticle, nas rotas públicas de detalhe, são compartilhados por generateMetadata e página. As provas complementares abaixo confirmaram uma chamada por requisição.
- connection() aparece na Home, Sobre, Roadmap, Laboratório, Engenharia e no conteúdo de Artigos/Projetos. Nas três páginas públicas auditadas, mantém a execução em tempo de requisição. Não acrescenta um endpoint e não foi demonstrado como um atraso independente. Não fiz A/B removendo-o, pois isso alteraria a estratégia solicitada. Consulte a [documentação de connection()](https://nextjs.org/docs/app/api-reference/functions/connection) para o comportamento, sem inferir dela os tempos locais.

- `/projetos/devstation`: HTTP 200; 1 chamada à API (`/projects/devstation`), compartilhada entre metadata e página.
- `/artigos/como-organizei-o-devstation`: HTTP 200; 1 chamada à API (`/articles/como-organizei-o-devstation`), compartilhada entre metadata e página.

O Router Cache do navegador e o cache persistente de dados do servidor são mecanismos distintos. Nos retornos pelo histórico, nenhuma nova requisição principal da rota foi observada; isso não contradiz no-store. Referência: [modelo de caching sem Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components). O projeto não habilita cacheComponents em next.config.ts.

Na janela da série final de produção, incluindo navegações de apoio, houve 597 requisições de prefetch, em grande parte parciais. 34 chamadas à API vieram de prefetch de destinos de detalhe de artigos/projetos. Não são 34 chamadas por visita. Os prefetches das próprias seis rotas principais eram parciais e não adicionaram suas consultas de dados nas amostras inspecionadas; já links para detalhes públicos podem carregar os dados do destino antecipadamente, inclusive a partir de links “Ver no portfólio” do Admin.

Assim, um mesmo detalhe pode ser consultado pela seção de destaque e novamente por outra requisição de prefetch. É repetição entre requisições diferentes, não falha de deduplicação dentro de uma renderização. Pode representar trabalho dispensável quando o destino nunca é visitado, com a contrapartida de acelerar um próximo clique. Não há evidência para desabilitar prefetch globalmente.

**Classificação dos achados**

| Achado | Classificação | Evidência / limite |
|---|---|---|
| Primeira compilação e inicialização do framework | Normal de desenvolvimento | 9,9 s da etapa next.js na abertura fria final de Artigos; 21,1 s na exploratória |
| Uma validação /auth/me por nova requisição Admin | Custo esperado | 9–17 ms de mediana em produção nas rotas; sem duplicação layout/página |
| Leituras novas por no-store | Custo esperado | Uma chamada de cada endpoint necessário por requisição |
| Listagem antes do detalhe do destaque | Custo esperado | O slug depende dos resultados da primeira consulta |
| Prefetch de detalhes não visitados | Otimizável, condicional | 34 leituras de fundo na janela final; ganho de carga possível, ganho de navegação ainda não demonstrado |
| Residual de servidor/client-side além da API | Otimizável a investigar | Medido como residual, sem atribuição indevida a hidratação ou CPU React |
| Aviso de scroll-behavior: smooth sem data-scroll-behavior | Ajuste pequeno de UX/configuração | Aviso emitido pelo Next em navegações dev; não explica sozinho a espera de vários segundos |
| Uma navegação com main vazio em produção exploratória | Ocorrência real, causa/recorrência não confirmadas | Timeout da ferramenta após 90 s; não reproduziu nas 54 amostras finais; fora das medianas |
| Chamadas duplicadas dentro da mesma requisição / serialização independente desnecessária | Problema real não demonstrado | Não encontradas nas seis rotas |

**Recomendações, sem implementação**

1. **Separar avaliação de UX de compilação dev.** Problema: interpretar a primeira compilação como lentidão da aplicação entregue. Evidência: 11,56 s no primeiro dev contra 0,44 s de mediana local em produção em Artigos. Solução: validar percepção com build + start, manter o processo dev aquecido e não apagar .next rotineiramente. Impacto: alto na interpretação e no fluxo local; não muda a experiência de um site já implantado. Risco: mínimo. Complexidade: baixa. Arquivos afetados: nenhum.
2. **Tentar reproduzir a navegação com conteúdo vazio antes de qualquer correção.** Problema: uma ocorrência exploratória muito diferente dos tempos normais. Evidência: captura e timeout, sem repetição na série final. Solução: um teste focado com cliques consecutivos em Dashboard/Projetos, capturando RSC, console e cancelamentos de requests. Não atribuir a /auth/me ou ao banco sem uma cadeia de eventos. Impacto: potencialmente alto se representar o problema percebido pelo usuário; ainda incerto. Risco: mínimo para diagnóstico. Complexidade: média. Arquivos afetados agora: nenhum; futuros pontos de investigação seriam AdminShell.tsx, AdminSidebar.tsx, layout protegido e projetos/page.tsx, além do roteamento do Next, sem mudanças presumidas.
3. **Avaliar prefetch seletivo somente se a carga de API justificar.** Problema: detalhes antecipados podem nunca ser usados. Evidência: 34 chamadas de API de fundo na janela final, com as principais consultas já deduplicadas. Solução candidata: testar desativação ou carregamento por intenção apenas nos links específicos de detalhe em listagens, mantendo o restante. Impacto esperado: reduzir leituras desnecessárias; redução do tempo da página atual não comprovada. Risco: baixo a moderado, pois o próximo clique pode ficar mais lento. Complexidade: baixa a média. Arquivos candidatos: Artigos e Projetos do Admin; ArticleListItem.tsx, ProjectCard.tsx e FeaturedProjectCard.tsx. Não mexer no no-store, em auth nem criar cache global para isso.
4. **Se houver queixa também em produção, perfilar o residual antes de mudar a arquitetura.** Problema: a API não explica todo o tempo até a pintura completa. Evidência: tabela de residual e navegação interna em torno de 0,34–0,37 s. Solução: uma sessão dirigida de profiler/trace de React e navegador, distinguindo agendamento, render, streaming e hidratação. Impacto: desconhecido até a medição; não prometer cortar todo o residual. Risco: baixo se for só diagnóstico. Complexidade: média. Arquivos candidatos para instrumentação temporária, se aprovada: layout protegido, páginas medidas e lib/api/client.ts; nenhum precisa de alteração funcional nesta fase.
5. **Corrigir o aviso de rolagem em uma tarefa pequena de UX, se aprovado.** Problema: html usa scroll-behavior: smooth sem sinalização esperada pelo Next. Evidência: aviso no console dev. Solução candidata: sinalizar data-scroll-behavior no layout raiz ou revisar o escopo da rolagem suave. Impacto: consistência de transições/rolagem; nenhum ganho de dados medido. Risco: baixo, mas envolve aparência/comportamento de scroll. Complexidade: baixa. Arquivos: app/layout.tsx e, conforme a decisão, globals.css. Não é prioridade de arquitetura/performance.

Não recomendo mudar no-store, remover /auth/me, trocar Server Components, alterar Suspense, criar endpoints novos ou adicionar caching persistente com base nestes resultados.

**Entrega e limpeza**

- [Medições e amostras em JSON](2026-11-07-navigation-measurements.json), sem tokens, senhas, cookies ou corpos de resposta da API.
- As duas cópias de trabalho foram removidas; seus links de dependências foram desvinculados sem tocar em node_modules original.
- Os previews de auditoria foram encerrados; o servidor original em 3000 e a API em 3333 foram preservados.
- O next-env.d.ts gerado pelo build foi restaurado exatamente ao estado anterior.
- 363 arquivos de apps tiveram hashes comparados antes/depois: 0 alterações. As mudanças funcionais e visuais anteriores do workspace foram preservadas.
- Nenhuma instrumentação permanece nos fontes. Os scripts temporários de instrumentação e automação foram removidos após a gravação deste relatório; ficam apenas as evidências de medição e a documentação.
- Nenhuma recomendação foi implementada. Aguardando aprovação para eventual próxima etapa.
