import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";

export default function ArticleNotFound() {
  return (
    <PageIntro
      eyebrow="Artigos"
      title="Artigo não encontrado"
      description="Não encontramos um artigo publicado com esse endereço."
    >
      <Link
        href="/artigos"
        className="mt-8 inline-flex text-primary-strong hover:underline"
      >
        ← Voltar aos artigos
      </Link>
    </PageIntro>
  );
}
