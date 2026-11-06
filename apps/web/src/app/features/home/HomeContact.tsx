import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { CodeIcon } from "@/components/ui/icons";
import { HomeSection } from "./HomeSection";

/**
 * Encerramento da Home em faixa invertida. Os canais vêm só de `site.ts`:
 * o GitHub é o único configurado hoje; LinkedIn e e-mail ficam na página de
 * contato quando forem informados.
 */
export function HomeContact() {
  return (
    <HomeSection labelledBy="contact-title" tone="inverted">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Contato
          </p>

          <h2
            id="contact-title"
            className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Vamos conversar?
          </h2>

          <p className="mt-4 max-w-xl leading-7 text-background/75 dark:text-foreground-muted">
            Aberta a conexões, oportunidades e conversas sobre engenharia de
            software e tecnologia.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contato">Entrar em contato</ButtonLink>

          <ButtonLink
            href={siteConfig.links.github}
            external
            variant="secondary"
          >
            <CodeIcon className="size-4" />
            GitHub
          </ButtonLink>
        </div>
      </div>
    </HomeSection>
  );
}
