import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function ArticleNotFound() {
  return (
    <PageIntro
      width="narrow"
      eyebrow="Artigos"
      title="Artigo não encontrado"
      description="Não encontramos um artigo publicado com esse endereço. Ele pode ter sido renomeado ou despublicado."
      breadcrumb={[
        { label: "Artigos", href: "/artigos" },
        { label: "Não encontrado" },
      ]}
    >
      <ButtonLink href="/artigos" variant="secondary" className="mt-8">
        <ArrowRightIcon className="size-4 rotate-180" />
        Todos os artigos
      </ButtonLink>
    </PageIntro>
  );
}
