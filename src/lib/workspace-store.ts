import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "tethra.workspace.token";
const THEME_KEY = "tethra.theme";

export type ThemeChoice = "light" | "dark" | "system";

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function writeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

/** Reads the workspace key after hydration so SSR and client markup agree. */
export function useWorkspaceToken() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(readToken());
    setReady(true);
  }, []);

  const save = useCallback((value: string) => {
    writeToken(value);
    setToken(value);
  }, []);

  const reset = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  return { token, ready, save, reset };
}

export function applyTheme(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = choice === "dark" || (choice === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
  window.localStorage.setItem(THEME_KEY, choice);
}

export function readTheme(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  return (window.localStorage.getItem(THEME_KEY) as ThemeChoice | null) ?? "system";
}

/** Applies the stored theme once the app has hydrated. */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeChoice>("system");

  useEffect(() => {
    const stored = readTheme();
    setThemeState(stored);
    applyTheme(stored);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(readTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((choice: ThemeChoice) => {
    setThemeState(choice);
    applyTheme(choice);
  }, []);

  return { theme, setTheme };
}
