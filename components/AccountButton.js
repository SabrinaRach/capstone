import Link from "next/link";
import { useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AccountButton() {
  const { data: session } = useSession();
  const { t } = useI18n();

  if (!session) {
    return null;
  }

  return (
    <Link
      href="/account"
      aria-label={t("account.label")}
      title={t("account.label")}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/40 bg-background/80 text-primary-500 shadow-lg backdrop-blur-md transition hover:bg-primary-500/10 hover:shadow-[0_0_20px_rgba(2,132,199,0.2)] active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </Link>
  );
}
