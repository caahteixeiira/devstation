"use client";

import { useSyncExternalStore } from "react";
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
    <button type="button" onClick={toggleTheme} aria-label="Tema escuro" aria-pressed={isDark} title={label} className="theme-switch relative inline-flex h-11 w-20 shrink-0 cursor-pointer items-center rounded-full border border-border-input bg-surface-muted p-1 text-foreground transition-colors hover:border-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none">
      <span aria-hidden="true" className="theme-switch-thumb flex size-8 items-center justify-center rounded-full bg-background text-primary-strong shadow-sm">
        <SunIcon className="admin-theme-light" />
        <MoonIcon className="admin-theme-dark" />
      </span>
    </button>
  );
}
