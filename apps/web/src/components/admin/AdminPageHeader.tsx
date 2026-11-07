import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";

export function AdminPageHeader({ title, description, actions, breadcrumb }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; breadcrumb?: BreadcrumbItem[] }) {
  return (
    <header className="admin-page-header">
      {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-5" />}
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0 max-w-3xl"><h1>{title}</h1>{description && <p className="mt-2 text-sm leading-6 text-foreground-muted">{description}</p>}</div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
