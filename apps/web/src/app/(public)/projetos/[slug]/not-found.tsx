import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";

export default function ProjectNotFound() {
  return (
    <PageIntro
      eyebrow="Projetos"
      title="Projeto não encontrado"
      description="Não encontramos um projeto com esse endereço."
    >
      <Link
        href="/projetos"
        className="mt-8 inline-flex text-primary-strong hover:underline"
      >
        ← Voltar aos projetos
      </Link>
    </PageIntro>
  );
}
