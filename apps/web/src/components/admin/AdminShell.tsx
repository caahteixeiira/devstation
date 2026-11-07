"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon, MenuIcon, UserIcon } from "@/components/ui/icons";
import { useNavigationMenu } from "@/components/layout/use-navigation-menu";
import { AdminSidebar } from "./AdminSidebar";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { adminNavigation, isAdminPathActive } from "./admin-navigation";

export function AdminShell({ children, userName, logout }: { children: ReactNode; userName: string; logout: ReactNode }) {
  const pathname = usePathname();
  const { isMenuOpen, setIsMenuOpen, buttonRef, panelRef, closeMenu } = useNavigationMenu({ modal: true });
  const currentModule = adminNavigation.find(item => isAdminPathActive(pathname, item.href));
  return (
    <div className="admin-workspace">
      <a href="#admin-main" className="admin-skip-link">Pular para o conteúdo administrativo</a>
      <aside className="admin-sidebar"><AdminSidebar /></aside>
      <div className="admin-workspace-body" inert={isMenuOpen ? true : undefined}>
        <header className="admin-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <button ref={buttonRef} type="button" className="admin-icon-button lg:hidden" aria-label="Abrir menu administrativo" aria-expanded={isMenuOpen} aria-controls={isMenuOpen ? "admin-mobile-menu" : undefined} onClick={() => setIsMenuOpen(true)}><MenuIcon /></button>
            <div className="min-w-0"><p className="text-xs text-foreground-subtle">Administração</p><p className="truncate text-sm font-semibold">{currentModule?.label ?? "DevStation"}</p></div>
          </div>
          <div className="flex min-w-0 items-center gap-2 sm:gap-5">
            <AdminThemeToggle />
            <span className="hidden size-9 items-center justify-center rounded-full bg-surface-muted text-accent-strong sm:flex"><UserIcon className="size-4" /></span>
            <span className="max-w-16 truncate text-sm font-medium sm:max-w-52">{userName}</span>
            {logout}
          </div>
        </header>
        <main id="admin-main" tabIndex={-1} className="admin-content outline-none">{children}</main>
      </div>
      {isMenuOpen && (
        <div className="admin-drawer-backdrop">
          <div ref={panelRef} id="admin-mobile-menu" role="dialog" aria-modal="true" aria-labelledby="admin-mobile-title" tabIndex={-1} className="admin-drawer">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 id="admin-mobile-title" className="text-sm font-semibold">Menu administrativo</h2>
              <button type="button" onClick={() => { closeMenu(); requestAnimationFrame(() => buttonRef.current?.focus()); }} className="admin-icon-button" aria-label="Fechar menu administrativo"><CloseIcon /></button>
            </div>
            <AdminSidebar mobile onNavigate={() => { closeMenu(); requestAnimationFrame(() => document.getElementById("admin-main")?.focus({ preventScroll: true })); }} />
          </div>
        </div>
      )}
    </div>
  );
}
