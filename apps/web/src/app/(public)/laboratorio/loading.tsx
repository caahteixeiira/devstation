import { PageIntro } from "@/components/layout/PageIntro";
import { Skeleton } from "@/components/ui/Skeleton";
import { ExperimentCardSkeleton } from "@/app/features/lab/ExperimentCard";
import { labPageIntro } from "@/app/features/lab/intro";

export default function LaboratorioLoading() {
  return (
    <PageIntro {...labPageIntro}>
      <p role="status" className="sr-only">
        Carregando experimentos…
      </p>

      <div className="mt-12">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-8 w-48" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ExperimentCardSkeleton />
          <ExperimentCardSkeleton />
          <ExperimentCardSkeleton />
          <ExperimentCardSkeleton />
        </div>
      </div>
    </PageIntro>
  );
}
