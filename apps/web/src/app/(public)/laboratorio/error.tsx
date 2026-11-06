"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type LaboratorioErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LaboratorioError({ reset }: LaboratorioErrorProps) {
  return (
    <ErrorState
      title="Não foi possível carregar os experimentos"
      reset={reset}
      backHref="/"
      backLabel="Voltar ao início"
    />
  );
}
