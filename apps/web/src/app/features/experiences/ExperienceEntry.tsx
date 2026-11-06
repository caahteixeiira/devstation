import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CheckIcon } from "@/components/ui/icons";
import { TechList } from "@/components/ui/TechList";
import { cx } from "@/lib/cx";
import { formatMonthYear } from "@/lib/dates";
import type { Experience } from "@/types/experience";

type ExperienceEntryProps = {
  experience: Experience;
};

function formatPeriod(experience: Experience): string {
  const start = formatMonthYear(experience.startDate);

  if (experience.current) {
    return `${start} — Atual`;
  }

  if (experience.endDate) {
    return `${start} — ${formatMonthYear(experience.endDate)}`;
  }

  return `${start} — Término não informado`;
}

function byOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

const blockLabelStyles =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong";

/**
 * Uma experiência na timeline. A atual (campo `current` do contrato) recebe
 * marcador preenchido, card em superfície e badge; as anteriores ficam em
 * tom muted. Blocos vazios são omitidos por inteiro, inclusive o título.
 */
export function ExperienceEntry({ experience }: ExperienceEntryProps) {
  const headingId = `experience-${experience.id}-title`;
  const responsibilities = byOrder(experience.responsibilities);
  const achievements = byOrder(experience.achievements);
  const hasBoth = responsibilities.length > 0 && achievements.length > 0;

  return (
    <li className="relative pl-7">
      <span
        aria-hidden="true"
        className={cx(
          "absolute left-0 top-6 size-3 rounded-full border-2 bg-background",
          experience.current
            ? "border-primary-strong bg-primary-strong"
            : "border-border-strong",
        )}
      />

      <Card
        as="article"
        tone={experience.current ? "surface" : "muted"}
        padding="sm"
        aria-labelledby={headingId}
        className={cx("sm:p-6", experience.current && "border-primary/40")}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs text-foreground-subtle">
            {formatPeriod(experience)}
          </p>

          {experience.current && (
            <Badge tone="primary" dot>
              Atual
            </Badge>
          )}
        </div>

        <h3
          id={headingId}
          className="mt-3 text-xl font-semibold tracking-tight text-foreground"
        >
          {experience.role}
        </h3>

        <p className="mt-1 font-medium text-primary-strong">
          {experience.company}
        </p>

        <p className="mt-4 whitespace-pre-line leading-7 text-foreground-muted">
          {experience.description}
        </p>

        {(responsibilities.length > 0 || achievements.length > 0) && (
          <div className={cx("mt-6 grid gap-6", hasBoth && "lg:grid-cols-2")}>
            {responsibilities.length > 0 && (
              <div>
                <h4 className={blockLabelStyles}>Responsabilidades</h4>

                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-foreground-muted marker:text-primary-strong">
                  {responsibilities.map((item) => (
                    <li key={item.id} className="whitespace-pre-line">
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {achievements.length > 0 && (
              <div>
                <h4 className={blockLabelStyles}>Conquistas</h4>

                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-foreground-muted">
                  {achievements.map((item) => (
                    <li key={item.id} className="flex gap-2">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-success" />
                      <span className="whitespace-pre-line">
                        {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {experience.technologies.length > 0 && (
          <TechList technologies={experience.technologies} className="mt-6" />
        )}
      </Card>
    </li>
  );
}
