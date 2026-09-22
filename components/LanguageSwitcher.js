import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

// Language names are shown in their own language, not translated into the
// current UI locale — the established convention for language switchers.
const LOCALE_OPTIONS = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={t("languageSwitcher.label")}
        title={t("languageSwitcher.label")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-10 items-center justify-center gap-1 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 text-xs font-semibold uppercase tracking-wide text-primary-700 shadow-lg backdrop-blur-md transition hover:bg-primary-500/20 hover:shadow-[0_0_20px_rgba(2,132,199,0.2)] active:scale-95"
      >
        {locale}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t("languageSwitcher.label")}
          className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-secondary-100/80 bg-background/95 shadow-lg backdrop-blur-md"
        >
          {LOCALE_OPTIONS.map((option) => (
            <li key={option.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={locale === option.code}
                onClick={() => {
                  setLocale(option.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-primary-500/10 ${
                  locale === option.code
                    ? "font-semibold text-primary-500"
                    : "text-foreground"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
