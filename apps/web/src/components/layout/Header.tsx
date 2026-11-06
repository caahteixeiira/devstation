"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { Brand } from "./Brand";
import { NavList } from "./NavList";

/**
 * Barra superior do mobile (abaixo de md). O menu abre como painel
 * sobreposto e fecha ao navegar, ao clicar fora ou ao pressionar Escape.
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }

      setIsMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur md:hidden">
      <div className="relative">
        <div className="flex h-14 items-center justify-between px-4">
          <Brand compact onNavigate={closeMenu} />

          <button
            ref={buttonRef}
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((currentState) => !currentState)}
            className="flex size-11 items-center justify-center rounded-control text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {isMenuOpen && (
          <div
            ref={panelRef}
            id="mobile-navigation"
            className="absolute inset-x-0 top-full border-b border-border bg-surface px-4 py-4 shadow-card"
          >
            <NavList ariaLabel="Navegação móvel" onNavigate={closeMenu} />
          </div>
        )}
      </div>
    </header>
  );
}
