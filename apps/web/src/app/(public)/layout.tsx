import type { ReactNode } from "react";
import { DM_Sans, Fraunces } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./public.css";
import { Footer } from "@/components/layout/Footer";
import { PUBLIC_THEME_BOOTSTRAP } from "@/components/layout/public-theme";

const publicSans = DM_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const publicSerif = Fraunces({
  variable: "--font-public-serif",
  subsets: ["latin"],
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`public-site ${publicSans.variable} ${publicSerif.variable} flex min-h-screen flex-col`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: PUBLIC_THEME_BOOTSTRAP }} />
      <a
        href="#main-content"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-primary-strong focus:ring-offset-2 focus:ring-offset-background"
      >
        Pular para o conteúdo
      </a>

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
