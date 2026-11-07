"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AsteriskIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { adminNavigation, isAdminPathActive } from "./admin-navigation";

export function AdminSidebar({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <div className="admin-sidebar-content">
      <Link href="/admin" onClick={onNavigate} className="admin-brand">
        <span className="admin-brand-symbol"><AsteriskIcon /></span>
        <span><strong>DevStation</strong><span className="block text-xs text-foreground-muted">Workspace administrativo</span></span>
      </Link>
      <p className="admin-nav-label">Gerenciamento</p>
      <nav aria-label={mobile ? "Navegação administrativa móvel" : "Navegação administrativa"}>
        <ul className="space-y-1">
          {adminNavigation.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} onClick={onNavigate} aria-current={isAdminPathActive(pathname, href) ? "page" : undefined} className="admin-nav-link">
                <Icon className="size-4" /><span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="admin-sidebar-bottom">
        <Link href="/" onClick={onNavigate} className="admin-nav-link">
          <ArrowUpRightIcon className="size-4" />Ver site público
        </Link>
        <p className="mt-4 px-3 text-xs leading-5 text-foreground-subtle">Conteúdo, engenharia e evolução<br />em um só lugar.</p>
      </div>
    </div>
  );
}
