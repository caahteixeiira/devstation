"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon } from "@/components/ui/icons";

const fieldClassName = "mt-2 w-full rounded-control border border-border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ContactForm() {
  const [notice, setNotice] = useState("");
  const email = siteConfig.links.email;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const sender = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !subject || !message) {
      setNotice("Preencha nome, assunto e mensagem com mais do que espaços em branco.");
      return;
    }

    const body = `Nome: ${name}\nE-mail: ${sender}\n\n${message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNotice("Solicitamos a abertura do seu aplicativo de e-mail. Revise a mensagem e envie por lá. Se ele não abrir, use o link de e-mail ao lado.");
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="contact-form-title" aria-describedby="contact-form-help" className="contact-form-panel rounded-[1.75rem] border border-border p-6 shadow-card sm:p-8 lg:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">Sua próxima ideia começa aqui</p>
      <h2 id="contact-form-title" className="mt-3">Deixe sua mensagem</h2>
      <p id="contact-form-help" className="mt-3 text-sm leading-6 text-foreground-muted">
        Todos os campos são obrigatórios. Ao enviar, seu aplicativo de e-mail será aberto com a mensagem preenchida. O envio é concluído por você, por lá.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium">Nome</label>
          <input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder="Como posso te chamar?" className={fieldClassName} />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium">E-mail</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="voce@exemplo.com" className={fieldClassName} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className="text-sm font-medium">Assunto</label>
          <input id="contact-subject" name="subject" required maxLength={160} placeholder="Sobre o que vamos conversar?" className={fieldClassName} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="text-sm font-medium">Mensagem</label>
          <textarea id="contact-message" name="message" required rows={6} maxLength={3000} placeholder="Conte um pouco sobre sua ideia, projeto ou oportunidade…" className={`${fieldClassName} min-h-40 resize-y leading-7`} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={!email} className="public-button w-full sm:w-auto">
          Enviar mensagem<ArrowUpRightIcon />
        </Button>
        <p className="text-xs leading-5 text-foreground-muted">Sem envio automático ou armazenamento neste site.</p>
      </div>
      {!email && <p className="mt-4 text-sm text-foreground-muted">O envio estará disponível quando o e-mail de contato for configurado. Por enquanto, fale comigo pelo LinkedIn.</p>}
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 text-sm leading-6 text-foreground-muted">{notice}</p>
    </form>
  );
}
