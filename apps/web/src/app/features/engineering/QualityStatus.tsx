import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MaturityBadge, type Maturity } from "./MaturityBadge";

type StatusItem = {
  name: string;
  description: string;
  maturity: Maturity;
};

type StatusGroup = {
  label: string;
  title: string;
  items: StatusItem[];
};

/** Leitura de maturidade, não lista de problemas. Fatos verificados no repositório. */
const groups: StatusGroup[] = [
  {
    label: "Qualidade",
    title: "Análise estática e testes",
    items: [
      {
        name: "Lint",
        description:
          "Configurado no web com ESLint. A API ainda não tem script de lint.",
        maturity: "partial",
      },
      {
        name: "Testes unitários",
        description:
          "Validarão funções, regras de negócio e outros comportamentos pequenos sem depender do restante do sistema.",
        maturity: "planned",
      },
      {
        name: "Testes de integração",
        description:
          "Verificarão se componentes, serviços, rotas e banco de dados funcionam corretamente em conjunto.",
        maturity: "planned",
      },
      {
        name: "Testes end-to-end",
        description:
          "Simularão no navegador os fluxos mais importantes do DevStation, da navegação à conclusão de uma ação.",
        maturity: "planned",
      },
    ],
  },
  {
    label: "Observabilidade",
    title: "Entendendo o comportamento do sistema",
    items: [
      {
        name: "Logs",
        description:
          "Logger estruturado do Fastify em cada requisição e handler central de erros na API.",
        maturity: "implemented",
      },
      {
        name: "Métricas",
        description:
          "Acompanharão quantidade de acessos, tempo de resposta, taxa de erros e desempenho das principais operações.",
        maturity: "planned",
      },
      {
        name: "Monitoramento de erros",
        description:
          "Permitirá identificar exceções, reunir informações para diagnóstico e entender quais fluxos foram afetados.",
        maturity: "planned",
      },
    ],
  },
];

export function QualityStatus() {
  return (
    <section aria-labelledby="quality-title">
      <SectionHeader
        id="quality-title"
        eyebrow="Maturidade"
        title="Qualidade e observabilidade"
        description="O que já está em uso e o que ainda vai entrar. Cada verificação tem uma responsabilidade específica, das regras isoladas aos fluxos completos."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.label} padding="none" className="overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-strong">
                {group.label}
              </p>

              <h3 className="mt-1 font-semibold text-foreground">
                {group.title}
              </h3>
            </div>

            <ul className="divide-y divide-border">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-start">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <MaturityBadge maturity={item.maturity} />
                  </div>

                  <p className="text-sm leading-6 text-foreground-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
