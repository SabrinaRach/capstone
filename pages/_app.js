import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps: { session, ...pageProps }, }) {
  const router = useRouter();

  const isHome = router.pathname === "/";

  return (
    <SessionProvider session={session}>
    <div className="pb-20">
      <Component {...pageProps} />
      {!isHome && <Navigation />}
    </div>
    </SessionProvider>
  );
}
