import { siteConfig } from "@/config/site";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { HomeSection } from "./HomeSection";

export function HomeContact() {
  const { email, linkedin, github } = siteConfig.links;
  const channels = [
    ...(email ? [{ href: `mailto:${email}`, label: "Enviar e-mail", external: false }] : []),
    ...(linkedin ? [{ href: linkedin, label: "Ver LinkedIn", external: true }] : []),
    ...(github ? [{ href: github, label: "Ver GitHub", external: true }] : []),
  ];
  return (
    <HomeSection labelledBy="contact-title" tone="inverted">
      <p className="text-xs uppercase tracking-[0.2em]">Contato</p>
      <h2 id="contact-title" className="mt-4 max-w-3xl">Vamos conversar sobre boas ideias.</h2>
      <p className="mt-5 max-w-xl leading-7">Aberta a conexões, oportunidades e conversas sobre engenharia de software e tecnologia.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        {channels.map((channel) => (
          <a key={channel.href} href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined} className="contact-channel inline-flex min-h-11 items-center gap-3 rounded-control px-5 py-3 text-sm font-medium transition-colors motion-reduce:transition-none">
            {channel.label}<ArrowUpRightIcon className="size-4" />
          </a>
        ))}
      </div>
    </HomeSection>
  );
}
