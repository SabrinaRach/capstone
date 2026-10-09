import MenuButton from "./MenuButton";
import { useI18n } from "@/lib/i18n/I18nContext";

// Language names are shown in their own language, not translated into the
// current UI locale — the established convention for language switchers.
const LOCALE_OPTIONS = [
  { value: "de", label: "Deutsch", lang: "de" },
  { value: "en", label: "English", lang: "en" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <MenuButton
      // The accessible name includes the visible "DE"/"EN" (WCAG 2.5.3).
      label={t("languageSwitcher.labelWithCurrent", {
        locale: locale.toUpperCase(),
      })}
      menuLabel={t("languageSwitcher.label")}
      menuClassName="w-36"
      options={LOCALE_OPTIONS}
      value={locale}
      onSelect={setLocale}
      buttonClassName="flex h-10 items-center justify-center gap-1 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 text-xs font-semibold uppercase tracking-wide text-primary-700 shadow-lg backdrop-blur-md transition hover:bg-primary-500/20 hover:shadow-[0_0_20px_rgba(2,132,199,0.2)] active:scale-95"
      buttonContent={
        <>
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
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </>
      }
    />
  );
}
