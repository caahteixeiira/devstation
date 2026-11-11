/**
 * Dados públicos do site, centralizados para não espalhar links e nomes
 * pelos componentes. Valores `null` indicam dado ainda não informado:
 * quem consome deve omitir o link ou desabilitar a ação até o preenchimento.
 */
export type SiteConfig = {
  name: string;
  owner: string;
  tagline: string;
  /**
   * Slug do projeto exibido em destaque na Home. Decisão editorial explícita.
   * Com `null`, ou se o slug não existir na listagem pública, a Home usa a
   * heurística: Concluído, depois Em desenvolvimento, depois Planejado.
   */
  featuredProjectSlug: string | null;
  /**
   * Slug do projeto que representa o próprio DevStation. A página Engenharia
   * usa as decisões, o planejamento e os artigos ligados a ele. Se o slug não
   * existir na API, as seções dependentes degradam sem quebrar a página.
   */
  engineeringProjectSlug: string | null;
  links: {
    github: string;
    linkedin: string | null;
    email: string | null;
  };
};

export const siteConfig: SiteConfig = {
  name: "DevStation",
  owner: "Caroline Teixeira",
  tagline: "Backend • Automação • Engenharia de Software",
  featuredProjectSlug: null,
  engineeringProjectSlug: "devstation",
  links: {
    github: "https://github.com/caahteixeiira",
    linkedin: null, // TODO: preencher com a URL pública completa do seu LinkedIn.
    email: null, // TODO: preencher com seu e-mail público de contato (sem mailto:).
  },
};
