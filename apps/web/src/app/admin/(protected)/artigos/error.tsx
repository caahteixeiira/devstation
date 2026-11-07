"use client";

import { ErrorState } from "@/components/ui/ErrorState";



type AdminArticlesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminArticlesError({
  reset,
}: AdminArticlesErrorProps) {


  return (<div className="admin-error"><ErrorState title="Não foi possível carregar esta página" description="Ocorreu um problema ao carregar a área de artigos. Tente novamente." reset={reset} backHref="/admin" backLabel="Voltar à administração" /></div>);
}
