import { ApiError } from "@/lib/api/client";

/**
 * Resultado de uma busca por seção: falhas de API viram `{ ok: false }`
 * para a seção degradar sem derrubar a página.
 */
export type Loaded<T> = { ok: true; data: T } | { ok: false };

/**
 * Executa a busca de uma seção. `ApiError` é registrado com o escopo da
 * página (ex.: "[home]") e devolvido como falha; qualquer outro erro é
 * relançado para subir até o boundary de erro.
 */
export async function loadSection<T>(
  scope: string,
  section: string,
  request: () => Promise<T>,
): Promise<Loaded<T>> {
  try {
    return { ok: true, data: await request() };
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    console.error(`[${scope}] Failed to load ${section}.`, error);

    return { ok: false };
  }
}
