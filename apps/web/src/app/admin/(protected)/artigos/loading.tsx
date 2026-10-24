export default function AdminArticlesLoading() {
  return (
    <section aria-busy="true">
      <h1 className="text-3xl font-semibold">
        Artigos
      </h1>

      <p role="status" className="mt-4 text-foreground-muted">
        Carregando artigos…
      </p>
    </section>
  );
}