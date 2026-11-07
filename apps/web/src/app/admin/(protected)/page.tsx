import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { adminNavigation } from "@/components/admin/admin-navigation";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
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
    <section className="admin-page">
      <AdminPageHeader title={<>Olá, {user.name}</>} description="Organize o conteúdo e acompanhe a evolução do DevStation." actions={<ButtonLink href="/admin/projetos/novo">Novo projeto</ButtonLink>} />
      <div className="mb-8 flex flex-wrap items-center gap-3"><span className="text-sm text-foreground-muted">Acesso rápido</span><ButtonLink href="/admin/artigos/novo" variant="secondary" size="sm">Escrever artigo</ButtonLink><ButtonLink href="/admin/roadmap/novo" variant="secondary" size="sm">Adicionar ao planejamento</ButtonLink></div>
      <div className="admin-dashboard-grid">
        {adminNavigation.slice(1).map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="admin-dashboard-link">
            <div className="flex items-center justify-between"><span className="admin-dashboard-icon"><Icon className="size-5" /></span><ArrowUpRightIcon className="size-4 text-foreground-subtle" /></div>
            <div><h2>{label}</h2><p className="mt-2 text-sm leading-6 text-foreground-muted">{description}</p></div>
            <span className="mt-auto pt-2 text-xs font-semibold text-primary-strong">Gerenciar {label.toLocaleLowerCase('pt-BR')} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
