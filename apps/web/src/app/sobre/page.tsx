import { PageIntro } from "@/components/layout/PageIntro";

export default function SobrePage() {
  return (
    <PageIntro
      eyebrow="Trajetória profissional"
      title="Sobre mim"
      description="Minha trajetória em tecnologia, a forma como penso sobre desenvolvimento de software e os princípios que orientam meu trabalho."
    >
      <div className="mt-10 space-y-8">
        <section className="rounded-2xl border border-border bg-surface p-6">
  <h2 className="text-2xl font-semibold text-foreground">
    Quem sou
  </h2>

  <p className="mt-4 leading-7 text-foreground-muted">
    Sou desenvolvedora com foco em back-end e automação. Gosto de entender
    processos, identificar problemas e transformá-los em soluções que reduzam
    trabalho manual e tornem as rotinas mais simples e organizadas.
  </p>

  <p className="mt-4 leading-7 text-foreground-muted">
    Mais do que fazer uma funcionalidade funcionar, tenho interesse em
    entender como ela se encaixa no sistema, como será mantida e como poderá
    evoluir no futuro.
  </p>
</section>

        <section className="rounded-2xl border border-border bg-surface p-6">
  <h2 className="text-2xl font-semibold text-foreground">
    Como eu penso software
  </h2>

  <p className="mt-4 leading-7 text-foreground-muted">
    Antes de adicionar uma tecnologia, gosto de entender qual problema ela
    resolve, por que faz sentido naquele contexto e qual será sua
    responsabilidade dentro da aplicação.
  </p>

  <p className="mt-4 leading-7 text-foreground-muted">
    Também valorizo a separação de responsabilidades. Um código pode começar
    pequeno, mas precisa estar preparado para crescer sem transformar cada
    alteração em um problema de manutenção.
  </p>
</section>

        <section className="rounded-2xl border border-border bg-surface p-6">
  <h2 className="text-2xl font-semibold text-foreground">
    Evolução profissional
  </h2>

  <p className="mt-4 leading-7 text-foreground-muted">
    Minha evolução em desenvolvimento acontece principalmente colocando a mão
    na massa. Estudo um conceito, tento entendê-lo de verdade e depois procuro
    aplicá-lo em projetos nos quais consigo enxergar o problema que aquela
    solução está resolvendo.
  </p>

  <p className="mt-4 leading-7 text-foreground-muted">
    Hoje estou aprofundando meus conhecimentos em desenvolvimento back-end,
    arquitetura, bancos de dados, processamento assíncrono, testes e
    infraestrutura, sempre buscando evoluir não apenas na escrita de código,
    mas na forma de projetar software.
  </p>
</section>

<section className="rounded-2xl border border-border bg-surface p-6">
  <h2 className="text-2xl font-semibold text-foreground">
    Onde quero chegar
  </h2>

  <p className="mt-4 leading-7 text-foreground-muted">
    Quero continuar me desenvolvendo como engenheira de software, com uma base
    sólida em back-end e uma compreensão cada vez maior de arquitetura,
    infraestrutura e das decisões envolvidas na construção de sistemas
    confiáveis e escaláveis.
  </p>
</section>
      </div>
    </PageIntro>
  );
}