import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const isHome = router.pathname === "/";

  return (
    <div className="pb-20">
      <Component {...pageProps} />
      {!isHome && <Navigation />}
    </div>
  );
}
