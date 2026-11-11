import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ContactActions } from "@/components/layout/ContactActions";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Contato",
  description: "Canais para conversar sobre desenvolvimento de software, oportunidades e conexões.",
};

export default function ContatoPage() {
  return (
    <PageIntro
      width="narrow"
      eyebrow="Contato"
      title="Vamos conversar?"
      description="Estou aberta a oportunidades, projetos e conversas sobre desenvolvimento backend e engenharia de software."
    >
      <Card className="mt-10">
        <ContactActions />
      </Card>
    </PageIntro>
  );
}
