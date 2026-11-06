"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ProjetosError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Não foi possível carregar os projetos"
      reset={reset}
      backHref="/"
      backLabel="Voltar ao início"
    />
  );
}
