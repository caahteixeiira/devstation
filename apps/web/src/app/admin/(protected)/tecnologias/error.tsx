"use client";

import Link from "next/link";

type TechnologiesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TechnologiesError({
  reset,
}: TechnologiesErrorProps) {
  return (
    <section>
      <h1 className="text-3xl font-semibold">
        Não foi possível carregar esta página
      </h1>

      <p className="mt-4 text-foreground-muted">
        Ocorreu um problema ao carregar a área de tecnologias.
        Tente novamente.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
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