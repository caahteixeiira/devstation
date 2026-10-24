import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Administração",
  robots: {
    index: false,
    follow: false,
  },
};

const modules = [
  { href: "/admin/projetos", label: "Gerenciar projetos" },
  { href: "/admin/tecnologias", label: "Gerenciar tecnologias" },
  { href: "/admin/experiencias", label: "Gerenciar experiências" },
  { href: "/admin/artigos", label: "Gerenciar artigos" },
];

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <section>
      <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
        Administração
      </p>

      <h1 className="mt-4 text-3xl font-semibold">
        Olá, {user.name}
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-foreground-muted">
        Esta é a área de gerenciamento do DevStation.
        Selecione um módulo para gerenciar seus conteúdos.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="inline-flex rounded-lg border border-border bg-surface px-5 py-3 font-medium transition hover:border-primary-strong"
          >
            {module.label} →
          </Link>
        ))}
      </div>
    </section>
  );
}