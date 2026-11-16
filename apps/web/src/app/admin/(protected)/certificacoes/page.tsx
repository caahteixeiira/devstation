import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { listAdminCertifications } from "@/services/certifications.service";
import { formatMonthYear } from "@/lib/dates";
import { StorageCleanupButton } from "@/components/admin/StorageCleanupButton";

export const metadata = { title: "Certificações | Admin" };
export default async function AdminCertificationsPage() {
  await requireAdmin();
  const certifications = await listAdminCertifications((await getSessionToken())!);
  return (
    <section className="admin-page">
      <AdminPageHeader title="Certificações" description="Certificados, competências e imagens do portfólio." actions={<ButtonLink href="/admin/certificacoes/novo">Nova certificação</ButtonLink>} />
      <div className="mb-6"><StorageCleanupButton /></div>
      {certifications.length === 0 ? <EmptyState title="Nenhuma certificação cadastrada." description="Cadastre uma certificação real para começar." /> : (
        <ul className="space-y-4">{certifications.map((item) => (
          <li key={item.id}><Card className="flex flex-wrap items-center justify-between gap-4">
            <div><h2 className="text-lg font-semibold">{item.title}</h2><p className="mt-1 text-sm text-foreground-muted">{item.issuer} · {formatMonthYear(item.issueDate)}</p>{item.deleting && <Badge tone="warning">Exclusão pendente</Badge>}</div>
            <div className="flex flex-wrap gap-3"><ButtonLink variant="secondary" href={`/admin/certificacoes/${item.id}/editar`}>Editar</ButtonLink><ButtonLink variant="ghost" href={`/admin/certificacoes/${item.id}/excluir`}>{item.deleting ? "Tentar exclusão novamente" : "Excluir"}</ButtonLink></div>
          </Card></li>
        ))}</ul>
      )}
    </section>
  );
}
