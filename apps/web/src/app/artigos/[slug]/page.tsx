import { notFound } from "next/navigation";

import { articles } from "@/app/features/articles/articles";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = articles.find(
    (article) => article.slug === slug,
  );

  if (!article) {
    notFound();
  }

  return (
    <main className="flex flex-1 px-6 py-16">
      <article className="mx-auto w-full max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
          {article.category} · {article.project}
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          {article.title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-foreground-muted">
          {article.summary}
        </p>

        <section className="mt-12 space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Contexto
            </h2>

            <p className="mt-4 leading-7 text-foreground-muted">
              {article.introduction}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Por que essa tecnologia?
            </h2>

            <p className="mt-4 leading-7 text-foreground-muted">
              {article.why}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Como foi aplicada
            </h2>

            <p className="mt-4 leading-7 text-foreground-muted">
              {article.application}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              O que aprendi
            </h2>

            <p className="mt-4 leading-7 text-foreground-muted">
              {article.learning}
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}