import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AdminShell userName={user.name} logout={<form action={logoutAction}><Button type="submit" variant="ghost" size="sm">Sair</Button></form>}>
      {children}
    </AdminShell>
  );
}
