import { PageIntro } from "@/components/layout/PageIntro";

export default function SistemaDeChamadosPage() {
  return (
    <PageIntro
      eyebrow="Estudo de caso"
      title="Sistema de Chamados"
      description="Aplicação desenvolvida para centralizar, distribuir e acompanhar chamados internos."
    >
      <div className="mt-2 grid gap-6 md:grid-cols-2">
        <article className="mt-8 rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <h2 className="text-xl font-semibold">O problema</h2>

          <p className="mt-4 leading-7 text-foreground-muted">
            Os chamados eram recebidos por diferentes canais, dificultando a
            definição de responsáveis, o acompanhamento das solicitações e a
            distribuição equilibrada do trabalho.
          </p>
        </article>

        <article className="mt-8 rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <h2 className="text-xl font-semibold">A solução</h2>

          <p className="mt-4 leading-7 text-foreground-muted">
            Foi desenvolvida uma aplicação para centralizar os chamados e
            atribuí-los automaticamente ao responsável com menor quantidade de
            solicitações em aberto.
          </p>
        </article>
      </div>
      <div className="mt-12 grid items-start gap-6 xl:grid-cols-2">
        <section className="mt-12 rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <div className="max-w-3xl">
            <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
              Recursos
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Principais funcionalidades
            </h2>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {[
              "Cadastro, visualização, edição e exclusão de chamados.",
              "Classificação por prioridade e status.",
              "Definição manual do responsável pelo chamado.",
              "Atribuição automática baseada na carga de trabalho.",
              "Filtros para facilitar a localização dos chamados.",
              "Acompanhamento das solicitações em aberto.",
            ].map((functionality) => (
              <li
                key={functionality}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 leading-7 text-foreground-muted transition-colors hover:border-primary/60"
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-2 shrink-0 rounded-full bg-primary"
                />

                <span>{functionality}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-12 rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
            Tecnologias
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Tecnologias e responsabilidades
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {[
              {
                name: "PHP e Laravel",
                responsibility:
                  "Responsáveis pelas regras de negócio, validações, persistência dos dados e gerenciamento das rotas da aplicação.",
              },
              {
                name: "Vue.js",
                responsibility:
                  "Utilizado para construir as interfaces e tornar a interação com o sistema mais dinâmica.",
              },
              {
                name: "Inertia.js",
                responsibility:
                  "Realiza a integração entre o back-end Laravel e as páginas Vue sem a necessidade de criar uma API REST separada.",
              },
              {
                name: "SQLite",
                responsibility:
                  "Banco de dados utilizado para armazenar chamados, responsáveis, prioridades e status.",
              },
            ].map((technology) => (
              <article
                key={technology.name}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-mono font-semibold text-primary-strong">
                  {technology.name}
                </h3>

                <p className="mt-3 leading-7 text-foreground-muted">
                  {technology.responsibility}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12 rounded-2xl border border-primary/40 bg-primary/10 p-6">
        <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
          Estrutura
        </p>
        <h2 className="text-2xl font-semibold">Arquitetura da aplicação</h2>

        <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
          O projeto separa as responsabilidades entre interface, controle das
          requisições, regras de negócio e persistência dos dados.
        </p>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              layer: "Interface",
              description:
                "As páginas e os componentes Vue.js recebem as ações realizadas pelo usuário.",
            },
            {
              layer: "Controllers e Requests",
              description:
                "O Laravel recebe as requisições, valida os dados e direciona cada operação.",
            },
            {
              layer: "Actions",
              description:
                "As regras de negócio, como criação e atribuição automática dos chamados, ficam isoladas em classes próprias.",
            },
            {
              layer: "Models e banco de dados",
              description:
                "Os models representam chamados e responsáveis, enquanto o SQLite mantém os dados persistidos.",
            },
          ].map((item, index) => (
            <li
              key={item.layer}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <span className="font-mono text-sm text-primary-strong">
                Etapa {index + 1}
              </span>

              <h3 className="mt-2 text-lg font-semibold">{item.layer}</h3>

              <p className="mt-3 leading-7 text-foreground-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-12 rounded-2xl border border-primary/40 bg-primary/10 p-6">
        <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
          Decisão técnica
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Atribuição automática de chamados
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
          Para distribuir os chamados de forma equilibrada, o sistema identifica
          o responsável com a menor quantidade de solicitações em aberto. São
          considerados em aberto os chamados com status aberto ou em andamento.
        </p>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          {[
            {
              step: "1",
              title: "Calcular a carga",
              description:
                "O sistema contabiliza os chamados em aberto de cada responsável.",
            },
            {
              step: "2",
              title: "Comparar responsáveis",
              description:
                "Os responsáveis são ordenados pela menor quantidade de chamados.",
            },
            {
              step: "3",
              title: "Realizar a atribuição",
              description:
                "O novo chamado é direcionado automaticamente ao primeiro responsável disponível.",
            },
          ].map((decision) => (
            <article
              key={decision.step}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <span className="font-mono text-sm text-primary-strong">
                Passo {decision.step}
              </span>

              <h3 className="mt-2 font-semibold">{decision.title}</h3>

              <p className="mt-3 leading-7 text-foreground-muted">
                {decision.description}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 max-w-3xl leading-7 text-foreground-muted">
          Em caso de empate, o identificador do responsável é utilizado como
          critério de desempate, garantindo um resultado previsível.
        </p>
      </section>
      <section className="mt-12 rounded-2xl border border-primary/40 bg-primary/10 p-6">
        <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
          Qualidade
        </p>

        <h2 className="mt-2 text-2xl font-semibold">Testes e aprendizados</h2>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-xl font-semibold">Testes automatizados</h3>

            <p className="mt-4 max-w-3xl leading-7 text-foreground-muted">
              Foram implementados testes para validar a criação, listagem e
              atualização dos chamados, além dos diferentes cenários da
              atribuição automática.
            </p>

            <p className="mt-4 font-mono text-sm text-primary-strong">
              7 testes • 26 verificações
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-xl font-semibold">Principais aprendizados</h3>

            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Separação das regras de negócio em classes Actions.",
                "Integração entre Laravel, Inertia.js e Vue.js.",
                "Criação de testes para regras com diferentes cenários.",
                "Distribuição de chamados com resultado previsível.",
              ].map((learning) => (
                <li
                  key={learning}
                  className="rounded-xl bg-surface-muted p-4 leading-7 text-foreground-muted"
                >
                  {learning}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </PageIntro>
  );
}
