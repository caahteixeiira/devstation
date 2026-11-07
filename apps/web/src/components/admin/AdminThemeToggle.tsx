"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { ADMIN_THEME_EVENT, ADMIN_THEME_STORAGE_KEY } from "./admin-theme";

type Theme = "light" | "dark";
let preference: Theme | null | undefined;

function readPreference(): Theme | null {
  if (preference !== undefined) return preference;
  try {
    const saved = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
    preference = saved === "light" || saved === "dark" ? saved : null;
  } catch {
    preference = null;
  }
  return preference;
}

function getTheme(): Theme {
  return document.querySelector<HTMLElement>(".admin-site")?.dataset.adminTheme === "dark"
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const shell = document.querySelector<HTMLElement>(".admin-site");
  if (shell) shell.dataset.adminTheme = theme;
  window.dispatchEvent(new Event(ADMIN_THEME_EVENT));
}

function subscribe(onChange: () => void) {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const synchronize = () => applyTheme(readPreference() ?? (system.matches ? "dark" : "light"));
  const onStorage = (event: StorageEvent) => {
    if (event.key !== ADMIN_THEME_STORAGE_KEY && event.key !== null) return;
    preference = undefined;
    synchronize();
  };
  window.addEventListener(ADMIN_THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  system.addEventListener("change", synchronize);
  synchronize();
  return () => {
    window.removeEventListener(ADMIN_THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    system.removeEventListener("change", synchronize);
  };
}

function getServerTheme(): Theme {
  return "light";
}

export function AdminThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === "dark";
  const label = isDark ? "Ativar modo claro" : "Ativar modo escuro";

  function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    preference = next;
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, next);
    } catch {
      // Keep switching available when persistent storage is blocked.
    }
    applyTheme(next);
  }

  return (
    <Button variant="secondary" onClick={toggleTheme} aria-label={label} title={label} className="min-w-11 shrink-0 px-3">
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span className="hidden xl:inline">{isDark ? "Claro" : "Escuro"}</span>
    </Button>
  );
}
