import { PageIntro } from "@/components/layout/PageIntro";
import { ArticleCard } from "@/app/features/articles/ArticleCard";
import { articles } from "@/app/features/articles/articles";

export default function ArtigosPage() {
  return (
    <PageIntro
      eyebrow="Estudos e aprendizado"
      title="Artigos"
      description="Conhecimentos e decisões técnicas que surgiram durante o desenvolvimento dos meus projetos."
    >
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </PageIntro>
  );
}