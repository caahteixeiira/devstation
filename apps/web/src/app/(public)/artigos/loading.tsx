import { PageIntro } from "@/components/layout/PageIntro";

export default function ArticlesLoading() {
  return (
    <PageIntro
      eyebrow="Estudos e aprendizado"
      title="Artigos"
      description="Conhecimentos e decisões técnicas que surgiram durante o desenvolvimento dos meus projetos."
    >
      <p role="status" className="mt-10 text-foreground-muted">
        Carregando artigos…
      </p>
    </PageIntro>
  );
}
