import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import { siteConfig } from "@/config/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
  MailIcon,
  UserIcon,
} from "@/components/ui/icons";

type Channel = {
  label: string;
  description: string;
  href: string;
  handle: string;
  external: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** Canais vêm só de `site.ts`; valores nulos ficam de fora, sem placeholder. */
function buildChannels(): Channel[] {
  const { github, linkedin, email } = siteConfig.links;
  const channels: Channel[] = [
    {
      label: "GitHub",
      description: "Projetos, experimentos e código.",
      href: github,
      handle: github.replace(/^https?:\/\//, ""),
      external: true,
      icon: CodeIcon,
    },
  ];

  if (linkedin) {
    channels.push({
      label: "LinkedIn",
      description: "Experiência profissional e conexões.",
      href: linkedin,
      handle: linkedin.replace(/^https?:\/\//, ""),
      external: true,
      icon: UserIcon,
    });
  }

  if (email) {
    channels.push({
      label: "E-mail",
      description: "Fale diretamente comigo.",
      href: `mailto:${email}`,
      handle: email,
      external: false,
      icon: MailIcon,
    });
  }

  return channels;
}

const channelLinkStyles =
  "group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-strong motion-reduce:transition-none";

export const metadata: Metadata = {
  title: "Contato",
  description: "Canais para conversar sobre desenvolvimento de software, oportunidades e conexões.",
};

export default function ContatoPage() {
  const channels = buildChannels();

  return (
    <PageIntro
      width="narrow"
      eyebrow="Contato"
      title="Vamos conversar?"
      description="Estou aberta a conexões, oportunidades e conversas sobre desenvolvimento de software e tecnologia."
    >
      <Card padding="none" className="mt-10 overflow-hidden">
        <ul className="divide-y divide-border">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const Arrow = channel.external ? ArrowUpRightIcon : ArrowRightIcon;

            return (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className={channelLinkStyles}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary-strong">
                    <Icon className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">
                      {channel.label}
                    </span>

                    <span className="block text-sm leading-6 text-foreground-muted">
                      {channel.description}
                    </span>
                  </span>

                  <span className="hidden truncate font-mono text-xs text-foreground-subtle sm:block">
                    {channel.handle}
                  </span>

                  <Arrow className="size-4 shrink-0 text-foreground-subtle transition-colors group-hover:text-primary-strong motion-reduce:transition-none" />
                </a>
              </li>
            );
          })}
        </ul>
      </Card>
    </PageIntro>
  );
}
