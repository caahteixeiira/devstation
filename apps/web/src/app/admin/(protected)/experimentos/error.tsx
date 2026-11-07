"use client";

import { ErrorState } from "@/components/ui/ErrorState";



type ExperimentsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ExperimentsError({
  reset,
}: ExperimentsErrorProps) {


  return (<div className="admin-error"><ErrorState title="Não foi possível carregar esta página" description="Ocorreu um problema ao carregar a área de experimentos. Tente novamente." reset={reset} backHref="/admin" backLabel="Voltar à administração" /></div>);
}
