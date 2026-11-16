import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function CertificationGridSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">Carregando certificações…</p>
      <div aria-hidden="true" className="grid gap-6 md:grid-cols-2">
        {[0, 1].map((index) => (
          <Card key={index} className="space-y-4">
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-11 w-40" />
          </Card>
        ))}
      </div>
    </div>
  );
}
