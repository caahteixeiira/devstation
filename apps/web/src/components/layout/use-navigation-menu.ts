"use client";

import { useEffect, useRef, useState } from "react";

/** Shared dismissal/navigation behavior. Modal focus is only used by drawers. */
export function useNavigationMenu({ modal = false } = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const focusable = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
    ) ?? []);

    if (modal) {
      document.body.style.overflow = "hidden";
      (focusable()[0] ?? panelRef.current)?.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (modal) event.preventDefault();
        setIsMenuOpen(false);
        requestAnimationFrame(() => buttonRef.current?.focus());
      }
      if (modal && event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements.at(-1);
        if (!first || !last) {
          event.preventDefault();
          panelRef.current?.focus();
        } else if (event.shiftKey && (document.activeElement === first || !panelRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setIsMenuOpen(false);
      if (modal) requestAnimationFrame(() => buttonRef.current?.focus());
    }

    function handleResize() {
      if (modal && desktop.matches) setIsMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    desktop.addEventListener("change", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      desktop.removeEventListener("change", handleResize);
      if (modal) document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen, modal]);

  return { isMenuOpen, setIsMenuOpen, buttonRef, panelRef, closeMenu: () => setIsMenuOpen(false) };
}
