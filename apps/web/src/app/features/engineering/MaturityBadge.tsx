import { Badge, type BadgeTone } from "@/components/ui/Badge";

/**
 * Maturidade de uma parte do sistema. Leitura neutra: ausência não é erro.
 * Só apresentação; não vem da API.
 */
export type Maturity = "implemented" | "partial" | "in-progress" | "planned";

const maturityMeta: Record<Maturity, { label: string; tone: BadgeTone }> = {
  implemented: { label: "Implementado", tone: "success" },
  partial: { label: "Parcial", tone: "primary" },
  "in-progress": { label: "Em andamento", tone: "primary" },
  planned: { label: "Planejado", tone: "neutral" },
};

export function MaturityBadge({ maturity }: { maturity: Maturity }) {
  const meta = maturityMeta[maturity];

  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}
