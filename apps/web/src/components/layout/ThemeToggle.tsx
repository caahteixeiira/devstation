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
      className="theme-switch public-theme-toggle relative inline-flex h-11 w-20 shrink-0 cursor-pointer items-center rounded-full border border-border-input bg-surface-muted p-1 text-foreground transition-colors hover:border-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
    >
      <span aria-hidden="true" className="theme-switch-thumb flex size-8 items-center justify-center rounded-full bg-background text-primary-strong shadow-sm">
        <SunIcon className="public-theme-light" />
        <MoonIcon className="public-theme-dark" />
      </span>
    </button>
  );
}
