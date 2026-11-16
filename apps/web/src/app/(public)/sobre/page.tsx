import type { Metadata } from "next";
import { connection } from "next/server";
import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CertificationsSection } from "@/app/features/certifications/CertificationsSection";
import { AboutExperienceTimeline } from "@/app/features/experiences/AboutExperienceTimeline";

export const metadata: Metadata = {
  title: "Sobre mim",
  description: "Trajetória profissional de Caroline Teixeira, forma de pensar software e direção de evolução.",
};

export default async function SobrePage() {
  // Renderização em tempo de requisição: nada é buscado no build.
  await connection();

  return (
    <PageIntro
      eyebrow="Trajetória profissional"
      title="Sobre mim"
      description="Minha trajetória em tecnologia, a forma como penso sobre desenvolvimento de software e os princípios que orientam meu trabalho."
      actions={
        <ButtonLink href="/contato" variant="secondary">
          Entrar em contato
        </ButtonLink>
      }
    >
      <section aria-labelledby="who-title" className="mt-12">
        <SectionHeader id="who-title" eyebrow="Quem sou" title="Quem sou" />

        <div className="mt-5 max-w-3xl space-y-5 text-lg leading-8 text-foreground-muted">
          <p>
            Sou desenvolvedora de software com foco em back-end, automação e
            engenharia de software. Gosto de
            entender processos, identificar problemas e transformá-los em
            soluções que reduzam trabalho manual e tornem as rotinas mais
            simples e organizadas.
          </p>

          <p>
            Mais do que fazer uma funcionalidade funcionar, tenho interesse em
            entender como ela se encaixa no sistema, como será mantida e como
            poderá evoluir no futuro.
          </p>

          <p>
            Hoje também venho aprofundando meus estudos em arquitetura de
            software, DevOps e Inteligência Artificial, com foco em evoluir para
            uma atuação como AI Builder, criando aplicações que integrem IA a
            produtos e processos reais. É uma direção de desenvolvimento que
            complementa minha base em software, back-end e automação.
          </p>
        </div>
      </section>

      <section aria-labelledby="experience-title" className="mt-16">
        <SectionHeader
          id="experience-title"
          eyebrow="Trajetória"
          title="Experiência profissional"
          description="Uma trajetória que conecta desenvolvimento de software, automação e processos reais."
        />

        <div className="mt-8">
          <AboutExperienceTimeline />
        </div>
      </section>

      <CertificationsSection />

      <section aria-labelledby="mindset-title" className="mt-16">
        <SectionHeader
          id="mindset-title"
          eyebrow="Forma de trabalhar"
          title="Como penso e como evoluo"
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card tone="muted">
            <h3 className="font-semibold text-foreground">
              Como eu penso software
            </h3>

            <p className="mt-3 leading-7 text-foreground-muted">
              Antes de adicionar uma tecnologia, gosto de entender qual problema
              ela resolve, por que faz sentido naquele contexto e qual será sua
              responsabilidade dentro da aplicação.
            </p>

            <p className="mt-3 leading-7 text-foreground-muted">
              Também valorizo a separação de responsabilidades. Um código pode
              começar pequeno, mas precisa estar preparado para crescer sem
              transformar cada alteração em um problema de manutenção.
            </p>
          </Card>

          <Card tone="muted">
            <h3 className="font-semibold text-foreground">
              Evolução profissional
            </h3>

            <p className="mt-3 leading-7 text-foreground-muted">
              Minha evolução em desenvolvimento acontece principalmente colocando
              a mão na massa. Estudo um conceito, tento entendê-lo de verdade e
              depois procuro aplicá-lo em projetos nos quais consigo enxergar o
              problema que aquela solução está resolvendo.
            </p>

            <p className="mt-3 leading-7 text-foreground-muted">
              Sigo fortalecendo minha base em back-end, bancos de dados,
              processamento assíncrono e testes. Os estudos em arquitetura de
              software, DevOps e construção de aplicações com IA ampliam essa
              base, sempre conectando o aprendizado a problemas concretos.
            </p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="direction-title" className="mt-16">
        <SectionHeader
          id="direction-title"
          eyebrow="Direção"
          title="Onde quero chegar"
        />

        <p className="mt-5 max-w-3xl border-l-2 border-primary-strong pl-5 text-lg leading-8 text-foreground">
          Quero continuar me desenvolvendo como engenheira de software, com uma
          base sólida em back-end e uma compreensão cada vez maior de
          arquitetura, infraestrutura e das decisões envolvidas na construção
          de sistemas confiáveis e escaláveis.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/projetos">
            Ver projetos
            <ArrowRightIcon className="size-4" />
          </ButtonLink>

          <ButtonLink href="/contato" variant="secondary">
            Entrar em contato
          </ButtonLink>
        </div>
      </section>
    </PageIntro>
  );
}
