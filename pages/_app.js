import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BottomNavigation, TopNavigation } from "../components/Navigation";
import { MotionConfig } from "motion/react";
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

  const openEntryModal = () => setIsEntryModalOpen(true);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:font-medium focus:shadow-lg"
      >
        {t("a11y.skipToContent")}
      </a>

      {/* The live region stays in the DOM so screen readers announce the
          message when it appears. */}
      <div
        role="status"
        className={
          toastMessageKey
            ? "fixed right-6 top-6 z-50 rounded-xl border border-primary-500/40 bg-background/95 px-5 py-3 text-sm font-medium text-primary-700 shadow-lg backdrop-blur-md"
            : "sr-only"
        }
      >
        {toastMessageKey ? t(toastMessageKey) : ""}
      </div>

      {/* On desktop these controls are part of the top navigation. */}
      <header
        aria-label={t("a11y.settingsAndAccount")}
        className={`fixed right-5 top-5 z-50 flex items-center gap-2 ${
          showNavigation ? "lg:hidden" : ""
        }`}
      >
        <ThemeSwitcher />
        <LanguageSwitcher />
        {!isHome && <AccountButton />}
        {!isHome && <LogoutButton />}
      </header>

      {showNavigation && <TopNavigation onNewEntry={openEntryModal} />}

      <div className={showNavigation ? "pb-24 lg:pb-0 lg:pt-16" : "pb-24"}>
        <div id="main-content" tabIndex={-1} className="outline-none">
          <Component {...pageProps} />
        </div>
        {!isHome && (
          <footer>
            <LegalLinks className="pb-6" />
          </footer>
        )}
        {showNavigation && <BottomNavigation onNewEntry={openEntryModal} />}
        {isEntryModalOpen && (
          <EntryModal onClose={() => setIsEntryModalOpen(false)} />
        )}
      </div>
    </MotionConfig>
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
