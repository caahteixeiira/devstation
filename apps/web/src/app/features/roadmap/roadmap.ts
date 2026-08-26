export type RoadmapStatus = "now" | "next" | "future";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
};

export const roadmapItems: RoadmapItem[] = [
  {
    id: "1",
    title: "Experiência pública",
    description:
      "Construção e refinamento das principais páginas públicas do DevStation.",
    status: "now",
  },
  {
  id: "2",
  title: "Persistência de dados",
  description:
    "Modelar as entidades do DevStation e integrar PostgreSQL e Prisma para substituir os dados estáticos.",
  status: "next",
},
{
  id: "3",
  title: "DevStation API",
  description:
    "Construir a API com Fastify e TypeScript para expor projetos, artigos, experiências e demais dados da plataforma.",
  status: "next",
},
  {
    id: "4",
    title: "Área administrativa",
    description:
      "Criação de uma área autenticada para administrar projetos, artigos e outros conteúdos.",
    status: "future",
  },
  {
    id: "5",
    title: "Observabilidade",
    description:
      "Adicionar health checks, logs estruturados e mecanismos para acompanhar a saúde da aplicação.",
    status: "future",
  },
  {
    id: "6",
    title: "CI/CD",
    description:
      "Automatizar validações, testes e processos de entrega da aplicação.",
    status: "future",
  },
];