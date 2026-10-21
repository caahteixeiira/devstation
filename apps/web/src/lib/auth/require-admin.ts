import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionToken } from "./session";
import { getAuthenticatedUser } from "@/services/auth.service";

export const requireAdmin = cache(async () => {
  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const user = await getAuthenticatedUser(token);

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return user;
});