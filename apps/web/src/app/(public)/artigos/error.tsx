"use client";

import Link from "next/link";

type ArticlesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArticlesError({ reset }: ArticlesErrorProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">
        Não foi possível carregar este conteúdo
      </h1>

      <p role="alert" className="mt-4 text-foreground-muted">
        Tente novamente em alguns instantes.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
        >
          Tentar novamente
        </button>

        <Link href="/artigos" className="text-primary-strong hover:underline">
          Voltar aos artigos
        </Link>
      </div>
    </section>
  );
}
