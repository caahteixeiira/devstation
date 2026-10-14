import { ApiError } from "@/lib/api/client";
import { listExperiences } from "@/services/experiences.service";
import type { Experience } from "@/types/experience";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatPeriod(experience: Experience) {
  const start = formatDate(experience.startDate);

  if (experience.current) {
    return `${start} — Atual`;
  }

  if (experience.endDate) {
    return `${start} — ${formatDate(experience.endDate)}`;
  }

  return `${start} — Término não informado`;
}

export async function ExperiencesSection() {
  let experiences: Experience[];

  try {
    experiences = await listExperiences();
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    console.error("Failed to load experiences.", error);

    return (
      <p role="alert" className="mt-6 text-foreground-muted">
        Não foi possível carregar as experiências. Tente atualizar a página em
        alguns instantes.
      </p>
    );
  }

  if (experiences.length === 0) {
    return (
      <p className="mt-6 text-foreground-muted">
        Nenhuma experiência disponível no momento.
      </p>
    );
  }

  return (
    <ol className="mt-8 space-y-8 border-l border-border pl-6">
      {experiences.map((experience) => (
        <li key={experience.id}>
          <article>
            <h3 className="text-xl font-semibold text-foreground">
              {experience.role}
            </h3>

            <p className="mt-1 font-medium text-primary-strong">
              {experience.company}
            </p>

            <p className="mt-2 text-sm text-foreground-muted">
              {formatPeriod(experience)}
            </p>

            <p className="mt-4 whitespace-pre-line leading-7 text-foreground-muted">
              {experience.description}
            </p>

            {experience.responsibilities.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-foreground">
                  Responsabilidades
                </h4>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground-muted">
                  {experience.responsibilities.map((item) => (
                    <li key={item.id} className="whitespace-pre-line leading-7">
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {experience.achievements.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-foreground">Conquistas</h4>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground-muted">
                  {experience.achievements.map((item) => (
                    <li key={item.id} className="whitespace-pre-line leading-7">
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {experience.technologies.length > 0 && (
              <ul
                aria-label="Tecnologias utilizadas"
                className="mt-6 flex flex-wrap gap-2"
              >
                {experience.technologies.map((technology) => (
                  <li
                    key={technology.id}
                    className="rounded-lg border border-border px-3 py-1 text-sm"
                  >
                    {technology.name}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}
