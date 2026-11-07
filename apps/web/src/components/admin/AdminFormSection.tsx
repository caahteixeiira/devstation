import type { ReactNode } from "react";

export function AdminFormSection({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section className="admin-form-section" aria-labelledby={id}>
      <header><h2 id={id}>{title}</h2>{description && <p className="mt-1 text-sm leading-6 text-foreground-muted">{description}</p>}</header>
      <div className="admin-form-fields">{children}</div>
    </section>
  );
}
