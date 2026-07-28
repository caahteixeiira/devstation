import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/10 px-6 py-4 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold">
          DevStation
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link href="/">Início</Link>
            </li>

            <li>
              <Link href="/projetos">Projetos</Link>
            </li>

            <li>
              <Link href="/artigos">Artigos</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
