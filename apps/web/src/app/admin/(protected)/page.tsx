import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Administração",
  robots: {
    index: false,
    follow: false,
  },
};

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
        Os módulos de edição serão adicionados nas próximas etapas.
      </p>
    </section>
  );
}

<Link
  href="/admin/projetos"
  className="mt-8 inline-flex rounded-lg border border-border bg-surface px-5 py-3 font-medium transition hover:border-primary-strong"
>
  Gerenciar projetos →
</Link>