"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type ArticlesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArticlesError({ reset }: ArticlesErrorProps) {
  return (
    <ErrorState
      title="Não foi possível carregar os artigos"
      reset={reset}
      backHref="/"
      backLabel="Voltar ao início"
    />
  );
}
