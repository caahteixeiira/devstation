"use client";

import { siteConfig } from "@/config/site";
import { ArrowUpRightIcon, CodeIcon } from "@/components/ui/icons";
import { Brand } from "./Brand";
import { NavList } from "./NavList";

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="px-4 pt-5">
        <Brand />
      </div>

      <NavList
        ariaLabel="Navegação principal"
        className="mt-7 flex-1 overflow-y-auto px-3 pb-4"
      />

      <div className="border-t border-border p-3">
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-9 items-center gap-2.5 rounded-control px-3 text-sm text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        >
          <CodeIcon className="size-4 text-foreground-subtle transition-colors group-hover:text-foreground-muted" />
          <span className="flex-1">GitHub</span>
          <ArrowUpRightIcon className="size-3.5 text-foreground-subtle" />
        </a>
      </div>
    </aside>
  );
}
