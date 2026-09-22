import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "@/lib/i18n/I18nContext";

const ERROR_KEYS = {
  Verification: "verification",
  AccessDenied: "accessDenied",
  Configuration: "configuration",
  Default: "default",
};

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;
  const { t } = useI18n();

  const messageKey =
    (typeof error === "string" && ERROR_KEYS[error]) || ERROR_KEYS.Default;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-secondary-100/80 bg-background/80 p-8 text-center shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-bold">{t("authError.title")}</h1>

        <p className="mt-2 text-sm text-secondary-500">
          {t(`authError.${messageKey}`)}
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-background transition hover:bg-primary-700"
        >
          {t("authError.backToLogin")}
        </Link>
      </div>
    </main>
  );
}
