"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type SobreErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SobreError({ reset }: SobreErrorProps) {
  return (
    <ErrorState
      title="Não foi possível carregar a página Sobre"
      reset={reset}
      backHref="/"
      backLabel="Voltar ao início"
    />
  );
}
