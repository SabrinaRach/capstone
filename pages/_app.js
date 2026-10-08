import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import LogoutButton from "@/components/LogoutButton";
import AccountButton from "@/components/AccountButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LegalLinks from "@/components/LegalLinks";
import { SessionProvider, useSession } from "next-auth/react";
import EntryModal from "../components/EntryModal";
import { I18nProvider, useI18n } from "@/lib/i18n/I18nContext";
import { markInAppNavigation } from "@/lib/navigationHistory";

function AppShell({ Component, pageProps }) {
  const router = useRouter();
  const { t } = useI18n();

  const { status } = useSession();

  const isHome = router.pathname === "/";
  // The legal pages are public; the app navigation is only useful once
  // signed in.
  const isLegalPage = ["/privacy", "/imprint"].includes(router.pathname);
  const showNavigation =
    !isHome && !(isLegalPage && status === "unauthenticated");

  const [toastMessageKey, setToastMessageKey] = useState(null);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      markInAppNavigation();

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

      {/* On desktop these controls are part of the top navigation. */}
      <div
        className={`fixed right-5 top-5 z-50 flex items-center gap-2 ${
          showNavigation ? "lg:hidden" : ""
        }`}
      >
        <ThemeSwitcher />
        <LanguageSwitcher />
        {!isHome && <AccountButton />}
        {!isHome && <LogoutButton />}
      </div>

      <div className={showNavigation ? "pb-24 lg:pb-0 lg:pt-16" : "pb-24"}>
        <Component {...pageProps} />
        {!isHome && <LegalLinks className="pb-6" />}
        {showNavigation && (
          <Navigation onNewEntry={() => setIsEntryModalOpen(true)} />
        )}
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
