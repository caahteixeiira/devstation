"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSessionToken } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/client";
import { certificationBodySchema } from "@/types/certification";
import { saveCertification, deleteCertification } from "@/services/certifications.service";

export type CertificationActionState = { message: string; fieldErrors?: Record<string, string[] | undefined> };

function refreshCertifications() {
  for (const path of ["/", "/sobre", "/certificacoes", "/admin/certificacoes"]) revalidatePath(path);
}

function errorState(error: unknown): CertificationActionState {
  if (!(error instanceof ApiError)) throw error;
  if (error.status === 401) redirect("/admin/login");
  if (error.status === 403) return { message: "Você não tem permissão para esta ação." };
  if (error.status === 400) return { message: "A API rejeitou os dados. Confira os campos e as tecnologias selecionadas." };
  if (error.status === 409) return { message: "Há uma exclusão pendente. Volte à listagem e tente concluir a exclusão." };
  return { message: "Não foi possível confirmar a operação. Confira a listagem antes de tentar novamente. Uma exclusão pendente pode ser tentada novamente com segurança." };
}

export async function saveCertificationAction(id: number | null, _previous: CertificationActionState, formData: FormData): Promise<CertificationActionState> {
  await requireAdmin();
  const token = await getSessionToken();
  if (!token) redirect("/admin/login");
  if (id !== null && (!Number.isSafeInteger(id) || id <= 0)) return { message: "Certificação inválida." };
  const nullable = (key: string) => { const value = formData.get(key); return typeof value === "string" && value.trim() ? value.trim() : null; };
  const parsed = certificationBodySchema.safeParse({
    title: formData.get("title"), issuer: formData.get("issuer"), issueDate: formData.get("issueDate"),
    expirationDate: nullable("expirationDate"), credentialId: nullable("credentialId"), credentialUrl: nullable("credentialUrl"),
    imageAlt: formData.get("imageAlt"), featured: formData.get("featured") === "on",
    order: Number(formData.get("order")), technologyIds: formData.getAll("technologyIds").map(Number),
  });
  if (!parsed.success) return { message: "Confira os campos informados.", fieldErrors: parsed.error.flatten().fieldErrors };
  let record;
  try { record = await saveCertification(parsed.data, token, id ?? undefined); }
  catch (error) { return errorState(error); }
  refreshCertifications();
  redirect(`/admin/certificacoes/${record.id}/editar`);
}

export async function deleteCertificationAction(id: number): Promise<CertificationActionState> {
  await requireAdmin();
  const token = await getSessionToken();
  if (!token) redirect("/admin/login");
  if (!Number.isSafeInteger(id) || id <= 0) return { message: "Certificação inválida." };
  try { await deleteCertification(id, token); }
  catch (error) { refreshCertifications(); return errorState(error); }
  refreshCertifications();
  redirect("/admin/certificacoes");
}
