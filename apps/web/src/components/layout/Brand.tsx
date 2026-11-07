import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cx } from "@/lib/cx";
import { AsteriskIcon } from "@/components/ui/icons";

type BrandProps = {
  compact?: boolean;
  className?: string;
  onNavigate?: () => void;
};

/**
 * Marca pública do DevStation. Sempre leva para "/".
 */
export function Brand({ compact = false, className, onNavigate }: BrandProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cx(
        "group inline-flex items-center gap-2.5 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-xl text-background transition-colors group-hover:bg-primary-strong motion-reduce:transition-none"
      >
        <AsteriskIcon />
      </span>

      <span className="flex flex-col leading-tight">
        <span className="text-[17px] font-bold tracking-tight text-foreground">
          {siteConfig.name}
        </span>

        {!compact && (
          <span className="text-[11px] text-foreground-subtle">
            Portfólio de engenharia
          </span>
        )}
      </span>
      <span className="sr-only"> — página inicial</span>
    </Link>
  );
}
