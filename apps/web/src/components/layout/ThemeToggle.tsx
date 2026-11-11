"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { PUBLIC_THEME_EVENT, PUBLIC_THEME_STORAGE_KEY } from "./public-theme";

type Theme = "light" | "dark";
let preference: Theme | null | undefined;

function readPreference(): Theme | null {
  if (preference !== undefined) return preference;
  try {
    const saved = localStorage.getItem(PUBLIC_THEME_STORAGE_KEY);
    preference = saved === "light" || saved === "dark" ? saved : null;
  } catch {
    preference = null;
  }
  return preference;
}

function getTheme(): Theme {
  const shell = document.querySelector<HTMLElement>(".public-site");
  return shell?.dataset.publicTheme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const shell = document.querySelector<HTMLElement>(".public-site");
  if (shell) shell.dataset.publicTheme = theme;
  window.dispatchEvent(new Event(PUBLIC_THEME_EVENT));
}

function subscribe(onChange: () => void) {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const synchronize = () => applyTheme(readPreference() ?? (system.matches ? "dark" : "light"));
  const onStorage = (event: StorageEvent) => {
    if (event.key !== PUBLIC_THEME_STORAGE_KEY && event.key !== null) return;
    preference = undefined;
    synchronize();
  };

  window.addEventListener(PUBLIC_THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  system.addEventListener("change", synchronize);
  synchronize();

  return () => {
    window.removeEventListener(PUBLIC_THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    system.removeEventListener("change", synchronize);
  };
}

function getServerTheme(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === "dark";

  function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    preference = next;
    try {
      localStorage.setItem(PUBLIC_THEME_STORAGE_KEY, next);
    } catch {
      // Switching still works when the browser blocks persistent storage.
    }
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Tema escuro"
      aria-pressed={isDark}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="public-theme-toggle inline-flex min-h-11 min-w-24 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
    >
      <span className="public-theme-light inline-flex items-center gap-2"><SunIcon />Claro</span>
      <span className="public-theme-dark inline-flex items-center gap-2"><MoonIcon />Dark</span>
    </button>
  );
}
