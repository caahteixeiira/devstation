import { Skeleton } from "@/components/ui/Skeleton";
export default function CertificationAdminLoading() {
  return <div className="admin-loading"><p role="status">Carregando certificações…</p><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>;
}
