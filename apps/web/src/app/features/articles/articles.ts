export type Article = {
  id: string;
  title: string;
  summary: string;
  category: string;
  project: string;
  slug: string;
  introduction: string;
  why: string;
  application: string;
  learning: string;
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

  introduction:
    "O DevStation precisava de uma interface organizada, reutilizável e preparada para crescer sem duplicar estruturas entre as páginas.",

  why:
    "O React foi escolhido porque permite dividir a interface em componentes reutilizáveis e trabalhar com composição. Isso facilita a manutenção conforme novas páginas e funcionalidades são adicionadas ao projeto.",

  application:
    "No DevStation, o React está sendo utilizado na criação de componentes como Header, Sidebar, Footer, PageIntro e ArticleCard. Esses componentes são reutilizados em diferentes partes da aplicação.",

  learning:
    "Durante o desenvolvimento, aprendi que componentização não significa apenas dividir arquivos. Um componente deve possuir uma responsabilidade clara e ser reutilizado somente quando isso realmente fizer sentido.",
},
];