import Link from "next/link";

const portfolioAreas = [
  {
    title: "Projetos",
    description:
      "Conheça as aplicações que desenvolvi, os problemas resolvidos e as tecnologias utilizadas.",
    href: "/projetos",
  },
  {
    title: "Engenharia",
    description:
      "Explore decisões de arquitetura, documentação técnica e práticas de engenharia de software.",
    href: "/engenharia",
  },
  {
    title: "Artigos",
    description:
      "Acompanhe meus estudos, aprendizados e conteúdos sobre desenvolvimento de software.",
    href: "/artigos",
  },
  {
    title: "Laboratório",
    description:
      "Veja experimentos, provas de conceito e tecnologias que estou testando na prática.",
    href: "/laboratorio",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 px-6 py-16">
      <section className="mx-auto w-full max-w-5xl">
        <div>
          <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
            Backend • Automação • Engenharia de Software
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            DevStation
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground-muted">
            Não é apenas um currículo; é um ecossistema de projetos, estudos e
            decisões de engenharia.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {portfolioAreas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="group rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary-strong hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold transition-colors group-hover:text-primary-strong">
                {area.title}
              </h2>

              <p className="mt-3 leading-7 text-foreground-muted">
                {area.description}
              </p>

              <span className="mt-6 inline-block font-mono text-sm text-primary-strong">
                Explorar área →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
