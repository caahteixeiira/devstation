export type Article = {
  id: string;
  title: string;
  summary: string;
  category: string;
  project: string;
  slug: string;
};

export const articles: Article[] = [
  {
    id: "1",
    title: "Por que escolhi React para o DevStation?",
    summary:
      "Como a componentização e a reutilização de interfaces influenciaram a escolha do React no desenvolvimento do DevStation.",
    category: "Frontend",
    project: "DevStation",
    slug: "por-que-escolhi-react-no-devstation",
  },
  {
    id: "2",
    title: "Monorepo e Modular Monolith são a mesma coisa?",
    summary:
      "Entendendo as responsabilidades de cada abordagem e por que ambas fazem parte da arquitetura do DevStation.",
    category: "Arquitetura",
    project: "DevStation",
    slug: "monorepo-vs-modular-monolith",
  },
];