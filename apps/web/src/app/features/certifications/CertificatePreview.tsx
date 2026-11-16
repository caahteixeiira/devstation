"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ArrowUpRightIcon, CloseIcon } from "@/components/ui/icons";

type CertificatePreviewProps = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  credentialUrl?: string;
  compact?: boolean;
};

/** O dialog modal nativo contém o foco, torna o fundo inerte e trata Esc. */
export function CertificatePreview({ title, imageUrl, imageAlt, credentialUrl, compact = false }: CertificatePreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  function openPreview(event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPreview}
        aria-label={`Ampliar certificado: ${title}`}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        className={`relative block w-full cursor-zoom-in border-b border-border bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-strong ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes={compact ? "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 640px, (min-width: 768px) 50vw, 100vw"}
          className="object-contain p-4"
        />
        <span className="absolute bottom-2 right-2 rounded-control border border-border bg-surface px-2 py-1 text-xs text-foreground-muted">Ampliar certificado</span>
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-modal="true"
        aria-labelledby={titleId}
        onClose={() => setIsOpen(false)}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto rounded-card border border-border bg-surface p-0 text-foreground shadow-card backdrop:bg-black/60"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface p-4 sm:p-6">
          <h2 id={titleId} className="min-w-0 [overflow-wrap:anywhere]">{title}</h2>
          <Button variant="secondary" onClick={() => setIsOpen(false)} aria-label="Fechar certificado" autoFocus className="shrink-0">
            <CloseIcon />
          </Button>
        </div>
        {isOpen && (
          <div className="relative h-[60dvh] min-h-48 bg-surface-muted">
            <Image src={imageUrl} alt={imageAlt} fill sizes="(min-width: 1200px) 1152px, 100vw" className="object-contain p-3 sm:p-6" />
          </div>
        )}
        <div className="flex flex-wrap gap-3 border-t border-border p-4 sm:p-6">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Fechar</Button>
          {credentialUrl && (
            <ButtonLink href={credentialUrl} external>
              Ver credencial oficial<ArrowUpRightIcon className="size-4" />
            </ButtonLink>
          )}
        </div>
      </dialog>
    </>
  );
}
