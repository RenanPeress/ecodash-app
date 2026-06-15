export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "ecodash-theme";

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

export function applyThemeToDOM(mode: ThemeMode): "light" | "dark" {
  const resolved = resolveTheme(mode);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}

export function getStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function setStoredTheme(mode: ThemeMode): void {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
}

/** Executado antes do React montar — evita flash de tema errado */
export function initThemeFromStorage(): ThemeMode {
  const mode = getStoredTheme();
  applyThemeToDOM(mode);
  return mode;
}
