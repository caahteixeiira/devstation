export default function ExperimentsLoading() {
  return (
    <section aria-busy="true">
      <h1 className="text-3xl font-semibold">
        Experimentos
      </h1>

      <p role="status" className="mt-4 text-foreground-muted">
        Carregando experimentos…
      </p>
    </section>
  );
}