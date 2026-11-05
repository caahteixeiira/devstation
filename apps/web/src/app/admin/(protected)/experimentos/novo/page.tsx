import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listProjects } from "@/services/projects.service";
import { listTechnologies } from "@/services/technologies.service";
import { CreateExperimentForm } from "./CreateExperimentForm";

export const metadata: Metadata = {
  title: "Novo experimento",
};

export default async function NewExperimentPage() {
  await requireAdmin();

  const [projects, technologies] = await Promise.all([
    listProjects(),
    listTechnologies(),
  ]);

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/experimentos"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar aos experimentos
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Novo experimento
      </h1>

      <p className="mt-4 text-foreground-muted">
        Registre uma ideia, um estudo ou uma prova de conceito
        para apresentar no Laboratório.
      </p>

      <CreateExperimentForm
        projects={projects}
        technologies={technologies}
      />
    </section>
  );
}