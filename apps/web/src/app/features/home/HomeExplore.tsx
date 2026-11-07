import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { cardClassName } from "@/components/ui/Card";
import {
  ArrowRightIcon,
  FileTextIcon,
  BracesIcon,
  FlaskIcon,
  CalendarIcon,
} from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cx } from "@/lib/cx";
import { HomeSection } from "./HomeSection";

type Area = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: "primary" | "accent";
  surface: "neutral" | "lilac" | "blush";
};

const areas: Area[] = [
  {
    href: "/engenharia",
    eyebrow: "Construção técnica",
    title: "Engenharia",
    description:
      "Arquitetura, decisões e estrutura técnica do próprio DevStation.",
    icon: BracesIcon,
    surface: "lilac",
    tone: "primary",
  },
  {
    href: "/artigos",
    eyebrow: "Ideias & aprendizados",
    title: "Artigos",
    description:
      "Anotações sobre decisões técnicas, conceitos estudados e desenvolvimento de software.",
    icon: FileTextIcon,
    surface: "neutral",
    tone: "primary",
  },
  {
    href: "/laboratorio",
    eyebrow: "Experimentação",
    title: "Laboratório",
    description:
      "Experimentos, hipóteses técnicas e resultados.",
    icon: FlaskIcon,
    surface: "blush",
    tone: "accent",
  },
  {
    href: "/roadmap",
    eyebrow: "Próximos passos",
    title: "Planejamento",
    description:
      "Roadmap e evolução do DevStation.",
    icon: CalendarIcon,
    surface: "neutral",
    tone: "primary",
  },
];

const iconToneStyles = {
  primary: "border-primary/30 bg-primary/10 text-primary-strong",
  accent: "border-accent/30 bg-accent/10 text-accent-strong",
};

const eyebrowToneStyles = {
  primary: "text-primary-strong",
  accent: "text-accent-strong",
};

const projectsLinkStyles =
  "inline-flex items-center gap-1 rounded-sm text-sm text-primary-strong transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

export function HomeExplore() {
  return (
    <HomeSection labelledBy="explore-title" tone="surface">
      <SectionHeader
        id="explore-title"
        eyebrow="Explorar"
        title="Explorar o DevStation"
        description="Cada área responde a uma pergunta diferente: como decidi, o que aprendi, o que estou testando e para onde vou."
      />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {areas.map((area) => {
          const Icon = area.icon;

          return (
            <li key={area.href}>
              <Link
                href={area.href}
                data-tone={area.surface}
                className={cardClassName(
                  { interactive: true, padding: "lg" },
                  "explore-card group flex h-full cursor-pointer flex-col",
                )}
              >
                <span
                  className={cx(
                    "explore-icon flex size-11 items-center justify-center",
                    iconToneStyles[area.tone],
                  )}
                >
                  <Icon className="size-4" />
                </span>

                <p
                  className={cx(
                    "explore-eyebrow mt-10 text-[11px] font-bold uppercase tracking-[0.18em]",
                    eyebrowToneStyles[area.tone],
                  )}
                >
                  {area.eyebrow}
                </p>

                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {area.title}
                </h3>

                <p className="mt-2 max-w-md leading-7 text-foreground-muted">
                  {area.description}
                </p>

                <span className="mt-auto flex items-center gap-1 pt-6 font-mono text-xs text-foreground-subtle transition-colors group-hover:text-primary-strong motion-reduce:transition-none">
                  {area.title === "Artigos" ? "Ler artigos" : `Ver ${area.title.toLowerCase()}`}
                  <ArrowRightIcon className="size-3.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/projetos" className={`${projectsLinkStyles} mt-7`}>
        Ver projetos
        <ArrowRightIcon className="size-4" />
      </Link>
    </HomeSection>
  );
}
