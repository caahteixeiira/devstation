import { ContactActions } from "@/components/layout/ContactActions";
import { HomeSection } from "./HomeSection";

export function HomeContact() {
  return (
    <HomeSection labelledBy="contact-title" tone="inverted">
      <p className="text-xs uppercase tracking-[0.2em]">Contato</p>
      <h2 id="contact-title" className="mt-4 max-w-3xl">Vamos conversar?</h2>
      <p className="mt-5 max-w-xl leading-7">Estou aberta a oportunidades, projetos e conversas sobre desenvolvimento backend e engenharia de software.</p>
      <div className="mt-7">
        <ContactActions inverted />
      </div>
    </HomeSection>
  );
}
