export const PUBLIC_THEME_STORAGE_KEY = "devstation-public-theme";
export const PUBLIC_THEME_EVENT = "devstation-public-theme-change";

// Runs inside the public shell before its content is painted. The Admin
// never receives a theme attribute or changes to its root design tokens.
export const PUBLIC_THEME_BOOTSTRAP = `(() => {
  const shell = document.currentScript.closest('.public-site');
  if (!shell) return;
  let theme;
  try { theme = localStorage.getItem('${PUBLIC_THEME_STORAGE_KEY}'); } catch {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  shell.dataset.publicTheme = theme;
})();`;
