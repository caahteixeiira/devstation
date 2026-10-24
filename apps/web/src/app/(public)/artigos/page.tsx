import { PageIntro } from "@/components/layout/PageIntro";
import { ArticleCard } from "@/app/features/articles/ArticleCard";
import { listArticles } from "@/services/articles.service";
import { connection } from "next/server";

export default async function ArtigosPage() {
  await connection();

  const articles = await listArticles();

  // O return existente continua aqui.

  return (
    <PageIntro
      eyebrow="Estudos e aprendizado"
      title="Artigos"
      description="Conhecimentos e decisões técnicas que surgiram durante o desenvolvimento dos meus projetos."
    >
      {articles.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-border bg-surface p-6 text-foreground-muted">
          Nenhum artigo disponível no momento.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </PageIntro>
  );
}
