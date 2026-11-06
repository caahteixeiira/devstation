/**
 * Junta classes condicionais ignorando valores falsy.
 * Evita strings "undefined"/"false" dentro de className.
 */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
