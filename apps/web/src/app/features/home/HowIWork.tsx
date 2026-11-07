import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { HomeSection } from "./HomeSection";

type Practice = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

/**
 * Conteúdo editorial: cada afirmação tem origem nas páginas Sobre e
 * Engenharia. Nada aqui descreve métrica, experiência ou prática que o
 * DevStation não registre.
 */
const practices: Practice[] = [
  {
    title: "Backend e APIs",
    description:
      "Serviços, contratos, integrações e regras de aplicação. No DevStation, as respostas da API são validadas antes de chegar à tela.",
    href: "/engenharia",
    linkLabel: "Conhecer minha engenharia",
  },
  {
    title: "Arquitetura e decisões técnicas",
    description:
      "Antes de adotar uma tecnologia, entendo qual problema ela resolve e qual será sua responsabilidade. As decisões ficam registradas com contexto e consequências.",
    href: "/engenharia#decisions-title",
    linkLabel: "Ver decisões técnicas",
  },
  {
    title: "Automação e confiabilidade",
    description:
      "Entender processos, identificar o que gera trabalho manual e transformar isso em software. Falhas são tratadas para afetar só a parte que depende delas.",
    href: "/sobre",
    linkLabel: "Ver minha trajetória",
  },
  {
    title: "Evolução contínua",
    description:
      "Estudo um conceito, aplico onde consigo enxergar o problema e registro o que aprendi em experimentos, artigos e no planejamento do próprio DevStation.",
    href: "/laboratorio",
    linkLabel: "Ver experimentos",
  },
];

const itemLinkStyles =
  "mt-3 inline-flex items-center gap-1 rounded-sm font-mono text-xs text-foreground-subtle transition-colors hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

export function HowIWork() {
  return (
    <HomeSection labelledBy="how-i-work-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-strong">
            Engenharia na prática
          </p>

          <h2
            id="how-i-work-title"
            className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Como eu trabalho
          </h2>

          <p className="mt-4 max-w-md leading-7 text-foreground-muted">
            Quatro frentes que se repetem no que construo, no que estudo e no
            que registro aqui. O DevStation é o lugar onde elas aparecem
            aplicadas.
          </p>

          <ButtonLink
            href="/engenharia"
            variant="secondary"
            className="public-button public-button-outline mt-6"
          >
            Conhecer minha engenharia
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </div>

        <ol className="practice-list divide-y divide-border border border-border">
          {practices.map((practice, index) => (
            <li
              key={practice.title}
              className="grid gap-3 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="editorial-number"
              >
                {String(index + 1).padStart(2, "0")}.
              </span>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {practice.title}
                </h3>

                <p className="mt-2 max-w-xl leading-7 text-foreground-muted">
                  {practice.description}
                </p>

                <Link href={practice.href} className={itemLinkStyles}>
                  {practice.linkLabel}
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </HomeSection>
  );
}
