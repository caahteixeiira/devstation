export default function ExperiencesLoading() {
  return (
    <section aria-busy="true">
      <h1 className="text-3xl font-semibold">
        Experiências
      </h1>

      <p role="status" className="mt-4 text-foreground-muted">
        Carregando experiências…
      </p>
    </section>
  );
}