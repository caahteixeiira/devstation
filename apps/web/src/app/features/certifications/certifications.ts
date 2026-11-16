import type { Certification } from "@/types/certification";

/** Destaques primeiro, depois emissão mais recente; preserva a lista original. */
export function sortCertifications(items: readonly Certification[]): Certification[] {
  return [...items].sort(
    (a, b) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      a.order - b.order ||
      b.issueDate.localeCompare(a.issueDate),
  );
}
