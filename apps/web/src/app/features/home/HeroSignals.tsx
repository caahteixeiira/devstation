import type { ReactNode } from "react";
import { getHomeProjects, topTechnologies } from "./home-data";

type ManifestLineProps = {
  label: string;
  children: ReactNode;
};

export function ManifestLine({ label, children }: ManifestLineProps) {
  return (
    <div className="space-y-2">
      <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary-strong">{label}</dt>
      <dd className="break-words text-base leading-7 text-foreground">{children}</dd>
    </div>
  );
}

/** Linha "Tecnologias" do painel técnico, derivada das tecnologias dos projetos. */
export async function HeroStack() {
  const projects = await getHomeProjects();

  if (!projects.ok) {
    return null;
  }

  const stack = topTechnologies(projects.data, 6);

  if (stack.length === 0) {
    return null;
  }

  return <ManifestLine label="Tecnologias">{stack.join(" · ")}</ManifestLine>;
}
