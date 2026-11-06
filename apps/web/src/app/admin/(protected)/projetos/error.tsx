"use client";

import { useRetry } from "@/components/ui/use-retry";

type AdminProjectsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminProjectsError({
  reset,
}: AdminProjectsErrorProps) {
  const retry = useRetry(reset);

  return (
    <section>
      <h1 className="text-3xl font-semibold">
        Não foi possível carregar os projetos
      </h1>

      <p role="alert" className="mt-4 text-foreground-muted">
        Tente novamente em alguns instantes.
      </p>

      <button
        type="button"
        onClick={retry}
        className="mt-6 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary-strong"
      >
        Tentar novamente
      </button>
    </section>
  );
}