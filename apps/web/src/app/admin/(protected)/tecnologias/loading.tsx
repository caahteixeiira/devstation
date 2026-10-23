export default function TechnologiesLoading() {
  return (
    <section aria-busy="true">
      <h1 className="text-3xl font-semibold">
        Tecnologias
      </h1>

      <p role="status" className="mt-4 text-foreground-muted">
        Carregando tecnologias…
      </p>
    </section>
  );
}