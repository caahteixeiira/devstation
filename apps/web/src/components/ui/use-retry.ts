"use client";

import { useRouter } from "next/navigation";
import { startTransition, useCallback } from "react";

/**
 * Retry para error boundaries do App Router. `reset()` sozinho só
 * re-renderiza o boundary com o payload já recebido; `router.refresh()`
 * invalida o cache do roteador e refaz a requisição ao servidor. Os dois
 * juntos, numa transição, fazem "Tentar novamente" buscar dados de verdade.
 */
export function useRetry(reset: () => void) {
  const router = useRouter();

  return useCallback(() => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }, [router, reset]);
}
