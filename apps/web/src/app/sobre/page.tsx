import { PageIntro } from "@/components/layout/PageIntro";

export default function SobrePage() {
  return (
    <main className="flex flex-1 px-6 py-16">
      <PageIntro
        eyebrow="Trajetória profissional"
        title="Sobre"
        description="Conheça minha trajetória, experiências, formação e objetivos na área de desenvolvimento de software."
      />
    </main>
  );
}
