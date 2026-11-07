"use client";

import { ErrorState } from "@/components/ui/ErrorState";



type ExperiencesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ExperiencesError({
  reset,
}: ExperiencesErrorProps) {


  return (<div className="admin-error"><ErrorState title="Não foi possível carregar esta página" description="Ocorreu um problema ao carregar a área de experiências. Tente novamente." reset={reset} backHref="/admin" backLabel="Voltar à administração" /></div>);
}
