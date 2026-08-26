type ContactCardProps = {
  title: string;
  description: string;
  href: string;
};

export function ContactCard({
  title,
  description,
  href,
}: ContactCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-1"
    >
      <h2 className="text-xl font-semibold text-foreground">
        {title}
      </h2>

      <p className="mt-2 text-foreground-muted">
        {description}
      </p>

      <span className="mt-5 inline-block text-sm font-medium text-primary-strong">
        Acessar ↗
      </span>
    </a>
  );
}