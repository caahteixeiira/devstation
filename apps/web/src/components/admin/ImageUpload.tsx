"use client";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { prepareImage } from "./prepare-image";

type ImageUploadProps = {
  onUpload: (data: FormData) => Promise<void>;
  initialAlt?: string; initialOrder?: number; label?: string; showOrder?: boolean;
  disabled?: boolean;
};

export function ImageUpload({ onUpload, initialAlt = "", initialOrder = 0, label = "Enviar imagem", showOrder = true, disabled = false }: ImageUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      data.set("file", await prepareImage(file));
      await onUpload(data);
      setFile(null); setPreview(undefined);
      if (inputRef.current) inputRef.current.value = "";
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Não foi possível enviar a imagem."); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4" aria-busy={busy}>
      <fieldset disabled={busy || disabled} className="space-y-4">
        <div>
          <label htmlFor={`${id}-file`} className="block text-sm font-medium">Imagem — JPEG, PNG ou WebP</label>
          <input ref={inputRef} id={`${id}-file`} type="file" name="file" accept="image/jpeg,image/png,image/webp" required className="admin-input mt-2" aria-describedby={`${id}-help`} onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setFile(selected); setPreview(undefined); setError("");
            if (selected && (selected.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(selected.type))) {
              setError("Selecione JPEG, PNG ou WebP de até 5 MB."); setFile(null); event.target.value = "";
            } else if (selected) setPreview(URL.createObjectURL(selected));
          }} />
          <p id={`${id}-help`} className="mt-2 text-sm text-foreground-muted">Até 5 MB. Arquivos maiores que 4 MB são preparados no navegador antes do envio.</p>
        </div>
        {preview && <div className="relative aspect-video max-w-lg rounded-control border border-border bg-surface-muted"><Image src={preview} alt="Prévia da imagem selecionada, ainda não enviada" fill unoptimized className="object-contain p-2" /></div>}
        <div>
          <label htmlFor={`${id}-alt`} className="block text-sm font-medium">Texto alternativo</label>
          <input id={`${id}-alt`} name="altText" required minLength={2} maxLength={500} defaultValue={initialAlt} className="admin-input mt-2" />
        </div>
        {showOrder && <div>
          <label htmlFor={`${id}-order`} className="block text-sm font-medium">Ordem</label>
          <input id={`${id}-order`} name="order" type="number" min={0} max={10000} defaultValue={initialOrder} className="admin-input mt-2" required />
        </div>}
        {error && <p role="alert" className="text-sm text-foreground-muted">{error}</p>}
        <Button type="submit" disabled={!file}>{busy ? "Enviando…" : label}</Button>
        {busy && <p role="status" className="text-sm text-foreground-muted">Validando e enviando a imagem…</p>}
      </fieldset>
    </form>
  );
}
