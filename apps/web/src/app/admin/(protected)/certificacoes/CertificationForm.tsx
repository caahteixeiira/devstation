"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminFormSection } from "@/components/admin/AdminFormSection";
import type { Certification } from "@/types/certification";
import type { Technology } from "@/types/technology";
import { saveCertificationAction, deleteCertificationAction, type CertificationActionState } from "./actions";

export function CertificationForm({ certification, technologies }: { certification?: Certification; technologies: Technology[] }) {
  const action = saveCertificationAction.bind(null, certification?.id ?? null);
  const [state, formAction, pending] = useActionState(action, { message: "" } as CertificationActionState);
  const fields = [
    { name: "title", label: "Título", required: true, value: certification?.title, type: "text", max: 200 },
    { name: "issuer", label: "Instituição emissora", required: true, value: certification?.issuer, type: "text", max: 200 },
    { name: "issueDate", label: "Data de emissão", required: true, value: certification?.issueDate.slice(0, 10), type: "date" },
    { name: "expirationDate", label: "Validade — opcional", value: certification?.expirationDate?.slice(0, 10), type: "date" },
    { name: "credentialId", label: "ID da credencial — opcional", value: certification?.credentialId, type: "text", max: 200 },
    { name: "credentialUrl", label: "URL HTTPS oficial — opcional", value: certification?.credentialUrl, type: "url", max: 2000 },
    { name: "imageAlt", label: "Texto alternativo da imagem", value: certification?.imageAlt, type: "text", max: 500 },
  ];
  return (
    <form action={formAction}>
      <fieldset disabled={pending || certification?.deleting} className="space-y-6">
        <AdminFormSection id="certification-data-title" title="Certificação" description="Cadastre dados reais. A imagem é enviada separadamente após salvar.">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium">{field.label}</label>
              <input id={field.name} name={field.name} type={field.type} required={field.required} maxLength={field.max} minLength={field.required && field.type === "text" ? 2 : undefined} defaultValue={field.value ?? ""} className="admin-input mt-2" aria-invalid={!!state.fieldErrors?.[field.name]?.length} aria-describedby={state.fieldErrors?.[field.name]?.length ? `${field.name}-error` : undefined} />
              {state.fieldErrors?.[field.name]?.length && <p id={`${field.name}-error`} className="mt-2 text-sm text-foreground-muted">{state.fieldErrors[field.name]?.join(" ")}</p>}
            </div>
          ))}
          <label className="block text-sm font-medium">Ordem<input name="order" type="number" min={0} max={10000} defaultValue={certification?.order ?? 0} required className="admin-input mt-2" /></label>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="featured" defaultChecked={certification?.featured} />Destacar na Home</label>
        </AdminFormSection>
        <AdminFormSection id="certification-skills-title" title="Competências" description="Reutiliza o catálogo de tecnologias do portfólio.">
          <div className="flex flex-wrap gap-4">
            {technologies.length === 0 && <p className="text-sm text-foreground-muted">Cadastre tecnologias no catálogo para associar competências.</p>}
            {technologies.map((technology) => (
              <label key={technology.id} className="flex items-center gap-2 text-sm"><input type="checkbox" name="technologyIds" value={technology.id} defaultChecked={certification?.technologies.some((item) => item.id === technology.id)} />{technology.name}</label>
            ))}
          </div>
          {state.fieldErrors?.technologyIds && <p role="alert" className="text-sm">{state.fieldErrors.technologyIds.join(" ")}</p>}
        </AdminFormSection>
        {state.message && <p role="alert" className="text-sm text-foreground-muted">{state.message}</p>}
        <Button type="submit">{pending ? "Salvando…" : "Salvar certificação"}</Button>
      </fieldset>
    </form>
  );
}

export function CertificationDeleteForm({ id }: { id: number }) {
  const [state, action, pending] = useActionState(deleteCertificationAction.bind(null, id), { message: "" });
  return <form action={action} className="mt-6 space-y-4">
    <p>A imagem gerenciada será removida do Storage. Se ocorrer uma falha, a exclusão ficará pendente para uma nova tentativa.</p>
    {state.message && <p role="alert">{state.message}</p>}
    <Button type="submit" disabled={pending}>{pending ? "Excluindo…" : "Confirmar exclusão"}</Button>
  </form>;
}
