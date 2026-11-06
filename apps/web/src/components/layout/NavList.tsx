"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { isActivePath, navigationGroups } from "./navigation";

type NavListProps = {
  ariaLabel: string;
  className?: string;
  onNavigate?: () => void;
};

const linkStyles =
  "group relative flex h-9 items-center gap-2.5 rounded-control px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

/**
 * Lista de navegação agrupada, compartilhada pela sidebar e pelo menu mobile.
 */
export function NavList({ ariaLabel, className, onNavigate }: NavListProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={cx("space-y-6", className)}>
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
            {group.label}
          </p>

          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const isActive = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                    className={cx(
                      linkStyles,
                      isActive
                        ? "bg-primary/10 font-medium text-foreground"
                        : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -left-3 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-strong"
                      />
                    )}

                    <Icon
                      className={cx(
                        "size-4 transition-colors",
                        isActive
                          ? "text-primary-strong"
                          : "text-foreground-subtle group-hover:text-foreground-muted",
                      )}
                    />

                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
