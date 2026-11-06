import { PageIntro } from "@/components/layout/PageIntro";
import { Skeleton } from "@/components/ui/Skeleton";
import { RoadmapGroupSkeleton } from "@/app/features/roadmap/RoadmapGroup";
import { roadmapPageIntro } from "@/app/features/roadmap/intro";

export default function RoadmapLoading() {
  return (
    <PageIntro {...roadmapPageIntro}>
      <p role="status" className="sr-only">
        Carregando planejamento…
      </p>

      <div className="mt-8 max-w-xl">
        <Skeleton className="h-3 w-64" />
        <Skeleton className="mt-3 h-1.5 w-full" />
      </div>

      <div className="relative mt-12">
        <div
          aria-hidden="true"
          className="absolute bottom-2 left-3 top-2 w-px bg-border"
        />

        <div className="space-y-14">
          <RoadmapGroupSkeleton />
          <RoadmapGroupSkeleton />
        </div>
      </div>
    </PageIntro>
  );
}
