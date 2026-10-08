import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const CurrentIcon = THEME_ICONS[theme];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={t("themeSwitcher.label")}
        title={t("themeSwitcher.label")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/40 bg-background/80 text-primary-500 shadow-lg backdrop-blur-md transition hover:bg-primary-500/10 hover:shadow-[0_0_20px_rgba(2,132,199,0.2)] active:scale-95"
      >
        <CurrentIcon size={20} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t("themeSwitcher.label")}
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-secondary-100/80 bg-background/95 shadow-lg backdrop-blur-md"
        >
          {THEMES.map((option) => {
            const Icon = THEME_ICONS[option];

            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={theme === option}
                  onClick={() => {
                    setTheme(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-primary-500/10 ${
                    theme === option
                      ? "font-semibold text-primary-500"
                      : "text-foreground"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                  {t(`themeSwitcher.${option}`)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
