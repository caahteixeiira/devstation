import { siteConfig } from "@/config/site";
import { buttonClassName } from "@/components/ui/Button";
import { ArrowRightIcon, ArrowUpRightIcon, MailIcon } from "@/components/ui/icons";

export function ContactActions({ inverted = false }: { inverted?: boolean }) {
  const { email, linkedin, github } = siteConfig.links;
  const primaryStyles = inverted
    ? "contact-channel contact-channel-primary inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-colors motion-reduce:transition-none"
    : buttonClassName();
  const secondaryStyles = inverted
    ? "contact-channel inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-colors motion-reduce:transition-none"
    : buttonClassName({ variant: "secondary" });

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {email ? (
          <a href={`mailto:${email}`} className={primaryStyles}>
            <MailIcon />Enviar e-mail
          </a>
        ) : (
          <button type="button" disabled title="Em breve" className={primaryStyles}>
            <MailIcon />Enviar e-mail
          </button>
        )}
        {linkedin ? (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className={secondaryStyles}>
            LinkedIn<ArrowUpRightIcon />
          </a>
        ) : (
          <button type="button" disabled title="Em breve" className={secondaryStyles}>
            LinkedIn<ArrowUpRightIcon />
          </button>
        )}
      </div>
      <a href={github} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 hover:underline">
        GitHub<ArrowRightIcon />
      </a>
    </div>
  );
}
