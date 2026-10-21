import { PageIntro } from "@/components/layout/PageIntro";

export default function EngenhariaPage() {
  return (
    <PageIntro
      eyebrow="Arquitetura e decisões técnicas"
      title="Engenharia"
      description="Espaço dedicado à arquitetura, decisões técnicas, padrões de projeto, observabilidade e práticas de engenharia de software."
    >
      <section className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
          Visão geral
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Arquitetura do DevStation
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
          O DevStation foi estruturado como um monorepo para reunir aplicações,
          pacotes compartilhados e documentação em um único repositório. A
          organização permite desenvolver cada parte separadamente, mantendo
          configurações e recursos reutilizáveis.
        </p>
        <div className="mt-6 rounded-xl border border-border bg-surface-muted p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-primary-strong">apps/web</p>

            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Implementado
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold">Aplicação web</h3>

          <p className="mt-3 leading-7 text-foreground-muted">
            Interface do DevStation desenvolvida com Next.js, React, TypeScript
            e Tailwind CSS. Atualmente, concentra as páginas, a navegação e os
            componentes visuais do portfólio.
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-surface-muted p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-primary-strong">apps/api</p>

            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Planejado
            </span>
          </div>

          <h3 className="mt-2 text-lg font-semibold">API do DevStation</h3>

          <p className="mt-3 leading-7 text-foreground-muted">
            Aplicação back-end planejada com Fastify e TypeScript. Será
            responsável pelas regras de negócio, validações e comunicação com o
            banco de dados.
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-surface-muted p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-primary-strong">packages/</p>

            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Planejado
            </span>
          </div>

          <h3 className="mt-2 text-lg font-semibold">Pacotes compartilhados</h3>

          <p className="mt-3 leading-7 text-foreground-muted">
            Área planejada para reunir componentes de interface, tipos
            TypeScript e configurações reutilizáveis entre as aplicações do
            monorepo.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-surface-muted p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-primary-strong">docs/</p>

            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Planejado
            </span>
          </div>

          <h3 className="mt-2 text-lg font-semibold">Documentação técnica</h3>

          <p className="mt-3 leading-7 text-foreground-muted">
            Espaço planejado para registrar decisões arquiteturais, diagramas,
            contratos de API e orientações sobre o desenvolvimento do
            DevStation.
          </p>
        </div>
      </section>
      <section className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
          Decisões técnicas
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Como a arquitetura foi definida
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
          Cada escolha técnica do DevStation parte de um problema real, de uma
          responsabilidade bem definida e dos impactos que ela terá na evolução
          do projeto.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              Organização do repositório
            </p>

            <h3 className="mt-2 text-lg font-semibold">Monorepo</h3>

            <p className="mt-3 leading-7 text-foreground-muted">
              Mantém aplicações, pacotes e configurações em um único
              repositório, facilitando o compartilhamento de recursos e a
              execução centralizada das tarefas.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              Organização da aplicação
            </p>

            <h3 className="mt-2 text-lg font-semibold">Modular Monolith</h3>

            <p className="mt-3 leading-7 text-foreground-muted">
              Organiza o back-end em módulos com responsabilidades bem
              definidas, mantendo inicialmente uma única aplicação implantável e
              permitindo sua evolução gradual.
            </p>
          </article>
        </div>
      </section>
      <section className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
              Qualidade
            </p>

            <h2 className="mt-2 text-2xl font-semibold">Qualidade e testes</h2>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
            Planejado
          </span>
        </div>

        <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
          A estratégia de qualidade do DevStation combinará análise estática e
          diferentes níveis de testes. Cada verificação terá uma
          responsabilidade específica, desde pequenas regras isoladas até os
          principais fluxos utilizados pelo usuário.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              Análise estática
            </p>

            <h3 className="mt-2 text-lg font-semibold">Lint</h3>

            <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Implementado
            </span>

            <p className="mt-3 leading-7 text-foreground-muted">
              Verifica padrões de código, identifica possíveis problemas e
              mantém a escrita consistente entre as aplicações.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              Partes isoladas
            </p>

            <h3 className="mt-2 text-lg font-semibold">Testes unitários</h3>
            <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Planejado
            </span>
            <p className="mt-3 leading-7 text-foreground-muted">
              Validam funções, regras de negócio e outros comportamentos
              pequenos sem depender do restante do sistema.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              Partes conectadas
            </p>

            <h3 className="mt-2 text-lg font-semibold">Testes de integração</h3>

            <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Planejado
            </span>
            <p className="mt-3 leading-7 text-foreground-muted">
              Verificam se componentes, serviços, rotas e banco de dados
              funcionam corretamente quando utilizados em conjunto.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              Fluxos do usuário
            </p>

            <h3 className="mt-2 text-lg font-semibold">Testes end-to-end</h3>

            <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
              Planejado
            </span>
            <p className="mt-3 leading-7 text-foreground-muted">
              Simulam no navegador os fluxos mais importantes do DevStation,
              desde a navegação até a conclusão de uma ação.
            </p>
          </article>
        </div>
      </section>
      <section className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
              Observabilidade
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Entendendo o comportamento do sistema
            </h2>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary-strong">
            Planejado
          </span>
        </div>

        <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
          A observabilidade permitirá acompanhar o funcionamento do DevStation,
          investigar falhas e compreender o impacto de cada problema. A
          estratégia começará com logs, métricas e monitoramento de erros,
          evoluindo para rastreamentos quando a API estiver implementada.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              O que aconteceu?
            </p>

            <h3 className="mt-2 text-lg font-semibold">Logs</h3>

            <p className="mt-3 leading-7 text-foreground-muted">
              Registrarão acontecimentos relevantes, requisições recebidas,
              operações concluídas e falhas encontradas durante a execução.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="font-mono text-sm text-primary-strong">
              Qual foi o impacto?
            </p>

            <h3 className="mt-2 text-lg font-semibold">Métricas</h3>

            <p className="mt-3 leading-7 text-foreground-muted">
              Acompanharão valores como quantidade de acessos, tempo de
              resposta, taxa de erros e desempenho das principais operações.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface-muted p-5 sm:col-span-2 lg:col-span-1">
            <p className="font-mono text-sm text-primary-strong">
              Onde ocorreu a falha?
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Monitoramento de erros
            </h3>

            <p className="mt-3 leading-7 text-foreground-muted">
              Permitirá identificar exceções, reunir informações para
              diagnóstico e compreender quais usuários e funcionalidades foram
              afetados.
            </p>
          </article>
        </div>
      </section>
    </PageIntro>
  );
}
