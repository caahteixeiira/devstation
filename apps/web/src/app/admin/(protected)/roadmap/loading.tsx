export default function RoadmapLoading() {
  return (
    <section aria-busy="true">
      <h1 className="text-3xl font-semibold">
        Planejamento
      </h1>

      <p role="status" className="mt-4 text-foreground-muted">
        Carregando planejamento…
      </p>
    </section>
  );
}