import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listTechnologies } from "@/services/technologies.service";
import { CreateExperienceForm } from "./CreateExperienceForm";

export const metadata: Metadata = {
  title: "Nova experiência",
};

export default async function NewExperiencePage() {
  await requireAdmin();

  const technologies = await listTechnologies();

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/experiencias"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar às experiências
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Nova experiência
      </h1>

      <p className="mt-4 text-foreground-muted">
        Cadastre uma experiência para apresentar sua trajetória
        profissional na página Sobre.
      </p>

      <CreateExperienceForm technologies={technologies} />
    </section>
  );
}