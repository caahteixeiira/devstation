import { cx } from "@/lib/cx";

type FlowNode = {
  path: string;
  name: string;
  role: string;
};

/** Camadas que uma requisição atravessa. Fatos verificados no repositório. */
const nodes: FlowNode[] = [
  {
    path: "apps/web",
    name: "Next.js",
    role: "Server Components, páginas públicas e painel administrativo. Valida com Zod cada resposta da API antes de renderizar.",
  },
  {
    path: "apps/api",
    name: "Fastify",
    role: "Oito módulos de domínio, validação de entrada, JWT nas rotas administrativas, helmet e cors.",
  },
  {
    path: "apps/api/prisma",
    name: "Prisma",
    role: "Schema com 13 modelos e client tipado como camada de acesso a dados.",
  },
  {
    path: "docker-compose",
    name: "PostgreSQL",
    role: "Banco relacional. Em desenvolvimento roda em container Docker.",
  },
];

/**
 * Fluxo Next.js → Fastify → Prisma → PostgreSQL só com HTML e CSS.
 * As setas são pseudo-elementos: para baixo em coluna, para a direita em linha.
 */
export function ArchitectureFlow({ className }: { className?: string }) {
  return (
    <ol
      className={cx(
        "grid gap-8 lg:grid-cols-4 lg:gap-10",
        className,
      )}
      aria-label="Fluxo de uma requisição"
    >
      {nodes.map((node, index) => (
        <li
          key={node.path}
          className={cx(
            "relative rounded-card border border-border bg-surface p-5 shadow-card",
            index > 0 &&
              "before:absolute before:font-mono before:text-lg before:text-foreground-subtle before:content-['↓'] before:-top-7 before:left-1/2 before:-translate-x-1/2 lg:before:content-['→'] lg:before:top-1/2 lg:before:-left-8 lg:before:translate-x-0 lg:before:-translate-y-1/2",
          )}
        >
          <p className="font-mono text-[11px] text-foreground-subtle">
            {String(index + 1).padStart(2, "0")} · {node.path}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-foreground">
            {node.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            {node.role}
          </p>
        </li>
      ))}
    </ol>
  );
}
