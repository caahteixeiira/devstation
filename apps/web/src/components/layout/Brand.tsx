import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cx } from "@/lib/cx";

type BrandProps = {
  compact?: boolean;
  className?: string;
  onNavigate?: () => void;
};

/**
 * Marca do DevStation: prompt ">_" + nome em mono. Sempre leva para "/".
 */
export function Brand({ compact = false, className, onNavigate }: BrandProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, página inicial`}
      onClick={onNavigate}
      className={cx(
        "group inline-flex items-center gap-2.5 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 font-mono text-xs font-semibold text-primary-strong transition-colors group-hover:border-primary/60"
      >
        &gt;_
      </span>

      <span className="flex flex-col leading-tight">
        <span className="font-mono text-sm font-semibold text-foreground">
          {siteConfig.name}
        </span>

        {!compact && (
          <span className="text-[11px] text-foreground-subtle">
            {siteConfig.owner}
          </span>
        )}
      </span>
    </Link>
  );
}
