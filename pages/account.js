import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getSessionSafe } from "../lib/apiError.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import PageTitle from "@/components/PageTitle";

export default function AccountPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const deleteButtonRef = useRef(null);
  const returnFocusRef = useRef(false);

  // Back to the "delete account" button when the confirmation is cancelled.
  useEffect(() => {
    if (!showDeleteConfirmation && returnFocusRef.current) {
      deleteButtonRef.current?.focus();
      returnFocusRef.current = false;
    }
  }, [showDeleteConfirmation]);

  async function handleDeleteAccount() {
    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch("/api/user", { method: "DELETE" });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setError(
          result.code
            ? t(`apiErrors.${result.code}`)
            : t("accountPage.deleteFailed"),
        );
        setIsDeleting(false);
        return;
      }

      sessionStorage.setItem("accountDeleted", "true");
      await signOut({ redirect: false });
      router.push("/");
    } catch {
      setError(t("common.genericError"));
      setIsDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-10 pt-20 sm:pt-10">
      <PageTitle title={t("accountPage.title")} />

      <h1 className="text-3xl font-bold">{t("accountPage.title")}</h1>

      <p className="mt-2 text-secondary-700">{t("accountPage.subtitle")}</p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-accent-500/40 bg-background px-4 py-3 text-sm text-accent-500"
        >
          {error}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-secondary-100 bg-background p-5">
        <h2 className="text-lg font-semibold">
          {t("accountPage.exportTitle")}
        </h2>

        <p className="mt-1 text-sm text-secondary-500">
          {t("accountPage.exportDescription")}
        </p>

        <a
          href="/api/user/export"
          download
          className="mt-4 inline-block rounded-full border border-secondary-100 px-5 py-2.5 text-sm font-medium transition hover:bg-secondary-100"
        >
          {t("accountPage.exportButton")}
        </a>
      </section>

      <section className="mt-6 rounded-xl border border-accent-500/40 bg-background p-5">
        <h2 className="text-lg font-semibold text-accent-500">
          {t("accountPage.deleteTitle")}
        </h2>

        <p className="mt-1 text-sm text-secondary-500">
          {t("accountPage.deleteDescription")}
        </p>

        {!showDeleteConfirmation ? (
          <button
            ref={deleteButtonRef}
            type="button"
            onClick={() => setShowDeleteConfirmation(true)}
            className="mt-4 rounded-full border border-accent-500/40 px-5 py-2.5 text-sm font-medium text-accent-500 transition hover:bg-accent-500/10"
          >
            {t("accountPage.deleteButton")}
          </button>
        ) : (
          <div
            role="group"
            aria-labelledby="delete-account-confirm"
            className="mt-4 rounded-lg border border-accent-500/40 bg-background p-4"
          >
            <p
              id="delete-account-confirm"
              className="text-sm font-medium text-accent-500"
            >
              {t("accountPage.deleteConfirm")}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? t("accountPage.deleting")
                  : t("accountPage.deleteConfirmButton")}
              </button>

              <button
                type="button"
                // Focus lands on the safe choice when the question appears.
                autoFocus
                onClick={() => {
                  returnFocusRef.current = true;
                  setShowDeleteConfirmation(false);
                }}
                disabled={isDeleting}
                className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-background transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getSessionSafe(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
