"use client";
import { ErrorState } from "@/components/ui/ErrorState";

export default function CertificationsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState title="Não foi possível carregar as certificações" reset={reset} backHref="/sobre" backLabel="Voltar para Sobre" />;
}
