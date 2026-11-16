"use client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "./ImageUpload";
import { StorageCleanupButton } from "./StorageCleanupButton";

export type ManagedImage = { id: number; imageUrl: string | null; altText: string; order: number };
type ImageManagerProps = { images: ManagedImage[] } & ({ kind: "project"; slug: string } | { kind: "certification"; id: number });

export function ImageManager(props: ImageManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState(props.images);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [snapshot, setSnapshot] = useState(props.images);
  if (snapshot !== props.images) {
    setSnapshot(props.images);
    setImages(props.images);
  }
  const base = props.kind === "project" ? `projects/${encodeURIComponent(props.slug)}/images` : `certifications/${props.id}/image`;

  async function request(path: string, method: string, body?: FormData | string) {
    let response: Response;
    let result;
    try {
      response = await fetch(`/admin/media/${path}`, {
        method, body, headers: typeof body === "string" ? { "Content-Type": "application/json" } : undefined,
      });
      result = await response.json();
    } catch { throw new Error("Não foi possível conectar ao serviço. Atualize a página antes de tentar novamente."); }
    if (!response.ok) {
      if (response.status === 401) throw new Error("Sua sessão expirou. Entre novamente no Admin.");
      if (response.status === 413) throw new Error("A imagem excede o limite permitido.");
      if (response.status === 400 || response.status === 415) throw new Error("A API rejeitou o arquivo ou os dados. Use uma imagem válida e confira o texto alternativo.");
      throw new Error("Não foi possível confirmar a operação. Atualize a página antes de tentar novamente.");
    }
    return result;
  }

  async function upload(data: FormData, imageId?: number) {
    setBusy(true); setMessage("");
    try {
      const result = await request(props.kind === "project" && imageId ? `${base}/${imageId}` : base, "POST", data);
      const record = result.data;
      const image: ManagedImage = { id: record.id, imageUrl: record.imageUrl, altText: record.altText ?? record.imageAlt, order: record.order };
      setImages((current) => props.kind === "certification" ? [image] : [...current.filter((item) => item.id !== image.id), image].sort((a, b) => a.order - b.order));
      setMessage(result.warning || "Imagem salva."); router.refresh();
    } finally { setBusy(false); }
  }

  async function remove(image: ManagedImage) {
    setBusy(true); setMessage("");
    try {
      const result = await request(props.kind === "project" ? `${base}/${image.id}` : base, "DELETE");
      setImages((current) => current.filter((item) => item.id !== image.id));
      setMessage(result.warning || "Imagem removida."); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível remover a imagem."); }
    finally { setBusy(false); }
  }

  async function updateMetadata(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setBusy(true); setMessage("");
    try {
      const result = await request(`${base}/${id}`, "PATCH", JSON.stringify({ altText: fields.get("altText"), order: Number(fields.get("order")) }));
      setImages((current) => current.map((image) => image.id === id ? result.data : image).sort((a, b) => a.order - b.order));
      setMessage("Descrição e ordem salvas."); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível salvar os dados."); }
    finally { setBusy(false); }
  }

  return (
    <section className="mt-8 space-y-6" aria-label="Gerenciar imagens" aria-busy={busy}>
      <h2 className="text-xl font-semibold">{props.kind === "project" ? "Imagens do projeto" : "Imagem do certificado"}</h2>
      <p className="text-sm text-foreground-muted">As alterações de imagem são salvas separadamente dos campos do conteúdo.</p>
      {images.map((image) => (
        <Card key={image.id} className="space-y-4">
          {image.imageUrl && <div className="relative aspect-video max-w-2xl rounded-control border border-border bg-surface-muted"><Image src={image.imageUrl} alt={image.altText} fill sizes="(max-width: 768px) 100vw, 672px" className="object-contain p-2" /></div>}
          {props.kind === "project" && <form key={`${image.altText}-${image.order}`} onSubmit={(event) => updateMetadata(event, image.id)}>
            <fieldset disabled={busy} className="space-y-3">
              <label className="block text-sm">Texto alternativo<input name="altText" defaultValue={image.altText} minLength={2} maxLength={500} required className="admin-input mt-2" /></label>
              <label className="block text-sm">Ordem<input type="number" name="order" defaultValue={image.order} min={0} max={10000} required className="admin-input mt-2" /></label>
              <Button type="submit" variant="secondary">Salvar descrição e ordem</Button>
            </fieldset>
          </form>}
          <details className="rounded-control border border-border p-4">
            <summary className="cursor-pointer font-medium focus-visible:outline-2 focus-visible:outline-primary-strong">Substituir imagem</summary>
            <div className="mt-4"><ImageUpload disabled={busy} initialAlt={image.altText} initialOrder={image.order} showOrder={props.kind === "project"} label="Substituir imagem" onUpload={(data) => upload(data, image.id)} /></div>
          </details>
          <Button variant="secondary" disabled={busy} onClick={() => remove(image)}>Remover imagem</Button>
        </Card>
      ))}
      {(props.kind === "project" || images.length === 0) && <Card><ImageUpload disabled={busy} showOrder={props.kind === "project"} onUpload={(data) => upload(data)} /></Card>}
      <StorageCleanupButton disabled={busy} />
      {message && <p role="status" className="text-sm text-foreground-muted">{message}</p>}
    </section>
  );
}
