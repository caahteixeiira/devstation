import "server-only";
import { cache } from "react";
import { apiGet, apiPost, apiPatch, apiDelete, ApiError } from "@/lib/api/client";
import { certificationsResponseSchema, certificationResponseSchema, type CertificationBody } from "@/types/certification";

export const listCertifications = cache(async () => {
  const parsed = certificationsResponseSchema.safeParse(await apiGet<unknown>("/certifications"));
  if (!parsed.success) throw new ApiError("API returned invalid certifications.", "INVALID_RESPONSE");
  return parsed.data.data;
});
export async function listAdminCertifications(token: string) {
  const parsed = certificationsResponseSchema.safeParse(await apiGet<unknown>("/admin/certifications", { token }));
  if (!parsed.success) throw new ApiError("API returned invalid certifications.", "INVALID_RESPONSE");
  return parsed.data.data;
}
export async function getAdminCertification(id: number, token: string) {
  const parsed = certificationResponseSchema.safeParse(await apiGet<unknown>(`/admin/certifications/${id}`, { token }));
  if (!parsed.success) throw new ApiError("API returned an invalid certification.", "INVALID_RESPONSE");
  return parsed.data.data;
}
export async function saveCertification(data: CertificationBody, token: string, id?: number) {
  const response = id
    ? await apiPatch<unknown>(`/certifications/${id}`, data, { token })
    : await apiPost<unknown>("/certifications", data, { token });
  const parsed = certificationResponseSchema.safeParse(response);
  if (!parsed.success) throw new ApiError("API returned an invalid certification.", "INVALID_RESPONSE");
  return parsed.data.data;
}
export const deleteCertification = (id: number, token: string) => apiDelete(`/certifications/${id}`, { token });
