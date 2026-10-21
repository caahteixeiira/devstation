import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";

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