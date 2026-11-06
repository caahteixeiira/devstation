import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { TechList } from "@/components/ui/TechList";
import { loadSection } from "@/lib/section-data";
import { listExperiences } from "@/services/experiences.service";
import type { Experience } from "@/types/experience";
import { ExperienceEntry } from "./ExperienceEntry";

/** Atual primeiro, depois por início mais recente. */
function sortExperiences(experiences: Experience[]): Experience[] {
  return [...experiences].sort(
    (a, b) =>
      Number(b.current) - Number(a.current) ||
      b.startDate.localeCompare(a.startDate),
  );
}

/** Tecnologias únicas ao longo das experiências, por frequência e depois nome. */
function aggregateTechnologies(experiences: Experience[]) {
  const counts = new Map<string, { id: number; name: string; count: number }>();

  for (const experience of experiences) {
    for (const technology of experience.technologies) {
      const entry = counts.get(technology.name);

      if (entry) {
        entry.count += 1;
      } else {
        counts.set(technology.name, { ...technology, count: 1 });
      }
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ id, name }));
}

/**
 * Timeline de experiências. Falha de API degrada só esta seção, com log;
 * erros inesperados sobem para o boundary da página.
 */
export async function ExperienceTimeline() {
  const result = await loadSection("about", "experiences", listExperiences);

  if (!result.ok) {
    return (
      <Card tone="muted">
        <p role="alert" className="leading-7 text-foreground-muted">
          Não foi possível carregar as experiências. Tente atualizar a página
          em alguns instantes.
        </p>
      </Card>
    );
  }

  if (result.data.length === 0) {
    return (
      <EmptyState
        icon={<UserIcon />}
        title="Nenhuma experiência disponível ainda."
        description="A trajetória profissional aparece aqui assim que for registrada."
      />
    );
  }

  const experiences = sortExperiences(result.data);
  const technologies = aggregateTechnologies(experiences);

  return (
    <>
      {technologies.length > 0 && (
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
            Tecnologias presentes na minha trajetória
          </p>

          <TechList
            technologies={technologies}
            label="Tecnologias presentes na trajetória"
            className="mt-2"
          />
        </div>
      )}

      <ol className="relative space-y-6 before:absolute before:bottom-6 before:left-[5px] before:top-6 before:w-px before:bg-border">
        {experiences.map((experience) => (
          <ExperienceEntry key={experience.id} experience={experience} />
        ))}
      </ol>
    </>
  );
}

export function ExperienceTimelineSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-3 w-56" />
      <Skeleton className="mt-2 h-6 w-2/3" />

      <div className="mt-8 space-y-6 pl-7">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
