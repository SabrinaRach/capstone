import { useI18n } from "@/lib/i18n/I18nContext";

export default function NewEntryButton({onClick}) {
  const { t } = useI18n();

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={t("nav.newEntry")}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-700 shadow-sm transition hover:bg-secondary-500 hover:text-background"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>


    </>
  );
}
