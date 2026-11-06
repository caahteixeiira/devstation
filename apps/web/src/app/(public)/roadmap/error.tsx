"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type RoadmapErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RoadmapError({ reset }: RoadmapErrorProps) {
  return (
    <ErrorState
      title="Não foi possível carregar o planejamento"
      reset={reset}
      backHref="/"
      backLabel="Voltar ao início"
    />
  );
}
