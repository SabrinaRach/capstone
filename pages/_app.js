import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import LogoutButton from "@/components/LogoutButton";
import AccountButton from "@/components/AccountButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SessionProvider } from "next-auth/react";
import EntryModal from "../components/EntryModal";
import { I18nProvider, useI18n } from "@/lib/i18n/I18nContext";

function AppShell({ Component, pageProps }) {
  const router = useRouter();
  const { t } = useI18n();

  const isHome = router.pathname === "/";

  const [toastMessageKey, setToastMessageKey] = useState(null);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      const messageKey =
        sessionStorage.getItem("accountDeleted") === "true"
          ? "toast.accountDeleted"
          : sessionStorage.getItem("loggedOut") === "true"
            ? "toast.loggedOut"
            : null;

      if (messageKey) {
        sessionStorage.removeItem("accountDeleted");
        sessionStorage.removeItem("loggedOut");
        setToastMessageKey(messageKey);

        setTimeout(() => {
          setToastMessageKey(null);
        }, 3000);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {toastMessageKey && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-primary-500/40 bg-background/95 px-5 py-3 text-sm font-medium text-primary-700 shadow-lg backdrop-blur-md">
          {t(toastMessageKey)}
        </div>
      )}

      <div className="fixed right-5 top-5 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        {!isHome && <AccountButton />}
        {!isHome && <LogoutButton />}
      </div>

      <div className="pb-24">
        <Component {...pageProps} />
        {!isHome && <Navigation onNewEntry={() => setIsEntryModalOpen(true)} />}
        {isEntryModalOpen && (
          <EntryModal onClose={() => setIsEntryModalOpen(false)} />
        )}
      </div>
    </>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <I18nProvider>
        <AppShell Component={Component} pageProps={pageProps} />
      </I18nProvider>
    </SessionProvider>
  );
}
