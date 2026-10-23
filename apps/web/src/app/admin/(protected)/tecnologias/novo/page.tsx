import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { CreateTechnologyForm } from "./CreateTechnologyForm";

export const metadata: Metadata = {
  title: "Nova tecnologia",
};

export default async function NewTechnologyPage() {
  await requireAdmin();

  return (
    <section className="max-w-2xl">
      <Link
        href="/admin/tecnologias"
        className="text-sm text-primary-strong hover:underline"
      >
        ← Voltar às tecnologias
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">
        Nova tecnologia
      </h1>

      <p className="mt-4 text-foreground-muted">
        Cadastre uma tecnologia para vincular aos projetos,
        experiências e experimentos.
      </p>

      <CreateTechnologyForm />
    </section>
  );
}