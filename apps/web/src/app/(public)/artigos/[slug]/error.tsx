"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type ArticleErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArticleError({ reset }: ArticleErrorProps) {
  return (
    <ErrorState
      title="Não foi possível carregar o artigo"
      reset={reset}
      backHref="/artigos"
      backLabel="Voltar aos artigos"
    />
  );
}
