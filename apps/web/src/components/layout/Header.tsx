"use client";

import { useNavigationMenu } from "./use-navigation-menu";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { Brand } from "./Brand";
import { NavList } from "./NavList";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Header público horizontal a partir de lg. O menu móvel abre como painel
 * sobreposto e fecha ao navegar, ao clicar fora ou ao pressionar Escape.
 */
export function Header() {
  const { isMenuOpen, setIsMenuOpen, buttonRef, panelRef, closeMenu } = useNavigationMenu();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="public-container relative">
        <div className="public-gutter flex min-h-20 items-center justify-between gap-3 px-6">
          <Brand onNavigate={closeMenu} className="shrink-0" />
          <div className="ml-auto flex min-w-0 items-center gap-2 lg:gap-3">
            <NavList ariaLabel="Navegação principal" horizontal className="hidden lg:block" />
            <ThemeToggle />

            <button
              ref={buttonRef}
              type="button"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((currentState) => !currentState)}
              className="flex size-11 shrink-0 lg:hidden items-center justify-center rounded-control text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            ref={panelRef}
            id="mobile-navigation"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto lg:hidden border-b border-border bg-surface px-4 py-4 shadow-card"
          >
            <NavList ariaLabel="Navegação móvel" onNavigate={closeMenu} />
          </div>
        )}
      </div>
    </header>
  );
}
