import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 px-6 py-6 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground/70">
          © {currentYear} Caroline Teixeira. Todos os direitos reservados.
        </p>

        <nav aria-label="Navegação do rodapé">
          <ul className="flex items-center gap-5">
            <li>
              <Link
                href="/projetos"
                className="transition-opacity hover:opacity-70"
              >
                Projetos
              </Link>
            </li>

            <li>
              <Link
                href="/artigos"
                className="transition-opacity hover:opacity-70"
              >
                Artigos
              </Link>
            </li>

            <li>
              <a
                href="https://github.com/caahteixeiira"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
