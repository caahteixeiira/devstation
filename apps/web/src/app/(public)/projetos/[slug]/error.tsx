"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type ProjectErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProjectError({ reset }: ProjectErrorProps) {
  return (
    <ErrorState
      title="Não foi possível carregar o projeto"
      reset={reset}
      backHref="/projetos"
      backLabel="Voltar aos projetos"
    />
  );
}
