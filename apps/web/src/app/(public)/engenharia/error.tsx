"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type EngenhariaErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EngenhariaError({ reset }: EngenhariaErrorProps) {
  return (
    <ErrorState
      title="Não foi possível carregar a página de Engenharia"
      reset={reset}
      backHref="/"
      backLabel="Voltar ao início"
    />
  );
}
