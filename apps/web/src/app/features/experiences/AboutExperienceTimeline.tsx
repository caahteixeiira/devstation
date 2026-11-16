import { TechList } from "@/components/ui/TechList";

// Recorte editorial fornecido pela autora para a página Sobre.
// Não substitui nem modifica os registros de experiência da API ou do Admin.
const currentTechnologies = [
  "Node.js",
  "TypeScript",
  "Fastify",
  "MySQL",
  "Redis",
  "BullMQ",
].map((name, index) => ({ id: index + 1, name }));

export function AboutExperienceTimeline() {
  return (
    <ol className="space-y-6">
      <li className="grid gap-4 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
        <div className="pt-2">
          <p className="font-mono text-sm text-foreground-muted">
            <time dateTime="2024">2024</time> — atual
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-strong">Experiência atual</p>
        </div>

        <article aria-labelledby="ciee-title" className="min-w-0 rounded-[1.75rem] border border-border bg-[var(--card-blush)] p-6 sm:p-8 lg:p-10">
          <h3 id="ciee-title" className="text-3xl sm:text-4xl">CIEE/MG</h3>
          <p className="mt-3 text-lg font-medium text-foreground">Desenvolvimento de Software e Automação</p>
          <p className="mt-5 max-w-3xl leading-8 text-foreground-muted">
            Desenvolvo soluções internas de automação e integrações entre sistemas,
            com processamento assíncrono, envio de e-mails em lote e autenticação.
            Meu trabalho conecta desenvolvimento de software à melhoria de fluxos
            operacionais, reduzindo etapas manuais e tornando os processos mais organizados.
          </p>

          <div className="mt-7 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-strong">Tecnologias no dia a dia</p>
            <TechList technologies={currentTechnologies} label="Tecnologias utilizadas no CIEE/MG" className="mt-3" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-strong">Áreas de atuação</p>
            <ul aria-label="Áreas de atuação no CIEE/MG" className="mt-3 grid gap-x-6 gap-y-2 text-sm leading-6 text-foreground-muted sm:grid-cols-2">
              <li>APIs</li>
              <li>Integrações entre sistemas</li>
              <li>Automação de processos</li>
              <li>Filas e processamento assíncrono</li>
            </ul>
          </div>
        </article>
      </li>

      <li className="grid gap-4 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
        <p className="pt-2 font-mono text-sm text-foreground-muted">
          <time dateTime="2023">2023</time> — <time dateTime="2024">2024</time>
        </p>
        <article aria-labelledby="fhemig-title" className="min-w-0 rounded-[1.75rem] border border-border bg-surface p-6 sm:p-8 lg:p-10">
          <h3 id="fhemig-title" className="text-2xl sm:text-3xl">FHEMIG</h3>
          <p className="mt-3 text-lg text-foreground-muted">Estágio em Tecnologia da Informação</p>
        </article>
      </li>
    </ol>
  );
}
