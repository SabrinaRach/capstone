import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-secondary-100/80 bg-background/80 p-8 text-center shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-bold">{t("notFound.title")}</h1>

        <p className="mt-2 text-sm text-secondary-500">
          {t("notFound.description")}
        </p>

        <Link
          href="/entries"
          className="mt-6 inline-block rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-background transition hover:bg-primary-700"
        >
          {t("notFound.backLink")}
        </Link>
      </div>
    </main>
  );
}
