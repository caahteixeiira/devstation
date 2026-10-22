import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { CreateProjectForm } from "./CreateProjectForm";
import { listTechnologies } from "@/services/technologies.service";

export const metadata: Metadata = {
  title: "Novo projeto",
};

export default async function NewProjectPage() {
  await requireAdmin();
  const technologies = await listTechnologies();

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/projetos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos projetos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Novo projeto
      </h1>

      <p className="mt-4 leading-7 text-foreground-muted">
        Preencha os dados principais do projeto.
      </p>

      <CreateProjectForm technologies={technologies} />
    </section>
  );
}