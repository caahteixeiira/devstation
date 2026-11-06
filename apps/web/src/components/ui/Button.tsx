import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

type ButtonOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-strong",
  secondary:
    "border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted",
  ghost: "text-primary-strong hover:bg-primary/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export function buttonClassName(
  { variant = "primary", size = "md" }: ButtonOptions = {},
  className?: string,
) {
  return cx(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

type ButtonProps = ButtonOptions &
  Omit<ComponentPropsWithoutRef<"button">, "className"> & {
    className?: string;
  };

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size }, className)}
      {...rest}
    />
  );
}

type ButtonLinkProps = ButtonOptions & {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Link com aparência de botão. Com `external`, abre em nova aba com rel
 * seguro; caso contrário usa o Link do Next para navegação interna.
 */
export function ButtonLink({
  href,
  external = false,
  variant,
  size,
  className,
  children,
}: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size }, className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
