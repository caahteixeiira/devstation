"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { isActivePath, navigationGroups } from "./navigation";

type NavListProps = {
 ariaLabel: string;
 className?: string;
 onNavigate?: () => void;
 horizontal?: boolean;
};

export function NavList({ ariaLabel, className, onNavigate, horizontal = false }: NavListProps) {
 const pathname = usePathname();
 return (
  <nav aria-label={ariaLabel} className={className}>
   <ul className={horizontal ? "flex items-center gap-0.5 xl:gap-1" : "grid gap-1 sm:grid-cols-2"}>
    {navigationGroups.flatMap((group) => group.items).map((item) => {
     const active = isActivePath(pathname, item.href);
     return (
      <li key={item.href}>
       <Link href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate}
        className={cx("flex min-h-11 items-center rounded-sm border-b-2 px-2 text-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong motion-reduce:transition-none xl:px-3 xl:text-base",
         active ? "border-primary-strong bg-surface-muted font-semibold text-foreground" : "border-transparent text-foreground-muted hover:text-foreground")}
       >{item.label}</Link>
      </li>
     );
    })}
   </ul>
  </nav>
 );
}
