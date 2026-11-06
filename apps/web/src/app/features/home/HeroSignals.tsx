import type { ReactNode } from "react";
import { getHomeProjects, topTechnologies } from "./home-data";

type ManifestLineProps = {
  label: string;
  children: ReactNode;
};

export function ManifestLine({ label, children }: ManifestLineProps) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
      <dt className="text-primary-strong">{label}</dt>
      <dd className="break-words text-foreground-muted">{children}</dd>
    </div>
  );
}

/** Linha "stack" do painel técnico, derivada das tecnologias dos projetos. */
export async function HeroStack() {
  const projects = await getHomeProjects();

  if (!projects.ok) {
    return null;
  }

  const stack = topTechnologies(projects.data, 6);

  if (stack.length === 0) {
    return null;
  }

  return <ManifestLine label="stack">{stack.join(", ")}</ManifestLine>;
}
