import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import MenuButton from "./MenuButton";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  THEMES,
  getServerThemeSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeToThemeChanges,
} from "@/lib/theme";

const THEME_ICONS = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export default function ThemeSwitcher() {
  const { t } = useI18n();
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const CurrentIcon = THEME_ICONS[theme];

  return (
    <MenuButton
      label={t("themeSwitcher.labelWithCurrent", {
        theme: t(`themeSwitcher.${theme}`),
      })}
      menuLabel={t("themeSwitcher.label")}
      options={THEMES.map((option) => ({
        value: option,
        label: t(`themeSwitcher.${option}`),
        icon: THEME_ICONS[option],
      }))}
      value={theme}
      onSelect={setTheme}
      buttonClassName="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/40 bg-background/80 text-primary-500 shadow-lg backdrop-blur-md transition hover:bg-primary-500/10 hover:shadow-[0_0_20px_rgba(2,132,199,0.2)] active:scale-95"
      buttonContent={
        <CurrentIcon size={20} strokeWidth={1.8} aria-hidden="true" />
      }
    />
  );
}
