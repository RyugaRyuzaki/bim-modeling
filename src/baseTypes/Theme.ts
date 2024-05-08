export type Theme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  defaultTheme?: Theme;
  storageKey?: string;
};
