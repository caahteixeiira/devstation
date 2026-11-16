"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/ui/ErrorState";

export function CertificationLoadError() {
  const router = useRouter();
  return <ErrorState title="Não foi possível carregar as certificações" reset={() => router.refresh()} />;
}
