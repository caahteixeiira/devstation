"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigationItems } from "./navigation";

const linkStyles =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface md:hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="rounded-sm font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong"
          onClick={() => setIsMenuOpen(false)}
        >
          DevStation
        </Link>

        <button
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((currentState) => !currentState)}
          className="rounded-lg px-3 py-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong"
        >
          <span aria-hidden="true">{isMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação móvel"
          className="border-t border-border px-4 py-4"
        >
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${linkStyles} ${
                      isActive
                        ? "bg-primary/20 font-semibold text-primary-strong"
                        : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    }`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
