import { Skeleton } from "@/components/ui/Skeleton";
export default function AdminProjectsLoading() {
  return (
    <section>
      <h1 className="text-3xl font-semibold">
        Projetos
      </h1>

      <p role="status" className="mt-6 text-foreground-muted">
        Carregando projetos…
      </p>
      <div className="admin-loading mt-6"><Skeleton className="h-9 w-2/3" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
    </section>
  );
}