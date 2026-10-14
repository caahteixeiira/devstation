export default function ArticleLoading() {
  return (
    <main className="flex flex-1 px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <p role="status" className="text-foreground-muted">
          Carregando artigo…
        </p>
      </div>
    </main>
  );
}
