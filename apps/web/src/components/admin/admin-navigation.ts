import { BookIcon, CalendarIcon, CodeIcon, FlaskIcon, FolderIcon, HomeIcon, UserIcon } from "@/components/ui/icons";

export const adminNavigation = [
  { href: "/admin", label: "Dashboard", description: "Atalhos para o seu espaço de trabalho.", icon: HomeIcon },
  { href: "/admin/projetos", label: "Projetos", description: "Cases, estrutura técnica e decisões de cada projeto.", icon: FolderIcon },
  { href: "/admin/tecnologias", label: "Tecnologias", description: "Catálogo de tecnologias usadas no portfólio.", icon: CodeIcon },
  { href: "/admin/artigos", label: "Artigos", description: "Rascunhos, publicações e conteúdos arquivados.", icon: BookIcon },
  { href: "/admin/experiencias", label: "Experiências", description: "Trajetória, responsabilidades e tecnologias.", icon: UserIcon },
  { href: "/admin/experimentos", label: "Experimentos", description: "Hipóteses e aprendizados do Laboratório.", icon: FlaskIcon },
  { href: "/admin/roadmap", label: "Planejamento", description: "Prioridades e evolução do DevStation.", icon: CalendarIcon },
];

export function isAdminPathActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}
