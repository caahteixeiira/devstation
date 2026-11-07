import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login administrativo",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="admin-login">
      <section
        aria-labelledby="login-title"
        className="admin-login-card"
      >
        <p className="font-mono text-sm uppercase tracking-widest text-primary-strong">
          DevStation
        </p>

        <h1
          id="login-title"
          className="mt-4 text-3xl font-semibold"
        >
          Acesso administrativo
        </h1>

        <p className="mt-4 leading-7 text-foreground-muted">
          Entre para gerenciar o conteúdo do portfólio.
        </p>

        <LoginForm />

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-primary-strong hover:underline"
        >
          ← Voltar ao portfólio
        </Link>
      </section>
    </main>
  );
}