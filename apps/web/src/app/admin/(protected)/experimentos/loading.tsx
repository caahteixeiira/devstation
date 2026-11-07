import { Skeleton } from "@/components/ui/Skeleton";
export default function ExperimentsLoading() {
  return (
    <section aria-busy="true">
      <h1 className="text-3xl font-semibold">
        Experimentos
      </h1>

      <p role="status" className="mt-4 text-foreground-muted">
        Carregando experimentos…
      </p>
      <div className="admin-loading mt-6"><Skeleton className="h-9 w-2/3" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
    </section>
  );
}