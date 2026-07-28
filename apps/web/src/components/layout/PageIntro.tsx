import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "primary" | "accent";
  children?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  accent = "primary",
  children,
}: PageIntroProps) {
  const eyebrowColor =
    accent === "accent" ? "text-accent-strong" : "text-primary-strong";

  return (
    <main className="flex flex-1 px-6 py-16">
      <section className="mx-auto w-full max-w-5xl">
        <p
          className={`font-mono text-sm uppercase tracking-widest ${eyebrowColor}`}
        >
          {eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground-muted">
          {description}
        </p>

        {children}
      </section>
    </main>
  );
}
