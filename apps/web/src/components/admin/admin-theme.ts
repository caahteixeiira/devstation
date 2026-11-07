export const ADMIN_THEME_STORAGE_KEY = "devstation-admin-theme";
export const ADMIN_THEME_EVENT = "devstation-admin-theme-change";

// Apply the saved Admin preference before painting, independently of the public site.
export const ADMIN_THEME_BOOTSTRAP = `(() => {
  const shell = document.currentScript.closest('.admin-site');
  if (!shell) return;
  let theme;
  try { theme = localStorage.getItem('${ADMIN_THEME_STORAGE_KEY}'); } catch {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  shell.dataset.adminTheme = theme;
})();`;
