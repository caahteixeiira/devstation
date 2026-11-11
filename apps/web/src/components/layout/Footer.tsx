import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowUpRightIcon } from "@/components/ui/icons";

const footerLinkStyles =
  "inline-flex items-center gap-1 rounded-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="public-footer border-t border-border bg-background py-8">
      <div className="public-container public-gutter flex flex-col gap-6 px-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">
            {siteConfig.name}
          </p>

          <p className="mt-1 text-foreground-muted">
            © {currentYear} {siteConfig.owner}. Todos os direitos reservados.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link href="/projetos" className={footerLinkStyles}>
                Projetos
              </Link>
            </li>

            <li>
              <Link href="/artigos" className={footerLinkStyles}>
                Artigos
              </Link>
            </li>

            <li>
              <Link href="/engenharia" className={footerLinkStyles}>
                Engenharia
              </Link>
            </li>

            <li>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkStyles}
              >
                GitHub
                <ArrowUpRightIcon className="size-3.5" />
              </a>
            </li>
            <li>
              <Link href="/" className={footerLinkStyles}>
                Voltar ao início
              </Link>
            </li>
            {siteConfig.links.linkedin && (
              <li>
                <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className={footerLinkStyles}>
                  LinkedIn
                  <ArrowUpRightIcon className="size-3.5" />
                </a>
              </li>
            )}
            <li>
              <Link href="/admin/login" className={`${footerLinkStyles} text-xs`}>
                Área administrativa
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
