import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import LogoutButton from "@/components/LogoutButton";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  const isHome = router.pathname === "/";

  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    if (router.query.loggedOut === "true") {
      setShowLogoutToast(true);

      const timer = setTimeout(() => {
        setShowLogoutToast(false);
        router.replace("/", undefined, { shallow: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router.query.loggedOut]);

  return (
    <SessionProvider session={session}>
      {showLogoutToast && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-primary-500/40 bg-background/95 px-5 py-3 text-sm font-medium text-primary-700 shadow-lg backdrop-blur-md">
          ✓ Successfully logged out
        </div>
      )}

      <div className="pb-20">
        {!isHome && <LogoutButton />}
        <Component {...pageProps} />
        {!isHome && <Navigation />}
      </div>
    </SessionProvider>
  );
}
