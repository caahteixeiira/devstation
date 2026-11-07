"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type AdminProjectsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminProjectsError({
  reset,
}: AdminProjectsErrorProps) {


  return (<div className="admin-error"><ErrorState title="Não foi possível carregar os projetos" description="Tente novamente em alguns instantes." reset={reset} /></div>);
}
