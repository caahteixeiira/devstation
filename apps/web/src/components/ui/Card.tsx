import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";

type CardTone = "surface" | "muted";
type CardPadding = "none" | "sm" | "md" | "lg";

export type CardOptions = {
  tone?: CardTone;
  interactive?: boolean;
  padding?: CardPadding;
};

const toneStyles: Record<CardTone, string> = {
  surface: "border-border bg-surface shadow-card",
  muted: "border-border bg-surface-muted",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const interactiveStyles =
  "transition hover:-translate-y-0.5 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/**
 * Classes do Card para elementos que não podem ser o próprio componente,
 * como um Link que envolve o card inteiro.
 */
export function cardClassName(
  { tone = "surface", interactive = false, padding = "md" }: CardOptions = {},
  className?: string,
) {
  return cx(
    "rounded-card border",
    toneStyles[tone],
    paddingStyles[padding],
    interactive && interactiveStyles,
    className,
  );
}

type CardElement = "div" | "article" | "section" | "li" | "aside";

type CardProps<T extends CardElement> = CardOptions & {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children">;

export function Card<T extends CardElement = "div">({
  as,
  tone,
  interactive,
  padding,
  className,
  children,
  ...rest
}: CardProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cardClassName({ tone, interactive, padding }, className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
