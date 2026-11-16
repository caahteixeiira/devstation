import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ContactForm } from "@/components/layout/ContactForm";
import { ArrowUpRightIcon, CodeIcon, MailIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Canais para conversar sobre desenvolvimento de software, oportunidades e conexões.",
};

export default function ContatoPage() {
  return (
    <PageIntro
      eyebrow="Contato"
      title="Vamos conversar?"
      description="Estou aberta a oportunidades, projetos e conversas sobre desenvolvimento backend e engenharia de software."
    >
      <div className="mt-10 grid items-start gap-6 lg:mt-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
        <div className="space-y-6">
          <section aria-labelledby="contact-channels-title" className="contact-intro-panel rounded-[1.75rem] border border-border p-6 sm:p-8">
            <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-full bg-background text-primary-strong"><MailIcon /></span>
            <h2 id="contact-channels-title" className="mt-6">Boas conversas abrem caminhos.</h2>
            <p className="mt-4 leading-7 text-foreground-muted">Tem uma oportunidade, um desafio técnico ou uma ideia para construir? Escolha o canal que funciona melhor para você.</p>
            <div className="mt-8 space-y-3">
              {siteConfig.links.email && (
                <a href={`mailto:${siteConfig.links.email}`} className="contact-link-card flex min-h-20 items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong motion-reduce:transition-none">
                  <MailIcon className="text-primary-strong" />
                  <span className="min-w-0 flex-1"><span className="block font-semibold">E-mail</span><span className="mt-1 block break-all text-sm text-foreground-muted">{siteConfig.links.email}</span></span>
                  <ArrowUpRightIcon />
                </a>
              )}
              {siteConfig.links.linkedin && (
                <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link-card flex min-h-20 items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong motion-reduce:transition-none">
                  <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center font-bold text-primary-strong">in</span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold">LinkedIn</span><span className="mt-1 block text-sm text-foreground-muted">Conexões e oportunidades</span></span>
                  <span className="sr-only">(abre em nova aba)</span><ArrowUpRightIcon />
                </a>
              )}
            </div>
          </section>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="contact-github-panel flex items-start gap-4 rounded-[1.75rem] border border-border p-6 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong motion-reduce:transition-none sm:p-8">
            <CodeIcon className="mt-1 text-accent-strong" />
            <span className="min-w-0 flex-1"><span className="block text-lg font-semibold">Vamos falar de código?</span><span className="mt-2 block text-sm leading-6 text-foreground-muted">Explore meus projetos e contribuições no GitHub.</span></span>
            <span className="sr-only">(abre em nova aba)</span><ArrowUpRightIcon className="mt-1" />
          </a>
        </div>
        <ContactForm />
      </div>
    </PageIntro>
  );
}
