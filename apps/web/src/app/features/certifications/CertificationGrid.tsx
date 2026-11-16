import { EmptyState } from "@/components/ui/EmptyState";
import { BookIcon } from "@/components/ui/icons";
import type { Certification } from "@/types/certification";
import { CertificationCard } from "./CertificationCard";

export function CertificationGrid({ items, compact = false }: { items: readonly Certification[]; compact?: boolean }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BookIcon />}
        title="Nenhuma certificação publicada ainda."
        description="Os certificados aparecerão aqui assim que forem adicionados."
      />
    );
  }

  return (
    <ul className={`grid gap-6 md:grid-cols-2 ${compact ? "lg:grid-cols-3" : ""}`}>
      {items.map((certification) => (
        <li key={certification.id} className="min-w-0">
          <CertificationCard certification={certification} compact={compact} />
        </li>
      ))}
    </ul>
  );
}
