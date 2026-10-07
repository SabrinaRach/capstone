import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function LegalLinks({ className = "" }) {
  const { t } = useI18n();

  return (
    <nav
      aria-label={t("legal.navigationLabel")}
      className={`flex justify-center gap-4 text-xs text-secondary-500 ${className}`}
    >
      <Link href="/privacy" className="underline hover:text-primary-700">
        {t("legal.privacyPolicy")}
      </Link>
      <Link href="/imprint" className="underline hover:text-primary-700">
        {t("legal.imprint")}
      </Link>
    </nav>
  );
}
