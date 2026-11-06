"use client";

import { useRetry } from "@/components/ui/use-retry";

import Link from "next/link";

type ExperiencesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ExperiencesError({
  reset,
}: ExperiencesErrorProps) {
  const retry = useRetry(reset);

  return (
    <section>
      <h1 className="text-3xl font-semibold">
        Não foi possível carregar esta página
      </h1>

      <p className="mt-4 text-foreground-muted">
        Ocorreu um problema ao carregar a área de experiências.
        Tente novamente.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={retry}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary-strong"
        >
          Tentar novamente
        </button>

        <Link
          href="/admin"
          className="rounded-lg border border-border px-4 py-2 font-medium transition hover:border-primary-strong"
        >
          Voltar à administração
        </Link>
      </div>
    </section>
  );
}