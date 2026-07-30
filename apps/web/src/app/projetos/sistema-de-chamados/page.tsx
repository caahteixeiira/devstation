import { PageIntro } from "@/components/layout/PageIntro";

export default function SistemaDeChamadosPage() {
  return (
    <PageIntro
      eyebrow="Estudo de caso"
      title="Sistema de Chamados"
      description="Aplicação desenvolvida para centralizar, distribuir e acompanhar chamados internos."
    >
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold">O problema</h2>

          <p className="mt-4 leading-7 text-foreground-muted">
            Os chamados eram recebidos por diferentes canais, dificultando a
            definição de responsáveis, o acompanhamento das solicitações e a
            distribuição equilibrada do trabalho.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold">A solução</h2>

          <p className="mt-4 leading-7 text-foreground-muted">
            Foi desenvolvida uma aplicação para centralizar os chamados e
            atribuí-los automaticamente ao responsável com menor quantidade de
            solicitações em aberto.
          </p>
        </article>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Principais funcionalidades</h2>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
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
              className="rounded-xl border border-border bg-surface p-4 leading-7 text-foreground-muted"
            >
              {functionality}
            </li>
          ))}
        </ul>
      </section>
    </PageIntro>
  );
}
