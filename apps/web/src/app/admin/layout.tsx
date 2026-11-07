import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import "./admin.css";
import { ADMIN_THEME_BOOTSTRAP } from "@/components/admin/admin-theme";

const adminSans = DM_Sans({ variable: "--font-admin-sans", subsets: ["latin"], display: "swap" });

// Login and protected routes are siblings: this is their shared visual scope.
// Authorization and robots metadata remain in the existing route layouts/pages.
export default function AdminVisualLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`admin-site ${adminSans.variable}`} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: ADMIN_THEME_BOOTSTRAP }} />
      {children}
    </div>
  );
}
