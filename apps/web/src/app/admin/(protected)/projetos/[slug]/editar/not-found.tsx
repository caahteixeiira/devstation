import Link from "next/link";

export default function EditProjectNotFound() {
  return (
    <section>
      <h1 className="text-3xl font-semibold">Projeto não encontrado</h1>

      <p className="mt-4 text-foreground-muted">
        O projeto solicitado não está disponível para edição.
      </p>

      <Link
        href="/admin/projetos"
        className="mt-6 inline-block text-primary-strong hover:underline"
      >
        ← Voltar aos projetos
      </Link>
    </section>
  );
}
