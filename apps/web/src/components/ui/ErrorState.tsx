"use client";

import { Button, ButtonLink } from "./Button";
import { Card } from "./Card";
import { useRetry } from "./use-retry";

type ErrorStateProps = {
  title: string;
  description?: string;
  /** `reset` do boundary de erro do Next. Com ele, aparece "Tentar novamente". */
  reset?: () => void;
  backHref?: string;
  backLabel?: string;
};

function RetryButton({ reset }: { reset: () => void }) {
  const retry = useRetry(reset);

  return <Button onClick={retry}>Tentar novamente</Button>;
}

/**
 * Estado de erro para os arquivos error.tsx das rotas públicas.
 * O landmark <main> é do layout; aqui só o conteúdo.
 */
export function ErrorState({
  title,
  description = "Tente novamente em alguns instantes.",
  reset,
  backHref,
  backLabel = "Voltar",
}: ErrorStateProps) {
  return (
    <div className="flex flex-1 px-6 py-12 lg:px-10 lg:py-16">
      <section className="mx-auto w-full max-w-7xl">
        <Card padding="lg" className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
            Erro
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>

          <p role="alert" className="mt-3 leading-7 text-foreground-muted">
            {description}
          </p>

          {(reset || backHref) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {reset && <RetryButton reset={reset} />}

              {backHref && (
                <ButtonLink href={backHref} variant="secondary">
                  {backLabel}
                </ButtonLink>
              )}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
