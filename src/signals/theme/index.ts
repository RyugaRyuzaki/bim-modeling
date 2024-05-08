import {Theme} from "@baseTypes/Theme";
import {effect, signal} from "@preact/signals-react";

const defaultTheme = "system" as Theme;
const storageKey = "vite-ui-theme";
const initThem = () => {
  return (window.localStorage.getItem(storageKey) as Theme) || defaultTheme;
};

export const appTheme = signal<Theme>(initThem());

effect(() => {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  window.localStorage.setItem(storageKey, appTheme.value);
  if (appTheme.value === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(appTheme.value);
});
