import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-primary-strong focus:ring-offset-2 focus:ring-offset-background"
      >
        Pular para o conteúdo
      </a>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        {/* Único landmark principal das páginas públicas. */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 flex-col outline-none"
        >
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
