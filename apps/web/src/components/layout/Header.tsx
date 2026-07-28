import Link from "next/link";

const linkStyles =
  "rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background";

export function Header() {
  return (
    <header className="border-b border-black/10 px-6 py-4 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="rounded-sm font-mono text-sm font-semibold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          DevStation
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link href="/" className={linkStyles}>
                Início
              </Link>
            </li>

            <li>
              <Link href="/projetos" className={linkStyles}>
                Projetos
              </Link>
            </li>

            <li>
              <Link href="/artigos" className={linkStyles}>
                Artigos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
