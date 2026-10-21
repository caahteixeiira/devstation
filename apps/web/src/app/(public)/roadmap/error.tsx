"use client";

type RoadmapErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RoadmapError({ reset }: RoadmapErrorProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">
        Não foi possível carregar o planejamento
      </h1>

      <p role="alert" className="mt-4 text-foreground-muted">
        Tente novamente em alguns instantes.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition hover:bg-primary-strong"
      >
        Tentar novamente
      </button>
    </section>
  );
}
