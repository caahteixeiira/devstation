import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function ProjectNotFound() {
  return (
    <PageIntro
      eyebrow="Projetos"
      title="Projeto não encontrado"
      description="Não encontramos um projeto com esse endereço. Ele pode ter sido renomeado ou removido."
      breadcrumb={[
        { label: "Projetos", href: "/projetos" },
        { label: "Não encontrado" },
      ]}
    >
      <ButtonLink href="/projetos" variant="secondary" className="mt-8">
        <ArrowRightIcon className="size-4 rotate-180" />
        Todos os projetos
      </ButtonLink>
    </PageIntro>
  );
}
