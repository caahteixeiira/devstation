import { PageIntro } from "@/components/layout/PageIntro";
import { ContactCard } from "@/app/features/contact/ContactCard";

export default function ContatoPage() {
  return (
    <PageIntro
      eyebrow="Contato"
      title="Vamos conversar?"
      description="Estou aberta a conexões, oportunidades e conversas sobre desenvolvimento de software e tecnologia."
    >
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <ContactCard
          title="LinkedIn"
          description="Experiência profissional e conexões."
          href="SEU_LINKEDIN"
        />

        <ContactCard
          title="GitHub"
          description="Projetos, experimentos e código."
          href="SEU_GITHUB"
        />

        <ContactCard
          title="E-mail"
          description="Entre em contato diretamente comigo."
          href="mailto:SEU_EMAIL"
        />
      </div>
    </PageIntro>
  );
}