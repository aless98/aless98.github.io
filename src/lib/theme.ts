export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

/**
 * Runs in <head> before first paint.
 *
 * Two jobs. It resolves the theme and sets the class on <html> synchronously,
 * so a dark-mode visitor never sees a white flash. And it marks the document
 * as JavaScript-capable, which is what gates the scroll-reveal CSS: without
 * that flag the reveal styles never apply, so a visitor with JS disabled sees
 * all content rather than a page of permanently invisible sections.
 *
 * Kept as a string because it must be inlined, not bundled and fetched.
 */
export const themeInitScript = `
(function () {
  try {
    document.documentElement.classList.add('js');
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {
    /* Private mode can throw on localStorage; the light default is fine. */
  }
})();
`.trim()

/** Reads the theme currently applied to the document. */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Applies a theme and remembers the choice. */
export function setTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* Not persisting is acceptable; the page still switches. */
  }
}
