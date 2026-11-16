"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function StorageCleanupButton({ disabled = false }: { disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function cleanup() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/admin/media/cleanup", { method: "POST" });
      if (!response.ok) throw new Error();
      const { data } = await response.json();
      setMessage(`${data.processed} tarefa(s) processada(s); ${data.remaining} pendente(s).${data.failed ? " O Storage não confirmou todas as remoções; tente novamente." : " Uploads interrompidos aguardam uma margem de segurança de uma hora."}`);
    } catch { setMessage("Não foi possível processar a limpeza. Confira sua sessão e tente novamente."); }
    finally { setBusy(false); }
  }
  return <div className="space-y-2">
    <Button variant="ghost" disabled={disabled || busy} onClick={cleanup}>{busy ? "Limpando…" : "Tentar limpeza de arquivos pendentes"}</Button>
    {message && <p role="status" className="text-sm text-foreground-muted">{message}</p>}
  </div>;
}
