import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logoutAction } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/admin" className="text-xl font-semibold">
            DevStation Admin
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-foreground-muted">
              {user.name}
            </span>

            <Link
              href="/"
              className="text-sm text-primary-strong hover:underline"
            >
              Ver portfólio
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-border px-4 py-2 text-sm transition hover:border-primary-strong"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}