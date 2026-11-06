/**
 * Formatadores de data em pt-BR. Recebem strings ISO vindas da API.
 * Usam UTC para a data não mudar conforme o fuso do servidor.
 */
const monthYearFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthYear(isoDate: string): string {
  return monthYearFormatter.format(new Date(isoDate));
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
