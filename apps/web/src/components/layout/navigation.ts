import type { ComponentType, SVGProps } from "react";
import {
  BookIcon,
  EngineeringIcon,
  FlaskIcon,
  FolderIcon,
  HomeIcon,
  MailIcon,
  MapIcon,
  UserIcon,
} from "@/components/ui/icons";

export type NavigationItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Explorar",
    items: [
      { href: "/", label: "Início", icon: HomeIcon },
      { href: "/projetos", label: "Projetos", icon: FolderIcon },
      { href: "/artigos", label: "Artigos", icon: BookIcon },
    ],
  },
  {
    label: "Aprofundar",
    items: [
      { href: "/engenharia", label: "Engenharia", icon: EngineeringIcon },
      { href: "/laboratorio", label: "Laboratório", icon: FlaskIcon },
      { href: "/roadmap", label: "Planejamento", icon: MapIcon },
    ],
  },
  {
    label: "Pessoal",
    items: [
      { href: "/sobre", label: "Sobre", icon: UserIcon },
      { href: "/contato", label: "Contato", icon: MailIcon },
    ],
  },
];

/**
 * Item ativo: "/" só com correspondência exata; demais rotas quando o
 * caminho é igual ao href ou é uma rota filha ("/projetos/slug").
 * Evita falsos positivos por prefixo, como "/projetos-x".
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
