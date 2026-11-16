import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowUpRightIcon, FileTextIcon } from "@/components/ui/icons";
import { cx } from "@/lib/cx";
import { formatMonthYear } from "@/lib/dates";
import type { Certification } from "@/types/certification";
import { CertificatePreview } from "./CertificatePreview";

export function CertificationCard({ certification, compact = false }: { certification: Certification; compact?: boolean }) {
  const headingId = `certification-${certification.id}-title`;

  return (
    <Card
      as="article"
      padding="none"
      aria-labelledby={headingId}
      className={cx("flex h-full min-w-0 flex-col overflow-hidden", certification.featured && "border-primary/40")}
    >
      {certification.imageUrl ? (
        <CertificatePreview
          title={certification.title}
          imageUrl={certification.imageUrl}
          imageAlt={certification.imageAlt || `Certificado ${certification.title}, emitido por ${certification.issuer}`}
          credentialUrl={certification.credentialUrl ?? undefined}
          compact={compact}
        />
      ) : (
        <div className={cx("flex flex-col items-center justify-center gap-3 border-b border-border bg-surface-muted p-6 text-center text-foreground-muted", compact ? "aspect-[16/10]" : "aspect-[4/3]")}>
          <FileTextIcon className="size-8" />
          <p className="text-sm">Prévia temporária — imagem ainda não adicionada.</p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {certification.featured && (
          <div className="mb-3"><Badge tone="primary">Em destaque</Badge></div>
        )}
        <h3 id={headingId} className="text-xl font-semibold text-foreground [overflow-wrap:anywhere]">
          {certification.title}
        </h3>
        <p className="mt-2 font-medium text-primary-strong">{certification.issuer}</p>

        <dl className="mt-4 space-y-2 text-sm leading-6 text-foreground-muted">
          <div>
            <dt className="inline">Emissão: </dt>
            <dd className="inline"><time dateTime={certification.issueDate}>{formatMonthYear(certification.issueDate)}</time></dd>
          </div>
          {!compact && certification.expirationDate && (
            <div>
              <dt className="inline">Validade: </dt>
              <dd className="inline"><time dateTime={certification.expirationDate}>{formatMonthYear(certification.expirationDate)}</time></dd>
            </div>
          )}
          {!compact && certification.credentialId && (
            <div>
              <dt>ID da credencial</dt>
              <dd className="font-mono text-xs [overflow-wrap:anywhere]">{certification.credentialId}</dd>
            </div>
          )}
        </dl>

        {!!certification.skills?.length && (
          <ul aria-label="Competências relacionadas" className="mt-5 flex flex-wrap gap-2">
            {(compact ? certification.skills.slice(0, 3) : certification.skills).map((skill) => (
              <li key={skill}><Badge>{skill}</Badge></li>
            ))}
          </ul>
        )}

        {certification.credentialUrl && (
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <ButtonLink href={certification.credentialUrl} external>
              Ver credencial oficial<ArrowUpRightIcon className="size-4" />
            </ButtonLink>
          </div>
        )}
      </div>
    </Card>
  );
}
