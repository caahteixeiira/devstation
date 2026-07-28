"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Início" },
  { href: "/projetos", label: "Projetos" },
  { href: "/artigos", label: "Artigos" },
];

const baseLinkStyles =
  "rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/10 px-6 py-4 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          href="/"
          className={`${baseLinkStyles} font-mono text-sm font-semibold`}
        >
          DevStation
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-6 text-sm">
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
                    className={`${baseLinkStyles} ${
                      isActive
                        ? "font-semibold underline underline-offset-4"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
